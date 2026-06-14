import { PROMPT_EXTRACCION, type OfertaExtraida } from "./types";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Llama a Gemini 2.0 Flash para clasificar y extraer campos de una oferta.
 * Lanza un error si falla (para que el caller active el fallback).
 */
export async function extraerConGemini(textoCrudo: string): Promise<OfertaExtraida> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY no configurada.");

  const prompt = PROMPT_EXTRACCION + "\n" + textoCrudo;

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,       // baja temperatura = respuestas más deterministas
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${txt}`);
  }

  const data = await res.json();
  const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;
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
