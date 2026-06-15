import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import NotificacionesCampana from "@/components/notificaciones";
import FeedOfertas from "@/components/feed-ofertas";
import AppHeader from "@/components/app-header";
import { ConectaLogo } from "@/components/brand/logo";

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
      <header className="glass sticky top-0 z-40 border-b border-zinc-200/50 shadow-sm dark:border-zinc-800/50 dark:glass-dark">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <ConectaLogo size={36} />
            <span className="font-bold tracking-tight text-zinc-900 dark:text-white hidden sm:block">
              CONECTA <span className="text-unsa-primary dark:text-unsa-primary-light">UNSA</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <NotificacionesCampana userId={user?.id} />

            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hidden sm:block">
              {emailMostrar}
            </span>
            <a
              href="/admin"
              className="inline-flex items-center justify-center rounded-xl bg-unsa-primary px-4 py-2 text-sm font-bold text-white shadow-md shadow-unsa-primary/20 transition-all hover:scale-105 hover:bg-unsa-primary-dark focus:outline-none focus:ring-4 focus:ring-unsa-primary/20"
            >
              Panel Admin
            </a>
            
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white/50 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-unsa-primary via-unsa-primary-light to-unsa-secondary opacity-90"></div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-4 py-8 sm:px-6 md:py-12 relative">
        <div className="absolute top-0 right-0 -z-10 h-64 w-64 -translate-y-20 translate-x-20 rounded-full bg-unsa-primary/10 blur-[100px]" />
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Bienvenido, <span className="bg-gradient-to-br from-unsa-primary to-unsa-primary-light bg-clip-text text-transparent">{nombre}</span>
          </h1>
          <p className="mt-3 text-lg font-medium text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto sm:mx-0">
            Explora las ofertas laborales publicadas. Tu filtro salarial y alertas están listos.
          </p>
        </div>

        <FeedOfertas userId={user?.id} preferenciasIniciales={preferencias} />
      </main>
    </div>
  );
}
