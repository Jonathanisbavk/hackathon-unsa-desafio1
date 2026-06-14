import { PROMPT_EXTRACCION, type OfertaExtraida } from "./types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
// Llama 3.1 70B — tier gratuito de Groq, muy capaz para extracción
const GROQ_MODEL = "llama-3.1-70b-versatile";

/**
 * Fallback a Groq (Llama 3.1 70B) si Gemini falla.
 * Usa la API compatible con OpenAI de Groq.
 */
export async function extraerConGroq(textoCrudo: string): Promise<OfertaExtraida> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY no configurada.");

  const prompt = PROMPT_EXTRACCION + "\n" + textoCrudo;

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Eres un extractor experto de ofertas laborales universitarias. Responde SIEMPRE con JSON válido y nada más.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Groq API error ${res.status}: ${txt}`);
  }

  const data = await res.json();
  const texto = data?.choices?.[0]?.message?.content;
  if (!texto) throw new Error("Groq devolvió una respuesta vacía.");

  const raw = JSON.parse(texto);
  const sueldo_visible = !!(raw.sueldo_min || raw.sueldo_max);

  return { ...raw, sueldo_visible } as OfertaExtraida;
}
