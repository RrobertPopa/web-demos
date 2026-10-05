/* Sistemul — camera pilotata de scroll prin sistemul solar.
   Geometrie reala, texturi fotografice, o singura sursa de lumina in centru. */
var Scena = (function(){
  var ren, sc, cam, compus, bloom, ceas = 0, gata = false;
  var soare, lumina, stele, cale, centura;
  var corp = {};                       // id -> {grup, glob, raza, poz}
  var p = 0, pTinta = 0;
  var REDUS = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var V = THREE.Vector3;

  /* ---- planetele: pozitie pe un arc larg, ca drumul camerei sa nu fie o linie dreapta ---- */
  var LISTA = [
    {id:'mercur', R: 46,  raza:1.3, tex:'mercur', zi: 58.6, incl:0.00},
    {id:'venus',  R: 74,  raza:2.3, tex:'venus',  zi:-243,  incl:2.64},
    {id:'pamant', R:104,  raza:2.5, tex:'pamant', zi:  1,   incl:23.4},
    {id:'marte',  R:136,  raza:1.7, tex:'marte',  zi:  1.03,incl:25.2},
    {id:'jupiter',R:236,  raza:8.2, tex:'jupiter',zi:  0.41,incl:3.13},
    {id:'saturn', R:336,  raza:7.0, tex:'saturn', zi:  0.45,incl:26.7},
    {id:'uranus', R:438,  raza:3.7, tex:'uranus', zi: -0.72,incl:97.8},
    {id:'neptun', R:516,  raza:3.6, tex:'neptun', zi:  0.67,incl:28.3}
  ];
  function pozPlaneta(i){
    var u = 0.135 * i;
    var r = LISTA[i].R;
    return new V(Math.cos(u)*r, Math.sin(i*1.7)*3.5, Math.sin(u)*r);
  }

  function textura(src, srgb){
    var t = new THREE.TextureLoader().load(src);
    if (srgb !== false) t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 4;
    return t;
  }

  function init(canvas){
    ren = new THREE.WebGLRenderer({canvas:canvas, antialias:true, powerPreference:'high-performance'});
    ren.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 760 ? 1.4 : 1.8));
    ren.outputEncoding = THREE.sRGBEncoding;
    ren.toneMapping = THREE.ACESFilmicToneMapping;
    ren.toneMappingExposure = 0.98;

    sc = new THREE.Scene();
    cam = new THREE.PerspectiveCamera(46, 1, 0.5, 6000);

    /* Calea Lactee: panorama reala, pusa pe interiorul unei sfere uriase */
    var cer = new THREE.Mesh(
      new THREE.SphereGeometry(2600, 60, 40),
      new THREE.MeshBasicMaterial({map:textura(TEX.caleaLactee), side:THREE.BackSide,
        depthWrite:false, toneMapped:false})
    );
    cer.rotation.z = 0.38;
    cer.rotation.y = 0.79;   // miezul galactic ajunge in dreptul camerei de la inceput
    sc.add(cer); cale = cer;

    /* stele suplimentare, ca sa existe paralaxa fata de panorama */
    var g = new THREE.BufferGeometry(), poz = [], cul = [], c = new THREE.Color();
    for (var i=0;i<2600;i++){
      var r = 700 + Math.random()*1500;
      var th = Math.random()*Math.PI*2, ph = Math.acos(2*Math.random()-1);
      poz.push(r*Math.sin(ph)*Math.cos(th), r*Math.cos(ph), r*Math.sin(ph)*Math.sin(th));
      // stelele reale nu sunt albe: de la portocaliu-rece la albastru-fierbinte
      c.setHSL(0.08 + Math.random()*0.56, 0.32 + Math.random()*0.3, 0.62 + Math.random()*0.3);
      cul.push(c.r, c.g, c.b);
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(poz,3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(cul,3));
    stele = new THREE.Points(g, new THREE.PointsMaterial({size:2.4, sizeAttenuation:true,
      vertexColors:true, transparent:true, opacity:.95, depthWrite:false}));
    sc.add(stele);

    /* Soarele: o sursa de lumina in centru, plus sfera emisiva peste care cade bloom-ul */
    lumina = new THREE.PointLight(0xfff0d4, 1.2, 0, 2);
    lumina.position.set(0,0,0);
    sc.add(lumina);
    sc.add(new THREE.AmbientLight(0x2a3050, 0.16));    // lumina reflectata, foarte slaba

    soare = new THREE.Mesh(new THREE.SphereGeometry(17, 72, 48),
      new THREE.MeshBasicMaterial({map:textura(TEX.soare), toneMapped:false}));
    sc.add(soare);
    var cv = document.createElement('canvas'); cv.width = cv.height = 256;
    var cx2 = cv.getContext('2d');
    var gr = cx2.createRadialGradient(128,128,10, 128,128,128);
    // gaura la mijloc: coroana e in jurul discului, nu peste el
    gr.addColorStop(0.00,'rgba(255,224,160,0)');
    gr.addColorStop(0.285,'rgba(255,224,160,0)');
    gr.addColorStop(0.325,'rgba(255,216,146,0.50)');
    gr.addColorStop(0.42,'rgba(255,178,86,0.20)');
    gr.addColorStop(0.62,'rgba(255,142,52,0.065)');
    gr.addColorStop(1.00,'rgba(255,128,36,0)');
    cx2.fillStyle = gr; cx2.fillRect(0,0,256,256);
    var tg = new THREE.CanvasTexture(cv);
    var coroana = new THREE.Sprite(new THREE.SpriteMaterial({map:tg, color:0xffffff,
      blending:THREE.AdditiveBlending, depthWrite:false, depthTest:false, toneMapped:false}));
    coroana.scale.set(104,104,1);
    sc.add(coroana);

    /* planetele */
    LISTA.forEach(function(d, i){
      var grup = new THREE.Group();
      grup.position.copy(pozPlaneta(i));
      var cade = Math.max(0.52, 0.95 - i*0.06);    // cadere de lumina comprimata
      var mat = new THREE.MeshStandardMaterial({map:textura(TEX[d.tex]), roughness:0.92, metalness:0});
      mat.color.setScalar(Math.min(1, cade));
      var glob = new THREE.Mesh(new THREE.SphereGeometry(d.raza, 72, 48), mat);
      glob.rotation.z = THREE.MathUtils.degToRad(d.incl);
      grup.add(glob);
      sc.add(grup);
      corp[d.id] = {grup:grup, glob:glob, raza:d.raza, poz:grup.position.clone(), zi:d.zi};
    });

    /* Pamantul: nori separati, atmosfera cu Fresnel, si Luna */
    var P = corp.pamant;
    var nori = new THREE.Mesh(new THREE.SphereGeometry(P.raza*1.012, 64, 44),
      new THREE.MeshStandardMaterial({map:textura(TEX.norii), alphaMap:textura(TEX.norii, false),
        transparent:true, opacity:.94, roughness:1, metalness:0, depthWrite:false}));
    nori.rotation.z = P.glob.rotation.z;
    P.grup.add(nori); P.nori = nori;
    P.grup.add(new THREE.Mesh(new THREE.SphereGeometry(P.raza*1.032, 56, 36),
      haloMaterial(0x6aa6ff, 3.6, 0.62)));

    var luna = new THREE.Mesh(new THREE.SphereGeometry(0.68, 48, 32),
      new THREE.MeshStandardMaterial({map:textura(TEX.luna), roughness:1, metalness:0}));
    var lunaOrb = new THREE.Group(); lunaOrb.add(luna); luna.position.set(7.2, 1.1, -2.4);
    P.grup.add(lunaOrb); P.luna = lunaOrb;

    /* Saturn: inel real, cu UV-uri refacute ca textura sa mearga pe raza */
    var S = corp.saturn;
    var ig = new THREE.RingGeometry(S.raza*1.28, S.raza*2.28, 160, 1);
    var pos = ig.attributes.position, uv = ig.attributes.uv, v3 = new V();
    for (var k=0;k<pos.count;k++){
      v3.fromBufferAttribute(pos, k);
      var t = (v3.length() - S.raza*1.28) / (S.raza*1.0);
      uv.setXY(k, t, k % 2);
    }
    var inel = new THREE.Mesh(ig, new THREE.MeshStandardMaterial({
      map:textura(TEX.inel), alphaMap:textura(TEX.inel, false), transparent:true,
      side:THREE.DoubleSide, roughness:1, metalness:0, depthWrite:false, opacity:.96}));
    inel.rotation.x = Math.PI/2;
    inel.rotation.y = THREE.MathUtils.degToRad(S.glob.rotation.z * 0);
    var portInel = new THREE.Group();
    portInel.rotation.z = THREE.MathUtils.degToRad(26.7);
    portInel.add(inel);
    S.grup.add(portInel); S.inel = portInel;

    /* centura de asteroizi: geometrie instantiata, luminata de aceeasi stea */
    function piatra(sam){
      var g2 = new THREE.IcosahedronGeometry(1, 2);
      var a2 = g2.attributes.position, v2 = new V();
      for (var q=0;q<a2.count;q++){
        v2.fromBufferAttribute(a2, q);
        var n2 = 0.66 + Math.abs(Math.sin(v2.x*3.1+sam) * Math.cos(v2.y*2.7-sam) + Math.sin(v2.z*4.3)) * 0.42;
        v2.multiplyScalar(n2);
        a2.setXYZ(q, v2.x, v2.y, v2.z);
      }
      g2.computeVertexNormals();
      return g2;
    }
    var cm = new THREE.MeshStandardMaterial({map:textura(TEX.luna), color:0x8f8779,
      roughness:1, metalness:0.02, transparent:true, opacity:1});
    centura = new THREE.Group();
    var buc = [new THREE.InstancedMesh(piatra(0.4), cm, 500),
               new THREE.InstancedMesh(piatra(1.9), cm, 500),
               new THREE.InstancedMesh(piatra(3.3), cm, 500)];
    buc.forEach(function(b){ centura.add(b); });
    centura.material = cm;
    var M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), Sv = new V();
    for (var j=0;j<1500;j++){
      var ang = Math.random()*Math.PI*2;
      var rad = 158 + Math.random()*46;
      var pz = new V(Math.cos(ang)*rad, (Math.random()-0.5)*13, Math.sin(ang)*rad);
      E.set(Math.random()*6, Math.random()*6, Math.random()*6);
      Q.setFromEuler(E);
      var s = 0.16 + Math.pow(Math.random(), 3)*0.85;
      Sv.set(s, s*(0.6+Math.random()*0.6), s*(0.6+Math.random()*0.6));
      M.compose(pz, Q, Sv);
      buc[j % 3].setMatrixAt(Math.floor(j/3), M);
    }
    buc.forEach(function(b){ b.instanceMatrix.needsUpdate = true; });
    sc.add(centura);

    /* bloom: numai Soarele e destul de luminos ca sa treaca de prag */
    compus = new THREE.EffectComposer(ren);
    compus.addPass(new THREE.RenderPass(sc, cam));
    bloom = new THREE.UnrealBloomPass(new THREE.Vector2(1,1), 0.58, 0.55, 0.74);
    compus.addPass(bloom);

    masoara();
    addEventListener('resize', masoara);
    gata = true;
    requestAnimationFrame(cadru);
  }

  /* stralucirea de la margine: mai tare acolo unde bate steaua */
  function haloMaterial(culoare, putere, intens){
    return new THREE.ShaderMaterial({
      uniforms:{ cul:{value:new THREE.Color(culoare)}, put:{value:putere}, itn:{value:intens},
                 soare:{value:new V(0,0,0)} },
      vertexShader:
        'varying vec3 vN; varying vec3 vW; varying vec3 vL;' +
        'void main(){ vN = normalize(normalMatrix * normal);' +
        ' vL = normalize(mat3(modelMatrix) * normal);' +
        ' vW = (modelMatrix * vec4(position,1.0)).xyz;' +
        ' gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader:
        'uniform vec3 cul; uniform float put; uniform float itn; uniform vec3 soare;' +
        'varying vec3 vN; varying vec3 vW; varying vec3 vL;' +
        'void main(){ float f = pow(1.0 - abs(dot(vN, vec3(0.0,0.0,1.0))), put);' +
        ' vec3 ls = normalize(soare - vW);' +
        // atmosfera se vede acolo unde bate steaua si se stinge pe partea de noapte
        ' float zi = clamp(dot(vL, ls) * 1.5 + 0.28, 0.0, 1.0);' +
        ' gl_FragColor = vec4(cul, f * itn * zi * zi); }',
      side:THREE.BackSide, blending:THREE.AdditiveBlending, transparent:true, depthWrite:false
    });
  }

  function masoara(){
    var w = innerWidth, h = innerHeight;
    ren.setSize(w, h, false);
    compus.setSize(w, h);
    bloom.setSize(w, h);
    cam.aspect = w / h;
    // pe ecran ingust campul vizual se deschide, altfel planeta iese din cadru
    cam.fov = w / h < 0.85 ? 62 : 46;
    cam.updateProjectionMatrix();
  }

  /* ---------- drumul camerei ---------- */
  function P(id){ return corp[id].poz; }
  function langa(id, spre_, sus_, lat_, dist){
    var c = corp[id];
    var spre = c.poz.clone().negate().normalize();          // directia catre Soare
    var sus = new V(0,1,0);
    var lat = new V().crossVectors(spre, sus).normalize();
    var d = new V().addScaledVector(spre, spre_)
                   .addScaledVector(sus, sus_)
                   .addScaledVector(lat, lat_)
                   .normalize().multiplyScalar(c.raza * dist);
    return {p: c.poz.clone().add(d), t: c.poz.clone()};
  }
  var ACTE = null;
  function repere(){
    var bp = new V().addVectors(P('marte'), P('jupiter')).multiplyScalar(0.5);
    var R = {
      intro:  {s:{p:new V(-900,210,980),  t:new V(0,0,0)},  a:{p:new V(-250,76,316), t:new V(0,0,0)}},
      soare:  {s:{p:new V(-92,27,112),    t:new V(0,0,0)},  a:{p:new V(-26,7,31),    t:new V(0,0,0)}},
      // spre Soare / sus / lateral / distanta in raze. Lateralul alterneaza, ca sa nu
      // fie toate planetele luminate din aceeasi parte.
      mercur: {s:langa('mercur', .5,.3, .95, 6.5), a:langa('mercur', .52,.22, .9, 2.7)},
      venus:  {s:langa('venus',  .5,.28,-.95, 6.0), a:langa('venus',  .55,.2,-.88, 2.4)},
      pamant: {s:langa('pamant', .48,.3, .95, 6.0), a:langa('pamant', .52,.22, .86, 2.5)},
      marte:  {s:langa('marte',  .5,.26,-.95, 6.0), a:langa('marte',  .55,.2,-.9,  2.5)},
      centura:{s:{p:bp.clone().add(new V(-34,12,-26)), t:P('jupiter')},
               a:{p:bp.clone().add(new V(16,-2,12)),   t:P('jupiter')}},
      jupiter:{s:langa('jupiter',.46,.3,  .95, 4.2), a:langa('jupiter',.55,.2,  .82, 2.7)},
      // la Saturn camera trece prin planul inelelor: de dedesubt, deasupra
      saturn: {s:langa('saturn', .5,-.62,-.9,  5.0), a:langa('saturn', .56,.72,-.72, 3.3)},
      uranus: {s:langa('uranus', .48,.3,  .95, 4.2), a:langa('uranus', .55,.22, .85, 2.9)},
      neptun: {s:langa('neptun', .48,.28,-.95, 4.2), a:langa('neptun', .55,.2, -.86, 3.0)},
      final:  {s:{p:new V(120,190,940),   t:new V(180,0,150)},
               a:{p:new V(-520,660,1780), t:new V(150,0,80)}}
    };
    return R;
  }
  var netede = function(x){ return x*x*(3-2*x); };
  function pune(acte){ ACTE = acte; }

  function camera(){
    if (!ACTE) return;
    var R = repere(), i, k = 0, f = 0;
    for (i=0;i<ACTE.length;i++){
      if (p <= ACTE[i].la || i === ACTE.length-1){
        k = i; f = (p - ACTE[i].de) / Math.max(1e-6, ACTE[i].la - ACTE[i].de); break;
      }
    }
    f = Math.min(1, Math.max(0, f));
    var acum = R[ACTE[k].id]; if (!acum) return;
    var dinainte = k > 0 ? R[ACTE[k-1].id].a : acum.s;   // continuitate: pornesc de unde am ramas

    var pz, tn;
    if (f < 0.42){                       // drumul de la corpul dinainte pana in dreptul celui nou
      var e = netede(f / 0.42);
      pz = new V().lerpVectors(dinainte.p, acum.s.p, e);
      tn = new V().lerpVectors(dinainte.t, acum.s.t, e);
    } else {                             // apropierea, cat timp textul e pe ecran
      var e2 = netede((f - 0.42) / 0.58);
      pz = new V().lerpVectors(acum.s.p, acum.a.p, e2);
      tn = new V().lerpVectors(acum.s.t, acum.a.t, e2);
    }
    cam.position.copy(pz);
    // un balans foarte lent: camera nu e prinsa in menghina
    if (!REDUS){
      cam.position.x += Math.sin(ceas*0.13) * 0.9;
      cam.position.y += Math.cos(ceas*0.1) * 0.7;
    }
    cam.lookAt(tn);
    if (!REDUS) cam.rotation.z += Math.sin(ceas*0.07) * 0.012;
  }

  function cadru(){
    requestAnimationFrame(cadru);
    if (!gata) return;
    ceas += 0.016;
    p += (pTinta - p) * (REDUS ? 1 : 0.075);      // scroll cu inertie
    camera();

    var dt = REDUS ? 0 : 0.016;
    soare.rotation.y += dt*0.012;
    cale.rotation.y  += dt*0.0016;
    stele.rotation.y += dt*0.0012;
    centura.rotation.y += dt*0.006;
    var rc = Math.sqrt(cam.position.x*cam.position.x + cam.position.z*cam.position.z);
    var vz = Math.max(0, 1 - Math.abs(rc - 181) / 62);
    centura.material.opacity = vz;
    centura.visible = vz > 0.012;
    LISTA.forEach(function(d){
      var c = corp[d.id];
      c.glob.rotation.y += dt * (0.30 / Math.max(0.35, Math.abs(d.zi))) * (d.zi < 0 ? -1 : 1);
    });
    var Pm = corp.pamant;
    Pm.nori.rotation.y += dt*0.028;
    Pm.luna.rotation.y += dt*0.05;
    corp.saturn.inel.rotation.y += dt*0.01;

    sc.traverse(function(o){
      if (o.material && o.material.uniforms && o.material.uniforms.soare)
        o.material.uniforms.soare.value.set(0,0,0);
    });
    compus.render();
  }

  return {
    init:init, pune:pune,
    progres:function(v){ pTinta = v; },
    LISTA:LISTA
  };
})();
