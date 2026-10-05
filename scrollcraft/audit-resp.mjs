import { chromium } from 'playwright-core';
const baza='file:///Users/robert/ClaudeProjects/web-dev/web-demos/45-apoteca/';
const S='/private/tmp/claude-501/-Users-robert/adf39f36-5b09-4f36-a736-be1fc8abe29e/scratchpad/';
const b=await chromium.launch({channel:'chrome'});
for (const w of [320,390,768]) {
  for (const f of ['index','produse','produs']) {
    const p=await b.newPage({viewport:{width:w,height:900}});
    await p.goto(baza+f+'.html',{waitUntil:'load'});
    await p.waitForTimeout(2200);
    // forteaza toate aparitiile, altfel captura full-page prinde continut ascuns
    await p.evaluate(()=>document.querySelectorAll('[data-apare]').forEach(e=>e.classList.add('vazut')));
    await p.waitForTimeout(500);
    const d=await p.evaluate(()=>{
      const de=document.documentElement;
      const rele=[...document.querySelectorAll('body *')].filter(e=>{
        const r=e.getBoundingClientRect();
        return r.width>0 && (r.right>de.clientWidth+1 || r.left<-1);
      }).slice(0,6).map(e=>{
        const r=e.getBoundingClientRect();
        return (e.className&&typeof e.className==='string'?'.'+e.className.split(' ')[0]:e.tagName)
          +' '+Math.round(r.left)+'→'+Math.round(r.right);
      });
      return {scroll:de.scrollWidth, client:de.clientWidth, rele};
    });
    if (d.scroll>d.client+1 || d.rele.length) console.log(w+'px '+f+': scroll='+d.scroll+' client='+d.client+' | '+d.rele.join(' , '));
    await p.screenshot({path:S+`r-${f}-${w}.png`, fullPage:true});
    await p.close();
  }
}
console.log('gata');
await b.close();
