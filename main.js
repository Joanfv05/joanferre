/* ============================================================
   JOAN FERRER — Portfolio JS
   ============================================================ */

(function() {
  'use strict';

  // ── NAV scroll state ────────────────────────────────────────
  const nav = document.getElementById('nav');

  function handleNavScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ── Mobile nav burger ────────────────────────────────────────
  const burger = document.querySelector('.nav-burger');
  const navLinks = document.querySelector('.nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });
  }

  // ── Reel modal ────────────────────────────────────────────────
  const modal = document.getElementById('reelModal');
  const playBtn = document.getElementById('playReelBtn');
  const closeBtn = document.getElementById('closeModal');
  const backdrop = document.getElementById('modalBackdrop');
  const reelIframe = document.getElementById('reelIframe');

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Load iframe src on open
    if (reelIframe && reelIframe.dataset.src) {
      reelIframe.src = reelIframe.dataset.src;
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // Stop video by clearing src
    if (reelIframe) {
      reelIframe.src = '';
    }
  }

  if (playBtn) playBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // ── Video filter ──────────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const vcards = document.querySelectorAll('.vcard[data-cat]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      vcards.forEach(card => {
        if (filter === 'all' || card.dataset.cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ── Scroll reveal ─────────────────────────────────────────────
  function initReveal() {
    const revealEls = document.querySelectorAll(
      '.section-header, .vcard, .dev-card, .about-layout, .contact-inner'
    );

    revealEls.forEach((el, i) => {
      el.classList.add('reveal');
      if (i % 3 === 1) el.classList.add('reveal-delay-1');
      if (i % 3 === 2) el.classList.add('reveal-delay-2');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealEls.forEach(el => observer.observe(el));
  }

  // ── Cursor sparkle (subtle, desktop only) ────────────────────
  function initCursorTrail() {
    if (window.innerWidth < 768) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9999;opacity:0.35';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let W, H;
    const particles = [];
    let mx = -999, my = -999;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (Math.random() > 0.65) return;
      particles.push({
        x: mx,
        y: my,
        r: Math.random() * 1.5 + 0.5,
        life: 1,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
      });
      if (particles.length > 80) particles.splice(0, 10);
    }, { passive: true });

    function loop() {
      ctx.clearRect(0, 0, W, H);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.035;
        p.x += p.vx;
        p.y += p.vy;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 168, 74, ${p.life * 0.6})`;
        ctx.fill();
      }
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }

  // ── Init ──────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initCursorTrail();
  });

  // DOMContentLoaded may have already fired
  if (document.readyState !== 'loading') {
    initReveal();
    initCursorTrail();
  }

})();
