import { PROMPT_EXTRACCION, type OfertaExtraida } from "./types";
import { GoogleGenerativeAI } from "@google/generative-ai";

/** Modelos en orden de preferencia (2.0 Flash fue deprecado jun 2026). */
const MODELOS_GEMINI = [
  process.env.GEMINI_MODEL,
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
].filter((m): m is string => Boolean(m));

const MAX_REINTENTOS = 3;

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function esErrorReintentable(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("429") ||
    msg.includes("503") ||
    msg.includes("quota") ||
    msg.includes("rate limit") ||
    msg.includes("high demand") ||
    msg.includes("unavailable")
  );
}

function extraerRetryDelayMs(err: unknown): number | null {
  if (!(err instanceof Error)) return null;
  const match = err.message.match(/retry in (\d+(?:\.\d+)?)s/i);
  return match ? Math.ceil(parseFloat(match[1]) * 1000) : null;
}

/**
 * Llama a Gemini para clasificar y extraer campos de una oferta.
 * Prueba varios modelos y reintenta ante error 429 (cuota).
 */
export async function extraerConGemini(textoCrudo: string): Promise<OfertaExtraida & { modelo: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY no configurada.");

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = PROMPT_EXTRACCION + "\n" + textoCrudo;
  let ultimoError: unknown;

  for (const nombreModelo of MODELOS_GEMINI) {
    for (let intento = 0; intento < MAX_REINTENTOS; intento++) {
      try {
        const model = genAI.getGenerativeModel({
          model: nombreModelo,
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        });

        const result = await model.generateContent(prompt);
        const texto = result.response.text();

        if (!texto) throw new Error("Gemini devolvió una respuesta vacía.");

        return { ...parsearRespuesta(texto), modelo: nombreModelo };
      } catch (err) {
        ultimoError = err;

        if (esErrorReintentable(err) && intento < MAX_REINTENTOS - 1) {
          const delay = extraerRetryDelayMs(err) ?? (intento + 1) * 5000;
          console.warn(`[gemini] Error temporal en ${nombreModelo}, reintento ${intento + 2}/${MAX_REINTENTOS} en ${delay}ms`);
          await esperar(delay);
          continue;
        }

        // Si el modelo no existe o está deprecado, probar el siguiente
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("404") || msg.includes("not found") || msg.includes("deprecated")) {
          console.warn(`[gemini] Modelo ${nombreModelo} no disponible, probando siguiente.`);
          break;
        }

        if (!esErrorReintentable(err)) throw err;
      }
    }
  }

  const detalle = ultimoError instanceof Error ? ultimoError.message : String(ultimoError);
  throw new Error(
    `Gemini no disponible (cuota agotada o modelos deprecados). Detalle: ${detalle.slice(0, 200)}`
  );
}

function parsearRespuesta(texto: string): OfertaExtraida {
  const limpio = texto.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const raw = JSON.parse(limpio);

  const sueldo_visible = !!(raw.sueldo_min || raw.sueldo_max);

  return {
    ...raw,
    sueldo_visible,
  } as OfertaExtraida;
}
