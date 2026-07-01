// Dla ofert linkujących do STRONY GŁÓWNEJ (path "/" lub "") — wchodzi na homepage,
// szuka głębszej podstrony oferty (cennik/rezerwacja/oferta/domki/noclegi) i podmienia link.
// Gdzie nie znajdzie sensownej podstrony — zostawia homepage (zwykle pojedynczy obiekt).
import fs from 'fs';

const P = new URL('../src/data/offers.json', import.meta.url);
const o = JSON.parse(fs.readFileSync(P, 'utf8'));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36';

const pathOf = (l) => { try { const u = new URL(l); return u.pathname + u.search; } catch { return null; } };
const isHome = (l) => { const p = pathOf(l); return l && (p === '' || p === '/'); };

// słowa-klucze -> waga (im wyżej, tym bardziej „konkretna oferta")
const KW = [
  [/rezerwacj|rezerwuj|booking/i, 6],
  [/cennik|ceny\b/i, 6],
  [/\boferta|nasza-oferta|oferty/i, 5],
  [/nasze-domki|nasze_domki/i, 5],
  [/\bdomki\b|\bdomek\b|domki-/i, 3],
  [/noclegi|apartament|pokoje|obiekt|chatki|chaty/i, 2],
];
function score(href, text) {
  const s = (href + ' ' + text).toLowerCase();
  let best = 0;
  for (const [re, w] of KW) if (re.test(s)) best = Math.max(best, w);
  return best;
}

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  try {
    const r = await fetch(url, { redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': UA, accept: 'text/html' } });
    clearTimeout(t);
    if (!r.ok) return null;
    return await r.text();
  } catch { clearTimeout(t); return null; }
}
async function alive(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 10000);
  try { const r = await fetch(url, { redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': UA } }); clearTimeout(t); return r.status >= 200 && r.status < 400; }
  catch { clearTimeout(t); return false; }
}

async function bestSub(home) {
  const html = await fetchText(home);
  if (!html) return null;
  const base = new URL(home);
  const cand = new Map(); // url -> score
  const re = /<a\s[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    let href = m[1];
    const text = m[2].replace(/<[^>]+>/g, ' ').trim();
    if (/^(mailto:|tel:|javascript:)/i.test(href)) continue;
    let abs;
    try { abs = new URL(href, base); } catch { continue; }
    if (abs.hostname.replace(/^www\./, '') !== base.hostname.replace(/^www\./, '')) continue; // tylko ta domena
    const p = abs.pathname + abs.search;
    if (p === '' || p === '/' ) continue;               // to dalej homepage
    if (/\.(jpg|jpeg|png|gif|webp|pdf|zip|css|js)$/i.test(p)) continue;
    const sc = score(p, text);
    if (sc <= 0) continue;
    abs.hash = '';
    const key = abs.toString();
    cand.set(key, Math.max(cand.get(key) || 0, sc));
  }
  if (!cand.size) return null;
  const sorted = [...cand.entries()].sort((a, b) => b[1] - a[1] || a[0].length - b[0].length);
  for (const [url, sc] of sorted.slice(0, 3)) {
    if (sc >= 3 && await alive(url)) return url;   // podmieniamy tylko na sensowną + żywą
  }
  return null;
}

const targets = o.filter((x) => isHome(x.link));
console.log('homepage do sprawdzenia:', targets.length);
let up = 0, keep = 0;
let i = 0;
const CONC = 8;
async function worker() {
  while (i < targets.length) {
    const x = targets[i++];
    const sub = await bestSub(x.link);
    if (sub && sub !== x.link) { console.log('UP  ', x.n, '\n     ', x.link, '->', sub); x.link = sub; up++; }
    else { keep++; }
  }
}
await Promise.all(Array.from({ length: CONC }, worker));

fs.writeFileSync(P, JSON.stringify(o, null, 2) + '\n');
console.log('---');
console.log('podmienione na głębszą podstronę:', up, '| zostawione homepage (pojedynczy obiekt/JS):', keep);
