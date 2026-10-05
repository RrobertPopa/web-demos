/* Comun pe cele trei pagini: meniul, soarele, parametrii din URL, aparitiile. */
var Sit = (function(){

  function param(n){
    var m = new RegExp('[?&]'+n+'=([^&#]*)').exec(location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }
  function el(id){ return document.getElementById(id); }
  var REDUS = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- soarele: un singur obiect, doua pagini --- */
  var RASARIT = 7, APUS = 20;
  var Soare = {
    ora: 10.5,
    asculta: [],
    manual: false,
    // 0 la rasarit si la apus, 1 la amiaza
    inaltime: function(){
      var t = (this.ora - RASARIT) / (APUS - RASARIT);
      return Math.max(0, Math.sin(t * Math.PI));
    },
    // -1 rasarit (est), +1 apus (vest)
    azimut: function(){
      return ((this.ora - RASARIT) / (APUS - RASARIT)) * 2 - 1;
    },
    text: function(){
      var h = Math.floor(this.ora), m = Math.round((this.ora - h) * 60 / 15) * 15;
      if (m === 60){ h++; m = 0; }
      return (h<10?'0':'')+h + ':' + (m<10?'0':'') + m;
    },
    eticheta: function(){
      if (this.ora < 9)  return 'Dimineață · soare din est';
      if (this.ora < 12) return 'Înainte de prânz';
      if (this.ora < 15) return 'Amiază · soare sus';
      if (this.ora < 18) return 'După-amiază · soare din vest';
      return 'Seară · soare jos';
    },
    set: function(o, deLaOm){
      this.ora = Math.min(APUS, Math.max(RASARIT, o));
      if (deLaOm) this.manual = true;
      for (var i=0;i<this.asculta.length;i++) this.asculta[i](this);
    },
    on: function(f){ this.asculta.push(f); f(this); }
  };

  /* controlul de soare, generat identic pe ambele pagini */
  function soare(gazda){
    gazda.classList.add('soare');
    gazda.innerHTML =
      '<span class="ora cif" id="s-ora">--:--</span>' +
      '<span class="drum"><input type="range" id="s-rng" min="7" max="20" step="0.25" ' +
        'aria-label="Ora zilei" value="'+Soare.ora+'"></span>' +
      '<span class="cat" id="s-cat">—</span>';
    var rng = el('s-rng');
    Soare.on(function(S){
      el('s-ora').textContent = S.text();
      el('s-cat').textContent = S.eticheta();
      if (document.activeElement !== rng) rng.value = S.ora;
    });
    rng.addEventListener('input', function(){ Soare.set(parseFloat(rng.value), true); });

    /* singurul lucru care se misca singur: soarele urca pana cand pui mana pe el */
    if (!REDUS){
      var ultim = 0;
      (function pas(t){
        if (!Soare.manual){
          if (ultim){
            var o = Soare.ora + (t - ultim) / 2600;   // ~o ora la 2,6 secunde
            Soare.set(o > APUS ? RASARIT : o, false);
          }
          ultim = t;
          requestAnimationFrame(pas);
        }
      })(0);
    }
  }

  /* --- meniul --- */
  function meniu(activ, ap){
    var q = ap ? ('?ap=' + ap) : '';
    document.querySelectorAll('.bara').forEach(function(b){
      b.innerHTML =
        '<div class="wrap in">' +
          '<a class="marca" href="index.html">Frunzei <b>9</b></a>' +
          '<nav class="meniu">' +
            '<a href="index.html"'+(activ==='index'?' aria-current="page"':'')+'>Ansamblul</a>' +
            '<a href="index.html#libere"'+(activ==='libere'?' aria-current="page"':'')+'>Apartamente</a>' +
            '<a href="apartament.html'+q+'"'+(activ==='ap'?' aria-current="page"':'')+'>Planul</a>' +
            '<a href="vizita.html'+q+'"'+(activ==='vizita'?' aria-current="page"':'')+'>Vizită</a>' +
          '</nav>' +
          '<a class="tel cif" href="tel:+40721000000">0721 000 000</a>' +
        '</div>';
    });
  }

  /* --- aparitiile la scroll --- */
  function apar(){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e,i){
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay = Math.min(i*70, 280) + 'ms';
        e.target.classList.add('on');
        io.unobserve(e.target);
      });
    }, {rootMargin:'0px 0px -10% 0px'});
    document.querySelectorAll('[data-ap]').forEach(function(n){ io.observe(n); });
  }

  return {param:param, el:el, Soare:Soare, soare:soare, meniu:meniu, apar:apar, REDUS:REDUS};
})();
