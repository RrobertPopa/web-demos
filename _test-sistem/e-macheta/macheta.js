/* Macheta: 24 de apartamente desenate ca volume izometrice, luminate de Soare.
   Nu e o poza si nu e o imagine generata — e geometrie, deci se poate si atinge. */
var Macheta = (function(){
  // axele izometrice: x merge spre dreapta-jos (lungimea cladirii), y spre stanga-jos (adancimea)
  var UX = 62, UY = 31, VX = 46, VY = 23, FH = 44;
  var GX = 3, GY = 2, NIV = 4;                 // 3 lung, 2 adanc, 4 niveluri
  var MARG = 26;
  var LAT_MOD = (GX*UX + GY*VX) + MARG*2;      // 278 + margini
  var INA_MOD = (GX*UY + GY*VY + NIV*FH) + MARG*2;

  function creeaza(cv, cfg){
    var ctx = cv.getContext('2d');
    var hit = document.createElement('canvas');
    var hctx = hit.getContext('2d', {willReadFrequently:true});
    var S = 1, OX = 0, OY = 0, dpr = 1;
    var peste = null, ales = cfg.ales || null, filtru = function(){ return true; };

    function P(gx, gy, z){
      return { x: OX + (gx*UX - gy*VX) * S,
               y: OY + (gx*UY + gy*VY - z*FH) * S };
    }
    function poly(c, pts, fill, stroke, lw){
      c.beginPath(); c.moveTo(pts[0].x, pts[0].y);
      for (var i=1;i<pts.length;i++) c.lineTo(pts[i].x, pts[i].y);
      c.closePath();
      if (fill){ c.fillStyle = fill; c.fill(); }
      if (stroke){ c.strokeStyle = stroke; c.lineWidth = (lw||1); c.stroke(); }
    }
    function nuanta(rgb, k){
      return 'rgb('+Math.round(Math.min(255,rgb[0]*k))+','+
                    Math.round(Math.min(255,rgb[1]*k))+','+
                    Math.round(Math.min(255,rgb[2]*k))+')';
    }

    function masoara(){
      var r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width  = Math.round(r.width  * dpr);
      cv.height = Math.round(r.height * dpr);
      hit.width = cv.width; hit.height = cv.height;
      S = Math.min(r.width / LAT_MOD, r.height / INA_MOD);
      // centrat: coltul din stanga al modelului e la -GY*VX
      OX = (r.width  - (GX*UX + GY*VX) * S) / 2 + GY*VX*S;
      OY = (r.height - (GX*UY + GY*VY + NIV*FH) * S) / 2 + NIV*FH*S;
    }

    function fete(a){
      var z0 = a.et, z1 = a.et + 1, gx = a.gx, gy = a.gy;
      return {
        sus:   [P(gx,gy,z1), P(gx+1,gy,z1), P(gx+1,gy+1,z1), P(gx,gy+1,z1)],
        est:   [P(gx+1,gy,z1), P(gx+1,gy+1,z1), P(gx+1,gy+1,z0), P(gx+1,gy,z0)],
        sud:   [P(gx,gy+1,z1), P(gx+1,gy+1,z1), P(gx+1,gy+1,z0), P(gx,gy+1,z0)]
      };
    }

    // ferestre pe fata de sud a fiecarui volum
    function ferestre(c, a, lum, activ, fata){
      var f = fete(a)[fata || 'sud'], n = (fata === 'est') ? 1 : (a.cam === 3 ? 3 : 2);
      for (var i=0;i<n;i++){
        var u0 = (i + .30) / n, u1 = (i + .80) / n, v0 = .22, v1 = .74;
        if (fata === 'est'){ u0 = .34; u1 = .70; }
        function pt(u,v){
          var A = {x:f[0].x + (f[1].x-f[0].x)*u, y:f[0].y + (f[1].y-f[0].y)*u};
          var B = {x:f[3].x + (f[2].x-f[3].x)*u, y:f[3].y + (f[2].y-f[3].y)*u};
          return {x:A.x + (B.x-A.x)*v, y:A.y + (B.y-A.y)*v};
        }
        var q = [pt(u0,v0), pt(u1,v0), pt(u1,v1), pt(u0,v1)];
        // sticla: reflecta cerul ziua, se aprinde cald cand soarele e jos
        var cald = Math.pow(1 - lum, 1.6);
        var sticla = activ
          ? 'rgb('+Math.round(96+150*cald)+','+Math.round(112+96*cald)+','+Math.round(132+10*cald)+')'
          : 'rgb(168,168,164)';
        poly(c, q, sticla, 'rgba(21,23,27,.30)', Math.max(.6, .9*S));
      }
    }

    function deseneaza(){
      var r = cv.getBoundingClientRect();
      var S_ = Sit.Soare, lum = S_.inaltime(), az = S_.azimut();
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.clearRect(0,0,r.width,r.height);

      // placa de sol
      var sol = [P(-0.45,-0.45,0), P(GX+0.45,-0.45,0), P(GX+0.45,GY+0.45,0), P(-0.45,GY+0.45,0)];
      poly(ctx, sol, '#e3ddcd', 'rgba(21,23,27,.10)', 1);

      // umbra: amprenta cladirii impinsa in directia opusa soarelui, lunga cand soarele e jos
      var lg = (1 - lum) * 1.5 + 0.25;
      var dx = az * lg, dy = -0.42 * lg;
      var um = [P(-0.05+dx,-0.05+dy,0), P(GX+0.05+dx,-0.05+dy,0),
                P(GX+0.05+dx,GY+0.05+dy,0), P(-0.05+dx,GY+0.05+dy,0)];
      ctx.save(); ctx.globalAlpha = .10 + .10*lum;
      poly(ctx, um, '#15171b'); ctx.restore();

      // caroiajul soclului
      ctx.save(); ctx.strokeStyle = 'rgba(21,23,27,.09)'; ctx.lineWidth = 1;
      for (var i=0;i<=GX;i++){ var a1=P(i,-0.45,0), a2=P(i,GY+0.45,0);
        ctx.beginPath(); ctx.moveTo(a1.x,a1.y); ctx.lineTo(a2.x,a2.y); ctx.stroke(); }
      for (var j=0;j<=GY;j++){ var b1=P(-0.45,j,0), b2=P(GX+0.45,j,0);
        ctx.beginPath(); ctx.moveTo(b1.x,b1.y); ctx.lineTo(b2.x,b2.y); ctx.stroke(); }
      ctx.restore();

      // luminozitatea fetelor, din pozitia soarelui
      var kSus = .64 + .30*lum;
      var kEst = .52 + .34*Math.max(0, -az) + .12*lum;   // dimineata
      var kSud = .60 + .30*lum;
      var kVest= .52 + .34*Math.max(0,  az) + .12*lum;

      // pictorul: de la spate spre fata, de jos in sus
      var lista = AP.slice().sort(function(a,b){
        return (a.gx + a.gy) - (b.gx + b.gy) || a.et - b.et;
      });
      hctx.setTransform(dpr,0,0,dpr,0,0);
      hctx.clearRect(0,0,r.width,r.height);

      lista.forEach(function(a, idx){
        var potrivit = filtru(a);
        var f = fete(a);
        var baza = potrivit && a.liber ? [253,251,246] : [214,209,198];
        var al = 1;   // corpul cladirii ramane intreg; filtrul se vede din ferestre, nu din gauri
        ctx.save(); ctx.globalAlpha = al;
        var muchie = 'rgba(21,23,27,'+(potrivit?.34:.16)+')';
        poly(ctx, f.est, nuanta(baza, a.gx===GX-1 ? kEst : kEst*.94), muchie, 1);
        poly(ctx, f.sud, nuanta(baza, kSud), muchie, 1);
        poly(ctx, f.sus, nuanta(baza, kSus), muchie, 1);
        ferestre(ctx, a, lum, potrivit && a.liber);
        if (a.gx === GX-1) ferestre(ctx, a, lum, potrivit && a.liber, 'est');

        var e = (peste === a.id) || (ales === a.id);
        if (e){
          poly(ctx, f.sus, 'rgba(31,79,216,'+(ales===a.id?.30:.16)+')', '#1f4fd8', Math.max(1.6, 2.2*S));
          poly(ctx, f.sud, 'rgba(31,79,216,'+(ales===a.id?.16:.08)+')', '#1f4fd8', Math.max(1.2, 1.6*S));
          poly(ctx, f.est, null, '#1f4fd8', Math.max(1.2, 1.6*S));
        }
        ctx.restore();

        if (potrivit){                       // masca de nimerit cu cursorul
          var c = 'rgb('+((idx>>16)&255)+','+((idx>>8)&255)+','+(idx&255)+')';
          poly(hctx, f.est, c); poly(hctx, f.sud, c); poly(hctx, f.sus, c);
        }
      });

      // soarele, ca disc mic pe traiectoria lui, ca sa se vada CE misca
      var cx = r.width/2, cy = r.height*0.80;
      var rzx = r.width*0.40, rzy = r.height*0.66;
      var ang = Math.PI * ((Sit.Soare.ora - 7) / 13);       // 0 = est/dreapta, PI = vest/stanga
      var sx = cx + Math.cos(ang) * rzx, sy = cy - Math.sin(ang) * rzy;
      ctx.save();
      ctx.strokeStyle = 'rgba(21,23,27,.12)'; ctx.lineWidth = 1; ctx.setLineDash([2,6]);
      ctx.beginPath(); ctx.ellipse(cx, cy, rzx, rzy, 0, Math.PI, 0); ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.shadowColor = 'rgba(232,168,37,.55)'; ctx.shadowBlur = 22;
      ctx.fillStyle = '#e8a825';
      ctx.beginPath(); ctx.arc(sx, sy, Math.max(5, 8*S), 0, 7); ctx.fill();
      ctx.restore();
    }

    function laPunct(ev){
      var r = cv.getBoundingClientRect();
      var x = Math.round((ev.clientX - r.left) * dpr), y = Math.round((ev.clientY - r.top) * dpr);
      if (x<0||y<0||x>=hit.width||y>=hit.height) return null;
      var d = hctx.getImageData(x, y, 1, 1).data;
      if (d[3] === 0) return null;
      var idx = (d[0]<<16) | (d[1]<<8) | d[2];
      var lista = AP.slice().sort(function(a,b){
        return (a.gx + a.gy) - (b.gx + b.gy) || a.et - b.et;
      });
      return lista[idx] || null;
    }

    cv.addEventListener('mousemove', function(ev){
      var a = laPunct(ev), id = a ? a.id : null;
      if (id !== peste){ peste = id; cv.style.cursor = id ? 'pointer' : 'default';
        deseneaza(); if (cfg.peste) cfg.peste(a); }
    });
    cv.addEventListener('mouseleave', function(){
      if (peste){ peste = null; deseneaza(); if (cfg.peste) cfg.peste(null); }
    });
    cv.addEventListener('click', function(ev){
      var a = laPunct(ev); if (!a) return;
      ales = a.id; deseneaza(); if (cfg.alege) cfg.alege(a);
    });

    var t = null;
    addEventListener('resize', function(){
      clearTimeout(t); t = setTimeout(function(){ masoara(); deseneaza(); }, 90);
    });
    Sit.Soare.on(function(){ deseneaza(); });
    masoara(); deseneaza();

    return {
      redeseneaza: deseneaza,
      filtreaza: function(f){ filtru = f; deseneaza(); },
      alege: function(id){ ales = id; deseneaza(); },
      evidentiaza: function(id){ if (peste!==id){ peste = id; deseneaza(); } }
    };
  }
  return {creeaza:creeaza};
})();
