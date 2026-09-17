import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const p = await b.newPage({ viewport: { width: 320, height: 720 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('http://localhost:4600/', { waitUntil: 'networkidle' });
await p.waitForTimeout(900);
console.log('hamburger vizibil:', await p.locator('#burger').isVisible());
console.log('meniu ascuns initial:', await p.locator('#meniu').isHidden());
await p.locator('#burger').click();
await p.waitForTimeout(700);
console.log('dupa click -> meniu deschis:', await p.locator('#meniu').isVisible(),
            '| aria-expanded:', await p.locator('#burger').getAttribute('aria-expanded'),
            '| body blocat:', await p.evaluate(() => document.body.classList.contains('blocat')));
await p.screenshot({ path: 'lab/m320/meniu.png' });
await p.locator('#meniu nav a').first().click();
await p.waitForTimeout(700);
console.log('dupa click pe link -> inchis:', await p.locator('#meniu').isHidden(),
            '| body deblocat:', await p.evaluate(() => !document.body.classList.contains('blocat')),
            '| a navigat la:', await p.evaluate(() => location.hash));
await p.setViewportSize({ width: 1200, height: 800 });
await p.waitForTimeout(400);
console.log('pe desktop meniul ramane ascuns:', await p.locator('#meniu').isHidden());
console.log('erori:', errs.length ? errs : 'niciuna');
await b.close();
