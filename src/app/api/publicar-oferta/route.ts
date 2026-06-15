import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generarEmbedding } from "@/lib/ai/embeddings";

export const runtime = "nodejs";

// Cliente Supabase con Service Role (bypassea RLS, solo backend). Perezoso para no
// romper el build cuando la key no está configurada.
function getSupabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY no configurada.");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { oferta, texto_crudo, es_ruido } = body;

    if (!oferta || !texto_crudo) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    const estado = es_ruido ? "descartada" : "publicada";
    let embeddingVector: number[] | null = null;

    // Solo generamos embedding si se va a publicar (no es ruido)
    if (!es_ruido) {
      // Concatenamos el texto clave para representar semánticamente la oferta
      const textoParaEmbedding = [
        oferta.titulo,
        oferta.empresa,
        oferta.tipo?.replace("_", " "),
        oferta.descripcion,
        (oferta.requisitos || []).join(". "),
        (oferta.escuela_objetivo || []).join(", ")
      ].filter(Boolean).join("\n\n");

      embeddingVector = await generarEmbedding(textoParaEmbedding);
    }

    // 1. Insertar en la BD
    const { data: ofertaInsertada, error: dbErr } = await supabaseAdmin
      .from("ofertas")
      .insert({
        titulo: oferta.titulo || "Sin título",
        empresa: oferta.empresa,
        escuela_objetivo: oferta.escuela_objetivo || [],
        tipo: oferta.tipo,
        descripcion: oferta.descripcion,
        requisitos: oferta.requisitos || [],
        modalidad: oferta.modalidad,
        sueldo_min: oferta.sueldo_min,
        sueldo_max: oferta.sueldo_max,
        sueldo_visible: oferta.sueldo_visible ?? false,
        fecha_cierre: oferta.fecha_cierre,
        ciudad: oferta.ciudad ?? null,
        provincia: oferta.provincia ?? null,
        distrito: oferta.distrito ?? null,
        tipo_empleo: oferta.tipo_empleo ?? null,
        nivel_jerarquia: oferta.nivel_jerarquia ?? null,
        dirigido_a: oferta.dirigido_a ?? [],
        contacto_nombre: oferta.contacto_nombre ?? null,
        contacto_email: oferta.contacto_email ?? null,
        contacto_telefono: oferta.contacto_telefono ?? null,
        texto_original: texto_crudo,
        estado: estado,
        es_ruido: es_ruido,
        embedding: embeddingVector,
        publicada_at: es_ruido ? null : new Date().toISOString()
      })
      .select("id")
      .single();

    if (dbErr) throw dbErr;

    // 2. Si se publicó, disparar alertas y notificaciones
    let alertasDisparadas = 0;
    if (!es_ruido && ofertaInsertada) {
      // Llamada a la función RPC que creamos en la base de datos
      const { data: count, error: rpcErr } = await supabaseAdmin.rpc("disparar_alertas", {
        p_oferta_id: ofertaInsertada.id
      });

      if (rpcErr) {
        console.error("Error al disparar alertas:", rpcErr);
        // No lanzamos el error para no fallar el request principal de publicación
      } else {
        alertasDisparadas = count || 0;
      }
    }

    return NextResponse.json({
      success: true,
      oferta_id: ofertaInsertada.id,
      estado,
      alertas_disparadas: alertasDisparadas
    });

  } catch (err) {
    console.error("[/api/publicar-oferta] Error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error interno" }, { status: 500 });
  }
}
