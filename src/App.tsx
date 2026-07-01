import { useEffect, useMemo, useState } from 'react';
import type { Offer } from './types';
import type { UpdateItem, Avail } from './api';
import rawOffers from './data/offers.json';
import { api } from './api';
import { FloatingIcons, MusicToggle, burst } from './effects';

const OFFERS = rawOffers as unknown as Offer[];

const WOJ: [string, string][] = [
  ['', '🗺️ całe 6 województw'],
  ['kuj-pom', 'kujawsko-pomorskie'],
  ['wielkopolskie', 'wielkopolskie'],
  ['pomorskie', 'pomorskie'],
  ['mazowieckie', 'mazowieckie'],
  ['warm-maz', 'warmińsko-mazurskie'],
  ['łódzkie', 'łódzkie'],
];

const UPDATE_TYPES: [string, string][] = [
  ['biora', '✅ dzwoniłem — biorą na 1 noc'],
  ['nie', '❌ nie biorą / zajęte'],
  ['oddzwonia', '📵 oddzwonią / nie odbierają'],
  ['cena', '💸 potwierdzona cena'],
  ['dostepnosc', '📅 dostępność 3–5.07'],
  ['notatka', '📝 notatka'],
];
const TYPE_LABEL: Record<string, string> = Object.fromEntries(UPDATE_TYPES);

// status terminu 3–5.07: klucz, etykieta, klasy koloru
const AVAIL: [string, string, string][] = [
  ['wolne', '✅ wolne', 'bg-emerald-500/20 text-emerald-200 border-emerald-400'],
  ['zajete', '❌ zajęte', 'bg-rose-500/20 text-rose-200 border-rose-400'],
  ['potw', '❓ do potw.', 'bg-slate-700 text-slate-300 border-slate-500'],
];
const AVAIL_LABEL: Record<string, string> = Object.fromEntries(AVAIL.map(([k, l]) => [k, l]));
const AVAIL_CLS: Record<string, string> = Object.fromEntries(AVAIL.map(([k, , c]) => [k, c]));

