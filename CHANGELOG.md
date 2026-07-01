# CHANGELOG — Domki Ekipa

## Runda 1 — setup & szkielet
- Precheck środowiska; Node.js doinstalowany (v24.18.0) przez winget.
- Szkielet projektu: Vite + React + TypeScript + TailwindCSS.
- Skrypt `scripts/extract-seed.mjs` — wyciąga oferty z `domki-weekend.html` do `src/data/offers.json` (84 oferty).
- `App.tsx`: tablica ofert z filtrami (szukaj/województwo/1-noc/cena/dojazd/balia), sortowaniem i kartami premium + animowane tło (aurora).
- `netlify.toml`, `.gitignore`, konfiguracja TS/Tailwind/PostCSS/Vite.
- Build zielony: `tsc --noEmit` + `vite build`.
- Git init + pierwszy commit.
- STATUS.md z instrukcją odblokowania auto-deployu (NETLIFY_AUTH_TOKEN).
