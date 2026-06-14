import { extraerConGemini } from "./gemini";
import { extraerConGroq } from "./groq";
import type { OfertaExtraida } from "./types";

/**
 * Pipeline principal de extracción de ofertas.
 * 1. Intenta con Gemini 2.0 Flash
 * 2. Si falla, usa Groq Llama 3.1 como fallback
 * 3. Post-procesa: deriva sueldo_visible y genera mensaje_empleador
 */
export async function mejorarOferta(textoCrudo: string): Promise<OfertaExtraida & { proveedor: string }> {
  let resultado: OfertaExtraida;
  let proveedor: string;

  // Intentar con Gemini primero
  try {
    const gemini = await extraerConGemini(textoCrudo);
    const { modelo, ...resto } = gemini;
    resultado = resto;
    proveedor = modelo;
    console.log(`[ai] Extracción exitosa con Gemini (${modelo}).`);
  } catch (errGemini) {
    console.warn("[ai] Gemini falló, activando fallback Groq:", errGemini);
    if (!process.env.GROQ_API_KEY) {
      const msg = errGemini instanceof Error ? errGemini.message : String(errGemini);
      throw new Error(
        `Gemini falló y no hay GROQ_API_KEY configurada como respaldo. ${msg}`
      );
    }
    try {
      resultado = await extraerConGroq(textoCrudo);
      proveedor = "groq-llama-3.1-70b";
      console.log("[ai] Extracción exitosa con Groq (fallback).");
    } catch (errGroq) {
      console.error("[ai] Ambos proveedores fallaron. Groq error:", errGroq);
      throw new Error("Ambos proveedores de IA no disponibles. Verifica GEMINI_API_KEY y GROQ_API_KEY.");
    }
  }

  // Post-procesado
  const sueldo_visible = !!(resultado.sueldo_min || resultado.sueldo_max);
  resultado.sueldo_visible = sueldo_visible;

  // Si es una oferta sin sueldo, generar mensaje_empleador
  if (resultado.clasificacion === "oferta" && !sueldo_visible && !resultado.mensaje_empleador) {
    resultado.mensaje_empleador = generarMensajeEmpleador(resultado.empresa, resultado.titulo);
  }

  return { ...resultado, proveedor };
}

/**
 * Genera un mensaje amigable para el empleador cuando no especifica el sueldo.
 * El admin lo puede copiar y reenviar.
 */
function generarMensajeEmpleador(empresa?: string, titulo?: string): string {
  const nombreEmpresa = empresa || "su organización";
  const nombrePuesto = titulo || "el puesto";

  return `Estimado equipo de ${nombreEmpresa},

Hemos recibido su oferta para "${nombrePuesto}" y nos gustaría publicarla en CONECTA UNSA, la plataforma oficial de empleo para egresados de la UNSA.

Para maximizar la visibilidad de su oferta, le recomendamos incluir el rango salarial. Las ofertas con sueldo especificado reciben significativamente más postulaciones, ya que nuestros egresados pueden filtrar y encontrar oportunidades que se ajusten a sus expectativas.

Sin el sueldo, su oferta perderá visibilidad para los candidatos que utilizan el filtro de transparencia salarial.

¿Podría enviarnos el rango salarial para esta posición? Puede ser aproximado (Ej: S/ 1,200 – S/ 1,800).

Quedamos a su disposición.

Atentamente,
Equipo CONECTA UNSA`;
}
