import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Entrada del MVP: sin sesión → login.
  if (!user) redirect("/login");

  const nombre =
    (user.user_metadata?.nombre as string | undefined) ?? user.email;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Barra superior institucional */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 sticky top-0 z-10">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-unsa-primary">
              <span className="text-xs font-serif font-bold text-white">UNSA</span>
            </div>
            <span className="font-semibold tracking-tight text-zinc-900 dark:text-white">CONECTA UNSA</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hidden sm:block">
              {user.email}
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
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-10 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Bienvenido, <span className="text-unsa-primary dark:text-unsa-secondary">{nombre}</span>
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl">
              Has ingresado al portal oficial de empleo para egresados de la Universidad Nacional de San Agustín.
            </p>
          </div>

          <div className="mt-10 rounded-xl bg-blue-50 border border-blue-100 p-6 dark:bg-blue-950/30 dark:border-blue-900/50">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-blue-900 dark:text-blue-200">Plataforma en construcción</h3>
                <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
                  Próximamente podrás completar tu perfil profesional, explorar ofertas de empleo y gestionar tus postulaciones desde aquí.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
