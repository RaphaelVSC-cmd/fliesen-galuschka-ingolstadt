// Cook Round Harness: starts local static server, captures fixed shots S01..S05 via Playwright + Chrome WebGL,
// measures FPS / render time / console errors / horizontal overflow.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire('C:/Users/rapha/AppData/Local/Temp/cook-tools/package.json');
const { chromium } = require('playwright-core');

const projectRoot = path.resolve('G:/Meine Ablage/Nexbot Webdesign/02_Projekte/fliesen-theo-galuschka-v2');
const roundArg = process.argv[2] || 'r01';
const outDir = path.join(projectRoot, 'cook', 'stills', roundArg);
fs.mkdirSync(outDir, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0];
  let filePath = path.join(projectRoot, urlPath === '/' ? 'index.html' : urlPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const baseUrl = `http://127.0.0.1:${port}/`;

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--no-sandbox'
  ],
});

const consoleErrors = [];
const pageErrors = [];
const networkFailures = [];

async function captureDesktop() {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  page.on('requestfailed', (r) => networkFailures.push(`${r.url()} -> ${r.failure()?.errorText}`));

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  // Dismiss consent banner cleanly and force eager image decode for deterministic stills
  await page.evaluate(async () => {
    localStorage.setItem('consent_v1', 'rejected');
    document.getElementById('consentBanner')?.classList.add('hidden');
    await Promise.all([...document.images].map((img) => {
      img.loading = 'eager';
      return img.decode().catch(() => {});
    }));
  });
  await page.waitForTimeout(350);

  // S01: Hero (1440x960, matching R03 3:2)
  const t0 = performance.now();
  await page.screenshot({ path: path.join(outDir, 'S01.png'), animations: 'disabled' });
  const s01Ms = Math.round(performance.now() - t0);

  // S02: 3D Scrollytelling Stage (900x1600 matching R01)
  await page.setViewportSize({ width: 900, height: 1600 });
  await page.evaluate(() => {
    const el = document.getElementById('scrollyStage');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + el.offsetHeight * 0.42);
    }
    if (window.__cookSetExplode) window.__cookSetExplode(0.65);
  });
  await page.waitForTimeout(450);
  await page.screenshot({ path: path.join(outDir, 'S02.png'), animations: 'disabled' });

  // S03: Architectural Process Stage + Dark Obsidian Gallery (900x1350 matching R02 2:3)
  await page.setViewportSize({ width: 900, height: 1350 });
  await page.evaluate(() => {
    const el = document.getElementById('inspektor');
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 4);
  });
  await page.waitForTimeout(450);
  await page.screenshot({ path: path.join(outDir, 'S03.png'), animations: 'disabled' });

  // S03b: Full Dark Obsidian Portfolio + Google 5,0 Trust verification
  await page.evaluate(() => {
    const el = document.getElementById('leistungen');
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 24);
  });
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(outDir, 'S03_gallery.png'), animations: 'disabled' });

  // S04: Trust + Calculator + Funnel + Dark Wave Footer (900x1350 matching R04 2:3)
  await page.evaluate(() => {
    const el = document.getElementById('rechner');
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 20);
  });
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(outDir, 'S04.png'), animations: 'disabled' });

  // S06: Google Trust 5.0 + Two-Click Maps + FAQ + Complete Footer bottom
  await page.setViewportSize({ width: 900, height: 1520 });
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(outDir, 'S06_standort.png'), animations: 'disabled' });

  // Measure desktop metrics
  const metrics = await page.evaluate(() => {
    const docW = document.documentElement.scrollWidth;
    const winW = window.innerWidth;
    const h1Count = document.querySelectorAll('h1').length;
    const imgs = [...document.querySelectorAll('img')];
    const brokenImgs = imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src);
    const missingDims = imgs.filter(i => !i.getAttribute('width') || !i.getAttribute('height')).map(i => i.src);
    const webgl = !!document.getElementById('scrollyCanvas')?.getContext('webgl2') || !!document.getElementById('scrollyCanvas')?.getContext('webgl');
    return { docW, winW, overflowX: docW > winW, h1Count, imgCount: imgs.length, brokenImgs, missingDims, webgl, s01Ms: 0 };
  });
  metrics.s01Ms = s01Ms;

  await context.close();
  return metrics;
}

async function captureMobile() {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('consent_v1', 'rejected');
    document.getElementById('consentBanner')?.classList.add('hidden');
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, 'S05_mobile.png') });

  // Mobile Calculator + Sticky Bar clearance check
  await page.evaluate(() => {
    const el = document.getElementById('rechner');
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 16);
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, 'S05_mobile_calc.png') });

  const mobileMetrics = await page.evaluate(() => {
    const docW = document.documentElement.scrollWidth;
    const winW = window.innerWidth;
    const canvasPointer = getComputedStyle(document.getElementById('scrollyCanvas')).pointerEvents;
    const bottomBar = document.querySelector('.mobile-bottom-bar');
    const barZ = bottomBar ? getComputedStyle(bottomBar).zIndex : null;
    return { docW, winW, overflowX: docW > winW, canvasPointer, barZ };
  });
  await context.close();
  return mobileMetrics;
}

const desktop = await captureDesktop();
const mobile = await captureMobile();
await browser.close();
server.closeAllConnections?.();
server.close();

console.log(JSON.stringify({ round: roundArg, desktop, mobile, consoleErrors, pageErrors, networkFailures }, null, 2));
process.exit(0);
