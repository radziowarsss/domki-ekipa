# DOMKI EKIPA — STATUS

**Runda 8 UKOŃCZONA** ✅ — **fan-out: 84 → 240 ofert** (14 agentów, cel 150+ przebity). Build zielony.

## ⚠️ JEDYNE co blokuje publiczny LIVE URL (raz, od Ciebie)

Wklej RAZ w PowerShell i otwórz **nowe** okno — loop sam wdroży w kolejnej rundzie:
```
setx NETLIFY_AUTH_TOKEN "TWOJ_TOKEN_Z_NETLIFY"
```
Token: netlify.com → **User settings → Applications → Personal access tokens → New token**.

## Zrobione
- [x] **R1–R7**: szkielet · backend+auth (Blobs+JWT) · logowanie+głosy+RSVP · feed updatów (API smoke OK) · tracker terminu 3–5.07 · oprawa premium (muzyka/konfetti/ikonki) · filtry+feed aktywności.
- [x] **R8** **FAN-OUT**: 14 agentów przeczesało 12 regionów + OLX/Booking/Slowhop → **156 nowych ofert** (razem **240**). Seed przerobiony na MERGE (existing + HTML, dedup po nazwie) — nowe oferty przeżywają build. `scripts/merge-fanout.mjs` normalizuje pola i merguje. Build zielony (bundle 270 KB).

## Funkcje (stan pełny)
Logowanie hasłem · **240 ofert** · 10 filtrów · 5 sortowań · głosy ❤️ · RSVP X/6 · feed updatów per oferta · tracker terminu 3–5.07 + dashboard · feed aktywności · muzyka + konfetti + animacje · fallback offline.

## Następne rundy
- [ ] **R9**: panel admin (usuwanie updatów/spamu, DELETE w api.mts) + poprawa bezpośrednich linków (Booking deep-link 2026-07-03→05).
- [ ] Kolejne fan-outy / dopieszczenie danych (uzupełnić tmin/pn gdzie 0). Mobile/a11y polish.
- [ ] **Deploy + LIVE URL** (gdy token) + screenshot.

## Odpalenie lokalne
```
cd C:\Users\radzi\Downloads\domki-ekipa
npm run dev                 # 240 ofert, wszystko offline (localStorage)
npx netlify dev --offline   # pełne API + logowanie + Blobs (zweryfikowane)
```

## LIVE URL
_(brak — po ustawieniu NETLIFY_AUTH_TOKEN loop wdroży automatycznie)_
