/* ══════════════════════════════════════════════════════════════
   main.js — Scroll reveal, stagger, timeline, formulario
   Portfolio profesional de Joan Ferre Vañó
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. IntersectionObserver para .reveal y .stagger ─────── */
  var observables = document.querySelectorAll('.reveal, .stagger, .section__head, .timeline-item');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    observables.forEach(function (el) { io.observe(el); });
  } else {
    /* Fallback navegadores sin soporte */
    observables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ── 2. Hover 3D en tarjetas de proyectos ────────────────── */
  document.querySelectorAll('.card-3d').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var cx   = rect.left + rect.width  / 2;
      var cy   = rect.top  + rect.height / 2;
      var rx   = ((e.clientY - cy) / rect.height) * -10;
      var ry   = ((e.clientX - cx) / rect.width)  *  10;
      card.style.transform = 'perspective(600px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-5px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ── 3. Año dinámico en el footer ────────────────────────── */
  var anoEl = document.querySelector('.footer__year');
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  /* ── 4. Formulario de contacto ───────────────────────────── */
  var form  = document.getElementById('contact-form');
  var aviso = document.getElementById('form-aviso');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nombre  = (form.querySelector('#nombre')  || {}).value || '';
      var email   = (form.querySelector('#email')   || {}).value || '';
      var mensaje = (form.querySelector('#mensaje') || {}).value || '';

      if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
        setAviso('Por favor, completa todos los campos.', false);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setAviso('Introduce un email válido.', false);
        return;
      }

      var boton = form.querySelector('button[type="submit"]');
      if (boton) { boton.disabled = true; boton.textContent = 'Enviando...'; }

      /* Simulación — en producción reemplazar con fetch() a un endpoint real */
      setTimeout(function () {
        if (boton) { boton.disabled = false; boton.textContent = 'Enviar mensaje'; }
        form.reset();
        setAviso('Mensaje enviado. Te respondo pronto.', true);
      }, 1200);
    });
  }

  function setAviso(texto, ok) {
    if (!aviso) return;
    aviso.textContent = texto;
    aviso.style.color = ok ? '#aaa' : '#777';
  }

  /* ── 5. Transición suave entre páginas ───────────────────── */
  var overlay = document.querySelector('.page-transition-overlay');

  /* Fade-in al cargar la página */
  document.documentElement.style.opacity = '0';
  document.documentElement.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.documentElement.style.opacity = '1';
    });
  });

  /* Fade-out al hacer clic en links internos */
  document.querySelectorAll('a[href]').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    /* Solo links a páginas del portfolio (sin # ni externos) */
    if (href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || link.target === '_blank') return;

    link.addEventListener('click', function (e) {
      e.preventDefault();
      var destino = href;
      document.documentElement.style.opacity = '0';
      setTimeout(function () {
        window.location.href = destino;
      }, 320);
    });
  });

})();
