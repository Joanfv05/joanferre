/* ══════════════════════════════════════════════════════════════
   nav.js — Navbar, hamburguesa, página activa, scroll suave
   Portfolio de Joan Ferre Vañó
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var navbar = document.getElementById('navbar');
  var burger = document.getElementById('nav-burger');
  var mobile = document.getElementById('nav-mobile');
  var mLinks = mobile ? mobile.querySelectorAll('a') : [];

  /* ── Clase is-scrolled en el navbar ─────────────────────── */
  function checkScroll() {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();

  /* ── Menú hamburguesa ────────────────────────────────────── */
  function abrir()  {
    if (!mobile) return;
    mobile.classList.add('is-open');
    if (burger) burger.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function cerrar() {
    if (!mobile) return;
    mobile.classList.remove('is-open');
    if (burger) burger.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (burger) burger.addEventListener('click', function () {
    mobile.classList.contains('is-open') ? cerrar() : abrir();
  });
  mLinks.forEach(function (l) { l.addEventListener('click', cerrar); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });

  /* ── Página activa ───────────────────────────────────────── */
  var pagina = window.location.pathname.split('/').pop() || 'index.html';
  var esInicio = (pagina === 'index.html' || pagina === '' || pagina === '/');

  document.querySelectorAll('.navbar__link, .nav-mobile a').forEach(function (link) {
    var href = (link.getAttribute('href') || '').split('/').pop();
    var linkEsInicio = (href === 'index.html' || href === '' || href === '#');
    if (href === pagina || (esInicio && linkEsInicio)) {
      link.classList.add('is-active');
    }
  });

  /* ── Scroll suave para anclajes ─────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var destino = document.querySelector(this.getAttribute('href'));
      if (!destino) return;
      e.preventDefault();
      destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      cerrar();
    });
  });

})();
