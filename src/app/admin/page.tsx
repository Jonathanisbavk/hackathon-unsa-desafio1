import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import AdminPanel from "@/components/admin-panel";
import AppHeader from "@/components/app-header";

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
      <AppHeader
        maxWidth="7xl"
        left={
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 shadow-sm dark:bg-white">
              <span className="text-xs font-serif font-bold text-white dark:text-zinc-900">A</span>
            </div>
            <div>
              <p className="font-bold leading-none text-zinc-900 dark:text-white">Admin Panel</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Conecta UNSA</p>
            </div>
          </Link>
        }
        right={
          <>
            <Link
              href="/"
              className="rounded-md bg-zinc-100 px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              ← Volver al Feed
            </Link>
            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {user?.email || "Invitado (Demo)"}
            </div>
          </>
        }
      />

      {/* Contenido Principal */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="mb-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Procesador de Ofertas</h1>
          <p className="mt-3 text-base font-medium text-zinc-700 dark:text-zinc-300 max-w-3xl leading-relaxed">
            Pega la oferta de trabajo que se va a publicar para mejorarla. Nuestra IA la clasificará, estructurará y detectará si falta el sueldo para pedirlo automáticamente.
          </p>
        </div>

        <AdminPanel />
      </main>
    </div>
  );
}
