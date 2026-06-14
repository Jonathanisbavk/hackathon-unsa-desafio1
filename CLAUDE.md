# CONECTA UNSA — Contexto del proyecto

Plataforma de intermediación laboral para egresados de la Universidad Nacional de San Agustín
(UNSA, Arequipa, Perú). Desafío de la Hackatón Transformagob 2026. Objetivo: que cada egresado
reciba solo ofertas relevantes a su perfil, con información salarial clara, desde un canal
institucional confiable. Alineado a los ODS 4 y 8 y al marco de Software Público peruano.

## Principios no negociables (del desafío)

- NO reemplazar ni modificar los sistemas institucionales de la UNSA. La plataforma es un canal
  paralelo que **lee y procesa**, no integra a la fuerza.
- NO gestionar procesos de selección ni pagos/contratos.
- NO crear una red social universitaria.
- Costo de operación ~USD 0: solo tiers gratuitos. Es para una institución pública.

## Stack (todo gratis / freemium)

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS. Deploy en Vercel (free).
- **Backend/DB:** Supabase (free) — Postgres + Auth + pgvector + Edge Functions. (MCP conectado)
- **IA:** Google Gemini API (tier gratuito) para clasificar/extraer/mejorar y para embeddings.
  Alternativa: Groq con Llama (gratis) si se agota la cuota de Gemini.
- **Notificaciones:** in-app + email (Resend free / Supabase). Telegram opcional.
- **Repo:** GitHub (MCP conectado).

## Alcance del MVP (3 features priorizadas)

1. **Onboarding + alertas por palabra clave (lado egresado).**
   En el onboarding el egresado elige qué escuelas/tipos de oferta quiere recibir. En cada
   búsqueda aparece un botón "Crear alerta de trabajo" con esa palabra clave; cuando se publica
   una oferta que hace match, se le notifica.

2. **Transparencia salarial (lado egresado + nudge al empleador).**
   El egresado puede activar el filtro "Mostrar solo ofertas con sueldo". Las ofertas sin sueldo
   quedan ocultas para quien filtra → eso reduce su visibilidad. El sistema avisa al empleador
   (mensaje generado para que el admin lo reenvíe) que sin sueldo su oferta pierde visibilidad.

3. **Panel de administrador ultra simple: Pegar → Mejorar → Publicar.**
   El admin solo pega el texto crudo del correo de la oferta. "Mejorar" corre la IA (clasifica,
   extrae, estandariza, detecta sueldo faltante). "Publicar" la guarda y dispara alertas/matching.
   Tres botones, nada más.

## Filosofía de UX

Fácil e intuitivo, responsive, pocos botones. Nada de pantallas saturadas. Si una acción se puede
inferir o automatizar, se automatiza. El admin no debería necesitar capacitación para usarlo.

## Cómo trabajar en este repo

- Antes de tocar la base de datos, lee la skill `supabase-conecta` (esquema, RLS, convenciones).
- Para el pipeline de IA (botón Mejorar, matching, alertas), lee la skill `offer-improver`.
- Para visión general, scope y decisiones de producto, lee la skill `conecta-unsa-core`.
- Usa los agentes `frontend-dev`, `backend-dev`, `ai-pipeline-dev` para tareas especializadas.
- Datos en español (campos de BD en español para reflejar el dominio). Código y commits claros.
- Usa el MCP de Supabase para migraciones y queries; el MCP de GitHub para commits/PRs.
