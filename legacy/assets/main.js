/**
 * CONECTA UNSA — main.js
 * Datos mock y funciones utilitarias globales.
 * Importar con: <script src="assets/main.js"></script>
 * Acceder con: window.UNSA_DATA, window.formatSalary(), etc.
 */

/* ============================================================
   DATOS MOCK
   ============================================================ */
window.UNSA_DATA = {

  /* ── Egresados ─────────────────────────────────────────── */
  egresados: [
    {
      id: 'EGR-001',
      nombre: 'Lucía Fernández Torres',
      carrera: 'Ingeniería de Sistemas',
      facultad: 'Ingeniería de Producción y Servicios',
      anio_egreso: 2022,
      grado: 'Bachiller',
      habilidades: ['Python', 'JavaScript', 'React', 'SQL', 'Git', 'Node.js', 'Docker'],
      experiencia_anios: 2,
      expectativa_salarial_min: 3500,
      expectativa_salarial_max: 5000,
      ubicacion: 'Arequipa',
      perfil_completitud: 92,
      avatar_initials: 'LF',
      disponibilidad: 'Inmediata',
    },
    {
      id: 'EGR-002',
      nombre: 'Carlos Mamani Quispe',
      carrera: 'Medicina Humana',
      facultad: 'Medicina',
      anio_egreso: 2021,
      grado: 'Título Profesional',
      habilidades: ['Diagnóstico Clínico', 'Urgencias', 'Ecografía básica', 'Historia Clínica Digital', 'Inglés médico'],
      experiencia_anios: 3,
      expectativa_salarial_min: 4500,
      expectativa_salarial_max: 7000,
      ubicacion: 'Arequipa',
      perfil_completitud: 85,
      avatar_initials: 'CM',
      disponibilidad: '1 mes',
    },
    {
      id: 'EGR-003',
      nombre: 'Andrea Sucari Huanca',
      carrera: 'Ingeniería Civil',
      facultad: 'Ingeniería Civil',
      anio_egreso: 2023,
      grado: 'Bachiller',
      habilidades: ['AutoCAD', 'Civil 3D', 'S10', 'MS Project', 'Cómputo de obras', 'Topografía'],
      experiencia_anios: 1,
      expectativa_salarial_min: 2800,
      expectativa_salarial_max: 4000,
      ubicacion: 'Arequipa',
      perfil_completitud: 68,
      avatar_initials: 'AS',
      disponibilidad: 'Inmediata',
    },
    {
      id: 'EGR-004',
      nombre: 'Diego Paredes Cárdenas',
      carrera: 'Economía',
      facultad: 'Economía',
      anio_egreso: 2020,
      grado: 'Magister',
      habilidades: ['Econometría', 'STATA', 'R', 'Python', 'Finanzas públicas', 'Excel avanzado', 'Power BI'],
      experiencia_anios: 4,
      expectativa_salarial_min: 4000,
      expectativa_salarial_max: 6000,
      ubicacion: 'Lima',
      perfil_completitud: 95,
      avatar_initials: 'DP',
      disponibilidad: 'Negociable',
    },
    {
      id: 'EGR-005',
      nombre: 'Valeria Chávez Ríos',
      carrera: 'Ingeniería Ambiental',
      facultad: 'Ingeniería de Procesos',
      anio_egreso: 2023,
      grado: 'Bachiller',
      habilidades: ['ArcGIS', 'Muestreo ambiental', 'ISO 14001', 'AutoCAD', 'R', 'Gestión de residuos'],
      experiencia_anios: 1,
      expectativa_salarial_min: 2500,
      expectativa_salarial_max: 3500,
      ubicacion: 'Arequipa',
      perfil_completitud: 60,
      avatar_initials: 'VC',
      disponibilidad: 'Inmediata',
    },
  ],

  /* ── Empleos ────────────────────────────────────────────── */
  empleos: [
    {
      id: 'JOB-001',
      empresa: 'Yape | BCP',
      verificada: true,
      puesto: 'Desarrollador Backend Node.js',
      sector: 'Tecnología / Fintech',
      salario_min: 5000,
      salario_max: 7500,
      modalidad: 'Remoto',
      tipo_contrato: 'Planilla',
      ciudad: 'Lima / Remoto',
      habilidades_requeridas: ['Node.js', 'Python', 'Docker', 'SQL', 'Git', 'AWS'],
      carreras_objetivo: ['Ingeniería de Sistemas', 'Ingeniería de Software', 'Ciencias de la Computación'],
      compatibilidad_pct: 92,
      fecha_publicacion: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      descripcion: 'Buscamos desarrollador backend para escalar nuestros microservicios de pagos. Trabajarás en el core de Yape que procesa +4M transacciones diarias.',
    },
    {
      id: 'JOB-002',
      empresa: 'Gobierno Regional Arequipa',
      verificada: true,
      puesto: 'Especialista en Infraestructura Vial',
      sector: 'Sector Público',
      salario_min: 4200,
      salario_max: 5500,
      modalidad: 'Presencial',
      tipo_contrato: 'CAS',
      ciudad: 'Arequipa',
      habilidades_requeridas: ['AutoCAD', 'Civil 3D', 'S10', 'Topografía', 'MS Project'],
      carreras_objetivo: ['Ingeniería Civil', 'Ingeniería de Transportes'],
      compatibilidad_pct: 85,
      fecha_publicacion: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      descripcion: 'Supervisión técnica de proyectos de infraestructura vial en la región. Se requiere conocimiento de normativa del MTC y experiencia en campo.',
    },
    {
      id: 'JOB-003',
      empresa: 'Intercorp Retail',
      verificada: true,
      puesto: 'Analista de Datos / Business Intelligence',
      sector: 'Retail / Tecnología',
      salario_min: 4000,
      salario_max: 5800,
      modalidad: 'Híbrido',
      tipo_contrato: 'Planilla',
      ciudad: 'Lima / Remoto parcial',
      habilidades_requeridas: ['Power BI', 'SQL', 'Python', 'Excel avanzado', 'Econometría'],
      carreras_objetivo: ['Economía', 'Estadística', 'Ingeniería de Sistemas'],
      compatibilidad_pct: 78,
      fecha_publicacion: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      descripcion: 'Análisis de datos de ventas e inventario para la cadena Plaza Vea, Mass y Vivanda. Elaboración de dashboards ejecutivos y modelos predictivos.',
    },
    {
      id: 'JOB-004',
      empresa: 'EMED Clínica Arequipa',
      verificada: false,
      puesto: 'Médico General — Turno tarde',
      sector: 'Salud',
      salario_min: 3800,
      salario_max: 5200,
      modalidad: 'Presencial',
      tipo_contrato: 'Locación de servicios',
      ciudad: 'Arequipa',
      habilidades_requeridas: ['Diagnóstico Clínico', 'Urgencias', 'Historia Clínica Digital', 'Inglés médico'],
      carreras_objetivo: ['Medicina Humana'],
      compatibilidad_pct: 68,
      fecha_publicacion: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      descripcion: 'Atención de pacientes en consultorio externo y urgencias, turno de 12:00 a 20:00. Se valora experiencia en telemedicina.',
    },
    {
      id: 'JOB-005',
      empresa: 'Constructora Maqui S.A.C.',
      verificada: false,
      puesto: 'Asistente de obra — Proyecto habitacional',
      sector: 'Construcción',
      /* ⚠ Sin información salarial — ilustra el problema del 90% */
      salario_min: 0,
      salario_max: 0,
      modalidad: 'Presencial',
      tipo_contrato: 'A convenir',
      ciudad: 'Arequipa',
      habilidades_requeridas: ['AutoCAD', 'Cómputo de obras', 'Topografía'],
      carreras_objetivo: ['Ingeniería Civil', 'Arquitectura'],
      compatibilidad_pct: 55,
      fecha_publicacion: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
      descripcion: 'Apoyo al residente de obra en control de avance, materiales y subcontratistas. Proyecto residencial en Cayma.',
    },
    {
      id: 'JOB-006',
      empresa: 'SouthernPerú Copper',
      verificada: true,
      puesto: 'Especialista Ambiental — Área de operaciones',
      sector: 'Minería',
      salario_min: 5500,
      salario_max: 8000,
      modalidad: 'Presencial',
      tipo_contrato: 'Planilla',
      ciudad: 'Moquegua / Cuajone',
      habilidades_requeridas: ['ArcGIS', 'ISO 14001', 'Muestreo ambiental', 'Gestión de residuos', 'AutoCAD'],
      carreras_objetivo: ['Ingeniería Ambiental', 'Ingeniería de Minas', 'Biología'],
      compatibilidad_pct: 90,
      fecha_publicacion: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      descripcion: 'Monitoreo ambiental en zona de operaciones, elaboración de informes de cumplimiento ante el OEFA y gestión de planes de contingencia.',
    },
    {
      id: 'JOB-007',
      empresa: 'Agencia Digital Pixelone',
      verificada: false,
      puesto: 'Desarrollador Frontend React',
      sector: 'Tecnología / Agencia',
      /* ⚠ Sin información salarial — ilustra el problema del 90% */
      salario_min: 0,
      salario_max: 0,
      modalidad: 'Remoto',
      tipo_contrato: 'Recibo por honorarios',
      ciudad: 'Remoto',
      habilidades_requeridas: ['React', 'JavaScript', 'CSS', 'Git', 'Figma'],
      carreras_objetivo: ['Ingeniería de Sistemas', 'Diseño Digital', 'Computación'],
      compatibilidad_pct: 73,
      fecha_publicacion: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
      descripcion: 'Desarrollo de interfaces web para clientes del sector retail y educación. Trabajo por proyectos con posibilidad de permanencia.',
    },
    {
      id: 'JOB-008',
      empresa: 'Banco de la Nación',
      verificada: true,
      puesto: 'Economista — Unidad de Planificación',
      sector: 'Sector Público / Banca',
      salario_min: 4800,
      salario_max: 6200,
      modalidad: 'Presencial',
      tipo_contrato: 'Planilla',
      ciudad: 'Lima',
      habilidades_requeridas: ['Finanzas públicas', 'Excel avanzado', 'STATA', 'Econometría', 'Power BI'],
      carreras_objetivo: ['Economía', 'Administración de Empresas', 'Contabilidad'],
      compatibilidad_pct: 81,
      fecha_publicacion: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      descripcion: 'Análisis macroeconómico, elaboración de presupuesto institucional y seguimiento de metas de la Política Nacional de Inclusión Financiera.',
    },
  ],

  /* ── Empresas ───────────────────────────────────────────── */
  empresas: [
    {
      id: 'EMP-001',
      razon_social: 'Yape S.A. (Grupo BCP)',
      ruc: '20100047218',
      sector: 'Tecnología / Fintech',
      verificada: true,
      sello_unsa: true,
      vacantes_activas: 3,
    },
    {
      id: 'EMP-002',
      razon_social: 'Gobierno Regional de Arequipa',
      ruc: '20407851639',
      sector: 'Sector Público',
      verificada: true,
      sello_unsa: true,
      vacantes_activas: 7,
    },
    {
      id: 'EMP-003',
      razon_social: 'Southern Peru Copper Corporation',
      ruc: '20100063014',
      sector: 'Minería',
      verificada: true,
      sello_unsa: false,
      vacantes_activas: 2,
    },
    {
      id: 'EMP-004',
      razon_social: 'Constructora Maqui S.A.C.',
      ruc: '20454378901',
      sector: 'Construcción',
      verificada: false,
      sello_unsa: false,
      vacantes_activas: 1,
    },
  ],

  /* ── Métricas globales ──────────────────────────────────── */
  metricas: {
    total_egresados:           9179,
    empleos_reales_sem2025:    285,
    correos_enviados_sem2025:  736,
    ruido_informativo_pct:     27,     // % de ofertas que NO eran empleos reales
    vacantes_sin_salario_pct:  90,     // % de vacantes sin info salarial
    empresas_verificadas:      42,
    match_promedio:            73,     // % promedio de compatibilidad
  },
};

