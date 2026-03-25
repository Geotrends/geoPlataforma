const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

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

/**
 * Prioridad: 1) Accept-Language si incluye español o inglés (así no quedas “atascado” en inglés
 *    por una cookie vieja site_lang=en tras visitar /en una vez).
 * 2) Cookie site_lang si el navegador no declara es ni en.
 * 3) Español por defecto.
 */
function detectPreferredLang(req) {
    const fromBrowser = browserPreferredLang(req);
    if (fromBrowser !== null) return fromBrowser;

    const cookie = getCookieValue(req, COOKIE_LANG);
    if (cookie === EN_LANG || cookie === DEFAULT_LANG) return cookie;
    return DEFAULT_LANG;
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

// Rutas EN primero (no forzar cookie aquí: el idioma lo decide Accept-Language; usar /prefer-en para fijar)
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

    // Redirección solo para humanos (no crawlers), para no mezclar canonical/hreflang.
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
const COOKIE_OPTS = { maxAge: 365 * 24 * 60 * 60 * 1000, sameSite: 'lax', path: '/' };
app.get('/prefer-es', (req, res) => {
    res.cookie(COOKIE_LANG, DEFAULT_LANG, COOKIE_OPTS);
    return res.redirect(302, '/');
});
app.get('/prefer-en', (req, res) => {
    res.cookie(COOKIE_LANG, EN_LANG, COOKIE_OPTS);
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
