# Checklist de Calidad — Conecta UNSA
> Auditoría post-refinamiento · Semestre 2025-2 · Hackathon Transformagob 2026

## Leyenda
| Símbolo | Significado |
|---|---|
| ✅ | Implementado y verificado |
| 🔶 | Implementado parcialmente |
| ❌ | Pendiente o no aplica |

---

## Tabla de estado por archivo HTML

| Página | Responsive mobile | Sidebar drawer | Accesible (WCAG AA) | Skeleton loader | Estado vacío SVG | Toasts | Tokens de diseño | Notas |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| `index.html` | ✅ | ❌ (no sidebar) | 🔶 | ❌ | ❌ | ❌ | ✅ | Navbar hamburger con Alpine.js x-show. Hero 2col→1col en mobile. |
| `auth/login.html` | ✅ | ❌ (no sidebar) | 🔶 | ❌ | ❌ | ✅ | ✅ | 2 columnas en desktop. Labels en todos los inputs. |
| `auth/register.html` | ✅ | ❌ (no sidebar) | 🔶 | ❌ | ❌ | ✅ | ✅ | Paso 1/2/3 multi-step. Radio cards con aria. |
| `egresado/dashboard.html` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Skeleton flag `loading:true`. Empty state con `role=status`. |
| `egresado/feed.html` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Filtros ocultos en mobile con toggle. Panel detalle 100vw en mobile. `.scroll-x-hidden` en strip. |
| `egresado/perfil.html` | ✅ | ✅ | 🔶 | ❌ | 🔶 | ✅ | ✅ | Tabs con `role=tablist/tab/tabpanel`. Portfolio empty state parcial. |
| `empleador/dashboard.html` | ✅ | ✅ | 🔶 | ❌ | ❌ | ✅ | ✅ | Tabla con `overflow-x:auto`. Modal pasaporte con aria-modal. |
| `empleador/publicar-vacante.html` | ✅ | ❌ (no sidebar) | 🔶 | ❌ | ❌ | ✅ | ✅ | Radio cards 2col en mobile. Step dots compactos en mobile. |
| `admin/panel.html` | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | Empty state "Todo al día" en vacantes. Charts responsive:true. |

---

## Detalle de implementación por categoría

### 1. Responsive Mobile-First

| Elemento | Breakpoint aplicado | Estado |
|---|---|---|
| Navbar hamburger (`index.html`) | `< 1024px` | ✅ Alpine.js x-show + x-transition |
| Hero 2col → 1col | `< 640px` | ✅ Tailwind `grid-cols-1 lg:grid-cols-2` |
| Stats hero 3col → 1col | `< 640px` | ✅ `sm:grid-cols-3` |
| Sidebar todos los módulos | `< 1024px` | ✅ `transform:translateX(-100%)` → open |
| Overlay semitransparente | `< 1024px` | ✅ `background:rgba(0,0,0,.4)` |
| Filtros feed ocultos | `< 640px` | ✅ Botón toggle `sm:hidden` |
| Panel detalle feed 100% | `< 640px` | ✅ `@media(max-width:640px){ width:100vw }` |
| Strip "Nuevas hoy" scroll | Todos | ✅ `.scroll-x-hidden` (scrollbar oculta) |
| Radio cards publicar-vacante | `< 640px` | ✅ `grid-cols-2` |
| Tablas con overflow-x | `< 640px` | ✅ Wrapper `div overflow-x-auto` |
| Charts Chart.js | Todos | ✅ `responsive:true, maintainAspectRatio:false` |

### 2. Accesibilidad WCAG 2.1 AA

| Criterio | Cobertura | Estado |
|---|---|---|
| `html lang="es"` | Todos los archivos | ✅ |
| Labels con `for` + `id` | Formularios auth, publicar | ✅ |
| `aria-label` botones icono | Dashboard, feed, admin | ✅ |
| `aria-hidden="true"` en SVG decorativos | Dashboard, feed | ✅ |
| `role="img"` + `aria-label` en SVG informativos | Perfil (radar) | 🔶 |
| `aria-label` en barras de match | Feed cards | 🔶 Pendiente en producción |
| `:focus-visible` ring | `assets/styles.css` global | ✅ `outline:2px solid var(--color-primary)` |
| Foco en modal al abrir | `components.js` modalManager | ✅ `panel.focus()` en `$nextTick` |
| Trampa de foco en modal | `components.js` `trapFocus()` | ✅ Helper global disponible |
| Restaurar foco al cerrar | `releaseFocus(el, returnEl)` | ✅ Helper global disponible |
| `role="tablist/tab/tabpanel"` | Perfil, feed detail panel | ✅ |
| `aria-selected` en tabs | `tabsManager` de components.js | ✅ |
| `role="alert"` en errores | Publicar-vacante validation | ✅ |
| `role="status"` en empty states | Dashboard, feed | ✅ |
| Escape cierra modales | Todos los modales | ✅ `@keydown.escape.window` |

### 3. Micro-interacciones

