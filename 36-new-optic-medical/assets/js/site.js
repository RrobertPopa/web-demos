/* New Optic Medical — trei lucruri mici. Nimic nu depinde de fetch, deci
   paginile merg si deschise cu dublu-click de pe disc. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1 · dezvaluirea la intrare, cu plasa de siguranta pe scroll ---------- */
  var els = [].slice.call(document.querySelectorAll('.rise'));
  if (reduce) { els.forEach(function (e) { e.classList.add('in'); }); els = []; }
  var io = window.IntersectionObserver ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      var i = els.indexOf(e.target); if (i > -1) els.splice(i, 1);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 }) : null;
  if (io) els.slice().forEach(function (el) { io.observe(el); });

  function sweep() {
    for (var i = els.length - 1; i >= 0; i--) {
      var r = els[i].getBoundingClientRect();
      if (r.top < innerHeight * 0.94 && r.bottom > 0) { els[i].classList.add('in'); els.splice(i, 1); }
    }
  }

  /* 2 · LENTILA. Titlul e scris de doua ori: dedesubt neclar, deasupra clar
        si decupat la un cerc. Cercul urmareste cursorul, iar pe telefon
        traverseaza singur pe masura ce derulezi. Asta e ce face un ochelar:
        corecteaza exact acolo unde te uiti. -------------------------------- */
  var lens = document.querySelector('[data-lens]');
  if (lens && !reduce) {
    lens.classList.add('on');
    var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    var tx = 0.5, ty = 0.46, cx = 0.5, cy = 0.46;

    if (fine) {
      lens.addEventListener('pointermove', function (e) {
        var r = lens.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width;
        ty = (e.clientY - r.top) / r.height;
      });
      lens.addEventListener('pointerleave', function () { tx = 0.5; ty = 0.46; });
    }

    var raf = 0;
    function draw() {
      raf = 0;
      if (!fine) {
        // pe telefon: cercul traverseaza titlul o data, pe masura ce hero-ul iese din ecran
        var r = lens.getBoundingClientRect();
        var p = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight + r.height)));
        tx = 0.15 + p * 0.72; ty = 0.5;
      }
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      lens.style.setProperty('--lx', (cx * 100).toFixed(2) + '%');
      lens.style.setProperty('--ly', (cy * 100).toFixed(2) + '%');
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(draw);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(draw); }
    lens.addEventListener('pointermove', kick);
    addEventListener('scroll', kick, { passive: true });
    kick();
  }

  /* 3 · anul curent in subsol -------------------------------------------- */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  var raf2 = 0;
  function onScroll() { if (!raf2) raf2 = requestAnimationFrame(function () { raf2 = 0; if (els.length) sweep(); }); }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  sweep();
})();
