# DOMKI EKIPA — STATUS

**Runda 11 UKOŃCZONA** ✅ — dedup near-duplikatów + paginacja (wydajność). Build zielony.

## ⚠️ JEDYNE co blokuje publiczny LIVE URL (raz, od Ciebie)

Wklej RAZ w PowerShell i otwórz **nowe** okno — loop sam wdroży:
```
setx NETLIFY_AUTH_TOKEN "TWOJ_TOKEN_Z_NETLIFY"
```
Token: netlify.com → **User settings → Applications → Personal access tokens → New token**.

## Zrobione
- [x] **R1–R7**: szkielet · backend Blobs+JWT · logowanie+głosy+RSVP · feed updatów (API smoke OK) · tracker terminu 3–5.07 · oprawa premium · filtry+feed aktywności.
- [x] **R8** fan-out → 240 ofert. **R9** panel admin + 99 linków. **R10** a11y + dane dojazdów.
- [x] **R11** **dedup** near-duplikatów (`scripts/dedup.mjs`, zachowawczo: nazwa≥8 znaków + ta sama miejscowość → zostaje najlepsza) — usunięto 7, **~233 oferty**. **Paginacja**: 48 kart + „Pokaż więcej (+48)", reset przy zmianie filtrów (płynność na mobile). Build zielony.

## Funkcje (stan pełny)
Logowanie · ~233 oferty (linki+dojazdy kompletne) · 10 filtrów · 5 sortowań · paginacja · głosy ❤️ · RSVP X/6 · feed updatów + usuwanie · tracker terminu 3–5.07 + dashboard · feed aktywności · muzyka + konfetti + animacje · a11y · fallback offline.

## Następne rundy
- [ ] **R12**: PWA (manifest + service worker → instalowalna + działa offline) + drobny wizual polish.
- [ ] Kolejne fan-outy. **Deploy + LIVE URL** (gdy token) + screenshot.

## Odpalenie lokalne
```
cd C:\Users\radzi\Downloads\domki-ekipa
npm run dev                 # ~233 oferty, wszystko offline (localStorage)
npx netlify dev --offline   # pełne API + logowanie + Blobs (zweryfikowane)
```

## LIVE URL
_(brak — po ustawieniu NETLIFY_AUTH_TOKEN loop wdroży automatycznie)_
