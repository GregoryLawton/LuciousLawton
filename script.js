document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     Drawer navigation
  --------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const siteNav   = document.getElementById('siteNav');
  const navScrim  = document.getElementById('navScrim');
  const navLinks  = document.querySelectorAll('[data-nav-link]');

  function openNav(){
    siteNav.classList.add('is-open');
    navScrim.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    siteNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeNav(){
    siteNav.classList.remove('is-open');
    navScrim.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    siteNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    siteNav.classList.contains('is-open') ? closeNav() : openNav();
  });
  navScrim.addEventListener('click', closeNav);
  navLinks.forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });

  /* ---------------------------------------------------------
     Scroll-reveal for sections
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 90}ms`;
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------------------------------------------------------
     Hero spotlight follows the cursor (desktop only)
  --------------------------------------------------------- */
  const spotlight = document.getElementById('spotlight');
  const hero = document.querySelector('.hero');
  const canHover = window.matchMedia('(hover: hover)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (spotlight && hero && canHover && !reducedMotion){
    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      spotlight.style.setProperty('--x', `${x}%`);
      spotlight.style.setProperty('--y', `${y}%`);
    });
  }

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Inquiry form
  --------------------------------------------------------- */
  const form = document.getElementById('inquireForm');
const status = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending...';

    const data = new FormData(form);
    
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        status.textContent = 'Thanks! Your inquiry has been sent.';
        form.reset();
      } else {
        const errorData = await response.json();
        status.textContent = errorData.errors?.map(err => err.message).join(', ') || 'Something went wrong. Please try again.';
      }
    } catch (error) {
      status.textContent = 'Network error. Please try again later.';
    }
  });
}

});
