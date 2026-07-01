// Klient API do backendu (Netlify Functions). Działa gdy apka jest pod `netlify dev`
// lub wdrożona. W czystym `vite dev` fetch do /api poleci błędem — UI ma fallback offline.

export type UpdateItem = { slug: string; author: string; type: string; text: string; ts: number };
export type Rsvp = { name: string; ts: number };
export type Avail = { status: string; who: string; ts: number };

export interface AppState {
  updates: Record<string, UpdateItem[]>;
  votes: Record<string, string[]>;
  rsvps: Rsvp[];
  availability: Record<string, Avail>;
}

async function req(path: string, opts?: RequestInit): Promise<any> {
  const r = await fetch('/api/' + path, {
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    ...opts,
  });
  if (!r.ok) throw new Error('api ' + path + ' -> ' + r.status);
  return r.json();
}

export const api = {
  authStatus: (): Promise<{ authed: boolean }> => req('auth'),
  login: (password: string): Promise<{ ok: boolean }> =>
    req('auth', { method: 'POST', body: JSON.stringify({ password }) }),
  state: (): Promise<AppState> => req('state'),
  vote: (slug: string, name: string): Promise<{ ok: boolean; votes: number; mine: boolean }> =>
    req('vote', { method: 'POST', body: JSON.stringify({ slug, name }) }),
  rsvp: (name: string): Promise<{ ok: boolean; rsvps: Rsvp[] }> =>
    req('rsvp', { method: 'POST', body: JSON.stringify({ name }) }),
  addUpdate: (slug: string, author: string, type: string, text: string): Promise<{ ok: boolean; update: UpdateItem }> =>
    req('update', { method: 'POST', body: JSON.stringify({ slug, author, type, text }) }),
  availability: (slug: string, status: string, who: string): Promise<{ ok: boolean }> =>
    req('availability', { method: 'POST', body: JSON.stringify({ slug, status, who }) }),
  delUpdate: (slug: string, ts: number): Promise<{ ok: boolean }> =>
    req('del-update', { method: 'POST', body: JSON.stringify({ slug, ts }) }),
};
