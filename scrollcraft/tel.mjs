import { chromium } from 'playwright-core';
const S='/private/tmp/claude-501/-Users-robert/adf39f36-5b09-4f36-a736-be1fc8abe29e/scratchpad/';
const b=await chromium.launch({channel:'chrome'});
// iPhone 13 real: 390x844, DPR 3, touch
const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true,
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'});
const e=[];p.on('pageerror',x=>e.push(String(x).split('\n')[0]));
for (const [nume,url] of [['start','http://192.168.100.137:8080/'],
                          ['a','http://192.168.100.137:8080/a-grila/index.html'],
                          ['b','http://192.168.100.137:8080/b-padure/index.html'],
                          ['c','http://192.168.100.137:8080/c-sticla/index.html']]){
  await p.goto(url,{waitUntil:'load'}); await p.waitForTimeout(2600);
  const d=await p.evaluate(()=>{
    const de=document.documentElement;
    const mici=[...document.querySelectorAll('a,button')].filter(x=>{
      const r=x.getBoundingClientRect(); return r.width>0 && (r.height<44);}).length;
    return {over:de.scrollWidth-de.clientWidth, mici};
  });
  console.log(`${nume}: depasire=${d.over}px  butoane_sub_44px=${d.mici}`);
  await p.screenshot({path:S+'tel-'+nume+'.png'});
}
console.log('erori JS:', e.length?e:'niciuna');
await b.close();
