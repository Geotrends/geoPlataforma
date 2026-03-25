/**
 * Añade hreflang recíproco en páginas ES y JSON-LD Organization+WebSite en todas las HTML.
 * Idempotente: no duplica si ya existe ld+json o hreflang es.
 */
const fs = require('fs');
const path = require('path');

const htmlRoot = path.join(__dirname, '..', 'public', 'html');

const JSONLD = `    <script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://es.geotrends.co/#organization","name":"Geotrends","alternateName":"GeoPlataforma","url":"https://es.geotrends.co/","logo":{"@type":"ImageObject","url":"https://es.geotrends.co/img_video/home/isologo-02.webp"},"sameAs":["https://www.linkedin.com/company/geotrends-co/","https://www.instagram.com/geotrendsco/"]},{"@type":"WebSite","@id":"https://es.geotrends.co/#website","url":"https://es.geotrends.co/","name":"Geotrends","publisher":{"@id":"https://es.geotrends.co/#organization"},"inLanguage":["es","en"]}]}</script>
`;

function enFromEsCanonical(esCanonical) {
    const u = new URL(esCanonical);
    if (u.pathname === '/' || u.pathname === '') return 'https://es.geotrends.co/en';
    return 'https://es.geotrends.co/en' + u.pathname;
}

function patchContent(s, isEsPage) {
    const canonMatch = s.match(/<link rel="canonical" href="([^"]+)">/);
    if (!canonMatch) return { s, ok: false, reason: 'no canonical' };
    const can = canonMatch[1];

    if (isEsPage && !s.includes('hreflang="es"')) {
        const esUrl = can;
        const enUrl = enFromEsCanonical(can);
        const block =
            `    <link rel="alternate" hreflang="es" href="${esUrl}">\n` +
            `    <link rel="alternate" hreflang="en" href="${enUrl}">\n` +
            `    <link rel="alternate" hreflang="x-default" href="${esUrl}">\n`;
        s = s.replace(/<link rel="canonical" href="[^"]+">\r?\n/, (m) => m + block);
    }

    if (!s.includes('application/ld+json')) {
        const m = s.match(/<meta property="og:locale" content="[^"]+">\r?\n/);
        if (!m) return { s, ok: false, reason: 'no og:locale' };
        s = s.replace(m[0], m[0] + JSONLD + '\n');
    }

    return { s, ok: true };
}

function walk(filePath, isEsPage) {
    let s = fs.readFileSync(filePath, 'utf8');
    const out = patchContent(s, isEsPage);
    if (!out.ok) {
        console.error(out.reason, filePath);
        return;
    }
    if (out.s !== s) {
        fs.writeFileSync(filePath, out.s);
        console.log('updated', filePath);
    } else {
        console.log('unchanged', filePath);
    }
}

for (const name of fs.readdirSync(htmlRoot)) {
    if (!name.endsWith('.html')) continue;
    walk(path.join(htmlRoot, name), true);
}
for (const name of fs.readdirSync(path.join(htmlRoot, 'en'))) {
    if (!name.endsWith('.html')) continue;
    walk(path.join(htmlRoot, 'en', name), false);
}
