---
name: offer-improver
description: >
  Pipeline de IA de CONECTA UNSA: convierte el texto crudo de un correo de oferta (que el admin
  pega) en una oferta estandarizada. Úsala SIEMPRE que la tarea sea el botón "Mejorar", clasificar
  ofertas vs ruido, extraer/normalizar campos (carrera, tipo, sueldo, requisitos, fecha de cierre),
  detectar sueldo faltante y generar el nudge al empleador, generar embeddings o hacer matching por
  similitud. Incluye los prompts exactos y el formato JSON de salida. Diseñada para LLMs gratuitos
  (Gemini Flash / Groq Llama).
---

# Offer Improver — Pipeline de IA

Todo corre con **tier gratuito**: Google Gemini 2.0 Flash para clasificar/extraer y
`text-embedding-004` para embeddings. Alternativa si se agota cuota: **Groq** con
`llama-3.3-70b-versatile`. Las llamadas van desde una **Edge Function de Supabase** (la API key
vive en variables de entorno del servidor, nunca en el front).

## Flujo del botón "Mejorar"

```
texto crudo del correo
  → 1. Clasificar (¿oferta o ruido?)
  → 2. Extraer campos estructurados (JSON)
  → 3. Normalizar (limpiar, completar template, derivar sueldo_visible)
  → 4. Nudge salarial si falta sueldo
  → devuelve { oferta, advertencias, mensaje_empleador } para vista previa
"Publicar" → genera embedding + guarda estado='publicada' + dispara alertas
```

## Paso 1+2 — Prompt de clasificación y extracción (una sola llamada)

Pide salida **solo JSON** (sin markdown, sin texto extra). System prompt:

```
Eres un asistente de la Bolsa de Trabajo de la UNSA. Recibes el texto crudo de un correo y
devuelves SOLO un objeto JSON válido, sin explicaciones ni ```.

Primero decide si el correo es una OFERTA LABORAL real o RUIDO. Es RUIDO si es: webinar, charla,
feria, encuesta, curso, admisión a maestría/doctorado, fondo concursable, o reenvío sin vacante.
Marca también como ruido_tesis=true si es reclutamiento masivo de "investigador/asesor de tesis"
publicado por empresas de asesoría de tesis.

Si es oferta, extrae los campos. Usa la lista oficial de escuelas profesionales de la UNSA para
"escuela_objetivo"; si el puesto aplica a varias, inclúyelas todas; si no se especifica, deja [].

Tipos válidos: "practica_pre", "practica_pro", "empleo".
Para el sueldo: si hay monto único, llena sueldo_min=sueldo_max. Si hay rango, ambos. Si NO se
menciona sueldo, deja sueldo_min y sueldo_max en null (NO inventes montos).

Formato exacto:
{
  "es_oferta": true,
  "es_ruido": false,
  "ruido_tesis": false,
  "titulo": "",
  "empresa": "",
  "escuela_objetivo": [],
  "tipo": "empleo",
  "descripcion": "",
  "requisitos": [],
  "modalidad": "presencial|remoto|hibrido|null",
  "sueldo_min": null,
  "sueldo_max": null,
  "fecha_cierre": "YYYY-MM-DD o null"
}
```

User message = el texto pegado. Parsea el JSON; si falla, reintenta una vez pidiendo "devuelve solo
JSON válido".

## Paso 3 — Normalización (en código, no IA)

```ts
const sueldo_visible = oferta.sueldo_min != null;        // corazón de la transparencia
oferta.estado = "borrador";
oferta.texto_original = textoPegado;
// limpiar espacios, capitalizar título, deduplicar requisitos, validar tipo/modalidad
```

Si `es_ruido` o `ruido_tesis` → no se publica; el panel muestra "Esto parece {motivo}. ¿Descartar?".

## Paso 4 — Nudge salarial al empleador

Si `sueldo_visible === false`, genera un mensaje breve que el admin puede reenviar. Prompt:

```
Redacta un mensaje cordial y breve (máx. 4 líneas) para responder a un empleador que publicó una
vacante SIN indicar el sueldo. Explica que, según la política de transparencia de la Bolsa de
Trabajo UNSA, las ofertas sin rango salarial tienen menor visibilidad porque muchos egresados
filtran solo ofertas con sueldo, y pídele amablemente que indique el rango para llegar a más
candidatos. Tono institucional, en español.
```

Devuelve al front: `{ oferta, advertencias: ["Sin sueldo: visibilidad reducida"], mensaje_empleador }`.

## Embeddings y matching (al publicar)

```ts
// 1 sola llamada de embedding por oferta, al publicar
const texto = `${oferta.titulo}. ${oferta.descripcion}. Carreras: ${oferta.escuela_objetivo.join(", ")}`;
const embedding = await gemini.embedContent("text-embedding-004", texto); // vector(768)
// guardar en ofertas.embedding y luego query de similitud (ver skill supabase-conecta)
```

Para el perfil del egresado se hace lo mismo con su carrera + skills + experiencia, y se guarda en
`egresados.perfil_embedding`. La recomendación usa distancia coseno (`<=>`).

## Disparo de alertas (al publicar)

Tras guardar `estado='publicada'`, ejecuta el insert de `notificaciones` de la skill
`supabase-conecta`: matchea palabra clave (en título/descripción) y escuela. Una notificación por
egresado, evitando duplicados.

## Ejemplos

**Ejemplo 1 (ruido de tesis):**
Input: "RM TESIS busca INVESTIGADOR METODOLÓGICO para Derecho, Psicología e Ing. Industrial..."
Output: `{ "es_oferta": false, "es_ruido": true, "ruido_tesis": true, ... }` → panel sugiere descartar.

**Ejemplo 2 (oferta sin sueldo):**
Input: "Empresa X requiere Practicante de Marketing, modalidad presencial, enviar CV..."
Output: `tipo:"practica_pro"`, `escuela_objetivo:["Marketing"]`, `sueldo_min:null` →
`sueldo_visible=false`, se genera `mensaje_empleador`.

**Ejemplo 3 (oferta con rango):**
Input: "Analista de Sistemas, S/ 2,000 a S/ 2,500, remoto, cierre 30/06..."
Output: `sueldo_min:2000`, `sueldo_max:2500`, `modalidad:"remoto"`, `fecha_cierre:"2026-06-30"` →
`sueldo_visible=true`.

## Reglas

- Nunca inventar sueldos ni datos que no estén en el texto.
- Siempre devolver JSON válido; reintentar una vez si el parseo falla.
- La API key de IA solo en el servidor (Edge Function), jamás en el cliente.
- Generar embeddings solo al publicar, para cuidar la cuota gratuita.
