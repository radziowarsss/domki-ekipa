# DOMKI EKIPA — STATUS

**Runda 7 UKOŃCZONA** ✅ — więcej filtrów + globalny feed aktywności. Build zielony.

## ⚠️ JEDYNE co blokuje publiczny LIVE URL (raz, od Ciebie)

Wklej RAZ w PowerShell i otwórz **nowe** okno — loop sam wdroży w kolejnej rundzie:
```
setx NETLIFY_AUTH_TOKEN "TWOJ_TOKEN_Z_NETLIFY"
```
Token: netlify.com → **User settings → Applications → Personal access tokens → New token**.

## Zrobione
- [x] **R1** szkielet · **R2** backend+auth · **R3** logowanie+głosy+RSVP · **R4** feed updatów (API smoke OK) · **R5** tracker terminu 3–5.07 · **R6** oprawa premium (muzyka/konfetti/animacje).
- [x] **R7** **więcej filtrów** (🌊 nad jeziorem, ⭐ tylko TOP, ✅ potwierdzone przez ekipę = ma update 'biorą') + **globalny feed aktywności** (ostatnie 15 zdarzeń: updaty + oznaczenia terminu, „kto co i kiedy"). Build zielony.

## Funkcje (stan pełny)
Logowanie hasłem · 84 oferty · filtry (szukaj / województwo / 1-noc / cena / dojazd / balia / wolne-3–5.07 / **nad jeziorem** / **tylko TOP** / **potwierdzone przez ekipę**) · sort (polecane/cena/dojazd/głosy/update) · głosy ❤️ · RSVP X/6 · feed updatów per oferta · tracker terminu 3–5.07 + dashboard · **feed aktywności ekipy** · muzyka + konfetti + animacje · fallback offline (localStorage).

## Następne rundy
- [ ] **R8**: **fan-out ~16 agentów → nowe oferty (cel 150+)** z bezpośrednimi linkami, merge do offers.json.
- [ ] Panel admin (usuwanie updatów). Bezpośrednie linki (Booking deep-link 2026-07-03→05).
- [ ] **Deploy + LIVE URL** (gdy token).

## Odpalenie lokalne
```
cd C:\Users\radzi\Downloads\domki-ekipa
npm run dev                 # wszystko offline (localStorage)
npx netlify dev --offline   # pełne API + logowanie + Blobs (zweryfikowane)
```

## LIVE URL
_(brak — po ustawieniu NETLIFY_AUTH_TOKEN loop wdroży automatycznie)_
