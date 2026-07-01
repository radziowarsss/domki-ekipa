import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react';
import { toggleMusic, useMusicOn } from './effects';

/**
 * Intro.tsx — kinowe, animowane intro (fantasy-bard) grane PRZED apką.
 * Zero zależności zewnętrznych: animacje na czystym CSS (patrz index.css, sekcja
 * "KINOWE INTRO") + cząsteczki na <canvas>, parallax (mysz / tilt telefonu).
 * Sterowanie: auto-play z paskiem postępu + jawne Wstecz / Pauza / Dalej + klawiatura.
 * Wszystkie rAF-y, timery i listenery są sprzątane przy odmontowaniu.
 */

type Orb = { x: string; y: string; size: number; color: string; dur: number };
type Scene = {
  glyph: string;
  overline: string;
  heading: string;
  big?: boolean;
  lines: string[];
  accent: string;
  accent2: string;
  orbs: Orb[];
};

const SCENES: Scene[] = [
  {
    glyph: '📜',
    overline: 'Kronika Ekipy · Anno Domini 2026',
    heading: 'LEGENDA EKIPY',
    big: true,
    lines: [
      'Bard stroi lutnię, ognisko trzaska w mroku…',
      'Sześcioro imion, jedna legenda: Radzio, Lewarczyk, Beścik, Amelka, Małagosia i Natalka.',
    ],
    accent: '#54d6c4',
    accent2: '#c084fc',
    orbs: [
      { x: '18%', y: '26%', size: 380, color: '#0f766e', dur: 17 },
      { x: '80%', y: '30%', size: 320, color: '#2563eb', dur: 21 },
      { x: '54%', y: '84%', size: 300, color: '#7c3aed', dur: 19 },
    ],
  },
  {
    glyph: '🦋',
    overline: 'Akt I — Sekretny Sojusz',
    heading: 'Sekretny Sojusz',
    lines: [
      'Pewnego dnia, w krainie zwykłych planów i nudnych wtorków,',
      'Amelka i Małagosia uknuły plan doskonały: kocyk, jezioro i ZERO chłopaków —',
      'a Natalka już pakowała krem z filtrem i zapas dobrego humoru.',
    ],
    accent: '#ff8fb1',
    accent2: '#54d6c4',
    orbs: [
      { x: '24%', y: '30%', size: 360, color: '#be185d', dur: 18 },
      { x: '76%', y: '62%', size: 300, color: '#0f766e', dur: 22 },
    ],
  },
  {
    glyph: '🐉',
    overline: 'Akt II — Radzio Przebiegły',
    heading: 'Radzio Przebiegły',
    lines: [
      'Lecz o świcie, gdy rosa jeszcze lśniła na trawie, z cienia wyłonił się ON.',
      'Radzio Przebiegły — mistrz okazji, łowca promocji, smok węszący rabaty na sto mil.',
      'Zamiast po prostu zadzwonić — zbudował CAŁĄ stronę i zamienił kameralną randkę w najazd całej ekipy.',
    ],
    accent: '#c084fc',
    accent2: '#7c5cff',
    orbs: [
      { x: '30%', y: '68%', size: 400, color: '#6d28d9', dur: 20 },
      { x: '74%', y: '26%', size: 260, color: '#4c1d95', dur: 24 },
      { x: '50%', y: '48%', size: 220, color: '#1e1b4b', dur: 16 },
    ],
  },
  {
    glyph: '🔥',
    overline: 'Akt III — Narodziny Legendy',
    heading: 'Narodziny Legendy',
    lines: [
      'I tak, zamiast dwojga — ruszyło SZEŚCIORO śmiałków.',
      'Radzio (mózg operacji), Lewarczyk (siła i cennik), Beścik (klimat),',
      'Amelka (plan), Małagosia (bagaż na dwa tygodnie) i Natalka (radar plaż).',
    ],
    accent: '#ffce54',
    accent2: '#54d6c4',
    orbs: [
      { x: '26%', y: '64%', size: 360, color: '#b45309', dur: 15 },
      { x: '78%', y: '58%', size: 320, color: '#0f766e', dur: 19 },
      { x: '52%', y: '22%', size: 240, color: '#0369a1', dur: 23 },
    ],
  },
  {
    glyph: '⚔️',
    overline: 'Akt IV — Finał',
    heading: 'DOMKI EKIPA',
    big: true,
    lines: [
      'Proroctwo dopełnione. Sześcioro, jedno jezioro, jeden wielki browar.',
      'Wybierz chatę. Zwołaj drużynę. Niech legenda się zacznie.',
    ],
    accent: '#54d6c4',
    accent2: '#54a0ff',
    orbs: [
      { x: '20%', y: '28%', size: 380, color: '#0f766e', dur: 16 },
      { x: '82%', y: '34%', size: 340, color: '#2563eb', dur: 20 },
      { x: '50%', y: '86%', size: 320, color: '#7c3aed', dur: 18 },
    ],
  },
];

