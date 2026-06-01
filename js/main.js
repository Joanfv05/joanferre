/* ─────────────────────────────────────────────────────────────
   main.js — Scroll animations e interacciones generales
   Portfolio de Joan Ferré Vañó
   ───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── 1. Reveal al hacer scroll (IntersectionObserver) ─────── */
  var elementosReveal = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Dejar de observar una vez visible (animación de una sola vez)
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,     // se activa cuando el 12% del elemento es visible
        rootMargin: '0px 0px -40px 0px' // un poco antes del borde inferior
      }
    );

    elementosReveal.forEach(function (el) {
      observer.observe(el);
    });

  } else {
    // Fallback para navegadores sin soporte: mostrar todo directamente
    elementosReveal.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ── 2. Formulario de contacto ───────────────────────────── */
  var form   = document.getElementById('contact-form');
  var aviso  = document.getElementById('form-aviso');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validación básica
      var nombre  = form.querySelector('#nombre').value.trim();
      var email   = form.querySelector('#email').value.trim();
      var mensaje = form.querySelector('#mensaje').value.trim();

      if (!nombre || !email || !mensaje) {
        mostrarAviso('Por favor, rellena todos los campos.', false);
        return;
      }

      if (!esEmailValido(email)) {
        mostrarAviso('Introduce un email válido.', false);
        return;
      }

      // Simula el envío (sin backend)
      // Para producción: reemplazar por fetch() a un endpoint real o Formspree
      var boton = form.querySelector('button[type="submit"]');
      boton.disabled = true;
      boton.textContent = 'Enviando...';

      setTimeout(function () {
        boton.disabled = false;
        boton.textContent = 'Enviar mensaje';
        form.reset();
        mostrarAviso('Mensaje enviado. Te respondo pronto.', true);
      }, 1200);
    });
  }

  /* Muestra el aviso del formulario */
  function mostrarAviso(texto, exito) {
    if (!aviso) return;
    aviso.textContent = texto;
    aviso.style.color = exito ? '#f4f4f4' : '#999';
    aviso.classList.remove('is-visible');
    // Forzar reflow para reiniciar la animación
    void aviso.offsetWidth;
    aviso.classList.add('is-visible');
  }

  /* Validación básica de email */
  function esEmailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ── 3. Año dinámico en el footer ───────────────────────── */
  var anoEl = document.querySelector('.footer p');
  if (anoEl) {
    var ano = new Date().getFullYear();
    anoEl.textContent = '© ' + ano + ' Joan Ferré Vañó';
  }

})();
