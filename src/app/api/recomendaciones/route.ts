import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generarEmbedding } from "@/lib/ai/embeddings";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Falta userId" }, { status: 400 });
    }

    // 1. Obtener datos del egresado
    const { data: egresado, error: userErr } = await supabaseAdmin
      .from("egresados")
      .select("id, escuela_profesional, especialidad, skills, experiencia, perfil_embedding")
      .eq("id", userId)
      .single();

    if (userErr || !egresado) {
      return NextResponse.json({ error: "Egresado no encontrado" }, { status: 404 });
    }

    let embedding = egresado.perfil_embedding;

    // 2. Si no tiene embedding, lo generamos al vuelo
    if (!embedding) {
      const textoPerfil = [
        "Estudiante o Egresado de",
        egresado.escuela_profesional,
        egresado.especialidad ? `Especialidad: ${egresado.especialidad}` : "",
        egresado.skills && egresado.skills.length > 0 ? `Habilidades: ${egresado.skills.join(", ")}` : "",
        egresado.experiencia ? `Experiencia: ${egresado.experiencia}` : ""
      ].filter(Boolean).join(". ");

      embedding = await generarEmbedding(textoPerfil);

      // Guardarlo para la próxima vez
      await supabaseAdmin
        .from("egresados")
        .update({ perfil_embedding: embedding })
        .eq("id", userId);
    }

    // 3. Buscar matches con la función RPC (similitud coseno)
    // Buscamos con un threshold de 0.3 (bajo para hackathon) y limitamos a 3
    const { data: matches, error: rpcErr } = await supabaseAdmin.rpc("match_ofertas", {
      query_embedding: embedding,
      match_threshold: 0.3, 
      match_count: 3
    });

    if (rpcErr) throw rpcErr;

    // Enriquecer los matches con más detalles de la oferta
    let ofertasRecomendadas = [];
    if (matches && matches.length > 0) {
      const ids = matches.map((m: any) => m.id);
      const { data: detalles } = await supabaseAdmin
        .from("ofertas")
        .select("id, titulo, empresa, modalidad, tipo, sueldo_visible, sueldo_min, sueldo_max")
        .in("id", ids)
        .eq("estado", "publicada");

      // Ordenar igual que los matches
      ofertasRecomendadas = matches.map((m: any) => {
        const det = detalles?.find(d => d.id === m.id);
        return {
          ...det,
          similitud: m.similitud
        };
      }).filter((m: any) => m.titulo); // Filtrar nulos si hay inconsistencia
    }

    return NextResponse.json({ recomendaciones: ofertasRecomendadas }, { status: 200 });
  } catch (err) {
    console.error("[/api/recomendaciones] Error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
