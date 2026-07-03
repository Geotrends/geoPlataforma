require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser para el endpoint POST /api/contacto (JSON pequeño, sin archivos)
app.use(express.json({ limit: '20kb' }));

const COOKIE_LANG = 'site_lang';
const DEFAULT_LANG = 'es';
const EN_LANG = 'en';

function getCookieValue(req, name) {
    const header = req.headers.cookie || '';
    const parts = header.split(';').map(p => p.trim()).filter(Boolean);
    for (const part of parts) {
        const [k, ...v] = part.split('=');
        if (k === name) return decodeURIComponent(v.join('='));
    }
    return null;
}

function isCrawlerUA(ua) {
    const u = (ua || '').toLowerCase();
    return (
        u.includes('googlebot') ||
        u.includes('bingbot') ||
        u.includes('yandex') ||
        u.includes('baiduspider') ||
        u.includes('duckduckbot') ||
        u.includes('slurp') ||
        u.includes('facebookexternalhit') ||
        u.includes('twitterbot') ||
        u.includes('linkedinbot') ||
        u.includes('previews') ||
        u.includes('lighthouse')
    );
}

/**
 * Parsea Accept-Language y devuelve idiomas ordenados por calidad (q), respetando el orden del header cuando q es igual.
 * Evita el error de usar .includes('en'): un header como "es-CO,es;q=0.9,en;q=0.8" contiene la subcadena "en" pero el usuario prefiere español.
 */
function parseAcceptLanguageSorted(header) {
    const raw = (header || '').trim();
    if (!raw) return [];
    const entries = raw.split(',').map((part, index) => {
        const bits = part.trim().split(';').map((b) => b.trim());
        const lang = (bits[0] || '').toLowerCase();
        let q = 1;
        for (let i = 1; i < bits.length; i++) {
            const [k, v] = bits[i].split('=').map((s) => s.trim());
            if (k === 'q') {
                const n = parseFloat(v);
                if (!Number.isNaN(n)) q = n;
            }
        }
        return { lang, q, index };
    });
    return entries.sort((a, b) => {
        if (b.q !== a.q) return b.q - a.q;
        return a.index - b.index;
    });
}

/**
 * Idioma que declara el navegador (solo es / en). Si el header lista otros idiomas primero,
 * se sigue buscando hasta encontrar es o en; si no hay ninguno, null.
 */
function browserPreferredLang(req) {
    const sorted = parseAcceptLanguageSorted(req.headers['accept-language']);
    for (const { lang } of sorted) {
        const base = lang.split('-')[0];
        if (base === 'es') return DEFAULT_LANG;
        if (base === 'en') return EN_LANG;
    }
    return null;
}

/** Prioridad: 1) Cookie site_lang (solo vía /prefer-es o /prefer-en — elección explícita).
 * 2) Accept-Language si declara español o inglés.
 * 3) Español por defecto.
 *
 * No se escribe la cookie al “solo visitar” /en o /nosotros: evita mezclar idiomas y
 * que un enlace EN fije inglés para quien prefiere español hasta que elija en el menú.
 */
function detectPreferredLang(req) {
    const cookie = getCookieValue(req, COOKIE_LANG);
    if (cookie === EN_LANG || cookie === DEFAULT_LANG) return cookie;

    const fromBrowser = browserPreferredLang(req);
    if (fromBrowser !== null) return fromBrowser;

    return DEFAULT_LANG;
}

/** Redirección tras /prefer-*: solo rutas internas (/foo, /en/bar, con ?query opcional). */
function safeRedirectTarget(raw) {
    if (raw == null || typeof raw !== 'string') return null;
    let t = raw.trim();
    if (!t.startsWith('/') || t.startsWith('//')) return null;
    if (t.includes('://')) return null;
    if (/[\r\n]/.test(t)) return null;
    const q = t.indexOf('?');
    const pathPart = q === -1 ? t : t.slice(0, q);
    if (pathPart.includes('..')) return null;
    return t;
}

function getNextParam(req) {
    const n = req.query.next;
    if (Array.isArray(n)) return safeRedirectTarget(String(n[0]));
    if (typeof n === 'string') return safeRedirectTarget(n);
    return null;
}

