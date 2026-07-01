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

/* ===== Muzyka w tle: realny utwór z YouTube (oficjalny odtwarzacz, zapętlony) ===== */
const YT_ID = '9y8sZ6bZtaA';
/* eslint-disable @typescript-eslint/no-explicit-any */
let ytPlayer: any = null;
let ytReady = false;
let wantPlay = false;
let onStateCb: ((playing: boolean) => void) | null = null;

function loadYT(cb: () => void) {
  const w = window as any;
  if (w.YT && w.YT.Player) { cb(); return; }
  const prev = w.onYouTubeIframeAPIReady;
  w.onYouTubeIframeAPIReady = () => { if (typeof prev === 'function') prev(); cb(); };
  if (!document.getElementById('yt-api')) {
    const s = document.createElement('script');
    s.id = 'yt-api';
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  }
}

function ensurePlayer() {
  const w = window as any;
  if (ytPlayer) return;
  let host = document.getElementById('yt-bg');
  if (!host) {
    host = document.createElement('div');
    host.id = 'yt-bg';
    host.style.cssText = 'position:fixed;width:1px;height:1px;left:-9999px;top:-9999px;opacity:0;pointer-events:none';
    document.body.appendChild(host);
  }
  ytPlayer = new w.YT.Player('yt-bg', {
    videoId: YT_ID,
    playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: YT_ID, playsinline: 1, modestbranding: 1, rel: 0 },
    events: {
      onReady: (e: any) => { ytReady = true; try { e.target.setVolume(30); } catch { /* noop */ } if (wantPlay) e.target.playVideo(); },
      onStateChange: (e: any) => { if (onStateCb) onStateCb(e.data === 1); },
    },
  });
}

export function MusicToggle() {
  const [on, setOn] = useState(false);
  onStateCb = setOn;

  const play = () => {
    wantPlay = true;
    localStorage.removeItem('domki_music_off');
    loadYT(ensurePlayer);
    if (ytReady && ytPlayer) { try { ytPlayer.playVideo(); } catch { /* noop */ } }
    setOn(true);
  };
  const pause = () => {
    wantPlay = false;
    localStorage.setItem('domki_music_off', '1');
    if (ytReady && ytPlayer) { try { ytPlayer.pauseVideo(); } catch { /* noop */ } }
    setOn(false);
  };

  useEffect(() => {
    // player tworzymy od razu (gotowy zanim user kliknie), a gra dopiero po geście
    loadYT(ensurePlayer);
    if (localStorage.getItem('domki_music_off') === '1') return;
    const kick = () => { play(); off(); };
    const off = () => {
      window.removeEventListener('pointerdown', kick);
      window.removeEventListener('keydown', kick);
    };
    window.addEventListener('pointerdown', kick, { once: true });
    window.addEventListener('keydown', kick, { once: true });
    return off;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      onClick={() => (on ? pause() : play())}
      aria-label="Przełącz muzykę"
      className={'fixed right-3 bottom-3 z-50 rounded-full px-4 py-2.5 text-sm font-semibold border backdrop-blur transition ' +
        (on ? 'bg-gradient-to-r from-teal-400 to-sky-400 text-teal-950 border-transparent' : 'bg-slate-800/90 text-slate-200 border-slate-700')}
    >
      🎵 Muzyka: {on ? 'ON' : 'off'}
    </button>
  );
}

/* ===== Delikatne iskry w tle (premium, zamiast emoji) ===== */
export function FloatingIcons() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    const colors = ['#54d6c4', '#54a0ff', '#c084fc', '#7dd3fc'];
    const nodes: HTMLSpanElement[] = [];
    for (let i = 0; i < 14; i++) {
      const s = document.createElement('span');
      const c = colors[i % colors.length];
      const size = 3 + Math.random() * 6;
      s.className = 'spark';
      s.style.left = Math.random() * 100 + '%';
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.background = c;
      s.style.boxShadow = `0 0 ${6 + size}px ${c}`;
      s.style.animationDuration = 20 + Math.random() * 20 + 's';
      s.style.animationDelay = -Math.random() * 30 + 's';
      box.appendChild(s);
      nodes.push(s);
    }
    return () => { nodes.forEach((n) => n.remove()); };
  }, []);
  return <div ref={ref} className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }} />;
}
