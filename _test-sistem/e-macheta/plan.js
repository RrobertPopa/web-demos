/* Planul apartamentului, desenat in SVG, si pata de lumina care intra pe ferestre.
   Acelasi Soare care lumineaza macheta de pe prima pagina misca lumina aici. */
var Plan = (function(){

  var TIP = {
    2: { W:900, H:620, bal:{x:340, w:560, d:105},
      cam:[
        {n:'Dormitor',  x:0,   y:230, w:340, h:390, mob:'pat'},
        {n:'Living',    x:340, y:230, w:560, h:390, mob:'living'},
        {n:'Hol',       x:0,   y:0,   w:340, h:230, mob:''},
        {n:'Baie',      x:340, y:0,   w:280, h:230, mob:'baie'},
        {n:'Dressing',  x:620, y:0,   w:280, h:230, mob:''}
      ],
      fer:[[80,270],[420,620],[700,860]],
      vest:[320,520], est:[330,540] },
    3: { W:1150, H:700, bal:{x:380, w:770, d:105},
      cam:[
        {n:'Dormitor',    x:0,   y:280, w:380, h:420, mob:'pat'},
        {n:'Living',      x:380, y:280, w:420, h:420, mob:'living'},
        {n:'Dormitor 2',  x:800, y:280, w:350, h:420, mob:'pat'},
        {n:'Hol',         x:0,   y:0,   w:420, h:280, mob:''},
        {n:'Baie',        x:420, y:0,   w:280, h:280, mob:'baie'},
        {n:'Bucătărie',   x:700, y:0,   w:450, h:280, mob:'bucatarie'}
      ],
      fer:[[90,300],[470,710],[880,1090]],
      vest:[400,600], est:[400,600] }
  };

  var NS = 'http://www.w3.org/2000/svg';
  function e(n,a){ var x=document.createElementNS(NS,n); for(var k in a) x.setAttribute(k,a[k]); return x; }
  function pol(p){ return p.map(function(q){ return q[0].toFixed(1)+','+q[1].toFixed(1); }).join(' '); }

  function creeaza(svg, ap){
    var T = TIP[ap.cam], W = T.W, H = T.H, nord = (ap.gy === 0);
    // sudul e mereu jos in desen. La apartamentele de nord, planul se oglindeste,
    // deci ferestrele mari ajung sus si soarele nu mai intra direct prin ele.
    function fy(y){ return nord ? (H - y) : y; }
    function fr(r){ return {n:r.n, x:r.x, y:nord ? (H - r.y - r.h) : r.y, w:r.w, h:r.h, mob:r.mob}; }
    var cam = T.cam.map(fr);
    var balY = nord ? -T.bal.d : H;

    var M = 46;
    svg.setAttribute('viewBox', (-M)+' '+(-M-(nord?T.bal.d:0))+' '+(W+M*2)+' '+(H+T.bal.d+M*2));
    svg.innerHTML = '';

    var defs = e('defs',{});
    var cp = e('clipPath',{id:'incapere'});
    cp.appendChild(e('rect',{x:0,y:0,width:W,height:H}));
    defs.appendChild(cp);
    cam.forEach(function(r, i){
      var c = e('clipPath',{id:'inc'+i});
      c.appendChild(e('rect',{x:r.x, y:r.y, width:r.w, height:r.h}));
      defs.appendChild(c);
    });
    function camDe(px, py){
      for (var i=0;i<cam.length;i++){
        var r = cam[i];
        if (px>=r.x && px<=r.x+r.w && py>=r.y && py<=r.y+r.h) return i;
      }
      return -1;
    }
    var g1 = e('linearGradient',{id:'raza', x1:'0',y1:'0',x2:'0',y2:'1'});
    // capatul dinspre fereastra e plin, capatul din adancul camerei se stinge
    g1.appendChild(e('stop',{offset:'0','stop-color':'#f2b431','stop-opacity':'0'}));
    g1.appendChild(e('stop',{offset:'.55','stop-color':'#f2b431','stop-opacity':'.34'}));
    g1.appendChild(e('stop',{offset:'1','stop-color':'#f2b431','stop-opacity':'.70'}));
    defs.appendChild(g1);
    svg.appendChild(defs);

    // balconul, punctat
    svg.appendChild(e('rect',{x:T.bal.x, y:balY, width:T.bal.w, height:T.bal.d,
      fill:'rgba(21,23,27,.035)', stroke:'rgba(21,23,27,.34)', 'stroke-width':4, 'stroke-dasharray':'12 10'}));

    // conturul si camerele
    svg.appendChild(e('rect',{x:0,y:0,width:W,height:H, fill:'#fbf9f3'}));

    var gLum = e('g',{'clip-path':'url(#incapere)'});
    svg.appendChild(gLum);

    var gPereti = e('g',{fill:'none', stroke:'#15171b', 'stroke-linejoin':'miter'});
    cam.forEach(function(r){
      gPereti.appendChild(e('rect',{x:r.x,y:r.y,width:r.w,height:r.h,'stroke-width':6}));
    });
    gPereti.appendChild(e('rect',{x:0,y:0,width:W,height:H,'stroke-width':14}));
    svg.appendChild(gPereti);

    // mobilier, desenat subtire: da scara camerei
    var gMob = e('g',{fill:'none', stroke:'rgba(21,23,27,.30)', 'stroke-width':4});
    cam.forEach(function(r){
      var cx = r.x + r.w/2, cy = r.y + r.h/2;
      if (r.mob === 'pat'){
        gMob.appendChild(e('rect',{x:cx-80,y:cy-95,width:160,height:190,rx:8}));
        gMob.appendChild(e('line',{x1:cx-80,y1:cy-52,x2:cx+80,y2:cy-52}));
      } else if (r.mob === 'living'){
        gMob.appendChild(e('rect',{x:r.x+40,y:cy-70,width:60,height:150,rx:8}));
        gMob.appendChild(e('rect',{x:cx+10,y:cy-55,width:130,height:110,rx:8}));
        gMob.appendChild(e('circle',{cx:cx-40,cy:cy+10,r:34}));
      } else if (r.mob === 'baie'){
        gMob.appendChild(e('rect',{x:r.x+26,y:r.y+26,width:150,height:70,rx:8}));
        gMob.appendChild(e('circle',{cx:r.x+r.w-60,cy:r.y+62,r:26}));
        gMob.appendChild(e('circle',{cx:r.x+r.w-60,cy:r.y+r.h-62,r:30}));
      } else if (r.mob === 'bucatarie'){
        gMob.appendChild(e('rect',{x:r.x+24,y:r.y+24,width:r.w-48,height:56,rx:6}));
        gMob.appendChild(e('rect',{x:cx-70,y:cy+30,width:140,height:70,rx:8}));
      }
    });
    svg.appendChild(gMob);

    // ferestrele: linie dubla in perete
    var GEAM = [];
    function geam(x0,y0,x1,y1, dir){
      var mx = (x0+x1)/2, my = (y0+y1)/2;
      var adanc = 12;
      var ic = camDe(mx + (dir==='vest'?adanc:dir==='est'?-adanc:0),
                     my + (dir==='sud'?-adanc:dir==='nord'?adanc:0));
      GEAM.push({x0:x0,y0:y0,x1:x1,y1:y1,dir:dir,cam:ic});
      svg.appendChild(e('line',{x1:x0,y1:y0,x2:x1,y2:y1, stroke:'#fbf9f3','stroke-width':16}));
      svg.appendChild(e('line',{x1:x0,y1:y0,x2:x1,y2:y1, stroke:'#1f4fd8','stroke-width':4}));
    }
    var yf = fy(H);
    T.fer.forEach(function(f){ geam(f[0], yf, f[1], yf, nord ? 'nord' : 'sud'); });
    if (ap.gx === 0) geam(0, fy(T.vest[0]), 0, fy(T.vest[1]), 'vest');
    if (ap.gx === 2) geam(W, fy(T.est[0]), W, fy(T.est[1]), 'est');

    // etichetele
    var gT = e('g',{});
    cam.forEach(function(r){
      var cx = r.x + r.w/2;
      var t1 = e('text',{x:cx, y:r.y + 44, 'text-anchor':'middle',
        style:'font-family:Text,sans-serif;font-size:27px;font-weight:600;fill:#15171b'});
      t1.textContent = r.n;
      var t2 = e('text',{x:cx, y:r.y + 76, 'text-anchor':'middle',
        style:'font-family:Cifre,monospace;font-size:23px;fill:#8b8f98'});
      t2.textContent = (r.w*r.h/10000).toFixed(1).replace('.',',') + ' m²';
      gT.appendChild(t1); gT.appendChild(t2);
    });
    svg.appendChild(gT);

    // busola: nordul e mereu sus in desen
    var bx = -26, by = 46;
    var gb = e('g',{});
    gb.appendChild(e('line',{x1:bx,y1:by+34,x2:bx,y2:by-26,stroke:'rgba(21,23,27,.45)','stroke-width':4}));
    gb.appendChild(e('polygon',{points:bx+','+(by-40)+' '+(bx-9)+','+(by-22)+' '+(bx+9)+','+(by-22),
      fill:'rgba(21,23,27,.55)'}));
    var tn = e('text',{x:bx, y:by+58,'text-anchor':'middle',
      style:'font-family:Cifre,monospace;font-size:21px;fill:#8b8f98'});
    tn.textContent = 'N';
    gb.appendChild(tn);
    svg.appendChild(gb);

    /* ---- lumina ---- */
    function lumina(){
      var S = Sit.Soare, inalt = S.inaltime(), az = S.azimut();
      gLum.innerHTML = '';
      if (inalt <= 0.01) return 0;
      var dx = az, dy = -1;                       // soarele e la sud: lumina urca in desen
      var lung = 150 + 620 * (1 - inalt);          // soare jos = pata lunga
      var cate = 0;
      GEAM.forEach(function(g){
        var vx = 0, vy = 0;
        if (g.dir === 'sud'){ vx = dx; vy = -1; }
        else if (g.dir === 'nord'){ return; }      // nordul nu primeste soare direct. Asta si vinde.
        else if (g.dir === 'vest'){ if (dx <= 0.12) return; vx = 1; vy = dy*0.5; }
        else if (g.dir === 'est'){  if (dx >= -0.12) return; vx = -1; vy = dy*0.5; }
        if (nord && g.dir === 'sud') return;
        var n = Math.sqrt(vx*vx + vy*vy) || 1; vx /= n; vy /= n;
        var L = lung;
        var p = [[g.x0,g.y0],[g.x1,g.y1],[g.x1+vx*L, g.y1+vy*L],[g.x0+vx*L, g.y0+vy*L]];
        var q = e('polygon',{points:pol(p), fill:'url(#raza)',
          opacity:(0.30 + 0.62*inalt).toFixed(2), style:'mix-blend-mode:multiply'});
        if (g.cam >= 0) q.setAttribute('clip-path', 'url(#inc'+g.cam+')');
        gLum.appendChild(q);
        cate++;
      });
      return cate;
    }
    return {lumina:lumina};
  }
  return {creeaza:creeaza, TIP:TIP};
})();
