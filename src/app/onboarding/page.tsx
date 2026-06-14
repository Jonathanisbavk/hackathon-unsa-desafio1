import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import OnboardingForm from "@/components/onboarding-form";

export const metadata = {
  title: "Configura tu perfil — CONECTA UNSA",
  description: "Personaliza tu experiencia en la plataforma de empleo para egresados de la UNSA.",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const isDemo = cookieStore.get("demo")?.value === "true";

  if (!user && !isDemo) redirect("/login");

  // En demo no hay userId: el perfil se guarda en el navegador (localStorage).
  const modo = user ? "auth" : "demo";

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 relative overflow-hidden">
      {/* Barra institucional superior */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-unsa-primary to-unsa-secondary" />

      <div className="w-full max-w-xl relative z-10">
        {/* Marca */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-unsa-primary shadow-sm">
            <span className="text-sm font-serif font-bold text-white">UNSA</span>
          </div>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-white leading-none">CONECTA UNSA</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Configura tu perfil</p>
          </div>
        </div>

        {/* Tarjeta del onboarding */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/50 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
          <OnboardingForm userId={user?.id} modo={modo} />
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Puedes actualizar estas preferencias en cualquier momento desde tu perfil.
        </p>
      </div>
    </main>
  );
}
