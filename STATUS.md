# DOMKI EKIPA — STATUS

**Runda 5 UKOŃCZONA** ✅ — tracker terminu 3–5.07 (dostępność per oferta) + dashboard + filtr. Build zielony.

## ⚠️ JEDYNE co blokuje publiczny LIVE URL (raz, od Ciebie)

Wklej RAZ w PowerShell i otwórz **nowe** okno — loop sam wdroży w kolejnej rundzie:
```
setx NETLIFY_AUTH_TOKEN "TWOJ_TOKEN_Z_NETLIFY"
```
Token: netlify.com → **User settings → Applications → Personal access tokens → New token**.

## Zrobione
- [x] **R1** szkielet Vite+React+TS+Tailwind, seed 84 oferty.
- [x] **R2** backend (/api/*) na Netlify Blobs + auth JWT (hasło ekipa2026).
- [x] **R3** logowanie + głosy ❤️ + RSVP X/6 + „Jadę!".
- [x] **R4** feed updatów per oferta. **API zweryfikowane na żywo** (netlify dev smoke OK).
- [x] **R5** **tracker terminu 3–5.07**: na karcie segmenty wolne/zajęte/do potw. → /api/availability + badge koloru; dashboard w hero „✅ X wolnych / ❌ Y zajętych"; filtr „✅ wolne 3–5.07". Fallback offline. Build zielony.

## Funkcje (stan)
Logowanie hasłem · tablica 84 ofert · filtry (szukaj/woj/1-noc/cena/dojazd/balia/**wolne 3–5.07**) · sort (polecane/cena/dojazd/głosy/update) · głosy ❤️ współdzielone · RSVP X/6 · feed updatów per oferta · tracker terminu 3–5.07 · dashboard · **fallback offline (localStorage) — zawsze się renderuje**.

## Następne rundy
- [ ] **R6**: oprawa premium (muzyka chill-pad toggle, konfetti na akcjach, lecące ikonki, animacje wejścia kart, glassmorphism).
- [ ] Więcej filtrów (jezioro, tylko TOP, „potwierdzone przez ekipę"). Globalny feed aktywności. Panel admin.
- [ ] Bezpośrednie linki (Booking deep-link 2026-07-03→05). Fan-out po 150+ ofert.
- [ ] **Deploy + LIVE URL** (gdy token).

## Odpalenie lokalne
```
cd C:\Users\radzi\Downloads\domki-ekipa
npm run dev                 # board + wszystko offline (localStorage)
npx netlify dev --offline   # pełne API + logowanie + Blobs (zweryfikowane)
```

## LIVE URL
_(brak — po ustawieniu NETLIFY_AUTH_TOKEN loop wdroży automatycznie)_