/* ============================================================
   FUNCIONES UTILITARIAS GLOBALES
   ============================================================ */

/**
 * Formatea el rango salarial de un empleo.
 * @param {number} min - Salario mínimo (0 = sin información)
 * @param {number} max - Salario máximo (0 = sin información)
 * @returns {string} Texto formateado o aviso de ausencia de datos
 */
window.formatSalary = function formatSalary(min, max) {
  if (!min && !max) return 'Sin información salarial';
  if (min && !max) return `S/ ${min.toLocaleString('es-PE')} / mes`;
  if (!min && max) return `S/ ${max.toLocaleString('es-PE')} / mes`;
  return `S/ ${min.toLocaleString('es-PE')} - S/ ${max.toLocaleString('es-PE')} / mes`;
};

/**
 * Devuelve la clase CSS de compatibilidad según el porcentaje.
 * @param {number} pct - Porcentaje de compatibilidad (0-100)
 * @returns {string} Clase CSS
 */
window.matchColor = function matchColor(pct) {
  if (pct >= 80) return 'match-score-high';
  if (pct >= 60) return 'match-score-mid';
  return 'match-score-low';
};

/**
 * Devuelve texto relativo desde una fecha ISO.
 * @param {string} fechaISO - Fecha en formato ISO 8601
 * @returns {string} Texto legible, ej: "hace 2 días"
 */
