import { chromium } from 'playwright-core';
const S='/private/tmp/claude-501/-Users-robert/adf39f36-5b09-4f36-a736-be1fc8abe29e/scratchpad/';
const b=await chromium.launch({channel:'chrome'});
const e=[];
const d=await b.newPage({viewport:{width:1440,height:900}});
d.on('pageerror',x=>e.push(String(x).split('\n')[0]));
await d.goto('http://127.0.0.1:8080/d-harta/index.html',{waitUntil:'load'});
await d.waitForTimeout(2600);
const n=await d.evaluate(()=>document.querySelectorAll('.dinte').length);
await d.screenshot({path:S+'h1.png'});
// apas pe un molar
await d.evaluate(()=>{const m=document.querySelector('.dinte[data-tip="molar"]');
  m.dispatchEvent(new MouseEvent('click',{bubbles:true}));});
await d.waitForTimeout(900);
await d.screenshot({path:S+'h2.png'});
const fisa=await d.evaluate(()=>({on:document.getElementById('fisa').dataset.on,
  ce:document.getElementById('f-ce').textContent, pret:document.getElementById('f-pret').textContent}));
console.log('dinti:',n,'| fisa:',JSON.stringify(fisa));
console.log('erori:',e.length?e:'niciuna');
await b.close();
