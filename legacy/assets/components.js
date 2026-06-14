/**
 * CONECTA UNSA — components.js
 * Componentes Alpine.js reutilizables.
 * Importar DESPUÉS de Alpine.js CDN y ANTES de que Alpine arrange:
 *   <script src="assets/components.js"></script>
 *   <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
 *
 * O bien con el defer de Alpine, asegurarse de que components.js se carga
 * ANTES del script de Alpine CDN en el HTML.
 */

document.addEventListener('alpine:init', () => {

  /* ==========================================================
     1. TOAST MANAGER
     Notificaciones temporales relativas al contenedor padre.

     Uso en HTML:
       <div x-data="toastManager" style="position:relative">
         <!-- contenido de la página -->
         <div class="toast-container">
           <template x-for="toast in toasts" :key="toast.id">
             <div class="toast" :class="'toast-' + toast.tipo" x-show="toast.visible"
                  x-transition:enter="transition ease-out duration-200"
                  x-transition:enter-start="opacity-0 translate-y-2"
                  x-transition:enter-end="opacity-100 translate-y-0"
                  x-transition:leave="transition ease-in duration-150"
                  x-transition:leave-end="opacity-0">
               <span x-text="toast.mensaje"></span>
             </div>
           </template>
         </div>
         <button @click="showToast('success','Guardado correctamente')">Guardar</button>
       </div>
     ========================================================== */
  Alpine.data('toastManager', () => ({
    toasts: [],
    _nextId: 1,

    /**
     * Muestra un toast.
     * @param {'success'|'error'|'info'} tipo
     * @param {string} mensaje
     * @param {number} [duracion=3000] ms antes de desaparecer
     */
    showToast(tipo = 'info', mensaje = '', duracion = 3000) {
      const id = this._nextId++;
      const toast = { id, tipo, mensaje, visible: true };
      this.toasts.push(toast);

      setTimeout(() => {
        const item = this.toasts.find(t => t.id === id);
        if (item) item.visible = false;

        // Limpiar del array después de la animación de salida
        setTimeout(() => {
          this.toasts = this.toasts.filter(t => t.id !== id);
        }, 300);
      }, duracion);
    },

    dismissToast(id) {
      const item = this.toasts.find(t => t.id === id);
      if (item) {
        item.visible = false;
        setTimeout(() => {
          this.toasts = this.toasts.filter(t => t.id !== id);
        }, 300);
      }
    },
  }));

  /* ==========================================================
     2. MODAL MANAGER
     Overlay semitransparente con panel centrado.
     - Cierre con tecla Escape
     - Cierre al hacer click en el overlay
     - Trampa de foco dentro del modal

     Uso en HTML:
       <div x-data="modalManager">
         <button @click="openModal('confirm')">Abrir modal</button>

         <!-- Overlay -->
         <div class="modal-overlay" x-show="isOpen" x-cloak
              @keydown.escape.window="closeModal()"
              @click.self="closeModal()"
              x-transition:enter="transition ease-out duration-200"
              x-transition:enter-start="opacity-0"
              x-transition:enter-end="opacity-100"
              x-transition:leave="transition ease-in duration-150"
              x-transition:leave-end="opacity-0">
           <div class="modal-panel" x-show="activeModal === 'confirm'"
                x-trap="isOpen"
                role="dialog" aria-modal="true" tabindex="-1">
             <div class="modal-header">
               <h2 class="section-title mb-0">Confirmar acción</h2>
               <button @click="closeModal()" aria-label="Cerrar">✕</button>
             </div>
             <div class="modal-body">
               <p x-text="modalData.mensaje"></p>
             </div>
             <div class="modal-footer">
               <button class="btn-outline" @click="closeModal()">Cancelar</button>
               <button class="btn-primary" @click="confirmAction()">Confirmar</button>
             </div>
           </div>
         </div>
       </div>
     ========================================================== */
  Alpine.data('modalManager', () => ({
    isOpen:      false,
    activeModal: null,
    modalData:   {},
    _onConfirm:  null,

    openModal(name, data = {}, onConfirm = null) {
      this.activeModal = name;
      this.modalData   = data;
      this._onConfirm  = onConfirm;
      this.isOpen      = true;

      // Bloquear scroll del body
      document.body.style.overflow = 'hidden';

      // Focus al panel tras el siguiente tick
      this.$nextTick(() => {
        const panel = document.querySelector('.modal-panel');
        if (panel) panel.focus();
      });
    },

    closeModal() {
      this.isOpen      = false;
      this._onConfirm  = null;
      document.body.style.overflow = '';

      // Pequeña espera para que termine la transición antes de limpiar
      setTimeout(() => {
        this.activeModal = null;
        this.modalData   = {};
      }, 200);
    },

    confirmAction() {
      if (typeof this._onConfirm === 'function') {
        this._onConfirm(this.modalData);
      }
      this.closeModal();
    },

    /** Detecta Escape aunque el focus no esté en el overlay */
    init() {
      this._escListener = (e) => {
        if (e.key === 'Escape' && this.isOpen) this.closeModal();
      };
      window.addEventListener('keydown', this._escListener);
    },

    destroy() {
      window.removeEventListener('keydown', this._escListener);
    },
  }));

  /* ==========================================================
     3. SIDEBAR MANAGER
     - Toggle abierto/cerrado en mobile
     - Estado persistido en localStorage para desktop
     - Overlay al abrir en mobile

     Uso en HTML:
       <div x-data="sidebarManager" class="flex">
         <!-- Overlay mobile -->
         <div class="sidebar-overlay" :class="{ open: isOpen && isMobile }"
              @click="close()" x-cloak></div>

         <!-- Sidebar -->
         <aside class="sidebar" :class="{ open: isOpen }" id="sidebar">
           <nav class="sidebar-nav">
             <a class="sidebar-link" :class="{ active: currentPage === 'dashboard' }"
                @click="setPage('dashboard')">Dashboard</a>
             <a class="sidebar-link" :class="{ active: currentPage === 'empleos' }"
                @click="setPage('empleos')">Empleos</a>
           </nav>
         </aside>

         <!-- Main content -->
         <main style="flex:1; padding:24px">
           <button @click="toggle()" aria-label="Abrir menú">☰ Menú</button>
           <p>Contenido...</p>
         </main>
       </div>
     ========================================================== */
  Alpine.data('sidebarManager', (defaultOpen = true) => ({
    isOpen:      false,
    isMobile:    false,
    currentPage: '',
    _mq:         null,

    init() {
      this._mq = window.matchMedia('(max-width: 768px)');
      this.isMobile = this._mq.matches;

      this._mqHandler = (e) => {
        this.isMobile = e.matches;
        if (!e.matches) {
          // En desktop: restaurar desde localStorage
          const saved = localStorage.getItem('unsa_sidebar_open');
          this.isOpen = saved !== null ? saved === 'true' : defaultOpen;
        } else {
          // En mobile: siempre cerrado al cambiar a viewport pequeño
          this.isOpen = false;
        }
      };

      this._mq.addEventListener('change', this._mqHandler);

      // Estado inicial
      if (this.isMobile) {
        this.isOpen = false;
      } else {
        const saved = localStorage.getItem('unsa_sidebar_open');
        this.isOpen = saved !== null ? saved === 'true' : defaultOpen;
      }
    },

    destroy() {
      if (this._mq) this._mq.removeEventListener('change', this._mqHandler);
    },

    toggle() {
      this.isOpen = !this.isOpen;
      if (!this.isMobile) {
        localStorage.setItem('unsa_sidebar_open', String(this.isOpen));
      }
    },

    open() {
      this.isOpen = true;
      if (!this.isMobile) localStorage.setItem('unsa_sidebar_open', 'true');
    },

    close() {
      this.isOpen = false;
      if (!this.isMobile) localStorage.setItem('unsa_sidebar_open', 'false');
    },

    setPage(page) {
      this.currentPage = page;
      // En mobile, cerrar el sidebar al navegar
      if (this.isMobile) this.close();
    },
  }));

  /* ==========================================================
     4. TABS MANAGER
     - Tabs navegables sin recarga
     - Contenido con x-show
     - Acepta parámetro de tab activo inicial

     Uso en HTML:
       <div x-data="tabsManager('perfil')">
         <!-- Tab list -->
         <div class="tabs-list" role="tablist">
           <button class="tab-btn" :class="{ active: activeTab === 'perfil' }"
                   @click="setTab('perfil')" role="tab"
                   :aria-selected="activeTab === 'perfil'">Perfil</button>
           <button class="tab-btn" :class="{ active: activeTab === 'empleos' }"
                   @click="setTab('empleos')" role="tab"
                   :aria-selected="activeTab === 'empleos'">Empleos</button>
           <button class="tab-btn" :class="{ active: activeTab === 'estadisticas' }"
                   @click="setTab('estadisticas')" role="tab"
                   :aria-selected="activeTab === 'estadisticas'">Estadísticas</button>
         </div>

         <!-- Tab panels -->
         <div x-show="activeTab === 'perfil'" role="tabpanel">
           <p>Contenido del perfil...</p>
         </div>
         <div x-show="activeTab === 'empleos'" role="tabpanel">
           <p>Listado de empleos...</p>
         </div>
         <div x-show="activeTab === 'estadisticas'" role="tabpanel">
           <p>Gráficas y métricas...</p>
         </div>
       </div>
     ========================================================== */
  Alpine.data('tabsManager', (initialTab = '') => ({
    activeTab: initialTab,
    history:   [],

    init() {
      // Si se pasa tab en query string (?tab=empleos) toma prioridad
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) this.activeTab = tabParam;
    },

    setTab(tab) {
      if (this.activeTab === tab) return;
      this.history.push(this.activeTab);
      this.activeTab = tab;
    },

    goBack() {
      const prev = this.history.pop();
      if (prev !== undefined) this.activeTab = prev;
    },

    isActive(tab) {
      return this.activeTab === tab;
    },
  }));

  /* ==========================================================
     5. DROPDOWN MANAGER (bonus reutilizable)
     Menú desplegable que cierra al hacer click fuera.

     Uso:
       <div x-data="dropdownManager">
         <button @click="toggle()" :aria-expanded="isOpen">Opciones ▾</button>
         <div x-show="isOpen" x-cloak @click.outside="close()"
              style="position:absolute; background:#fff; border:1px solid var(--color-border); border-radius:8px; min-width:180px; box-shadow:var(--shadow-md)">
           <button class="sidebar-link" style="border-radius:0">Editar</button>
           <button class="sidebar-link" style="border-radius:0">Eliminar</button>
         </div>
       </div>
     ========================================================== */
  Alpine.data('dropdownManager', () => ({
    isOpen: false,
    toggle() { this.isOpen = !this.isOpen; },
    open()   { this.isOpen = true; },
    close()  { this.isOpen = false; },
  }));

  /* ==========================================================
     6. LOADING BUTTON HELPER
     Adds .btn-loading class, disables button, removes it after
     a simulated delay. Wire up via @click="withLoading($el, fn)".

     Usage:
       <button class="btn-primary" @click="withLoading($el, () => save())">
         <span class="btn-text">Guardar</span>
       </button>
     ========================================================== */
  Alpine.magic('withLoading', () => (el, fn, ms = 1800) => {
    if (el.classList.contains('btn-loading')) return;
    el.classList.add('btn-loading');
    el.disabled = true;

    const result = fn();
    const finish = () => {
      setTimeout(() => {
        el.classList.remove('btn-loading');
        el.disabled = false;
      }, ms);
    };

    if (result && typeof result.finally === 'function') {
      result.finally(finish);
    } else {
      finish();
    }
  });

  /* ==========================================================
     7. SKELETON LOADER HELPER
     Usage in page init:
       this.loading = true;
       setTimeout(() => { this.loading = false; }, 1500);
     In HTML:
       <template x-if="loading">  <!-- skeleton cards --> </template>
       <template x-if="!loading"> <!-- real cards -->     </template>
     ========================================================== */
  // No Alpine component needed — use plain x-data flag `loading: true`
  // and the .skeleton-card / .skeleton-line CSS classes from styles.css.

  /* ── Log de arranque ──────────────────────────────────────── */
  console.info(
    '%c CONECTA UNSA %c components.js cargado ✓  |  Componentes: toastManager, modalManager, sidebarManager, tabsManager, dropdownManager, $withLoading',
    'background:#C0392B;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold',
    'color:#2C3E50'
  );

}); // end alpine:init

/* ============================================================
   GLOBAL ACCESSIBILITY HELPERS (non-Alpine, vanilla JS)
   ============================================================ */

/** Trap focus inside a modal/drawer element */
window.trapFocus = function(el) {
  const focusable = el.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  el._trapHandler = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  };
  el.addEventListener('keydown', el._trapHandler);
  first.focus();
};

/** Release focus trap from element */
window.releaseFocus = function(el, returnEl) {
  if (el._trapHandler) el.removeEventListener('keydown', el._trapHandler);
  if (returnEl && typeof returnEl.focus === 'function') returnEl.focus();
};

