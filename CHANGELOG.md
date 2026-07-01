# CHANGELOG — Domki Ekipa

## Runda 4 — feed updatów + weryfikacja API na żywo
- Komponent `OfferCard` z rozwijanym feedem updatów per oferta: formularz (typ: dzwoniłem-biorą / nie / oddzwonią / cena / dostępność 3–5.07 / notatka + tekst) → POST /api/update.
- Feed widoczny (autor + „ile temu"), sort „💬 ostatni update" (ostatni update podbija ofertę), fallback offline (localStorage).
- Zainstalowano netlify-cli (26.1.0).
- **SMOKE-TEST API na żywo (`netlify dev --offline`) PRZESZEDŁ**: /api/auth 200+cookie, /api/vote 200 (głos zapisany), /api/state 200 (Netlify Blobs persystuje i oddaje dane). Backend zweryfikowany end-to-end.
- Build zielony.

## Runda 3 — logowanie + głosy + RSVP (front)
- Ekran logowania (hasło → /api/auth), głosy ❤️ (/api/vote) + sort po głosach, RSVP X/6 + „Jadę!" (/api/rsvp), fallback offline.

## Runda 2 — backend + auth
- `netlify/functions/api.mts` (/api/auth,state,update,vote,rsvp,availability) na Netlify Blobs + JWT (jose). Klient `src/api.ts`. `.env.example`.

## Runda 1 — setup & szkielet
- Node v24.18.0. Vite+React+TS+Tailwind. `scripts/extract-seed.mjs` → 84 oferty. Board z filtrami. git init.
