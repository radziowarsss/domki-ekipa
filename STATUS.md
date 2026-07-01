# DOMKI EKIPA — STATUS

**KOD NA GITHUBIE** ✅ → ostatni krok: import w Netlify (klik-po-kliku niżej).

## 🔗 Repo
**https://github.com/radziowarsss/domki-ekipa** (branch `master`, 30 plików, zero sekretów).

## 🚀 OSTATNI KROK — import do Netlify (pełna apka: frontend + funkcje + Blobs)
1. **app.netlify.com** → **Add new site** → **Import an existing project**.
2. **Deploy with GitHub** → autoryzuj Netlify (jeśli pyta „Configure on GitHub", daj dostęp do repo `domki-ekipa`).
3. Wybierz repo **radziowarsss/domki-ekipa**.
4. Ustawienia (Netlify wykryje z netlify.toml — zostaw jak jest):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Branch: `master`
5. **Deploy** → po ~1–2 min masz **LIVE URL**.
6. *(opcjonalnie, bezpieczeństwo)* Site configuration → Environment variables → dodaj `JWT_SECRET` = dowolny długi losowy ciąg (jest fallback, więc niekonieczne). Hasło wejścia domyślnie `ekipa2026` (można nadpisać zmienną `APP_PASSWORD`).

## Dlaczego GitHub, nie token
Token/CLI deploy zwracał 403 (konto bez uprawnień do publikacji przez API). Build z GitHuba idzie osobnym pipeline'em (autoryzacja przez przeglądarkę) — to jedyna żywa droga do backendu.

## Stan apki (16 rund, gotowa)
366 ofert · logowanie (ekipa2026) · 10 filtrów + wyczyść · 5 sortowań · paginacja · 🎲 wylosuj · głosy ❤️ + ranking · RSVP X/6 · feed updatów + usuwanie · tracker terminu 3–5.07 + dashboard · feed aktywności · udostępnianie · 📋 kopiuj numer · muzyka/konfetti/animacje · a11y · PWA · fallback offline. Zweryfikowana wizualnie (screenshot, 0 błędów).

## LIVE URL
_(pojawi się po imporcie w Netlify — wpisz go tu / powiedz mi, zrobię screenshot na żywo)_
