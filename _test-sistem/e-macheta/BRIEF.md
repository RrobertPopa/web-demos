# BRIEF — Frunzei 9

**Autoritate estetică:** `os/capabilities/web/` (lumea + nișa). Fără scroll-craft.
**Referință vizuală:** Autorat sub delegare explicită — Robert a cerut „design de la 0 complet
făcut de tine, ceva wow" și „ceva mai complicat". Nu a dat link.

## Ce e și pentru cine
Un ansamblu rezidențial mic — 24 de apartamente, Sector 2, București. Cumpărătorul e un om
care compară trei ansambluri pe telefon și vrea să știe **care apartament, la ce etaj, cât costă,
cât soare intră**. Nu vrea vocabular de agenție.

## Nișă
**Imobiliare.** În registrul de amprente e neatinsă complet.

## Amprentă (plan, înainte de cod)
| Dimensiune | Ce |
|---|---|
| **Lume** | Machetă luminată — hârtie caldă, cerneală, o machetă izometrică desenată în cod, luminată de un soare care se mișcă. Lume NOUĂ, nu una din cele zece. |
| **Act tipografic** | Instrument Serif la 100px+, numere mari (suprafață, preț) ca titluri. Voce nouă: până acum n-am folosit niciodată un serif de afiș cu contrast mare. |
| **Lucrul care se mișcă** | **Soarele.** Un singur cursor „ora zilei" care, pe pagina 1, schimbă fețele luminate ale machetei și umbra pe sol, iar pe pagina 2 mută pata de lumină pe podeaua apartamentului. Același obiect, două pagini. |

Diferă de fiecare rând din registru pe toate cele trei dimensiuni.

## Ce vinde
1. **Care apartament e liber și cât costă** — nu „conceptul".
2. **Câtă lumină intră și de la ce oră** — diferența reală între două apartamente identice ca plan.
3. **Etajul și orientarea**, arătate, nu descrise.
4. Ce e inclus în preț și ce nu (loc de parcare, boxă, TVA).
5. Programarea vizitei, cu ziua și ora alese pe loc.

## Structura
- `index.html` — macheta ansamblului, filtre, lista apartamentelor libere, zona, prețuri.
- `apartament.html?ap=…` — planul desenat, lumina la ora aleasă, prețul defalcat, vecinii.
- `vizita.html?ap=…` — programare: zi, oră, date de contact, mesaj gata pentru WhatsApp.

Meniu comun pe trei pagini. Starea (apartamentul ales, ora) se duce prin query string — merge pe `file://`.

## Reguli de casă care se aplică
Căi relative · fără module ES · fără `fetch` · fonturi locale cu `latin-ext` · 320px e pragul ·
CTA pe WhatsApp cu mesaj precompletat · prețuri afișate, fără „de la" fără cifră.

## Ce e fictiv
Ansamblul, adresa, prețurile, telefonul. Scris în subsol pe fiecare pagină.

## Ce face vizitatorul
Atinge un apartament pe machetă, vede prețul și etajul, intră pe pagina lui, trage de soare ca să
vadă lumina la ora la care e de obicei acasă, apoi **își programează vizita** — zi și oră alese pe
loc, trimise pe WhatsApp. O singură acțiune finală, o singură etichetă: „Programează vizita".

## Lume · strigăt · accent
- **Lume:** Machetă luminată. Hârtie caldă `#f2efe7`, cerneală `#15171b`, machetă izometrică
  desenată în canvas, umbră pe sol, soare mobil.
- **Strigăt:** 6 din 10. Liniște de hârtie, un singur obiect care se mișcă, tipografie mare.
  Nu e nici minimal-cuminte, nici zgomotos.
- **Accent:** **cobalt `#1f4fd8`**, unul singur. În nișa imobiliare accentul ars e auriul de
  „lux" și verdele de „eco"; cobaltul pe hârtie caldă nu apare nicăieri în registrul meu.

## Assets
Niciunul de la client — ansamblul e fictiv. **Zero fotografii**: macheta, planurile și lumina
sunt desenate în cod (canvas 2D + SVG), deci nu depind de o poză bună pe care n-o am.
Fonturi: Instrument Serif (afiș), Instrument Sans (text), JetBrains Mono (cifre), toate locale
cu subset `latin-ext`.
