# CHANGELOG — Domki Ekipa

## Runda 12 — PWA + polish
- `public/manifest.webmanifest` (name Domki Ekipa, standalone, theme #0b1220) + `public/icon.svg` (namiot + jezioro) + meta w index.html (theme-color, apple-mobile-web-app).
- `public/sw.js` — service worker: cache-first dla /assets/ (hash w nazwie), network-first dla reszty, pomija /api/* i /.netlify/*; rejestrowany w main.tsx. Apka instalowalna + działa offline.
- Focus-visible ring (a11y) w index.css.
- Build zielony.

## Runda 11 — dedup (240→235) + paginacja „Pokaż więcej"
## Runda 10 — a11y (aria-labele) + fix-tmin
## Runda 9 — panel admin (del-update) + fix-links (99 → Booking deep-link)
## Runda 8 — FAN-OUT: 84 → 240 ofert (seed merge + merge-fanout)
## Runda 7 — filtry + feed aktywności
## Runda 6 — oprawa premium (muzyka/konfetti/ikonki)
## Runda 5 — tracker terminu 3–5.07
## Runda 4 — feed updatów + API smoke OK
## Runda 3 — logowanie + głosy + RSVP
## Runda 2 — backend (Blobs + JWT)
## Runda 1 — szkielet + seed 84 oferty
