# DOMKI EKIPA — STATUS

**Runda 3 UKOŃCZONA** ✅ — logowanie + głosy ❤️ + RSVP wpięte we front (z fallbackiem offline). Build zielony.

## ⚠️ WYMAGANE OD CIEBIE (raz), żeby loop wdrożył publicznie

**AUTO-DEPLOY na Netlify ZABLOKOWANY** (brak tokenu). Wklej RAZ w PowerShell i otwórz **nowe** okno:

```
setx NETLIFY_AUTH_TOKEN "TWOJ_TOKEN_Z_NETLIFY"
```

Token: netlify.com → **User settings → Applications → Personal access tokens → New token**.

## Zrobione
- [x] **Runda 1**: szkielet Vite+React+TS+Tailwind, seed 84 oferty, build zielony, git.
- [x] **Runda 2**: backend `api.mts` (/api/*), Netlify Blobs store, auth `ekipa2026` + JWT-cookie, klient `api.ts`.
- [x] **Runda 3**: front wpięty — **ekran logowania** (hasło → /api/auth), **głosy ❤️ współdzielone** (/api/vote, licznik z /api/state), **RSVP „X/6 zaklepane"** + pasek postępu + „Jadę!". **Fallback offline** (localStorage) gdy API niedostępne, więc apka renderuje się zawsze. Sort po głosach. Build zielony (29 modułów).

## Jak działa tryb
- **Deploy / `netlify dev`**: bramka hasła aktywna, głosy i RSVP współdzielone przez Blobs.
- **Czysty `npm run dev` (bez funkcji)**: auto-tryb offline — board widoczny, głosy/RSVP trzymane lokalnie (bez logowania), banner informuje.

## Następne rundy
- [ ] **Runda 4**: netlify-cli + `netlify dev`, SMOKE-TEST API (auth→vote→rsvp→state), **screenshot w przeglądarce** (dowód renderu), deploy (gdy token) + LIVE URL.
- [ ] Updaty per oferta (feed) + tracker terminu 3–5.07 + filtr „wolne".
- [ ] Fan-out po 150+ ofert + bezpośrednie linki.
- [ ] Oprawa premium: muzyka, konfetti, lecące ikonki, animacje. Panel admin.

## Odpalenie lokalne
```
cd C:\Users\radzi\Downloads\domki-ekipa
npm install
npm run dev          # board + głosy/RSVP offline
npx netlify dev      # pełne API + logowanie (od rundy 4)
```

## LIVE URL
_(brak — po ustawieniu NETLIFY_AUTH_TOKEN i deployu)_
