// MERGE seed: łączy istniejące src/data/offers.json z ofertami z domki-weekend.html
// (dedup po znormalizowanej nazwie). NIE nadpisuje — dzięki temu oferty dodane
// przez fan-out (rundy wyszukiwania) przeżywają każdy build.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const SRC = 'C:/Users/radzi/Downloads/domki-weekend.html';
const OUT = 'src/data/offers.json';

function loadExisting() {
  try { if (existsSync(OUT)) return JSON.parse(readFileSync(OUT, 'utf8')); } catch { /* ignore */ }
  return [];
}
function fromHtml() {
  try {
    if (!existsSync(SRC)) return [];
    const html = readFileSync(SRC, 'utf8');
    const start = html.indexOf('const DATA=');
    if (start === -1) return [];
    const arrStart = html.indexOf('[', start);
    const arrEnd = html.indexOf('];', arrStart);
    const arrText = html.slice(arrStart, arrEnd + 1);
    return Function('return (' + arrText + ')')();
  } catch { return []; }
}
const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();

const existing = loadExisting();
const html = fromHtml();
const map = new Map();
// Kolejność: najpierw HTML, potem existing — existing (z ew. poprawkami/nowymi) wygrywa.
for (const o of [...html, ...existing]) {
  if (!o || !o.n) continue;
  const k = norm(o.n);
  map.set(k, { ...(map.get(k) || {}), ...o });
}
const merged = [...map.values()];
mkdirSync('src/data', { recursive: true });
writeFileSync(OUT, JSON.stringify(merged, null, 2), 'utf8');
console.log('[seed] merge OK:', merged.length, 'ofert (html ' + html.length + ' + existing ' + existing.length + ') ->', OUT);
