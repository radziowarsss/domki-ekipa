# DOMKI EKIPA — STATUS

**Runda 9 UKOŃCZONA** ✅ — panel admin (usuwanie updatów) + 99 linków poprawionych. Build zielony.

## ⚠️ JEDYNE co blokuje publiczny LIVE URL (raz, od Ciebie)

Wklej RAZ w PowerShell i otwórz **nowe** okno — loop sam wdroży:
```
setx NETLIFY_AUTH_TOKEN "TWOJ_TOKEN_Z_NETLIFY"
```
Token: netlify.com → **User settings → Applications → Personal access tokens → New token**.

## Zrobione
- [x] **R1–R7**: szkielet · backend Blobs+JWT · logowanie+głosy+RSVP · feed updatów (API smoke OK) · tracker terminu 3–5.07 · oprawa premium (muzyka/konfetti) · filtry+feed aktywności.
- [x] **R8** fan-out 14 agentów → **240 ofert** (z 84). Seed merge.
- [x] **R9** **panel admin**: endpoint `/api/del-update` (auth) + przycisk ✕ przy każdym updacie w OfferCard (offline usuwa z localStorage). **99 linków** naprawionych skryptem `scripts/fix-links.mjs` (puste / strony główne → Booking deep-link z datami 2026-07-04→05 i 6 os). Build zielony.

## Funkcje (stan pełny)
Logowanie hasłem · **240 ofert** (linki działają) · 10 filtrów · 5 sortowań · głosy ❤️ · RSVP X/6 · feed updatów per oferta + **usuwanie** · tracker terminu 3–5.07 + dashboard · feed aktywności · muzyka + konfetti + animacje · fallback offline.

## Następne rundy
- [ ] **R10**: jakość danych (uzupełnić tmin/pn = 0 sensownymi wartościami wg regionu, żeby filtry dojazd/cena działały dla wszystkich 240) + mobile/a11y polish.
- [ ] Kolejne fan-outy. **Deploy + LIVE URL** (gdy token) + screenshot.

## Odpalenie lokalne
```
cd C:\Users\radzi\Downloads\domki-ekipa
npm run dev                 # 240 ofert, wszystko offline (localStorage)
npx netlify dev --offline   # pełne API + logowanie + Blobs (zweryfikowane)
```

## LIVE URL
_(brak — po ustawieniu NETLIFY_AUTH_TOKEN loop wdroży automatycznie)_
