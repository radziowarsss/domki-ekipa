# DOMKI EKIPA — STATUS

**Runda 15 UKOŃCZONA** ✅ — „🎲 Wylosuj domek" + „🧹 Wyczyść filtry". Build zielony. **Apka zweryfikowana wizualnie na żywo (screenshot, 0 błędów konsoli, 48 kart z 366).**

## 🚀 DEPLOY — brakuje TYLKO Twojego tokenu (site „domki-dla-ziomali" już założony)
1. https://app.netlify.com/user/applications → **Personal access tokens** → **New access token** → skopiuj.
2. PowerShell: `setx NETLIFY_AUTH_TOKEN "WKLEJ_TOKEN"` → Enter → **zamknij okno**.
3. Napisz „gotowe" — loop/ja wdrożę (`netlify deploy --prod`, frontend+funkcje+Blobs) i wpisze tu LIVE URL.
*(Wariant bez tokenu: app.netlify.com/drop → przeciągnij folder `dist` = link od ręki, ale bez współdzielenia.)*

## Zrobione (15 rund)
- R1–R7 rdzeń · R8 fan-out 240 · R9 admin+linki · R10 a11y · R11 dedup+paginacja · R12 PWA · R13 share+ranking · R14 **drugi fan-out → 366 ofert** · R15 wylosuj + wyczyść filtry.

## Funkcje (stan pełny)
Logowanie · **366 ofert** · 10 filtrów + wyczyść · 5 sortowań · paginacja · 🎲 wylosuj · głosy ❤️ + ranking · RSVP X/6 · feed updatów + usuwanie · tracker terminu 3–5.07 + dashboard · feed aktywności · udostępnianie · muzyka+konfetti+animacje · a11y · PWA · fallback offline.

## Odpalenie lokalne / podgląd
```
cd C:\Users\radzi\Downloads\domki-ekipa && npm run dev
```
(Preview w tej sesji: config „domki" w bot/.claude/launch.json.)

## LIVE URL
_(brak — po `setx NETLIFY_AUTH_TOKEN` loop wdroży na domki-dla-ziomali)_
