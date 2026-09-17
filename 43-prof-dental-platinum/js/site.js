/* Aquadent — JS minim. Meniu mobil, reveal la citire, ziua curentă, bara lipită.
   Nimic din conținut nu depinde de JS: clasa .js de mai jos activează ascunderea. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Plasa de siguranță: fără JS, .reveal rămâne vizibil. */
  if (!reduced) root.classList.add('js');

  /* ── Meniu mobil ──────────────────────────────────────── */
  var burger = document.getElementById('burger');
  var sheet = document.getElementById('panel');
  var scrim = document.getElementById('scrim');
  var lastY = 0;

  function openMenu() {
    lastY = window.scrollY;
    sheet.hidden = false;
    scrim.hidden = false;
    /* forțează un reflow ca tranziția să pornească din starea închisă */
    void sheet.offsetWidth;
    sheet.classList.add('is-open');
    scrim.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Închide meniul');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    sheet.classList.remove('is-open');
    scrim.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Deschide meniul');
    document.body.style.overflow = '';

    var done = function () {
      sheet.hidden = true;
      scrim.hidden = true;
    };
    if (reduced) { done(); return; }
    window.setTimeout(done, 300);
  }

  function isOpen() {
    return burger.getAttribute('aria-expanded') === 'true';
  }

  burger.addEventListener('click', function () {
    isOpen() ? closeMenu() : openMenu();
  });
  scrim.addEventListener('click', closeMenu);
  sheet.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) { closeMenu(); burger.focus(); }
  });
  /* Dacă se trece pe desktop cu meniul deschis, îl închidem. */
  window.matchMedia('(min-width: 761px)').addEventListener('change', function (e) {
    if (e.matches && isOpen()) closeMenu();
  });

  /* ── Bara capătă linie după ce pleci din hero ──────────── */
  var bar = document.getElementById('bar');
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      bar.classList.toggle('is-stuck', window.scrollY > 12);
      ticking = false;
    });
  }, { passive: true });

  /* ── Reveal la citire (nu parallax: elementul apare o dată) ─ */
  var items = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* ── Ziua curentă în tabelul de program ────────────────── */
  var today = new Date().getDay();
  var row = document.querySelector('.hours li[data-day="' + today + '"]');
  if (row) row.classList.add('is-today');
})();
