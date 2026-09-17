import { chromium } from 'playwright-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const b = await chromium.launch({ executablePath: CHROME });
for (const [name, w, h] of [['desktop',1440,900], ['telefon 390',390,844], ['telefon 320',320,720]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await p.goto('http://localhost:4600/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(1200);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(600);
  const r = await p.evaluate((W) => {
    const over = [];
    document.querySelectorAll('body *').forEach(el => {
      const b = el.getBoundingClientRect();
      if (b.width > 0 && (b.right > W + 0.5 || b.left < -0.5)) {
        over.push(el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : ''));
      }
    });
    const nevazute = [...document.querySelectorAll('[data-rise]')].filter(e => !e.classList.contains('seen')).length;
    return {
      scrollWidth: document.documentElement.scrollWidth,
      over: [...new Set(over)].slice(0, 6), overCount: over.length,
      riseTotal: document.querySelectorAll('[data-rise]').length, nevazute,
      luna: document.getElementById('sezon-nume')?.textContent,
      pereche: document.getElementById('pereche-out')?.textContent,
      chips: document.querySelectorAll('#pereche-chips .chip').length
    };
  }, w);
  console.log(`--- ${name} (${w}px) ---`);
  console.log('  scrollWidth:', r.scrollWidth, '| depasiri:', r.overCount, r.over.length ? r.over : '');
  console.log('  dezvaluiri:', r.riseTotal - r.nevazute + '/' + r.riseTotal, '| almanah:', r.luna, '| perechea:', r.pereche, '| optiuni:', r.chips);
  console.log('  erori:', errs.length ? errs : 'niciuna');
  await p.close();
}
await b.close();
