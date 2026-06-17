import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Ruta de callback para OAuth (Google).
 * Supabase redirige aquí después de que el usuario se autentica con Google.
 * Intercambia el código temporal por una sesión válida.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirigir al onboarding si es la primera vez, o al home
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Si algo falla, redirigir al login con un mensaje de error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
