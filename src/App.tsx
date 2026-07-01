import { useMemo, useState } from 'react';
import type { Offer } from './types';
import rawOffers from './data/offers.json';

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

function oneBadge(o: string) {
  if (o === 'tak') return { t: '✅ 1 noc OK', c: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' };
  if (o === 'potw') return { t: '❓ dopytaj o 1 noc', c: 'bg-amber-400/15 text-amber-300 border-amber-400/40' };
  return { t: '⚠️ min. nocy — pytaj o lukę', c: 'bg-orange-400/15 text-orange-300 border-orange-400/40' };
}

const sel = 'bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none';

export default function App() {
  const [q, setQ] = useState('');
  const [woj, setWoj] = useState('');
  const [one, setOne] = useState('');
  const [price, setPrice] = useState(0);
  const [far, setFar] = useState(0);
  const [balia, setBalia] = useState(false);
  const [sort, setSort] = useState('rec');

  const list = useMemo(() => {
    const l = OFFERS.filter((d) => {
      if (woj && d.w !== woj) return false;
      if (one === 'tak' && d.one !== 'tak') return false;
      if (one === 'takpotw' && d.one === 'luka') return false;
      if (balia && !d.balia) return false;
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
      if (a.feat !== b.feat) return b.feat - a.feat;
      return (a.pn || 99999) - (b.pn || 99999);
    });
  }, [q, woj, one, price, far, balia, sort]);

  return (
    <div className="min-h-screen">
      <div className="aurora" />

      <header className="px-5 pt-10 pb-6 max-w-6xl mx-auto">
        <span className="inline-block text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-orange-400 to-rose-500 text-black">
          🔥 wyjazd ekipy • 2026
        </span>
        <h1 className="text-4xl font-extrabold mt-3 bg-gradient-to-r from-teal-200 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
          🏕️ DOMKI EKIPA
        </h1>
        <p className="text-slate-300 mt-2">
          Wybieramy chatę dla <b>naszej szóstki</b> — sobota 4 → niedziela 5 lipca, do ~2h od Torunia/Inowrocławia. Filtruj, klikaj, dzwoń. 🤙
        </p>
        <div className="mt-3 text-sm text-slate-400">
          Ofert w bazie: <b className="text-slate-200">{OFFERS.length}</b>
        </div>
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
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={sel}>
            <option value="rec">⭐ polecane</option>
            <option value="price">💸 najtaniej</option>
            <option value="far">🚗 najbliżej</option>
          </select>
          <span className="ml-auto text-sm text-slate-400">{list.length} / {OFFERS.length}</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-5 py-6 grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {list.length === 0 && (
          <div className="col-span-full text-center text-slate-400 py-16">
            {OFFERS.length === 0 ? '⏳ Baza pusta — uruchom `npm run seed` (albo poczekaj na rundę seedowania).' : '😕 Nic nie pasuje. Poluzuj filtry.'}
          </div>
        )}
        {list.map((d, i) => {
          const b = oneBadge(d.one);
          return (
            <article key={i} className={'rounded-2xl border p-4 flex flex-col gap-2 bg-gradient-to-b from-slate-800 to-slate-900 hover:-translate-y-1 transition ' + (d.feat ? 'border-amber-600/50 ring-1 ring-amber-600/30' : 'border-slate-700')}>
              <div className="font-bold text-lg leading-tight">{d.n}</div>
              <div className="text-xs text-slate-400">📍 {d.r} · {d.w}</div>
              <div className="flex flex-wrap gap-1.5">
                {d.feat ? <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-amber-400/15 text-amber-200 border-amber-400/40">⭐ TOP</span> : null}
                <span className={'text-[11px] font-semibold px-2 py-0.5 rounded-full border ' + b.c}>{b.t}</span>
                {d.balia ? <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-fuchsia-400/15 text-fuchsia-200 border-fuchsia-400/40">🛁 balia/sauna</span> : null}
                {d.jez ? <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-sky-400/15 text-sky-200 border-sky-400/40">🌊 nad jeziorem</span> : null}
              </div>
              <div className="text-sm text-slate-300 space-y-0.5">
                <div>🏠 {d.loc}</div>
                <div>👥 {d.cap}</div>
                <div>🚗 Toruń {d.tT} · Inowrocław {d.tI}</div>
              </div>
              <div className="text-xl font-extrabold">{d.price} <span className="text-xs text-slate-400 font-medium">/ noc</span></div>
              {d.note ? <div className="text-xs text-slate-400 italic">{d.note}</div> : null}
              <div className="mt-auto flex gap-2 flex-wrap pt-1">
                {d.tel ? <a href={'tel:' + d.tel.replace(/\s/g, '')} className="flex-1 text-center text-sm font-semibold py-2 rounded-lg bg-teal-400 text-teal-950">📞 {d.tel}</a> : null}
                {d.link ? <a href={d.link} target="_blank" rel="noopener" className="flex-1 text-center text-sm font-semibold py-2 rounded-lg bg-slate-700 text-slate-100">🔗 oferta</a> : null}
              </div>
            </article>
          );
        })}
      </main>

      <footer className="max-w-6xl mx-auto px-5 py-10 text-center text-xs text-slate-500">
        Domki Ekipa • runda 1 (szkielet) • baza i funkcje rosną z każdą rundą 🤙
      </footer>
    </div>
  );
}
