# DOMKI EKIPA — STATUS

**Runda 10 UKOŃCZONA** ✅ — a11y + weryfikacja jakości danych (tmin już kompletny dla 240). Build zielony.

## ⚠️ JEDYNE co blokuje publiczny LIVE URL (raz, od Ciebie)

Wklej RAZ w PowerShell i otwórz **nowe** okno — loop sam wdroży:
```
setx NETLIFY_AUTH_TOKEN "TWOJ_TOKEN_Z_NETLIFY"
```
Token: netlify.com → **User settings → Applications → Personal access tokens → New token**.

## Zrobione
- [x] **R1–R7**: szkielet · backend Blobs+JWT · logowanie+głosy+RSVP · feed updatów (API smoke OK) · tracker terminu 3–5.07 · oprawa premium · filtry+feed aktywności.
- [x] **R8** fan-out → **240 ofert**. **R9** panel admin (del-update) + 99 linków (Booking deep-link).
- [x] **R10** a11y: aria-labele na przyciskach (głos ❤️, usuń ✕, muzyka). Skrypt `scripts/fix-tmin.mjs` (szacuje dojazd wg regionu) — sprawdził: **wszystkie 240 mają tmin**, nic do uzupełnienia. Build zielony.

## Funkcje (stan pełny)
Logowanie · **240 ofert** (linki działają, dojazdy kompletne) · 10 filtrów · 5 sortowań · głosy ❤️ · RSVP X/6 · feed updatów + usuwanie · tracker terminu 3–5.07 + dashboard · feed aktywności · muzyka + konfetti + animacje · fallback offline.

## Następne rundy
- [ ] **R11**: dedup near-duplikatów (fan-out zostawił warianty tej samej oferty) + paginacja/„pokaż więcej" dla wydajności przy 240 kartach.
- [ ] Kolejne fan-outy. **Deploy + LIVE URL** (gdy token) + screenshot.

## Odpalenie lokalne
```
cd C:\Users\radzi\Downloads\domki-ekipa
npm run dev                 # 240 ofert, wszystko offline (localStorage)
npx netlify dev --offline   # pełne API + logowanie + Blobs (zweryfikowane)
```

## LIVE URL
_(brak — po ustawieniu NETLIFY_AUTH_TOKEN loop wdroży automatycznie)_
