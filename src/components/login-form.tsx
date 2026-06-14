"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Modo = "login" | "registro";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [modo, setModo] = useState<Modo>("login");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  function cambiarModo(nuevo: Modo) {
    setModo(nuevo);
    setError(null);
    setAviso(null);
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
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-unsa-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-unsa-primary-dark hover:shadow-md focus:outline-none focus:ring-4 focus:ring-unsa-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cargando && (
          <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        {modo === "login" ? "Entrar" : "Crear cuenta"}
      </button>
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
