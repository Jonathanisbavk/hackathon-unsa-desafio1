/**
 * Utilidades para generar embeddings usando Gemini API (text-embedding-004).
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generarEmbedding(texto: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY no configurada.");

  // Limpiamos el texto un poco (quitar múltiples espacios/saltos de línea)
  const textoLimpio = texto.replace(/\s+/g, " ").trim();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

  const result = await model.embedContent(textoLimpio);
  
  if (!result.embedding || !result.embedding.values) {
    throw new Error("Formato de respuesta de embedding inválido.");
  }

  return result.embedding.values;
}
