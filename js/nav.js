/* ══════════════════════════════════════════════════════════════
   nav.js — Navbar fijo, hamburguesa, página activa
   Portfolio profesional de Joan Ferre Vañó
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var navbar  = document.getElementById('navbar');
  var burger  = document.getElementById('nav-burger');
  var mobile  = document.getElementById('nav-mobile');
  var mLinks  = mobile ? mobile.querySelectorAll('a') : [];

  /* ── Clase is-scrolled ──────────────────────────────────── */
  function checkScroll() {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();

  /* ── Menú hamburguesa ────────────────────────────────────── */
  function abrirMobile() {
    if (!mobile) return;
    mobile.classList.add('is-open');
    if (burger) burger.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function cerrarMobile() {
    if (!mobile) return;
    mobile.classList.remove('is-open');
    if (burger) burger.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (burger) burger.addEventListener('click', function () {
    mobile.classList.contains('is-open') ? cerrarMobile() : abrirMobile();
  });

  /* Cerrar al hacer clic en un link del menú móvil */
  mLinks.forEach(function (link) {
    link.addEventListener('click', cerrarMobile);
  });

  /* Cerrar con Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cerrarMobile();
  });

  /* ── Indicador de página activa ──────────────────────────── */
  /* Detecta la página actual por la URL y marca el link activo */
  var pagina = window.location.pathname.split('/').pop() || 'index.html';

  /* Links del navbar de escritorio */
  var navLinks = document.querySelectorAll('.navbar__link, .nav-mobile a');
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href') || '';
    var linkPagina = href.split('/').pop();

    /* Caso especial: inicio puede ser index.html o '' o '/' */
    var esInicio = (pagina === 'index.html' || pagina === '' || pagina === '/');
    var linkEsInicio = (linkPagina === 'index.html' || linkPagina === '' || linkPagina === '#');

    if (linkPagina === pagina || (esInicio && linkEsInicio)) {
      link.classList.add('is-active');
    }
  });

  /* ── Scroll suave para anclajes dentro de la misma página ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var destino = document.querySelector(this.getAttribute('href'));
      if (!destino) return;
      e.preventDefault();
      destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      cerrarMobile();
    });
  });

})();
