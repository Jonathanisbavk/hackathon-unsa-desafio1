/**
 * Embeddings con Gemini API (gemini-embedding-001, 768 dims para pgvector).
 * text-embedding-004 fue deprecado en ene 2026.
 */

const EMBEDDING_MODEL =
  process.env.GEMINI_EMBEDDING_MODEL ?? "gemini-embedding-001";
const EMBEDDING_DIMS = 768;

export async function generarEmbedding(texto: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY no configurada.");

  const textoLimpio = texto.replace(/\s+/g, " ").trim();
  if (!textoLimpio) throw new Error("Texto vacío para embedding.");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: `models/${EMBEDDING_MODEL}`,
      content: { parts: [{ text: textoLimpio }] },
      taskType: "RETRIEVAL_DOCUMENT",
      outputDimensionality: EMBEDDING_DIMS,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini embedding error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const values: number[] | undefined = data?.embedding?.values;

  if (!values?.length) {
    throw new Error("Formato de respuesta de embedding inválido.");
  }

  if (values.length !== EMBEDDING_DIMS) {
    throw new Error(
      `Embedding con ${values.length} dimensiones; se esperaban ${EMBEDDING_DIMS}.`
    );
  }

  return values;
}
