# CHANGELOG — Domki Ekipa

## Runda 6 — oprawa premium
- `src/effects.tsx` (samowystarczalne, zero zależności): 🎵 muzyka chill ambient pad (WebAudio: oscylatory → lowpass + LFO, toggle w rogu, off domyślnie); 🎉 konfetti (canvas + requestAnimationFrame) na głos ❤️ / RSVP / oznaczenie „wolne"; lecące ikonki w tle (CSS animation, pointer-events none).
- Animacje wejścia kart (cardIn), aurora tło, glassmorphism.
- Build zielony (30 modułów).

## Runda 5 — tracker terminu 3–5.07
- Segmenty dostępności per oferta → /api/availability, badge, dashboard „X wolnych/Y zajętych", filtr „wolne 3–5.07".

## Runda 4 — feed updatów + weryfikacja API na żywo
- OfferCard z feedem updatów (/api/update), sort „ostatni update". netlify-cli. SMOKE-TEST na żywo PRZESZEDŁ.

## Runda 3 — logowanie + głosy + RSVP
- Ekran logowania, głosy ❤️, RSVP X/6 + „Jadę!", fallback offline.

## Runda 2 — backend + auth
- api.mts (/api/*) na Netlify Blobs + JWT. Klient src/api.ts.

## Runda 1 — setup & szkielet
- Node v24.18.0. Vite+React+TS+Tailwind. Seed 84 oferty. git init.