window.timeAgo = function timeAgo(fechaISO) {
  const now   = Date.now();
  const then  = new Date(fechaISO).getTime();
  const diffMs = now - then;

  const segundos = Math.floor(diffMs / 1000);
  const minutos  = Math.floor(segundos / 60);
  const horas    = Math.floor(minutos / 60);
  const dias     = Math.floor(horas / 24);
  const semanas  = Math.floor(dias / 7);
  const meses    = Math.floor(dias / 30);

  if (segundos < 60)  return 'hace un momento';
  if (minutos  < 60)  return `hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
  if (horas    < 24)  return `hace ${horas} hora${horas !== 1 ? 's' : ''}`;
  if (dias     < 7)   return `hace ${dias} día${dias !== 1 ? 's' : ''}`;
  if (semanas  < 5)   return `hace ${semanas} semana${semanas !== 1 ? 's' : ''}`;
  return `hace ${meses} mes${meses !== 1 ? 'es' : ''}`;
};

/**
 * Calcula las habilidades que coinciden y las que faltan entre
 * un egresado y un empleo.
 * @param {string[]} habilidadesEgresado
 * @param {string[]} habilidadesEmpleo
 * @returns {{ tiene: string[], falta: string[] }}
 */
window.diffSkills = function diffSkills(habilidadesEgresado, habilidadesEmpleo) {
  const egresadoSet = new Set(habilidadesEgresado.map(h => h.toLowerCase()));
  const tiene = habilidadesEmpleo.filter(h => egresadoSet.has(h.toLowerCase()));
  const falta = habilidadesEmpleo.filter(h => !egresadoSet.has(h.toLowerCase()));
  return { tiene, falta };
};

/**
 * Formatea un número grande con separadores locales.
 * @param {number} n
 * @returns {string}
 */
window.fmtNum = function fmtNum(n) {
  return n.toLocaleString('es-PE');
};

/* ── Log de arranque ────────────────────────────────────────── */
console.info(
  '%c CONECTA UNSA %c main.js cargado ✓  |  Egresados: %d  |  Empleos: %d',
  'background:#C0392B;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold',
  'color:#2C3E50',
  window.UNSA_DATA.egresados.length,
  window.UNSA_DATA.empleos.length
);
