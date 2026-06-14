---
name: conecta-unsa-core
description: >
  Contexto maestro del proyecto CONECTA UNSA (plataforma de empleo para egresados de la UNSA,
  Hackatón Transformagob 2026). Úsala SIEMPRE al empezar cualquier tarea de este repo: decisiones
  de producto, alcance del MVP, restricciones del desafío, las 3 features priorizadas (onboarding
  + alertas, transparencia salarial, panel admin Pegar/Mejorar/Publicar), criterios de UX y reglas
  de "costo cero". Actívala incluso si la tarea parece solo técnica, para no romper el alcance.
---

# CONECTA UNSA — Núcleo del producto

## El problema (evidencia real del Lab UNSA, semestre 2025-2)

- 736 correos enviados a 9,179 usuarios; solo **285 eran oportunidades reales** (el resto reenvíos).
- **27% de ruido**: 95 correos no laborales (webinars, ferias, admisión a posgrados, encuestas).
- **90% de vacantes sin sueldo**: de 285, solo 25 con monto exacto y 5 con rango.
- El **25% de empleadores** (sobre todo "empresas de tesis": RM Tesis, Tesis Solutions, etc.)
  genera el **60% del volumen** publicando "Investigador" segmentado por cada carrera.
- Cero segmentación por carrera → el egresado se va a Computrabajo/LinkedIn.
- Cita del egresado: "ya ni los abro; la mayoría no tiene nada que ver con mi carrera y no dicen
  cuánto pagan".

## Los 3 dolores → las 3 features del MVP

| Dolor | Feature MVP | Quién lo usa |
|---|---|---|
| Ruido + sin segmentación | Onboarding de preferencias + alertas por palabra clave | Egresado |
| Opacidad salarial | Filtro "solo con sueldo" + nudge de visibilidad al empleador | Egresado + Admin |
| Gestión manual y lenta | Panel admin Pegar → Mejorar → Publicar | Admin |

### Feature 1 — Onboarding + alertas
- En el **onboarding** el egresado elige: escuela(s) profesional(es) de interés, tipos de oferta
  (práctica preprofesional / práctica profesional / empleo), modalidad, y si quiere solo ofertas
  con sueldo. Pocos selectores, máximo 3 pasos.
- En **cada búsqueda**, junto a los resultados aparece "🔔 Crear alerta para '{palabra}'".
- Al **publicarse** una oferta que matchea una alerta (palabra clave + escuela), se notifica.

### Feature 2 — Transparencia salarial
- Toggle del egresado: "Mostrar solo ofertas con sueldo".
- Ofertas con `sueldo_visible = false` se ocultan a quien filtra → **menos visibilidad**.
- Cada oferta sin sueldo muestra badge "Sueldo no especificado".
- El admin recibe, tras "Mejorar", un **mensaje listo para reenviar al empleador**: sin sueldo la
  oferta pierde alcance. Es un nudge, no un bloqueo (no gestionamos al empleador directamente).

### Feature 3 — Panel admin: 3 botones
- Una sola pantalla. Un `<textarea>` grande: "Pega aquí el texto del correo de la oferta".
- **Pegar**: pega desde el portapapeles (atajo, no obligatorio).
- **Mejorar**: corre el pipeline de IA (ver skill `offer-improver`) → muestra una vista previa
  estandarizada + advertencia si falta sueldo.
- **Publicar**: guarda la oferta, genera embedding, dispara alertas y matching.
- Si "Mejorar" detecta que el texto es **ruido** (webinar, tesis spam), lo avisa y sugiere descartar.

## Restricciones del desafío (rómpelas y se sale del alcance)

1. No reemplazar/modificar sistemas institucionales de la UNSA.
2. No gestionar selección de personal ni pagos/contratos.
3. No red social de propósito general.
4. Operación a costo ~USD 0 (tiers gratuitos), por ser institución pública.

## Criterios de UX

- Pocos botones, responsive, lenguaje claro en español.
- Preferir automatizar/inferir sobre pedir datos.
- Admin sin necesidad de capacitación.
- Accesible (contraste, labels, navegable por teclado).

## Métricas de éxito para demo de hackatón

- % de ruido filtrado automáticamente (meta: eliminar el ~27%).
- % de ofertas publicadas con sueldo (meta: subir desde 10%).
- Tiempo del admin por oferta (meta: < 30 s con los 3 botones).
- Ofertas que llegan al egresado correcto por match de carrera/alerta.

## Dónde seguir

- Esquema de datos, RLS y queries → skill `supabase-conecta`.
- Pipeline de IA (Mejorar, clasificación, extracción, matching) → skill `offer-improver`.
