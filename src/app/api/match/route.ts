import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generarEmbedding } from "@/lib/ai/embeddings";

export const runtime = "nodejs";

// Cliente anon: las ofertas publicadas y la RPC match_ofertas son legibles por anon (RLS).
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

/**
 * Matching sin estado: recibe un texto (perfil del demo o resumen de CV),
 * genera su embedding y devuelve las ofertas más similares con su % de match.
 */
export async function POST(req: NextRequest) {
  try {
    const { texto, limite = 6, umbral = 0.1 } = await req.json();

    if (!texto || typeof texto !== "string" || texto.trim().length < 3) {
      return NextResponse.json({ recomendaciones: [] });
    }

    const embedding = await generarEmbedding(texto);

    const { data: matches, error } = await supabase.rpc("match_ofertas", {
      query_embedding: embedding,
      match_threshold: umbral,
      match_count: limite,
    });
    if (error) throw error;
    if (!matches?.length) return NextResponse.json({ recomendaciones: [] });

    // Enriquecer con detalles de la oferta, conservando el score.
    const ids = matches.map((m: { id: string }) => m.id);
    const { data: detalles } = await supabase
      .from("ofertas")
      .select("id, titulo, empresa, modalidad, tipo, sueldo_visible, sueldo_min, sueldo_max")
      .in("id", ids)
      .eq("estado", "publicada");

    const recomendaciones = matches
      .map((m: { id: string; score: number }) => {
        const det = detalles?.find((d) => d.id === m.id);
        return det ? { ...det, similitud: m.score } : null;
      })
      .filter(Boolean);

    return NextResponse.json({ recomendaciones });
  } catch (err) {
    console.error("[/api/match] Error:", err);
    return NextResponse.json({ error: "No se pudo calcular el match." }, { status: 500 });
  }
}
