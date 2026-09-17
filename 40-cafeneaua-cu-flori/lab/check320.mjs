import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const url of ['http://localhost:4500/', 'file://' + process.cwd() + '/index.html']) {
  const p = await b.newPage({ viewport: { width: 320, height: 720 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1800);
  const r = await p.evaluate(() => {
    const over = [];
    document.querySelectorAll('body *').forEach(el => {
      const b = el.getBoundingClientRect();
      if (b.width > 0 && (b.right > 320.5 || b.left < -0.5)) {
        over.push(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '') + ' [' + Math.round(b.left) + '→' + Math.round(b.right) + ']');
      }
    });
    return {
      scrollWidth: document.documentElement.scrollWidth,
      ready: document.documentElement.classList.contains('sc-ready'),
      over: over.slice(0, 8),
      overCount: over.length,
      luna: document.getElementById('season-name') ? document.getElementById('season-name').textContent : '?',
      pereche: document.getElementById('pair-flower') ? document.getElementById('pair-flower').textContent : '?'
    };
  });
  console.log(url.startsWith('file') ? '--- DUBLU-CLICK (file://) ---' : '--- SERVIT (http) ---');
  console.log(' scrollWidth:', r.scrollWidth, '| sc-ready:', r.ready);
  console.log(' depasiri orizontale:', r.overCount, r.over.length ? r.over : '');
  console.log(' almanah arata luna:', r.luna, '| perechea:', r.pereche);
  console.log(' erori JS:', errs.length ? errs : 'niciuna');
  await p.close();
}
await b.close();
