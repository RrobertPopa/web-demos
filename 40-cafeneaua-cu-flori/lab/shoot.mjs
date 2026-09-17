import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const b = await chromium.launch({ executablePath: CHROME });
const sects = ['hero', 'duo', 'cafea', 'flori', 'vitrina', 'perechea', 'almanah', 'recenzii', 'gasesti'];
for (const [dir, w, h] of [['d', 1440, 900], ['m320', 320, 720]]) {
  mkdirSync('lab/' + dir, { recursive: true });
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.goto('http://localhost:4600/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1300);
  const tops = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('main > section').forEach(s => out.push(Math.round(s.offsetTop)));
    return out;
  });
  for (let i = 0; i < tops.length; i++) {
    await p.evaluate(y => window.scrollTo(0, y), tops[i] + 2);
    await p.waitForTimeout(950);
    await p.screenshot({ path: `lab/${dir}/${String(i).padStart(2,'0')}-${sects[i]||i}.png` });
  }
  await p.close();
}
await b.close();
console.log('gata');
