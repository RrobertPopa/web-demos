/* ============================================================
   APOTECA ORIONIS — comportamentul comun al celor trei pagini
   Fara biblioteci. Ruleaza si de pe file://, deschis cu dublu-click.
   ============================================================ */
(function () {
  'use strict';

  var REDUS = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lei = function (n) { return n.toLocaleString('ro-RO') + ' lei'; };
  var gasesteProdus = function (id) {
    for (var i = 0; i < PRODUSE.length; i++) if (PRODUSE[i].id === id) return PRODUSE[i];
    return null;
  };

  /* ---------- 1. CERUL: trei straturi de stele pe canvas ---------- */
  function cer() {
    var c = document.getElementById('cer');
    if (!c) return;
    var ctx = c.getContext('2d'), stele = [], w = 0, h = 0, dpr = Math.min(devicePixelRatio || 1, 2);
    var mx = 0, my = 0, tx = 0, ty = 0;

    function seteaza() {
      w = innerWidth; h = innerHeight;
      c.width = w * dpr; c.height = h * dpr; c.style.width = w + 'px'; c.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stele = [];
      var n = Math.round((w * h) / 5200);
      for (var i = 0; i < n; i++) {
        var strat = i % 3;
        stele.push({
          x: Math.random() * w, y: Math.random() * h * 1.6,
          r: [0.5, 0.9, 1.5][strat] * (0.6 + Math.random() * 0.9),
          strat: strat,
          faza: Math.random() * Math.PI * 2,
          viteza: 0.6 + Math.random() * 1.4
        });
      }
    }

    function deseneaza(t) {
      ctx.clearRect(0, 0, w, h);
      tx += (mx - tx) * 0.05; ty += (my - ty) * 0.05;
      var sy = scrollY || 0;
      for (var i = 0; i < stele.length; i++) {
        var s = stele[i];
        var adanc = [0.14, 0.34, 0.68][s.strat];
        var x = s.x + tx * adanc * 26;
        var y = s.y - sy * adanc * 0.22 + ty * adanc * 18;
        y = ((y % (h * 1.6)) + h * 1.6) % (h * 1.6);
        if (y > h + 4) continue;
        var lic = REDUS ? 0.7 : 0.55 + 0.45 * Math.sin(t / 900 * s.viteza + s.faza);
        ctx.globalAlpha = lic * (0.32 + adanc * 0.68);
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.2832);
        ctx.fillStyle = s.strat === 2 ? '#dfe4ff' : '#aeb6e8';
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!REDUS) requestAnimationFrame(deseneaza);
    }

    seteaza();
    addEventListener('resize', seteaza);
    if (!REDUS) {
      addEventListener('pointermove', function (e) {
        mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2;
      }, { passive: true });
      requestAnimationFrame(deseneaza);
    } else {
      deseneaza(0);
      addEventListener('scroll', function () { deseneaza(0); }, { passive: true });
    }
  }

  /* ---------- 2. COSUL: tinut in localStorage, comun pe toate paginile ---------- */
  var CHEIE = 'apoteca-cos-v1';
  function citeste() {
    try { return JSON.parse(localStorage.getItem(CHEIE)) || {}; } catch (e) { return {}; }
  }
  function scrie(c) {
    try { localStorage.setItem(CHEIE, JSON.stringify(c)); } catch (e) {}
    randeaza();
  }
  function numar(c) { var n = 0; for (var k in c) n += c[k]; return n; }
  function total(c) {
    var t = 0; for (var k in c) { var p = gasesteProdus(k); if (p) t += p.pret * c[k]; } return t;
  }

  function randeaza() {
    var c = citeste(), n = numar(c);
    var badge = document.querySelector('.cos-btn .n');
    if (badge) {
      if (badge.textContent !== String(n)) {
        var b = document.querySelector('.cos-btn');
        b.classList.remove('sare'); void b.offsetWidth; b.classList.add('sare');
      }
      badge.textContent = n;
    }
    var lista = document.getElementById('cos-lista');
    if (!lista) return;
    var chei = Object.keys(c);
    if (!chei.length) {
      lista.innerHTML = '<p class="gol">Nu ai nimic în coș.<br>Catalogul are opt lucruri.</p>';
    } else {
      lista.innerHTML = chei.map(function (k, i) {
        var p = gasesteProdus(k); if (!p) return '';
        return '<div class="rand" style="animation-delay:' + (i * 55) + 'ms">' +
          '<div class="mini">' + capsulaHTML(p.culoare) + '</div>' +
          '<div><p class="nume">' + p.nume + '</p>' +
          '<p class="meta">' + p.constelatie + ' · toxicitate ' + p.tox + '</p>' +
          '<div class="pasi"><button data-minus="' + k + '" aria-label="Mai puțin">&minus;</button>' +
          '<span class="q">' + c[k] + '</span>' +
          '<button data-plus="' + k + '" aria-label="Mai mult">+</button></div></div>' +
          '<p class="st">' + lei(p.pret * c[k]) + '</p></div>';
      }).join('');
    }
    var t = document.getElementById('cos-total');
    if (t) t.textContent = lei(total(c));
    var btn = document.getElementById('cos-plata');
    if (btn) btn.disabled = !chei.length;
  }

  function adauga(id, cate) {
    var c = citeste(); c[id] = (c[id] || 0) + (cate || 1); scrie(c);
  }
  function schimba(id, delta) {
    var c = citeste(); c[id] = (c[id] || 0) + delta;
    if (c[id] <= 0) delete c[id];
    scrie(c);
  }

  function capsulaHTML(culoare) {
    return '<div class="capsula" style="--c:' + culoare + '">' +
      '<div class="aura"></div><div class="pil"></div><div class="luciu"></div></div>';
  }
  window.capsulaHTML = capsulaHTML;

  /* ---------- 3. SERTARUL ---------- */
  function sertar() {
    var s = document.getElementById('sertar'), f = document.getElementById('fundal');
    if (!s || !f) return;
    var ultim = null;
    function deschide() {
      ultim = document.activeElement;
      s.setAttribute('data-on', '1'); f.setAttribute('data-on', '1');
      s.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
      var x = s.querySelector('.inchide'); if (x) x.focus();
    }
    function inchide() {
      s.removeAttribute('data-on'); f.removeAttribute('data-on');
      s.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (ultim && ultim.focus) ultim.focus();
    }
    document.addEventListener('click', function (e) {
      if (e.target.closest('.cos-btn')) { e.preventDefault(); deschide(); }
      if (e.target.closest('.inchide') || e.target === f) inchide();
      var m = e.target.closest('[data-minus]'), p = e.target.closest('[data-plus]');
      if (m) schimba(m.getAttribute('data-minus'), -1);
      if (p) schimba(p.getAttribute('data-plus'), 1);
      var a = e.target.closest('[data-adauga]');
      if (a) {
        e.preventDefault();
        var cant = 1, camp = document.getElementById('cantitate');
        if (camp && a.hasAttribute('data-cu-cantitate')) cant = parseInt(camp.textContent, 10) || 1;
        adauga(a.getAttribute('data-adauga'), cant);
        deschide();
      }
    });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') inchide(); });
  }

  /* ---------- 4. MENIUL pe telefon ---------- */
  function meniu() {
    var m = document.querySelector('.meniu');
    if (!m) return;
    var b = m.querySelector('.burger');
    if (b) b.addEventListener('click', function () {
      var on = m.getAttribute('data-deschis') === '1';
      m.setAttribute('data-deschis', on ? '0' : '1');
      b.setAttribute('aria-expanded', String(!on));
    });
    var aici = location.pathname.split('/').pop() || 'index.html';
    Array.prototype.forEach.call(m.querySelectorAll('.navlist a'), function (a) {
      if (a.getAttribute('href') === aici) a.setAttribute('aria-current', 'page');
    });
  }

  /* ---------- 5. APARITII la scroll + barele de toxicitate ---------- */
  function apare() {
    var tinte = document.querySelectorAll('[data-apare]');
    if (!tinte.length) return;
    if (!('IntersectionObserver' in window) || REDUS) {
      Array.prototype.forEach.call(tinte, function (t) { t.classList.add('vazut'); porneste(t); });
      return;
    }
    var io = new IntersectionObserver(function (intrari) {
      intrari.forEach(function (i) {
        if (!i.isIntersecting) return;
        var el = i.target, d = parseInt(el.getAttribute('data-apare'), 10) || 0;
        setTimeout(function () { el.classList.add('vazut'); porneste(el); }, d);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    Array.prototype.forEach.call(tinte, function (t) { io.observe(t); });
  }
  function porneste(el) {
    var bare = el.matches('.tox') ? [el] : el.querySelectorAll('.tox');
    Array.prototype.forEach.call(bare, function (b) {
      var i = b.querySelector('.bar i');
      if (i) i.style.setProperty('--v', (parseInt(b.getAttribute('data-tox'), 10) || 0) / 100);
    });
  }

  /* ---------- 6. INCLINAREA cardurilor sub cursor ---------- */
  function inclina() {
    if (REDUS || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest('.card');
      if (!c) return;
      var r = c.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = 'perspective(900px) rotateX(' + (-y * 6).toFixed(2) + 'deg) rotateY(' +
        (x * 7).toFixed(2) + 'deg) translateY(-4px)';
    }, { passive: true });
    document.addEventListener('pointerout', function (e) {
      var c = e.target.closest('.card');
      if (c && !c.contains(e.relatedTarget)) c.style.transform = '';
    }, { passive: true });
  }

  /* ---------- pornire ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    cer(); meniu(); sertar(); randeaza(); apare(); inclina();
    if (typeof PAGINA === 'function') PAGINA({ PRODUSE: PRODUSE, gasesteProdus: gasesteProdus, lei: lei, capsulaHTML: capsulaHTML, apare: apare });
  });
})();
