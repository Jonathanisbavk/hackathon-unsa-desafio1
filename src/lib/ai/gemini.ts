import { PROMPT_EXTRACCION, type OfertaExtraida } from "./types";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Llama a Gemini 2.0 Flash para clasificar y extraer campos de una oferta.
 * Lanza un error si falla (para que el caller active el fallback).
 */
export async function extraerConGemini(textoCrudo: string): Promise<OfertaExtraida> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY no configurada.");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    }
  });

  const prompt = PROMPT_EXTRACCION + "\n" + textoCrudo;
  const result = await model.generateContent(prompt);
  const texto = result.response.text();
  
  if (!texto) throw new Error("Gemini devolvió una respuesta vacía.");

  return parsearRespuesta(texto);
}

function parsearRespuesta(texto: string): OfertaExtraida {
  // Limpiar posibles restos de markdown
  const limpio = texto.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const raw = JSON.parse(limpio);

  const sueldo_visible = !!(raw.sueldo_min || raw.sueldo_max);

  return {
    ...raw,
    sueldo_visible,
  } as OfertaExtraida;
}
