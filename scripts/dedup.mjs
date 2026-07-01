// Usuwa near-duplikaty w src/data/offers.json (ta sama oferta pod różnymi nazwami).
// Zachowawczo: łączy tylko gdy znormalizowana nazwa jest wystarczająco konkretna (>=8 znaków) i ta sama miejscowość.
import { readFileSync, writeFileSync } from 'node:fs';

const F = 'src/data/offers.json';
const offers = JSON.parse(readFileSync(F, 'utf8'));

const STOP = new Set(['domek', 'domki', 'domkow', 'dom', 'nad', 'jeziorem', 'jezioro', 'jeziora', 'os', 'osob', 'osobowy', 'osobowe', 'osobowa', 'letniskowy', 'letniskowe', 'letniskowa', 'wynajem', 'wynajme', 'na', 'oferta', 'caloroczny', 'caloroczne', 'nowy', 'nowe']);
const fold = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l');
function normName(s) {
  return fold(s).replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w && w.length > 1 && !STOP.has(w) && !/^\d+$/.test(w)).sort().join(' ').trim();
}
const town = (loc) => fold(loc).split(/[·,/(]/)[0].replace(/[^a-z0-9 ]+/g, ' ').trim();
function score(o) {
  const l = String(o.link || '');
  let s = 0;
  if (/\/d\/oferta|\/hotel\//i.test(l)) s += 4;
  if (l && !/searchresults/i.test(l)) s += 2;
  s += (o.feat ? 2 : 0) + (Number(o.pn) > 0 ? 1 : 0) + (o.tel ? 1 : 0) + (String(o.note || '').length > 40 ? 1 : 0);
  return s;
}

const groups = new Map();
let idx = 0;
for (const o of offers) {
  const nn = normName(o.n);
  const key = nn.length >= 8 ? nn + '|' + town(o.loc) : 'uniq_' + (idx++);
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(o);
}
const out = [];
let removed = 0;
for (const arr of groups.values()) {
  if (arr.length === 1) { out.push(arr[0]); continue; }
  arr.sort((a, b) => score(b) - score(a));
  out.push(arr[0]);
  removed += arr.length - 1;
}
writeFileSync(F, JSON.stringify(out, null, 2), 'utf8');
console.log('[dedup] usunieto ' + removed + ' near-duplikatow, zostalo ' + out.length + ' z ' + offers.length);
