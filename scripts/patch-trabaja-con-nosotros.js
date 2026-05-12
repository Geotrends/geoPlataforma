/**
 * Navbar link + footer column + footer nav link (idempotent).
 * Run: node scripts/patch-trabaja-con-nosotros.js
 */
const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, '..', 'public', 'html');

function walkHtmlFiles(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith('.')) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory() && name === 'en') {
      out.push(...walkHtmlFiles(p));
    } else if (st.isFile() && name.endsWith('.html') && !name.startsWith('google')) {
      out.push(p);
    }
  }
  return out;
}

const FOOTER_BLOCK_ES = `                <div class="footer-col">
                    <h4 class="footer-col-title">Trabaja con nosotros</h4>
                    <p class="footer-hours-text">Buscamos talento en acústica, datos e ingeniería. Envíanos tu perfil.</p>
                    <a href="trabaja-con-nosotros.html" class="footer-map-link">Conocer más</a>
                </div>
`;

const FOOTER_BLOCK_EN = `                <div class="footer-col">
                    <h4 class="footer-col-title">Work with us</h4>
                    <p class="footer-hours-text">We hire talent in acoustics, data, and engineering. Send us your profile.</p>
                    <a href="trabaja-con-nosotros.html" class="footer-map-link">Learn more</a>
                </div>
`;

function patchFile(filePath) {
  const isEn = filePath.includes(`${path.sep}en${path.sep}`);
  let s = fs.readFileSync(filePath, 'utf8');
  const orig = s;

  const navLabel = isEn ? 'Work with us' : 'Trabaja con nosotros';
  const navInsert = `\n                <li><a href="trabaja-con-nosotros.html">${navLabel}</a></li>`;

  // Footer list (24 spaces before <li>) — antes que navbar para no falsear con href ya presente
  if (isEn) {
    s = s.replace(
      /(                        <li><a href="nosotros\.html">About<\/a><\/li>)(\s*<li><a href="blog\.html">Blog<\/a><\/li>)/g,
      (m, a, b) =>
        m.includes('trabaja-con-nosotros')
          ? m
          : `${a}\n                        <li><a href="trabaja-con-nosotros.html">Work with us</a></li>${b}`
    );
  } else {
    s = s.replace(
      /(                        <li><a href="nosotros\.html">Nosotros<\/a><\/li>)(\s*<li><a href="blog\.html">Blog<\/a><\/li>)/g,
      (m, a, b) =>
        m.includes('trabaja-con-nosotros')
          ? m
          : `${a}\n                        <li><a href="trabaja-con-nosotros.html">Trabaja con nosotros</a></li>${b}`
    );
  }

  // Navbar (16 spaces)
  s = s.replace(
    /(                <li><a href="nosotros\.html"[^>]*>(?:Nosotros|About)<\/a><\/li>)(\s*<li><a href="blog\.html")/g,
    (m, a, b) => (m.includes('trabaja-con-nosotros') ? m : `${a}${navInsert}${b}`)
  );

  const ubicacionBlock = `                <div class="footer-col">
                    <h4 class="footer-col-title">${isEn ? 'Location' : 'Ubicación'}</h4>`;
  const footerColMarker = isEn ? 'footer-col-title">Work with us<' : 'footer-col-title">Trabaja con nosotros<';
  if (s.includes(ubicacionBlock) && !s.includes(footerColMarker)) {
    s = s.replace(ubicacionBlock, (isEn ? FOOTER_BLOCK_EN : FOOTER_BLOCK_ES) + ubicacionBlock);
  }

  const base = path.basename(filePath);
  if (base === 'trabaja-con-nosotros.html') {
    var escaped = navLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var navActiveRe = new RegExp(
      '^                <li><a href="trabaja-con-nosotros\\.html">' + escaped + '<\\/a><\\/li>',
      'm'
    );
    s = s.replace(
      navActiveRe,
      '                <li><a href="trabaja-con-nosotros.html" class="active">' + navLabel + '</a></li>'
    );
  }

  if (s !== orig) {
    fs.writeFileSync(filePath, s, 'utf8');
    console.log('Patched', path.relative(htmlDir, filePath));
  }
}

for (const f of walkHtmlFiles(htmlDir)) {
  patchFile(f);
}
