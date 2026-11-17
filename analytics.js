(() => {
  const measurementId = 'G-QL3JRK5GDY';
  const storageKey = 'simiao-visit-statistics-v1';
  const notice = document.getElementById('analytics-notice');
  const preferences = document.getElementById('analytics-preferences');
  if (!notice) return;
  let enabled = false;
  let loaded = false;
  const readChoice = () => {
    try { const saved = JSON.parse(localStorage.getItem(storageKey)); return saved && Date.now() - saved.at < 180 * 86400000 ? saved.choice : null; } catch { return null; }
  };
  const saveChoice = choice => { try { localStorage.setItem(storageKey, JSON.stringify({choice, at: Date.now()})); } catch {} };
  const cleanUrl = value => { try { const url = new URL(value); return url.origin + url.pathname; } catch { return ''; } };
  function allow() {
    enabled = true;
    window['ga-disable-' + measurementId] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    if (!loaded) {
      window.gtag('consent', 'default', {analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
      window.gtag('consent', 'update', {analytics_storage: 'granted'});
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {allow_google_signals: false, allow_ad_personalization_signals: false, page_location: cleanUrl(location.href), page_referrer: cleanUrl(document.referrer)});
      const tag = document.createElement('script'); tag.async = true; tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
      document.head.append(tag); loaded = true;
    } else window.gtag('consent', 'update', {analytics_storage: 'granted'});
  }
  function decline() {
    enabled = false;
    window['ga-disable-' + measurementId] = true;
    if (window.gtag) window.gtag('consent', 'update', {analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) return;
      for (const domain of ['', location.hostname, '.' + location.hostname]) document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '');
    });
  }
  function choose(choice) { saveChoice(choice); if (choice === 'allow') allow(); else decline(); notice.hidden = true; }
  document.getElementById('analytics-allow').addEventListener('click', () => choose('allow'));
  document.getElementById('analytics-decline').addEventListener('click', () => choose('decline'));
  preferences?.addEventListener('click', () => { notice.hidden = false; document.getElementById('analytics-decline').focus(); });
  document.querySelectorAll('details.catalog-item').forEach(item => item.addEventListener('toggle', () => {
    if (enabled && item.open && window.gtag) window.gtag('event', 'project_open', {project_name: item.querySelector('.catalog-title strong').textContent});
  }));
  document.querySelectorAll('[data-project]').forEach(link => link.addEventListener('click', () => {
    if (enabled && window.gtag) window.gtag('event', 'project_open', {project_name: link.dataset.project});
  }));
  const choice = readChoice();
  if (choice === 'allow') { allow(); notice.hidden = true; }
  else if (choice === 'decline') { decline(); notice.hidden = true; }
  else notice.hidden = false;
})();
