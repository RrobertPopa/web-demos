import { chromium } from 'playwright-core';
const [,, url, out, w, h, ...sels] = process.argv;
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
await p.goto(url, { waitUntil: 'load' });
await p.waitForTimeout(1200);
for (const sel of sels) {
  await p.evaluate(s => document.querySelector(s)?.scrollIntoView({ block: 'center', behavior: 'instant' }), sel);
  await p.waitForTimeout(2200);
  const name = sel.replace(/[^a-z0-9]/gi, '');
  await p.screenshot({ path: `${out}/${name}-${w}.png` });
  console.log('ok', sel);
}
await b.close();
