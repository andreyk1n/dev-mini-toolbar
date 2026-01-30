
(() => {
  if (window.__DEV_MINI_TOOLBAR__) return;
  window.__DEV_MINI_TOOLBAR__ = true;

  const bar = document.createElement('div');
  bar.className = 'dev-toolbar';

  const main = document.createElement('div');
  main.className = 'main-buttons';

  const extra = document.createElement('div');
  extra.className = 'extra-buttons hidden';

  const btn = (label, fn, title) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.title = title || '';
    b.onclick = fn;
    return b;
  };

  // MAIN
  main.append(
    btn('⟳', () => location.reload(), 'Reload'),
    btn('⇧', () => scrollTo({ top: 0, behavior: 'smooth' }), 'Scroll top'),
    btn('⇩', () => scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 'Scroll bottom'),
    btn('⋯', () => extra.classList.toggle('hidden'), 'More tools')
  );

  // EXTRA (future-ready)
  extra.append(
    btn('🧹C', clearCookies, 'Clear cookies + reload'),
    btn('🧹S', clearStorage, 'Clear local/session storage'),
    btn('⚡', hardReload, 'Hard reload (no cache)'),
    btn('▢', toggleOutline, 'Toggle outline'),
    btn('🎞', toggleAnimations, 'Disable animations'),
    btn('☾', toggleDark, 'Force dark mode'),
    btn('✖︎', removeFixed, 'Remove fixed elements'),
    btn('ⓘ', showInfo, 'Page info')
  );

  bar.append(main, extra);
  document.body.appendChild(bar);

  // FUNCTIONS
  function clearCookies() {
    document.cookie.split(';').forEach(c => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    location.reload();
  }

  function clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
    location.reload();
  }

  function hardReload() {
    location.href = location.href.split('?')[0] + '?_=' + Date.now();
  }

  let outlined = false;
  function toggleOutline() {
    outlined = !outlined;
    document.querySelectorAll('*').forEach(el => {
      el.style.outline = outlined ? '1px solid rgba(255,0,0,.35)' : '';
    });
  }

  let animationsOff = false;
  function toggleAnimations() {
    animationsOff = !animationsOff;
    document.documentElement.style.setProperty(
      '--dev-disable-anim',
      animationsOff ? 'none' : ''
    );

    if (animationsOff) {
      const style = document.createElement('style');
      style.id = 'dev-no-anim';
      style.textContent = '*{animation:none!important;transition:none!important}';
      document.head.appendChild(style);
    } else {
      document.getElementById('dev-no-anim')?.remove();
    }
  }

  let darkForced = false;
  function toggleDark() {
    darkForced = !darkForced;
    document.documentElement.style.filter = darkForced ? 'invert(1) hue-rotate(180deg)' : '';
  }

  function removeFixed() {
    document.querySelectorAll('*').forEach(el => {
      if (getComputedStyle(el).position === 'fixed') {
        el.style.display = 'none';
      }
    });
  }

  function showInfo() {
    alert(
      'URL: ' + location.href +
      '\nViewport: ' + window.innerWidth + 'x' + window.innerHeight +
      '\nDOM nodes: ' + document.querySelectorAll('*').length
    );
  }
})();
