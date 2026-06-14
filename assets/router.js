/**
 * CONECTA UNSA — router.js
 * Sistema de transiciones suaves entre páginas (MPA).
 * Intercepta clicks en <a href="*.html"> y aplica animación de salida/entrada.
 * Compatible con todos los navegadores modernos via View Transitions API,
 * con fallback CSS para los que no la soportan.
 *
 * Importar DESPUÉS de Alpine.js en todos los HTML:
 *   <script src="../assets/router.js"></script>  (o assets/router.js en raíz)
 */

(function () {
  'use strict';

  /* ── Constantes ── */
  const TRANSITION_DURATION = 220; // ms
  const CURRENT_PATH = window.location.pathname.split('/').pop() || 'index.html';

  /* ── CSS de transición inyectado una sola vez ── */
  const style = document.createElement('style');
  style.textContent = `
    /* Animación de salida de página */
    @keyframes pageOut {
      from { opacity: 1; transform: translateY(0) scale(1); }
      to   { opacity: 0; transform: translateY(-12px) scale(0.985); }
    }
    /* Animación de entrada de página */
    @keyframes pageIn {
      from { opacity: 0; transform: translateY(14px) scale(0.985); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    body.page-leaving {
      animation: pageOut ${TRANSITION_DURATION}ms cubic-bezier(0.4,0,0.2,1) forwards;
      pointer-events: none;
    }
    body.page-entering {
      animation: pageIn ${TRANSITION_DURATION}ms cubic-bezier(0.4,0,0.2,1) forwards;
    }

    /* Active nav state highlight para link actual */
    .sidebar-link[data-current="true"],
    .admin-nav-link[data-current="true"] {
      background-color: var(--color-primary) !important;
      color: #fff !important;
    }

    /* Progress bar de carga en la parte superior */
    #unsa-progress {
      position: fixed; top: 0; left: 0; z-index: 99999;
      height: 3px; width: 0%; background: var(--color-primary);
      transition: width 0.25s ease, opacity 0.3s ease;
      border-radius: 0 2px 2px 0;
      box-shadow: 0 0 8px rgba(192,57,43,0.6);
    }
    #unsa-progress.active { opacity: 1; }
    #unsa-progress.done   { width: 100% !important; opacity: 0; }
  `;
  document.head.appendChild(style);

  /* ── Progress bar ── */
  const bar = document.createElement('div');
  bar.id = 'unsa-progress';
  document.body.prepend(bar);

  function progressStart() {
    bar.style.width = '0%';
    bar.classList.add('active');
    bar.classList.remove('done');
    // Simular progreso
    let w = 0;
    bar._timer = setInterval(() => {
      w = Math.min(w + Math.random() * 15, 85);
      bar.style.width = w + '%';
    }, 80);
  }

  function progressDone() {
    clearInterval(bar._timer);
    bar.classList.add('done');
  }

  /* ── Marca el link actual como activo ── */
  function markCurrentLinks() {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href').split('/').pop().split('?')[0];
      if (href === CURRENT_PATH) {
        a.setAttribute('data-current', 'true');
      }
    });
  }

  /* ── Navegación con transición ── */
  function navigateTo(url) {
    // Usar View Transitions API si está disponible
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        window.location.href = url;
      });
      return;
    }

    // Fallback: animación CSS manual
    progressStart();
    document.body.classList.add('page-leaving');

    setTimeout(() => {
      window.location.href = url;
    }, TRANSITION_DURATION);
  }

  /* ── Interceptar clicks ── */
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href]');
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href) return;

    // Solo interceptar links .html internos (no mailto, no #, no externo)
    const isInternal = (
      href.endsWith('.html') ||
      href.includes('.html?') ||
      href.includes('.html#')
    );
    const isExternal = href.startsWith('http') || href.startsWith('//');
    const isAnchor   = href.startsWith('#');
    const hasModifier = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

    if (!isInternal || isExternal || isAnchor || hasModifier) return;

    // No animar si es la misma página
    const targetPage = href.split('/').pop().split('?')[0];
    if (targetPage === CURRENT_PATH) return;

    e.preventDefault();
    navigateTo(href);
  }, true);

  /* ── Animación de entrada al cargar ── */
  window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-entering');
    setTimeout(() => document.body.classList.remove('page-entering'), TRANSITION_DURATION + 50);
    markCurrentLinks();
    progressDone();
  });

  /* ── Back/Forward del navegador ── */
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      document.body.classList.remove('page-leaving');
      document.body.classList.add('page-entering');
      setTimeout(() => document.body.classList.remove('page-entering'), TRANSITION_DURATION + 50);
    }
  });

})();
