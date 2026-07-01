// Poprawia bezpośrednie linki w src/data/offers.json:
// puste albo do strony głównej -> Booking deep-link wyszukiwania (miejscowość + daty 04-05.07.2026 + 6 os).
import { readFileSync, writeFileSync } from 'node:fs';

const F = 'src/data/offers.json';
const offers = JSON.parse(readFileSync(F, 'utf8'));

const town = (loc) => String(loc || '').split(/[·,/(]/)[0].trim();

function isBad(link) {
  if (!link) return true;
  try {
    const u = new URL(link);
    return u.pathname === '/' || u.pathname === '';
  } catch {
    return true;
  }
}

function bookingSearch(loc) {
  const ss = encodeURIComponent(town(loc) || 'jezioro Polska');
  return `https://www.booking.com/searchresults.pl.html?ss=${ss}&checkin=2026-07-04&checkout=2026-07-05&group_adults=6&no_rooms=1`;
}

let fixed = 0;
for (const o of offers) {
  if (isBad(o.link)) { o.link = bookingSearch(o.loc); fixed++; }
}
writeFileSync(F, JSON.stringify(offers, null, 2), 'utf8');
console.log('[fix-links] poprawiono ' + fixed + ' linkow z ' + offers.length + ' ofert');
