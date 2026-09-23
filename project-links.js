/* Share public project notes without a service or a second copy of their content. */
(() => {
  const slugs = {proof:'khonproof', thinkroom:'khonsolve', signal:'khonrelay', market:'khonodds', steam:'khonstash', portfolio:'portfolio', rotation:'spotify', dots:'dots', receipts:'receipts-after-dark', 'save-democracy':'save-democracy', calculator:'arduino-calculator', bot:'discord-bot', ipc:'between-processes'};
  const status = document.querySelector('#project-share-status');
  const fallback = document.querySelector('#project-share-address');
  let openedFromLink = false;
  let message = '';

  function projectFromHash() {
    const slug = location.hash.slice('#project/'.length);
    return location.hash.startsWith('#project/') ? Object.keys(slugs).find(id => slugs[id] === slug) : null;
  }

  function openLinkedProject() {
    const id = projectFromHash();
    if (id) {
      // A terminal or guide may already be open when a same-page link is followed.
      document.querySelectorAll('dialog[open]').forEach(dialog => { if (dialog !== projectDialog) dialog.close(); });
      openedFromLink = true;
      showProject(id);
    } else if (openedFromLink) {
      openedFromLink = false;
      projectDialog.close();
    }
  }

  document.querySelector('#project-copy-link').addEventListener('click', async () => {
    const id = activeProject;
    if (!Object.hasOwn(slugs, id)) return;
    const url = new URL(location.pathname, location.origin);
    url.hash = 'project/' + slugs[id];
    try {
      await navigator.clipboard.writeText(url.href);
      if (!projectDialog.open || activeProject !== id) return;
      message = 'Link copied.';
      fallback.hidden = true;
    } catch {
      if (!projectDialog.open || activeProject !== id) return;
      message = 'Copy the address below.';
      fallback.value = url.href;
      fallback.hidden = false;
      fallback.focus();
      fallback.select();
    }
    status.textContent = t(message);
  });

  projectDialog.addEventListener('close', () => {
    status.textContent = message = '';
    fallback.hidden = true;
    if (openedFromLink && projectFromHash()) {
      openedFromLink = false;
      window.history.replaceState(window.history.state, '', location.pathname + location.search + '#projects');
      document.querySelector(`[data-project="${activeProject}"]`)?.focus();
    }
  });
  window.addEventListener('portfolio:language', () => { status.textContent = t(message); });
  window.addEventListener('hashchange', openLinkedProject);
  openLinkedProject();
})();
