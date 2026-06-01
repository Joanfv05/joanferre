/* ══════════════════════════════════════════════════════════════
   cursor.js — Cursor personalizado
   Portfolio profesional de Joan Ferre Vañó
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* Solo activo en dispositivos con puntero preciso (ratón) */
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  /* Crear elementos del cursor */
  var dot  = document.createElement('div');
  var ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  var mouseX = 0, mouseY = 0;
  var ringX  = 0, ringY  = 0;

  /* Seguir el ratón con el punto de forma inmediata */
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  /* El anillo sigue con suavidad mediante lerp */
  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    ringX = lerp(ringX, mouseX, 0.1);
    ringY = lerp(ringY, mouseY, 0.1);
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* Efecto hover sobre elementos interactivos */
  var hoverTargets = 'a, button, .card, .project-card, .social-card, .index-block, .video-card, .skill-chip';

  function addHover()    { document.body.classList.add('cursor-hover'); }
  function removeHover() { document.body.classList.remove('cursor-hover'); }

  function bindHoverTargets() {
    document.querySelectorAll(hoverTargets).forEach(function (el) {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });
  }
  bindHoverTargets();

  /* Ocultar cursor al salir del viewport */
  document.addEventListener('mouseleave', function () {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });

  /* Re-bind si el DOM cambia (por si acaso) */
  window.rebindCursor = bindHoverTargets;

})();
