// Merguje oferty z wyniku workflow fan-out do src/data/offers.json.
// Użycie: node scripts/merge-fanout.mjs "<sciezka-do-pliku-wyniku>"
import { readFileSync, writeFileSync } from 'node:fs';

const RESULT = process.argv[2];
const OFFERS = 'src/data/offers.json';
const VALID_W = new Set(['kuj-pom', 'wielkopolskie', 'pomorskie', 'mazowieckie', 'warm-maz', 'lodzkie']);

function parseResult(path) {
  const txt = readFileSync(path, 'utf8');
  try { return JSON.parse(txt); } catch { /* dalej */ }
  const i = txt.indexOf('{"regions"');
  const start = i >= 0 ? i : txt.indexOf('{');
  const end = txt.lastIndexOf('}');
  return JSON.parse(txt.slice(start, end + 1));
}

const num = (v, d = 0) => { const n = Number(v); return Number.isFinite(n) ? n : d; };
const bit = (v) => (v ? 1 : 0);
const str = (v) => (v == null ? '' : String(v));
const norm = (s) => str(s).toLowerCase().replace(/\s+/g, ' ').trim();

function normOffer(o) {
  if (!o || !o.n) return null;
  let w = str(o.w).toLowerCase().trim();
  if (w === 'łódzkie') w = 'lodzkie';
  if (!VALID_W.has(w)) w = w || '';
  return {
    n: str(o.n).trim(),
    w,
    r: str(o.r),
    loc: str(o.loc),
    tT: str(o.tT),
    tI: str(o.tI),
    cap: str(o.cap) || '6',
    one: ['tak', 'potw', 'luka'].includes(str(o.one)) ? str(o.one) : 'potw',
    price: str(o.price),
    pn: num(o.pn, 0),
    tmin: num(o.tmin, 0),
    balia: bit(o.balia),
    jez: bit(o.jez),
    tel: str(o.tel),
    link: str(o.link).replace(/&amp;/g, '&'),
    note: str(o.note),
    feat: bit(o.feat),
  };
}

const data = parseResult(RESULT);
// wynik workflow jest zawinięty: { summary, logs, result: {regions,...}, ... }
const root = data && data.result != null
  ? (typeof data.result === 'string' ? JSON.parse(data.result) : data.result)
  : data;
const regions = Array.isArray(root.regions) ? root.regions : [];
const rawNew = [];
for (const reg of regions) {
  const offs = reg && Array.isArray(reg.offers) ? reg.offers : [];
  for (const o of offs) { const n = normOffer(o); if (n) rawNew.push(n); }
}

const existing = JSON.parse(readFileSync(OFFERS, 'utf8'));
const seen = new Set(existing.map((o) => norm(o.n)));
const merged = [...existing];
let added = 0;
for (const o of rawNew) {
  const k = norm(o.n);
  if (!k || seen.has(k)) continue;
  seen.add(k);
  merged.push(o);
  added++;
}
writeFileSync(OFFERS, JSON.stringify(merged, null, 2), 'utf8');
console.log('[merge-fanout] existing ' + existing.length + ' + nowe(surowe) ' + rawNew.length + ' => dodano ' + added + ', RAZEM ' + merged.length);
