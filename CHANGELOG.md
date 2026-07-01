# CHANGELOG — Domki Ekipa

## Runda 2 — backend + auth
- Zależności: `@netlify/blobs`, `@netlify/functions`, `jose`.
- `netlify/functions/api.mts` — router `/api/*`: `auth`, `state`, `update`, `vote`, `rsvp`, `availability`.
- Store na Netlify Blobs (kolekcje: updates/votes/rsvps/availability).
- Auth: hasło (`APP_PASSWORD`, domyślnie `ekipa2026`) → podpisany JWT w HttpOnly cookie (jose).
- Klient `src/api.ts` z typami stanu.
- `.env.example` (NETLIFY_AUTH_TOKEN / APP_PASSWORD / JWT_SECRET).
- Build nadal zielony (frontend niezmieniony, gotowy do wpięcia w rundzie 3).

## Runda 1 — setup & szkielet
- Precheck środowiska; Node.js doinstalowany (v24.18.0) przez winget.
- Szkielet projektu: Vite + React + TypeScript + TailwindCSS.
- Skrypt `scripts/extract-seed.mjs` — wyciąga oferty z `domki-weekend.html` do `src/data/offers.json` (84 oferty).
- `App.tsx`: tablica ofert z filtrami, sortowaniem, kartami premium + aurora tło.
- `netlify.toml`, `.gitignore`, konfiguracja TS/Tailwind/PostCSS/Vite.
- Build zielony; git init + pierwszy commit; STATUS.md.
