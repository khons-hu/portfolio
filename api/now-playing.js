/* What Patrick is playing on Spotify right now, reduced to public track metadata.
   Runs as a Vercel Node function. Credentials come from environment variables and never
   reach the browser: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN
   (a refresh token authorised with the single scope user-read-currently-playing).
   No history, artwork, device or progress details are returned. The CDN caches every answer
   briefly, so visitors share one Spotify request per ~30 seconds. */
'use strict';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const NOW_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const TIMEOUT_MS = 5000;
let cachedToken = null; // {value, expiresAt} kept only in this warm instance's memory

const configured = env => Boolean(env.SPOTIFY_CLIENT_ID && env.SPOTIFY_CLIENT_SECRET && env.SPOTIFY_REFRESH_TOKEN);

async function accessToken(env, fetcher, now) {
  if (cachedToken && cachedToken.expiresAt > now() + 60000) return cachedToken.value;
  const basic = Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const response = await fetcher(TOKEN_URL, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: env.SPOTIFY_REFRESH_TOKEN }).toString(),
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });
  if (!response.ok) { cachedToken = null; throw Object.assign(new Error('token'), { status: response.status }); }
  const data = await response.json();
  if (typeof data.access_token !== 'string') throw new Error('token');
  // Only read-only playback scopes are accepted. A broader token (playlist or library write access)
  // is a configuration mistake on a public server, so it is refused rather than used.
  const allowed = new Set(['user-read-currently-playing', 'user-read-playback-state']);
  const scopes = String(data.scope || '').split(/\s+/).filter(Boolean);
  if (scopes.some(scope => !allowed.has(scope))) throw Object.assign(new Error('scope:' + scopes.filter(scope => /^[a-z-]+$/.test(scope)).join(',')), { status: 403 });
  cachedToken = { value: data.access_token, expiresAt: now() + Math.max(60, Number(data.expires_in) || 3600) * 1000 };
  return cachedToken.value;
}

// Keep only what the page shows. Anything that is not a normal public Spotify track stays hidden.
function publicTrack(data) {
  const item = data && data.item;
  if (!data || data.is_playing !== true || data.currently_playing_type !== 'track' || !item || item.type !== 'track' || item.is_local) return null;
  const url = item.external_urls && item.external_urls.spotify;
  if (typeof url !== 'string' || !/^https:\/\/open\.spotify\.com\/track\/[A-Za-z0-9]+(\?.*)?$/.test(url)) return null;
  const title = String(item.name || '').trim().slice(0, 200);
  const artists = (item.artists || []).map(artist => String(artist && artist.name || '').trim()).filter(Boolean).slice(0, 4).map(name => name.slice(0, 120));
  if (!title || !artists.length) return null;
  const duration = Number(item.duration_ms), progress = Number(data.progress_ms);
  const remainingMs = Number.isFinite(duration) && Number.isFinite(progress) && duration > progress ? Math.round(duration - progress) : null;
  return { title, artists, url: url.split('?')[0], remainingMs };
}

async function currentlyPlaying(env, fetcher, now) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const token = await accessToken(env, fetcher, now);
    const response = await fetcher(`${NOW_URL}?additional_types=track`, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (response.status === 204) return { state: 'idle' }; // nothing playing, or a private session
    if (response.status === 401 && attempt === 0) { cachedToken = null; continue; }
    if (response.status === 429) return { state: 'unavailable', retryAfter: Math.min(300, Math.max(30, Number(response.headers.get('retry-after')) || 60)) };
    if (!response.ok) return { state: 'unavailable' };
    const track = publicTrack(await response.json());
    return track ? { state: 'playing', track } : { state: 'idle' };
  }
  return { state: 'unavailable' };
}

async function nowPlaying({ env = process.env, fetcher = fetch, now = Date.now } = {}) {
  if (!configured(env)) return { body: { state: 'unconfigured' }, maxAge: 300 };
  try {
    const result = await currentlyPlaying(env, fetcher, now);
    const fetchedAt = now();
    if (result.state === 'playing') return { body: { state: 'playing', fetchedAt, ...result.track }, maxAge: 30 };
    if (result.state === 'idle') return { body: { state: 'idle', fetchedAt }, maxAge: 60 };
    return { body: { state: 'unavailable' }, maxAge: result.retryAfter || 60 };
  } catch (error) {
    // Log the category only. Tokens, secrets and Spotify response bodies are never logged.
    console.warn('now-playing:', error.message, error.status || '');
    return { body: { state: 'unavailable' }, maxAge: 60 };
  }
}

async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405; res.setHeader('Allow', 'GET, HEAD'); res.end(); return;
  }
  const { body, maxAge } = await nowPlaying();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // Shared CDN cache keeps Spotify calls rare; browsers always revalidate so nobody sees an old "now".
  res.setHeader('Cache-Control', `public, max-age=0, s-maxage=${maxAge}, stale-while-revalidate=${Math.min(30, maxAge)}`);
  res.setHeader('X-Robots-Tag', 'noindex');
  res.end(req.method === 'HEAD' ? undefined : JSON.stringify(body));
}

module.exports = handler;
module.exports.nowPlaying = nowPlaying;
module.exports.publicTrack = publicTrack;
module.exports._reset = () => { cachedToken = null; };