// Ile ms trzyma się każda scena, zanim auto-przejdzie dalej (spokojne tempo do czytania).
// Ostatnia scena czeka na „Wejdź".
const DURATIONS = [7000, 8500, 9200, 8500, Number.MAX_SAFE_INTEGER];

export default function Intro({ onEnter }: { onEnter: () => void }) {
  const [scene, setScene] = useState(0);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const [dir, setDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const [exiting, setExiting] = useState(false);
  const musicOn = useMusicOn();

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(false);
  const fastRef = useRef(false);
  const autoRef = useRef<number | null>(null);
  const transRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const remainRef = useRef<number>(0);
  const sceneRef = useRef(0);
  const phaseRef = useRef<'in' | 'out'>('in');
  const pausedRef = useRef(false);
  const onEnterRef = useRef(onEnter);
  const accentRef = useRef('#54d6c4');

  const LAST = SCENES.length - 1;

  // Lustrzane refy (świeże wartości w stabilnych callbackach/timerach).
  sceneRef.current = scene;
  phaseRef.current = phase;
  pausedRef.current = paused;
  onEnterRef.current = onEnter;
  accentRef.current = SCENES[scene].accent;

  const finish = useCallback((fast: boolean) => {
    if (doneRef.current) return;
    doneRef.current = true;
    fastRef.current = fast;
    if (autoRef.current) window.clearTimeout(autoRef.current);
    if (transRef.current) window.clearTimeout(transRef.current);
    setExiting(true);
    window.setTimeout(() => onEnterRef.current(), fast ? 300 : 760);
  }, []);

  const step = useCallback(
    (d: number) => {
      if (doneRef.current || phaseRef.current === 'out') return;
      const cur = sceneRef.current;
      if (d === 1 && cur >= LAST) {
        finish(false);
        return;
      }
      if (d === -1 && cur <= 0) return;
      if (autoRef.current) window.clearTimeout(autoRef.current);
      setDir(d === -1 ? -1 : 1);
      setPhase('out');
      transRef.current = window.setTimeout(() => {
        setScene((s) => Math.min(Math.max(s + d, 0), LAST));
        setPhase('in');
      }, 430);
    },
    [LAST, finish],
  );

  const startTimer = useCallback(
    (ms: number) => {
      if (autoRef.current) window.clearTimeout(autoRef.current);
      startRef.current = Date.now();
      autoRef.current = window.setTimeout(() => step(1), ms);
    },
    [step],
  );

  const jump = useCallback((i: number) => {
    if (doneRef.current || phaseRef.current === 'out') return;
    const cur = sceneRef.current;
    if (i === cur) return;
    if (autoRef.current) window.clearTimeout(autoRef.current);
    setDir(i > cur ? 1 : -1);
    setPhase('out');
    transRef.current = window.setTimeout(() => {
      setScene(i);
      setPhase('in');
    }, 430);
  }, []);

  const togglePause = useCallback(() => {
    setPaused((p) => {
      const np = !p;
      pausedRef.current = np;
      if (np) {
        if (autoRef.current) window.clearTimeout(autoRef.current);
        remainRef.current = Math.max(0, remainRef.current - (Date.now() - startRef.current));
      } else if (sceneRef.current < LAST && phaseRef.current === 'in') {
        startTimer(Math.max(400, remainRef.current));
      }
      return np;
    });
  }, [LAST, startTimer]);

  // Auto-play: start/reset timera po wejściu w scenę.
  useEffect(() => {
    if (phase !== 'in' || doneRef.current) return;
    remainRef.current = DURATIONS[scene];
    if (!pausedRef.current && scene < LAST) startTimer(DURATIONS[scene]);
    return () => {
      if (autoRef.current) window.clearTimeout(autoRef.current);
    };
  }, [scene, phase, startTimer, LAST]);

  useEffect(
    () => () => {
      if (transRef.current) window.clearTimeout(transRef.current);
    },
    [],
  );

  // Klawiatura: → dalej, ← wstecz, spacja = pauza, Enter = dalej/wejdź, Esc = pomiń.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish(true);
      else if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (sceneRef.current >= LAST) finish(false);
        else step(1);
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, finish, togglePause, LAST]);

  // Parallax: mysz (desktop) + tilt (telefon). Wygładzane w rAF, zapisywane w CSS-vars.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      tx = clamp((e.gamma ?? 0) / 28);
      ty = clamp(((e.beta ?? 45) - 45) / 28);
    };
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      root.style.setProperty('--px', cx.toFixed(3));
      root.style.setProperty('--py', cy.toFixed(3));
      raf = window.requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('deviceorientation', onTilt);
    raf = window.requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('deviceorientation', onTilt);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  // Cząsteczki (świetliki/iskry) na canvasie — barwione akcentem sceny, additywne, sprzątane.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const base = ['#54d6c4', '#54a0ff', '#c084fc', '#ffce54', '#eaf2ff'];
    type Pt = { x: number; y: number; r: number; vy: number; vx: number; a: number; tw: number; c: string };
    let w = 0;
    let h = 0;
    let dpr = 1;
    let pts: Pt[] = [];
    const pick = () => (Math.random() < 0.55 ? accentRef.current : base[(Math.random() * base.length) | 0]);
    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = reduce ? 20 : Math.min(72, Math.round((w * h) / 21000));
      pts = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 2.3,
        vy: -(0.1 + Math.random() * 0.45),
        vx: (Math.random() - 0.5) * 0.25,
        a: Math.random() * Math.PI * 2,
        tw: 0.008 + Math.random() * 0.02,
        c: pick(),
      }));
    };
    build();
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of pts) {
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.a) * 0.15;
        p.a += p.tw;
        if (p.y < -12) {
          p.y = h + 12;
          p.x = Math.random() * w;
          p.c = pick();
        }
        if (p.x < -12) p.x = w + 12;
        else if (p.x > w + 12) p.x = -12;
        const tw = 0.5 + 0.5 * Math.sin(p.a * 3);
        const rad = p.r * 5;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
        g.addColorStop(0, p.c);
        g.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.16 + tw * 0.5;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      raf = window.requestAnimationFrame(draw);
    };
    raf = window.requestAnimationFrame(draw);
    const onResize = () => build();
    window.addEventListener('resize', onResize);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Muzyka jest globalna i jedna (patrz effects.tsx: initMusic / toggleMusic / useMusicOn) —
  // przycisk niżej tylko przełącza ten sam utwór, który gra pod intro i wchodzi do apki.

  const onRootClick = (e: ReactMouseEvent) => {
    // Tło NIE przewija (bez przypadkowych przeskoków) — steruj przyciskami/strzałkami.
    const t = e.target as HTMLElement;
    if (t.closest('button') || t.closest('a')) return;
  };

  const s = SCENES[scene];
  const sceneVars = { ['--accent']: s.accent, ['--accent2']: s.accent2 } as CSSProperties;
  const segState = (i: number) =>
    i < scene ? 'done' : i === scene ? (scene === LAST ? 'done' : 'active') : 'todo';

  return (
    <div
      ref={rootRef}
      className={'intro-root' + (exiting ? ' is-exiting' : '')}
      style={sceneVars}
      onClick={onRootClick}
      role="dialog"
      aria-label="Intro — Legenda Ekipy"
    >
      <canvas ref={canvasRef} className="intro-canvas" aria-hidden="true" />

      <div className="intro-bg" aria-hidden="true">
        {s.orbs.map((o, i) => (
          <div
            key={scene + '-' + i}
            className="intro-orb"
            style={
              {
                left: o.x,
                top: o.y,
                width: o.size,
                height: o.size,
                marginLeft: -o.size / 2,
                marginTop: -o.size / 2,
                background: o.color,
                ['--dur']: o.dur + 's',
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="intro-vignette" aria-hidden="true" />

      <div className="intro-topbar">
        <button className="intro-btn" data-music-toggle onClick={toggleMusic} aria-label="Przełącz muzykę">
          {musicOn ? '🔊 muzyka' : '🔇 muzyka'}
        </button>
        <div className="intro-prog" role="progressbar" aria-label="Postęp opowieści">
          {SCENES.map((_, i) => (
            <button
              key={i}
              className="intro-seg"
              onClick={() => jump(i)}
              aria-label={'Scena ' + (i + 1)}
            >
              <span
                className="intro-seg-fill"
                data-state={segState(i)}
                key={i === scene ? 'a' + scene : 'i' + i}
                style={
                  segState(i) === 'active'
                    ? { animationDuration: DURATIONS[scene] + 'ms', animationPlayState: paused ? 'paused' : 'running' }
                    : undefined
                }
              />
            </button>
          ))}
        </div>
        <button className="intro-btn" onClick={() => finish(true)}>
          Pomiń ⏭
        </button>
      </div>

      <div className="intro-stage">
        <div className="intro-scene" data-phase={phase} data-dir={dir} key={scene}>
          <div className="intro-aura" aria-hidden="true" />
          <div className="intro-rise" style={{ animationDelay: '0s' }}>
            <div className="intro-glyph">{s.glyph}</div>
          </div>
          <div className="intro-overline intro-rise" style={{ animationDelay: '.1s' }}>
            {s.overline}
          </div>
          <h1
            className={'intro-title intro-rise' + (s.big ? '' : ' is-act')}
            style={{ animationDelay: '.22s' }}
          >
            {s.heading}
          </h1>
          {s.lines.map((ln, li) => (
            <p key={li} className={'intro-line' + (li === 0 ? ' lead' : '')}>
              {ln.split(' ').map((word, wi) => (
                <span
                  key={wi}
                  className="intro-word intro-rise"
                  style={{ animationDelay: `${0.5 + li * 0.5 + wi * 0.05}s` }}
                >
                  {word}
                </span>
              ))}
            </p>
          ))}
          {scene === LAST && (
            <button
              className="intro-cta intro-rise"
              style={{ animationDelay: `${0.5 + s.lines.length * 0.5 + 0.25}s` }}
              onClick={() => finish(false)}
            >
              ⚔️ Wejdź do legendy
            </button>
          )}
        </div>
      </div>

      {!musicOn && (
        <button
          data-music-toggle
          onClick={toggleMusic}
          aria-label="Włącz muzykę"
          className="fixed left-1/2 -translate-x-1/2 bottom-24 z-40 rounded-full px-5 py-3 text-sm font-extrabold text-teal-950 bg-gradient-to-r from-teal-300 to-sky-300 shadow-xl shadow-teal-500/40 animate-pulse"
        >
          🔊 Dotknij — puść muzykę do legendy
        </button>
      )}

      <div className="intro-nav">
        <button className="intro-navbtn" onClick={() => step(-1)} disabled={scene === 0}>
          ‹ Wstecz
        </button>
        {scene < LAST && (
          <button className="intro-navbtn" onClick={togglePause} aria-label={paused ? 'Wznów' : 'Pauza'}>
            {paused ? '▶ Wznów' : '⏸ Pauza'}
          </button>
        )}
        {scene < LAST && (
          <button className="intro-navbtn is-primary" onClick={() => step(1)}>
            Dalej ›
          </button>
        )}
      </div>

      {exiting && !fastRef.current && <div className="intro-flash" aria-hidden="true" />}
    </div>
  );
}