| Elemento | Implementación | Estado |
|---|---|---|
| Botón con loading state | `.btn-loading` CSS + `$withLoading` magic | ✅ |
| Spinner CSS rotación | `@keyframes btn-spin` 0.6s | ✅ |
| Skeleton shimmer | `@keyframes skeleton-shimmer` 1.5s | ✅ |
| Apertura de modales escala | `x-transition` opacity 0→1 + scale 0.95→1 | ✅ |
| Sidebar slide-in | `translateX(-100%)` → 0 en 250ms | ✅ |
| Menús desplegables | opacity 0→1 + translateY -4px→0 | ✅ en components.js |
| Hover cards | `transform:translateY(-2px)` + box-shadow | ✅ en todos los archivos |

### 4. Estados Vacíos con SVG Inline

| Página | SVG | Copy | CTA | Estado |
|---|---|---|---|---|
| `feed.html` sin resultados | Lupa con X en rojo UNSA | "Sin resultados con estos filtros" | "Limpiar filtros" | ✅ |
| `dashboard.html` sin postulaciones | Sobre con líneas de envío | "Aún no has postulado" | Link a feed.html | ✅ |
| `perfil.html` portafolio vacío | Pendiente | Pendiente | Pendiente | 🔶 |
| `admin/panel.html` sin vacantes | `<i class="ti ti-circle-check">` + texto | "¡Todo al día!" | — | ✅ |

### 5. Consistencia de Tokens de Diseño

| Token | Valor | Verificado en |
|---|---|---|
| `--color-primary` | `#C0392B` | Todos los archivos vía CSS var |
| `--color-secondary` | `#2C3E50` | Todos los archivos |
| `--color-accent` | `#27AE60` | Todos los archivos |
| H1 font-size | `24px` / `1.5rem` (móvil: 20px) | styles.css breakpoint |
| H2 font-size | `18px` / `1.125rem` | `.section-title` |
| Body font-size | `14–16px` | Base reset |
| `.card` border-radius | `8px` / `var(--radius-lg)` | styles.css |
| `.card` box-shadow | `0 1px 3px rgba(0,0,0,0.08)` | `var(--shadow-sm)` |
| Inputs border-radius | `6px` / `var(--radius-md)` | styles.css |
| Badges border-radius | `9999px` / `var(--radius-full)` | styles.css |
| Botones border-radius | `6px` / `var(--radius-md)` | styles.css |
| Toasts | `Alpine.data('toastManager')` | `components.js` |
| Modales | `Alpine.data('modalManager')` | `components.js` |
| Sidebar | `Alpine.data('sidebarManager')` | `components.js` |
| Errores | `.error-text` + `role="alert"` | styles.css |
| Google Fonts Inter | `<link href="...Inter...">` | Todos los archivos |
| Tabler Icons CDN | `tabler-icons.min.css` | Todos los archivos |
| Tailwind CDN v3 | `cdn.tailwindcss.com` | Todos los archivos |
| Alpine.js CDN | `alpinejs@3.14.1` | Todos los archivos |
| Chart.js CDN | `chart.umd.min.js` | Solo dashboard + admin |

---

## Mejoras reservadas para la versión de producción

> [!IMPORTANT]
> Las siguientes mejoras están **fuera del alcance del prototipo para la hackathon** y requieren infraestructura backend real. Son los próximos pasos naturales tras validar el prototipo.

### 1. Integración con backend real (API REST / GraphQL)
Reemplazar todos los datos de `window.UNSA_DATA` con llamadas autenticadas a una API real.
Los endpoints clave serían:
- `GET /api/empleos?carrera=&habilidades=&salario_min=` — feed personalizado
- `POST /api/postulaciones` — registrar postulación con estado en tiempo real
- `GET /api/egresado/perfil` — datos académicos desde sistema UNSA
- `PATCH /api/admin/vacantes/:id/aprobar` — flujo de moderación

### 2. Autenticación JWT con tokens de sesión
Reemplazar el sistema de redirección por email con autenticación real:
- **JWT access + refresh tokens** (access: 15min, refresh: 7 días)
- Middleware de protección de rutas por `rol` (`egresado`, `empleador`, `admin`)
- Integración con **LDAP / Active Directory UNSA** para validar credenciales institucionales
- Revocación de sesiones y auditoría de accesos en panel admin

### 3. Conexión directa con el Sistema Académico UNSA
Integrar la plataforma con los sistemas de registro académico de la UNSA para:
- **Verificación automática de egresados**: validar grado, carrera y año de egreso contra la base de datos institucional
- **Importación de currícula**: poblar automáticamente las habilidades del Pasaporte Profesional desde las asignaturas aprobadas
- **Certificación de logros**: emitir badges digitales verificados cuando el egresado complete certificaciones internas
- **API SUNEDU**: cruce con el Registro Nacional de Grados y Títulos para validar títulos profesionales

---

*Generado por el agente de desarrollo — Conecta UNSA · Hackathon Transformagob 2026*
