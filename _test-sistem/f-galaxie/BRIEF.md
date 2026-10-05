# BRIEF — Sistemul

**Autoritate estetică:** `os/capabilities/web/` + `04-3d.md`. Fără scroll-craft (motorul lui nu
știe WebGL; camera e scrisă de mână).
**Referință vizuală:** Autorat sub delegare explicită. Robert: „fă-mi un site cu galaxii… când dau
scroll să văd planete, stele, animații, dar să fie totul **real**… nu grafica ta voxel… vreau să
zic «Uau», să fie realist."

## Ce e și pentru cine
Nu e un site de client. E **proba** că pot construi 3D real în browser, cerută după ce Robert a
respins de două ori grafica desenată de mână (SVG, canvas izometric) ca fiind „de joc pentru copii".

## Nișă
Niciuna. E o piesă de portofoliu. Intră în registru ca lume nouă, nu ca nișă.

## Amprentă
| Dimensiune | Ce |
|---|---|
| **Lume** | **Spațiu fotografic.** Nu „stele desenate": sfere reale în WebGL, cu hărți fotografice NASA/ESO, o singură sursă de lumină în centru, deci terminator zi/noapte real, plus bloom pe Soare. |
| **Act tipografic** | Archivo variabil la `wdth 125` — grotesk **lățit**, majuscule, tracking mare, alb pe negru. Lățirea e o axă pe care n-am folosit-o niciodată. |
| **Lucrul care se mișcă** | **Camera.** Scroll-ul nu derulează pagina, pilotează o cameră care traversează sistemul solar: intră în Soare, trece lateral pe lângă planetele stâncoase, zboară **prin** centura de asteroizi și **taie planul inelelor** lui Saturn. |

## Ce vinde
Nimic. **Ce dovedește**, în ordine:
1. Că „realist" înseamnă textură fotografică pe geometrie reală, nu desen vectorial.
2. Că 3D-ul merge cu **dublu-click de pe disc** — problema grea, rezolvată, nu ocolită.
3. Că mișcarea poate fi *un singur lucru* (camera) și totuși să nu semene două acte între ele.

## Decizia tehnică grea, rezolvată înainte de cod
Pe `file://`, Chrome **refuză** să încarce o imagine într-o textură WebGL:
`blocked by CORS policy … origin 'null'`. Schemele permise sunt doar `data:`, `http`, `https`.
Deci texturile sunt **încorporate ca `data:` URI** în `assets/tex.js` (1,0 MB, redimensionate
la 1024 sau 512 și recompresate cu `sips`). three.js e r128 **UMD**, nu modular — modulele ES
pică pe `file://`. Ambele au fost **testate cu o pagină-sondă înainte de build**, nu presupuse.

## Ce face vizitatorul
Derulează. Atât. Nu are butoane de învățat, nu are meniu. La final poate lua legătura.

## Lume · strigăt · accent
- **Lume:** spațiu fotografic, negru absolut `#000`, ACES filmic tone mapping.
- **Strigăt:** 9 din 10. E singurul lucru de pe ecran; are voie să strige.
- **Accent:** lumina Soarelui, `#fff3d8`. Nicio culoare de marcă. Culoarea vine din planete —
  sunt fotografii, deci sunt deja corecte.

## Assets
Texturi: **solarsystemscope.com/textures, CC BY 4.0** (hărți NASA; harta Căii Lactee din datele
Gaia/2MASS, ESO). Creditul e scris în subsolul paginii — e o condiție a licenței, nu o politețe.
Fonturi: Archivo variabil (wdth+wght) + JetBrains Mono, locale, cu `latin-ext`.

## Ce e onest, ca să nu mint vizual
**Distanțele și mărimile sunt comprimate.** La scară reală, Neptun ar fi la 30 de ori distanța
Pământului și planetele ar fi puncte invizibile. Scrie pe pagină.
Cifrele (diametru, temperatură, durata zilei, sateliți) sunt **reale**.
