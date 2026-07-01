import type { Config, Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { SignJWT, jwtVerify } from 'jose';

// ===== Config (z env, sensowne defaulty dla ekipy) =====
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'domki-ekipa-dev-secret-change-me');
const PASSWORD = process.env.APP_PASSWORD || 'ekipa2026';
const COOKIE = 'domki_auth';
const DAY = 60 * 60 * 24;

// ===== Blobs store (kolaboracyjna warstwa: updates/votes/rsvps/availability) =====
function store() {
  return getStore('domki');
}
async function readJSON<T>(key: string, fallback: T): Promise<T> {
  const v = await store().get(key, { type: 'json' });
  return (v ?? fallback) as T;
}
async function writeJSON(key: string, data: unknown): Promise<void> {
  await store().setJSON(key, data);
}

// ===== Helpers =====
function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json', ...(init.headers || {}) },
  });
}
async function makeToken(): Promise<string> {
  return new SignJWT({ ok: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SECRET);
}
async function checkAuth(req: Request): Promise<boolean> {
  const cookie = req.headers.get('cookie') || '';
  const m = cookie.match(new RegExp(COOKIE + '=([^;]+)'));
  if (!m) return false;
  try {
    await jwtVerify(decodeURIComponent(m[1]), SECRET);
    return true;
  } catch {
    return false;
  }
}
function authCookie(token: string): string {
  return `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${DAY * 30}`;
}

// ===== Typy =====
type Update = { slug: string; author: string; type: string; text: string; ts: number };
type Rsvp = { name: string; ts: number };
type Avail = { status: string; who: string; ts: number };

// ===== Router (/api/*) =====
export default async (req: Request, _ctx: Context): Promise<Response> => {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\//, '').replace(/\/$/, '');
  const method = req.method;

  // --- AUTH (publiczne) ---
  if (path === 'auth') {
    if (method === 'POST') {
      const body = (await req.json().catch(() => ({}))) as { password?: string };
      if (String(body.password || '') !== PASSWORD) return json({ ok: false }, { status: 401 });
      const token = await makeToken();
      return json({ ok: true }, { headers: { 'set-cookie': authCookie(token) } });
    }
    return json({ authed: await checkAuth(req) });
  }

  // --- reszta wymaga auth ---
  if (!(await checkAuth(req))) return json({ error: 'unauthorized' }, { status: 401 });

  if (path === 'state' && method === 'GET') {
    const [updates, votes, rsvps, availability] = await Promise.all([
      readJSON<Record<string, Update[]>>('updates', {}),
      readJSON<Record<string, string[]>>('votes', {}),
      readJSON<Rsvp[]>('rsvps', []),
      readJSON<Record<string, Avail>>('availability', {}),
    ]);
    return json({ updates, votes, rsvps, availability });
  }

  if (method === 'POST') {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

    if (path === 'update') {
      const updates = await readJSON<Record<string, Update[]>>('updates', {});
      const u: Update = {
        slug: String(body.slug ?? ''),
        author: String(body.author ?? 'anon').slice(0, 40),
        type: String(body.type ?? 'notatka').slice(0, 20),
        text: String(body.text ?? '').slice(0, 500),
        ts: Date.now(),
      };
      (updates[u.slug] ||= []).push(u);
      await writeJSON('updates', updates);
      return json({ ok: true, update: u });
    }

    if (path === 'vote') {
      const votes = await readJSON<Record<string, string[]>>('votes', {});
      const slug = String(body.slug ?? '');
      const name = String(body.name ?? 'anon').slice(0, 40);
      const arr = (votes[slug] ||= []);
      const i = arr.indexOf(name);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(name);
      await writeJSON('votes', votes);
      return json({ ok: true, votes: arr.length, mine: i < 0 });
    }

    if (path === 'rsvp') {
      const rsvps = await readJSON<Rsvp[]>('rsvps', []);
      const name = String(body.name ?? '').slice(0, 40);
      if (name && !rsvps.some((r) => r.name === name)) rsvps.push({ name, ts: Date.now() });
      await writeJSON('rsvps', rsvps);
      return json({ ok: true, rsvps });
    }

    if (path === 'availability') {
      const availability = await readJSON<Record<string, Avail>>('availability', {});
      availability[String(body.slug ?? '')] = {
        status: String(body.status ?? 'do_potwierdzenia'),
        who: String(body.who ?? 'anon').slice(0, 40),
        ts: Date.now(),
      };
      await writeJSON('availability', availability);
      return json({ ok: true });
    }

    if (path === 'del-update') {
      const updates = await readJSON<Record<string, Update[]>>('updates', {});
      const slug = String(body.slug ?? '');
      const ts = Number(body.ts ?? 0);
      if (updates[slug]) updates[slug] = updates[slug].filter((u) => u.ts !== ts);
      await writeJSON('updates', updates);
      return json({ ok: true });
    }

    if (path === 'reset') {
      await Promise.all([
        writeJSON('updates', {}),
        writeJSON('votes', {}),
        writeJSON('rsvps', []),
        writeJSON('availability', {}),
      ]);
      return json({ ok: true });
    }
  }

  return json({ error: 'not found' }, { status: 404 });
};

export const config: Config = { path: '/api/*' };
