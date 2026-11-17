import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire('C:/Users/rapha/AppData/Local/Temp/cook-tools/package.json');
const { chromium } = require('playwright-core');

const projectRoot = path.resolve('G:/Meine Ablage/Nexbot Webdesign/02_Projekte/fliesen-theo-galuschka-v2');
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0];
  const filePath = path.join(projectRoot, urlPath === '/' ? 'index.html' : urlPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const baseUrl = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox']
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(baseUrl, { waitUntil: 'networkidle' });

// 1. Consent banner visible initially, Maps iframe has NO src before consent
const bannerVisibleInit = await page.locator('#consentBanner:not(.hidden)').isVisible();
const mapSrcBefore = await page.locator('#googleMapsFrame').getAttribute('src');
const mapDataSrcBefore = await page.locator('#googleMapsFrame').getAttribute('data-src');

// Reject first -> Maps still blocked
await page.click('#consentReject');
const mapSrcAfterReject = await page.locator('#googleMapsFrame').getAttribute('src');

// Reopen via footer link -> Accept -> Maps src populated
await page.click('#cookieSettingsLink');
const bannerReopened = await page.locator('#consentBanner:not(.hidden)').isVisible();
await page.click('#consentAccept');
const mapSrcAfterAccept = await page.locator('#googleMapsFrame').getAttribute('src');

// 2. Impressum & Datenschutz Modals
await page.click('[data-open-modal="impressumModal"]');
const impressumOpen = await page.locator('#impressumModal.open').isVisible();
await page.keyboard.press('Escape');
const impressumClosed = !(await page.locator('#impressumModal.open').isVisible());

// 3. Calculator dynamic update + transfer to funnel
await page.fill('#calcAreaSlider', '60');
await page.dispatchEvent('#calcAreaSlider', 'input');
const minPrice60 = await page.locator('#calcPriceMin').textContent();
await page.click('#calcTransferBtn');
const notesVal = await page.locator('#nachricht').inputValue();

// 4. 3-Step Funnel
await page.click('[data-funnel-next="1"]');
const step2Active = await page.locator('#funnelStep2.active').isVisible();
await page.click('[data-funnel-next="2"]');
const step3Active = await page.locator('#funnelStep3.active').isVisible();

await browser.close();
server.closeAllConnections?.();
server.close();

console.log(JSON.stringify({
  bannerVisibleInit,
  mapBlockedBeforeConsent: mapSrcBefore === null && !!mapDataSrcBefore,
  mapBlockedAfterReject: mapSrcAfterReject === null,
  bannerReopened,
  mapLoadedAfterAccept: !!mapSrcAfterAccept && mapSrcAfterAccept.includes('maps.google.com'),
  impressumOpen,
  impressumClosed,
  minPrice60,
  calcTransferredToFunnel: notesVal.includes('60 m²'),
  step2Active,
  step3Active
}, null, 2));
process.exit(0);
