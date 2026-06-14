"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { esDemo, leerPerfilDemo, textoPerfilDemo } from "@/lib/demo";
import { OfertasGridSkeleton, RecomendacionSkeleton } from "@/components/skeletons";

interface FeedProps {
  userId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preferenciasIniciales: any;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FeedOfertas({ userId, preferenciasIniciales }: FeedProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [debounced, setDebounced] = useState("");
  const [cargando, setCargando] = useState(true);
  const [soloSueldo, setSoloSueldo] = useState(preferenciasIniciales?.solo_con_sueldo ?? false);

  // Estado de la alerta (demo pide correo).
  const [alertaGuardada, setAlertaGuardada] = useState(false);
  const [pidiendoEmail, setPidiendoEmail] = useState(false);
  const [emailAlerta, setEmailAlerta] = useState("");
  const [guardandoAlerta, setGuardandoAlerta] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recomendaciones, setRecomendaciones] = useState<any[]>([]);
  const [cargandoRecomendaciones, setCargandoRecomendaciones] = useState(true);

  const supabase = createClient();
  const demo = useRef(false);
  useEffect(() => {
    demo.current = esDemo();
  }, []);

  // ── Debounce del buscador (evita una query por tecla) ──
  useEffect(() => {
    const t = setTimeout(() => {
      setCargando(true);
      setDebounced(busqueda.trim());
      setAlertaGuardada(false);
      setPidiendoEmail(false);
    }, 400);
    return () => clearTimeout(t);
  }, [busqueda]);

  const buscarOfertas = useCallback(async () => {
    let query = supabase
      .from("ofertas")
      .select("*")
      .eq("estado", "publicada")
      .order("created_at", { ascending: false })
      .limit(50);

    if (soloSueldo) query = query.eq("sueldo_visible", true);
    if (debounced.length > 0) {
      query = query.or(`titulo.ilike.%${debounced}%,descripcion.ilike.%${debounced}%`);
    }

    const { data } = await query;
    if (data) setOfertas(data);
    setCargando(false);
  }, [debounced, soloSueldo, supabase]);

