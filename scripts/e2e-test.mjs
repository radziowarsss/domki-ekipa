// E2E test backendu (prod): auth, autoryzacja, state, vote, rsvp, update, del, availability, reset, cache.
// Używa izolowanego slug/name, na końcu robi reset -> czysto dla ekipy.
const BASE = process.env.BASE || 'https://piwko-jeziorko.netlify.app';
const PW = process.env.PW || 'ekipa2026';
const SLUG = '__E2E_TEST__';
const NAME = '__E2E_BOT__';

let pass = 0, fail = 0;
const log = (ok, msg, extra = '') => { console.log(`${ok ? '✅ PASS' : '❌ FAIL'}  ${msg}${extra ? '  → ' + extra : ''}`); ok ? pass++ : fail++; };

let cookie = '';
async function api(path, opts = {}) {
  const r = await fetch(`${BASE}/api/${path}`, {
    ...opts,
    headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}), ...(opts.headers || {}) },
  });
  const setC = r.headers.get('set-cookie');
  if (setC) cookie = setC.split(';')[0];
  let body = null; try { body = await r.json(); } catch { /* nie-json */ }
  return { status: r.status, body, cacheControl: r.headers.get('cache-control') };
}

console.log('=== E2E:', BASE, '===\n');

// 1. auth złe hasło
let r = await api('auth', { method: 'POST', body: JSON.stringify({ password: 'zle' }) });
log(r.status === 401, 'auth: złe hasło → 401', 'status ' + r.status);

// 2. state bez cookie → 401
cookie = '';
r = await api('state');
log(r.status === 401, 'state bez logowania → 401 (ochrona)', 'status ' + r.status);

// 3. auth poprawne → 200 + cookie + no-store
r = await api('auth', { method: 'POST', body: JSON.stringify({ password: PW }) });
log(r.status === 200 && r.body?.ok === true, 'auth: poprawne hasło → 200 ok', 'status ' + r.status);
log(!!cookie, 'auth: dostaliśmy cookie (JWT)', cookie.slice(0, 22) + '…');
log(/no-store/.test(r.cacheControl || ''), 'auth: nagłówek no-store (anty-cache)', r.cacheControl || 'brak');

// 4. state zalogowany + no-store
r = await api('state');
const startState = r.body;
const nonEmpty = startState && (Object.keys(startState.updates || {}).length || Object.keys(startState.votes || {}).length || (startState.rsvps || []).length || Object.keys(startState.availability || {}).length);
log(r.status === 200 && startState && 'updates' in startState, 'state: zwraca strukturę', 'status ' + r.status);
log(/no-store/.test(r.cacheControl || ''), 'state: nagłówek no-store (KLUCZOWE dla live-sync)', r.cacheControl || 'brak');
console.log('   ℹ️ stan startowy niepusty?', nonEmpty ? 'TAK (będzie wyczyszczony resetem na końcu)' : 'nie, czysto');

// 5. vote add
r = await api('vote', { method: 'POST', body: JSON.stringify({ slug: SLUG, name: NAME }) });
log(r.body?.votes === 1 && r.body?.mine === true, 'vote: pierwszy głos → votes=1, mine=true', JSON.stringify(r.body));
r = await api('state');
log((r.body?.votes?.[SLUG] || []).includes(NAME), 'vote: state pokazuje głos', JSON.stringify(r.body?.votes?.[SLUG]));
// vote toggle off
r = await api('vote', { method: 'POST', body: JSON.stringify({ slug: SLUG, name: NAME }) });
log(r.body?.votes === 0 && r.body?.mine === false, 'vote: drugi klik → toggle off (votes=0)', JSON.stringify(r.body));

// 6. rsvp
r = await api('rsvp', { method: 'POST', body: JSON.stringify({ name: NAME }) });
log((r.body?.rsvps || []).some((x) => x.name === NAME), 'rsvp: dodano', JSON.stringify(r.body?.rsvps?.map((x) => x.name)));
const cntBefore = (r.body?.rsvps || []).filter((x) => x.name === NAME).length;
r = await api('rsvp', { method: 'POST', body: JSON.stringify({ name: NAME }) });
const cntAfter = (r.body?.rsvps || []).filter((x) => x.name === NAME).length;
log(cntBefore === 1 && cntAfter === 1, 'rsvp: brak duplikatu przy 2. kliknięciu', `${cntBefore}→${cntAfter}`);

// 7. update + del
r = await api('update', { method: 'POST', body: JSON.stringify({ slug: SLUG, author: NAME, type: 'biora', text: 'test e2e' }) });
const ts = r.body?.update?.ts;
log(!!ts, 'update: dodano raport', 'ts=' + ts);
r = await api('state');
log((r.body?.updates?.[SLUG] || []).some((u) => u.ts === ts), 'update: state pokazuje raport', '');
r = await api('del-update', { method: 'POST', body: JSON.stringify({ slug: SLUG, ts }) });
r = await api('state');
log(!(r.body?.updates?.[SLUG] || []).some((u) => u.ts === ts), 'del-update: raport usunięty', '');

// 8. availability
r = await api('availability', { method: 'POST', body: JSON.stringify({ slug: SLUG, status: 'wolne', who: NAME }) });
log(r.body?.ok === true, 'availability: ustawiono status', '');
r = await api('state');
log(r.body?.availability?.[SLUG]?.status === 'wolne', 'availability: state pokazuje status', JSON.stringify(r.body?.availability?.[SLUG]));

// 9. reset
r = await api('reset', { method: 'POST', body: JSON.stringify({}) });
log(r.body?.ok === true, 'reset: zwraca ok', '');
r = await api(`state?t=${Math.floor(performance.now())}`);
const empty = r.body && !Object.keys(r.body.updates || {}).length && !Object.keys(r.body.votes || {}).length && !(r.body.rsvps || []).length && !Object.keys(r.body.availability || {}).length;
log(empty, 'reset: state PUSTY po resecie (cache-bust)', JSON.stringify(r.body));

console.log(`\n=== WYNIK: ${pass} PASS / ${fail} FAIL ===`);
console.log(fail === 0 ? '🎉 Backend działa w 100%. Stan wyczyszczony — czysto dla ekipy.' : '⚠️ Są błędy — patrz wyżej.');
