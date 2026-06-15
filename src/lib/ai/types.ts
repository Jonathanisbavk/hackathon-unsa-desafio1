// Tipos del pipeline de IA
export type ClasificacionOferta = "oferta" | "ruido" | "ruido_tesis";
export type TipoOfertaIA = "practica_pre" | "practica_pro" | "empleo";
export type ModalidadIA = "presencial" | "remoto" | "hibrido";

export interface OfertaExtraida {
  clasificacion: ClasificacionOferta;
  motivo_ruido?: string; // si es ruido, explica por qué
  titulo?: string;
  empresa?: string;
  escuela_objetivo?: string[];
  tipo?: TipoOfertaIA;
  descripcion?: string;
  requisitos?: string[];
  modalidad?: ModalidadIA | null;
  sueldo_min?: number | null;
  sueldo_max?: number | null;
  sueldo_visible: boolean;
  fecha_cierre?: string | null; // ISO date string
  // Ubicación
  ciudad?: string | null;
  provincia?: string | null;
  distrito?: string | null;
  // Filtros adicionales
  tipo_empleo?: string | null; // Full-time, Part-time, Pasantía, Freelance, Práctica, Eventual
  nivel_jerarquia?: string | null; // Gerencia.., Jefe.., Senior/Semi-senior, Junior, Pasante/Interno, Primer Empleo, No requiere
  dirigido_a?: string[]; // Pre-grado, Egresado, Últimos años, Prácticas, Voluntariado
  // Contacto
  contacto_nombre?: string | null;
  contacto_email?: string | null;
  contacto_telefono?: string | null;
  mensaje_empleador?: string; // generado si no hay sueldo
}

export const PROMPT_EXTRACCION = `Eres un asistente especializado en clasificar y extraer información de correos sobre ofertas laborales para egresados universitarios de la UNSA (Universidad Nacional de San Agustín, Arequipa, Perú).

Dado el siguiente texto, realiza dos tareas:

## TAREA 1: CLASIFICAR
Determina si el texto es:
- "oferta": Una oferta laboral real (práctica pre-profesional, práctica profesional, o empleo).
- "ruido_tesis": Una convocatoria para tesistas, investigadores o similares (no es empleo).
- "ruido": Cualquier otro contenido que no sea una oferta laboral (seminarios, actividades, spam, etc.).

## TAREA 2: EXTRAER (solo si es "oferta")
Extrae los siguientes campos en JSON estricto:
- titulo: string — título del puesto
- empresa: string — nombre de la empresa u organización
- escuela_objetivo: string[] — lista de escuelas/carreras a las que aplica (ejemplo: ["Ingeniería de Sistemas", "Ingeniería Industrial"])
- tipo: "practica_pre" | "practica_pro" | "empleo" — tipo de oferta
- descripcion: string — descripción del puesto y responsabilidades
- requisitos: string[] — lista de requisitos (máximo 8)
- modalidad: "presencial" | "remoto" | "hibrido" | null
- sueldo_min: number | null — sueldo mínimo en soles (S/)
- sueldo_max: number | null — sueldo máximo en soles (S/)
- fecha_cierre: string | null — fecha límite en formato YYYY-MM-DD
- ciudad: string | null — ciudad (ej: "Arequipa", "Lima")
- provincia: string | null — provincia
- distrito: string | null — distrito (ej: "Cayma", "Yanahuara"). Si dice "remoto", usa null
- tipo_empleo: string | null — jornada/contrato, UNO de: "Full-time", "Part-time", "Pasantía", "Freelance", "Práctica", "Eventual"
- nivel_jerarquia: string | null — UNO de: "Gerencia/Alta Gerencia/Dirección", "Jefe/Supervisor/Responsable", "Senior/Semi-senior", "Junior", "Pasante/Interno", "Primer Empleo", "No requiere"
- dirigido_a: string[] — a quién va dirigida, valores de: "Pre-grado", "Egresado", "Últimos años", "Prácticas", "Voluntariado"
- contacto_nombre: string | null — nombre de la persona/área de contacto
- contacto_email: string | null — correo para postular
- contacto_telefono: string | null — teléfono/WhatsApp para postular

Para los campos de listas controladas (tipo_empleo, nivel_jerarquia, dirigido_a) usa EXACTAMENTE
los valores indicados; si no hay evidencia, usa null (o [] en dirigido_a). No inventes contactos.

## RESPUESTA REQUERIDA
Responde ÚNICAMENTE con JSON válido, sin markdown, sin explicaciones. Formato:

Para "oferta":
{
  "clasificacion": "oferta",
  "titulo": "...",
  "empresa": "...",
  "escuela_objetivo": ["..."],
  "tipo": "practica_pre",
  "descripcion": "...",
  "requisitos": ["..."],
  "modalidad": "presencial",
  "sueldo_min": 1200,
  "sueldo_max": null,
  "fecha_cierre": "2026-07-15",
  "ciudad": "Arequipa",
  "provincia": "Arequipa",
  "distrito": "Cayma",
  "tipo_empleo": "Práctica",
  "nivel_jerarquia": "Pasante/Interno",
  "dirigido_a": ["Últimos años", "Prácticas"],
  "contacto_nombre": "Área de RR.HH.",
  "contacto_email": "rrhh@empresa.pe",
  "contacto_telefono": "959123456"
}

Para ruido:
{
  "clasificacion": "ruido_tesis",
  "motivo_ruido": "Es una convocatoria para tesistas, no una oferta de empleo."
}

Texto a analizar:
`;

// ── CV del egresado ───────────────────────────────────────────────────────────
export interface CVExtraido {
  nombre?: string;
  carrera?: string; // escuela profesional inferida
  anios_experiencia?: number;
  skills: string[];
  resumen: string; // 1-2 frases legibles del perfil
  palabras_clave: string[]; // términos para alertas/matching
}

export const PROMPT_CV = `Eres un asistente que extrae el perfil profesional de un CV de un egresado de la UNSA (Arequipa, Perú).

Dado el texto plano de un CV, extrae en JSON estricto (sin markdown, sin explicaciones):
- nombre: string — nombre completo del egresado (si aparece)
- carrera: string — escuela profesional / carrera principal (ej: "Ingeniería de Sistemas")
- anios_experiencia: number — años aproximados de experiencia laboral (0 si es recién egresado)
- skills: string[] — habilidades técnicas y blandas concretas (máximo 12, sin duplicados)
- resumen: string — 1 o 2 frases claras describiendo el perfil
- palabras_clave: string[] — entre 5 y 10 términos clave para buscar ofertas afines (tecnologías, roles, áreas)

Si un campo no se puede determinar, usa "" para strings, 0 para números o [] para listas. Nunca inventes datos.

Formato de respuesta:
{
  "nombre": "...",
  "carrera": "...",
  "anios_experiencia": 0,
  "skills": ["..."],
  "resumen": "...",
  "palabras_clave": ["..."]
}

Texto del CV a analizar:
`;
