# DOMKI EKIPA — STATUS

**Runda 14 UKOŃCZONA** ✅ — drugi fan-out: **235 → 366 ofert**. Build zielony.

## ⚠️ Limit sesji (info)
Podczas 2. fan-outu trafiliśmy na **limit sesji (reset ~7:30 Berlin)** — 2 z 14 agentów padło. Rundy z agentami (fan-out) będą działać dopiero po resecie; do tego czasu loop robi lekkie rundy (bez subagentów). Główny build/commit działa normalnie.

## ⚠️ JEDYNE co blokuje publiczny LIVE URL (raz, od Ciebie)
```
setx NETLIFY_AUTH_TOKEN "TWOJ_TOKEN_Z_NETLIFY"
```
Token: netlify.com → User settings → Applications → Personal access tokens. Loop sam wdroży.

## Zrobione (14 rund)
- R1–R7: szkielet · backend Blobs+JWT · logowanie+głosy+RSVP · feed updatów (API smoke OK) · tracker terminu · oprawa premium · filtry+feed aktywności.
- R8 fan-out → 240 · R9 admin+linki · R10 a11y · R11 dedup+paginacja · R12 PWA · R13 share+ranking.
- [x] **R14** DRUGI FAN-OUT (14 agentów, głębiej: agroturystyki/balia/Airbnb/Slowhop) → **366 ofert** (merge-fanout +138, dedup −9, fix-links 34). Build zielony (bundle 349 KB).

## Funkcje (stan pełny)
Logowanie · **366 ofert** · 10 filtrów · 5 sortowań · paginacja · głosy ❤️ + ranking · RSVP X/6 · feed updatów + usuwanie · tracker terminu 3–5.07 + dashboard · feed aktywności · udostępnianie · muzyka+konfetti+animacje · a11y · PWA (instalowalna+offline) · fallback offline.

## Następne rundy
- [ ] **R15+** (lekkie, bez agentów do resetu): reset filtrów, „wylosuj domek", więcej sortowań, drobny polish.
- [ ] Po resecie: kolejny fan-out. **Deploy + LIVE URL** (gdy token) + screenshot.

## Odpalenie lokalne
```
cd C:\Users\radzi\Downloads\domki-ekipa
npm run dev                 # 366 ofert offline
npx netlify dev --offline   # pełne API + logowanie + Blobs
```

## LIVE URL
_(brak — po ustawieniu NETLIFY_AUTH_TOKEN loop wdroży automatycznie)_
