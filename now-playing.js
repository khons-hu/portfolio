/* "Listening now": the track Patrick is playing on Spotify, from /api/now-playing.
   Shown only while it is confirmed as playing and fresh; otherwise the line is hidden.
   Polls once a minute while the tab is visible, never while hidden. No audio, no history. */
(function (root) {
  const MAX_AGE_MS = 150000;   // never show data older than this as "now"
  const GRACE_MS = 5000;       // allowance after the track's expected end
  const POLL = { playing: 60000, idle: 60000, unavailable: 180000 };

  // Decide what to show from a response and its age. Returns null when nothing should show.
  function view(data, ageMs) {
    if (!data || data.state !== 'playing' || !(ageMs >= 0) || ageMs > MAX_AGE_MS) return null;
    if (typeof data.remainingMs === 'number' && ageMs > data.remainingMs + GRACE_MS) return null;
    if (typeof data.url !== 'string' || !/^https:\/\/open\.spotify\.com\/track\/[A-Za-z0-9]+$/.test(data.url)) return null;
    const title = typeof data.title === 'string' ? data.title.trim() : '';
    const artists = Array.isArray(data.artists) ? data.artists.filter(name => typeof name === 'string' && name.trim()) : [];
    return title && artists.length ? { title, artists, url: data.url } : null;
  }
  // Milliseconds until the shown track stops counting as "now".
  const validFor = (data, ageMs) => Math.min(MAX_AGE_MS, typeof data?.remainingMs === 'number' ? data.remainingMs + GRACE_MS : MAX_AGE_MS) - ageMs;

  if (typeof module !== 'undefined' && module.exports) { module.exports = { view, validFor, MAX_AGE_MS, GRACE_MS, POLL }; return; }
  const doc = root.document, box = doc.getElementById('now-listening');
  if (!box || typeof root.fetch !== 'function') return;
  const link = box.querySelector('a'), title = box.querySelector('.listening-title'), artist = box.querySelector('.listening-artist');
  const clock = () => root.performance.now();
  let last = null, receivedAt = 0, lastFetch = -Infinity, pollTimer = 0, endTimer = 0, inflight = null, stopped = false;

  function render() {
    root.clearTimeout(endTimer);
    const age = clock() - receivedAt, shown = view(last, age);
    if (!shown) { box.hidden = true; return; }
    if (link.href !== shown.url) link.href = shown.url;
    title.textContent = shown.title;
    artist.textContent = shown.artists.join(', ');
    box.hidden = false;
    // Hide exactly when the track should have ended, then ask once for the next one.
    endTimer = root.setTimeout(() => { render(); if (!doc.hidden && clock() - lastFetch > 20000) refresh().then(schedule); }, Math.max(1000, validFor(last, age)));
  }

  function refresh() {
    if (inflight) return inflight;
    lastFetch = clock();
    inflight = root.fetch('/api/now-playing', { headers: { Accept: 'application/json' } })
      .then(response => response.ok ? response.json().then(data => ({ data, age: Number(response.headers.get('age')) || 0 })) : null)
      .then(result => {
        if (!result || typeof result.data !== 'object') return;
        // The CDN's Age header says how old the answer is, without trusting the visitor's clock.
        last = result.data; receivedAt = clock() - Math.max(0, result.age) * 1000;
        if (last.state === 'unconfigured') stopped = true; // nothing to show until Patrick sets it up
      })
      .catch(() => {}) // offline: whatever is still fresh stays, then disappears on schedule
      .finally(() => { inflight = null; render(); });
    return inflight;
  }

  function schedule() {
    root.clearTimeout(pollTimer);
    if (stopped || doc.hidden) return;
    pollTimer = root.setTimeout(() => refresh().then(schedule), POLL[last?.state] || POLL.idle);
  }

  doc.addEventListener('visibilitychange', () => {
    if (doc.hidden) { root.clearTimeout(pollTimer); return; }
    render(); // drop anything that went stale while the tab was hidden
    if (!stopped && clock() - lastFetch > 30000) refresh().then(schedule); else schedule();
  });
  if (!doc.hidden) refresh().then(schedule);
})(globalThis);
