// Scala oferty od agentów (wyciąga JSON z plików .output) z bazą offers.json.
// Te same reguły czyszczenia co verify-clean: fejk-tel, generyczne linki, dedup, normalizacja woj.
import fs from 'fs';
import path from 'path';

const TASKS = process.argv[2];
if (!TASKS) { console.error('podaj katalog tasks jako argv[2]'); process.exit(1); }
const P = new URL('../src/data/offers.json', import.meta.url);
const base = JSON.parse(fs.readFileSync(P, 'utf8'));

// ---- wczytanie plików new-*.json (płaskie tablice ofert od agentów) ----
const files = fs.readdirSync(TASKS).filter((f) => f.startsWith('new-') && f.endsWith('.json')).map((f) => path.join(TASKS, f));
let incoming = [];
for (const f of files) {
  try { const arr = JSON.parse(fs.readFileSync(f, 'utf8')); if (Array.isArray(arr)) incoming.push(...arr); } catch (e) { console.error('błąd', f, e.message); }
}
console.log('pliki new-*.json:', files.length, '| surowych ofert', incoming.length);

// ---- helpery ----
const unesc = (s) => String(s == null ? '' : s)
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;|&#x27;/g, "'").replace(/&amp;/g, '&');
const host = (l) => { try { return new URL(l).hostname.replace(/^www\./, ''); } catch { return ''; } };
const pathOf = (l) => { try { const u = new URL(l); return u.pathname + u.search; } catch { return ''; } };
const deac = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const normName = (s) => deac(String(s).toLowerCase()).replace(/[^a-z0-9]/g, '');
const WOJ_OK = new Set(['kuj-pom', 'wielkopolskie', 'pomorskie', 'mazowieckie', 'warm-maz', 'łódzkie']);
const AGG = ['nocowanie.pl', 'booking.com', 'olx.pl', 'slowhop.com', 'e-turysta.com', 'e-turysta.pl', 'noclegi.pl', 'alohacamp.com', 'meteor-turystyka.pl', 'airbnb.com', 'fajnewczasy.pl', 'noclegowo.pl', 'noclegi-online.pl', 'odkryjpomorze.pl'];
const isGeneric = (l) => {
  if (!l) return false;
  const h = host(l), p = pathOf(l);
  if (!AGG.includes(h)) return false;
  if (p === '' || p === '/') return true;
  if (h === 'olx.pl' && /\/d\/oferty\//.test(p)) return true;
  if (/\/(szukaj|search|q-)/i.test(p)) return true;
  return false;
};
const capNum = (c) => { const m = String(c).match(/\d+/); return m ? +m[0] : 6; };

// ---- czyszczenie przychodzących ----
let clean = [];
for (const x of incoming) {
  if (!x || !x.n || !x.link && !x.tel) continue;
  const o = { ...x };
  o.n = unesc(o.n); o.loc = unesc(o.loc); o.r = unesc(o.r); o.note = unesc(o.note); o.price = unesc(o.price);
  if (o.w === 'kujawskie' || o.w === 'kuj-pomorskie') o.w = 'kuj-pom';
  if (o.w === 'lodzkie') o.w = 'łódzkie';
  if (!WOJ_OK.has(o.w)) o.w = 'kuj-pom';
  if (capNum(o.cap) < 5) continue;                 // za mało na 6-os ekipę
  if (isGeneric(o.link)) o.link = '';               // homepage/szukajka agregatora
  o.tel = String(o.tel || '');
  o.pn = +o.pn > 0 ? +o.pn : 0;
  o.tmin = +o.tmin > 0 ? +o.tmin : 90;
  o.balia = o.balia ? 1 : 0; o.jez = o.jez ? 1 : 0; o.feat = o.feat ? 1 : 0;
  if (!o.price || o.price === '0') o.price = o.pn > 0 ? o.pn + ' zł' : 'cena: zapytaj';
  clean.push(o);
}

// ---- fejk-tel: numer na >=2 różnych domenach (na całości: baza+nowe) ----
const all0 = [...base, ...clean];
const telDom = {};
for (const x of all0) if (x.tel) { const t = x.tel.replace(/\s/g, ''); (telDom[t] = telDom[t] || new Set()).add(host(x.link) || '?'); }
const badTel = new Set(Object.entries(telDom).filter(([, s]) => [...s].filter((d) => d && d !== '?').length >= 2).map(([t]) => t));
badTel.add('221168296');
for (const x of clean) if (x.tel && badTel.has(x.tel.replace(/\s/g, ''))) x.tel = '';

// ---- dedup: klucze z bazy (link + normName) ----
const seenLink = new Set(base.filter((x) => x.link).map((x) => x.link));
const seenName = new Set(base.map((x) => normName(x.n)));
let added = 0, dupName = 0, dupLink = 0;
const out = [...base];
for (const o of clean) {
  const nn = normName(o.n);
  if (o.link && seenLink.has(o.link)) { dupLink++; continue; }
  if (seenName.has(nn)) { dupName++; continue; }
  out.push(o);
  if (o.link) seenLink.add(o.link);
  seenName.add(nn);
  added++;
}

fs.writeFileSync(P, JSON.stringify(out, null, 2) + '\n');
const byW = {}; for (const x of out) byW[x.w] = (byW[x.w] || 0) + 1;
console.log('czyste nowe:', clean.length, '| dodane:', added, '| odrzucone dubel-link:', dupLink, '| dubel-nazwa:', dupName);
console.log('BAZA:', base.length, '-> PO SCALENIU:', out.length);
console.log('wg województw:', JSON.stringify(byW));
