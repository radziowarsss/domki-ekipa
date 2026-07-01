// Sprawdza żywotność linków (bez modyfikacji danych — tylko raport + status).
// DEAD = 404/410/DNS-fail (link do skasowania). BLOCKED = 403/429/timeout (żywe, tylko blokują bota).
import fs from 'fs';

const P = new URL('../src/data/offers.json', import.meta.url);
const o = JSON.parse(fs.readFileSync(P, 'utf8'));
const links = [...new Set(o.filter((x) => x.link).map((x) => x.link))];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36';

async function check(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 10000);
  try {
    const r = await fetch(url, { redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' } });
    clearTimeout(t);
    return r.status;
  } catch (e) {
    clearTimeout(t);
    if (e.name === 'AbortError') return 'TIMEOUT';
    return 'ERR:' + (e.cause?.code || e.message || 'x').toString().slice(0, 24);
  }
}

const results = {};
let i = 0;
const CONC = 14;
async function worker() { while (i < links.length) { const u = links[i++]; results[u] = await check(u); } }
await Promise.all(Array.from({ length: CONC }, worker));

const ok = [], dead = [], blocked = [];
for (const [u, s] of Object.entries(results)) {
  if (typeof s === 'number' && s >= 200 && s < 400) ok.push([u, s]);
  else if (s === 404 || s === 410) dead.push([u, s]);
  else if (typeof s === 'string' && /ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ERR_|CERT|getaddrinfo/i.test(s)) dead.push([u, s]);
  else blocked.push([u, s]); // 403/429/5xx/TIMEOUT — żywe, blokują bota
}
fs.writeFileSync(new URL('../src/data/link-status.json', import.meta.url), JSON.stringify(results));
console.log('unikatowych linków:', links.length);
console.log('OK:', ok.length, '| BLOCKED/timeout (żywe):', blocked.length, '| DEAD (do kasacji):', dead.length);
console.log('=== DEAD ===');
dead.slice(0, 40).forEach(([u, s]) => console.log('  ', s, u));
