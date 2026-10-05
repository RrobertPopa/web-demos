import { chromium } from 'playwright-core';
const baza = 'file:///Users/robert/ClaudeProjects/web-dev/web-demos/45-apoteca/';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const erori = []; p.on('pageerror', e => erori.push(String(e).split('\n')[0]));

await p.goto(baza + 'produse.html', { waitUntil: 'load' });
await p.waitForTimeout(1500);
await p.click('.card:nth-child(1) .adauga');
await p.waitForTimeout(800);
const sertarDeschis = await p.evaluate(() => document.getElementById('sertar').getAttribute('data-on'));
await p.screenshot({ path: '/private/tmp/claude-501/-Users-robert/adf39f36-5b09-4f36-a736-be1fc8abe29e/scratchpad/ap-cos.png' });
await p.click('.inchide'); await p.waitForTimeout(600);
await p.click('.card:nth-child(3) .adauga');
await p.waitForTimeout(500);
await p.click('[data-plus]');
await p.waitForTimeout(400);
const t1 = await p.evaluate(() => document.getElementById('cos-total').textContent);
const n1 = await p.evaluate(() => document.querySelector('.cos-btn .n').textContent);

await p.goto(baza + 'index.html', { waitUntil: 'load' });
await p.waitForTimeout(1200);
const n2 = await p.evaluate(() => document.querySelector('.cos-btn .n').textContent);
await p.click('.cos-btn'); await p.waitForTimeout(700);
const t2 = await p.evaluate(() => document.getElementById('cos-total').textContent);

console.log('sertar deschis la adaugare:', sertarDeschis === '1');
console.log('pe produse.html: badge=' + n1 + ' total=' + t1);
console.log('dupa navigare pe index.html: badge=' + n2 + ' total=' + t2);
console.log('erori JS:', erori.length ? erori : 'niciuna');
await b.close();
