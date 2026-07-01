# DOMKI EKIPA — STATUS

**Runda 1 UKOŃCZONA** ✅ — setup, szkielet, seed, zielony build.

## ⚠️ WYMAGANE OD CIEBIE (raz), żeby loop wdrożył publicznie

**AUTO-DEPLOY na Netlify jest ZABLOKOWANY** (brak tokenu). Apka buduje się i chodzi lokalnie, ale nie trafi publicznie, dopóki nie wklejesz RAZ w PowerShell (i otworzysz **nowe** okno):

```
setx NETLIFY_AUTH_TOKEN "TWOJ_TOKEN_Z_NETLIFY"
```

Token: netlify.com → **User settings → Applications → Personal access tokens → New token**.

*(Node.js loop doinstalował sam — v24.18.0. Git jest.)*

## Zrobione (runda 1)
- [x] Precheck środowiska (Node/npm doinstalowane, git OK)
- [x] Szkielet: **Vite + React + TypeScript + TailwindCSS**
- [x] Seed: **84 oferty** wyciągnięte z domki-weekend.html → `src/data/offers.json` (czysty JSON)
- [x] Tablica ofert: filtry (szukaj / województwo / 1-noc / cena / dojazd / balia) + sort + karty premium + aurora tło
- [x] **Build zielony**: `tsc --noEmit` + `vite build` → `dist/` (JS 178 kB / gzip 55 kB)
- [x] Git zainicjalizowany + pierwszy commit

## Następne rundy (backlog)
- [ ] Backend: Netlify Functions + baza (Neon/Postgres, fallback Blobs)
- [ ] Auth: hasło wejścia `ekipa2026` (cookie/JWT)
- [ ] Współdzielone: updaty per oferta, RSVP (X/6), głosy ❤️, tracker terminu 3–5.07
- [ ] Wyszukiwanie fan-out (cel 150+ ofert) + bezpośrednie linki do ogłoszeń
- [ ] Oprawa premium: muzyka, konfetti, lecące ikonki, animacje
- [ ] Deploy na Netlify + **LIVE URL** (po ustawieniu tokenu)
- [ ] Weryfikacja w przeglądarce (screeny)

## Odpalenie lokalne (działa już teraz)
```
cd C:\Users\radzi\Downloads\domki-ekipa
npm install
npm run dev
```

## LIVE URL
_(brak — pojawi się po ustawieniu NETLIFY_AUTH_TOKEN i pierwszym deployu)_