const COOKIE_OPTS = { maxAge: 365 * 24 * 60 * 60 * 1000, sameSite: 'lax', path: '/' };

/** site_lang solo se escribe en /prefer-es y /prefer-en. El resto del sitio usa la cookie (si existe) o Accept-Language. */
/**
 * Si el usuario ya eligió idioma (cookie), la URL debe coincidir: /en/... solo con inglés;
 * sin prefijo solo español. Evita mezclar páginas EN con rutas ES por enlaces relativos.
 */
function redirectUrlToMatchLangCookie(req, res, next) {
    if (req.method !== 'GET') return next();
    const ua = req.headers['user-agent'] || '';
    if (isCrawlerUA(ua)) return next();

    const cookie = getCookieValue(req, COOKIE_LANG);
    if (cookie !== DEFAULT_LANG && cookie !== EN_LANG) return next();

    const pathOnly = req.path || '/';

    if (
        pathOnly.startsWith('/css') ||
        pathOnly.startsWith('/js') ||
        pathOnly.startsWith('/img_video') ||
        pathOnly.startsWith('/cookies') ||
        pathOnly.startsWith('/proyectos/data') ||
        pathOnly === '/favicon.ico' ||
        pathOnly === '/sitemap.xml' ||
        pathOnly === '/robots.txt' ||
        pathOnly === '/prefer-es' ||
        pathOnly === '/prefer-en'
    ) {
        return next();
    }

    let targetPath = null;
    if (cookie === DEFAULT_LANG) {
        if (pathOnly === '/en' || pathOnly === '/en/') targetPath = '/';
        else if (pathOnly.startsWith('/en/')) targetPath = pathOnly.slice('/en'.length) || '/';
    } else if (cookie === EN_LANG) {
        if (pathOnly === '/' || pathOnly === '') targetPath = '/en';
        else if (!pathOnly.startsWith('/en')) targetPath = '/en' + pathOnly;
    }

    if (targetPath != null) {
        const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
        const combined = targetPath + query;
        const safe = safeRedirectTarget(combined);
        if (safe) return res.redirect(302, safe);
    }
    next();
}

function resolvePagePath(lang, page) {
    const htmlRoot = path.join(__dirname, 'public', 'html');
    const fileName = `${page}.html`;

    if (lang === EN_LANG) {
        const enPath = path.join(htmlRoot, EN_LANG, fileName);
        if (fs.existsSync(enPath)) return enPath;
        // fallback: si aún no existe el espejo EN, servir ES
        const esPath = path.join(htmlRoot, fileName);
        if (fs.existsSync(esPath)) return esPath;
        return enPath;
    }

    return path.join(htmlRoot, fileName);
}

function sendHtmlPage(lang, page, res) {
    const filePath = resolvePagePath(lang, page);
    if (fs.existsSync(filePath)) return res.sendFile(filePath);
    return res.status(404).send('Página no encontrada');
}

// Servir archivos estáticos SOLO desde subcarpetas específicas
// Esto evita que express.static intercepte las rutas HTML
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use(
    '/img_video',
    express.static(path.join(__dirname, 'public', 'img_video'), {
        setHeaders(res, filePath) {
            if (filePath.endsWith('.mp4')) {
                res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Expires', '0');
            }
        },
    })
);
app.use('/cookies', express.static(path.join(__dirname, 'public', 'cookies')));
app.use('/proyectos/data', express.static(path.join(__dirname, 'public', 'html', 'proyectos', 'data')));

app.use(redirectUrlToMatchLangCookie);

/** Mismo ícono que theme.js (logo-geo.png); respaldo si falta el archivo principal. */
function resolveFaviconFilePath() {
    const dir = path.join(__dirname, 'public', 'img_video', 'home');
    for (const name of ['logo-geo.png', 'favicon-hero.png', 'isologo-01.png']) {
        const full = path.join(dir, name);
        if (fs.existsSync(full)) return full;
    }
    return null;
}

