/* ══════════════════════════════════════════════════════════════
   cursor.js — Cursor personalizado con glow y lerp suavizado
   Portfolio de Joan Ferre Vañó
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* Solo en dispositivos con ratón preciso */
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  /* Crear elemento del cursor */
  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  var mouseX = 0, mouseY = 0;
  var posX   = 0, posY   = 0;
  var visible = false;

  /* Seguir el ratón */
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      /* Primer movimiento: teleportar sin lerp */
      posX = mouseX; posY = mouseY;
      visible = true;
      dot.style.opacity = '1';
    }
  });

  /* Movimiento con lerp — suavidad elegante */
  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    posX = lerp(posX, mouseX, 0.13);
    posY = lerp(posY, mouseY, 0.13);
    dot.style.left = posX + 'px';
    dot.style.top  = posY + 'px';
    requestAnimationFrame(tick);
  }
  /* Iniciar oculto */
  dot.style.opacity = '0';
  requestAnimationFrame(tick);

  /* Efecto hover — expansión y glow al pasar sobre elementos interactivos */
  var hoverSel = 'a, button, .card, .project-card, .social-card, .index-block, .video-card, .skill-chip, .stat-item__num, .index-stat__num';

  function addHover()    { document.body.classList.add('cursor-hover'); }
  function removeHover() { document.body.classList.remove('cursor-hover'); }

  function bind() {
    document.querySelectorAll(hoverSel).forEach(function (el) {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });
  }
  bind();

  /* Ocultar al salir del viewport */
  document.addEventListener('mouseleave', function () { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', function () { dot.style.opacity = '1'; });

  /* API pública para rebindear si el DOM cambia */
  window.rebindCursor = bind;
})();