function oneBadge(o: string) {
  if (o === 'tak') return { t: '✅ 1 noc OK', c: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' };
  if (o === 'potw') return { t: '❓ dopytaj o 1 noc', c: 'bg-amber-400/15 text-amber-300 border-amber-400/40' };
  return { t: '⚠️ min. nocy — pytaj o lukę', c: 'bg-orange-400/15 text-orange-300 border-orange-400/40' };
}

const sel = 'bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none';
const TEAM = 6;

type Mode = 'loading' | 'login' | 'authed' | 'offline';

function lsGet<T>(k: string, f: T): T {
  try { return JSON.parse(localStorage.getItem(k) || '') as T; } catch { return f; }
}
function lsSet(k: string, v: unknown) { localStorage.setItem(k, JSON.stringify(v)); }

function ago(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'teraz';
  if (s < 3600) return Math.floor(s / 60) + ' min temu';
  if (s < 86400) return Math.floor(s / 3600) + ' h temu';
  return Math.floor(s / 86400) + ' dni temu';
}

function OfferCard({
  d, votes, liked, onVote, updates, onAddUpdate, availStatus, onSetAvail,
}: {
  d: Offer; votes: number; liked: boolean; onVote: () => void;
  updates: UpdateItem[]; onAddUpdate: (type: string, text: string) => void;
  availStatus: string; onSetAvail: (status: string) => void;
}) {
  const b = oneBadge(d.one);
  const [open, setOpen] = useState(false);
  const [utype, setUtype] = useState('biora');
  const [utext, setUtext] = useState('');
  const feed = [...updates].sort((a, x) => x.ts - a.ts);

  return (
    <article className={'card-in rounded-2xl border p-4 flex flex-col gap-2 bg-gradient-to-b from-slate-800 to-slate-900 hover:-translate-y-1 transition ' + (d.feat ? 'border-amber-600/50 ring-1 ring-amber-600/30' : 'border-slate-700')}>
      <div className="font-bold text-lg leading-tight">{d.n}</div>
      <div className="text-xs text-slate-400">📍 {d.r} · {d.w}</div>
      <div className="flex flex-wrap gap-1.5">
        {d.feat ? <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-amber-400/15 text-amber-200 border-amber-400/40">⭐ TOP</span> : null}
        <span className={'text-[11px] font-semibold px-2 py-0.5 rounded-full border ' + b.c}>{b.t}</span>
        {d.balia ? <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-fuchsia-400/15 text-fuchsia-200 border-fuchsia-400/40">🛁 balia/sauna</span> : null}
        {d.jez ? <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-sky-400/15 text-sky-200 border-sky-400/40">🌊 nad jeziorem</span> : null}
        {availStatus ? <span className={'text-[11px] font-semibold px-2 py-0.5 rounded-full border ' + (AVAIL_CLS[availStatus] || '')}>📅 3–5.07: {AVAIL_LABEL[availStatus] || availStatus}</span> : null}
      </div>
      <div className="text-sm text-slate-300 space-y-0.5">
        <div>🏠 {d.loc}</div>
        <div>👥 {d.cap}</div>
        <div>🚗 Toruń {d.tT} · Inowrocław {d.tI}</div>
      </div>
      <div className="text-xl font-extrabold">{d.price} <span className="text-xs text-slate-400 font-medium">/ noc</span></div>
      {d.note ? <div className="text-xs text-slate-400 italic">{d.note}</div> : null}

      <div className="flex items-center gap-1.5 text-[11px]">
        <span className="text-slate-500">termin 3–5.07:</span>
        {AVAIL.map(([k, l]) => (
          <button key={k} onClick={() => onSetAvail(k)} className={'px-2 py-0.5 rounded-md border ' + (availStatus === k ? (AVAIL_CLS[k] || '') : 'bg-slate-800 border-slate-700 text-slate-400')}>{l}</button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap pt-1">
        {d.tel ? <a href={'tel:' + d.tel.replace(/\s/g, '')} className="flex-1 text-center text-sm font-semibold py-2 rounded-lg bg-teal-400 text-teal-950">📞 {d.tel}</a> : null}
        {d.link ? <a href={d.link} target="_blank" rel="noopener" className="flex-1 text-center text-sm font-semibold py-2 rounded-lg bg-slate-700 text-slate-100">🔗 oferta</a> : null}
        <button onClick={onVote} className={'text-sm font-semibold py-2 px-3 rounded-lg border ' + (liked ? 'bg-rose-500/20 border-rose-400 text-rose-200' : 'bg-slate-800 border-slate-700 text-rose-300')}>❤️ {votes}</button>
      </div>

      <button onClick={() => setOpen((o) => !o)} className="mt-1 text-xs text-slate-400 hover:text-slate-200 text-left">
        💬 updaty ekipy ({feed.length}) {open ? '▲' : '▼'}
      </button>

      {open && (
        <div className="rounded-xl bg-slate-950/50 border border-slate-800 p-2 flex flex-col gap-2">
          {feed.length === 0 && <div className="text-xs text-slate-500">Brak updatów — bądź pierwszy, zadzwoń i wrzuć info 🤙</div>}
          {feed.map((u, i) => (
            <div key={i} className="text-xs border-b border-slate-800 pb-1.5 last:border-0">
              <span className="font-semibold text-slate-200">{TYPE_LABEL[u.type] || u.type}</span>
              {u.text ? <span className="text-slate-300"> — {u.text}</span> : null}
              <div className="text-[10px] text-slate-500">{u.author} · {ago(u.ts)}</div>
            </div>
          ))}
          <div className="flex flex-col gap-1.5 pt-1">
            <select value={utype} onChange={(e) => setUtype(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs">
              {UPDATE_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <div className="flex gap-1.5">
              <input value={utext} onChange={(e) => setUtext(e.target.value)} placeholder="szczegóły (opcjonalnie)…" className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none" />
              <button
                onClick={() => { onAddUpdate(utype, utext.trim()); setUtext(''); setOpen(true); }}
                className="text-xs font-semibold px-3 rounded-lg bg-teal-400 text-teal-950"
              >Dodaj</button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default function App() {
  const [mode, setMode] = useState<Mode>('loading');
  const [pw, setPw] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [name, setName] = useState<string>(() => localStorage.getItem('domki_name') || '');
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [mine, setMine] = useState<Record<string, boolean>>({});
  const [rsvps, setRsvps] = useState<string[]>([]);
  const [updates, setUpdates] = useState<Record<string, UpdateItem[]>>({});
  const [avail, setAvail] = useState<Record<string, Avail>>({});

  const [q, setQ] = useState('');
  const [woj, setWoj] = useState('');
  const [one, setOne] = useState('');
  const [price, setPrice] = useState(0);
  const [far, setFar] = useState(0);
  const [balia, setBalia] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);
  const [jezOnly, setJezOnly] = useState(false);
  const [topOnly, setTopOnly] = useState(false);
  const [bioraOnly, setBioraOnly] = useState(false);
  const [sort, setSort] = useState('rec');

  useEffect(() => {
    let cancel = false;
    api
      .authStatus()
      .then((s) => {
        if (cancel) return;
        if (s.authed) { setMode('authed'); void loadShared(); }
        else setMode('login');
      })
      .catch(() => {
        if (cancel) return;
        setMode('offline');
        loadOffline();
      });
    return () => { cancel = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadShared() {
    try {
      const st = await api.state();
      const v: Record<string, number> = {};
      const m: Record<string, boolean> = {};
      for (const [k, arr] of Object.entries(st.votes)) {
        v[k] = arr.length;
        if (name && arr.includes(name)) m[k] = true;
      }
      setVotes(v); setMine(m);
      setRsvps(st.rsvps.map((r) => r.name));
      setUpdates(st.updates || {});
      setAvail(st.availability || {});
    } catch { /* ignore */ }
  }
  function loadOffline() {
    setVotes(lsGet('domki_votes', {}));
    setMine(lsGet('domki_mine', {}));
    setRsvps(lsGet('domki_rsvps', []));
    setUpdates(lsGet('domki_updates', {}));
    setAvail(lsGet('domki_avail', {}));
  }

  function ensureName(): string {
    let n = name;
    if (!n) {
      n = (window.prompt('Jak masz na imię? (do głosów, RSVP i updatów)') || '').trim();
      if (n) { setName(n); localStorage.setItem('domki_name', n); }
    }
    return n;
  }

  async function doVote(id: string) {
    const n = ensureName();
    if (!n) return;
    if (!mine[id]) burst();
    if (mode === 'authed') {
      try {
        const r = await api.vote(id, n);
        setVotes((p) => ({ ...p, [id]: r.votes }));
        setMine((p) => ({ ...p, [id]: r.mine }));
      } catch { /* ignore */ }
    } else {
      const liked = !!mine[id];
      const nv = { ...votes, [id]: Math.max(0, (votes[id] || 0) + (liked ? -1 : 1)) };
      const nm = { ...mine, [id]: !liked };
      setVotes(nv); setMine(nm);
      lsSet('domki_votes', nv); lsSet('domki_mine', nm);
    }
  }

  async function doRsvp() {
    const n = ensureName();
    if (!n) return;
    burst(80);
    if (mode === 'authed') {
      try { const r = await api.rsvp(n); setRsvps(r.rsvps.map((x) => x.name)); } catch { /* ignore */ }
    } else if (!rsvps.includes(n)) {
      const nr = [...rsvps, n];
      setRsvps(nr); lsSet('domki_rsvps', nr);
    }
  }

  async function doAddUpdate(id: string, type: string, text: string) {
    const n = ensureName();
    if (!n) return;
    const item: UpdateItem = { slug: id, author: n, type, text, ts: Date.now() };
    if (mode === 'authed') {
      try { await api.addUpdate(id, n, type, text); } catch { /* ignore */ }
      void loadShared();
    } else {
      const nu = { ...updates, [id]: [...(updates[id] || []), item] };
      setUpdates(nu); lsSet('domki_updates', nu);
    }
  }

  async function doSetAvail(id: string, status: string) {
    const n = ensureName();
    if (!n) return;
    if (status === 'wolne') burst();
    const item: Avail = { status, who: n, ts: Date.now() };
    if (mode === 'authed') {
      try { await api.availability(id, status, n); } catch { /* ignore */ }
      setAvail((p) => ({ ...p, [id]: item }));
    } else {
      const na = { ...avail, [id]: item };
      setAvail(na); lsSet('domki_avail', na);
    }
  }

  async function doLogin() {
    setLoginErr('');
    try {
      const r = await api.login(pw);
      if (r.ok) { setMode('authed'); void loadShared(); }
      else setLoginErr('Złe hasło 🙃');
    } catch { setLoginErr('Błąd połączenia z serwerem'); }
  }

  function lastUpdateTs(id: string): number {
    const arr = updates[id];
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((mx, u) => Math.max(mx, u.ts), 0);
  }

  const list = useMemo(() => {
    const l = OFFERS.filter((d) => {
      if (woj && d.w !== woj) return false;
      if (one === 'tak' && d.one !== 'tak') return false;
      if (one === 'takpotw' && d.one === 'luka') return false;
      if (balia && !d.balia) return false;
      if (freeOnly && avail[d.n]?.status !== 'wolne') return false;
      if (jezOnly && !d.jez) return false;
      if (topOnly && !d.feat) return false;
      if (bioraOnly && !(updates[d.n] || []).some((u) => u.type === 'biora')) return false;
      if (price && d.pn > 0 && d.pn > price) return false;
      if (far && d.tmin > far) return false;
      if (q) {
        const hay = (d.n + ' ' + d.loc + ' ' + d.r).toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
    return [...l].sort((a, b) => {
      if (sort === 'price') return (a.pn || 99999) - (b.pn || 99999);
      if (sort === 'far') return a.tmin - b.tmin;
      if (sort === 'votes') return (votes[b.n] || 0) - (votes[a.n] || 0);
      if (sort === 'update') return lastUpdateTs(b.n) - lastUpdateTs(a.n);
      if (a.feat !== b.feat) return b.feat - a.feat;
      return (a.pn || 99999) - (b.pn || 99999);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, woj, one, price, far, balia, freeOnly, jezOnly, topOnly, bioraOnly, sort, votes, updates, avail]);

  const freeN = useMemo(() => OFFERS.filter((o) => avail[o.n]?.status === 'wolne').length, [avail]);
  const busyN = useMemo(() => OFFERS.filter((o) => avail[o.n]?.status === 'zajete').length, [avail]);

  const activity = useMemo(() => {
    const evs: { ts: number; text: string }[] = [];
    for (const [slug, arr] of Object.entries(updates)) {
      for (const u of arr) evs.push({ ts: u.ts, text: `${u.author}: ${TYPE_LABEL[u.type] || u.type} — ${slug}${u.text ? ' (' + u.text + ')' : ''}` });
    }
    for (const [slug, a] of Object.entries(avail)) {
      evs.push({ ts: a.ts, text: `${a.who}: termin 3–5.07 ${AVAIL_LABEL[a.status] || a.status} — ${slug}` });
    }
    return evs.sort((x, y) => y.ts - x.ts).slice(0, 15);
  }, [updates, avail]);

  if (mode === 'loading') {
    return <div className="min-h-screen grid place-items-center text-slate-400">⏳ Ładowanie…</div>;
  }

  if (mode === 'login') {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="aurora" />
        <div className="w-full max-w-sm bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center backdrop-blur">
          <div className="text-4xl">🔒🏕️</div>
          <h1 className="text-2xl font-extrabold mt-2">Domki Ekipa</h1>
          <p className="text-slate-400 text-sm mt-1">Wpisz hasło, żeby wejść</p>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doLogin()}
            placeholder="hasło…"
            className="mt-4 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 outline-none"
            autoFocus
          />
          <button onClick={doLogin} className="mt-3 w-full bg-teal-400 text-teal-950 font-bold rounded-lg py-2.5">Wejdź 🤙</button>
          {loginErr && <div className="text-rose-400 text-sm mt-2">{loginErr}</div>}
        </div>
      </div>
    );
  }

  const going = rsvps.length;
  return (
    <div className="min-h-screen">
      <div className="aurora" />
      <FloatingIcons />
      <MusicToggle />

      <header className="px-5 pt-10 pb-6 max-w-6xl mx-auto">
        <span className="inline-block text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-orange-400 to-rose-500 text-black">
          🔥 wyjazd ekipy • 2026
        </span>
        <h1 className="text-4xl font-extrabold mt-3 bg-gradient-to-r from-teal-200 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
          🏕️ DOMKI EKIPA
        </h1>
        <p className="text-slate-300 mt-2">
          Wybieramy chatę dla <b>naszej szóstki</b> — sobota 4 → niedziela 5 lipca, do ~2h od Torunia/Inowrocławia. Głosuj ❤️, dzwoń, oznaczaj termin. 🤙
        </p>

        <div className="mt-4 rounded-2xl border border-slate-700 bg-gradient-to-br from-teal-500/10 to-fuchsia-500/10 p-4 flex flex-wrap items-center gap-4">
          <div>
            <div className="text-lg font-extrabold">Jedziesz? 🔥</div>
            <div className="text-xs text-slate-400">Kliknij i zaklep miejsce — im więcej nas, tym taniej!</div>
          </div>
          <div className="flex-1 min-w-[160px] h-4 rounded-full bg-slate-900 border border-slate-700 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all" style={{ width: `${Math.min(going / TEAM, 1) * 100}%` }} />
          </div>
          <div className="font-extrabold whitespace-nowrap">{going}/{TEAM} zaklepane</div>
          <button onClick={doRsvp} className="bg-gradient-to-br from-emerald-400 to-teal-400 text-emerald-950 font-extrabold rounded-xl px-5 py-2.5">JADĘ! 🙋</button>
        </div>
        {going > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {rsvps.map((r) => <span key={r} className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">🙋 {r}</span>)}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">✅ {freeN} wolnych na 3–5.07</span>
          <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/40">❌ {busyN} zajętych</span>
          <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">🏠 {OFFERS.length} ofert</span>
        </div>

        <div className="mt-2 text-sm text-slate-400">
          {mode === 'offline' && <span className="text-amber-400">• tryb offline (dane lokalnie — pełne współdzielenie po deployu) </span>}
          {name && <span>• cześć, <b className="text-slate-200">{name}</b>!</span>}
        </div>

        {activity.length > 0 && (
          <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-900/50 p-3">
            <div className="text-sm font-bold mb-1">📣 Ostatnia aktywność ekipy</div>
            <div className="flex flex-col gap-1 max-h-44 overflow-auto">
              {activity.map((e, i) => (
                <div key={i} className="text-xs text-slate-300 border-b border-slate-800 pb-1 last:border-0">
                  {e.text} <span className="text-slate-500">· {ago(e.ts)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="sticky top-0 z-20 backdrop-blur bg-slate-950/80 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-5 py-3 flex flex-wrap gap-2 items-center">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔎 szukaj…" className={sel + ' flex-1 min-w-[180px]'} />
          <select value={woj} onChange={(e) => setWoj(e.target.value)} className={sel}>
            {WOJ.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select value={one} onChange={(e) => setOne(e.target.value)} className={sel}>
            <option value="">🛏️ 1 noc: wszystko</option>
            <option value="tak">tylko pewne ✅</option>
            <option value="takpotw">pewne + dopytaj</option>
          </select>
          <select value={price} onChange={(e) => setPrice(+e.target.value)} className={sel}>
            <option value={0}>💸 cena: dowolna</option>
            <option value={300}>≤ 300 zł</option>
            <option value={500}>≤ 500 zł</option>
            <option value={700}>≤ 700 zł</option>
            <option value={900}>≤ 900 zł</option>
          </select>
          <select value={far} onChange={(e) => setFar(+e.target.value)} className={sel}>
            <option value={0}>🚗 dojazd: dowolny</option>
            <option value={60}>≤ 1h</option>
            <option value={90}>≤ 1h30</option>
            <option value={120}>≤ 2h</option>
          </select>
          <label className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm cursor-pointer">
            <input type="checkbox" checked={balia} onChange={(e) => setBalia(e.target.checked)} /> 🛁 balia/sauna
          </label>
          <label className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm cursor-pointer">
            <input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} /> ✅ wolne 3–5.07
          </label>
          <label className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm cursor-pointer">
            <input type="checkbox" checked={jezOnly} onChange={(e) => setJezOnly(e.target.checked)} /> 🌊 nad jeziorem
          </label>
          <label className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm cursor-pointer">
            <input type="checkbox" checked={topOnly} onChange={(e) => setTopOnly(e.target.checked)} /> ⭐ tylko TOP
          </label>
          <label className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm cursor-pointer">
            <input type="checkbox" checked={bioraOnly} onChange={(e) => setBioraOnly(e.target.checked)} /> ✅ potwierdzone przez ekipę
          </label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={sel}>
            <option value="rec">⭐ polecane</option>
            <option value="price">💸 najtaniej</option>
            <option value="far">🚗 najbliżej</option>
            <option value="votes">❤️ najwięcej głosów</option>
            <option value="update">💬 ostatni update</option>
          </select>
          <span className="ml-auto text-sm text-slate-400">{list.length} / {OFFERS.length}</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-5 py-6 grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {list.length === 0 && (
          <div className="col-span-full text-center text-slate-400 py-16">😕 Nic nie pasuje. Poluzuj filtry.</div>
        )}
        {list.map((d) => (
          <OfferCard
            key={d.n}
            d={d}
            votes={votes[d.n] || 0}
            liked={!!mine[d.n]}
            onVote={() => doVote(d.n)}
            updates={updates[d.n] || []}
            onAddUpdate={(type, text) => doAddUpdate(d.n, type, text)}
            availStatus={avail[d.n]?.status || ''}
            onSetAvail={(status) => doSetAvail(d.n, status)}
          />
        ))}
      </main>

      <footer className="max-w-6xl mx-auto px-5 py-10 text-center text-xs text-slate-500">
        Domki Ekipa • runda 5 (tracker terminu 3–5.07) • baza i funkcje rosną z każdą rundą 🤙
      </footer>
    </div>
  );
}
