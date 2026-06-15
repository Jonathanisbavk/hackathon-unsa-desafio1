"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ESCUELAS } from "@/lib/constants";
import {
  esDemo,
  leerPerfilDemo,
  guardarPerfilDemo,
  type CVProcesado,
} from "@/lib/demo";
import { RecomendacionSkeleton } from "@/components/skeletons";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ETAPAS = [
  "Leyendo tu PDF…",
  "Extrayendo tu perfil con IA…",
  "Calculando coincidencias con las ofertas…",
];

interface Recomendacion {
  id: string;
  titulo: string;
  empresa?: string;
  similitud?: number;
}

export default function CVUploader() {
  const router = useRouter();
  const [archivo, setArchivo] = useState<File | null>(null);
  const [estado, setEstado] = useState<"idle" | "procesando" | "listo" | "error">("idle");
  const [etapa, setEtapa] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [perfil, setPerfil] = useState<CVProcesado | null>(null);
  const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([]);

  // Encuesta post-CV
  const [carrerasSel, setCarrerasSel] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [nuevoKw, setNuevoKw] = useState("");
  const [quiereCorreo, setQuiereCorreo] = useState(false);
  const [email, setEmail] = useState("");
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Rotación de mensajes de carga mientras se procesa.
  useEffect(() => {
    if (estado !== "procesando") return;
    const id = setInterval(() => setEtapa((e) => (e + 1) % ETAPAS.length), 1300);
    return () => clearInterval(id);
  }, [estado]);

  function elegirArchivo(f: File | null) {
    setError(null);
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("El archivo debe ser un PDF.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("El PDF supera los 5 MB.");
      return;
    }
    setArchivo(f);
  }

  async function procesar() {
    if (!archivo) return;
    setEtapa(0);
    setEstado("procesando");
    setError(null);
    try {
      const fd = new FormData();
      fd.append("cv", archivo);
      const res = await fetch("/api/analizar-cv", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo procesar el CV.");

      const p: CVProcesado = data.perfil ?? {};
      setPerfil(p);
      setRecomendaciones(data.recomendaciones ?? []);

      // Prefill de la encuesta con lo extraído + el perfil demo previo.
      const demoPrev = leerPerfilDemo();
      const carreraIA = p.carrera && ESCUELAS.includes(p.carrera as (typeof ESCUELAS)[number]) ? [p.carrera] : [];
      const carreraDemo = demoPrev.carrera ? [demoPrev.carrera] : [];
      setCarrerasSel([...new Set([...carreraDemo, ...carreraIA])]);
      setKeywords([...new Set([...(p.palabras_clave ?? [])])].slice(0, 12));
      setEmail(demoPrev.email ?? "");
      setEstado("listo");
      toast.success("¡CV analizado!");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al procesar el CV.");
      setEstado("error");
    }
  }

  function toggleCarrera(c: string) {
    setCarrerasSel((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }
  function agregarKw() {
    const k = nuevoKw.trim();
    if (k && !keywords.includes(k)) setKeywords((p) => [...p, k]);
    setNuevoKw("");
  }
  function quitarKw(k: string) {
    setKeywords((p) => p.filter((x) => x !== k));
  }

  async function guardarPerfil() {
    setGuardando(true);
    try {
      // Guardar perfil del demo en el navegador.
      if (esDemo()) {
        guardarPerfilDemo({
          cv: perfil ?? undefined,
          escuelasInteres: carrerasSel,
          palabrasClave: keywords,
          email: quiereCorreo ? email.trim() : undefined,
          nombre: perfil?.nombre,
          carrera: perfil?.carrera,
        });
      }

      // Crear alertas por correo desde las palabras clave (opt-in).
      if (quiereCorreo) {
        if (!EMAIL_RE.test(email.trim())) {
          toast.error("Ingresa un correo válido para recibir ofertas.");
          setGuardando(false);
          return;
        }
        if (keywords.length === 0) {
          toast.error("Agrega al menos una palabra clave.");
          setGuardando(false);
          return;
        }
        const res = await fetch("/api/alertas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), palabras_clave: keywords }),
        });
        if (!res.ok) throw new Error();
        toast.success(`Listo. Te avisaremos a ${email.trim()} de nuevas ofertas.`);
      } else {
        toast.success("Preferencias guardadas.");
      }

      router.push("/");
      router.refresh();
    } catch {
      toast.error("No se pudieron guardar tus preferencias.");
    } finally {
      setGuardando(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (estado === "listo" && perfil) {
    return (
      <div className="flex flex-col gap-8">
        {/* Perfil extraído */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xl">🧑‍🎓</span>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Tu perfil</h2>
          </div>
          {perfil.nombre && <p className="font-medium text-zinc-900 dark:text-white">{perfil.nombre}</p>}
          {perfil.carrera && <p className="text-sm text-zinc-500">{perfil.carrera}{typeof perfil.anios_experiencia === "number" ? ` · ${perfil.anios_experiencia} año(s) de experiencia` : ""}</p>}
          {perfil.resumen && <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{perfil.resumen}</p>}
          {perfil.skills && perfil.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {perfil.skills.map((s) => (
                <span key={s} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">{s}</span>
              ))}
            </div>
          )}
        </section>

        {/* % de match */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            <span className="animate-pulse-slow text-amber-500">✨</span> Ofertas que mejor encajan contigo
          </h2>
          {recomendaciones.length === 0 ? (
            <p className="rounded-2xl border border-zinc-200 bg-white/50 p-5 text-sm text-zinc-500 glass dark:border-zinc-800 dark:glass-dark">
              Aún no hay ofertas publicadas suficientes para calcular coincidencias. Vuelve pronto.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {recomendaciones.map((o) => (
                <div key={o.id} className="card-hover flex flex-col gap-3 rounded-2xl border border-unsa-primary/20 bg-gradient-to-br from-unsa-primary/5 to-white p-5 shadow-sm dark:border-unsa-primary/30 dark:from-unsa-secondary-dark/40 dark:to-zinc-900">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-2 text-sm font-bold leading-tight text-zinc-900 dark:text-white">{o.titulo}</h3>
                    {typeof o.similitud === "number" && (
                      <span className="shrink-0 rounded-full border border-unsa-primary/20 bg-unsa-primary/10 px-2.5 py-1 text-[11px] font-bold text-unsa-primary shadow-sm dark:bg-unsa-primary-dark/40 dark:text-unsa-primary-light">
                        {Math.round(o.similitud * 100)}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-zinc-500">{o.empresa}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Encuesta post-CV */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Afina tus ofertas</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Confirma tus áreas y palabras clave para mejorar tus recomendaciones y alertas.</p>

          <div className="mt-5 flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Áreas / carreras de interés</p>
            <div className="flex flex-wrap gap-2">
              {ESCUELAS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCarrera(c)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    carrerasSel.includes(c)
                      ? "border-unsa-primary bg-unsa-primary text-white"
                      : "border-zinc-300 bg-white text-zinc-700 hover:border-unsa-primary/60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Palabras clave</p>
            <div className="flex flex-wrap gap-2">
              {keywords.map((k) => (
                <span key={k} className="inline-flex items-center gap-1 rounded-full bg-unsa-primary/10 px-3 py-1.5 text-sm font-medium text-unsa-primary">
                  {k}
                  <button type="button" onClick={() => quitarKw(k)} aria-label={`Quitar ${k}`} className="text-unsa-primary/70 hover:text-unsa-primary">×</button>
                </span>
              ))}
            </div>
            <div className="mt-1 flex gap-2">
              <input
                value={nuevoKw}
                onChange={(e) => setNuevoKw(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); agregarKw(); } }}
                placeholder="Añadir palabra clave (ej: Python)"
                className="flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-unsa-primary focus:ring-2 focus:ring-unsa-primary/20 dark:border-zinc-700 dark:bg-zinc-800"
              />
              <button type="button" onClick={agregarKw} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">Añadir</button>
            </div>
          </div>

          <label className="mt-5 flex cursor-pointer select-none items-center gap-2">
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${quiereCorreo ? "bg-unsa-primary" : "bg-zinc-200 dark:bg-zinc-700"}`}>
              <input type="checkbox" className="sr-only" checked={quiereCorreo} onChange={() => setQuiereCorreo((v) => !v)} />
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${quiereCorreo ? "translate-x-6" : "translate-x-1"}`} />
            </div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Quiero recibir estas ofertas por correo</span>
          </label>

          {quiereCorreo && (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@unsa.edu.pe"
              className="mt-3 w-full max-w-sm rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-unsa-primary focus:ring-2 focus:ring-unsa-primary/20 dark:border-zinc-700 dark:bg-zinc-800"
            />
          )}

          <div className="mt-6 flex items-start gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <input
              id="politicas-cv"
              type="checkbox"
              checked={aceptaPoliticas}
              onChange={(e) => setAceptaPoliticas(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-unsa-primary focus:ring-unsa-primary dark:border-zinc-600 dark:bg-zinc-700"
            />
            <label htmlFor="politicas-cv" className="text-xs text-zinc-600 dark:text-zinc-400">
              He leído y acepto la Política de Privacidad, otorgando mi consentimiento para el tratamiento de mis datos personales en el marco de la <strong className="font-semibold text-zinc-900 dark:text-zinc-200">Ley N° 29733 (Ley de Protección de Datos Personales del Perú)</strong> y su reglamento.
            </label>
          </div>

          <button
            type="button"
            onClick={guardarPerfil}
            disabled={guardando || !aceptaPoliticas}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-unsa-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-unsa-primary-dark disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {guardando && <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            Guardar y ver mis ofertas
          </button>
        </section>
      </div>
    );
  }

  // Estado de carga
  if (estado === "procesando") {
    return (
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-unsa-primary/20 bg-white/70 p-12 text-center shadow-lg glass dark:border-unsa-primary/30 dark:glass-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-unsa-primary/5 to-transparent animate-pulse-slow"></div>
        <div className="relative z-10 flex size-20 items-center justify-center rounded-full bg-unsa-primary/10 shadow-inner">
          <span className="size-12 animate-spin rounded-full border-4 border-unsa-primary/20 border-t-unsa-primary shadow-sm" />
        </div>
        <div className="relative z-10">
          <p className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white" aria-live="polite">{ETAPAS[etapa]}</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Por favor, no cierres esta ventana.</p>
        </div>
        <div className="relative z-10 w-full max-w-md opacity-50">
          <RecomendacionSkeleton />
        </div>
      </div>
    );
  }

  // Estado inicial / error: selección de archivo
  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-unsa-primary/30 bg-white/50 p-12 text-center transition-all duration-300 hover:border-unsa-primary hover:bg-unsa-primary/5 hover:shadow-lg hover:shadow-unsa-primary/10 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-unsa-primary/50 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-unsa-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        <div className="relative z-10 flex size-20 items-center justify-center rounded-full bg-unsa-primary/10 text-4xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-unsa-primary/20 dark:bg-unsa-secondary-light/30">
          📄
        </div>
        <div className="relative z-10">
          <p className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
            {archivo ? archivo.name : "Haz clic para subir tu CV (PDF)"}
          </p>
          <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">Máximo 5 MB. Lo analizamos con Inteligencia Artificial.</p>
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => elegirArchivo(e.target.files?.[0] ?? null)}
      />

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">{error}</p>
      )}

      <button
        type="button"
        onClick={procesar}
        disabled={!archivo}
        className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-unsa-primary px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-unsa-primary-dark hover:shadow-lg focus:ring-4 focus:ring-unsa-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Analizar mi CV con IA
      </button>
    </div>
  );
}
