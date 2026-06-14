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
    <main className="mx-auto flex max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Hola, {nombre} 👋
        </h1>
        <p className="text-zinc-600 dark:text-zinc-300">
          Ya iniciaste sesión en CONECTA UNSA. El onboarding y tu feed de
          ofertas llegan en el siguiente paso.
        </p>
      </div>

      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Cerrar sesión
        </button>
      </form>
    </main>
  );
}
