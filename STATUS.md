# DOMKI EKIPA — STATUS

**Runda 12 UKOŃCZONA** ✅ — PWA (instalowalna + offline) + polish (focus-visible). Build zielony.

## ⚠️ JEDYNE co blokuje publiczny LIVE URL (raz, od Ciebie)

Wklej RAZ w PowerShell i otwórz **nowe** okno — loop sam wdroży:
```
setx NETLIFY_AUTH_TOKEN "TWOJ_TOKEN_Z_NETLIFY"
```
Token: netlify.com → **User settings → Applications → Personal access tokens → New token**.

## Zrobione
- [x] **R1–R7**: szkielet · backend Blobs+JWT · logowanie+głosy+RSVP · feed updatów (API smoke OK) · tracker terminu 3–5.07 · oprawa premium · filtry+feed aktywności.
- [x] **R8** fan-out → 240 · **R9** admin + linki · **R10** a11y · **R11** dedup+paginacja (235).
- [x] **R12** **PWA**: `manifest.webmanifest` + ikona SVG + `sw.js` (cache-first assety, network-first reszta, NIE cache /api) rejestrowany w main.tsx → **apka instalowalna na telefon i działa offline**. Meta theme-color/apple. Focus-visible ring (a11y). Build zielony.

## Funkcje (stan pełny)
Logowanie · ~235 ofert · 10 filtrów · 5 sortowań · paginacja · głosy ❤️ · RSVP X/6 · feed updatów + usuwanie · tracker terminu 3–5.07 + dashboard · feed aktywności · muzyka + konfetti + animacje · a11y · **PWA (instalowalna + offline)** · fallback offline.

## Następne rundy
- [ ] **R13**: przycisk „udostępnij ekipie" (kopiuj link) + mini-ranking „top typy" (najwięcej głosów).
- [ ] Kolejny fan-out (więcej ofert). **Deploy + LIVE URL** (gdy token) + screenshot.

## Odpalenie lokalne
```
cd C:\Users\radzi\Downloads\domki-ekipa
npm run dev                 # ~235 ofert, wszystko offline (localStorage)
npx netlify dev --offline   # pełne API + logowanie + Blobs (zweryfikowane)
```

## LIVE URL
_(brak — po ustawieniu NETLIFY_AUTH_TOKEN loop wdroży automatycznie)_
