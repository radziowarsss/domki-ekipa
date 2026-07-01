# CHANGELOG — Domki Ekipa

## Runda 5 — tracker terminu 3–5.07
- Na karcie (OfferCard) segmentowany wybór statusu dostępności: wolne / zajęte / do potwierdzenia → POST /api/availability {slug,status,who}.
- Badge statusu (kolor) na karcie; wczytywanie z /api/state (fallback offline localStorage).
- Dashboard w hero: „✅ X wolnych na 3–5.07 / ❌ Y zajętych / 🏠 N ofert".
- Filtr „✅ wolne 3–5.07".
- Build zielony.

## Runda 4 — feed updatów + weryfikacja API na żywo
- OfferCard z feedem updatów per oferta (formularz typ+tekst → /api/update), sort „ostatni update".
- netlify-cli 26.1.0. SMOKE-TEST na żywo PRZESZEDŁ: /api/auth 200+cookie, /api/vote zapisany, /api/state z Blobs.

## Runda 3 — logowanie + głosy + RSVP (front)
- Ekran logowania, głosy ❤️ + sort po głosach, RSVP X/6 + „Jadę!", fallback offline.

## Runda 2 — backend + auth
- api.mts (/api/*) na Netlify Blobs + JWT (jose). Klient src/api.ts.

## Runda 1 — setup & szkielet
- Node v24.18.0. Vite+React+TS+Tailwind. Seed 84 oferty. Board z filtrami. git init.
