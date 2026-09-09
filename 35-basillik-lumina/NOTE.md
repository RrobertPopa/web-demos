# Basillik Brașov — varianta 2, „lumină"

Făcută pe 2026-09-09, după feedback pe varianta 1 (`../34-basillik-brasov/`):
*„pare făcut cu AI, paleta e urâtă, scroll craft nu funcționează bine".*

## Ce s-a schimbat, și de ce

**Paleta.** Fundal crem cald (#F7F2EA), text espresso, accent verde-oliv luat din logo-ul lor.
Varianta 1 era pe verde-pădure aproape negru: o cofetărie pe fundal întunecat arată a bar, nu a
vitrină, iar mâncarea pierde. Referința e **Yann Couvreur Pâtisserie** — crem foarte deschis,
tipografie mare, fotografia face toată treaba.

**Fără straturi desenate.** Secțiunile CSS din varianta 1 (barele colorate) erau exact lucrul care
„pare făcut cu AI": grafică generată în locul fotografiei. Aici nu există niciun element desenat.
Tot ce se vede e o poză reală de-a lor sau tipografie.

**Fără motorul scroll-craft.** Nicio scenă pinned, niciun act. Scroll normal, cu trei mișcări mici
scrise în pagină: dezvăluire la intrare, parallax subtil pe poze, linia de sub bară.
~60 de linii de JS, fără dependențe. Pagina are 8,9 înălțimi de ecran, nu 17,6.

**Meniul e o listă editorială, nu carduri.** Nume mare cu serif, ingrediente, gramaj, preț.
Un grid de carduri identice e cel mai recunoscut tipar de pagină generată.

**Conversia e pusă în față.** O singură etichetă de buton pe tot site-ul („Comandă pe WhatsApp"),
prezentă în bară, în hero, sub meniu, în candy bar și în final. Pe telefon, bară fixă jos cu
WhatsApp și Sună. Dovezile (9,6 pe Wolt, din 2017, 7 zile din 7) stau imediat sub hero.

## Capcana care a costat cel mai mult
`clamp(2.9rem,1.6rem+5.6vw,6.4rem)` — **fără spații în jurul lui `+`, declarația e invalidă** și
cade în întregime. Titlurile au rămas la mărimea default a browserului (32px în loc de 102px),
iar pagina arăta plată și ieftină fără niciun motiv vizibil. Verificat cu `getComputedStyle`.

## Verificat
Desktop 1512, 390 și 320. Zero scroll orizontal. Fonturile se încarcă (DM Serif Display, DM Sans).
Neverificat: telefon real, `prefers-reduced-motion`, deschidere pe `file://` (pagina n-are `fetch`,
module ES sau căi absolute, deci ar trebui să meargă).

## Ce lipsește în continuare
Aceleași cinci poze de cerut clientului: vitrina reală seara, cofetarul la lucru, macro pe o felie
de Medovik, fațada, și câte o poză curată per sortiment. Meniul e tipografic pentru că nu există
poze de produs; cu ele, fiecare rând poate primi o miniatură.
