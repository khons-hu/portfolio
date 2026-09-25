/* "Listening now": the track Patrick is playing on Spotify, from /api/now-playing.
   Always visible; only fresh playback is labelled as listening now.
   The position is estimated on this page from the last answer: the CDN's Age header and half the
   round trip are added on the monotonic clock, so the visitor's own clock is never trusted. It ticks
   once a second only while the tab is visible, stops at the end of the track, and is dropped when the
   last confirmation gets old. Polls every 10 s while playing (the CDN answers most of those), never
   while hidden. Spotify's player loads only after a visitor asks for it, and it stays on the track
   that visitor chose: polls never restart or switch it. No audio, history or tracking of our own. */
(function (root) {
  const MAX_AGE_MS = 150000;          // never show data older than this as "now"
  const PROGRESS_MAX_AGE_MS = 90000;  // stop estimating the position this long after the last answer
  const GRACE_MS = 5000;              // allowance after the track's expected end
  const POLL = { playing: 10000, idle: 15000, unavailable: 180000 };
  const REQUEST_TIMEOUT_MS = 8000;     // a request that never settles must not stop polling for the visit
  const STATUS = { loading: 'Updating…', updating: 'Updating…', idle: 'Offline', unavailable: 'Currently unavailable' };
  const TRACK_URL = /^https:\/\/open\.spotify\.com\/track\/([A-Za-z0-9]{1,64})$/;

  const finite = value => typeof value === 'number' && Number.isFinite(value);
  const trackId = url => (typeof url === 'string' && TRACK_URL.exec(url) || [])[1] || null;
  // The official embed address, built only from a validated track ID.
  const embedUrl = url => { const id = trackId(url); return id ? `https://open.spotify.com/embed/track/${id}` : null; };

  // Decide what to show from a response and its age. Returns null when nothing should show.
  function view(data, ageMs) {
    if (!data || data.state !== 'playing' || !(ageMs >= 0) || ageMs > MAX_AGE_MS) return null;
    if (finite(data.remainingMs) && ageMs >= data.remainingMs + GRACE_MS) return null;
    if (!trackId(data.url)) return null;
    const title = typeof data.title === 'string' ? data.title.trim() : '';
    const artists = Array.isArray(data.artists) ? data.artists.filter(name => typeof name === 'string' && name.trim()) : [];
    return title && artists.length ? { title, artists, url: data.url } : null;
  }
  // Where the track should be now, from an answer that is ageMs old. null when it cannot be estimated
  // honestly: no usable position or duration, or a last confirmation too old to extrapolate from.
  function progress(data, ageMs) {
    if (!data || data.state !== 'playing' || !finite(ageMs) || ageMs < 0 || ageMs > PROGRESS_MAX_AGE_MS) return null;
    const total = data.durationMs, start = data.progressMs;
    if (!finite(total) || total <= 0 || !finite(start) || start < 0 || start > total) return null;
    const elapsed = Math.min(total, start + ageMs);
    return { elapsed, total, ended: elapsed >= total };
  }
  // How old an answer already was when it arrived: the CDN's Age (whole seconds) plus half the round trip.
  function arrivalAge(ageHeader, roundTripMs) {
    const age = ageHeader === null || ageHeader === undefined || ageHeader === '' ? NaN : Number(ageHeader);
    return (Number.isFinite(age) && age > 0 ? age * 1000 : 0) + (finite(roundTripMs) && roundTripMs > 0 ? roundTripMs / 2 : 0);
  }
  const formatTime = ms => {
    const seconds = Math.max(0, Math.floor(ms / 1000)), hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60) % 60, rest = String(seconds % 60).padStart(2, '0');
    return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${rest}` : `${minutes}:${rest}`;
  };
  // Milliseconds until the shown track stops counting as "now".
  const validFor = (data, ageMs) => Math.min(MAX_AGE_MS, finite(data?.remainingMs) ? data.remainingMs + GRACE_MS : MAX_AGE_MS) - ageMs;

  if (typeof module !== 'undefined' && module.exports) { module.exports = { view, progress, arrivalAge, formatTime, trackId, embedUrl, validFor, MAX_AGE_MS, PROGRESS_MAX_AGE_MS, GRACE_MS, POLL }; return; }
  const doc = root.document, box = doc.getElementById('now-listening');
  if (!box || typeof root.fetch !== 'function') return;
  const part = selector => box.querySelector(selector);
  const label = part('.listening-label'), status = part('.listening-status');
  const link = part('.listening-link'), title = part('.listening-title'), artist = part('.listening-artist');
  const row = part('.listening-progress'), bar = part('.listening-bar'), fill = part('.listening-fill');
  const elapsedText = part('.listening-elapsed'), totalText = part('.listening-total'), listen = part('.listening-listen');
  const listenText = listen?.querySelector?.('.listening-listen-text') || listen;
  const player = doc.getElementById('listening-player');
  const frameHost = player?.querySelector('.listening-frame');
  const playerOpen = player?.querySelector('.listening-player-open'), closeButton = player?.querySelector('.listening-close');
  const t = text => root.PortfolioI18n?.t(text) || text;
  const clock = () => root.performance.now();
  // receivedAt: the monotonic moment the last answer's position was true (arrival minus its age).
  let last = null, receivedAt = 0, lastFetch = -Infinity, inflight = null, stopped = false, answered = false;
  let pollTimer = 0, endTimer = 0, tickTimer = 0, current = null, endCheckedFor = null, embedded = null;

  // Rewrite text only when it changes: repeated polls leave the DOM (and assistive technology) alone.
  const setText = (node, text) => { if (node && node.textContent !== text) node.textContent = text; };
  // loading until the first answer settles; updating while a track that was playing is no longer confirmed.
  function summary(shown) {
    if (shown) return 'playing';
    if (!answered) return 'loading';
    if (last?.state === 'idle') return 'idle';
    return last?.state === 'playing' && view(last, 0) ? 'updating' : 'unavailable';
  }

  function stopTimers() { root.clearTimeout(pollTimer); root.clearTimeout(endTimer); root.clearTimeout(tickTimer); pollTimer = endTimer = tickTimer = 0; }

  function render() {
    root.clearTimeout(endTimer); endTimer = 0;
    const age = clock() - receivedAt, shown = view(last, age);
    current = shown;
    const state = summary(shown);
    box.hidden = false;
    box.setAttribute('data-playing', String(!!shown));
    box.setAttribute('data-state', state);
    link.hidden = !shown;
    setText(label, shown ? t('Listening now') : 'Spotify');
    if (status) {
      status.hidden = !!shown;
      if (!shown) setText(status, t(STATUS[state]));
    }
    if (!shown) { row.hidden = true; root.clearTimeout(tickTimer); tickTimer = 0; syncListen(); return; }
    if (link.href !== shown.url) link.href = shown.url;
    title.textContent = shown.title;
    artist.textContent = shown.artists.join(', ');
    box.hidden = false;
    syncListen();
    tick();
    if (doc.hidden) return; // nothing runs in a background tab
    // At the track's expected end, check once for the next one; if nothing new arrives, show the updating state
    // after a short grace period.
    const checkPending = finite(last.remainingMs) && last.url !== endCheckedFor;
    endTimer = root.setTimeout(atEnd, Math.max(1000, checkPending ? last.remainingMs - age : validFor(last, age)));
  }

  function atEnd() {
    endTimer = 0;
    // At most one extra request per track, and not right after another one: a stale CDN copy of the
    // finished track cannot start a loop. The regular poll takes over after that.
    const key = last?.url || null;
    if (key && key !== endCheckedFor && !doc.hidden && !stopped && clock() - lastFetch >= 2000) {
      endCheckedFor = key;
      refresh().then(schedule);
      return;
    }
    render();
  }

  // Updates only the time, the bar and its accessible value, once a second while visible.
  function tick() {
    root.clearTimeout(tickTimer); tickTimer = 0;
    const p = current ? progress(last, clock() - receivedAt) : null;
    if (row) row.hidden = !p;
    if (!p || !bar) return;
    const elapsed = formatTime(p.elapsed), total = formatTime(p.total);
    fill.style.setProperty('--listening-progress', String(Math.min(1, p.elapsed / p.total)));
    if (elapsedText.textContent !== elapsed) elapsedText.textContent = elapsed;
    if (totalText.textContent !== total) totalText.textContent = total;
    bar.setAttribute('aria-valuemax', String(Math.round(p.total / 1000)));
    bar.setAttribute('aria-valuenow', String(Math.floor(p.elapsed / 1000)));
    bar.setAttribute('aria-valuetext', t('about {elapsed} of {total}').replace('{elapsed}', elapsed).replace('{total}', total));
    if (p.ended || doc.hidden) return; // clamped at the end; the end check decides what comes next
    tickTimer = root.setTimeout(tick, 1000 - (p.elapsed % 1000) + 20);
  }

  function refresh() {
    if (inflight) return inflight;
    const started = lastFetch = clock();
    const controller = typeof root.AbortController === 'function' ? new root.AbortController() : null;
    const abortTimer = controller ? root.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS) : 0;
    inflight = root.fetch('/api/now-playing', { headers: { Accept: 'application/json' }, signal: controller?.signal })
      .then(response => {
        const arrived = clock();
        return response.ok ? response.json().then(data => ({ data, arrived, age: arrivalAge(response.headers.get('age'), arrived - started) })) : null;
      })
      .then(result => {
        if (!result || !result.data || typeof result.data !== 'object') return;
        last = result.data; receivedAt = result.arrived - result.age;
        if (last.state === 'unconfigured') stopped = true; // keep the unavailable summary until configured
      })
      // Network error or timeout: a track that is still fresh stays until it expires; otherwise the
      // summary says unavailable and the next check comes at the idle pace, not the long back-off.
      .catch(() => { if (!view(last, clock() - receivedAt)) last = { state: 'unavailable', offline: true }; })
      .finally(() => { root.clearTimeout(abortTimer); inflight = null; answered = true; render(); });
    return inflight;
  }

  function schedule() {
    root.clearTimeout(pollTimer); pollTimer = 0;
    if (stopped || doc.hidden) return;
    const wait = last?.offline ? POLL.idle : POLL[last?.state] || POLL.idle;
    pollTimer = root.setTimeout(() => refresh().then(schedule), Math.max(wait, (last?.retryAfter || 0) * 1000));
  }

  // Visitor playback: Spotify's official embed, requested from open.spotify.com only on this click.
  // It is kept apart from Patrick's live line: polls never touch it, and a new track replaces it only
  // when the visitor asks ("Switch to this track"). Removing the frame ends the visitor's playback.
  function syncListen() {
    if (!listen) return;
    const id = current ? trackId(current.url) : null;
    listen.hidden = !player || (!id && !embedded);
    listen.setAttribute('aria-expanded', String(!!player && !player.hidden));
    setText(listenText, t(embedded && !player.hidden ? 'Close player' : 'Listen here'));
  }

  function openPlayer() {
    if (player && !player.hidden) { closePlayer(); return; }
    const chosen = current || embedded?.track;
    const id = chosen ? trackId(chosen.url) : null, src = chosen ? embedUrl(chosen.url) : null;
    if (!id || !src || !player || !frameHost) return;
    const names = `${chosen.title} · ${chosen.artists.join(', ')}`;
    const frame = doc.createElement('iframe');
    frame.src = src;
    frame.title = `${t('Spotify player')}: ${names}`;
    frame.width = '100%'; frame.height = '152';
    // As in Spotify's embed code, minus autoplay: nothing plays until the visitor presses play inside it.
    frame.setAttribute('allow', 'clipboard-write; encrypted-media; fullscreen; picture-in-picture');
    frame.setAttribute('allowfullscreen', '');
    frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    frameHost.replaceChildren(frame);
    embedded = { id, url: chosen.url, names, track: chosen };
    playerOpen.href = chosen.url;
    player.hidden = false;
    syncListen();
    player.focus(); // keyboard focus follows the new player, which opens just below the toggle
  }

  function closePlayer() {
    if (!player) return;
    frameHost.replaceChildren(); // unloads the embed, so any preview or track stops
    player.hidden = true;
    syncListen();
    const next = !box.hidden && listen && !listen.hidden ? listen : !box.hidden ? link : doc.querySelector('.listening-note a');
    next?.focus();
  }

  listen?.addEventListener('click', openPlayer);
  closeButton?.addEventListener('click', closePlayer);
  root.addEventListener?.('portfolio:language', () => { render(); });

  doc.addEventListener('visibilitychange', () => {
    if (doc.hidden) { stopTimers(); return; } // no timers and no requests while hidden
    render(); // drop anything that went stale while the tab was hidden, then resume ticking
    if (!stopped && clock() - lastFetch > POLL.playing) refresh().then(schedule); else schedule();
  });
  render();
  if (!doc.hidden) refresh().then(schedule);
})(globalThis);
