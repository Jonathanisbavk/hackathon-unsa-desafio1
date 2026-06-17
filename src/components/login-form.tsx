"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Modo = "login" | "registro";

/** Icono SVG oficial de Google */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [modo, setModo] = useState<Modo>("login");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [cargandoGoogle, setCargandoGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  function cambiarModo(nuevo: Modo) {
    setModo(nuevo);
    setError(null);
    setAviso(null);
  }

  /** Login / Registro con Google OAuth */
  async function loginConGoogle() {
    setCargandoGoogle(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
      // Supabase redirige al usuario a Google; no se necesita router.push
    } catch (err) {
      setError(traducirError(err));
      setCargandoGoogle(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAviso(null);
    setCargando(true);

    try {
      if (modo === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        router.refresh();
        router.push("/");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { nombre: nombre.trim() } },
        });
        if (error) throw error;
        // Si el proyecto exige confirmación por email, no habrá sesión todavía.
        if (data.session) {
          router.refresh();
          router.push("/");
        } else {
          setAviso(
            "Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.",
          );
          setModo("login");
        }
      }
    } catch (err) {
      setError(traducirError(err));
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      {/* ── Botón de Google (principal) ── */}
      <button
        type="button"
        onClick={loginConGoogle}
        disabled={cargandoGoogle}
        className="inline-flex items-center justify-center gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:focus:ring-zinc-800"
      >
        {cargandoGoogle ? (
          <span className="size-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-600 dark:border-t-zinc-200" />
        ) : (
          <GoogleIcon className="size-5" />
        )}
        Continuar con Google
      </button>

      <div className="relative flex items-center">
        <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
        <span className="mx-4 flex-shrink-0 text-xs text-zinc-400">o con correo</span>
        <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
      </div>

      {/* Selector de modo */}
      <div
        role="tablist"
        aria-label="Iniciar sesión o crear cuenta"
        className="grid grid-cols-2 gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800"
      >
        {(["login", "registro"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={modo === m}
            onClick={() => cambiarModo(m)}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              modo === m
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {m === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </button>
        ))}
      </div>

      {modo === "registro" && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nombre" className="text-sm font-medium">
            Nombre completo
          </label>
          <input
            id="nombre"
            type="text"
            autoComplete="name"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ana Quispe Mamani"
            className="rounded-lg border border-zinc-300 bg-zinc-50/50 px-3 py-2.5 text-sm outline-none transition hover:border-zinc-400 focus:border-unsa-primary focus:bg-white focus:ring-4 focus:ring-unsa-primary/10 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-unsa-primary dark:focus:bg-zinc-950 dark:focus:ring-unsa-primary/20"
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Correo institucional
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@unsa.edu.pe"
          className="rounded-lg border border-zinc-300 bg-zinc-50/50 px-3 py-2.5 text-sm outline-none transition hover:border-zinc-400 focus:border-unsa-primary focus:bg-white focus:ring-4 focus:ring-unsa-primary/10 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-unsa-primary dark:focus:bg-zinc-950 dark:focus:ring-unsa-primary/20"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            type={verPass ? "text" : "password"}
            autoComplete={modo === "login" ? "current-password" : "new-password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50/50 px-3 py-2.5 pr-16 text-sm outline-none transition hover:border-zinc-400 focus:border-unsa-primary focus:bg-white focus:ring-4 focus:ring-unsa-primary/10 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-unsa-primary dark:focus:bg-zinc-950 dark:focus:ring-unsa-primary/20"
          />
          <button
            type="button"
            onClick={() => setVerPass((v) => !v)}
            aria-label={verPass ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-unsa-primary hover:text-unsa-primary-dark transition-colors"
          >
            {verPass ? "Ocultar" : "Ver"}
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}
      {aviso && (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          {aviso}
        </p>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-unsa-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-unsa-primary-dark hover:shadow-md focus:outline-none focus:ring-4 focus:ring-unsa-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cargando && (
          <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        {modo === "login" ? "Entrar" : "Crear cuenta"}
      </button>

      <div className="relative flex items-center py-1">
        <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
        <span className="mx-4 flex-shrink-0 text-xs text-zinc-400">
          ¿Solo quieres explorar?
        </span>
        <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
      </div>

      {/* ── Botón destacado para la demo (sin cuenta) ── */}
      <button
        type="button"
        onClick={() => {
          document.cookie = "demo=true; path=/; max-age=86400";
          router.refresh();
          router.push("/onboarding");
        }}
        className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-unsa-primary via-unsa-primary-light to-unsa-secondary p-[2px] shadow-lg shadow-unsa-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-unsa-primary/40 focus:outline-none focus:ring-4 focus:ring-unsa-primary/30"
      >
        {/* Capa interior */}
        <span className="relative flex items-center justify-center gap-2.5 rounded-[10px] bg-gradient-to-r from-unsa-primary to-unsa-secondary px-5 py-3 text-sm font-bold text-white">
          {/* Brillo animado que cruza el botón */}
          <span className="pointer-events-none absolute inset-0 -z-0 overflow-hidden rounded-[10px]">
            <span className="absolute inset-y-0 left-0 w-1/3 animate-shine bg-white/25 blur-md" />
          </span>

          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="size-5 shrink-0 transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          >
            <path
              d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z"
              fill="currentColor"
            />
          </svg>
          <span className="relative">Entrar a la Demo</span>
          <span className="relative rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
            Sin cuenta
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          >
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <p className="-mt-2 text-center text-xs text-zinc-400">
        Acceso instantáneo · ideal para probar la plataforma
      </p>
    </form>
  );
}

function traducirError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/Invalid login credentials/i.test(msg))
    return "Correo o contraseña incorrectos. Verifícalos e inténtalo de nuevo.";
  if (/Email not confirmed/i.test(msg))
    return "Tu correo aún no está confirmado. Revisa tu bandeja de entrada.";
  if (/User already registered/i.test(msg))
    return "Ya existe una cuenta con ese correo. Inicia sesión.";
  if (/Password should be at least/i.test(msg))
    return "La contraseña debe tener al menos 6 caracteres.";
  if (/fetch|network|Failed to fetch/i.test(msg))
    return "No se pudo conectar con el servidor. Revisa tu conexión o la configuración de Supabase.";
  return msg || "Ocurrió un error. Inténtalo de nuevo.";
}
