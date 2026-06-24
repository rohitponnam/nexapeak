const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

const hamburger = document.getElementById('hamburger');
if (hamburger) {
  let menu = null;
  hamburger.addEventListener('click', () => {
    if (!menu) {
      menu = document.createElement('div');
      menu.className = 'mobile-menu';
      [
        ['index.html',    'Home'],
        ['services.html', 'Services'],
        ['cases.html',    'Case Studies'],
        ['about.html',    'About'],
        ['insights.html', 'Insights'],
        ['contact.html',  'Contact'],
      ].forEach(([href, label]) => {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = label;
        menu.appendChild(a);
      });
      navbar.appendChild(menu);
    }
    hamburger.classList.toggle('open');
    menu.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (menu && !navbar.contains(e.target)) {
      menu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
}

const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});

function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-aos-delay') || '0');
        setTimeout(() => entry.target.classList.add('aos-animate'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Sending...';
    btn.disabled = true;
    const data = {
      name:    (form.querySelector('#fname')?.value || '') + ' ' + (form.querySelector('#lname')?.value || ''),
      email:   form.querySelector('#email')?.value || '',
      company: form.querySelector('#company')?.value || '',
      role:    form.querySelector('#service')?.value || '',
      message: form.querySelector('#message')?.value || '',
      source:  'contact_form',
      page:    window.location.pathname,
    };
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        btn.innerHTML = '✓ Sent — we will be in touch within 1 business day';
        btn.style.background = '#059669';
      } else {
        throw new Error();
      }
    } catch {
      btn.innerHTML = orig;
      btn.disabled = false;
      alert('Something went wrong. Please email hello@nexapeak.com directly.');
    }
  });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initContactForm();
});
