/* ══════════════════════════════════════════════════════════════
   main.js — Scroll reveal, stagger, timeline neon, card sweep
   Portfolio de Joan Ferre Vañó
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Scroll reveal y stagger ──────────────────────────── */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.classList.add('is-visible');
      io.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .stagger, .section__head').forEach(function (el) {
    io.observe(el);
  });

  /* ── 2. Destello diagonal en tarjetas al entrar ─────────── */
  var sweepIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.classList.add('card-has-sweep');
      /* Pequeño delay para que la transición de reveal termine */
      setTimeout(function () {
        el.classList.add('sweep-once');
      }, 300);
      sweepIO.unobserve(el);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.project-card, .video-card').forEach(function (el) {
    sweepIO.observe(el);
  });

  /* ── 3. Timeline animado ─────────────────────────────────── */
  /* La línea del timeline crece al hacer scroll usando IntersectionObserver
     sobre cada item individual */
  var tlItems = document.querySelectorAll('.tl-item');
  var tlWrap  = document.querySelector('.timeline-wrap');

  if (tlItems.length) {
    /* Activar la línea cuando el wrapper entra en viewport */
    var tlWrapIO = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        tlWrap.classList.add('is-visible');
        tlWrapIO.disconnect();
      }
    }, { threshold: 0.1 });
    if (tlWrap) tlWrapIO.observe(tlWrap);

    /* Activar cada nodo del timeline con stagger según su posición */
    var tlIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var item = entry.target;
        /* Pequeño delay escalonado según el índice del item */
        var idx = Array.from(tlItems).indexOf(item);
        setTimeout(function () {
          item.classList.add('is-active');
        }, idx * 120);
        tlIO.unobserve(item);
      });
    }, { threshold: 0.3 });

    tlItems.forEach(function (item) { tlIO.observe(item); });
  }

  /* ── 4. Hover 3D en tarjetas de proyectos ───────────────── */
  document.querySelectorAll('.project-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var cx = rect.left + rect.width  / 2;
      var cy = rect.top  + rect.height / 2;
      var rx = ((e.clientY - cy) / rect.height) * -8;
      var ry = ((e.clientX - cx) / rect.width)  *  8;
      card.style.transform = 'perspective(600px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-5px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ── 5. Transición suave entre páginas (fade) ───────────── */
  document.documentElement.style.opacity  = '0';
  document.documentElement.style.transition = 'opacity 0.35s ease';
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.documentElement.style.opacity = '1';
    });
  });

  document.querySelectorAll('a[href]').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || link.target === '_blank') return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var destino = href;
      document.documentElement.style.opacity = '0';
      setTimeout(function () { window.location.href = destino; }, 300);
    });
  });

  /* ── 6. Formulario de contacto ───────────────────────────── */
  var form  = document.getElementById('contact-form');
  var aviso = document.getElementById('form-aviso');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre  = (form.querySelector('#nombre')  || {}).value || '';
      var email   = (form.querySelector('#email')   || {}).value || '';
      var mensaje = (form.querySelector('#mensaje') || {}).value || '';
      if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
        setAviso('Completa todos los campos.', false); return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setAviso('Email no válido.', false); return;
      }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }
      setTimeout(function () {
        if (btn) { btn.disabled = false; btn.textContent = 'Enviar mensaje'; }
        form.reset();
        setAviso('Mensaje enviado. Te respondo pronto.', true);
      }, 1200);
    });
  }
  function setAviso(t, ok) {
    if (!aviso) return;
    aviso.textContent = t;
    aviso.style.color = ok ? '#aaa' : '#666';
  }

  /* ── 7. Año dinámico en el footer ───────────────────────── */
  document.querySelectorAll('.footer__year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

})();
