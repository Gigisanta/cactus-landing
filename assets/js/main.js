/* ============================================================
   Cactus Wealth Management — main.js v3
   Animaciones: reveal, contadores, ticker live, asset allocation,
   carrusel, parallax sutil, nav, drawer, post tilt
   ============================================================ */

(() => {
  'use strict';

  /* ---------- helpers ---------- */
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1. Fecha dinámica del brief
     ============================================================ */
  const briefDate = $('#brief-date');
  if (briefDate) {
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const now = new Date();
    briefDate.textContent = `${months[now.getMonth()]} ${now.getDate()}`;
  }

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     2. Nav: scroll state + drawer
     ============================================================ */
  const nav = $('#nav');
  const burger = $('#burger');
  const drawer = $('#drawer');

  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  if (burger && drawer) {
    const setOpen = (open) => {
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      drawer.hidden = !open;
    };
    burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') === 'false'));
    $$('#drawer a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  }

  /* ============================================================
     3. Reveal-on-scroll con stagger
     ============================================================ */
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    $$('[data-reveal]').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      io.observe(el);
    });
  } else {
    $$('[data-reveal]').forEach(el => el.classList.add('is-in'));
  }

  /* ============================================================
     4. Counter animation (metricas)
     ============================================================ */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.target);
    const isFloat = !Number.isInteger(target);
    const decimals = isFloat ? (target.toString().split('.')[1]?.length || 1) : 0;
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const v = target * eased;
      el.textContent = isFloat ? v.toFixed(decimals) : Math.round(v);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const cIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          cIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    $$('[data-target]').forEach(el => cIO.observe(el));
  } else {
    $$('[data-target]').forEach(el => el.textContent = el.dataset.target);
  }

  /* ============================================================
     5. Asset Allocation: chips + bar grow on view
     ============================================================ */
  const profiles = {
    conservador: { liq: 30, fx: 50, eq: 15, ar:  5 },
    moderado:    { liq: 20, fx: 40, eq: 25, ar: 15 },
    agresivo:    { liq: 10, fx: 20, eq: 50, ar: 20 },
  };
  const bar = $('#alloc-bar');
  if (bar) {
    const segs = $$('.allocation__seg', bar);
    const chips = $$('.allocation__chip');

    const setProfile = (p) => {
      const cfg = profiles[p];
      chips.forEach(c => {
        const on = c.dataset.profile === p;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-selected', String(on));
      });
      segs.forEach(seg => {
        const key = seg.dataset.key;
        const pct = cfg[key];
        seg.style.width = `${pct}%`;
        const pctEl = seg.querySelector('.allocation__pct');
        if (pctEl) pctEl.textContent = `${pct}%`;
      });
    };

    // animate initial reveal
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setProfile('moderado');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.3 });
      io.observe(bar);
    } else {
      setProfile('moderado');
    }

    chips.forEach(c => c.addEventListener('click', () => setProfile(c.dataset.profile)));
  }

  /* ============================================================
     6. Testimonial carousel
     ============================================================ */
  const slides = $$('.tcarousel__slide');
  const dots = $$('.tcarousel__dot');
  if (slides.length > 1) {
    let cur = 0;
    const show = (i) => {
      slides.forEach((s, j) => s.classList.toggle('is-active', j === i));
      dots.forEach((d, j) => {
        const on = j === i;
        d.classList.toggle('is-active', on);
        d.setAttribute('aria-selected', String(on));
      });
      cur = i;
    };
    dots.forEach(d => d.addEventListener('click', () => show(+d.dataset.i)));
    setInterval(() => show((cur + 1) % slides.length), 5500);
  }

  /* ============================================================
     7. Ticker — scroll infinito por CSS.
     (El jitter numérico se removió: corrompía valores con formato
      es-AR como "$1.405" o "2.9% MoM". El scroll ya da la vida.)
     ============================================================ */

  /* ============================================================
     8. Hero: mouse parallax sutil (solo desktop, no mobile)
     ============================================================ */
  const hero = $('.hero');
  if (hero && window.matchMedia('(pointer: fine)').matches && !prefersReduced) {
    const orbs = $$('.hero__orb', hero);
    const card = $('.hero__card', hero);
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      orbs.forEach((o, i) => {
        const d = (i + 1) * 12;
        o.style.transform = `translate(${x * d}px, ${y * d}px)`;
      });
      if (card) {
        const rotY = x * 3; // grados
        const rotX = -y * 2;
        // mantener el rotate base -1.8deg
        card.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) rotate(-1.8deg) translateZ(0)`;
      }
    });
    hero.addEventListener('mouseleave', () => {
      orbs.forEach(o => o.style.transform = '');
      if (card) card.style.transform = '';
    });
  }

  /* ============================================================
     9. IG posts: tilt sutil al hover (no mobile)
     ============================================================ */
  const posts = $$('.post');
  if (window.matchMedia('(pointer: fine)').matches && !prefersReduced) {
    posts.forEach(p => {
      const max = 3; // grados
      p.addEventListener('mousemove', (e) => {
        const r = p.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        p.style.transform = `scale(1.03) rotateX(${-y * max}deg) rotateY(${x * max}deg)`;
      });
      p.addEventListener('mouseleave', () => { p.style.transform = ''; });
    });
  }

  /* ============================================================
     10. Smooth scroll: compensar sticky nav
     ============================================================ */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      const top = t.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  /* ============================================================
     11. Scrollspy — marca el link activo del nav según la sección visible
     ============================================================ */
  const navLinks = $$('.nav__links a');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const byId = {};
    navLinks.forEach(a => { byId[a.getAttribute('href')] = a; });
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const link = byId['#' + e.target.id];
        if (!link) return;
        navLinks.forEach(a => a.classList.remove('is-current'));
        link.classList.add('is-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    Object.keys(byId).forEach(href => {
      const s = href.length > 1 && document.querySelector(href);
      if (s) spy.observe(s);
    });
  }

  /* ============================================================
     12. Keyboard nav
     ============================================================ */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger && burger.getAttribute('aria-expanded') === 'true') {
      burger.click();
    }
  });

})();
