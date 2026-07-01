import { useEffect, useRef, useState } from 'react';

/* ===== Konfetti (samozarządzalny canvas + requestAnimationFrame) ===== */
let cvs: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
type P = { x: number; y: number; vx: number; vy: number; c: string; life: number; s: number };
let parts: P[] = [];
let running = false;
const COLORS = ['#3ddc84', '#54d6c4', '#54a0ff', '#c084fc', '#ffce54', '#ff6b8b'];

function ensureCanvas() {
  if (cvs) return;
  cvs = document.createElement('canvas');
  cvs.style.cssText = 'position:fixed;inset:0;z-index:60;pointer-events:none';
  document.body.appendChild(cvs);
  ctx = cvs.getContext('2d');
  const resize = () => { if (cvs) { cvs.width = window.innerWidth; cvs.height = window.innerHeight; } };
  resize();
  window.addEventListener('resize', resize);
}

function loop() {
  if (!ctx || !cvs) { running = false; return; }
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.25; p.life--;
    ctx.fillStyle = p.c;
    ctx.fillRect(p.x, p.y, p.s, p.s);
    if (p.life < 0 || p.y > cvs.height + 20) parts.splice(i, 1);
  }
  if (parts.length > 0) requestAnimationFrame(loop);
  else running = false;
}

export function burst(n = 60) {
  ensureCanvas();
  if (!cvs) return;
  const cx = cvs.width / 2;
  const cy = cvs.height * 0.32;
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + Math.random();
    const sp = 3 + Math.random() * 6;
    parts.push({
      x: cx, y: cy,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 3,
      c: COLORS[i % COLORS.length],
      life: 70 + Math.random() * 40,
      s: 4 + Math.random() * 4,
    });
  }
  if (!running) { running = true; requestAnimationFrame(loop); }
}

/* ===== Muzyka (chill ambient pad, WebAudio) ===== */
let actx: AudioContext | null = null;
let started = false;

function startMusic() {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  actx = new AC();
  const master = actx.createGain(); master.gain.value = 0.06; master.connect(actx.destination);
  const lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700; lp.connect(master);
  [110, 164.81, 220, 277.18].forEach((f, i) => {
    const o = actx!.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    const g = actx!.createGain(); g.gain.value = 0.5; o.connect(g); g.connect(lp); o.start();
    const lfo = actx!.createOscillator(); lfo.frequency.value = 0.04 + i * 0.03;
    const lg = actx!.createGain(); lg.gain.value = 0.4; lfo.connect(lg); lg.connect(g.gain); lfo.start();
  });
  started = true;
}

export function MusicToggle() {
  const [on, setOn] = useState(false);
  const toggle = () => {
    if (!on) { if (!started) startMusic(); else void actx?.resume(); setOn(true); }
    else { void actx?.suspend(); setOn(false); }
  };
  return (
    <button
      onClick={toggle}
      aria-label="Przełącz muzykę"
      className={'fixed right-3 bottom-3 z-50 rounded-full px-4 py-2.5 text-sm font-semibold border backdrop-blur transition ' +
        (on ? 'bg-gradient-to-r from-teal-400 to-sky-400 text-teal-950 border-transparent' : 'bg-slate-800/90 text-slate-200 border-slate-700')}
    >
      🎵 Muzyka: {on ? 'ON' : 'off'}
    </button>
  );
}

/* ===== Lecące ikonki w tle ===== */
export function FloatingIcons() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    const em = ['🏕️', '🌊', '🍺', '🌲'];
    const nodes: HTMLSpanElement[] = [];
    for (let i = 0; i < 7; i++) {
      const s = document.createElement('span');
      s.textContent = em[i % em.length];
      s.className = 'pcl';
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDuration = 16 + Math.random() * 18 + 's';
      s.style.animationDelay = -Math.random() * 24 + 's';
      s.style.fontSize = 14 + Math.random() * 16 + 'px';
      box.appendChild(s);
      nodes.push(s);
    }
    return () => { nodes.forEach((n) => n.remove()); };
  }, []);
  return <div ref={ref} className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }} />;
}
