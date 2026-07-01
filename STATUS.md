# DOMKI EKIPA — STATUS

**Runda 2 UKOŃCZONA** ✅ — backend API + auth + klient (frontend nadal zielony).

## ⚠️ WYMAGANE OD CIEBIE (raz), żeby loop wdrożył publicznie

**AUTO-DEPLOY na Netlify ZABLOKOWANY** (brak tokenu). Apka buduje się i chodzi lokalnie. Żeby trafiła publicznie, wklej RAZ w PowerShell i otwórz **nowe** okno:

```
setx NETLIFY_AUTH_TOKEN "TWOJ_TOKEN_Z_NETLIFY"
```

Token: netlify.com → **User settings → Applications → Personal access tokens → New token**.

## Zrobione
- [x] **Runda 1**: szkielet Vite+React+TS+Tailwind, seed 84 oferty, build zielony, git.
- [x] **Runda 2**: backend `netlify/functions/api.mts` (router /api/*), store na **Netlify Blobs**, auth **hasłem `ekipa2026`** + podpisany JWT-cookie (jose). Endpointy: `/api/auth`, `/api/state`, `/api/update`, `/api/vote`, `/api/rsvp`, `/api/availability`. Klient `src/api.ts`. `.env.example` (APP_PASSWORD, JWT_SECRET). Build nadal zielony.

## Architektura (świadomy wybór)
- Oferty (statyczne z researchu) = bundlowane w froncie (`src/data/offers.json`), regenerowane przez seed/fan-out.
- Warstwa współdzielona (updaty / głosy / RSVP / dostępność 3–5.07) = **Netlify Blobs** przez API. Prosto, „near-enterprise dla znajomych", łatwo później podmienić na Postgres.
- Bramka: hasło → JWT-cookie. Frontend degraduje się: bez działającego API (czysty `vite dev`) pokazuje ofertę read-only; z API (netlify dev / deploy) włącza współdzielenie.

## Następne rundy
- [ ] **Runda 3**: instalacja netlify-cli, `netlify dev`, SMOKE-TEST API (auth+vote+rsvp), wpięcie frontu: bramka hasła + głosy ❤️ + RSVP (X/6) na żywo. Weryfikacja w przeglądarce (screeny).
- [ ] Updaty per oferta (feed) + tracker terminu 3–5.07 + filtr „wolne".
- [ ] Fan-out po 150+ ofert + bezpośrednie linki.
- [ ] Oprawa premium: muzyka, konfetti, lecące ikonki, animacje.
- [ ] Deploy + LIVE URL (po tokenie).

## Odpalenie lokalne (read-only board działa już teraz)
```
cd C:\Users\radzi\Downloads\domki-ekipa
npm install
npm run dev
```
Pełne API lokalnie (od rundy 3): `npx netlify dev`.

## LIVE URL
_(brak — po ustawieniu NETLIFY_AUTH_TOKEN i deployu)_
