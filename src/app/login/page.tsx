import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "@/components/login-form";

export default async function LoginPage() {
  // Si ya hay sesión, no mostramos el login.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12 dark:from-zinc-950 dark:to-black">
      <div className="w-full max-w-md">
        {/* Marca */}
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            Hackatón Transformagob 2026
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            CONECTA UNSA
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Empleo para egresados de la UNSA: ofertas relevantes a tu carrera y
            con sueldo claro.
          </p>
        </div>

        {/* Tarjeta */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Usa tu correo institucional <strong>@unsa.edu.pe</strong> para acceder.
        </p>
      </div>
    </main>
  );
}
