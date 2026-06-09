const fs = require('fs');
const path = require('path');

const API_URL = process.env.BIXCART_API_URL;

if (!API_URL) {
  console.warn('[inject] BIXCART_API_URL not set — skipping.');
  process.exit(0);
}

const FRONTEND = path.join(__dirname, '..', 'frontend');

// Patch app.js
const appJsPath = path.join(FRONTEND, 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/const API_BASE = '[^']*';/, `const API_BASE = '${API_URL}/api';`);
fs.writeFileSync(appJsPath, appJs);
console.log('[inject] app.js patched to: ' + API_URL);

// Patch HTML pages
const pagesDir = path.join(FRONTEND, 'pages');
fs.readdirSync(pagesDir).filter(f => f.endsWith('.html')).forEach(file => {
  const fp = path.join(pagesDir, file);
  let c = fs.readFileSync(fp, 'utf8');
  const p = c.replace(/fetch\('\/api\//g, `fetch('${API_URL}/api/`).replace(/fetch\(`\/api\//g, `fetch(\`${API_URL}/api/`);
  if (p !== c) { fs.writeFileSync(fp, p); console.log(`[inject] patched ${file}`); }
});

console.log('[inject] Done.');
