/**
 * Utilidades para generar embeddings usando Gemini API (text-embedding-004).
 */

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent";

export async function generarEmbedding(texto: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY no configurada.");

  // Limpiamos el texto un poco (quitar múltiples espacios/saltos de línea)
  const textoLimpio = texto.replace(/\s+/g, " ").trim();

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "models/embedding-001",
      content: {
        parts: [{ text: textoLimpio }]
      }
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error en API de Embeddings (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const embedding = data?.embedding?.values;

  if (!embedding || !Array.isArray(embedding)) {
    throw new Error("Formato de respuesta de embedding inválido.");
  }

  return embedding;
}
