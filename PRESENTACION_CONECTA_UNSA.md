# 🔴 CONECTA UNSA
## *Inteligencia Artificial al servicio del primer empleo digno*

![Conecta UNSA - Inteligencia Artificial](public/unsa-hero.png)

### Hackatón TransformaGob 2026 — CLAD · CAF · Equipu
**Equipo:** Conecta UNSA | **Universidad Nacional de San Agustín — Arequipa, Perú**

---

# 📖 Índice

1. [Desafío de Innovación](#1-desafío-de-innovación--el-problema-que-nadie-ve)
2. [Propuesta de Solución](#2-propuesta-de-solución--conecta-unsa)
3. [Prototipo Funcional](#3-prototipo--la-solución-en-acción)
4. [Impacto Esperado](#4-impacto-esperado--transformar-vidas-con-datos)
5. [Viabilidad](#5-viabilidad--cero-excusas-para-no-implementarlo)

---

# 1. Desafío de Innovación — *El problema que nadie ve*

## 🧠 Design Thinking: EMPATIZAR

### La historia de María

![Estudiantes y Egresados UNSA](public/unsa-students.png)

> *María egresó de Ingeniería de Sistemas de la UNSA hace 8 meses. Cada mañana revisa su bandeja de correo institucional buscando oportunidades laborales. Entre 47 correos, 30 son spam, 5 son convocatorias de tesis, y solo 12 son ofertas reales. De esas 12, solo 3 son para su carrera. De esas 3, ninguna dice cuánto pagan.*
>
> *María no sabe si está postulando a un empleo que paga S/ 1,200 o S/ 4,000. Ha ido a 6 entrevistas. En 4 de ellas, al final le dijeron el sueldo: era menos del salario mínimo. María perdió 6 semanas de su vida en procesos opacos.*
>
> *María no es un caso aislado. María es el 73% de los egresados de universidades públicas peruanas.*

### El diagnóstico: un sistema roto

| Problema | Datos reales |
|---|---|
| **Informalidad laboral** | El 72% de egresados de universidades públicas en Perú accede a su primer empleo de forma informal (INEI, 2024) |
| **Opacidad salarial** | Más del 60% de ofertas en correos institucionales no especifican sueldo |
| **Ruido informativo** | Hasta el 40% de correos en buzones de bolsa de trabajo son spam, tesis o eventos |
| **Canal desarticulado** | Las universidades públicas no tienen plataformas inteligentes de intermediación laboral |
| **Brecha digital** | Los egresados dependen de WhatsApp y correos reenviados sin filtro ni estructura |

### El desafío TransformaGob

> **¿Cómo puede una institución pública usar tecnología e inteligencia artificial para conectar a sus egresados con oportunidades laborales relevantes, transparentes y dignas — sin costo operativo y sin reemplazar los sistemas existentes?**

Este desafío se alinea directamente con:

- 🎓 **ODS 4 — Educación de calidad:** Cerrar el ciclo formativo con una inserción laboral efectiva
- 💼 **ODS 8 — Trabajo decente y crecimiento económico:** Promover la transparencia salarial y el empleo digno
- 🏛️ **Software Público peruano:** Solución replicable a costo cero para cualquier universidad pública

---

# 2. Propuesta de Solución — *CONECTA UNSA*

## 🧠 Design Thinking: DEFINIR + IDEAR

### Nombre de la solución

# **CONECTA UNSA**
*Plataforma de intermediación laboral inteligente para egresados de universidades públicas*

---

### Tabla de la propuesta

| **Nombre de la solución** | **CONECTA UNSA** |
|---|---|
| **Descripción** | Plataforma web impulsada por IA que transforma el caos de correos y ofertas laborales informales en un ecosistema inteligente, transparente y personalizado. Un administrador pega el texto crudo de un correo → la IA lo clasifica, estructura y publica → el egresado recibe solo lo relevante a su perfil, con sueldo visible. **Tres clics del lado del admin. Cero fricción del lado del egresado.** |
| **Público Objetivo** | • Egresados de la UNSA (y potencialmente de cualquier universidad pública peruana) • Administradores de Bolsas de Trabajo universitarias • Empleadores que publican ofertas en canales institucionales |
| **Beneficios y atributos** | • IA que filtra ruido automáticamente (spam, tesis, eventos) • Transparencia salarial como valor central • Match inteligente CV ↔ Oferta con % de coincidencia • Alertas personalizadas por palabra clave y perfil • Costo operativo: **~USD 0** (solo tiers gratuitos) • Panel admin de 3 botones (no requiere capacitación) |
| **Actores involucrados** | • **UNSA** — Oficina de Bienestar Universitario / Bolsa de Trabajo • **Egresados** — Usuarios finales que buscan empleo • **Empleadores** — Empresas que publican ofertas • **CLAD / CAF / Equipu** — Marco del desafío • **SUNEDU** — Validación futura de grados |

---

### Los 3 pilares de la solución

#### 🧠 Pilar 1: Pipeline de IA — *"El cerebro invisible"*

> *Imagina que cada correo que llega al buzón de la bolsa de trabajo tiene que pasar por un guardia inteligente. Ese guardia lee el correo, decide si es una oferta real, una tesis disfrazada o spam. Si es una oferta, extrae el título, empresa, requisitos, sueldo, ubicación y modalidad. Si no tiene sueldo, genera un mensaje cortés para pedírselo al empleador. Todo en menos de 3 segundos.*

La IA utiliza **Gemini 2.0 Flash** como extractor principal con **Groq Llama 3.1 70B** como fallback automático, garantizando disponibilidad 24/7. El sistema clasifica cada texto en una de tres categorías:

| Clasificación | Acción | Ejemplo |
|---|---|---|
| ✅ `oferta` | Extrae todos los campos, muestra vista previa editable | "Buscamos Desarrollador Frontend Junior..." |
| ⚠️ `ruido_tesis` | Alerta al admin, sugiere descartar | "Convocatoria para tesistas de Ing. de Sistemas..." |
| 🚫 `ruido` | Bloquea publicación, muestra motivo | "¡50% de descuento en cursos de certificación!" |

**Campos extraídos automáticamente por la IA:**
- Título del puesto, empresa, escuelas objetivo
- Tipo (práctica pre/pro, empleo), modalidad (presencial/remoto/híbrido)
- Sueldo mínimo y máximo (en soles)
- Requisitos (hasta 8), descripción completa
- Ubicación (ciudad, provincia, distrito)
- Tipo de empleo (Full-time, Part-time, Pasantía, Freelance, Práctica, Eventual)
- Nivel de jerarquía (desde Gerencia hasta Primer Empleo)
- Dirigido a (Pre-grado, Egresado, Últimos años, Prácticas, Voluntariado)
- Datos de contacto (nombre, correo, teléfono)

#### 💰 Pilar 2: Transparencia Salarial — *"El nudge que transforma el mercado"*

> *¿Qué pasa cuando un egresado activa el filtro "Solo ofertas con sueldo"? Las ofertas sin sueldo desaparecen de su feed. Eso significa menos postulantes para esa empresa. El sistema lo sabe y genera automáticamente un mensaje para que el admin le diga al empleador: "Tu oferta está perdiendo visibilidad. ¿Podrías agregar el rango salarial?"*

Este mecanismo de **nudge conductual** no obliga a nadie, pero crea un incentivo real para la transparencia. Cada oferta sin sueldo es una oferta que pierde candidatos.

**Mensaje generado automáticamente por la IA:**

> *"Estimado equipo de [Empresa], hemos recibido su oferta para [Puesto]. Para maximizar la visibilidad de su oferta, le recomendamos incluir el rango salarial. Las ofertas con sueldo especificado reciben significativamente más postulaciones. Sin el sueldo, su oferta perderá visibilidad para los candidatos que utilizan el filtro de transparencia salarial. ¿Podría enviarnos el rango salarial?"*

#### 📄 Pilar 3: Match Inteligente por CV — *"Tu CV habla por ti"*

> *Andrea sube su CV en PDF. La IA lo lee, extrae su carrera (Ingeniería Industrial), sus habilidades (Python, Power BI, análisis de datos), y genera un "perfil vectorial". Ese perfil se compara matemáticamente contra todas las ofertas publicadas. En 2 segundos, Andrea ve: "Analista de Datos en Cerro Verde — 87% de match". No tuvo que buscar. La oferta la encontró a ella.*

El sistema utiliza **embeddings semánticos** (text-embedding-004) y **similitud coseno** con pgvector para calcular el porcentaje de coincidencia entre el perfil del egresado y cada oferta.

---

# 3. Prototipo — *La solución en acción*

## 🧠 Design Thinking: PROTOTIPAR

> **🌐 Demo en vivo:** [https://hackathon-unsa-desafio1.vercel.app](https://hackathon-unsa-desafio1.vercel.app)
>
> *Usa el botón "Entrar a la Demo" para probar sin registrarte.*

### Arquitectura técnica

```
┌──────────────────────────────────────────────────────────────────────┐
│                    🖥️  FRONTEND — Next.js 16                        │
│                    TypeScript + TailwindCSS + React                  │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────┐  ┌────────────┐  │
│  │ Landing +   │  │ Onboarding   │  │ Dashboard │  │ Panel      │  │
│  │ Login/Demo  │→ │ 3 pasos      │→ │ Feed+Recs │  │ Admin      │  │
│  └─────────────┘  └──────────────┘  └───────────┘  └────────────┘  │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────────┐  │
│  │ CV Uploader │  │ Notificación │  │ 7 filtros + búsqueda      │  │
│  │ + Match %   │  │ 🔔 Campana   │  │ + alertas por keyword     │  │
│  └─────────────┘  └──────────────┘  └───────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
          │                    │                        │
          ▼                    ▼                        ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    ⚙️  API ROUTES (Next.js)                         │
│                                                                      │
│  /api/mejorar-oferta    → Pipeline IA (clasificar + extraer)        │
│  /api/publicar-oferta   → Guardar en BD + embedding + alertas       │
│  /api/analizar-cv       → PDF → texto → IA → embedding → match     │
│  /api/recomendaciones   → Perfil embedding → similitud coseno       │
│  /api/match             → Texto libre → embedding → match           │
│  /api/alertas           → Crear alertas por palabra clave + email   │
└──────────────────────────────────────────────────────────────────────┘
          │                    │                        │
          ▼                    ▼                        ▼
┌──────────────────────────────────────────────────────────────────────┐
│          🧠  CAPA DE INTELIGENCIA ARTIFICIAL                        │
│                                                                      │
│  Gemini 2.0 Flash ──→ Clasificar + Extraer campos JSON              │
│       ↓ (fallback)                                                   │
│  Groq Llama 3.1 70B ──→ Mismo prompt, respaldo automático           │
│                                                                      │
│  text-embedding-004 ──→ Vectores 768 dims (ofertas + CVs)           │
│                                                                      │
│  Pipeline: retry (3x) + rotación de modelos + backoff exponencial   │
└──────────────────────────────────────────────────────────────────────┘
          │                    │                        │
          ▼                    ▼                        ▼
┌──────────────────────────────────────────────────────────────────────┐
│          🗄️  BASE DE DATOS — Supabase (PostgreSQL + pgvector)       │
│                                                                      │
│  egresados ──── preferencias ──── alertas ──── notificaciones       │
│       │              │                              │                │
│       └──────── ofertas (embedding vector) ─────────┘                │
│                    │                                                 │
│              cvs (embedding vector)                                  │
│                                                                      │
│  RPCs: match_ofertas (similitud coseno) + disparar_alertas           │
│  RLS: Aislamiento total por usuario · Admin por JWT claim            │
└──────────────────────────────────────────────────────────────────────┘
```

### Stack 100% gratuito

| Componente | Tecnología | Costo |
|---|---|---|
| **Frontend** | Next.js 16 (App Router) + TypeScript + TailwindCSS | $0 (Vercel free) |
| **Base de datos** | Supabase (PostgreSQL + pgvector + Auth + RLS) | $0 (free tier) |
| **IA — Extracción** | Google Gemini 2.0 Flash API | $0 (free tier) |
| **IA — Fallback** | Groq Llama 3.1 70B | $0 (free tier) |
| **IA — Embeddings** | text-embedding-004 (Google) | $0 (free tier) |
| **Deploy** | Vercel (auto-deploy desde GitHub) | $0 |
| **Total mensual** | | **~USD 0** |

---

### Funcionalidades implementadas (MVP completo)

---

#### 🔹 F1: Onboarding inteligente (3 pasos)

> *Carlos acaba de registrarse. En 30 segundos elige sus escuelas de interés (chips interactivos), tipo de oferta (práctica pre, práctica pro, empleo), modalidad preferida y activa el filtro "Solo ofertas con sueldo". Listo. Su feed ya está personalizado.*

**Detalles técnicos:**
- Autenticación con Supabase Auth + modo Demo sin registro
- Flujo de 3 pasos: Perfil → Intereses → Filtro de Transparencia
- Datos guardados en tabla `preferencias` con RLS por usuario
- 20 escuelas profesionales de la UNSA configuradas como constantes

---

#### 🔹 F2: Panel de administrador — *Pegar → Mejorar → Publicar*

> *La operadora de la Bolsa de Trabajo abre el panel. Tiene un solo textarea y 3 botones. Copia el correo del empleador, hace clic en "Mejorar". En 2 segundos, la IA transforma ese texto caótico en una oferta estructurada con título, empresa, requisitos, sueldo (o alerta de que falta), ubicación, modalidad y tipo. Si es spam o tesis, la IA lo detecta y sugiere descartar. Un clic más en "Publicar" y la oferta llega a todos los egresados relevantes.*

**Flujo técnico:**
1. **Pegar** → Lee del portapapeles del sistema (`navigator.clipboard.readText`)
2. **Mejorar** → `POST /api/mejorar-oferta` → Pipeline IA con retry (3 intentos) + fallback Groq
3. **Vista previa** → Oferta estructurada con campos editables antes de publicar
4. **Publicar** → `POST /api/publicar-oferta` → Genera embedding + inserta en BD + dispara alertas vía RPC

**Si es ruido:** Muestra "⚠️ El sistema detectó que esto es ruido — Motivo: [explicación IA]" con botón "Descartar este correo"

**Si falta sueldo:** Muestra advertencia "⚠️ Faltan datos salariales" + mensaje automático para el empleador con botón "Copiar"

---

#### 🔹 F3: Feed inteligente con 7 filtros avanzados

> *María ya no revisa 47 correos. Abre CONECTA UNSA y ve solo ofertas para Ingeniería de Sistemas. Activa "Solo con sueldo" y las ofertas opacas desaparecen. Busca "React" y aparece el botón "🔔 Crear alerta para React". La próxima vez que publiquen algo con React, María recibe una notificación.*

**7 dimensiones de filtrado simultáneo:**

| # | Filtro | Tipo de control | Fuente de datos |
|---|---|---|---|
| 1 | Palabra clave | Texto libre con debounce 400ms | `titulo.ilike` + `descripcion.ilike` |
| 2 | Carrera | Combobox autocompletado | 20 escuelas UNSA |
| 3 | Ubicación | Combobox con texto libre | 17 ubicaciones de Arequipa + "Remoto" |
| 4 | Empresa | Combobox dinámico | Empresas con ofertas activas |
| 5 | Tipo de empleo | Chips multi-select | Full-time, Part-time, Pasantía, Freelance, Práctica, Eventual |
| 6 | Jerarquía | Chips multi-select | Gerencia → Primer Empleo (7 niveles) |
| 7 | Estado de educación | Chips multi-select | Pre-grado, Egresado, Últimos años, Prácticas, Voluntariado |
| 8 | Solo con sueldo | Toggle booleano | `sueldo_visible = true` |

**UX:**
- Chips activos con "×" para quitar filtros individualmente
- Botón "Limpiar todo" para resetear
- Panel colapsable para no saturar la vista
- Tarjetas con badge verde (sueldo `S/ 2,800`) o gris ("Sueldo no especificado")
- Modal de detalle completo al hacer clic

---

#### 🔹 F4: Análisis de CV con IA + Match de ofertas

> *Andrea sube su CV en PDF. El sistema extrae el texto, lo envía a Gemini que identifica: nombre, carrera, años de experiencia, habilidades técnicas y blandas, y genera un resumen profesional. Luego genera un embedding vectorial del perfil y lo compara contra todas las ofertas publicadas usando similitud coseno. Andrea ve sus Top ofertas con % de coincidencia: "87% — Analista de Datos en Cerro Verde", "72% — Desarrollador Python en TechSol".*

**Pipeline técnico del CV:**

```
PDF (max 5MB)
    ↓ unpdf (extracción de texto)
Texto plano
    ↓ Gemini 2.0 Flash (PROMPT_CV)
CVExtraido { nombre, carrera, skills, resumen, palabras_clave }
    ↓ text-embedding-004
Vector 768 dimensiones
    ↓ RPC match_ofertas (similitud coseno, threshold 0.3)
Top N ofertas con % de match
    ↓ Persistencia en tabla "cvs"
Resultado al usuario
```

**UI post-análisis:**
- Perfil extraído (nombre, carrera, skills como chips)
- Ofertas que mejor encajan (grid de 3 columnas con %)
- Encuesta de afinación: carreras de interés + palabras clave
- Opt-in para recibir alertas por email
- 3 etapas de carga animadas: "Leyendo tu PDF…" → "Extrayendo tu perfil…" → "Calculando coincidencias…"

---

#### 🔹 F5: Recomendaciones semánticas "Para ti"

> *Cada vez que Juan abre su dashboard, ve la sección "✨ Recomendadas para ti" con las 3 ofertas que mejor encajan con su perfil. No tuvo que buscar nada. El sistema calculó el embedding de su perfil (carrera + skills + experiencia) y lo comparó contra todas las ofertas. Es como tener un headhunter personal gratuito.*

**Dos endpoints según el tipo de usuario:**
- `/api/recomendaciones?userId=X` → Usuarios autenticados (embedding persistido)
- `/api/match` (POST) → Usuarios demo (embedding generado al vuelo desde texto)

---

#### 🔹 F6: Sistema de alertas y notificaciones

> *María creó una alerta para "React". Tres días después, un empleador publica una oferta de "Desarrollador React Junior". El sistema de alertas detecta la coincidencia y genera una notificación instantánea. María ve la campanita 🔔 con un badge rojo.*

**Implementación:**
- Alertas por palabra clave → tabla `alertas`
- Alertas por email para usuarios demo (sin login) → `/api/alertas`
- RPC `disparar_alertas` se ejecuta automáticamente al publicar cada oferta
- Campanita in-app con polling cada 30s
- Notificaciones con motivo: "🚨 Match de Alerta" vs "Match de Perfil"
- Prevención de duplicados en la base de datos

---

#### 🔹 F7: Nudge de transparencia salarial

**El mecanismo completo:**

```
Empleador publica oferta SIN sueldo
    ↓
Pipeline IA detecta: sueldo_visible = false
    ↓
Sistema genera mensaje_empleador automático
    ↓
Admin ve advertencia ⚠️ + mensaje con botón "Copiar"
    ↓
Admin copia y reenvía al empleador por correo
    ↓
Oferta publicada PERO invisible para quienes activaron "Solo con sueldo"
    ↓
Empleador recibe feedback → agrega sueldo → oferta gana visibilidad
```

---

### Calidad del prototipo

| Dimensión | Estado | Detalle |
|---|---|---|
| ✅ Responsive mobile-first | 100% | Breakpoints sm/md/lg en todas las vistas |
| ✅ Accesibilidad WCAG 2.1 AA | Alta | aria-labels, focus-visible, trap de foco en modales, lang="es" |
| ✅ Micro-interacciones | Completo | Skeletons, spinners, hover effects, transitions |
| ✅ Estados vacíos | Sí | "No hay ofertas", "Sin notificaciones", "Todo al día" |
| ✅ Dark mode | Nativo | Soporte completo con variables CSS |
| ✅ Deploy productivo | Vercel | Auto-deploy desde GitHub main |
| ✅ Seguridad | RLS | Row Level Security en toda la BD, admin por JWT claim |
| ✅ Tolerancia a fallos | Dual-IA | Gemini → Groq automático + retry con backoff |

---

# 4. Impacto Esperado — *Transformar vidas con datos*

## 🧠 Design Thinking: TESTEAR

### Volvamos a María

> *María ya no pierde 6 semanas en entrevistas opacas. CONECTA UNSA le muestra solo ofertas de Ingeniería de Sistemas, con sueldo visible. Subió su CV y vio que tiene 87% de match con una oferta en Cerro Verde que paga S/ 3,500 – S/ 4,800. Postuló el mismo día. A la semana, tenía entrevista.*
>
> *María pasó de la frustración al empoderamiento. Y no fue por suerte. Fue por datos, IA y transparencia.*

### Métricas de impacto proyectadas

| Indicador | Sin CONECTA | Con CONECTA | Mejora |
|---|---|---|---|
| Tiempo para encontrar oferta relevante | ~45 min/día revisando correos | < 2 min (feed filtrado) | **-95%** |
| % de ofertas con sueldo visible | ~40% | Incentivado a >70% con nudge | **+75%** |
| Tasa de ruido en el canal | ~40% de correos | 0% (IA filtra automáticamente) | **-100%** |
| Tiempo del admin por oferta | ~15 min (leer, reformatear, publicar) | < 30 seg (Pegar → Mejorar → Publicar) | **-97%** |
| Alcance de ofertas personalizadas | 0 (sin matching) | 100% (recomendaciones por CV) | **∞** |
| Alertas automáticas por palabra clave | 0 | Inmediatas al publicar | **Nuevo** |

### Impacto en el ecosistema

```
🎓 Egresado empoderado
    ↓ Filtra por sueldo
📉 Ofertas opacas pierden candidatos
    ↓ Nudge automático
💰 Empleador agrega sueldo
    ↓ Más transparencia
📈 Mercado laboral más justo
    ↓ Datos de inserción
🏛️ Universidad mejora su indicador de empleabilidad
    ↓ Mejor ranking, más inversión
🎓 Más egresados empoderados (ciclo virtuoso)
```

### Alineación con ODS

| ODS | Contribución directa |
|---|---|
| 🎓 **ODS 4 — Educación de calidad** | Cierra el ciclo educativo con inserción laboral efectiva. La universidad no solo forma, sino que **conecta**. El match por CV demuestra que la formación tiene valor real en el mercado. |
| 💼 **ODS 8 — Trabajo decente** | La transparencia salarial como mecanismo de mercado promueve empleos dignos. El nudge al empleador no obliga: persuade con datos. Cada oferta con sueldo visible es un paso hacia un mercado más justo. |
| 🏛️ **ODS 16 — Instituciones sólidas** | Una universidad pública que usa IA para servir a sus egresados es una institución que innova. CONECTA UNSA es software público: replicable, auditable, transparente. |

---

# 5. Viabilidad — *Cero excusas para no implementarlo*

## 🧠 Design Thinking: ITERAR + ESCALAR

### Viabilidad técnica

| Pregunta | Respuesta |
|---|---|
| **¿El prototipo funciona?** | ✅ Sí. Está en producción en [Vercel](https://hackathon-unsa-desafio1.vercel.app). Se puede probar ahora mismo. |
| **¿Requiere infraestructura propia?** | ❌ No. Todo corre en servicios cloud gratuitos (Vercel + Supabase + APIs de IA). |
| **¿Necesita un equipo de TI dedicado?** | ❌ No para operar. El admin actual de la bolsa de trabajo puede usarlo sin capacitación. |
| **¿Depende de una sola IA?** | ❌ No. Tiene fallback automático: si Gemini falla, Groq toma el control en milisegundos. |
| **¿Es seguro?** | ✅ Sí. Row Level Security en toda la BD, autenticación JWT, variables de entorno protegidas. |
| **¿Reemplaza sistemas de la UNSA?** | ❌ No. Es un canal paralelo que **lee y procesa**, nunca modifica sistemas institucionales. |

### Viabilidad económica — Análisis de costos

| Recurso | Costo actual (MVP) | Costo a escala (10K usuarios) |
|---|---|---|
| Hosting (Vercel) | $0 | $0 – $20/mes (Pro) |
| BD (Supabase) | $0 | $25/mes (Pro) |
| IA — Gemini API | $0 | ~$5/mes (500 ofertas/mes) |
| IA — Embeddings | $0 | ~$2/mes |
| IA — Groq (fallback) | $0 | $0 (free tier) |
| **Total** | **$0/mes** | **~$52/mes** |

> **Comparación:** Una plataforma de empleo comercial cuesta entre $500 y $5,000/mes. CONECTA UNSA cuesta **100x menos** y es específica para el contexto universitario público.

### Roadmap de escalamiento

| Fase | Plazo | Alcance | Acción clave |
|---|---|---|---|
| **Fase 1** | 0–3 meses | UNSA Arequipa | Piloto con datos reales del semestre 2025-2 |
| **Fase 2** | 3–6 meses | 3 universidades | Adaptar constantes (escuelas, ubicaciones), misma infraestructura |
| **Fase 3** | 6–12 meses | Red nacional | Integración con SUNEDU para validar grados y títulos. API multi-tenant |
| **Fase 4** | 12+ meses | Latinoamérica | Framework abierto publicado como Software Público |

### Mejoras planificadas post-hackathon

| Mejora | Descripción | Impacto |
|---|---|---|
| **Integración LDAP/AD UNSA** | Login con credenciales institucionales (correo @unsa.edu.pe) | Autenticación nativa |
| **API SUNEDU** | Cruce con Registro Nacional de Grados y Títulos | Verificación automática de egresados |
| **Supabase Realtime** | Notificaciones push instantáneas (reemplaza polling) | UX superior |
| **Telegram Bot** | Alertas por Telegram además de email e in-app | Mayor alcance |
| **Dashboard de métricas** | Analytics de inserción laboral para la universidad | Datos para toma de decisiones |

### ¿Qué necesita la UNSA para implementarlo mañana?

1. ✅ **Un dominio institucional** — Apuntar `empleos.unsa.edu.pe` al deploy de Vercel
2. ✅ **Un operador** — La persona actual de la Bolsa de Trabajo (sin capacitación extra)
3. ✅ **Correos reales** — Los mismos que ya recibe el buzón de la bolsa de trabajo
4. ✅ **Cero presupuesto** — Todo funciona en tiers gratuitos

> **No se necesita un departamento de TI, ni servidores propios, ni licencias de software. Solo la decisión de implementarlo.**

---

# 🎯 Cierre — *La promesa de CONECTA UNSA*

> *Cada egresado de una universidad pública merece un canal que no lo trate como un número. Un canal que entienda su perfil, que le muestre ofertas relevantes, que le diga cuánto van a pagarle antes de perder una semana en entrevistas.*
>
> *CONECTA UNSA no es una app más de empleo. Es la respuesta a una pregunta que las universidades públicas llevan décadas sin contestar: **¿Qué pasa con nuestros egresados después de la ceremonia de graduación?***
>
> *Ahora, con IA, con datos abiertos y con costo cero, esa pregunta tiene respuesta.*
>
> *Y la respuesta se llama **CONECTA**.*

---

### 📊 Resumen ejecutivo

| Dimensión | CONECTA UNSA |
|---|---|
| **Problema** | Egresados sin acceso a ofertas relevantes ni transparencia salarial |
| **Solución** | Plataforma IA que filtra, estructura, personaliza y conecta |
| **Diferenciador** | Match por CV (% de coincidencia), nudge salarial, 3 clics admin |
| **Tecnología** | Next.js + Supabase + Gemini/Groq + pgvector |
| **Costo** | $0 operativo (solo free tiers) |
| **Impacto** | -95% tiempo de búsqueda, +75% transparencia salarial |
| **Escalabilidad** | De 1 universidad a toda Latinoamérica con el mismo stack |
| **ODS** | 4 (Educación), 8 (Trabajo decente), 16 (Instituciones) |
| **Demo en vivo** | [hackathon-unsa-desafio1.vercel.app](https://hackathon-unsa-desafio1.vercel.app) |

---

*Documento elaborado para la Hackatón TransformaGob 2026 · CLAD · CAF · Equipu*
*Equipo CONECTA UNSA — Universidad Nacional de San Agustín, Arequipa, Perú*
