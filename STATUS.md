# DOMKI EKIPA — STATUS

**LIVE:** https://piwko-jeziorko.netlify.app (hasło: `ekipa2026`) — **pełny backend działa** (funkcje + Blobs, /api/auth OK). Repo: github.com/radziowarsss/domki-ekipa.

## Runda 19 — LINKI do ŹRÓDŁA (poprawka po feedbacku)
- Cofnięte Google-searche. Każda oferta linkuje do **strony, na której info znaleziono/potwierdzono** (ogłoszenie / strona ośrodka / nocowanie / Booking listing) — `scripts/restore-source-links.mjs` odtwarza linki z domki-weekend.html + wyników fan-outów.
- Stan: **354 linki do źródła · 0 Google · 12 bez realnego źródła (puste, bez ściemy — mają telefon).**

## Runda 18 — oprawa lżejsza/premium
- Latające emoji ściszone (18→7, opacity .16); ciężki `blur(90px)` → radialny glow (`blur(50px)`) — lepszy wygląd i wydajność.
- **OPRAWA — mniej cyrku, więcej premium:** latające emoji ściszone (18→7, opacity .16), ciężki `blur(90px)` zamieniony na czysty radialny glow (`blur(50px)`) — lepszy wygląd i wydajność.
- Build zielony, pushnięte → Netlify przebudowuje z repo.

## Funkcje (stan)
366 ofert · logowanie · 10 filtrów + wyczyść · 5 sortowań · paginacja · 🎲 wylosuj · głosy ❤️ + ranking · RSVP X/6 · feed updatów + usuwanie · tracker terminu 3–5.07 + dashboard · feed aktywności · udostępnianie · 📋 kopiuj numer · konfetti/muzyka · a11y · PWA · fallback offline.

## Do ewentualnej dalszej poprawy
- Literalne linki 1-klik do 129 ofert (zamiast Google-search) = głębszy scrape agentami (cięższe) — do zrobienia na życzenie.

## Skrypty danych
extract-seed (merge) · merge-fanout · dedup · fix-tmin · google-links.
