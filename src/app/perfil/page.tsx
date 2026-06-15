import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import CVUploader from "@/components/cv-uploader";
import AppHeader from "@/components/app-header";

export const metadata = {
  title: "Tu CV y coincidencias — CONECTA UNSA",
  description: "Sube tu CV en PDF y descubre las ofertas que mejor encajan con tu perfil.",
};

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const isDemo = cookieStore.get("demo")?.value === "true";

  if (!user && !isDemo) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <AppHeader
        maxWidth="3xl"
        right={
          <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-unsa-primary dark:text-zinc-400">
            ← Volver al feed
          </Link>
        }
      />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Tu CV, tus mejores ofertas
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">
            Sube tu CV en PDF. Lo analizamos con IA (gratis) para mostrarte tu <strong>% de coincidencia</strong> con
            las ofertas y configurar tus alertas por correo.
          </p>
        </div>

        <CVUploader />
      </main>
    </div>
  );
}
