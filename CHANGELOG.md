# CHANGELOG — Domki Ekipa

## Runda 11 — dedup + paginacja
- `scripts/dedup.mjs`: usuwa near-duplikaty (znormalizowana nazwa ≥8 znaków + ta sama miejscowość → zostaje najlepsza oferta wg score: link /d/oferta lub własna strona, feat, cena, telefon). Usunięto 7 → ~233.
- Front: paginacja — 48 kart + „Pokaż więcej (+48)", reset limitu przy zmianie filtrów (płynność przy 233 kartach na mobile).
- Build zielony.

## Runda 10 — a11y + jakość danych
- Aria-labele (głos ❤️, usuń ✕, muzyka). `scripts/fix-tmin.mjs` — potwierdzono, że wszystkie oferty mają tmin.

## Runda 9 — panel admin + linki
- `/api/del-update` + przycisk ✕. `scripts/fix-links.mjs`: 99 linków → Booking deep-link.

## Runda 8 — FAN-OUT: 84 → 240 ofert (seed merge + merge-fanout)
## Runda 7 — filtry + feed aktywności
## Runda 6 — oprawa premium (muzyka/konfetti/ikonki)
## Runda 5 — tracker terminu 3–5.07
## Runda 4 — feed updatów + API smoke OK
## Runda 3 — logowanie + głosy + RSVP
## Runda 2 — backend (Blobs + JWT)
## Runda 1 — szkielet + seed 84 oferty
