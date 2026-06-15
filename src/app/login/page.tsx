import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "@/components/login-form";
import { cookies } from "next/headers";
import { ConectaLogo } from "@/components/brand/logo";
import { HeroArequipa } from "@/components/brand/hero";

export default async function LoginPage() {
  // Si ya hay sesión, no mostramos el login.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  const cookieStore = await cookies();
  if (cookieStore.get("demo")?.value === "true") redirect("/");

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Panel de marca (Manual UNSA) — oculto en móvil */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-unsa-primary p-10 text-white lg:flex">
        {/* Imagen de fondo profesional e institucional con overlay granate */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/unsa-students.png" 
            alt="Estudiantes UNSA" 
            className="h-full w-full object-cover object-center opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-unsa-primary via-unsa-primary/80 to-unsa-primary/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-unsa-primary/90 to-transparent" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <ConectaLogo size={44} />
          <span className="text-lg font-bold tracking-tight">CONECTA UNSA</span>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-sm">
          <img 
            src="/unsa-hero.jpeg" 
            alt="Estudiantes y Egresados de la UNSA" 
            className="w-full drop-shadow-2xl rounded-2xl border border-white/10 shadow-black/50 object-cover"
          />
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold leading-tight">
            Empleo relevante para<br />egresados de la UNSA
          </h2>
          <p className="mt-3 max-w-md text-base text-white/90">
            Ofertas filtradas por tu carrera, con sueldo claro y desde un canal
            institucional confiable impulsado por IA.
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/80 bg-black/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Transformagob 2026
          </div>
        </div>
      </aside>

      {/* Formulario */}
      <section className="relative flex items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6">
        {/* Franja institucional superior (granate + azul) */}
        <div className="absolute top-0 left-0 h-1.5 w-full bg-unsa-primary" />
        <div className="absolute top-0 left-0 h-1.5 w-1/3 bg-unsa-secondary" />

        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <ConectaLogo size={56} />
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              CONECTA UNSA
            </h1>
          </div>

          <div className="mb-6 hidden lg:block">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Bienvenido de vuelta
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Ingresa con tu correo institucional para ver tus ofertas.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/50 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
            <LoginForm />
          </div>

          <p className="mt-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
            Acceso para egresados con correo institucional{" "}
            <strong className="text-zinc-600 dark:text-zinc-300">@unsa.edu.pe</strong>.
          </p>
        </div>
      </section>
    </main>
  );
}
