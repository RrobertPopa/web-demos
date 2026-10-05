import { chromium } from 'playwright-core';
const S='/private/tmp/claude-501/-Users-robert/adf39f36-5b09-4f36-a736-be1fc8abe29e/scratchpad/';
const b=await chromium.launch({channel:'chrome'});
const p=await b.newPage({viewport:{width:1440,height:900}});
const e=[];p.on('pageerror',x=>e.push(String(x).split('\n')[0]));
await p.goto('file:///Users/robert/ClaudeProjects/web-dev/web-demos/45-apoteca/index.html',{waitUntil:'load'});
await p.waitForTimeout(2000);
for (const w of [1100,900,820,700,560,390,320]) {
  await p.setViewportSize({width:w,height:860});
  await p.waitForTimeout(900);
  const d=await p.evaluate(()=>{
    const de=document.documentElement;
    const c=document.getElementById('cer');
    const bar=document.querySelector('.meniu .wrap').getBoundingClientRect();
    const burger=document.querySelector('.burger').getBoundingClientRect();
    const nav=getComputedStyle(document.querySelector('.navlist'));
    return {scroll:de.scrollWidth, client:de.clientWidth,
      canvas:c.style.width, burgerRight:Math.round(burger.right),
      burgerVis:getComputedStyle(document.querySelector('.burger')).display,
      navPos:nav.position};
  });
  const rau = d.scroll>d.client+1 || d.burgerRight>d.client+1;
  console.log(`${String(w).padStart(4)}px  scroll=${d.scroll} client=${d.client}  canvas=${d.canvas}  burger:${d.burgerVis} right=${d.burgerRight}  nav=${d.navPos}  ${rau?'<<< PROBLEMA':''}`);
  if (w===700||w===390) await p.screenshot({path:S+`rz-${w}.png`});
}
console.log('erori JS:', e.length?e:'niciuna');
await b.close();
