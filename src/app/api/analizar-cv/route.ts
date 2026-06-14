import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { extractText, getDocumentProxy } from "unpdf";
import { extraerCVConGemini } from "@/lib/ai/cv";
import { generarEmbedding } from "@/lib/ai/embeddings";

export const runtime = "nodejs";
export const maxDuration = 60;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Procesa un CV en PDF: extrae texto (unpdf), estructura con IA, genera embedding,
 * calcula ofertas afines (match_ofertas) y persiste el CV. Sirve al demo y a auth.
 */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("cv");
    const email = ((form.get("email") as string) ?? "").trim().toLowerCase() || null;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Adjunta tu CV en PDF." }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "El archivo debe ser PDF." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "El PDF supera los 5 MB." }, { status: 400 });
    }

    // 1) Extraer texto del PDF
    const buffer = new Uint8Array(await file.arrayBuffer());
    const pdf = await getDocumentProxy(buffer);
    const { text } = await extractText(pdf, { mergePages: true });
    const texto = Array.isArray(text) ? text.join("\n") : text;

    if (!texto || texto.trim().length < 30) {
      return NextResponse.json(
        { error: "No pudimos leer texto del PDF (¿es una imagen escaneada?)." },
        { status: 422 },
      );
    }

    // 2) Estructurar con IA
    const perfil = await extraerCVConGemini(texto);

    // 3) Embedding del perfil para el matching
    const textoPerfil = [
      perfil.carrera ? `Egresado de ${perfil.carrera}` : "",
      perfil.resumen,
      perfil.skills?.length ? `Habilidades: ${perfil.skills.join(", ")}` : "",
      perfil.palabras_clave?.length ? `Palabras clave: ${perfil.palabras_clave.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join(". ");

    let recomendaciones: unknown[] = [];
    let embedding: number[] | null = null;
    try {
      embedding = await generarEmbedding(textoPerfil);
      const { data: matches } = await supabase.rpc("match_ofertas", {
        query_embedding: embedding,
        match_threshold: 0.3,
        match_count: 6,
      });
      if (matches?.length) {
        const ids = matches.map((m: { id: string }) => m.id);
        const { data: detalles } = await supabase
          .from("ofertas")
          .select("id, titulo, empresa, modalidad, tipo, sueldo_visible, sueldo_min, sueldo_max")
          .in("id", ids)
          .eq("estado", "publicada");
        recomendaciones = matches
          .map((m: { id: string; score: number }) => {
            const det = detalles?.find((d) => d.id === m.id);
            return det ? { ...det, similitud: m.score } : null;
          })
          .filter(Boolean);
      }
    } catch (e) {
      console.warn("[/api/analizar-cv] matching falló (sigo sin recomendaciones):", e);
    }

    // 4) Persistir el CV (best-effort; no bloquea la respuesta)
    try {
      await supabase.from("cvs").insert({
        egresado_id: null,
        email,
        texto: texto.slice(0, 50000),
        datos: perfil,
        embedding,
      });
    } catch (e) {
      console.warn("[/api/analizar-cv] no se pudo persistir el CV:", e);
    }

    return NextResponse.json({ perfil, recomendaciones });
  } catch (err) {
    console.error("[/api/analizar-cv] Error:", err);
    return NextResponse.json({ error: "No se pudo procesar el CV." }, { status: 500 });
  }
}
