import { chromium } from "playwright-core";
const CH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = "file://" + process.cwd() + "/index.html";
const b = await chromium.launch({ executablePath: CH });

async function shots(w, h, name, positions) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  for (const [label, sel] of positions) {
    if (sel === "top") await p.evaluate(() => window.scrollTo(0, 0));
    else await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: "start" }), sel);
    await p.waitForTimeout(700);
    await p.screenshot({ path: `lab/${name}-${label}.png` });
  }
  const doc = await p.evaluate(() => document.documentElement.scrollHeight);
  const over = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log(`${name} ${w}px → înălțime ${doc}px (${(doc/h).toFixed(1)} ecrane), scroll orizontal: ${over ? "DA ⚠️" : "nu"}`);
  await p.close();
}

const pos = [["1hero","top"],["2registru",".registru"],["3deviz","#deviz"],["4vino",".vino"]];
await shots(320, 640, "m320", pos);
await shots(390, 844, "m390", [["1hero","top"],["3deviz","#deviz"]]);
await shots(1280, 860, "d", [["1hero","top"],["2registru",".registru"],["3deviz","#deviz"],["4vino",".vino"]]);
await b.close();
