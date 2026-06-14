// Tipos compartidos del dominio CONECTA UNSA
export const ESCUELAS = [
  "Ingeniería de Sistemas",
  "Ingeniería Industrial",
  "Ingeniería Civil",
  "Ingeniería Mecánica",
  "Ingeniería Electrónica",
  "Ingeniería Química",
  "Administración de Empresas",
  "Contabilidad",
  "Economía",
  "Derecho",
  "Medicina Humana",
  "Enfermería",
  "Arquitectura",
  "Comunicación Social",
  "Psicología",
  "Educación",
  "Biología",
  "Física",
  "Matemática",
  "Química",
] as const;

export const TIPOS_OFERTA = [
  { value: "practica_pre", label: "Práctica Pre-Profesional" },
  { value: "practica_pro", label: "Práctica Profesional" },
  { value: "empleo", label: "Empleo" },
] as const;

export const MODALIDADES = [
  { value: "presencial", label: "Presencial" },
  { value: "remoto", label: "Remoto" },
  { value: "hibrido", label: "Híbrido" },
] as const;

export type TipoOferta = (typeof TIPOS_OFERTA)[number]["value"];
export type Modalidad = (typeof MODALIDADES)[number]["value"];
