# DOMKI EKIPA — STATUS

**Runda 13 UKOŃCZONA** ✅ — udostępnianie ekipie + mini-ranking „top typy". Build zielony.

## ⚠️ JEDYNE co blokuje publiczny LIVE URL (raz, od Ciebie)

Wklej RAZ w PowerShell i otwórz **nowe** okno — loop sam wdroży:
```
setx NETLIFY_AUTH_TOKEN "TWOJ_TOKEN_Z_NETLIFY"
```
Token: netlify.com → **User settings → Applications → Personal access tokens → New token**.

## Zrobione (13 rund)
- R1–R7: szkielet · backend Blobs+JWT · logowanie+głosy+RSVP · feed updatów (API smoke OK) · tracker terminu · oprawa premium · filtry+feed aktywności.
- R8 fan-out → 240 · R9 admin+linki · R10 a11y · R11 dedup+paginacja (235) · R12 PWA.
- [x] **R13** przycisk „📤 Udostępnij ekipie" (navigator.share / kopiuj link + toast) + mini-ranking **🏆 Top typy ekipy** (3 najczęściej głosowane, klik → sort po głosach). Build zielony.

## Funkcje (stan pełny)
Logowanie · ~235 ofert · 10 filtrów · 5 sortowań · paginacja · głosy ❤️ + ranking · RSVP X/6 · feed updatów + usuwanie · tracker terminu 3–5.07 + dashboard · feed aktywności · **udostępnianie** · muzyka + konfetti + animacje · a11y · **PWA (instalowalna + offline)** · fallback offline.

## Następne rundy
- [ ] **R14**: kolejny fan-out (~14 agentów) — więcej ofert + lepsze pokrycie, merge+dedup.
- [ ] **Deploy + LIVE URL** (gdy token) + screenshot. Drobny polish.

## Odpalenie lokalne
```
cd C:\Users\radzi\Downloads\domki-ekipa
npm run dev                 # ~235 ofert, wszystko offline (localStorage)
npx netlify dev --offline   # pełne API + logowanie + Blobs (zweryfikowane)
```

## LIVE URL
_(brak — po ustawieniu NETLIFY_AUTH_TOKEN loop wdroży automatycznie)_
