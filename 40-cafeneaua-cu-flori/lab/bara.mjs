import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const [n, w] of [['desktop',1440], ['tableta',760], ['telefon',320]]) {
  const p = await b.newPage({ viewport: { width: w, height: 700 } });
  await p.goto('http://localhost:4600/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => {
    const bar = document.querySelector('.bar');
    const l = document.querySelector('.bar__logo');
    return {
      imaginiInBara: bar.querySelectorAll('img').length,
      numeVizibil: !!(l.offsetWidth && getComputedStyle(l).display !== 'none'),
      text: l.textContent.trim(),
      latimeNume: Math.round(l.getBoundingClientRect().width),
      barLat: Math.round(bar.getBoundingClientRect().width)
    };
  });
  console.log(`${n} (${w}px): imagini in bara = ${r.imaginiInBara} | "${r.text}" vizibil=${r.numeVizibil} (${r.latimeNume}px din ${r.barLat}px)`);
  await p.screenshot({ path: `lab/bara-${w}.png`, clip: { x: 0, y: 0, width: w, height: 70 } });
  await p.close();
}
await b.close();
