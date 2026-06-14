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
  "fecha_cierre": "2026-07-15"
}

Para ruido:
{
  "clasificacion": "ruido_tesis",
  "motivo_ruido": "Es una convocatoria para tesistas, no una oferta de empleo."
}

Texto a analizar:
`;
