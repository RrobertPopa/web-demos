import { chromium } from 'playwright-core';
const b=await chromium.launch({channel:'chrome'});
const p=await b.newPage({viewport:{width:900,height:860}});
await p.goto('file:///Users/robert/ClaudeProjects/web-dev/web-demos/45-apoteca/index.html',{waitUntil:'load'});
await p.waitForTimeout(1600);
const d=await p.evaluate(()=>{
  const de=document.documentElement, out=[];
  out.push('html scrollW='+de.scrollWidth+' clientW='+de.clientWidth);
  out.push('body scrollW='+document.body.scrollWidth+' offsetW='+document.body.offsetWidth);
  const c=document.getElementById('cer');
  const r=c.getBoundingClientRect();
  out.push('canvas rect '+Math.round(r.left)+'→'+Math.round(r.right)+' styleW='+c.style.width+' attrW='+c.width);
  out.push('innerWidth='+innerWidth+' visualViewport='+(visualViewport?Math.round(visualViewport.width):'-'));
  // cine are scrollWidth mai mare decat clientWidth
  [...document.querySelectorAll('body *')].forEach(e=>{
    if (e.scrollWidth > e.clientWidth + 1 && e.clientWidth > 0 && !e.closest('.sertar'))
      out.push('DEPASESTE '+(e.className&&typeof e.className==='string'?'.'+e.className.trim().split(/\s+/)[0]:e.tagName)
        +' scrollW='+e.scrollWidth+' clientW='+e.clientWidth);
  });
  return out;
});
console.log(d.join('\n'));
await b.close();
