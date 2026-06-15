// Inyecta ofertas de prueba en la BD vía /api/publicar-oferta.
// Requiere SUPABASE_SERVICE_ROLE_KEY en el entorno del servidor.
// Local:  API_URL=http://localhost:3000/api/publicar-oferta node scripts/seed-data.mjs

const API_URL = process.env.API_URL || "https://hackathon-unsa-desafio1.vercel.app/api/publicar-oferta";

const samples = [
  {
    texto_crudo: "Buscamos Desarrollador Frontend Junior. Egresado de Ing. Sistemas UNSA. React y Tailwind. Trabajo remoto full-time. Sueldo S/ 2500. Enviar CV a rrhh@techcorp.pe / WhatsApp 959111222.",
    es_ruido: false,
    oferta: {
      titulo: "Desarrollador Frontend Junior", empresa: "TechCorp Perú",
      escuela_objetivo: ["Ingeniería de Sistemas"], tipo: "empleo",
      descripcion: "Buscamos talento de la UNSA para unirse a nuestro equipo de frontend trabajando en proyectos internacionales.",
      requisitos: ["Conocimientos en React", "Conocimientos en Tailwind CSS", "Inglés técnico"],
      modalidad: "remoto", sueldo_min: 2500, sueldo_max: 2500, sueldo_visible: true,
      ciudad: "Arequipa", provincia: "Arequipa", distrito: "Remoto",
      tipo_empleo: "Full-time", nivel_jerarquia: "Junior", dirigido_a: ["Egresado"],
      contacto_nombre: "Equipo RR.HH.", contacto_email: "rrhh@techcorp.pe", contacto_telefono: "959111222",
    },
  },
  {
    texto_crudo: "Se requiere Ingeniero Civil asistente para obra en Majes. Experiencia de 1 año. Contacto: seleccion@constructorasur.pe, 958222333.",
    es_ruido: false,
    oferta: {
      titulo: "Ingeniero Civil Asistente", empresa: "Constructora del Sur",
      escuela_objetivo: ["Ingeniería Civil"], tipo: "empleo",
      descripcion: "Asistente de residente de obra para importante proyecto en Majes. Indispensable residir en Arequipa.",
      requisitos: ["Bachiller o Titulado en Ing. Civil", "1 año de experiencia en obras", "Disponibilidad para viajar"],
      modalidad: "presencial", sueldo_min: null, sueldo_max: null, sueldo_visible: false,
      ciudad: "Arequipa", provincia: "Caylloma", distrito: "Majes",
      tipo_empleo: "Full-time", nivel_jerarquia: "Junior", dirigido_a: ["Egresado"],
      contacto_nombre: "Oficina de Personal", contacto_email: "seleccion@constructorasur.pe", contacto_telefono: "958222333",
    },
  },
  {
    texto_crudo: "Practicante Pre Profesional de Contabilidad. Apoyo en libros electrónicos. Medio tiempo. RMV S/ 1024. Oficina en Yanahuara. practicas@medina.pe",
    es_ruido: false,
    oferta: {
      titulo: "Practicante Pre Profesional de Contabilidad", empresa: "Estudio Contable Medina",
      escuela_objetivo: ["Contabilidad"], tipo: "practica_pre",
      descripcion: "Buscamos estudiante de últimos ciclos para apoyo contable en estudio en Yanahuara.",
      requisitos: ["Estudiante de 8vo ciclo en adelante", "Manejo de Excel", "Proactividad"],
      modalidad: "presencial", sueldo_min: 1024, sueldo_max: 1024, sueldo_visible: true,
      ciudad: "Arequipa", provincia: "Arequipa", distrito: "Yanahuara",
      tipo_empleo: "Part-time", nivel_jerarquia: "Pasante/Interno", dirigido_a: ["Últimos años", "Prácticas"],
      contacto_nombre: "Estudio Contable Medina", contacto_email: "practicas@medina.pe", contacto_telefono: "957333444",
    },
  },
  {
    texto_crudo: "Empresa minera busca Geólogo Junior para campamento. Régimen 14x7. Sueldo S/ 4500 a S/ 5500. rrhh@mineraandina.pe",
    es_ruido: false,
    oferta: {
      titulo: "Geólogo Junior", empresa: "Minera Andina S.A.",
      escuela_objetivo: ["Ingeniería Geológica", "Ingeniería de Minas"], tipo: "empleo",
      descripcion: "Trabajo en campamento minero en régimen 14x7. Crecimiento profesional garantizado.",
      requisitos: ["Titulado en Geología", "Salud compatible con trabajo en altura", "Licencia de conducir"],
      modalidad: "presencial", sueldo_min: 4500, sueldo_max: 5500, sueldo_visible: true,
      ciudad: "Arequipa", provincia: "Caylloma", distrito: "Campamento",
      tipo_empleo: "Full-time", nivel_jerarquia: "Junior", dirigido_a: ["Egresado"],
      contacto_nombre: "Reclutamiento Minera Andina", contacto_email: "rrhh@mineraandina.pe", contacto_telefono: "956444555",
    },
  },
  {
    texto_crudo: "Se necesita Analista de Datos SR. Python, SQL, PowerBI. Sueldo confidencial. talento@bancoregional.pe",
    es_ruido: false,
    oferta: {
      titulo: "Analista de Datos Senior", empresa: "Banco Regional",
      escuela_objetivo: ["Ingeniería de Sistemas", "Ingeniería Industrial"], tipo: "empleo",
      descripcion: "Únete a la división de analítica avanzada. Modalidad híbrida.",
      requisitos: ["3+ años de experiencia", "Dominio de Python y SQL", "Power BI avanzado"],
      modalidad: "hibrido", sueldo_min: null, sueldo_max: null, sueldo_visible: false,
      ciudad: "Arequipa", provincia: "Arequipa", distrito: "José Luis Bustamante y Rivero",
      tipo_empleo: "Full-time", nivel_jerarquia: "Senior/Semi-senior", dirigido_a: ["Egresado"],
      contacto_nombre: "Selección Banco Regional", contacto_email: "talento@bancoregional.pe", contacto_telefono: "955555666",
    },
  },
  {
    texto_crudo: "Se vende departamento en Cayma, trato directo. 3 habitaciones. Llamar al 999888777",
    es_ruido: true,
    oferta: {
      titulo: "Venta de Departamento", empresa: "Ninguna", escuela_objetivo: [], tipo: "otro",
      descripcion: "Mensaje clasificado como ruido (venta de inmueble, no es empleo).",
      requisitos: [], modalidad: "presencial",
    },
  },
  {
    texto_crudo: "Requerimos Arquitecto para diseño de interiores. Recibo por honorarios S/ 2000 por proyecto. Híbrido. proyectos@arqarequipa.pe",
    es_ruido: false,
    oferta: {
      titulo: "Arquitecto / Diseño de Interiores", empresa: "Estudio ARQ Arequipa",
      escuela_objetivo: ["Arquitectura"], tipo: "empleo",
      descripcion: "Desarrollo de planos y renders para proyectos residenciales.",
      requisitos: ["Manejo de AutoCAD y SketchUp", "Portafolio de diseños", "Creatividad"],
      modalidad: "hibrido", sueldo_min: 2000, sueldo_max: 2000, sueldo_visible: true,
      ciudad: "Arequipa", provincia: "Arequipa", distrito: "Arequipa (Cercado)",
      tipo_empleo: "Freelance", nivel_jerarquia: "Junior", dirigido_a: ["Egresado"],
      contacto_nombre: "Estudio ARQ Arequipa", contacto_email: "proyectos@arqarequipa.pe", contacto_telefono: "954666777",
    },
  },
  {
    texto_crudo: "¡Hola Egresados UNSA! Los invitamos al diplomado de Gestión Pública que inicia este sábado.",
    es_ruido: true,
    oferta: {
      titulo: "Invitación a Diplomado", empresa: "Instituto de Educación Continua", escuela_objetivo: [], tipo: "otro",
      descripcion: "Mensaje clasificado como ruido (publicidad de curso, no es oferta laboral).",
      requisitos: [], modalidad: "presencial",
    },
  },
  {
    texto_crudo: "Enfermera licenciada para tópico de colegio particular. Horario de mañana. Sueldo a tratar. admin@colegiosanfrancisco.pe",
    es_ruido: false,
    oferta: {
      titulo: "Enfermera Licenciada", empresa: "Colegio San Francisco",
      escuela_objetivo: ["Enfermería"], tipo: "empleo",
      descripcion: "Atención primaria en tópico escolar para alumnos de inicial y primaria.",
      requisitos: ["Licenciatura en Enfermería", "Colegiatura vigente", "Paciencia con niños"],
      modalidad: "presencial", sueldo_min: null, sueldo_max: null, sueldo_visible: false,
      ciudad: "Arequipa", provincia: "Arequipa", distrito: "Arequipa (Cercado)",
      tipo_empleo: "Part-time", nivel_jerarquia: "Junior", dirigido_a: ["Egresado"],
      contacto_nombre: "Dirección Colegio San Francisco", contacto_email: "admin@colegiosanfrancisco.pe", contacto_telefono: "953777888",
    },
  },
  {
    texto_crudo: "Buscamos Community Manager Junior para agencia digital. Remoto full time. Sueldo S/ 1200. hola@agenciaclick.pe",
    es_ruido: false,
    oferta: {
      titulo: "Community Manager Junior", empresa: "Agencia Digital Click",
      escuela_objetivo: ["Comunicación Social"], tipo: "empleo",
      descripcion: "Manejo de redes sociales para clientes del rubro gastronómico.",
      requisitos: ["Conocimiento de Illustrator y Premiere", "Buena ortografía", "Egresado reciente"],
      modalidad: "remoto", sueldo_min: 1200, sueldo_max: 1200, sueldo_visible: true,
      ciudad: "Arequipa", provincia: "Arequipa", distrito: "Remoto",
      tipo_empleo: "Full-time", nivel_jerarquia: "Junior", dirigido_a: ["Egresado", "Últimos años"],
      contacto_nombre: "Agencia Digital Click", contacto_email: "hola@agenciaclick.pe", contacto_telefono: "952888999",
    },
  },
];

async function seedData() {
  console.log(`🚀 Inyectando ${samples.length} registros a ${API_URL}...`);
  let ok = 0;
  for (let i = 0; i < samples.length; i++) {
    const item = samples[i];
    console.log(`\n[${i + 1}/${samples.length}] ${item.oferta.titulo}`);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) {
        console.error(`❌ HTTP ${res.status}:`, await res.text());
        continue;
      }
      const data = await res.json();
      console.log(`✅ ID: ${data.oferta_id} | Estado: ${data.estado}`);
      ok++;
    } catch (error) {
      console.error("❌ Error en fetch:", error.message);
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  console.log(`\n🎉 Finalizado. ${ok}/${samples.length} insertados.`);
}

seedData();
