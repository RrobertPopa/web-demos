import { chromium } from 'playwright-core';
const b=await chromium.launch({channel:'chrome'});
const baza='file:///Users/robert/ClaudeProjects/web-dev/web-demos/45-apoteca/';
for (const f of ['index','produse','produs']) {
  for (const w of [900,860,820,780]) {
    const p=await b.newPage({viewport:{width:w,height:860}});
    await p.goto(baza+f+'.html',{waitUntil:'load'}); await p.waitForTimeout(1400);
    const d=await p.evaluate(()=>{
      const de=document.documentElement, lim=de.clientWidth;
      if (de.scrollWidth<=lim+1) return null;
      const rele=[...document.querySelectorAll('body *')]
        .filter(e=>{const r=e.getBoundingClientRect();
          return r.width>0 && r.right>lim+1 && !e.closest('.sertar') && !e.closest('#fundal');})
        .map(e=>{const r=e.getBoundingClientRect();
          const n=(e.className&&typeof e.className==='string'&&e.className.trim())?'.'+e.className.trim().split(/\s+/)[0]:e.tagName;
          return n+'  '+Math.round(r.left)+'→'+Math.round(r.right)+' ('+Math.round(r.width)+'px)';})
        .slice(0,5);
      return {over:de.scrollWidth-lim, rele};
    });
    if (d) console.log(`${f} @${w}: +${d.over}px  ::  ${d.rele.join('  |  ')}`);
    await p.close();
  }
}
console.log('gata');
await b.close();
