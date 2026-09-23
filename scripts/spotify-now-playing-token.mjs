#!/usr/bin/env node
/* One-time helper: authorise the portfolio's "Listening now" line with a single read-only scope.
   Run on your own Mac:
     SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/spotify-now-playing-token.mjs
   It opens Spotify's consent page for user-read-currently-playing only, receives the code on
   http://127.0.0.1:8888/callback, and copies the resulting refresh token to the clipboard.
   The token is never printed or written to disk. Paste it into Vercel as SPOTIFY_REFRESH_TOKEN.
   This file is excluded from deployment (.vercelignore). */
import http from 'node:http';
import crypto from 'node:crypto';
import { execFileSync, spawn } from 'node:child_process';

const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
const REDIRECT = process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:8888/callback';
const SCOPE = 'user-read-currently-playing';
if (!id || !secret) {
  console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET for your Spotify app first (Developer Dashboard → your app → Settings).');
  process.exit(1);
}
const state = crypto.randomBytes(24).toString('hex');
const redirect = new URL(REDIRECT);
const authorize = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
  response_type: 'code', client_id: id, scope: SCOPE, redirect_uri: REDIRECT, state, show_dialog: 'true'
});

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  if (url.pathname !== redirect.pathname) { res.writeHead(404).end(); return; }
  const done = (code, message) => { res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8' }).end(message); server.close(); };
  if (url.searchParams.get('state') !== state) return done(400, 'State mismatch. Nothing was saved.');
  if (url.searchParams.get('error')) return done(400, 'Spotify authorisation was cancelled. Nothing was saved.');
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'authorization_code', code: url.searchParams.get('code') || '', redirect_uri: REDIRECT })
    });
    const data = await response.json();
    if (!response.ok || !data.refresh_token) throw new Error(`token exchange failed (${response.status})`);
    if (data.scope && data.scope.split(' ').some(s => s !== SCOPE)) throw new Error(`unexpected scope: ${data.scope}`);
    // Existing Spotify apps may merge old permissions when refreshing. Verify the
    // refresh grant too, before storing anything in a public deployment.
    const refreshed = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: data.refresh_token })
    });
    const renewed = await refreshed.json();
    if (!refreshed.ok || !renewed.access_token) throw new Error('refresh verification failed');
    if (renewed.scope !== SCOPE) throw new Error('refresh permissions exceed currently-playing; use a separate Spotify app');
    // Quick check that the scope works, without printing anything personal.
    const check = await fetch('https://api.spotify.com/v1/me/player/currently-playing', { headers: { Authorization: `Bearer ${data.access_token}` } });
    execFileSync('pbcopy', { input: data.refresh_token });
    console.log(`Refresh token copied to the clipboard (scope: ${SCOPE}; test request status ${check.status}, 204 means nothing is playing).`);
    console.log('Next: Vercel → khonsu project → Settings → Environment Variables → add SPOTIFY_REFRESH_TOKEN (Production), plus SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET, then redeploy.');
    done(200, 'Done. You can close this tab and return to the terminal.');
  } catch (error) {
    console.error('Authorisation failed:', error.message);
    done(500, 'Authorisation failed. See the terminal.');
  }
});

server.listen(Number(redirect.port) || 80, redirect.hostname, () => {
  console.log(`Opening Spotify consent for "${SCOPE}" only. Redirect URI in use: ${REDIRECT} (it must be listed in your app's settings).`);
  spawn('open', [authorize], { stdio: 'ignore', detached: true }).unref();
});
