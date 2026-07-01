import { useEffect, useMemo, useState } from 'react';
import type { Offer } from './types';
import type { UpdateItem, Avail } from './api';
import rawOffers from './data/offers.json';
import { api } from './api';
import { FloatingIcons, MusicToggle, burst, initMusic } from './effects';
import Intro from './Intro';

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
const WOJ_LABEL: Record<string, string> = Object.fromEntries(WOJ.map(([v, l]) => [v, l]));

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

const sel = 'bg-slate-800/70 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-400 transition';
const TEAM = 6;

// Ekipa — wybór postaci po haśle (żartobliwe fakty)
const CREW: { id: string; name: string; emoji: string; grad: string; fact: string }[] = [
  { id: 'radzio', name: 'Radzio', emoji: '🧠', grad: 'from-teal-400 to-sky-500', fact: 'Zamiast zadzwonić — zbudował całą stronę. Klasyk.' },
  { id: 'lewarczyk', name: 'Lewarczyk', emoji: '💪', grad: 'from-amber-400 to-orange-500', fact: 'Podniesie lodówkę, ale nie słuchawkę przed 12:00.' },
  { id: 'bescik', name: 'Beścik', emoji: '😎', grad: 'from-fuchsia-400 to-purple-500', fact: 'Beściak. Nazwa zobowiązuje.' },
  { id: 'amelka', name: 'Amelka', emoji: '🦋', grad: 'from-pink-400 to-rose-500', fact: 'Zaplanowała randkę — wyszła wyprawa ekipy.' },
  { id: 'malagosia', name: 'Małagosia', emoji: '🌸', grad: 'from-rose-400 to-fuchsia-500', fact: 'Spakuje się na 1 noc jak na dwa tygodnie.' },
  { id: 'natalka', name: 'Natalka', emoji: '⭐', grad: 'from-sky-400 to-indigo-500', fact: 'Wie, gdzie najlepsza plaża, zanim wysiądziecie z auta.' },
];

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

// czas dojazdu (tekst "~1h30" / "~25 min") -> minuty
function toMin(s: string): number {
  const hm = String(s).match(/(\d+)\s*h(?:\s*(\d+))?/);
  if (hm) return (+hm[1]) * 60 + (hm[2] ? +hm[2] : 0);
  const mm = String(s).match(/(\d+)\s*min/);
  if (mm) return +mm[1];
  const n = String(s).match(/(\d+)/);
  return n ? +n[1] : 999;
}
// minuty z INOWROCŁAWIA (pole tI)
const iMin = (d: Offer): number => toMin(d.tI);

