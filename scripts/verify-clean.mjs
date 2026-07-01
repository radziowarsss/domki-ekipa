// Deterministyczne czyszczenie danych ofert (bez sieci):
// 1) normalizacja województwa (lodzkie -> łódzkie)
// 2) kasowanie podejrzanych telefonów (ten sam numer na >=2 różnych domenach = numer agregatora/scraper)
// 3) kasowanie generycznych linków agregatorów (homepage / strona wyszukiwania) — link ma prowadzić do KONKRETNEJ oferty
// 4) dedup po konkretnym linku (zostaje najbogatszy rekord)
import fs from 'fs';

const P = new URL('../src/data/offers.json', import.meta.url);
let o = JSON.parse(fs.readFileSync(P, 'utf8'));
const before = o.length;

const host = (l) => { try { return new URL(l).hostname.replace(/^www\./, ''); } catch { return ''; } };
const pathOf = (l) => { try { const u = new URL(l); return u.pathname + u.search; } catch { return ''; } };

// 1) województwo
let fixWoj = 0;
for (const x of o) if (x.w === 'lodzkie') { x.w = 'łódzkie'; fixWoj++; }

// 2) podejrzane telefony (cross-domain)
const telDomains = {};
for (const x of o) if (x.tel) {
  const t = x.tel.replace(/\s/g, '');
  const h = host(x.link);
  (telDomains[t] = telDomains[t] || new Set()).add(h || '?');
}
const badTel = new Set(Object.entries(telDomains)
  .filter(([, s]) => [...s].filter((d) => d && d !== '?').length >= 2)
  .map(([t]) => t));
let blankTel = 0;
for (const x of o) if (x.tel && badTel.has(x.tel.replace(/\s/g, ''))) { x.tel = ''; blankTel++; }

// 3) generyczne linki agregatorów
const AGG = ['nocowanie.pl', 'booking.com', 'olx.pl', 'slowhop.com', 'e-turysta.com', 'noclegi.pl', 'alohacamp.com', 'meteor-turystyka.pl', 'airbnb.com', 'fajnewczasy.pl'];
const isGeneric = (l) => {
  if (!l) return false;
  const h = host(l), p = pathOf(l);
  if (!AGG.includes(h)) return false;        // własna domena obiektu — zostaje nawet root
  if (p === '' || p === '/') return true;      // homepage agregatora
  if (h === 'olx.pl' && /\/d\/oferty\//.test(p)) return true; // OLX lista/szukajka
  if (/\/(szukaj|search|q-)/i.test(p)) return true;
  return false;                                // konkretna oferta na agregatorze — zostaje
};
let blankLink = 0;
const blankedNames = [];
for (const x of o) if (isGeneric(x.link)) { blankedNames.push(x.n + ' [' + host(x.link) + ']'); x.link = ''; blankLink++; }

// 4) dedup po konkretnym linku
const score = (x) => (x.tel ? 2 : 0) + (x.link ? 2 : 0) + (x.pn > 0 ? 1 : 0) + (x.note ? x.note.length / 200 : 0) + (x.feat ? 1 : 0);
const byLink = {};
for (const x of o) { if (!x.link) continue; (byLink[x.link] = byLink[x.link] || []).push(x); }
const remove = new Set();
const mergedGroups = [];
for (const [l, arr] of Object.entries(byLink)) if (arr.length > 1) {
  arr.sort((a, b) => score(b) - score(a));
  mergedGroups.push(arr.length + '× ' + host(l) + ' -> keep "' + arr[0].n + '"');
  for (const x of arr.slice(1)) remove.add(x);
}
o = o.filter((x) => !remove.has(x));

const noSource = o.filter((x) => !x.link && !x.tel).length;
const withLink = o.filter((x) => x.link).length;
const withTel = o.filter((x) => x.tel).length;

fs.writeFileSync(P, JSON.stringify(o, null, 2) + '\n');
console.log('=== VERIFY-CLEAN ===');
console.log('before:', before, '-> after:', o.length, '(usunięto dubli:', before - o.length, ')');
console.log('woj lodzkie->łódzkie:', fixWoj);
console.log('skasowane podejrzane tel:', blankTel, '| unikatowych numerów:', badTel.size);
console.log('skasowane generyczne linki:', blankLink);
console.log('  ->', blankedNames.slice(0, 25).join('  |  '));
console.log('grupy dedup:', mergedGroups.length);
mergedGroups.slice(0, 20).forEach((g) => console.log('  ', g));
console.log('---');
console.log('po czyszczeniu: z linkiem:', withLink, '| z telefonem:', withTel, '| bez ŻADNEGO źródła (link i tel puste):', noSource);
