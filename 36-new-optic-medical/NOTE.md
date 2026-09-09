# New Optic Medical — demo de prospectare

Construit pe **2026-09-09**. Înlocuiește site-ul lor actual, `new-optic-medical.ro`
(WordPress din 2018, © neactualizat, fără poze proprii, fără recenzii, fără hartă).

## Ce am aflat, și ce am schimbat din cauza asta

**Recenziile sunt cel mai bun activ pe care îl au și nu apar nicăieri pe site-ul lor.**
5,0 din 5 pe **25 de recenzii Google**, fără nicio notă sub 5. Le-am pus pe prima pagină,
copiate cuvânt cu cuvânt, fiecare cu numele și vechimea recenziei, plus buton către sursă.

**Unghiul nu e „optică medicală", ci reparațiile.** Citind recenziile, tema care se repetă
nu e vânzarea, ci reparația: *„Au putut să îmi repare ochelarii rupți, deși nimeni altcineva
nu a dat nicio șansă reparației."* Google însuși extrage temele „glasses repair", „problem
solving", „patience". De aceea există pe prima pagină secțiunea **„Reparăm și ce alții au
refuzat"** — asta îi diferențiază de orice lanț de optică.

**Au o singură locație activă.** Pe Google, punctul din Sector 5 (Str. Mihail Sebastian 88C,
tel. 0735 585 143) e marcat **închis permanent**, dar site-ul lor actual încă îl anunță în
titlul paginii („Sector 5 Rahova & Sector 6 Drumul Taberei") și afișează numărul lui la contact.
Site-ul nou vorbește doar despre locația din Kaufland, B-dul 1 Mai 51-55.

**Bug pe site-ul lor actual, de menționat în discuție:** adresa de e-mail din antet are
`href="tel:office@new-optic-medical.ro"`, deci nu deschide clientul de mail. Și rămân linkuri
către `realizaremagazin.online`, site-ul celui care le-a făcut pagina.

## Design

- **Referința principală:** `opticavedere.ro` (indicată de Robert). De acolo: bara ca pastilă
  flotantă desprinsă de marginea de sus, eyebrow cu linie scurtă, micro-informații în jurul
  hero-ului. Nu am luat paleta lor (crem + portocaliu).
- **Din `os/capabilities/biblioteca-vizuala.md`:** serviciile ca **rânduri-listă** cu număr, nu
  grid de carduri (wbt.ro); nav scurt de patru itemi (saem.ro); secțiunile despărțite prin
  schimbarea fundalului, nu prin spațiu gol; buton pill cu săgeată.
- **Paleta e a lor:** bleul din logo, dus la un bleumarin adânc plus un cyan folosit rar.
  Alb rece pentru restul, pentru că o optică vinde claritate, nu atmosferă.
- **Tipografie:** Outfit pentru titluri, Source Sans 3 pentru text.

## Mișcarea semnătură: „lentila"

Titlul din hero e scris de două ori. Dedesubt, o copie ușor neclară; deasupra, titlul real,
decupat la un cerc care urmărește cursorul. Prin cerc se vede clar, în rest e ușor înceţoşat.
Exact ce face un ochelar. Pe telefon cercul traversează singur titlul, pe măsură ce derulezi.
Sub `prefers-reduced-motion` efectul dispare complet și rămâne titlul normal.

## Verificat
Desktop 1512, plus 320 și 390 în iframe-uri. Zero scroll orizontal. Toate cele patru pagini,
navigație între ele, marcarea paginii curente.
**Neverificat:** telefon real, `prefers-reduced-motion`, deschidere pe `file://`
(paginile n-au `fetch`, module ES sau căi absolute, deci ar trebui să meargă).

## De confirmat cu clientul înainte de a fi site live
1. **Programul exact pe zile.** Google arată 9:00 – 19:30, dar nu am putut confirma dacă e
   luni–vineri, luni–sâmbătă sau zilnic. Pe site scrie doar intervalul orar.
2. **Numărul 0735 585 143** — dacă mai e în uz sau a rămas la locația închisă.
3. **Poze reale.** Toate fotografiile sunt stock (Unsplash). Trebuie înlocuite cu: interiorul
   magazinului, vitrina cu rame, atelierul de reparații, echipa. Fără ele, site-ul rămâne
   corect dar anonim.
4. **Prețuri.** Nu apare niciun preț, pentru că nu am nicio sursă. Un interval pentru consult
   și pentru reparații ar crește conversia.
