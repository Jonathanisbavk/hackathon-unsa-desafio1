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

// ── Filtros del buscador ──────────────────────────────────────────────────────
// Tipo de empleo / jornada (eje distinto de TIPOS_OFERTA).
export const TIPOS_EMPLEO = [
  "Full-time",
  "Part-time",
  "Pasantía",
  "Freelance",
  "Práctica",
  "Eventual",
] as const;

// Jerarquía / nivel del puesto que publica el empleador.
export const NIVELES_JERARQUIA = [
  "Gerencia/Alta Gerencia/Dirección",
  "Jefe/Supervisor/Responsable",
  "Senior/Semi-senior",
  "Junior",
  "Pasante/Interno",
  "Primer Empleo",
  "No requiere",
] as const;

// Estado de educación al que va dirigida la oferta.
export const ESTADOS_EDUCACION = [
  "Pre-grado",
  "Egresado",
  "Últimos años",
  "Prácticas",
  "Voluntariado",
] as const;

// Ubicaciones frecuentes (Arequipa) para el combobox de ubicación.
export const UBICACIONES_AREQUIPA = [
  "Arequipa (Cercado)",
  "Cayma",
  "Yanahuara",
  "Cerro Colorado",
  "José Luis Bustamante y Rivero",
  "Paucarpata",
  "Miraflores",
  "Mariano Melgar",
  "Sachaca",
  "Socabaya",
  "Hunter",
  "Alto Selva Alegre",
  "Characato",
  "Tiabaya",
  "Majes",
  "Mollendo (Islay)",
  "Camaná",
  "Remoto",
] as const;

export type TipoEmpleo = (typeof TIPOS_EMPLEO)[number];
export type NivelJerarquia = (typeof NIVELES_JERARQUIA)[number];
export type EstadoEducacion = (typeof ESTADOS_EDUCACION)[number];

// Años de egreso: desde el actual hacia atrás (incluye "antes" para los más antiguos).
const ANIO_ACTUAL = new Date().getFullYear();
export const ANIOS_EGRESO: number[] = Array.from(
  { length: 16 },
  (_, i) => ANIO_ACTUAL - i,
);
