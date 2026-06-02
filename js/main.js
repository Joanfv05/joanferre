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

  document.querySelectorAll('.project-card, .video-card, .tl-card').forEach(function (el) {
    sweepIO.observe(el);
  });

  /* ── 3. Timeline animado ─────────────────────────────────── */
  /* La línea del timeline crece al hacer scroll usando IntersectionObserver
     sobre cada item individual */
  var tlItems = document.querySelectorAll('.tl-item');
  var tlWraps = document.querySelectorAll('.timeline-wrap');

  if (tlItems.length) {
    /* Activar la línea de cada wrapper cuando entra en viewport */
    var tlWrapIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          tlWrapIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    tlWraps.forEach(function (wrap) { tlWrapIO.observe(wrap); });

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

  /* ── 4. Hover 3D en tarjetas ────────────────────────────── */
  document.querySelectorAll('.project-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      card.style.transition = 'border-color 0.3s, box-shadow 0.35s';
    });
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var rx = ((e.clientY - cy) / rect.height) * -8;
      var ry = ((e.clientX - cx) / rect.width) * 8;
      card.style.transform = 'perspective(600px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-5px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.transition = '';
    });
  });

  /* ── 5. Transición suave entre páginas (fade) ───────────── */
  document.documentElement.style.opacity = '0';
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

  /* ── 6. Año dinámico en el footer ───────────────────────── */
  document.querySelectorAll('.footer__year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ── 7. Formulario de contacto — Anti-spam + Formspree ───── */
  var form  = document.getElementById('contact-form');
  var aviso = document.getElementById('form-aviso');

  if (form && aviso) {

    /* ── Configuración anti-spam ──────────────────────────── */
    var COOLDOWN_MS       = 90  * 1000;   // 90 s mínimo entre envíos
    var BLOCK_COUNT       = 3;            // envíos que activan el bloqueo
    var BLOCK_WINDOW_MS   = 2   * 60 * 1000; // ventana para detectarlos (2 min)
    var BLOCK_DURATION_MS = 15  * 60 * 1000; // duración del bloqueo (15 min)
    var BTN_COOLDOWN_S    = 60;           // segundos que el botón queda deshabilitado

    /* Pon TURNSTILE_ENABLED = true cuando añadas el widget en el HTML */
    var TURNSTILE_ENABLED = false;

    var LS_LAST  = 'jfv_form_last';   // timestamp del último envío OK
    var LS_TIMES = 'jfv_form_times';  // array JSON de envíos recientes
    var LS_BLOCK = 'jfv_form_block';  // timestamp hasta el que está bloqueado

    /* ── Helpers localStorage (con try/catch por modo privado) */
    function lsGet(k)    { try { return localStorage.getItem(k); }    catch(e) { return null; } }
    function lsSet(k, v) { try { localStorage.setItem(k, v); }        catch(e) {} }
    function getTimes() {
      try { return JSON.parse(lsGet(LS_TIMES) || '[]'); } catch(e) { return []; }
    }

    /* ── Estado actual ─────────────────────────────────────── */
    function isBlocked() {
      return Date.now() < parseInt(lsGet(LS_BLOCK) || '0', 10);
    }
    function blockRemainSecs() {
      return Math.ceil((parseInt(lsGet(LS_BLOCK) || '0', 10) - Date.now()) / 1000);
    }
    function cooldownRemainSecs() {
      var last = parseInt(lsGet(LS_LAST) || '0', 10);
      return Math.max(0, Math.ceil((COOLDOWN_MS - (Date.now() - last)) / 1000));
    }

    /* ── Registrar envío y activar bloqueo si procede ──────── */
    function recordSubmit() {
      var now   = Date.now();
      var times = getTimes().filter(function(t) { return now - t < BLOCK_WINDOW_MS; });
      times.push(now);
      lsSet(LS_LAST,  now);
      lsSet(LS_TIMES, JSON.stringify(times));
      if (times.length >= BLOCK_COUNT) {
        lsSet(LS_BLOCK, now + BLOCK_DURATION_MS);
      }
    }

    /* ── Countdown visual en el botón ──────────────────────── */
    function startBtnCooldown(btn, secs) {
      btn.disabled    = true;
      btn.textContent = 'Espera ' + secs + 's…';
      var t = setInterval(function() {
        secs--;
        if (secs <= 0) {
          clearInterval(t);
          btn.disabled    = false;
          btn.textContent = 'Enviar mensaje';
        } else {
          btn.textContent = 'Espera ' + secs + 's…';
        }
      }, 1000);
    }

    /* ── Validación de campos ──────────────────────────────── */
    function validateFields() {
      var nombre  = (form.querySelector('#nombre')  || {}).value || '';
      var email   = (form.querySelector('#email')   || {}).value || '';
      var asunto  = (form.querySelector('#asunto')  || {}).value || '';
      var mensaje = (form.querySelector('#mensaje') || {}).value || '';
      nombre  = nombre.trim();
      email   = email.trim();
      asunto  = asunto.trim();
      mensaje = mensaje.trim();

      if (!nombre || !email || !asunto || !mensaje)
        return '✗ Completa todos los campos obligatorios.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return '✗ El email no tiene un formato válido.';
      if (nombre.length < 2)
        return '✗ El nombre es demasiado corto.';
      if (mensaje.length < 10)
        return '✗ El mensaje es demasiado corto (mín. 10 caracteres).';
      return null; // todo OK
    }

    /* ── Helper para mostrar avisos ────────────────────────── */
    function setAviso(msg, color) {
      aviso.textContent = msg;
      aviso.style.color = color || '';
    }

    /* ── Submit handler ────────────────────────────────────── */
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      var btn = document.getElementById('form-submit-btn');

      /* 1 · Honeypot — campo oculto que solo rellenan los bots */
      var hp = form.querySelector('[name="website"]');
      if (hp && hp.value !== '') {
        /* Simular éxito sin enviar nada real */
        setAviso('✓ Mensaje enviado. Te respondo pronto.', '');
        form.reset();
        return;
      }

      /* 2 · Bloqueo por ráfaga de envíos */
      if (isBlocked()) {
        var mins = Math.ceil(blockRemainSecs() / 60);
        setAviso('⛔ Demasiados envíos. Espera ' + mins + ' min.', '#ff6b6b');
        return;
      }

      /* 3 · Cooldown entre envíos */
      var wait = cooldownRemainSecs();
      if (wait > 0) {
        setAviso('⏳ Espera ' + wait + 's antes del próximo envío.', '#ffd080');
        return;
      }

      /* 4 · Validación de campos */
      var err = validateFields();
      if (err) { setAviso(err, '#ff6b6b'); return; }

      /* 5 · Cloudflare Turnstile (si está activado) */
      if (TURNSTILE_ENABLED) {
        var token = form.querySelector('[name="cf-turnstile-response"]');
        if (!token || !token.value) {
          setAviso('✗ Completa el captcha antes de enviar.', '#ff6b6b');
          return;
        }
      }

      /* 6 · Enviar a Formspree */
      if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
      setAviso('', '');

      try {
        var res = await fetch('https://formspree.io/f/xvzyeobb', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });

        if (res.ok) {
          recordSubmit();  // registrar SOLO los envíos que llegan a Formspree
          setAviso('✓ Mensaje enviado. Te respondo pronto.', '');
          form.reset();
          /* Resetear Turnstile si está activo */
          if (TURNSTILE_ENABLED && window.turnstile) window.turnstile.reset();
          if (btn) startBtnCooldown(btn, BTN_COOLDOWN_S);
        } else {
          throw new Error('HTTP ' + res.status);
        }
      } catch(fetchErr) {
        setAviso('✗ Error al enviar. Escríbeme directamente al email.', '#ff6b6b');
        if (btn) { btn.disabled = false; btn.textContent = 'Enviar mensaje'; }
      }
    });
  }

})();
