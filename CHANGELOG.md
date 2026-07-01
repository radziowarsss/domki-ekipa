# CHANGELOG — Domki Ekipa

## Runda 7 — filtry + feed aktywności
- Filtry: „🌊 nad jeziorem" (d.jez), „⭐ tylko TOP" (d.feat), „✅ potwierdzone przez ekipę" (oferta ma update typu 'biora').
- Globalny feed aktywności w hero: ostatnie 15 zdarzeń (updaty + oznaczenia terminu 3–5.07), od najnowszych, z „ile temu".
- Build zielony.

## Runda 6 — oprawa premium
- `src/effects.tsx`: muzyka WebAudio (toggle), konfetti (canvas) na głos/RSVP/„wolne", lecące ikonki. Animacje kart.

## Runda 5 — tracker terminu 3–5.07
- Dostępność per oferta → /api/availability, dashboard, filtr „wolne 3–5.07".

## Runda 4 — feed updatów + weryfikacja API na żywo
- OfferCard z feedem updatów. netlify-cli. SMOKE-TEST na żywo PRZESZEDŁ (auth/vote/state/Blobs).

## Runda 3 — logowanie + głosy + RSVP
- Ekran logowania, głosy ❤️, RSVP X/6, fallback offline.

## Runda 2 — backend + auth
- api.mts (/api/*) na Netlify Blobs + JWT. Klient src/api.ts.

## Runda 1 — setup & szkielet
- Node v24.18.0. Vite+React+TS+Tailwind. Seed 84 oferty. git init.
