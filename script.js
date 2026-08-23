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
     Inquiry form -> opens a pre-filled email to
     LuciousLawton@gmail.com (no backend required).

     To switch to a silent form submission instead of opening
     the visitor's email client, point the <form> at a
     Formspree endpoint and remove this handler — see the
     comment above the form in index.html.
  --------------------------------------------------------- */
  const form = document.getElementById('inquireForm');
  const status = document.getElementById('formStatus');
  const INQUIRY_EMAIL = 'luciouslawton@gmail.com';

  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = form.name.value.trim();
      const company = form.company.value.trim();
      const email   = form.email.value.trim();
      const phone   = form.phone.value.trim();
      const details = form.details.value.trim();

      const subject = `Inquiry from ${name}${company ? ' — ' + company : ''}`;
      const body =
`Name: ${name}
Company / Production: ${company || '—'}
Email: ${email}
Phone: ${phone || '—'}

Details:
${details}`;

      const mailtoLink = `mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoLink;
      status.textContent = 'Opening your email app to send this inquiry…';
    });
  }

});
