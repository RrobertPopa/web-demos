# lab — verificarea

- `check.mjs` — depasiri orizontale, dezvaluiri, erori JS, la 1440 / 390 / 320.
- `shoot.mjs` — o captura pentru fiecare sectiune, pe desktop si la 320px.
- `meniu.mjs` — meniul de telefon: deschide, inchide la link, la Escape, si la trecerea pe desktop.

Rulare:
    python3 -m http.server 4600 &
    node lab/check.mjs
    node lab/shoot.mjs

Capturile ies in `lab/d/` si `lab/m320/`, gitignorate.