function OfferCard({
  d, votes, liked, onVote, updates, onAddUpdate, availStatus, onSetAvail, onDelUpdate,
}: {
  d: Offer; votes: number; liked: boolean; onVote: () => void;
  updates: UpdateItem[]; onAddUpdate: (type: string, text: string) => void;
  availStatus: string; onSetAvail: (status: string) => void;
  onDelUpdate: (ts: number) => void;
}) {
  const b = oneBadge(d.one);
  const priceMain = d.pn > 0 ? d.pn + ' zł' : String(d.price);
  const mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((d.loc || d.r || '') + ', Polska');
  const priceExtra = d.pn > 0 && /[a-ząćęłńóśźż]/i.test(String(d.price).replace(/z[łl]/gi, '')) ? String(d.price) : '';
  const [open, setOpen] = useState(false);
  const [utype, setUtype] = useState('biora');
  const [utext, setUtext] = useState('');
  const [copied, setCopied] = useState(false);
  const feed = [...updates].sort((a, x) => x.ts - a.ts);

  return (
    <article className={'card-in group rounded-2xl border p-4 flex flex-col gap-2.5 bg-gradient-to-b from-slate-800/70 to-slate-900/90 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/10 ' + (d.feat ? 'border-amber-600/40 hover:border-amber-500/60' : 'border-slate-700/80 hover:border-slate-600')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-bold text-[17px] leading-tight group-hover:text-teal-200 transition-colors">{d.n}</div>
          <div className="text-xs text-slate-400 mt-0.5">📍 {d.r} · {WOJ_LABEL[d.w] || d.w}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xl font-black text-white leading-none whitespace-nowrap">{priceMain}</div>
          <div className="text-[10px] text-slate-400 mt-1">za dobę</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {d.feat ? <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border bg-amber-400/15 text-amber-200 border-amber-400/40">⭐ TOP</span> : null}
        <span className={'text-[11px] font-semibold px-2 py-0.5 rounded-full border ' + b.c}>{b.t}</span>
        {d.balia ? <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-fuchsia-400/15 text-fuchsia-200 border-fuchsia-400/40">🛁 balia/sauna</span> : null}
        {d.jez ? <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-sky-400/15 text-sky-200 border-sky-400/40">🌊 nad jeziorem</span> : null}
        {availStatus ? <span className={'text-[11px] font-semibold px-2 py-0.5 rounded-full border ' + (AVAIL_CLS[availStatus] || '')}>📅 {AVAIL_LABEL[availStatus] || availStatus}</span> : null}
      </div>

      <div className="text-sm text-slate-300 space-y-1">
        <div className="flex items-center gap-2">
          <span className="min-w-0 truncate">🏠 {d.loc}</span>
          <a href={mapUrl} target="_blank" rel="noopener" title="Pokaż na mapie" className="shrink-0 text-slate-500 hover:text-teal-300 transition">🗺️</a>
        </div>
        <div>👥 {d.cap}</div>
        <div>🚗 Toruń {d.tT} · Inowrocław {d.tI}</div>
      </div>
      {priceExtra ? <div className="text-xs text-amber-300/80">💸 {priceExtra}</div> : null}
      {d.note ? <div className="text-xs text-slate-400 italic leading-snug">{d.note}</div> : null}

      <div className="mt-auto pt-1 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-500 shrink-0">3–5.07:</span>
          {AVAIL.map(([k, l]) => (
            <button key={k} onClick={() => onSetAvail(k)} className={'flex-1 px-1 py-1 rounded-lg border transition ' + (availStatus === k ? (AVAIL_CLS[k] || '') : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600')}>{l}</button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="flex-1 flex gap-2 min-w-0">
            {d.tel ? (
              <>
                <a href={'tel:' + d.tel.replace(/\s/g, '')} className="flex-1 min-w-0 text-center text-sm font-semibold py-2 rounded-xl bg-teal-400 text-teal-950 hover:brightness-105 transition truncate">📞 {d.tel}</a>
                <button onClick={() => { void navigator.clipboard.writeText(d.tel); setCopied(true); setTimeout(() => setCopied(false), 1200); }} title="kopiuj numer" aria-label="Kopiuj telefon" className="shrink-0 text-sm px-2.5 py-2 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-300 hover:border-slate-600 transition">{copied ? '✓' : '📋'}</button>
                {d.link ? <a href={d.link} target="_blank" rel="noopener" title="Zobacz ofertę" className="shrink-0 text-sm px-2.5 py-2 rounded-xl bg-slate-700 text-slate-100 hover:bg-slate-600 transition">🔗</a> : null}
              </>
            ) : d.link ? (
              <a href={d.link} target="_blank" rel="noopener" className="flex-1 text-center text-sm font-semibold py-2 rounded-xl bg-slate-700 text-slate-100 hover:bg-slate-600 transition">🔗 zobacz ofertę</a>
            ) : (
              <span className="flex-1 text-center text-xs text-slate-500 py-2 rounded-xl border border-dashed border-slate-700">kontakt: wrzuć w raporcie</span>
            )}
          </div>
          <button onClick={onVote} aria-label={'Głosuj na ' + d.n} className={'shrink-0 text-sm font-semibold py-2 px-3 rounded-xl border transition ' + (liked ? 'bg-rose-500/20 border-rose-400 text-rose-200' : 'bg-slate-800 border-slate-700 text-rose-300 hover:border-rose-500/50')}>❤️ {votes}</button>
        </div>

        <button onClick={() => setOpen((o) => !o)} className="text-xs text-slate-400 hover:text-slate-200 text-left">
          💬 raporty ekipy ({feed.length}) {open ? '▲' : '▼'}
        </button>

          {open && (
            <div className="mt-2 rounded-xl bg-slate-950/50 border border-slate-800 p-2 flex flex-col gap-2">
              {feed.length === 0 && <div className="text-xs text-slate-500">Brak raportów — bądź pierwszy: dzwoń i wrzuć info 🤙</div>}
              {feed.map((u, i) => (
                <div key={i} className="text-xs border-b border-slate-800 pb-1.5 last:border-0 flex justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-200">{TYPE_LABEL[u.type] || u.type}</span>
                    {u.text ? <span className="text-slate-300"> — {u.text}</span> : null}
                    <div className="text-[10px] text-slate-500">{u.author} · {ago(u.ts)}</div>
                  </div>
                  <button onClick={() => onDelUpdate(u.ts)} title="usuń" aria-label="Usuń update" className="text-slate-600 hover:text-rose-400 shrink-0">✕</button>
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
                  >Wrzuć</button>
                </div>
              </div>
            </div>
          )}
        </div>
    </article>
  );
}

export default function App() {
  const [mode, setMode] = useState<Mode>('loading');
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try { return localStorage.getItem('domki_intro_seen') !== '1'; } catch { return true; }
  });
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
  const [limit, setLimit] = useState(48);
  const [toast, setToast] = useState('');
  const [rnd, setRnd] = useState<Offer | null>(null);

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

  useEffect(() => { setLimit(48); }, [q, woj, one, price, far, balia, freeOnly, jezOnly, topOnly, bioraOnly, sort]);

  useEffect(() => { initMusic(); }, []);

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
      n = (window.prompt('Jak Cię zwą w ekipie? (do głosów, RSVP i raportów)') || '').trim();
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

  async function doDelUpdate(id: string, ts: number) {
    if (mode === 'authed') {
      try { await api.delUpdate(id, ts); } catch { /* ignore */ }
      void loadShared();
    } else {
      const nu = { ...updates, [id]: (updates[id] || []).filter((u) => u.ts !== ts) };
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
      else setLoginErr('Nie ten szyfr, ziomuś 🙃');
    } catch { setLoginErr('Serwer chwilowo śpi — spróbuj za moment'); }
  }

  async function doShare() {
    const url = location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Domki Ekipa 🏕️', text: 'Wybieramy chatę na legendarny wypad — wskakuj i głosuj! 🍺', url });
      } else {
        await navigator.clipboard.writeText(url);
        setToast('📋 Link złapany — podeślij ekipie! 🤙');
        setTimeout(() => setToast(''), 2200);
      }
    } catch { /* anulowano */ }
  }

  async function doReset() {
    if (!window.confirm('Wyczyścić CAŁĄ aktywność ekipy — głosy, RSVP, raporty i statusy terminów — i zacząć od zera?')) return;
    if (mode === 'authed') { try { await api.reset(); } catch { /* ignore */ } }
    ['domki_votes', 'domki_mine', 'domki_rsvps', 'domki_updates', 'domki_avail'].forEach((k) => localStorage.removeItem(k));
    setVotes({}); setMine({}); setRsvps([]); setUpdates({}); setAvail({});
    setToast('🧹 Wyczyszczono — ekipa startuje od nowa!');
    setTimeout(() => setToast(''), 2200);
  }

  function finishIntro() {
    try { localStorage.setItem('domki_intro_seen', '1'); } catch { /* ignore */ }
    setShowIntro(false);
  }
  function replayIntro() {
    setShowIntro(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function lastUpdateTs(id: string): number {
    const arr = updates[id];
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((mx, u) => Math.max(mx, u.ts), 0);
  }

  const [showFilters, setShowFilters] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

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
      if (far && iMin(d) > far) return false;
      if (q) {
        const hay = (d.n + ' ' + d.loc + ' ' + d.r).toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
    return [...l].sort((a, b) => {
      if (sort === 'price') return (a.pn || 99999) - (b.pn || 99999);
      if (sort === 'far') return iMin(a) - iMin(b);
      if (sort === 'votes') return (votes[b.n] || 0) - (votes[a.n] || 0);
      if (sort === 'update') return lastUpdateTs(b.n) - lastUpdateTs(a.n);
      if (a.feat !== b.feat) return b.feat - a.feat;
      return (a.pn || 99999) - (b.pn || 99999);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, woj, one, price, far, balia, freeOnly, jezOnly, topOnly, bioraOnly, sort, votes, updates, avail]);

  function clearFilters() {
    setQ(''); setWoj(''); setOne(''); setPrice(0); setFar(0);
    setBalia(false); setFreeOnly(false); setJezOnly(false); setTopOnly(false); setBioraOnly(false);
  }
  function doRandom() {
    if (list.length === 0) return;
    setRnd(list[Math.floor(Math.random() * list.length)]);
    burst(30);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const filtersActive = !!(q || woj || one || price || far || balia || freeOnly || jezOnly || topOnly || bioraOnly);

  const freeN = useMemo(() => OFFERS.filter((o) => avail[o.n]?.status === 'wolne').length, [avail]);
  const busyN = useMemo(() => OFFERS.filter((o) => avail[o.n]?.status === 'zajete').length, [avail]);
  const topVoted = useMemo(() => OFFERS.filter((o) => (votes[o.n] || 0) > 0).map((o) => ({ n: o.n, v: votes[o.n] || 0 })).sort((a, b) => b.v - a.v).slice(0, 3), [votes]);

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

  if (showIntro) {
    return <Intro onEnter={finishIntro} />;
  }

  if (mode === 'loading') {
    return <div className="min-h-screen grid place-items-center text-slate-400">⏳ Ładowanie…</div>;
  }

  if (mode === 'login') {
    return (
      <div className="min-h-screen grid place-items-center px-4 relative">
        <div className="aurora" />
        <FloatingIcons />
        <div className="w-full max-w-sm relative rounded-3xl border border-slate-800 bg-slate-900/70 p-7 text-center backdrop-blur-xl shadow-2xl shadow-black/40">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-slate-700 bg-gradient-to-br from-teal-500/20 to-fuchsia-500/20 text-3xl">🏕️</div>
          <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-teal-300/80">Kronika Ekipy · 2026</div>
          <h1 className="mt-1 text-3xl font-black bg-gradient-to-r from-teal-200 via-sky-300 to-fuchsia-300 bg-clip-text text-transparent">Domki Ekipa</h1>
          <p className="mt-2 text-sm text-slate-400">Szepnij hasło ekipy i wbijaj do legendy 🤙</p>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doLogin()}
            placeholder="hasło ekipy…"
            className="mt-5 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-center outline-none focus:border-teal-400 transition"
            autoFocus
          />
          <button onClick={doLogin} className="mt-3 w-full rounded-xl bg-gradient-to-r from-teal-400 to-sky-400 py-3 font-bold text-teal-950 shadow-lg shadow-teal-500/20 hover:brightness-105 transition">Wejdź 🤙</button>
          {loginErr && <div className="mt-3 text-sm text-rose-400">{loginErr}</div>}
          <div className="mt-4 text-[11px] text-slate-500">Zamknięta ekipa · wpuszczamy tylko swoich 🍺</div>
        </div>
      </div>
    );
  }

  if ((mode === 'authed' || mode === 'offline') && !name) {
    const pick = (n: string) => { setName(n); try { localStorage.setItem('domki_name', n); } catch { /* ignore */ } burst(40); };
    return (
      <div className="min-h-screen grid place-items-center px-4 relative">
        <div className="aurora" />
        <FloatingIcons />
        <div className="w-full max-w-lg relative rounded-3xl border border-slate-800 bg-slate-900/70 p-7 text-center backdrop-blur-xl shadow-2xl shadow-black/40">
          <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-teal-300/80">Kronika Ekipy · 2026</div>
          <h1 className="mt-1 text-3xl font-black bg-gradient-to-r from-teal-200 via-sky-300 to-fuchsia-300 bg-clip-text text-transparent">Kto wbija? 🤙</h1>
          <p className="mt-2 text-sm text-slate-400">Klepnij swoją ikonę — ekipa zobaczy Twoje głosy, RSVP i raporty.</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CREW.map((c) => (
              <button key={c.id} onClick={() => pick(c.name)} className="group rounded-2xl border border-slate-700 bg-slate-800/60 p-3 hover:border-teal-400 hover:bg-slate-800 transition text-center">
                <div className={'mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br ' + c.grad + ' text-2xl shadow-lg group-hover:scale-110 transition'}>{c.emoji}</div>
                <div className="mt-2 font-bold text-slate-100">{c.name}</div>
                <div className="text-[10px] text-slate-400 leading-snug mt-0.5">{c.fact}</div>
              </button>
            ))}
          </div>
          <div className="mt-5 text-[11px] text-slate-500">nie ma Cię na liście? <button onClick={() => { const n = (window.prompt('Twoja ksywa?') || '').trim(); if (n) pick(n); }} className="text-teal-300 hover:underline">dopisz się</button></div>
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
        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] px-3.5 py-1.5 rounded-full border border-slate-700 bg-slate-900/60 text-slate-300 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_10px_#54d6c4]"></span>
          Wyprawa Ekipy · Lato 2026
        </span>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight mt-4 bg-gradient-to-r from-teal-200 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
          DOMKI EKIPA
        </h1>
        <p className="text-slate-300 mt-2">
          Namierzamy chatę dla <b>naszej szóstki</b> na legendarny weekend — sobota 4 → niedziela 5 lipca, do ~2h od Torunia i Inowrocławia. Głosuj, dzwoń, klep termin. 🍺
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {([['❤️', 'Głosuj', 'na typy ekipy'], ['📞', 'Dzwoń', 'i zdaj raport'], ['📅', 'Klep termin', 'na 3–5.07']] as [string, string, string][]).map(([e, t, s]) => (
            <div key={t} className="rounded-xl border border-slate-800 bg-slate-900/50 p-2.5 text-center">
              <div className="text-xl">{e}</div>
              <div className="text-xs font-bold text-slate-200 mt-0.5">{t}</div>
              <div className="text-[10px] text-slate-400 leading-tight">{s}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-slate-700/80 bg-gradient-to-br from-teal-500/10 via-sky-500/5 to-fuchsia-500/10 p-5 flex flex-wrap items-center gap-4 shadow-lg shadow-black/20">
          <div>
            <div className="text-lg font-extrabold">Wbijasz z nami? 🔥</div>
            <div className="text-xs text-slate-400">Klepnij miejsce w ekipie — im nas więcej, tym taniej na łepka!</div>
          </div>
          <div className="flex-1 min-w-[160px] h-4 rounded-full bg-slate-950/60 border border-slate-700/70 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all" style={{ width: `${Math.min(going / TEAM, 1) * 100}%` }} />
          </div>
          <div className="font-extrabold whitespace-nowrap">{going}/{TEAM} w ekipie</div>
          <button onClick={doRsvp} className="rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 px-5 py-2.5 font-extrabold text-emerald-950 shadow-lg shadow-emerald-500/20 hover:brightness-105 transition">WBIJAM! 🙋</button>
        </div>
        {going > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {rsvps.map((r) => <span key={r} className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-200">🙋 {r}</span>)}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2 text-sm items-center">
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">✅ {freeN} wolnych na 3–5.07</span>
          <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/40">❌ {busyN} zajętych</span>
          <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">🏠 {OFFERS.length} chat na oku</span>
          <button onClick={doShare} className="px-3 py-1 rounded-full bg-sky-500/15 text-sky-200 border border-sky-500/40 hover:bg-sky-500/25 transition">📤 Podeślij ekipie</button>
        </div>

        {topVoted.length > 0 && (
          <div className="mt-4 rounded-2xl border border-amber-500/25 bg-amber-400/[0.06] p-4 shadow-lg shadow-black/20">
            <div className="text-sm font-bold mb-1.5">🏆 Top typy ekipy</div>
            <div className="flex flex-wrap gap-2">
              {topVoted.map((t, i) => (
                <button key={t.n} onClick={() => setSort('votes')} className="text-xs px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 hover:border-amber-500 hover:bg-slate-800 transition">
                  {['🥇', '🥈', '🥉'][i]} {t.n} <span className="text-rose-300">❤️ {t.v}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-2 text-sm text-slate-400">
          {mode === 'offline' && <span className="text-amber-400">• tryb offline (dane lokalnie — ekipa zobaczy wszystko po wrzuceniu na serwer) </span>}
          {name && <span>• siema, <b className="text-slate-200">{name}</b>! 🤙 <button onClick={() => { setName(''); try { localStorage.removeItem('domki_name'); } catch { /* ignore */ } }} className="text-slate-500 hover:text-teal-300 underline">(zmień)</button></span>}
        </div>

        {activity.length > 0 && (
          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur shadow-lg shadow-black/20 overflow-hidden">
            <button onClick={() => setShowActivity((v) => !v)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold hover:bg-slate-800/40 transition">
              <span>📣 Aktywność ekipy <span className="font-normal text-slate-500">({activity.length})</span></span>
              <span className="text-slate-400">{showActivity ? '▾' : '▸'}</span>
            </button>
            {showActivity && (
              <div className="flex flex-col gap-1 max-h-44 overflow-auto px-4 pb-4">
                {activity.map((e, i) => (
                  <div key={i} className="text-xs text-slate-300 border-b border-slate-800 pb-1 last:border-0">
                    {e.text} <span className="text-slate-500">· {ago(e.ts)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      <div className="sticky top-0 z-20 backdrop-blur-xl bg-slate-950/75 border-y border-slate-800/80 shadow-lg shadow-black/20">
        <div className="max-w-6xl mx-auto px-5 py-3">
          <div className="flex flex-wrap gap-2 items-center">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔎 szukaj chaty albo miejscówki…" className={sel + ' flex-1 min-w-[200px]'} />
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={sel}>
              <option value="rec">⭐ polecane</option>
              <option value="price">💸 najtaniej</option>
              <option value="far">🚗 najbliżej z Inowrocławia</option>
              <option value="votes">❤️ najwięcej głosów</option>
              <option value="update">💬 ostatni update</option>
            </select>
            <button onClick={() => setShowFilters((v) => !v)} className={'text-sm font-semibold px-3.5 py-2 rounded-xl border transition ' + (showFilters || filtersActive ? 'bg-teal-500/15 border-teal-500/50 text-teal-200' : 'bg-slate-800/70 border-slate-700 text-slate-200 hover:border-slate-600')}>
              ⚙️ Filtry{filtersActive && <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-teal-400 align-middle"></span>} <span className="text-slate-500">{showFilters ? '▾' : '▸'}</span>
            </button>
            <button onClick={doRandom} className="text-sm font-semibold px-3.5 py-2 rounded-xl bg-fuchsia-500/15 border border-fuchsia-500/40 text-fuchsia-200 hover:bg-fuchsia-500/25 transition">🎲 Losuj</button>
            <span className="ml-auto text-sm text-slate-400 font-semibold">{list.length} <span className="text-slate-600">/ {OFFERS.length}</span></span>
          </div>
          {showFilters && (
            <div className="mt-2.5 pt-3 border-t border-slate-800 flex flex-wrap gap-2 items-center card-in">
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
                <option value={0}>🚗 z Inowrocławia: bez limitu</option>
                <option value={45}>≤ 45 min z Inowrocławia</option>
                <option value={60}>≤ 1h z Inowrocławia</option>
                <option value={90}>≤ 1h30 z Inowrocławia</option>
                <option value={120}>≤ 2h z Inowrocławia</option>
              </select>
              <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm cursor-pointer hover:border-slate-600 transition">
                <input type="checkbox" checked={balia} onChange={(e) => setBalia(e.target.checked)} /> 🛁 balia/sauna
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm cursor-pointer hover:border-slate-600 transition">
                <input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} /> ✅ wolne 3–5.07
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm cursor-pointer hover:border-slate-600 transition">
                <input type="checkbox" checked={jezOnly} onChange={(e) => setJezOnly(e.target.checked)} /> 🌊 nad jeziorem
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm cursor-pointer hover:border-slate-600 transition">
                <input type="checkbox" checked={topOnly} onChange={(e) => setTopOnly(e.target.checked)} /> ⭐ tylko TOP
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm cursor-pointer hover:border-slate-600 transition">
                <input type="checkbox" checked={bioraOnly} onChange={(e) => setBioraOnly(e.target.checked)} /> ✅ potwierdzone przez ekipę
              </label>
              {filtersActive && <button onClick={clearFilters} className="text-sm px-3 py-2 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition">🧹 Wyczyść</button>}
            </div>
          )}
        </div>
      </div>

      {rnd && (
        <div className="max-w-6xl mx-auto px-5 pt-4">
          <div className="rounded-2xl border border-fuchsia-500/40 bg-fuchsia-500/10 p-4 flex flex-wrap items-center gap-3 backdrop-blur shadow-lg shadow-black/20">
            <span className="text-lg">🎲 los padł na:</span>
            <div className="flex-1 min-w-[180px]">
              <div className="font-bold">{rnd.n}</div>
              <div className="text-xs text-slate-300">📍 {rnd.loc} · {rnd.price}/noc · 🚗 T {rnd.tT} / I {rnd.tI}</div>
            </div>
            {rnd.tel && <a href={'tel:' + rnd.tel.replace(/\s/g, '')} className="text-sm font-semibold px-3 py-2 rounded-lg bg-teal-400 text-teal-950">📞 {rnd.tel}</a>}
            {rnd.link && <a href={rnd.link} target="_blank" rel="noopener" className="text-sm font-semibold px-3 py-2 rounded-lg bg-slate-700 text-slate-100">🔗 oferta</a>}
            <button onClick={doRandom} className="text-sm font-semibold px-3 py-2 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-100">🎲 Losuj jeszcze</button>
            <button onClick={() => setRnd(null)} aria-label="Zamknij" className="text-slate-400 hover:text-white px-2">✕</button>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-5 py-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {list.length === 0 && (
          <div className="col-span-full text-center text-slate-400 py-16 flex flex-col items-center gap-3">
            <div className="text-5xl">😕</div>
            <div className="text-slate-200 font-semibold text-lg">Pusto, ziomki — nic nie pasuje</div>
            <div className="text-sm">Poluzuj filtry albo zacznij od zera.</div>
            {filtersActive && (
              <button onClick={clearFilters} className="mt-1 px-5 py-2.5 rounded-xl bg-teal-400 text-teal-950 font-bold hover:brightness-105 transition">🧹 Wyczyść filtry</button>
            )}
          </div>
        )}
        {list.slice(0, limit).map((d) => (
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
            onDelUpdate={(ts) => doDelUpdate(d.n, ts)}
          />
        ))}
      </main>

      {list.length > limit && (
        <div className="max-w-6xl mx-auto px-5 pb-4 text-center">
          <button onClick={() => setLimit((l) => l + 48)} className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-800/70 font-semibold hover:bg-slate-800 hover:border-slate-600 transition">
            Pokaż więcej (+{Math.min(48, list.length - limit)}) · {limit}/{list.length}
          </button>
        </div>
      )}

      <footer className="max-w-6xl mx-auto px-5 py-10 flex flex-col items-center gap-3 text-center text-xs text-slate-500">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button onClick={replayIntro} className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition">
            ▶ Odtwórz intro ponownie
          </button>
          <button onClick={doReset} className="rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-2 font-semibold text-rose-300 hover:text-rose-100 hover:border-rose-500/70 transition">
            🧹 Reset aktywności ekipy
          </button>
        </div>
        <div>Domki Ekipa 🏕️ • {OFFERS.length} chat · termin 3–5.07 · głosy, raporty i muzyka na żywo • zrobione dla ekipy, przez ekipę 🤙</div>
      </footer>

      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-sm shadow-xl">{toast}</div>
      )}
    </div>
  );
}
