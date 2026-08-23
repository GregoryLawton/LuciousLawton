document.addEventListener('DOMContentLoaded', () => {

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Curtain intro — parts like a theater curtain on load
  --------------------------------------------------------- */
  const curtainLeft  = document.getElementById('curtainLeft');
  const curtainRight = document.getElementById('curtainRight');

  if (curtainLeft && curtainRight && !reducedMotion){
    document.body.classList.add('curtain-lock');
    setTimeout(() => {
      curtainLeft.classList.add('is-open');
      curtainRight.classList.add('is-open');
      setTimeout(() => {
        curtainLeft.classList.add('is-hidden');
        curtainRight.classList.add('is-hidden');
        document.body.classList.remove('curtain-lock');
      }, 1250);
    }, 350);
  }

  /* ---------------------------------------------------------
     Scroll progress bar
  --------------------------------------------------------- */
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress){
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = `${pct}%`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }

  /* ---------------------------------------------------------
     Custom cursor (gold ring, desktop with fine pointer only)
  --------------------------------------------------------- */
  const cursorRing = document.getElementById('cursorRing');
  if (cursorRing && canHover && !reducedMotion){
    document.body.classList.add('has-custom-cursor');

    document.addEventListener('pointermove', (e) => {
      cursorRing.style.left = `${e.clientX}px`;
      cursorRing.style.top  = `${e.clientY}px`;
      cursorRing.classList.add('is-active');
    });
    document.addEventListener('pointerdown', () => cursorRing.classList.add('is-click'));
    document.addEventListener('pointerup',   () => cursorRing.classList.remove('is-click'));
    document.addEventListener('mouseleave',  () => cursorRing.classList.remove('is-active'));

    const hoverTargets = document.querySelectorAll('a, button, .gallery-item, .reel-card, .track-card, input, textarea');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hover'));
    });
  }

  /* ---------------------------------------------------------
     Hover tilt / parallax on reel & track cards
  --------------------------------------------------------- */
  if (canHover && !reducedMotion){
    const tiltEls = document.querySelectorAll('.reel-card, .track-card');
    tiltEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const max = 8;
        el.style.transform =
          `perspective(800px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-6px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------------------------------------------------------
     Gallery lightbox
  --------------------------------------------------------- */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');
  const galleryImgs   = Array.from(document.querySelectorAll('.gallery-item img'));

  let lightboxIndex = 0;

  function showLightbox(i){
    lightboxIndex = (i + galleryImgs.length) % galleryImgs.length;
    const img = galleryImgs[lightboxIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (lightbox && galleryImgs.length){
    galleryImgs.forEach((img, i) => {
      img.addEventListener('click', () => showLightbox(i));
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => showLightbox(lightboxIndex - 1));
    lightboxNext.addEventListener('click', () => showLightbox(lightboxIndex + 1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft')  showLightbox(lightboxIndex - 1);
      if (e.key === 'ArrowRight') showLightbox(lightboxIndex + 1);
    });
  }

  /* ---------------------------------------------------------
     Ambient sound toggle
  --------------------------------------------------------- */
  const soundToggle = document.getElementById('soundToggle');
  const soundIcon   = document.getElementById('soundIcon');
  const ambientAudio = document.getElementById('ambientAudio');

  if (soundToggle && ambientAudio){
    const savedPref = localStorage.getItem('ll-sound');

    function setPlaying(isPlaying){
      if (isPlaying){
        ambientAudio.volume = 0.35;
        ambientAudio.play().catch(() => {});
        soundToggle.classList.add('is-playing');
        soundToggle.setAttribute('aria-pressed', 'true');
        soundIcon.classList.remove('fa-volume-mute');
        soundIcon.classList.add('fa-volume-up');
      } else {
        ambientAudio.pause();
        soundToggle.classList.remove('is-playing');
        soundToggle.setAttribute('aria-pressed', 'false');
        soundIcon.classList.remove('fa-volume-up');
        soundIcon.classList.add('fa-volume-mute');
      }
    }

    soundToggle.addEventListener('click', () => {
      const willPlay = !soundToggle.classList.contains('is-playing');
      setPlaying(willPlay);
      localStorage.setItem('ll-sound', willPlay ? 'on' : 'off');
    });

    // Muted by default — only auto-resumes if the visitor previously turned it on.
    if (savedPref === 'on') setPlaying(true);
  }

  /* ---------------------------------------------------------
     Easter egg — click the nav logo a few times
  --------------------------------------------------------- */
  const navLogo = document.getElementById('navLogo');
  if (navLogo && !reducedMotion){
    let clickCount = 0;
    let resetTimer = null;

    function spawnConfetti(x, y){
      const colors = ['#e6c877', '#b8933e', '#ece4d3'];
      const flourish = document.createElement('div');
      flourish.className = 'logo-flourish';
      flourish.style.left = `${x}px`;
      flourish.style.top  = `${y}px`;
      document.body.appendChild(flourish);
      setTimeout(() => flourish.remove(), 1200);

      for (let i = 0; i < 26; i++){
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        const angle = Math.random() * Math.PI * 2;
        const dist  = 90 + Math.random() * 160;
        piece.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
        piece.style.setProperty('--ty', `${Math.sin(angle) * dist - 40}px`);
        piece.style.setProperty('--rot', `${(Math.random() * 720 - 360)}deg`);
        piece.style.left = `${x}px`;
        piece.style.top  = `${y}px`;
        piece.style.background = colors[i % colors.length];
        piece.style.animationDelay = `${Math.random() * 120}ms`;
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 1800);
      }
    }

    navLogo.addEventListener('click', (e) => {
      clickCount++;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { clickCount = 0; }, 2500);

      if (clickCount >= 5){
        const rect = navLogo.getBoundingClientRect();
        spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
        clickCount = 0;
      }
    });
  }

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
