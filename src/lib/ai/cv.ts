import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROMPT_CV, type CVExtraido } from "./types";

/** Mismos modelos y orden que el pipeline de ofertas. */
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

function esReintentable(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const m = err.message.toLowerCase();
  return (
    m.includes("429") ||
    m.includes("503") ||
    m.includes("quota") ||
    m.includes("rate limit") ||
    m.includes("unavailable")
  );
}

/**
 * Extrae el perfil estructurado de un CV (texto plano) con Gemini.
 * Reutiliza el patrón de gemini.ts: prueba varios modelos y reintenta ante 429.
 */
export async function extraerCVConGemini(textoCV: string): Promise<CVExtraido> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY no configurada.");

  const limpio = textoCV.replace(/\s+/g, " ").trim().slice(0, 20000);
  if (!limpio) throw new Error("CV vacío o ilegible.");

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = PROMPT_CV + limpio;
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
        return normalizar(texto);
      } catch (err) {
        ultimoError = err;
        if (esReintentable(err) && intento < MAX_REINTENTOS - 1) {
          await esperar((intento + 1) * 4000);
          continue;
        }
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("404") || msg.includes("not found") || msg.includes("deprecated")) {
          break; // modelo no disponible → siguiente
        }
        if (!esReintentable(err)) throw err;
      }
    }
  }

  const detalle = ultimoError instanceof Error ? ultimoError.message : String(ultimoError);
  throw new Error(`Gemini no disponible para el CV. Detalle: ${detalle.slice(0, 200)}`);
}

function normalizar(texto: string): CVExtraido {
  const limpio = texto.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const raw = JSON.parse(limpio);
  return {
    nombre: typeof raw.nombre === "string" ? raw.nombre : undefined,
    carrera: typeof raw.carrera === "string" ? raw.carrera : undefined,
    anios_experiencia: Number.isFinite(raw.anios_experiencia) ? raw.anios_experiencia : 0,
    skills: Array.isArray(raw.skills) ? raw.skills.filter((s: unknown) => typeof s === "string") : [],
    resumen: typeof raw.resumen === "string" ? raw.resumen : "",
    palabras_clave: Array.isArray(raw.palabras_clave)
      ? raw.palabras_clave.filter((s: unknown) => typeof s === "string")
      : [],
  };
}
