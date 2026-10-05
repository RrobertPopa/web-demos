import { chromium } from 'playwright-core';
const url = process.argv[2];
async function run(label, opts) {
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 860 }, ...opts });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  await p.goto(url, { waitUntil: 'load' });
  await p.waitForTimeout(1000);
  for (const id of ['#vechime', '#programare']) {
    await p.evaluate(s => document.querySelector(s)?.scrollIntoView({ block: 'center' }), id);
    await p.waitForTimeout(2500);
  }
  const r = await p.evaluate(() => ({
    cifra: document.querySelector('.cifra')?.textContent.trim(),
    ascunse: [...document.querySelectorAll('[data-sc-in], [data-sc-stagger] > *')]
      .filter(e => getComputedStyle(e).opacity < 0.9).length,
    imaginiAscunse: [...document.querySelectorAll('img')].filter(i => !i.complete || i.naturalWidth === 0).length,
    ready: document.documentElement.classList.contains('sc-ready'),
  }));
  console.log(`${label}: cifra="${r.cifra}" ascunse=${r.ascunse} imaginiRupte=${r.imaginiAscunse} sc-ready=${r.ready} erori=${errs.length}`);
  if (errs.length) console.log('  ', errs[0].split('\n')[0]);
  await b.close();
}
await run('normal', {});
await run('reduced-motion', { reducedMotion: 'reduce' });
