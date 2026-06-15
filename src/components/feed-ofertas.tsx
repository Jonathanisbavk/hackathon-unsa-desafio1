"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { esDemo, leerPerfilDemo, textoPerfilDemo } from "@/lib/demo";
import { OfertasGridSkeleton, RecomendacionSkeleton } from "@/components/skeletons";
import Combobox from "@/components/combobox";
import OfertaDetalleModal from "@/components/oferta-detalle-modal";
import SueldoBadge from "@/components/sueldo-badge";
import type { Oferta, OfertaConSimilitud, Preferencias } from "@/lib/types";
import { useOfertas, SIN_FILTROS } from "@/lib/hooks/use-ofertas";
import {
  ESCUELAS,
  TIPOS_EMPLEO,
  NIVELES_JERARQUIA,
  ESTADOS_EDUCACION,
  UBICACIONES_AREQUIPA,
} from "@/lib/constants";

interface FeedProps {
  userId?: string;
  preferenciasIniciales: Preferencias | null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FeedOfertas({ userId, preferenciasIniciales }: FeedProps) {
  const [detalle, setDetalle] = useState<Oferta | null>(null);

  // Filtros (estado "crudo" que edita el usuario).
  const [busqueda, setBusqueda] = useState("");
  const [carrera, setCarrera] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [tipos, setTipos] = useState<string[]>([]);
  const [niveles, setNiveles] = useState<string[]>([]);
  const [educacion, setEducacion] = useState<string[]>([]);
  const [soloSueldo, setSoloSueldo] = useState(preferenciasIniciales?.solo_con_sueldo ?? false);
  const [panelAbierto, setPanelAbierto] = useState(false);

  // Snapshot "aplicado" (tras debounce) que dispara la consulta vía useOfertas.
  const [aplicados, setAplicados] = useState(SIN_FILTROS);
  const { ofertas, cargando } = useOfertas(aplicados);

  // Alerta (demo pide correo).
  const [alertaGuardada, setAlertaGuardada] = useState(false);
  const [pidiendoEmail, setPidiendoEmail] = useState(false);
  const [emailAlerta, setEmailAlerta] = useState("");
  const [guardandoAlerta, setGuardandoAlerta] = useState(false);

  const [recomendaciones, setRecomendaciones] = useState<OfertaConSimilitud[]>([]);
  const [cargandoRecomendaciones, setCargandoRecomendaciones] = useState(true);

  const supabase = useMemo(() => createClient(), []);
  const demo = useRef(false);
  useEffect(() => {
    demo.current = esDemo();
  }, []);

  // ── Debounce: vuelca todos los filtros al snapshot aplicado ──
  useEffect(() => {
    const t = setTimeout(() => {
      setAlertaGuardada(false);
      setPidiendoEmail(false);
      setAplicados({ busqueda: busqueda.trim(), carrera, ubicacion, empresa: empresa.trim(), tipos, niveles, educacion, soloSueldo });
    }, 400);
    return () => clearTimeout(t);
  }, [busqueda, carrera, ubicacion, empresa, tipos, niveles, educacion, soloSueldo]);

  const cargarRecomendaciones = useCallback(async () => {
    setCargandoRecomendaciones(true);
    try {
      if (userId) {
        const res = await fetch(`/api/recomendaciones?userId=${userId}`);
        if (res.ok) setRecomendaciones((await res.json()).recomendaciones || []);
      } else if (demo.current) {
        const texto = textoPerfilDemo(leerPerfilDemo());
        if (texto.trim().length > 3) {
          const res = await fetch("/api/match", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texto }),
          });
          if (res.ok) setRecomendaciones((await res.json()).recomendaciones || []);
        }
      }
    } catch (error) {
      console.error("Error al cargar recomendaciones:", error);
    } finally {
      setCargandoRecomendaciones(false);
    }
  }, [userId]);

  useEffect(() => {
    const t = setTimeout(cargarRecomendaciones, 50);
    return () => clearTimeout(t);
  }, [cargarRecomendaciones]);

  // Abrir el modal de una recomendación (trae la oferta completa por id).
  async function abrirPorId(id: string) {
    const { data } = await supabase.from("ofertas").select("*").eq("id", id).single();
    if (data) setDetalle(data as Oferta);
  }

  async function crearAlertaAuth() {
    if (!userId || !aplicados.busqueda) return;
    const { error } = await supabase.from("alertas").insert({ egresado_id: userId, palabra_clave: aplicados.busqueda });
    if (error) return toast.error("No se pudo crear la alerta.");
    setAlertaGuardada(true);
    toast.success(`Alerta creada para "${aplicados.busqueda}"`);
  }

  async function crearAlertaDemo() {
    if (!EMAIL_RE.test(emailAlerta.trim())) return toast.error("Ingresa un correo válido.");
    setGuardandoAlerta(true);
    try {
      const res = await fetch("/api/alertas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ palabra_clave: aplicados.busqueda, email: emailAlerta.trim() }),
      });
      if (!res.ok) throw new Error();
      setAlertaGuardada(true);
      setPidiendoEmail(false);
      toast.success(`Te avisaremos a ${emailAlerta.trim()} sobre "${aplicados.busqueda}"`);
    } catch {
      toast.error("No se pudo crear la alerta. Intenta de nuevo.");
    } finally {
      setGuardandoAlerta(false);
    }
  }

  function toggle(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  }

  function limpiarFiltros() {
    setBusqueda(""); setCarrera(""); setUbicacion(""); setEmpresa("");
    setTipos([]); setNiveles([]); setEducacion([]); setSoloSueldo(false);
  }

  const empresasDisponibles = useMemo(
    () => [...new Set(ofertas.map((o) => o.empresa).filter(Boolean))] as string[],
    [ofertas],
  );

  const nFiltros =
    (carrera ? 1 : 0) + (ubicacion ? 1 : 0) + (empresa ? 1 : 0) +
    tipos.length + niveles.length + educacion.length + (soloSueldo ? 1 : 0);

  const chipsActivos: { label: string; clear: () => void }[] = [
    ...(carrera ? [{ label: carrera, clear: () => setCarrera("") }] : []),
    ...(ubicacion ? [{ label: ubicacion, clear: () => setUbicacion("") }] : []),
    ...(empresa ? [{ label: empresa, clear: () => setEmpresa("") }] : []),
    ...tipos.map((t) => ({ label: t, clear: () => toggle(tipos, setTipos, t) })),
    ...niveles.map((n) => ({ label: n, clear: () => toggle(niveles, setNiveles, n) })),
    ...educacion.map((e) => ({ label: e, clear: () => toggle(educacion, setEducacion, e) })),
    ...(soloSueldo ? [{ label: "Con sueldo", clear: () => setSoloSueldo(false) }] : []),
  ];

  const mostrarBloqueRecs =
    !aplicados.busqueda && nFiltros === 0 && (cargandoRecomendaciones || recomendaciones.length > 0);
  const buscando = cargando;

  return (
    <div className="flex flex-col gap-6">
      {/* CTA CV */}
      <Link
        href="/perfil"
        className="group flex items-center justify-between gap-4 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-white p-4 transition hover:shadow-md dark:border-indigo-900/40 dark:from-indigo-950/30 dark:to-zinc-900"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📄</span>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-white">Sube tu CV y mira tu % de coincidencia</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Analizamos tu PDF con IA y te recomendamos las ofertas que mejor encajan.</p>
          </div>
        </div>
        <span className="text-indigo-600 transition group-hover:translate-x-1 dark:text-indigo-400">→</span>
      </Link>

      {/* RECOMENDACIONES */}
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
                <button
                  key={oferta.id}
                  onClick={() => abrirPorId(oferta.id)}
                  className="flex flex-col gap-2 rounded-xl border border-indigo-100 bg-white p-4 text-left shadow-sm transition hover:shadow-md dark:border-indigo-900/50 dark:bg-zinc-900"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-bold leading-tight text-zinc-900 dark:text-white">{oferta.titulo}</h3>
                    {typeof oferta.similitud === "number" && (
                      <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                        {Math.round(oferta.similitud * 100)}% Match
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">{oferta.empresa}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BÚSQUEDA + BOTÓN FILTROS */}
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <div className="relative w-full flex-1">
            <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Palabra clave: puesto, tecnología, empresa..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full rounded-lg border-none bg-zinc-100 py-2.5 pl-10 pr-10 text-sm focus:ring-2 focus:ring-unsa-primary dark:bg-zinc-800 dark:text-white"
            />
            {buscando && (
              <span className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin rounded-full border-2 border-zinc-300 border-t-unsa-primary" />
            )}
          </div>
          <button
            onClick={() => setPanelAbierto((v) => !v)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
              panelAbierto || nFiltros > 0
                ? "border-unsa-primary bg-unsa-primary/10 text-unsa-primary"
                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 018 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filtros{nFiltros > 0 ? ` (${nFiltros})` : ""}
          </button>
        </div>

        {/* PANEL DE FILTROS COLAPSABLE */}
        {panelAbierto && (
          <div className="flex flex-col gap-5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500">Carrera</label>
                <Combobox value={carrera} onChange={setCarrera} options={ESCUELAS} placeholder="Escribe tu carrera…" ariaLabel="Filtrar por carrera" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500">Ubicación</label>
                <Combobox value={ubicacion} onChange={setUbicacion} options={UBICACIONES_AREQUIPA} placeholder="Distrito, provincia, ciudad…" allowFreeText ariaLabel="Filtrar por ubicación" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500">Empresa</label>
                <Combobox value={empresa} onChange={setEmpresa} options={empresasDisponibles} placeholder="Nombre de la empresa…" allowFreeText ariaLabel="Filtrar por empresa" />
              </div>
            </div>

            <FiltroChips titulo="Tipo de empleo" opciones={TIPOS_EMPLEO} sel={tipos} onToggle={(v) => toggle(tipos, setTipos, v)} />
            <FiltroChips titulo="Jerarquía" opciones={NIVELES_JERARQUIA} sel={niveles} onToggle={(v) => toggle(niveles, setNiveles, v)} />
            <FiltroChips titulo="Estado de educación" opciones={ESTADOS_EDUCACION} sel={educacion} onToggle={(v) => toggle(educacion, setEducacion, v)} />

            <label className="flex cursor-pointer select-none items-center gap-2">
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${soloSueldo ? "bg-unsa-primary" : "bg-zinc-200 dark:bg-zinc-700"}`}>
                <input type="checkbox" className="sr-only" checked={soloSueldo} onChange={() => setSoloSueldo(!soloSueldo)} />
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${soloSueldo ? "translate-x-6" : "translate-x-1"}`} />
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Solo ofertas con sueldo</span>
            </label>
          </div>
        )}

        {/* CHIPS DE FILTROS ACTIVOS */}
        {chipsActivos.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
            {chipsActivos.map((c, i) => (
              <button
                key={`${c.label}-${i}`}
                onClick={c.clear}
                className="inline-flex items-center gap-1 rounded-full bg-unsa-primary/10 px-3 py-1 text-xs font-medium text-unsa-primary transition hover:bg-unsa-primary/20"
              >
                {c.label} <span aria-hidden>×</span>
              </button>
            ))}
            <button onClick={limpiarFiltros} className="text-xs font-semibold text-zinc-500 underline hover:text-unsa-primary">
              Limpiar todo
            </button>
          </div>
        )}
      </div>

      {/* CREAR ALERTA */}
      {aplicados.busqueda.length > 0 && (
        <div className="flex flex-col items-center gap-3">
          {alertaGuardada ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300">
              <span className="text-lg">🔔</span> Alerta creada para &ldquo;{aplicados.busqueda}&rdquo;
            </span>
          ) : userId ? (
            <button onClick={crearAlertaAuth} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:border-unsa-primary hover:text-unsa-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              <span className="text-lg">🔔</span> Crear alerta para &ldquo;{aplicados.busqueda}&rdquo;
            </button>
          ) : !pidiendoEmail ? (
            <button onClick={() => setPidiendoEmail(true)} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:border-unsa-primary hover:text-unsa-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              <span className="text-lg">🔔</span> Recibir ofertas de &ldquo;{aplicados.busqueda}&rdquo; por correo
            </button>
          ) : (
            <div className="flex w-full max-w-md flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm sm:flex-row dark:border-zinc-800 dark:bg-zinc-900">
              <input type="email" autoFocus value={emailAlerta} onChange={(e) => setEmailAlerta(e.target.value)} placeholder="tucorreo@unsa.edu.pe" className="flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-unsa-primary focus:ring-2 focus:ring-unsa-primary/20 dark:border-zinc-700 dark:bg-zinc-800" />
              <button onClick={crearAlertaDemo} disabled={guardandoAlerta} className="inline-flex items-center justify-center gap-2 rounded-lg bg-unsa-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-unsa-primary-dark disabled:opacity-60">
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
                  <p className="text-sm text-zinc-500">
                    {oferta.empresa}
                    {(oferta.distrito || oferta.ciudad) && (
                      <span className="text-zinc-400"> · {oferta.distrito || oferta.ciudad}</span>
                    )}
                  </p>
                </div>
                <SueldoBadge
                  visible={oferta.sueldo_visible}
                  min={oferta.sueldo_min}
                  max={oferta.sueldo_max}
                />
              </div>

              <div className="mt-1 flex flex-wrap gap-2">
                {oferta.tipo_empleo && (
                  <span className="rounded bg-unsa-primary/10 px-2 py-0.5 text-xs font-bold text-unsa-primary">{oferta.tipo_empleo}</span>
                )}
                {oferta.modalidad && (
                  <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{oferta.modalidad}</span>
                )}
                {oferta.nivel_jerarquia && (
                  <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{oferta.nivel_jerarquia}</span>
                )}
              </div>

              <p className="line-clamp-3 flex-grow text-sm text-zinc-600 dark:text-zinc-400">{oferta.descripcion}</p>

              <button
                onClick={() => setDetalle(oferta)}
                className="mt-2 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                Ver detalles completos
              </button>
            </div>
          ))}
        </div>
      )}

      {detalle && <OfertaDetalleModal oferta={detalle} onClose={() => setDetalle(null)} />}
    </div>
  );
}

function FiltroChips({
  titulo,
  opciones,
  sel,
  onToggle,
}: {
  titulo: string;
  opciones: readonly string[];
  sel: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">{titulo}</p>
      <div className="flex flex-wrap gap-2">
        {opciones.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              sel.includes(o)
                ? "border-unsa-primary bg-unsa-primary text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:border-unsa-primary/60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
