// Tipos compartidos del dominio CONECTA UNSA
export const ESCUELAS = [
  // ── ÁREA DE INGENIERÍAS ──
  // Facultad de Ingeniería de Procesos
  "Ingeniería Química",
  "Ingeniería Ambiental",
  "Ingeniería de Materiales",
  "Ingeniería Metalúrgica",
  "Ingeniería de Industrias Alimentarias",
  // Facultad de Ingeniería de Producción y Servicios
  "Ingeniería de Sistemas",
  "Ingeniería Eléctrica",
  "Ingeniería Electrónica",
  "Ingeniería Mecánica",
  "Ingeniería Industrial",
  "Ciencia de la Computación",
  "Ingeniería de Telecomunicaciones",
  // Facultad de Geología, Geofísica y Minas
  "Ingeniería Geofísica",
  "Ingeniería Geológica",
  "Ingeniería de Minas",
  // Facultad de Ingeniería Civil
  "Ingeniería Civil",
  "Ingeniería Sanitaria",
  // Facultad de Ciencias Naturales y Formales
  "Física",
  "Matemáticas",
  "Química",
  // Facultad de Arquitectura
  "Arquitectura",

  // ── ÁREA DE BIOMÉDICAS ──
  // Facultad de Ciencias Biológicas
  "Biología",
  "Ciencias de la Nutrición",
  "Ingeniería Pesquera",
  // Facultad de Medicina
  "Medicina Humana",
  // Facultad de Enfermería
  "Enfermería",
  // Facultad de Agronomía
  "Agronomía",

  // ── ÁREA DE SOCIALES ──
  // Facultad de Ciencias Contables y Financieras
  "Contabilidad",
  "Finanzas",
  // Facultad de Economía
  "Economía",
  // Facultad de Derecho
  "Derecho",
  // Facultad de Ciencias Histórico Sociales
  "Trabajo Social",
  "Antropología",
  "Turismo y Hotelería",
  "Sociología",
  "Historia",
  // Facultad de Psicología RRII Cs. de la Comunicación
  "Psicología",
  "Relaciones Industriales",
  "Ciencias de la Comunicación",
  "Periodismo",
  "Relaciones Públicas",
  // Facultad de Filosofía y Humanidades
  "Filosofía",
  "Literatura y Lingüística",
  "Artes Especialidad de Plásticas",
  "Artes Especialidad de Música",
  // Facultad de Administración
  "Administración",
  "Marketing",
  "Banca y Seguros",
  "Gestión Pública",
  "Gestión de Empresas",
  "Gestión de Proyectos",
  // Facultad de Educación
  "Esp. Ciencias Naturales",
  "Esp. Ciencias Sociales",
  "Esp. Informática Educativa",
  "Esp. Educación Física",
  "Esp. Educación Inicial",
  "Esp. Educación Primaria",
  "Esp. Físico Matemática",
  "Esp. Lengua, Literatura, Filosofía y Psicología",
  "Esp. Idiomas (Inglés-Francés)",
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
