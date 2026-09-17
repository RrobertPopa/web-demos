# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| basillik-brasov | Gallery / catalog | Index de obiecte, fix, cu sectiunea curenta marcata; sare | Vitrina: pin cu 5 planuri de parallax (lumina, raft-spate, cadru, geam, raft-fata) | pin > flow > pan > tacere > pin(varf) > reveal > parallax > pin · 8 acte · 17,6vh | Placa de comanda tipografiata ca eticheta de muzeu, in chenar, fara magnet si fara spotlight | "Felia": sectiune prin Medovik care se construieste strat cu strat din `--sc-p`, cu linii de indicatie si ingredientul real pe fiecare strat | Fotografic, verde-padure / os / miere | 8766 |
| sferic-optic | Editorial ledger | Fara nav; bara de contact fixa doar pe telefon | Tipografic, o propozitie, fara imagine | tipografic > lista revelata > tacere > unealta(varf) > doua coloane > orar viu · 5 acte · 9,2vh la 320px | Orar viu care spune daca e deschis acum, plus butonul de sunat | "Devizul": alegi lentila, montajul si extrele, iar totalul se compune din preturile publicate de ei, cu 2 lentile la pereche | Tipografic, alb rece / negru / chihlimbar | 4500 |
| cafeneaua-cu-flori | Almanah / perechi | Bara subtire care isi ia accentul cromatic de la sectiunea curenta | Diptic: doua panouri care se despart si lasa numele intre ele; pe telefon se intoarce pe verticala | pin > flow > pin > pan > flow > pin(varf) > flow > pin · 8 acte · 11,8vh | Buchetul care se deseneaza singur cand actul intra, cu cele doua adrese ca etichete | "Perechea": alegi o bautura si primesti floarea care merge cu ea, si invers — bidirectional | Tipografic + ilustratie vectoriala, hartie calda / accent unic pe sectiune | 4500 |



---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- **Gallery / catalog** ca grammar, cu eticheta de muzeu ca schema unica.
- **Nav = index de obiecte** care sare, cu marcarea sectiunii curente.
- **Inchidere pe placa tipografiata** in chenar, fara magnet si fara spotlight.
- **Sectiunea prin produs** ca miscare semnatura. Nu se refoloseste desenul in sectiune.
- Banda **8 acte / 17,6vh**.
- **Almanah / perechi** ca grammar: pagina organizata pe lucruri care vin in doi.
- **Nav care isi ia culoarea de la sectiunea curenta.** Nu se refoloseste mecanismul.
- **Diptic** ca hero, si rotirea lui pe verticala ca art direction de telefon.
- **Buchetul care se deseneaza** ca inchidere (stroke-dashoffset pe tulpini).
- Paleta **hartie + un singur accent per sectiune**, adica nicio culoare dominanta.
- Paleta **verde-padure + os + miere** pe demo de cofetarie.

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
