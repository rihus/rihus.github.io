#!/usr/bin/env node
// Regenerates public/og-image.png (1200×630), the preview image shown when the site
// is shared on LinkedIn, Slack, etc. Optional: needs Playwright with Chromium
//   npm i -D playwright && npx playwright install chromium
// then:  node scripts/make-og-image.mjs
// Edit the NAME / TITLE / TAGLINE / SITE_URL constants below to change the text.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';

const NAME = 'Riaz Hussain, PhD';
const TITLE = 'MRI Physicist / Research Scientist';
const TAGLINE = 'Hyperpolarized ¹²⁹Xe lung MRI · Low-field 0.55T &amp; 3T MRI · Pulse sequences · Image analysis';
const SITE_URL = 'rihus.github.io';

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;width:1200px;height:630px;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
    background:radial-gradient(900px 500px at 90% -10%,#134e4a,transparent 60%),#0b1120;color:#e2e8f0;
    display:flex;flex-direction:column;justify-content:center;padding:0 90px;box-sizing:border-box}
  .bar{width:90px;height:8px;border-radius:4px;background:#2dd4bf;margin-bottom:40px}
  h1{font-size:76px;margin:0 0 16px;letter-spacing:-1px;color:#fff}
  h2{font-size:40px;margin:0 0 36px;font-weight:600;color:#5eead4}
  p{font-size:28px;margin:0;color:#cbd5e1;line-height:1.4;max-width:1000px}
  .url{position:absolute;bottom:50px;left:90px;font-size:26px;color:#94a3b8}
</style></head><body><div class="bar"></div><h1>${NAME}</h1><h2>${TITLE}</h2><p>${TAGLINE}</p>
<div class="url">${SITE_URL}</div></body></html>`;

const out = fileURLToPath(new URL('../public/og-image.png', import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html);
await page.screenshot({ path: out, type: 'png' });
await browser.close();
console.log('Wrote', out);
