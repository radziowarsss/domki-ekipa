# CHANGELOG — Domki Ekipa

## Runda 3 — logowanie + głosy + RSVP (front)
- Ekran logowania (hasło → POST /api/auth).
- Głosy ❤️ współdzielone (POST /api/vote, licznik z /api/state) + sort „najwięcej głosów".
- RSVP „X/6 zaklepane" + pasek postępu + przycisk „Jadę!" (POST /api/rsvp) + lista imion.
- Fallback OFFLINE (localStorage) gdy API niedostępne — apka renderuje się zawsze; banner informuje o trybie.
- Zapamiętane imię (localStorage) do głosów/RSVP.
- Build zielony (29 modułów).

## Runda 2 — backend + auth
- Zależności: `@netlify/blobs`, `@netlify/functions`, `jose`.
- `netlify/functions/api.mts` — router `/api/*`: auth, state, update, vote, rsvp, availability.
- Store na Netlify Blobs. Auth hasłem (`APP_PASSWORD`=ekipa2026) → JWT w HttpOnly cookie.
- Klient `src/api.ts`. `.env.example`.

## Runda 1 — setup & szkielet
- Node.js doinstalowany (v24.18.0). Szkielet Vite + React + TS + Tailwind.
- `scripts/extract-seed.mjs` → `src/data/offers.json` (84 oferty).
- Tablica ofert z filtrami/sortowaniem/kartami + aurora. Build zielony; git init.
