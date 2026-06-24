(function () {
  'use strict';

  const STORAGE_KEY = 'np_popup_seen';
  const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

  function hasSeenRecently() {
    const ts = localStorage.getItem(STORAGE_KEY);
    return ts && (Date.now() - parseInt(ts, 10) < COOLDOWN_MS);
  }

  function markSeen() {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }

  function injectHTML() {
    document.body.insertAdjacentHTML('beforeend', `
<div class="popup-overlay" id="leadPopup" role="dialog" aria-modal="true">
  <div class="popup-box">
    <div class="popup-top">
      <button class="popup-close" id="popupClose" aria-label="Close">&times;</button>
      <div class="popup-badge">&#128274; Free resource</div>
      <h2 class="popup-headline">Get our 2025 IT Transformation Playbook</h2>
      <p class="popup-sub">Used by 400+ enterprise teams to plan cloud, AI and digital programmes — yours free.</p>
    </div>
    <div class="popup-body" id="popupFormWrap">
      <form class="popup-form" id="leadForm" novalidate>
        <div class="form-group">
          <label for="pop_name">Full name *</label>
          <input type="text" id="pop_name" name="name" placeholder="Maya Rodriguez" required autocomplete="name">
        </div>
        <div class="form-group">
          <label for="pop_email">Work email *</label>
          <input type="email" id="pop_email" name="email" placeholder="m.rodriguez@company.com" required autocomplete="email">
        </div>
        <div class="form-group">
          <label for="pop_company">Company</label>
          <input type="text" id="pop_company" name="company" placeholder="Acme Corporation" autocomplete="organization">
        </div>
        <div class="form-group">
          <label for="pop_role">Your role</label>
          <select id="pop_role" name="role">
            <option value="">Select your role...</option>
            <option>CTO / CIO</option>
            <option>VP / Director of Engineering</option>
            <option>IT Manager</option>
            <option>Product Manager</option>
            <option>Procurement / Vendor Management</option>
            <option>Other</option>
          </select>
        </div>
        <div id="popupError" style="display:none;color:#DC2626;font-size:12px;margin-bottom:10px;padding:8px 12px;background:#FEF2F2;border-radius:6px;"></div>
        <button type="submit" class="popup-cta" id="popupSubmit">Send me the playbook &rarr;</button>
        <div class="popup-skip"><a id="popupSkip">No thanks, I will figure it out myself</a></div>
      </form>
    </div>
  </div>
</div>`);
  }

  function show() {
    if (hasSeenRecently()) return;
    const overlay = document.getElementById('leadPopup');
    if (!overlay) return;
    requestAnimationFrame(() => overlay.classList.add('active'));
    document.body.style.overflow = 'hidden';
  }

  function hide() {
    const overlay = document.getElementById('leadPopup');
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    markSeen();
  }

  function showSuccess() {
    document.getElementById('popupFormWrap').innerHTML = `
      <div class="popup-success">
        <div class="popup-success-icon">&#10003;</div>
        <h3>You are all set!</h3>
        <p>Check your inbox — the playbook is on its way. We will also send you relevant insights over the next few days.</p>
      </div>`;
    setTimeout(hide, 3500);
  }

  async function submit(data) {
    const btn = document.getElementById('popupSubmit');
    const err = document.getElementById('popupError');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    err.style.display = 'none';
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      showSuccess();
      markSeen();
    } catch (e) {
      err.textContent = e.message;
      err.style.display = 'block';
      btn.textContent = 'Send me the playbook \u2192';
      btn.disabled = false;
    }
  }

  function bindEvents() {
    document.getElementById('popupClose').addEventListener('click', hide);
    document.getElementById('popupSkip').addEventListener('click', hide);
    document.getElementById('leadPopup').addEventListener('click', function(e) {
      if (e.target === this) hide();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });

    document.getElementById('leadForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const name    = document.getElementById('pop_name').value.trim();
      const email   = document.getElementById('pop_email').value.trim();
      const company = document.getElementById('pop_company').value.trim();
      const role    = document.getElementById('pop_role').value;
      const err     = document.getElementById('popupError');

      if (!name) {
        err.textContent = 'Please enter your name.';
        err.style.display = 'block';
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        err.textContent = 'Please enter a valid work email.';
        err.style.display = 'block';
        return;
      }
      submit({ name, email, company, role, source: 'popup', page: window.location.pathname });
    });
  }

  function init() {
    if (hasSeenRecently()) return;
    injectHTML();
    bindEvents();

    let timer = setTimeout(show, 25000);

    document.addEventListener('mouseleave', function handler(e) {
      if (e.clientY <= 0) {
        clearTimeout(timer);
        show();
        document.removeEventListener('mouseleave', handler);
      }
    });

    window.addEventListener('scroll', function scrollHandler() {
      const pct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (pct >= 0.7) {
        clearTimeout(timer);
        show();
        window.removeEventListener('scroll', scrollHandler);
      }
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
