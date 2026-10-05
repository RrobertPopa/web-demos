import { chromium } from 'playwright-core';
const baza='file:///Users/robert/ClaudeProjects/web-dev/web-demos/45-apoteca/';
const b=await chromium.launch({channel:'chrome'});
let rele=0;
for (const f of ['index','produse','produs']) {
  const p=await b.newPage({viewport:{width:1440,height:860}});
  await p.goto(baza+f+'.html',{waitUntil:'load'}); await p.waitForTimeout(1600);
  for (let w=320; w<=1440; w+=20) {
    await p.setViewportSize({width:w,height:860});
    await p.waitForTimeout(110);
    const d=await p.evaluate(()=>{
      const de=document.documentElement;
      if (de.scrollWidth<=de.clientWidth+1) return null;
      const lim=de.clientWidth;
      const v=[...document.querySelectorAll('body *')].filter(e=>{
        if (e.closest('.sertar')||e.closest('#fundal')) return false;
        return e.clientWidth>0 && e.scrollWidth>e.clientWidth+1;
      }).map(e=>(e.className&&typeof e.className==='string'&&e.className.trim())
          ?'.'+e.className.trim().split(/\s+/)[0]:e.tagName);
      return {over:de.scrollWidth-lim, v:[...new Set(v)].slice(0,4)};
    });
    if (d) { rele++; console.log(`  ${f} @${w}px  +${d.over}px  ${d.v.join(' ')}`); }
  }
  await p.close();
}
console.log(rele? `\n${rele} latimi cu depasire` : '\nzero depasiri, de la 320 la 1440 din 20 in 20');
await b.close();
