/* Frunzei 9 — 24 de apartamente, P+3, sase pe etaj.
   Macheta le asaza pe o grila izometrica: gx 0..2 (vest -> est), gy 0..1 (nord -> sud).
   gy=1 e fatada de sud, cea cu soare. Preturile sunt fictive, dar in intervalul real
   pentru Sector 2 in 2026: 1.750-2.150 EUR/mp utili. */
var ETAJE = ['Parter', 'Etajul 1', 'Etajul 2', 'Etajul 3'];

var AP = (function(){
  // et, gx, gy, camere, mp utili, balcon, liber
  var brut = [
    [0,0,1,2,53.4,6.2,1],[0,1,1,3,78.1,9.4,0],[0,2,1,2,54.9,6.2,1],
    [0,0,0,2,52.0,4.0,0],[0,1,0,3,76.6,5.1,0],[0,2,0,2,52.8,4.0,1],
    [1,0,1,2,53.4,6.2,0],[1,1,1,3,78.1,9.4,1],[1,2,1,2,54.9,6.2,0],
    [1,0,0,2,52.0,4.0,1],[1,1,0,3,76.6,5.1,0],[1,2,0,2,52.8,4.0,0],
    [2,0,1,2,53.4,6.2,1],[2,1,1,3,78.1,9.4,0],[2,2,1,2,54.9,6.2,1],
    [2,0,0,2,52.0,4.0,0],[2,1,0,3,76.6,5.1,1],[2,2,0,2,52.8,4.0,0],
    [3,0,1,2,58.7,14.0,1],[3,1,1,3,84.3,18.5,0],[3,2,1,2,59.1,14.0,1],
    [3,0,0,2,55.2,9.0,0],[3,1,0,3,80.4,11.2,1],[3,2,0,2,55.9,9.0,0]
  ];
  return brut.map(function(r, i){
    var et=r[0], gx=r[1], gy=r[2], cam=r[3], mp=r[4], balcon=r[5], liber=!!r[6];
    // sudul si etajul de sus costa mai mult; parterul are curte, deci nu e cel mai ieftin
    var euroMp = 1750 + (gy===1 ? 150 : 0) + et*55 + (et===3 ? 60 : 0) + (et===0 ? 20 : 0);
    var orient = (gy===1 ? 'Sud' : 'Nord') + (gx===0 ? '-Vest' : gx===2 ? '-Est' : '');
    return {
      nr: String((et+1)*100 + (gy*3 + gx) + 1),
      id: String(et) + String(gy) + String(gx),
      et: et, gx: gx, gy: gy, cam: cam, mp: mp, balcon: balcon, liber: liber,
      orient: orient,
      pret: Math.round(mp * euroMp / 500) * 500,
      // cate ore de soare direct primeste, pe zi, in martie
      soare: gy===1 ? (6.5 + et*0.4) : (gx===1 ? 0 : 2.0 + et*0.5)
    };
  });
})();

var SUMA = {
  total: AP.length,
  libere: AP.filter(function(a){return a.liber}).length
};

function apDupaId(id){
  for (var i=0;i<AP.length;i++) if (AP[i].id === id) return AP[i];
  return null;
}
function bani(n){ return n.toLocaleString('ro-RO').replace(/ /g,'.') + ' €'; }
function mp(n){ return n.toFixed(1).replace('.', ',') + ' m²'; }
