# CHANGELOG — Domki Ekipa

## Runda 8 — FAN-OUT: 84 → 240 ofert
- Seed `scripts/extract-seed.mjs` przerobiony na MERGE (existing offers.json + HTML, dedup po znormalizowanej nazwie) — dodane oferty przeżywają każdy build.
- Workflow fan-out: 14 agentów (12 regionów + OLX + Booking/Slowhop) → nowe oferty domków 6-os. na 1 noc 3–5.07 w promieniu ~2h, z bezpośrednimi linkami.
- `scripts/merge-fanout.mjs` — normalizuje pola (w/one/pn/tmin/balia/jez/feat, dekoduje &amp; w linkach) i merguje bez duplikatów. Dodano 156 → **razem 240 ofert**.
- Build zielony.

## Runda 7 — filtry + feed aktywności
- Filtry: nad jeziorem / tylko TOP / potwierdzone przez ekipę. Globalny feed aktywności.

## Runda 6 — oprawa premium
- Muzyka WebAudio, konfetti (canvas), lecące ikonki, animacje kart.

## Runda 5 — tracker terminu 3–5.07
- Dostępność per oferta, dashboard, filtr „wolne".

## Runda 4 — feed updatów + weryfikacja API na żywo (smoke OK)
## Runda 3 — logowanie + głosy + RSVP
## Runda 2 — backend (Blobs + JWT) + api.ts
## Runda 1 — szkielet Vite+React+TS+Tailwind + seed 84 oferty
