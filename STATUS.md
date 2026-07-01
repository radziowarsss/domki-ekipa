# DOMKI EKIPA — STATUS

**Runda 6 UKOŃCZONA** ✅ — oprawa premium (muzyka + konfetti + lecące ikonki + animacje). Build zielony.

## ⚠️ JEDYNE co blokuje publiczny LIVE URL (raz, od Ciebie)

Wklej RAZ w PowerShell i otwórz **nowe** okno — loop sam wdroży w kolejnej rundzie:
```
setx NETLIFY_AUTH_TOKEN "TWOJ_TOKEN_Z_NETLIFY"
```
Token: netlify.com → **User settings → Applications → Personal access tokens → New token**.

## Zrobione
- [x] **R1** szkielet Vite+React+TS+Tailwind, seed 84 oferty.
- [x] **R2** backend (/api/*) na Netlify Blobs + auth JWT (hasło ekipa2026).
- [x] **R3** logowanie + głosy ❤️ + RSVP X/6.
- [x] **R4** feed updatów per oferta. **API zweryfikowane na żywo** (netlify dev smoke OK).
- [x] **R5** tracker terminu 3–5.07 + dashboard + filtr.
- [x] **R6** **oprawa premium**: 🎵 muzyka (chill ambient pad WebAudio, toggle w rogu, off domyślnie); 🎉 konfetti (canvas) na głos/RSVP/„wolne"; lecące ikonki w tle (🏕️🌊🔥🍺); animacje wejścia kart + aurora. Samowystarczalne (zero zewn. zależności). Build zielony (30 modułów).

## Funkcje (stan)
Logowanie hasłem · 84 oferty · filtry (szukaj/woj/1-noc/cena/dojazd/balia/wolne-3–5.07) · sort (polecane/cena/dojazd/głosy/update) · głosy ❤️ · RSVP X/6 · feed updatów per oferta · tracker terminu 3–5.07 + dashboard · **muzyka + konfetti + animacje** · fallback offline (localStorage).

## Następne rundy
- [ ] **R7**: więcej filtrów (jezioro, tylko TOP, „potwierdzone przez ekipę") + globalny feed aktywności.
- [ ] Panel admin. Bezpośrednie linki (Booking deep-link 2026-07-03→05).
- [ ] **Fan-out ~16 agentów → 150+ ofert** (regeneracja offers.json).
- [ ] **Deploy + LIVE URL** (gdy token).

## Odpalenie lokalne
```
cd C:\Users\radzi\Downloads\domki-ekipa
npm run dev                 # wszystko offline (localStorage)
npx netlify dev --offline   # pełne API + logowanie + Blobs (zweryfikowane)
```

## LIVE URL
_(brak — po ustawieniu NETLIFY_AUTH_TOKEN loop wdroży automatycznie)_
