import { NextResponse } from "next/server";
import { generarEmbedding } from "@/lib/ai/embeddings";

/** GET /api/mejorar-oferta/embedding-test — solo desarrollo */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No disponible en producción." }, { status: 403 });
  }

  try {
    const vector = await generarEmbedding("Desarrollador web React Node.js Arequipa");
    return NextResponse.json({ ok: true, dims: vector.length });
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}
