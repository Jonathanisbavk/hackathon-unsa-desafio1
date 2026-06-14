import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import AdminPanel from "@/components/admin-panel";

export const metadata = {
  title: "Panel de Administración — CONECTA UNSA",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const isDemo = cookieStore.get("demo")?.value === "true";

  // Aquí haremos una validación básica, si no hay usuario y no es demo, mandamos a login.
  if (!user && !isDemo) redirect("/login");

  // MVP/Demo: Permitimos probar el panel de admin a cualquier usuario logueado en la demo
  // En producción real, validaríamos el claim: role === "admin"
  // const role = user.app_metadata?.role;
  // if (role !== "admin") redirect("/");

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header Admin */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-unsa-primary to-unsa-secondary" />
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 shadow-sm dark:bg-white">
              <span className="text-xs font-serif font-bold text-white dark:text-zinc-900">A</span>
            </div>
            <div>
              <p className="font-bold text-zinc-900 dark:text-white leading-none">Admin Panel</p>
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Conecta UNSA</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              ← Volver al Feed
            </a>
            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {user?.email || "Invitado (Demo)"}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="mb-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Procesador de Ofertas</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Pega el correo original de la empresa. Nuestra IA lo clasificará, estructurará y detectará si falta el sueldo para pedirlo automáticamente.
          </p>
        </div>

        <AdminPanel />
      </main>
    </div>
  );
}
