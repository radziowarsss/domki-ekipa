# DOMKI EKIPA — STATUS

**Runda 4 UKOŃCZONA** ✅ — feed updatów per oferta + **API zweryfikowane na żywo** (smoke-test przeszedł). Build zielony.

## ⚠️ JEDYNE co blokuje publiczny LIVE URL (raz, od Ciebie)

**AUTO-DEPLOY na Netlify** czeka na token. Cała reszta działa. Wklej RAZ w PowerShell i otwórz **nowe** okno:

```
setx NETLIFY_AUTH_TOKEN "TWOJ_TOKEN_Z_NETLIFY"
```

Token: netlify.com → **User settings → Applications → Personal access tokens → New token**. Loop sam wdroży w kolejnej rundzie i wpisze tu LIVE URL.

## Zrobione
- [x] **R1**: szkielet Vite+React+TS+Tailwind, seed 84 oferty, git.
- [x] **R2**: backend `api.mts` (/api/*), Netlify Blobs, auth `ekipa2026` + JWT-cookie, klient `api.ts`.
- [x] **R3**: front — logowanie, głosy ❤️, RSVP X/6 + „Jadę!", fallback offline.
- [x] **R4**: **feed updatów per oferta** (OfferCard: formularz typ+tekst → /api/update, feed autor+czas, sort „ostatni update"). netlify-cli zainstalowane. **SMOKE-TEST API PRZESZEDŁ na żywo (`netlify dev`)**:
  - `POST /api/auth` (hasło) → 200 `{ok:true}` + cookie ✔
  - `POST /api/vote` → 200 `{votes:1,mine:true}` ✔
  - `GET /api/state` → 200, głos zapisany w **Netlify Blobs** i oddany ✔
  - Czyli backend (Functions + Blobs + JWT) działa end-to-end.

## Następne rundy
- [ ] **R5**: tracker terminu 3–5.07 per oferta (/api/availability) + dashboard „X potwierdzonych wolnych" + filtr „wolne na 3–5.07".
- [ ] Więcej filtrów (jezioro, grill, tylko TOP, potwierdzone przez ekipę).
- [ ] Bezpośrednie linki do konkretnych ogłoszeń (Booking deep-link 2026-07-03→05).
- [ ] Oprawa premium: muzyka, konfetti, lecące ikonki, glassmorphism, animacje. Panel admin.
- [ ] Fan-out po 150+ ofert.
- [ ] **Deploy + LIVE URL** (gdy token).

## Odpalenie lokalne
```
cd C:\Users\radzi\Downloads\domki-ekipa
npm run dev          # board + głosy/RSVP/updaty offline (localStorage)
npx netlify dev --offline   # PEŁNE API + logowanie + Blobs (zweryfikowane)
```

## LIVE URL
_(brak — po ustawieniu NETLIFY_AUTH_TOKEN loop wdroży automatycznie)_
