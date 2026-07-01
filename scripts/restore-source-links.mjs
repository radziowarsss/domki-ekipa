// Przywraca linki-ŹRÓDŁA (strona, na której agent znalazł/potwierdził ofertę)
// z oryginalnych danych: domki-weekend.html + wyniki fan-outów. Kasuje Google-searche.
// Gdzie źródła brak — link pusty (bez ściemy).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const OUT = 'src/data/offers.json';
const HTML = 'C:/Users/radzi/Downloads/domki-weekend.html';
const TASKS = 'C:/Users/radzi/AppData/Local/Temp/claude/C--Users-radzi-Downloads-bot/4abd2d93-5e99-4984-8695-c3f11302dbd5/tasks/';
const WF = [TASKS + 'w9as61bvl.output', TASKS + 'wavredb3n.output'];

const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
const map = new Map();
const add = (n, link) => { const k = norm(n); if (n && link && !map.has(k)) map.set(k, link); };

// 1) HTML DATA (oryginalne 84)
try {
  const html = readFileSync(HTML, 'utf8');
  const i = html.indexOf('const DATA='); const a = html.indexOf('[', i); const b = html.indexOf('];', a);
  for (const o of Function('return (' + html.slice(a, b + 1) + ')')()) add(o.n, o.link);
} catch (e) { console.log('[html] pominieto:', e.message); }

// 2) Wyniki fan-outów (zawinięte w .result.regions[].offers[])
for (const w of WF) {
  if (!existsSync(w)) { console.log('[wf] brak pliku:', w); continue; }
  try {
    const d = JSON.parse(readFileSync(w, 'utf8'));
    const root = d.result != null ? (typeof d.result === 'string' ? JSON.parse(d.result) : d.result) : d;
    for (const reg of (root.regions || [])) for (const o of (reg.offers || [])) add(o.n, o.link);
  } catch (e) { console.log('[wf] blad:', w, e.message); }
}

const isSearch = (l) => /google\.com\/search|booking\.com\/searchresults/i.test(l || '');
const isReal = (l) => { if (!l || isSearch(l)) return false; try { new URL(l); return true; } catch { return false; } };
const needsFix = (l) => !l || isSearch(l);

const offers = JSON.parse(readFileSync(OUT, 'utf8'));
let kept = 0, restored = 0, cleared = 0;
for (const o of offers) {
  if (!needsFix(o.link)) { kept++; continue; }   // ma już realny link (w tym strona własna) — zostaw
  const orig = map.get(norm(o.n));
  if (isReal(orig)) { o.link = orig; restored++; }
  else { o.link = ''; cleared++; }
}
writeFileSync(OUT, JSON.stringify(offers, null, 2), 'utf8');
console.log('[restore] mapa zrodel: ' + map.size + ' | zostawione realne: ' + kept + ' | przywrocone zrodla: ' + restored + ' | bez zrodla (pusto): ' + cleared);