  const cargarRecomendaciones = useCallback(async () => {
    setCargandoRecomendaciones(true);
    try {
      if (userId) {
        const res = await fetch(`/api/recomendaciones?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setRecomendaciones(data.recomendaciones || []);
        }
      } else if (demo.current) {
        // Demo: matching a partir del perfil guardado en el navegador.
        const texto = textoPerfilDemo(leerPerfilDemo());
        if (texto.trim().length > 3) {
          const res = await fetch("/api/match", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texto }),
          });
          if (res.ok) {
            const data = await res.json();
            setRecomendaciones(data.recomendaciones || []);
          }
        }
      }
    } catch (error) {
      console.error("Error al cargar recomendaciones:", error);
    } finally {
      setCargandoRecomendaciones(false);
    }
  }, [userId]);

  useEffect(() => {
    // Fetch asíncrono al montar/cambiar filtros: el setState ocurre tras await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    buscarOfertas();
  }, [buscarOfertas]);

  // Cargar recomendaciones una vez montado (tras detectar demo).
  useEffect(() => {
    const t = setTimeout(cargarRecomendaciones, 50);
    return () => clearTimeout(t);
  }, [cargarRecomendaciones]);

  // Alerta para usuarios autenticados (inserción directa con RLS).
  async function crearAlertaAuth() {
    if (!userId || debounced.length === 0) return;
    const { error } = await supabase.from("alertas").insert({
      egresado_id: userId,
      palabra_clave: debounced,
    });
    if (error) {
      toast.error("No se pudo crear la alerta.");
      return;
    }
    setAlertaGuardada(true);
    toast.success(`Alerta creada para "${debounced}"`);
  }

  // Alerta para demo: pide correo y la guarda vía API.
  async function crearAlertaDemo() {
    if (!EMAIL_RE.test(emailAlerta.trim())) {
      toast.error("Ingresa un correo válido.");
      return;
    }
    setGuardandoAlerta(true);
    try {
      const res = await fetch("/api/alertas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ palabra_clave: debounced, email: emailAlerta.trim() }),
      });
      if (!res.ok) throw new Error();
      setAlertaGuardada(true);
      setPidiendoEmail(false);
      toast.success(`Te avisaremos a ${emailAlerta.trim()} sobre "${debounced}"`);
    } catch {
      toast.error("No se pudo crear la alerta. Intenta de nuevo.");
    } finally {
      setGuardandoAlerta(false);
    }
  }

  const mostrarBloqueRecs =
    debounced.length === 0 && (cargandoRecomendaciones || recomendaciones.length > 0);

  return (
    <div className="flex flex-col gap-6">
      {/* CTA: subir CV para ver % de match */}
      <Link
        href="/perfil"
        className="group flex items-center justify-between gap-4 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-white p-4 transition hover:shadow-md dark:border-indigo-900/40 dark:from-indigo-950/30 dark:to-zinc-900"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📄</span>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-white">
              Sube tu CV y mira tu % de coincidencia
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Analizamos tu PDF con IA y te recomendamos las ofertas que mejor encajan.
            </p>
          </div>
        </div>
        <span className="text-indigo-600 transition group-hover:translate-x-1 dark:text-indigo-400">→</span>
      </Link>

      {/* RECOMENDACIONES (IA) */}
      {mostrarBloqueRecs && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 dark:border-indigo-900/30 dark:bg-indigo-950/20">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-indigo-900 dark:text-indigo-200">
            <span>✨</span> Recomendadas para ti
          </h2>
          {cargandoRecomendaciones ? (
            <RecomendacionSkeleton />
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {recomendaciones.map((oferta) => (
                <div key={oferta.id} className="flex flex-col gap-2 rounded-xl border border-indigo-100 bg-white p-4 shadow-sm dark:border-indigo-900/50 dark:bg-zinc-900">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-bold leading-tight text-zinc-900 dark:text-white">{oferta.titulo}</h3>
                    {typeof oferta.similitud === "number" && (
                      <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                        {Math.round(oferta.similitud * 100)}% Match
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">{oferta.empresa}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BÚSQUEDA Y FILTROS */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row dark:border-zinc-800 dark:bg-zinc-900">
        <div className="relative w-full sm:w-96">
          <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por puesto, tecnología..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-lg border-none bg-zinc-100 py-2.5 pl-10 pr-10 text-sm focus:ring-2 focus:ring-unsa-primary dark:bg-zinc-800 dark:text-white"
          />
          {cargando && busqueda !== debounced && (
            <span className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin rounded-full border-2 border-zinc-300 border-t-unsa-primary" />
          )}
        </div>

        <label className="flex cursor-pointer select-none items-center gap-2">
          <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${soloSueldo ? "bg-unsa-primary" : "bg-zinc-200 dark:bg-zinc-700"}`}>
            <input type="checkbox" className="sr-only" checked={soloSueldo} onChange={() => { setCargando(true); setSoloSueldo(!soloSueldo); }} />
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${soloSueldo ? "translate-x-6" : "translate-x-1"}`} />
          </div>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Solo ofertas con sueldo</span>
        </label>
      </div>

      {/* CREAR ALERTA */}
      {debounced.length > 0 && (
        <div className="flex flex-col items-center gap-3">
          {alertaGuardada ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300">
              <span className="text-lg">🔔</span> Alerta creada para &ldquo;{debounced}&rdquo;
            </span>
          ) : userId ? (
            <button
              onClick={crearAlertaAuth}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:border-unsa-primary hover:text-unsa-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <span className="text-lg">🔔</span> Crear alerta para &ldquo;{debounced}&rdquo;
            </button>
          ) : !pidiendoEmail ? (
            <button
              onClick={() => setPidiendoEmail(true)}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:border-unsa-primary hover:text-unsa-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <span className="text-lg">🔔</span> Recibir ofertas de &ldquo;{debounced}&rdquo; por correo
            </button>
          ) : (
            <div className="flex w-full max-w-md flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm sm:flex-row dark:border-zinc-800 dark:bg-zinc-900">
              <input
                type="email"
                autoFocus
                value={emailAlerta}
                onChange={(e) => setEmailAlerta(e.target.value)}
                placeholder="tucorreo@unsa.edu.pe"
                className="flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-unsa-primary focus:ring-2 focus:ring-unsa-primary/20 dark:border-zinc-700 dark:bg-zinc-800"
              />
              <button
                onClick={crearAlertaDemo}
                disabled={guardandoAlerta}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-unsa-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-unsa-primary-dark disabled:opacity-60"
              >
                {guardandoAlerta && <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                Avisarme
              </button>
            </div>
          )}
        </div>
      )}

      {/* RESULTADOS */}
      {cargando ? (
        <OfertasGridSkeleton n={4} />
      ) : ofertas.length === 0 ? (
        <div className="py-12 text-center">
          <span className="mb-3 block text-4xl">📭</span>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No hay ofertas que coincidan</h3>
          <p className="text-zinc-500 dark:text-zinc-400">Prueba con otra búsqueda o ajusta los filtros.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ofertas.map((oferta) => (
            <div key={oferta.id} className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="line-clamp-2 font-bold text-zinc-900 dark:text-white">{oferta.titulo}</h3>
                  <p className="text-sm text-zinc-500">{oferta.empresa}</p>
                </div>
                {oferta.sueldo_visible ? (
                  <span className="inline-flex shrink-0 items-center rounded-md bg-green-50 px-2 py-1 text-xs font-bold text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-300">
                    S/ {oferta.sueldo_min} {oferta.sueldo_max ? `- ${oferta.sueldo_max}` : ""}
                  </span>
                ) : (
                  <span className="inline-flex shrink-0 items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10 dark:bg-zinc-800 dark:text-zinc-400">
                    Sueldo no especificado
                  </span>
                )}
              </div>

              <div className="mt-1 flex flex-wrap gap-2">
                <span className="rounded bg-unsa-primary/10 px-2 py-0.5 text-xs font-bold uppercase text-unsa-primary">
                  {oferta.tipo?.replace("_", " ")}
                </span>
                {oferta.modalidad && (
                  <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {oferta.modalidad}
                  </span>
                )}
              </div>

              <p className="line-clamp-3 flex-grow text-sm text-zinc-600 dark:text-zinc-400">
                {oferta.descripcion}
              </p>

              <button className="mt-2 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
                Ver detalles completos
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