app.get('/favicon.ico', (req, res) => {
    const filePath = resolveFaviconFilePath();
    if (!filePath) return res.status(404).end();
    res.type('image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.sendFile(filePath);
});

// ============================================================
// API: Formulario de contacto -> envía email a CONTACT_TO
// Usa Nodemailer + SMTP (recomendado: Resend). Variables en .env
// ============================================================

/** Crea (o reutiliza) el transporte SMTP a partir de variables de entorno. */
let cachedTransporter = null;
function getTransporter() {
    if (cachedTransporter) return cachedTransporter;
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !user || !pass) return null;
    cachedTransporter = nodemailer.createTransport({
        host,
        port,
        secure: String(process.env.SMTP_SECURE || 'true') === 'true',
        auth: { user, pass },
    });
    return cachedTransporter;
}

/** Rate-limit en memoria por IP: 5 envíos cada 10 min. Mitiga abuso básico sin pegarle a DB. */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const rateMap = new Map();
function isRateLimited(ip) {
    const now = Date.now();
    const entry = rateMap.get(ip) || { count: 0, resetAt: now + RATE_WINDOW_MS };
    if (now > entry.resetAt) {
        entry.count = 0;
        entry.resetAt = now + RATE_WINDOW_MS;
    }
    entry.count += 1;
    rateMap.set(ip, entry);
    return entry.count > RATE_MAX;
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/** Email simple, válido en RFC práctico (no perfecto, pero suficiente para frontend de contacto). */
function isValidEmail(value) {
    return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

app.post('/api/contacto', async (req, res) => {
    try {
        const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown')
            .toString()
            .split(',')[0]
            .trim();

        if (isRateLimited(ip)) {
            return res.status(429).json({ ok: false, error: 'rate_limited' });
        }

        const { nombre, email, telefono, mensaje, company, lang } = req.body || {};

        // Honeypot: bots suelen rellenar el campo oculto "company". Respondemos 200 fingiendo éxito.
        if (typeof company === 'string' && company.trim() !== '') {
            return res.status(200).json({ ok: true });
        }

        const nombreTrim = (nombre || '').toString().trim();
        const emailTrim = (email || '').toString().trim();
        const telefonoTrim = (telefono || '').toString().trim();
        const mensajeTrim = (mensaje || '').toString().trim();

        if (!nombreTrim || nombreTrim.length > 120) {
            return res.status(400).json({ ok: false, error: 'invalid_nombre' });
        }
        if (!isValidEmail(emailTrim) || emailTrim.length > 200) {
            return res.status(400).json({ ok: false, error: 'invalid_email' });
        }
        if (telefonoTrim.length > 40) {
            return res.status(400).json({ ok: false, error: 'invalid_telefono' });
        }
        if (mensajeTrim.length > 5000) {
            return res.status(400).json({ ok: false, error: 'invalid_mensaje' });
        }

        const transporter = getTransporter();
        if (!transporter) {
            console.error('[contacto] SMTP no configurado: revisa .env (SMTP_HOST, SMTP_USER, SMTP_PASS)');
            return res.status(500).json({ ok: false, error: 'smtp_not_configured' });
        }

        const to = process.env.CONTACT_TO || 'info@geotrends.co';
        const from = process.env.CONTACT_FROM || `GeoPlataforma <${process.env.SMTP_USER}>`;
        const subject = (lang === 'en' ? 'New contact from website' : 'Nuevo contacto desde el sitio web')
            + ` — ${nombreTrim}`;

        const htmlBody = `
            <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#313131;">
                <h2 style="color:#39513B;margin-bottom:1rem;">${escapeHtml(lang === 'en' ? 'New contact form submission' : 'Nuevo mensaje desde el formulario de contacto')}</h2>
                <p><strong>${escapeHtml(lang === 'en' ? 'Name' : 'Nombre')}:</strong> ${escapeHtml(nombreTrim)}</p>
                <p><strong>Email:</strong> <a href="mailto:${escapeHtml(emailTrim)}">${escapeHtml(emailTrim)}</a></p>
                ${telefonoTrim ? `<p><strong>${escapeHtml(lang === 'en' ? 'Phone' : 'Teléfono')}:</strong> ${escapeHtml(telefonoTrim)}</p>` : ''}
                ${mensajeTrim ? `<p><strong>${escapeHtml(lang === 'en' ? 'Message' : 'Mensaje')}:</strong></p>
                <div style="white-space:pre-wrap;padding:12px 16px;background:#F4F0EF;border-radius:8px;">${escapeHtml(mensajeTrim)}</div>` : ''}
                <hr style="margin:2rem 0;border:none;border-top:1px solid #E4E4E4;">
                <p style="font-size:0.85rem;color:#888;">IP: ${escapeHtml(ip)} — ${new Date().toISOString()}</p>
            </div>
        `;

        const textBody = [
            lang === 'en' ? 'New contact form submission' : 'Nuevo mensaje desde el formulario de contacto',
            '',
            `${lang === 'en' ? 'Name' : 'Nombre'}: ${nombreTrim}`,
            `Email: ${emailTrim}`,
            telefonoTrim ? `${lang === 'en' ? 'Phone' : 'Teléfono'}: ${telefonoTrim}` : null,
            mensajeTrim ? `\n${lang === 'en' ? 'Message' : 'Mensaje'}:\n${mensajeTrim}` : null,
        ].filter(Boolean).join('\n');

        await transporter.sendMail({
            from,
            to,
            replyTo: `${nombreTrim} <${emailTrim}>`,
            subject,
            text: textBody,
            html: htmlBody,
        });

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('[contacto] Error enviando email:', err && err.message ? err.message : err);
        return res.status(500).json({ ok: false, error: 'send_failed' });
    }
});

// Rutas EN primero (detección de idioma: cookie site_lang > Accept-Language; ver /prefer-es, /prefer-en)
app.get('/en', (req, res) => {
    return sendHtmlPage(EN_LANG, 'index', res);
});

app.get('/en/:page.html', (req, res) => {
    const page = req.params.page;
    return sendHtmlPage(EN_LANG, page, res);
});

app.get('/en/:page', (req, res) => {
    const page = req.params.page;
    if (page === 'css' || page === 'js' || page === 'img_video' || page === 'cookies') {
        return res.status(404).send('No encontrado');
    }
    return sendHtmlPage(EN_LANG, page, res);
});

// Ruta principal - redirigir a index.html (con detección de idioma)
app.get('/', (req, res) => {
    const ua = req.headers['user-agent'] || '';
    const preferred = detectPreferredLang(req);

    if (preferred === EN_LANG && !isCrawlerUA(ua)) {
        return res.redirect(302, '/en');
    }
    return sendHtmlPage(DEFAULT_LANG, 'index', res);
});

// SEO: sitemap y robots
app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

// Fijar idioma a propósito (útil si quedó cookie vieja o quieres forzar ES/EN)
app.get('/prefer-es', (req, res) => {
    res.cookie(COOKIE_LANG, DEFAULT_LANG, COOKIE_OPTS);
    const next = getNextParam(req);
    if (next) return res.redirect(302, next);
    return res.redirect(302, '/');
});
app.get('/prefer-en', (req, res) => {
    res.cookie(COOKIE_LANG, EN_LANG, COOKIE_OPTS);
    const next = getNextParam(req);
    if (next) return res.redirect(302, next);
    return res.redirect(302, '/en');
});

// Rutas para archivos HTML con extensión (ej: /nosotros.html, /ciudades.html)
app.get('/:page.html', (req, res) => {
    const page = req.params.page;
    const ua = req.headers['user-agent'] || '';
    const preferred = detectPreferredLang(req);

    if (preferred === EN_LANG && !isCrawlerUA(ua) && page !== 'en') {
        return res.redirect(302, `/en/${page}`);
    }

    return sendHtmlPage(DEFAULT_LANG, page, res);
});

// Rutas para páginas sin extensión .html (ej: /ciudades, /nosotros)
app.get('/:page', (req, res) => {
    const page = req.params.page;

    // Excluir rutas de archivos estáticos
    if (page === 'css' || page === 'js' || page === 'img_video') {
        return res.status(404).send('No encontrado');
    }

    const ua = req.headers['user-agent'] || '';
    const preferred = detectPreferredLang(req);

    if (preferred === EN_LANG && !isCrawlerUA(ua) && page !== 'en') {
        return res.redirect(302, `/en/${page}`);
    }

    return sendHtmlPage(DEFAULT_LANG, page, res);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📁 Sirviendo archivos desde: ${path.join(__dirname, 'public')}`);
});
