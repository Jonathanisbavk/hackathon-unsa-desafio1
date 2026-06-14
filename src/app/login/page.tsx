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
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Elementos decorativos institucionales */}
      <div className="absolute top-0 left-0 w-full h-2 bg-unsa-primary"></div>
      <div className="absolute top-0 left-0 w-1/3 h-1.5 bg-unsa-secondary"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Marca institucional */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-unsa-primary mb-6 shadow-md shadow-unsa-primary/20">
            <span className="text-3xl font-serif font-bold text-white tracking-tighter">UNSA</span>
          </div>
          
          <span className="inline-block rounded-full border border-unsa-primary/20 bg-unsa-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-unsa-primary dark:border-unsa-primary/30 dark:bg-unsa-primary/10 dark:text-unsa-primary">
            Transformagob 2026
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            CONECTA UNSA
          </h1>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
            Portal oficial de intermediación laboral para egresados de la Universidad Nacional de San Agustín.
          </p>
        </div>

        {/* Tarjeta de login */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 sm:p-8 p-6 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
          <LoginForm />
        </div>

        <p className="mt-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
          El acceso está restringido a usuarios con correo institucional <strong className="text-zinc-600 dark:text-zinc-300">@unsa.edu.pe</strong>.
        </p>
      </div>
    </main>
  );
}
