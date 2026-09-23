/* One place to switch tools. Form drafts and guide replies remain in their own panels. */
(() => {
  const ids = ['terminal-dialog', 'guide-dialog', 'email-dialog'];
  let returnFocus = null;
  let switchTimer;
  function open(id, selector) {
    if (!ids.includes(id)) return;
    const target = document.getElementById(id);
    const current = document.querySelector('dialog[open]');
    if (!current) returnFocus = document.activeElement;
    // Switching tabs keeps the frame still: the old panel closes at once and only the content fades.
    const switching = Boolean(current && current !== target && ids.includes(current.id));
    document.querySelectorAll('dialog').forEach(dialog => dialog.classList.toggle('dialog-instant', dialog !== target));
    target.classList.toggle('panel-switch', switching);
    document.querySelectorAll('dialog[open]').forEach(dialog => { if (dialog !== target) dialog.close(); });
    if (!target.open) target.showModal();
    clearTimeout(switchTimer);
    if (switching) switchTimer = setTimeout(() => target.classList.remove('panel-switch'), 260);
    // Without a requested field, keep keyboard focus on the matching tab instead of the first one.
    target.querySelector(selector || `[data-panel="${id}"]`)?.focus();
  }
  document.querySelectorAll('[data-panel]').forEach(button => button.addEventListener('click', () => open(button.dataset.panel)));
  for (const id of ids) document.getElementById(id).addEventListener('close', () => {
    if (!document.querySelector('dialog[open]') && returnFocus?.isConnected && !returnFocus.closest('dialog')) returnFocus.focus({preventScroll:true});
  });
  window.PortfolioPanels = {open};
  function translatePanels() {
    const names = {'terminal-dialog':'Terminal', 'guide-dialog':'Ask khonsu', 'email-dialog':'Email'};
    document.querySelectorAll('[data-panel]').forEach(button => { button.textContent = t(names[button.dataset.panel]); });
    document.querySelectorAll('.panel-nav').forEach(nav => nav.setAttribute('aria-label', t('Portfolio tools')));
  }
  window.addEventListener('portfolio:language', translatePanels);
  translatePanels();

  // Keep the composer reachable when a mobile keyboard reduces the visible viewport.
  function fitPanels() {
    const viewport = window.visualViewport;
    if (!viewport) return;
    for (const id of ids) {
      const panel = document.getElementById(id);
      panel.style.setProperty('--panel-height', `${viewport.height}px`);
      panel.style.setProperty('--panel-top', `${viewport.offsetTop}px`);
    }
  }
  window.visualViewport?.addEventListener('resize', fitPanels);
  window.visualViewport?.addEventListener('scroll', fitPanels);
  fitPanels();
})();
