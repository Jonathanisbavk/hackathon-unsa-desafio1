import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import NotificacionesCampana from "@/components/notificaciones";
import FeedOfertas from "@/components/feed-ofertas";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const isDemo = cookieStore.get("demo")?.value === "true";

  // Entrada del MVP: sin sesión → login.
  if (!user && !isDemo) redirect("/login");

  let preferencias = null;

  // Si el usuario está autenticado, verificar si completó el onboarding
  if (user) {
    const { data: egresado } = await supabase
      .from("egresados")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!egresado) redirect("/onboarding");

    // Traer preferencias
    const { data: pref } = await supabase
      .from("preferencias")
      .select("*")
      .eq("egresado_id", user.id)
      .single();
    
    preferencias = pref;
  }

  const nombre = user
    ? (user.user_metadata?.nombre as string | undefined) ?? user.email
    : "Invitado (Demo)";

  const emailMostrar = user ? user.email : "invitado@unsa.edu.pe";

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Barra superior institucional */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-unsa-primary">
              <span className="text-xs font-serif font-bold text-white">UNSA</span>
            </div>
            <span className="font-semibold tracking-tight text-zinc-900 dark:text-white hidden sm:block">CONECTA UNSA</span>
          </div>
          
          <div className="flex items-center gap-4">
            <NotificacionesCampana userId={user?.id} />

            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hidden sm:block">
              {emailMostrar}
            </span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-unsa-primary/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-unsa-primary to-unsa-secondary"></div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-4 py-8 sm:px-6 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Bienvenido, <span className="text-unsa-primary dark:text-unsa-secondary">{nombre}</span>
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl">
            Explora las ofertas laborales publicadas. Tu filtro salarial y alertas están listos.
          </p>
        </div>

        <FeedOfertas userId={user?.id} preferenciasIniciales={preferencias} />
      </main>
    </div>
  );
}
