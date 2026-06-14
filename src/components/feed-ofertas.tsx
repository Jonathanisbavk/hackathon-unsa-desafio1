"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface FeedProps {
  userId?: string;
  preferenciasIniciales: any;
}

export default function FeedOfertas({ userId, preferenciasIniciales }: FeedProps) {
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [soloSueldo, setSoloSueldo] = useState(preferenciasIniciales?.solo_con_sueldo ?? false);
  const [alertaGuardada, setAlertaGuardada] = useState(false);

  const [recomendaciones, setRecomendaciones] = useState<any[]>([]);
  const [cargandoRecomendaciones, setCargandoRecomendaciones] = useState(false);

  const supabase = createClient();

  // Función de búsqueda envuelta en useCallback
  const buscarOfertas = useCallback(async () => {
    setCargando(true);
    let query = supabase
      .from("ofertas")
      .select("*")
      .eq("estado", "publicada")
      .order("created_at", { ascending: false })
      .limit(50);

    // Aplicar filtro de sueldo visible
    if (soloSueldo) {
      query = query.eq("sueldo_visible", true);
    }

    // Aplicar filtro de búsqueda
    if (busqueda.trim().length > 0) {
      // Búsqueda en título o descripción
      query = query.or(`titulo.ilike.%${busqueda}%,descripcion.ilike.%${busqueda}%`);
    } else if (preferenciasIniciales && preferenciasIniciales.escuelas_interes?.length > 0) {
      // MVP: sin búsqueda explícita mostramos lo más reciente
    }

    const { data, error } = await query;
    if (data) setOfertas(data);
    setCargando(false);
  }, [busqueda, soloSueldo, preferenciasIniciales, supabase]);

  const cargarRecomendaciones = useCallback(async () => {
    if (!userId) return;
    setCargandoRecomendaciones(true);
    try {
      const res = await fetch(`/api/recomendaciones?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setRecomendaciones(data.recomendaciones || []);
      }
    } catch (error) {
      console.error("Error al cargar recomendaciones:", error);
    } finally {
      setCargandoRecomendaciones(false);
    }
  }, [userId]);

  useEffect(() => {
    buscarOfertas();
  }, [buscarOfertas]);

  useEffect(() => {
    cargarRecomendaciones();
  }, [cargarRecomendaciones]);

  // Al escribir en el buscador, reseteamos el estado de alerta guardada
  useEffect(() => {
    setAlertaGuardada(false);
  }, [busqueda]);

  async function crearAlerta() {
    if (!userId || busqueda.trim().length === 0) return;
    
    await supabase.from("alertas").insert({
      egresado_id: userId,
      palabra_clave: busqueda.trim(),
    });
    setAlertaGuardada(true);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* SECCIÓN RECOMENDACIONES (IA) */}
      {!cargandoRecomendaciones && recomendaciones.length > 0 && busqueda.trim().length === 0 && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 dark:border-indigo-900/30 dark:bg-indigo-950/20">
          <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2">
            <span>✨</span> Recomendadas para ti
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {recomendaciones.map((oferta) => (
              <div key={oferta.id} className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm border border-indigo-100 dark:bg-zinc-900 dark:border-indigo-900/50">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-2 leading-tight">{oferta.titulo}</h3>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
                    {Math.round(oferta.similitud * 100)}% Match
                  </span>
                </div>
                <p className="text-xs text-zinc-500">{oferta.empresa}</p>
                <div className="mt-auto pt-2">
                  <button className="w-full text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">Ver oferta &rarr;</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="relative w-full sm:w-96">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por puesto, tecnología..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-lg border-none bg-zinc-100 py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-unsa-primary dark:bg-zinc-800 dark:text-white"
          />
        </div>
        
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${soloSueldo ? 'bg-unsa-primary' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={soloSueldo} 
              onChange={() => setSoloSueldo(!soloSueldo)} 
            />
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${soloSueldo ? 'translate-x-6' : 'translate-x-1'}`} />
          </div>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Solo ofertas con sueldo</span>
        </label>
      </div>

      {/* BOTÓN CREAR ALERTA */}
      {busqueda.trim().length > 0 && userId && (
        <div className="flex justify-center">
          <button 
            onClick={crearAlerta}
            disabled={alertaGuardada}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-all shadow-sm border ${
              alertaGuardada 
                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-white text-zinc-700 border-zinc-200 hover:border-unsa-primary hover:text-unsa-primary dark:bg-zinc-800 dark:text-zinc-200'
            }`}
          >
            <span className="text-lg">🔔</span>
            {alertaGuardada ? `Alerta creada para "${busqueda}"` : `Crear alerta para "${busqueda}"`}
          </button>
        </div>
      )}

      {/* RESULTADOS DEL FEED */}
      <div className="grid gap-4 md:grid-cols-2">
        {cargando ? (
          <div className="col-span-full py-12 text-center text-zinc-500">Cargando ofertas...</div>
        ) : ofertas.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <span className="text-4xl mb-3 block">📭</span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No hay ofertas publicadas</h3>
            <p className="text-zinc-500 dark:text-zinc-400">Intenta cambiar tus filtros o tu búsqueda.</p>
          </div>
        ) : (
          ofertas.map((oferta) => (
            <div key={oferta.id} className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white line-clamp-2">{oferta.titulo}</h3>
                  <p className="text-sm text-zinc-500">{oferta.empresa}</p>
                </div>
                {/* Badge Sueldo */}
                {oferta.sueldo_visible ? (
                  <span className="inline-flex shrink-0 items-center rounded-md bg-green-50 px-2 py-1 text-xs font-bold text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-300">
                    S/ {oferta.sueldo_min} {oferta.sueldo_max ? `- ${oferta.sueldo_max}` : ''}
                  </span>
                ) : (
                  <span className="inline-flex shrink-0 items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10 dark:bg-zinc-800 dark:text-zinc-400">
                    Sueldo no especificado
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-unsa-primary/10 text-unsa-primary text-xs font-bold uppercase">
                  {oferta.tipo?.replace('_', ' ')}
                </span>
                {oferta.modalidad && (
                  <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 text-xs font-medium dark:bg-zinc-800 dark:text-zinc-300">
                    {oferta.modalidad}
                  </span>
                )}
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 flex-grow">
                {oferta.descripcion}
              </p>
              
              <button className="mt-2 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
                Ver detalles completos
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
