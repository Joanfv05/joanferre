/* ─────────────────────────────────────────────────────────────
   nav.js — Lógica del navbar y menú móvil
   Portfolio de Joan Ferré Vañó
   ───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  var navbar    = document.getElementById('navbar');
  var toggle    = document.getElementById('nav-toggle');
  var overlay   = document.getElementById('nav-overlay');
  var closeBtn  = document.getElementById('nav-close');
  var navLinks  = overlay ? overlay.querySelectorAll('.nav-overlay__link') : [];

  /* ── Clase is-scrolled en el navbar ─────────────────────── */
  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // comprueba el estado al cargar

  /* ── Abrir menú móvil ────────────────────────────────────── */
  function abrirMenu() {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // bloquea el scroll
    toggle.setAttribute('aria-expanded', 'true');
  }

  /* ── Cerrar menú móvil ───────────────────────────────────── */
  function cerrarMenu() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle)   toggle.addEventListener('click', abrirMenu);
  if (closeBtn) closeBtn.addEventListener('click', cerrarMenu);

  /* Cerrar al hacer clic en cualquier link del overlay */
  navLinks.forEach(function (link) {
    link.addEventListener('click', cerrarMenu);
  });

  /* Cerrar con la tecla Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      cerrarMenu();
    }
  });

  /* ── Scroll suave a la sección al hacer clic ─────────────── */
  // Los links de anclaje ya usan scroll-behavior:smooth vía CSS,
  // pero este listener asegura el comportamiento en Safari antiguo.
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var destino = document.querySelector(this.getAttribute('href'));
      if (!destino) return;
      e.preventDefault();
      destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

})();
