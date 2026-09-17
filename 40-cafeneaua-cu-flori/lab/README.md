# lab — dovezile vizuale

Capturi generate cu harness-ul `scroll-craft`, pe patru treceri:

- `shots/`   desktop 1440×900
- `m390/`    telefon 390×844
- `m320/`    telefon 320×720 — pragul real de testare
- `reduced/` cu `prefers-reduced-motion: reduce`

`check320.mjs` verifica depasirile orizontale si randarea la dublu-click (`file://`).
Rulare: serverul local pe 4500, apoi `node check320.mjs`.

Contact sheet-ul nu se genereaza pe masina asta: cere un build complet de ffmpeg,
iar cel instalat e ciuntit (ii lipsesc `scale` si `tile`).
