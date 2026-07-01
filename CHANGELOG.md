# CHANGELOG — Domki Ekipa

## Runda 9 — panel admin + poprawa linków
- Backend: `/api/del-update` (POST {slug,ts}, auth) — usuwa update z Blobs.
- Front: przycisk ✕ przy każdym updacie w OfferCard (offline usuwa z localStorage) + klient `api.delUpdate`.
- `scripts/fix-links.mjs`: 99 pustych / „stron głównych" → Booking deep-link (miejscowość + checkin 2026-07-04, checkout 2026-07-05, 6 os).
- Build zielony.

## Runda 8 — FAN-OUT: 84 → 240 ofert
- Seed merge (existing+HTML). Workflow 14 agentów. `scripts/merge-fanout.mjs` (+156 ofert).

## Runda 7 — filtry (jezioro/TOP/potwierdzone) + feed aktywności
## Runda 6 — oprawa premium (muzyka/konfetti/ikonki/animacje)
## Runda 5 — tracker terminu 3–5.07 + dashboard
## Runda 4 — feed updatów + weryfikacja API na żywo (smoke OK)
## Runda 3 — logowanie + głosy + RSVP
## Runda 2 — backend (Blobs + JWT) + api.ts
## Runda 1 — szkielet Vite+React+TS+Tailwind + seed 84 oferty
