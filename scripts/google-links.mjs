// Zamienia słabe linki (booking-search / homepage / puste) na celowany Google-search
// nazwy oferty + miejscowości — ląduje na konkretnej ofercie zamiast wyszukiwarce.
import { readFileSync, writeFileSync } from 'node:fs';

const F = 'src/data/offers.json';
const offers = JSON.parse(readFileSync(F, 'utf8'));
const town = (loc) => String(loc || '').split(/[·,/(]/)[0].trim();

function isBad(link) {
  if (!link) return true;
  if (/booking\.com\/searchresults/i.test(link)) return true;
  try {
    const u = new URL(link);
    return u.pathname === '/' || u.pathname === '';
  } catch {
    return true;
  }
}
const googleLink = (o) =>
  'https://www.google.com/search?q=' + encodeURIComponent(`${o.n} ${town(o.loc)} domek nocleg`);

let n = 0;
for (const o of offers) {
  if (isBad(o.link)) { o.link = googleLink(o); n++; }
}
writeFileSync(F, JSON.stringify(offers, null, 2), 'utf8');
console.log('[google-links] naprawiono ' + n + ' slabych linkow -> Google-search do oferty (z ' + offers.length + ')');
