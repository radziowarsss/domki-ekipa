# DOMKI EKIPA — STATUS

**LIVE:** https://piwko-jeziorko.netlify.app (hasło: `ekipa2026`) — **pełny backend działa** (funkcje + Blobs, /api/auth OK). Repo: github.com/radziowarsss/domki-ekipa.

## Runda 18 — poprawki jakości (po feedbacku „słabo")
- **LINKI naprawione:** 129 słabych (booking-search / homepage) → **celowany Google-search nazwy oferty + miejscowości** (ląduje na konkretnej ofercie, nie na wyszukiwarce hoteli). Naprawiony błąd, który wcześniej nadpisywał dobre linki własnych stron. Stan: 237 bezpośrednich + 129 Google-do-oferty, 0 booking-searchy.
- **OPRAWA — mniej cyrku, więcej premium:** latające emoji ściszone (18→7, opacity .16), ciężki `blur(90px)` zamieniony na czysty radialny glow (`blur(50px)`) — lepszy wygląd i wydajność.
- Build zielony, pushnięte → Netlify przebudowuje z repo.

## Funkcje (stan)
366 ofert · logowanie · 10 filtrów + wyczyść · 5 sortowań · paginacja · 🎲 wylosuj · głosy ❤️ + ranking · RSVP X/6 · feed updatów + usuwanie · tracker terminu 3–5.07 + dashboard · feed aktywności · udostępnianie · 📋 kopiuj numer · konfetti/muzyka · a11y · PWA · fallback offline.

## Do ewentualnej dalszej poprawy
- Literalne linki 1-klik do 129 ofert (zamiast Google-search) = głębszy scrape agentami (cięższe) — do zrobienia na życzenie.

## Skrypty danych
extract-seed (merge) · merge-fanout · dedup · fix-tmin · google-links.
