/**
 * inject-api-url.js
 * Rewrites /api → <BIXCART_API_URL>/api in all frontend files before `npx cap sync`.
 * Run automatically by GitHub Actions. Not needed for local web dev.
 */

const fs   = require('fs');
const path = require('path');

const API_URL = process.env.BIXCART_API_URL;

if (!API_URL) {
  console.warn('[inject-api-url] BIXCART_API_URL not set — skipping.');
  process.exit(0);
}

try { new URL(API_URL); } catch {
  console.error('[inject-api-url] Invalid URL:', API_URL);
  process.exit(1);
}

const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

// 1. Patch app.js API_BASE
const appJsPath = path.join(FRONTEND_DIR, 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(
  /const API_BASE = '.*?';(\s*\/\/ injected.*)?/,
  `const API_BASE = '${API_URL}/api'; // injected by inject-api-url.js`
);
fs.writeFileSync(appJsPath, appJs);
console.log(`[inject-api-url] app.js → API_BASE = ${API_URL}/api`);

// 2. Patch inline fetch('/api/...) calls in HTML pages
const PAGES_DIR = path.join(FRONTEND_DIR, 'pages');
for (const file of fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html'))) {
  const fp = path.join(PAGES_DIR, file);
  let c = fs.readFileSync(fp, 'utf8');
  const p = c
    .replace(/fetch\('\/api\//g, `fetch('${API_URL}/api/`)
    .replace(/fetch\(`\/api\//g, `fetch(\`${API_URL}/api/`);
  if (p !== c) { fs.writeFileSync(fp, p); console.log(`[inject-api-url] patched ${file}`); }
}

// 3. Patch capacitor.config.ts server.url
const capPath = path.join(__dirname, '..', 'capacitor.config.ts');
let cap = fs.readFileSync(capPath, 'utf8');
cap = cap.replace(/\/\/\s*url:\s*'.*?',/, `url: '${API_URL}',`);
fs.writeFileSync(capPath, cap);
console.log(`[inject-api-url] capacitor.config.ts server.url = ${API_URL}`);

console.log('[inject-api-url] Done.');
