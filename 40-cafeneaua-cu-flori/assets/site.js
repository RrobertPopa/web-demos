/* Cafeneaua cu Flori — comportamentul paginii. Vanilla, fara dependinte.
   Trei lucruri: parallaxul din hero, dezvaluirile la intrare, si cele doua
   piese interactive (almanahul si perechea). */
(function () {
  'use strict';

  var redus = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1 · Parallax pe planuri ──────────────────────────────────────────
     O singura bucla rAF, pornita doar cat heroul e pe ecran. Fiecare plan
     are rata lui: cel din spate se misca aproape deloc, cel din fata cel mai
     mult. Diferenta de viteza E adancimea.

     translate3d, nu top/margin: prima sta pe compositor, a doua reasezeaza
     pagina la fiecare cadru si sacadeaza exact ce incerci sa faci fluid.
     Valoarea se interpoleaza spre tinta, ca sa nu sara la scroll brusc. */
  var hero = document.querySelector('.hero');
  var plane = [].slice.call(document.querySelectorAll('.plan'));

  if (hero && plane.length && !redus) {
    var y = 0, tinta = 0, ruleaza = false, vizibil = true;

    var citeste = function () {
      var r = hero.getBoundingClientRect();
      var h = r.height || 1;
      // 0 cand heroul e exact in dreptul ecranului, 1 cand a iesit complet
      tinta = Math.min(Math.max(-r.top / h, 0), 1);
    };

    var cadru = function () {
      y += (tinta - y) * 0.11;
      if (Math.abs(tinta - y) < 0.0004) y = tinta;
      for (var i = 0; i < plane.length; i++) {
        var p = plane[i];
        var rata = parseFloat(p.getAttribute('data-rata')) || 0;
        p.style.transform = 'translate3d(0,' + (y * rata * 100).toFixed(2) + 'px,0)';
      }
      if (y !== tinta && vizibil) { requestAnimationFrame(cadru); }
      else { ruleaza = false; }
    };

    var porneste = function () {
      citeste();
      if (!ruleaza && vizibil) { ruleaza = true; requestAnimationFrame(cadru); }
    };

    window.addEventListener('scroll', porneste, { passive: true });
    window.addEventListener('resize', porneste, { passive: true });

    // Heroul iesit din ecran nu mai are ce anima: oprim bucla complet.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        vizibil = es[0].isIntersecting;
        if (vizibil) porneste();
      }, { rootMargin: '120px' }).observe(hero);
    }
    porneste();
  }

  /* ── 2 · Dezvaluiri la intrare ────────────────────────────────────────
     O singura data, la intrare. Continut care se re-ascunde la scroll in sus
     e un defect, nu un efect. */
  var deRidicat = [].slice.call(document.querySelectorAll('[data-rise]'));
  if ('IntersectionObserver' in window && !redus) {
    var io = new IntersectionObserver(function (es, obs) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('seen');
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    deRidicat.forEach(function (el, i) {
      var p = el.parentElement;
      var frati = p ? [].slice.call(p.querySelectorAll(':scope > [data-rise]')) : [];
      var poz = frati.indexOf(el);
      if (poz > 0) el.style.setProperty('--d', Math.min(poz, 6) * 80 + 'ms');
      io.observe(el);
    });
  } else {
    deRidicat.forEach(function (el) { el.classList.add('seen'); });
  }

  /* ── 3 · Bara isi ia culoarea sectiunii ───────────────────────────── */
  var bar = document.querySelector('.bar');
  if (bar && 'IntersectionObserver' in window) {
    var secte = [].slice.call(document.querySelectorAll('[data-tint]'));
    var ioBar = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = getComputedStyle(e.target).getPropertyValue('--tint').trim();
        if (t) bar.style.setProperty('--tint', t);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    secte.forEach(function (s) { ioBar.observe(s); });
  }

  /* ── 3b · Meniul de telefon ───────────────────────────────────────────
     Se inchide la click pe o legatura, la Escape si cand ecranul se face
     destul de lat cat bara orizontala sa reapara — altfel ar ramane un
     panou deschis peste un meniu care e deja vizibil. */
  var burger = document.getElementById('burger');
  var meniu  = document.getElementById('meniu');

  if (burger && meniu) {
    [].forEach.call(meniu.querySelectorAll('nav a'), function (a, i) {
      a.style.setProperty('--i', i);
    });

    var deschis = false;

    var pune = function (stare) {
      deschis = stare;
      burger.setAttribute('aria-expanded', stare ? 'true' : 'false');
      document.body.classList.toggle('blocat', stare);
      if (stare) {
        meniu.hidden = false;
        // reporneste animatia de intrare a legaturilor la fiecare deschidere
        [].forEach.call(meniu.querySelectorAll('nav a'), function (a) {
          a.style.animation = 'none';
          void a.offsetWidth;
          a.style.animation = '';
        });
      } else {
        meniu.hidden = true;
      }
    };

    burger.addEventListener('click', function () { pune(!deschis); });

    meniu.addEventListener('click', function (e) {
      if (e.target.closest('a')) pune(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && deschis) { pune(false); burger.focus(); }
    });

    var lat = window.matchMedia('(min-width: 861px)');
    var laLatime = function () { if (lat.matches && deschis) pune(false); };
    if (lat.addEventListener) lat.addEventListener('change', laLatime);
    else if (lat.addListener) lat.addListener(laLatime);
  }

  /* ── 4 · Almanahul ────────────────────────────────────────────────────
     Sezonalitate reala de florarie din Romania. Se deschide pe luna curenta. */
  var SEZON = [
    ['Ianuarie',  'Lalele de seră, zambile, frezii. Lună de culori mici, aduse în casă împotriva cenușiului de afară.'],
    ['Februarie', 'Lalele, narcise, mimoze. Mimoza e floarea lunii, chiar dacă ține doar câteva zile.'],
    ['Martie',    'Zambile, narcise, ghiocei, mărțișoare. Cea mai aglomerată lună din an pentru orice florărie.'],
    ['Aprilie',   'Lalele de câmp, liliac, ranunculus. Liliacul se vinde pe zile, nu pe săptămâni.'],
    ['Mai',       'Bujori. Luna bujorilor, și oricine lucrează cu flori o știe. Plus lăcrămioare.'],
    ['Iunie',     'Bujori târzii, trandafiri de grădină, garoafe. Începe sezonul de nunți.'],
    ['Iulie',     'Floarea-soarelui, hortensii, lavandă. Buchete care suportă căldura.'],
    ['August',    'Hortensii, dalii, lavandă uscată. Luna aranjamentelor care țin.'],
    ['Septembrie','Dalii, crizanteme timpurii, trandafiri de toamnă. Culorile se închid.'],
    ['Octombrie', 'Crizanteme, dalii târzii, frunze și ramuri. Lună de aranjamente, nu de buchete.'],
    ['Noiembrie', 'Crizanteme. Luna coroanelor și a comemorărilor.'],
    ['Decembrie', 'Crăciunițe, brad, vâsc, scoarță și conuri. Aranjamente, nu tulpini.']
  ];
  var cutiaLuni = document.getElementById('luni');
  var numeLuna  = document.getElementById('sezon-nume');
  var textLuna  = document.getElementById('sezon-text');
  var acum      = document.getElementById('sezon-acum');
  var lunaAzi   = new Date().getMonth();

  function arataLuna(i) {
    numeLuna.textContent = SEZON[i][0];
    textLuna.textContent = SEZON[i][1];
    acum.hidden = (i !== lunaAzi);
    [].forEach.call(cutiaLuni.children, function (b, n) {
      b.setAttribute('aria-pressed', n === i ? 'true' : 'false');
    });
  }
  if (cutiaLuni) {
    SEZON.forEach(function (m, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = m[0].slice(0, 3);
      b.setAttribute('aria-label', m[0]);
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { arataLuna(i); });
      cutiaLuni.appendChild(b);
    });
    arataLuna(lunaAzi);
  }

  /* ── 5 · Perechea ─────────────────────────────────────────────────────
     O singura coloana: cardul cu raspunsul sus, selectorul dedesubt. Pe
     telefon randul de optiuni se trage cu degetul. Butonul de sens schimba
     directia: bautura -> floare, sau floare -> bautura. */
  var PERECHI = [
    { bautura: 'Ciocolată caldă', floare: 'Bujor',
      de: 'Amândouă sunt dense și scurte ca sezon. Le iei și le ții cât durează.' },
    { bautura: 'Espresso', floare: 'Garoafă',
      de: 'Mic, tare, subestimat. Garoafa ține două săptămâni; espresso-ul, două minute.' },
    { bautura: 'Cappuccino', floare: 'Frezie',
      de: 'Dulce fără să fie dulceag. Freziile miros a dimineață care nu se grăbește.' },
    { bautura: 'Ceai de plante', floare: 'Lavandă',
      de: 'Aceeași plantă poate ajunge în ceașcă sau în buchet. Alegi tu.' }
  ];
  var GLIFE = [
    '<circle cx="60" cy="50" r="15"/><path d="M60 35c0-14 9-22 19-22 0 13-8 22-19 22ZM60 35c0-14-9-22-19-22 0 13 8 22 19 22Z"/><path d="M60 65v45"/><path d="M60 88c-9-3-14-9-14-17 9 0 15 7 14 17Z"/>',
    '<path d="M60 32c8 0 14 6 14 14 0 10-6 16-14 20-8-4-14-10-14-20 0-8 6-14 14-14Z"/><path d="M48 42c-4-4-4-10 0-12M72 42c4-4 4-10 0-12"/><path d="M60 66v44"/>',
    '<path d="M60 28c6 4 9 10 9 17s-3 13-9 17c-6-4-9-10-9-17s3-13 9-17Z"/><circle cx="60" cy="45" r="4"/><path d="M60 62v48"/><path d="M60 86c-8-2-13-8-13-15 8 0 14 6 13 15Z"/>',
    '<path d="M60 24v86"/><path d="M60 36c-5-2-8-6-8-11 6 0 9 4 8 11ZM60 36c5-2 8-6 8-11-6 0-9 4-8 11ZM60 50c-5-2-8-6-8-11 6 0 9 4 8 11ZM60 50c5-2 8-6 8-11-6 0-9 4-8 11ZM60 64c-5-2-8-6-8-11 6 0 9 4 8 11ZM60 64c5-2 8-6 8-11-6 0-9 4-8 11Z"/>'
  ];
  var card   = document.getElementById('pereche-card');
  var glif   = document.getElementById('pereche-glif');
  var iesire = document.getElementById('pereche-out');
  var motiv  = document.getElementById('pereche-de');
  var chips  = document.getElementById('pereche-chips');
  var eticheta = document.getElementById('pereche-eticheta');
  var butonSens = document.getElementById('pereche-sens');
  var dinFloare = false;
  var ales = 0;

  function scrieChips() {
    if (!chips) return;
    chips.innerHTML = '';
    PERECHI.forEach(function (p, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = dinFloare ? p.floare : p.bautura;
      b.setAttribute('aria-pressed', i === ales ? 'true' : 'false');
      b.addEventListener('click', function () { alege(i); });
      chips.appendChild(b);
    });
    eticheta.textContent = dinFloare ? 'Alege floarea' : 'Alege băutura';
  }

  function alege(i) {
    ales = i;
    var p = PERECHI[i];
    [].forEach.call(chips.children, function (b, n) {
      b.setAttribute('aria-pressed', n === i ? 'true' : 'false');
    });
    var scrie = function () {
      glif.innerHTML = GLIFE[i];
      iesire.textContent = dinFloare ? p.bautura : p.floare;
      motiv.textContent = p.de;
      card.classList.remove('swap');
    };
    if (redus) { scrie(); return; }
    card.classList.add('swap');
    setTimeout(scrie, 220);
  }

  if (chips && butonSens) {
    butonSens.addEventListener('click', function () {
      dinFloare = !dinFloare;
      butonSens.classList.toggle('on', dinFloare);
      butonSens.setAttribute('aria-pressed', dinFloare ? 'true' : 'false');
      scrieChips();
      alege(ales);
    });
    scrieChips();
    alege(0);
  }
})();
