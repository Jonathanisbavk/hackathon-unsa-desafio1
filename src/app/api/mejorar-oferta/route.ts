import { NextRequest, NextResponse } from "next/server";
import { mejorarOferta } from "@/lib/ai/pipeline";

// ═══════════════════════════════════════════════════════════════
// POST /api/mejorar-oferta
// Body: { texto_crudo: string }
// Response: OfertaExtraida + { proveedor: string, ms: number }
// ═══════════════════════════════════════════════════════════════

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { texto_crudo } = body;

    if (!texto_crudo || typeof texto_crudo !== "string") {
      return NextResponse.json(
        { error: "Se requiere el campo texto_crudo (string)." },
        { status: 400 }
      );
    }

    if (texto_crudo.trim().length < 20) {
      return NextResponse.json(
        { error: "El texto es demasiado corto para analizarlo." },
        { status: 400 }
      );
    }

    const inicio = Date.now();
    const resultado = await mejorarOferta(texto_crudo.trim());
    const ms = Date.now() - inicio;

    return NextResponse.json({ ...resultado, ms }, { status: 200 });
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : "Error interno del servidor.";
    console.error("[/api/mejorar-oferta] Error:", err);
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════
// GET /api/mejorar-oferta/test — Casos de prueba (solo en desarrollo)
// ═══════════════════════════════════════════════════════════════
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No disponible en producción." }, { status: 403 });
  }

  const CASOS_PRUEBA = [
    {
      nombre: "Caso 1: Ruido de tesis",
      texto: `CONVOCATORIA PARA TESISTAS
      
La empresa DataPeru S.A.C. busca un tesista de Ingeniería de Sistemas para desarrollar 
su tesis sobre "Implementación de Machine Learning para predicción de ventas".
      
Requisitos: Estar en el último año de carrera, tener interés en ML/IA.
El tesista no recibirá remuneración económica, solo apoyo con datos y equipos.
Contacto: rrhh@dataperu.com`,
    },
    {
      nombre: "Caso 2: Oferta sin sueldo",
      texto: `OFERTA LABORAL — DESARROLLADOR WEB JUNIOR

Empresa: TechSol Arequipa
Puesto: Desarrollador Web Full Stack Junior

Funciones:
- Desarrollo de aplicaciones web con React y Node.js
- Mantenimiento de plataformas existentes
- Trabajo en equipo ágil (Scrum)

Requisitos:
- Egresado de Ingeniería de Sistemas o afines
- Conocimiento en React, Node.js, PostgreSQL
- Inglés básico

Modalidad: Híbrido (3 días presencial, 2 remoto)
Empresa en Parque Industrial, Arequipa
Enviar CV a: empleos@techsol.pe hasta el 30 de junio`,
    },
    {
      nombre: "Caso 3: Oferta con rango salarial",
      texto: `ANALISTA DE DATOS — MINERA CERRO VERDE

Minera Cerro Verde S.A.A., operación de clase mundial en Arequipa, busca:

ANALISTA DE DATOS SR.

Responsabilidades:
- Análisis de datos operacionales de producción minera
- Creación de dashboards en Power BI y Tableau
- Modelos predictivos con Python (pandas, scikit-learn)
- Reportes para gerencia

Perfil requerido:
- Egresado de Ing. de Sistemas, Estadística o Ing. Industrial
- 1 a 2 años de experiencia en análisis de datos
- Manejo de SQL, Python, Power BI
- Disponibilidad para trabajo presencial en planta

Remuneración: Entre S/ 3,500 y S/ 4,800 + beneficios de ley
Modalidad: Presencial (planta Uchumayo, Arequipa)
Fecha límite de postulación: 15 de julio de 2026
Enviar CV a: seleccion@cerroverde.com.pe`,
    },
  ];

  const resultados = [];
  for (const caso of CASOS_PRUEBA) {
    try {
      const inicio = Date.now();
      const resultado = await mejorarOferta(caso.texto);
      resultados.push({
        nombre: caso.nombre,
        ok: true,
        resultado,
        ms: Date.now() - inicio,
      });
    } catch (err) {
      resultados.push({
        nombre: caso.nombre,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return NextResponse.json({ casos: resultados });
}
