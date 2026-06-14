import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Crea alertas por correo para invitados (modo demo, sin auth).
 * Inserta con egresado_id = null + email (permitido por la política "alertas_anon_insert").
 * Acepta una palabra clave o varias (desde la encuesta del CV).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email: string = (body.email ?? "").trim().toLowerCase();
    const escuela: string | null = body.escuela ?? null;

    const palabras: string[] = Array.isArray(body.palabras_clave)
      ? body.palabras_clave
      : body.palabra_clave
        ? [body.palabra_clave]
        : [];

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Correo inválido." }, { status: 400 });
    }
    const limpias = palabras
      .map((p) => String(p).trim())
      .filter((p) => p.length > 0)
      .slice(0, 10);
    if (limpias.length === 0) {
      return NextResponse.json({ error: "Falta la palabra clave." }, { status: 400 });
    }

    const filas = limpias.map((palabra_clave) => ({
      egresado_id: null,
      email,
      palabra_clave,
      escuela,
    }));

    const { error } = await supabase.from("alertas").insert(filas);
    if (error) throw error;

    return NextResponse.json({ ok: true, creadas: filas.length });
  } catch (err) {
    console.error("[/api/alertas] Error:", err);
    return NextResponse.json({ error: "No se pudo crear la alerta." }, { status: 500 });
  }
}
