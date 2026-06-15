// Tipo de dominio canónico de una oferta publicada.
// Vive aquí (y no dentro de un componente) para que el feed, el modal de detalle,
// las recomendaciones y cualquier query compartan una única fuente de verdad.

export interface Oferta {
  id: string;
  titulo: string;
  empresa?: string | null;
  descripcion?: string | null;
  tipo?: string | null;
  tipo_empleo?: string | null;
  modalidad?: string | null;
  nivel_jerarquia?: string | null;
  ciudad?: string | null;
  provincia?: string | null;
  distrito?: string | null;
  sueldo_visible?: boolean;
  sueldo_min?: number | null;
  sueldo_max?: number | null;
  requisitos?: string[] | null;
  escuela_objetivo?: string[] | null;
  dirigido_a?: string[] | null;
  fecha_cierre?: string | null;
  contacto_nombre?: string | null;
  contacto_email?: string | null;
  contacto_telefono?: string | null;
  estado?: string | null;
  created_at?: string | null;
}

/** Oferta devuelta por el matching por embeddings: incluye el score de similitud. */
export interface OfertaConSimilitud extends Oferta {
  similitud?: number;
}

/** Preferencias del egresado guardadas en el onboarding (tabla `preferencias`). */
export interface Preferencias {
  egresado_id?: string;
  escuelas_interes?: string[] | null;
  tipos_oferta?: string[] | null;
  modalidades?: string[] | null;
  solo_con_sueldo?: boolean | null;
  updated_at?: string | null;
}
