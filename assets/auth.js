/**
 * CONECTA UNSA — assets/auth.js
 * Gestión de sesión en el frontend.
 *
 * Expone: window.UNSA_AUTH
 *   .getSession()           → { token, user } | null
 *   .getUser()              → user | null
 *   .saveSession(data)      → void
 *   .logout(redirect?)      → void
 *   .protect(roles[])       → redirige a login si no autenticado o rol incorrecto
 *   .api(url, opts)         → fetch autenticado → Promise<data>
 *   .injectUserInfo()       → actualiza nombre/inicial en el DOM
 *
 * Cargar ANTES de Alpine.js en páginas protegidas.
 */

(function () {
  'use strict';

  const SESSION_KEY = 'unsa_session';

  /* ── Helpers internos ── */
  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  }

  function saveSession(data) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    // Exponer en window para que Alpine.js lo use directamente
    window.UNSA_SESSION = data;
    window.UNSA_USER    = data?.user ?? null;
  }

  function logout(redirect) {
    localStorage.removeItem(SESSION_KEY);
    window.UNSA_SESSION = null;
    window.UNSA_USER    = null;
    window.location.href = redirect ?? '../auth/login.html';
  }

  function getUser() {
    return getSession()?.user ?? null;
  }

  /**
   * Protege una ruta. Llámala al inicio de cada página protegida.
   * @param {string[]} roles  Roles permitidos, ej: ['egresado'], ['admin'], ['egresado','admin']
   * @param {string}   redirectTo  URL de login (relativa a la página actual)
   */
  function protect(roles, redirectTo) {
    const session = getSession();
    const loginUrl = redirectTo ?? '../auth/login.html';

    if (!session || !session.token || !session.user) {
      window.location.replace(loginUrl);
      return false;
    }

    if (roles && roles.length > 0 && !roles.includes(session.user.rol)) {
      // Redirigir al dashboard del rol correcto
      const dashboards = {
        egresado:  '../egresado/dashboard.html',
        empleador: '../empleador/dashboard.html',
        admin:     '../admin/panel.html',
      };
      window.location.replace(dashboards[session.user.rol] || loginUrl);
      return false;
    }

    // Sesión válida: exponer globalmente para Alpine.js
    window.UNSA_SESSION = session;
    window.UNSA_USER    = session.user;
    return true;
  }

  /**
   * Fetch autenticado — añade el token en el header Authorization.
   * @param {string} url       URL relativa o absoluta
   * @param {object} opts      Opciones de fetch
   * @returns {Promise<any>}   JSON parseado o lanza error
   */
  async function api(url, opts = {}) {
    const session = getSession();
    const headers = {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    };

    if (session?.token) {
      headers['Authorization'] = 'Bearer ' + session.token;
    }

    const res = await fetch(url, { ...opts, headers });

    if (res.status === 401) {
      logout();
      throw new Error('Sesión expirada');
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error del servidor');
    }

    return data;
  }

  /**
   * Actualiza el nombre del usuario en el sidebar del DOM.
   * Busca elementos con data-user-name, data-user-role, data-user-initial.
   * También actualiza los textos hardcodeados de la demo (Ana Lucia Ramos).
   */
  function injectUserInfo() {
    const user = getUser();
    if (!user) return;

    // Atributos específicos (nuevas páginas)
    document.querySelectorAll('[data-user-name]').forEach(el => { el.textContent = user.nombre; });
    document.querySelectorAll('[data-user-role]').forEach(el => {
      el.textContent = user.carrera || user.empresa || user.cargo || '';
    });
    document.querySelectorAll('[data-user-initial]').forEach(el => { el.textContent = user.avatar_initial || user.nombre.charAt(0); });
    document.querySelectorAll('[data-user-short]').forEach(el => { el.textContent = user.nombre_corto || user.nombre.split(' ')[0]; });

    // Reemplaza textos hardcodeados del prototipo en nodos de texto hoja
    const DEMO_NAMES = ['Ana Lucia Ramos Torres', 'Ana Lucia Ramos', 'Ana Lucia'];
    const DEMO_ROLES = ['Ing. de Sistemas'];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const t = node.textContent.trim();
      if (DEMO_NAMES.includes(t)) node.textContent = user.nombre;
      else if (DEMO_ROLES.includes(t) && user.carrera) node.textContent = user.carrera;
    }

    // Avatar inicial (texto dentro de .avatar-sm)
    document.querySelectorAll('.avatar-sm').forEach(el => {
      if (['A', 'LF', 'M', 'R'].includes(el.textContent.trim())) {
        el.textContent = user.avatar_initial || user.nombre.charAt(0);
      }
    });
  }

  /* ── Exponer la API pública ── */
  window.UNSA_AUTH = {
    getSession,
    getUser,
    saveSession,
    logout,
    protect,
    api,
    injectUserInfo,
  };

  /* ── Inicializar sesión en window en cuanto se carga el script ── */
  const _s = getSession();
  if (_s) {
    window.UNSA_SESSION = _s;
    window.UNSA_USER    = _s.user;
  }

  /* ── Inyectar info de usuario al cargar el DOM ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectUserInfo);
  } else {
    // DOM ya listo (script cargado con defer)
    injectUserInfo();
  }

})();
