# Prompts del MVP — CONECTA UNSA (para Claude Code)

Ejecútalos en orden, en la raíz del repo (con `CLAUDE.md` y `.claude/` ya presentes). Tienes MCP de
**Supabase** y **GitHub** conectados. Cada prompt invoca el agente y las skills adecuadas.

---

## 0) Setup del proyecto

```
Lee CLAUDE.md y la skill conecta-unsa-core. Inicializa un proyecto Next.js (App Router) +
TypeScript + Tailwind, instala @supabase/supabase-js, configura las variables de entorno
(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) y un cliente Supabase para servidor y
cliente. Crea el repo en GitHub usando el MCP de GitHub y haz el primer commit. No incluyas claves
secretas en el cliente.
```

## 1) Base de datos (agente backend-dev)

```
Usa el agente backend-dev. Lee la skill supabase-conecta y, mediante el MCP de Supabase, aplica el
esquema completo: extensión vector, tablas egresados, preferencias, ofertas, alertas,
notificaciones, índices (incluido ivfflat para embeddings) y todas las políticas RLS. Configura el
rol admin como custom claim. Verifica con una query que un usuario no pueda leer datos de otro.
```

## 2) Auth + Onboarding (agente frontend-dev)

```
Usa el agente frontend-dev. Implementa login con Supabase Auth y el onboarding del egresado en
máximo 3 pasos: elegir escuelas de interés (chips), tipos de oferta (practica_pre/practica_pro/
empleo), modalidad y un toggle "solo ofertas con sueldo". Guarda en la tabla preferencias.
Responsive y con pocos botones, según la skill conecta-unsa-core.
```

## 3) Pipeline de IA "Mejorar" (agente ai-pipeline-dev)

```
Usa el agente ai-pipeline-dev. Lee la skill offer-improver. Crea la Edge Function de Supabase
"mejorar-oferta": recibe el texto crudo, clasifica (oferta/ruido/ruido_tesis) y extrae los campos
en JSON estricto con Gemini 2.0 Flash (fallback Groq Llama), normaliza, deriva sueldo_visible y, si
falta sueldo, genera el mensaje_empleador. La API key va en variables de entorno del servidor.
Incluye 3 casos de prueba: ruido de tesis, oferta sin sueldo, oferta con rango salarial.
```

## 4) Panel admin de 3 botones (agente frontend-dev)

```
Usa el agente frontend-dev. Construye el panel de administrador en UNA pantalla: un textarea grande
y 3 botones — Pegar (portapapeles), Mejorar (llama a la Edge Function mejorar-oferta y muestra vista
previa estandarizada + advertencia de sueldo + mensaje para el empleador), Publicar. Si el pipeline
marca ruido, muestra "parece {motivo}, ¿descartar?". Fácil e intuitivo, sin pasos extra.
```

## 5) Publicar + alertas + embeddings (agente backend-dev)

```
Usa el agente backend-dev. Crea la Edge Function "publicar-oferta": setea estado='publicada',
genera el embedding de la oferta (text-embedding-004) y guárdalo, e inserta notificaciones para
los egresados cuyas alertas (palabra clave + escuela) hagan match, y por coincidencia de carrera.
Evita duplicados. Conéctala al botón Publicar del panel admin.
```

## 6) Buscador, feed y alertas por palabra clave (agente frontend-dev)

```
Usa el agente frontend-dev. Implementa el buscador y el feed del egresado: aplica las preferencias
(escuelas, tipos, solo_con_sueldo) en la query del feed según la skill supabase-conecta. Bajo los
resultados muestra el botón "🔔 Crear alerta para '{palabra}'" que inserta en la tabla alertas.
Toggle "Mostrar solo ofertas con sueldo". Tarjetas con sueldo o badge "Sueldo no especificado".
Añade la campanita de notificaciones in-app.
```

## 7) Recomendación por matching (agente ai-pipeline-dev)

```
Usa el agente ai-pipeline-dev. Genera el perfil_embedding del egresado a partir de su carrera,
skills y experiencia, y añade una sección "Recomendadas para ti" en el feed usando similitud coseno
contra ofertas publicadas (query de la skill supabase-conecta). Umbral mínimo de score configurable.
```

## 8) Pulido + deploy

```
Revisa estados de carga/vacío/error en todas las pantallas, accesibilidad (labels, contraste,
teclado) y responsive. Despliega el frontend en Vercel y deja documentadas las variables de entorno.
Haz commit y abre un PR en GitHub con el resumen del MVP usando el MCP de GitHub.
```

---

### Tips para la demo de hackatón
- Carga primero ~20 correos reales del semestre 2025-2 para mostrar el filtrado de ruido en vivo.
- Demuestra el flujo admin completo en < 30 segundos: pegar → mejorar → publicar.
- Muestra una oferta sin sueldo desapareciendo al activar el filtro "solo con sueldo" + el mensaje
  generado para el empleador. Ese contraste es el que más impacta.
