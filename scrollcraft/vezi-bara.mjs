import { chromium } from 'playwright-core';
const b=await chromium.launch({channel:'chrome'});
const p=await b.newPage({viewport:{width:320,height:760}});
await p.goto('file:///Users/robert/ClaudeProjects/web-dev/web-demos/45-apoteca/index.html',{waitUntil:'load'});
await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{
  const q=s=>{const e=document.querySelector(s);if(!e)return null;const b=e.getBoundingClientRect();
    return {s, left:Math.round(b.left), right:Math.round(b.right), w:Math.round(b.width)};};
  return {viewport:innerWidth, logo:q('.logo'), cos:q('.cos-btn'), burger:q('.burger'),
    wrap:q('.meniu .wrap')};
});
console.log(JSON.stringify(r,null,1));
await p.screenshot({path:'/private/tmp/claude-501/-Users-robert/adf39f36-5b09-4f36-a736-be1fc8abe29e/scratchpad/bara320.png'});
await b.close();
