"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Oferta } from "@/lib/types";

/** Filtros ya "aplicados" (tras debounce) que disparan la consulta. */
export interface FiltrosAplicados {
  busqueda: string;
  carrera: string;
  ubicacion: string;
  empresa: string;
  tipos: string[];
  niveles: string[];
  educacion: string[];
  soloSueldo: boolean;
}

export const SIN_FILTROS: FiltrosAplicados = {
  busqueda: "",
  carrera: "",
  ubicacion: "",
  empresa: "",
  tipos: [],
  niveles: [],
  educacion: [],
  soloSueldo: false,
};

// PostgREST usa , ( ) como delimitadores en .or(): los quitamos del término.
const safe = (s: string) => s.replace(/[(),]/g, " ").trim();

/**
 * Encapsula la consulta del feed de ofertas: traduce los filtros aplicados a una
 * query de Supabase y expone el resultado con su estado de carga. Separa el acceso
 * a datos de la presentación del componente.
 */
export function useOfertas(filtros: FiltrosAplicados) {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [cargando, setCargando] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const buscar = useCallback(async () => {
    setCargando(true);

    let query = supabase
      .from("ofertas")
      .select("*")
      .eq("estado", "publicada")
      .order("created_at", { ascending: false })
      .limit(50);

    if (filtros.soloSueldo) query = query.eq("sueldo_visible", true);
    if (filtros.busqueda) {
      const b = safe(filtros.busqueda);
      query = query.or(`titulo.ilike.%${b}%,descripcion.ilike.%${b}%`);
    }
    if (filtros.carrera) query = query.contains("escuela_objetivo", [filtros.carrera]);
    if (filtros.empresa) query = query.ilike("empresa", `%${filtros.empresa}%`);
    if (filtros.ubicacion) {
      const u = safe(filtros.ubicacion);
      query = query.or(`ciudad.ilike.%${u}%,provincia.ilike.%${u}%,distrito.ilike.%${u}%`);
    }
    if (filtros.tipos.length) query = query.in("tipo_empleo", filtros.tipos);
    if (filtros.niveles.length) query = query.in("nivel_jerarquia", filtros.niveles);
    if (filtros.educacion.length) query = query.overlaps("dirigido_a", filtros.educacion);

    const { data } = await query;
    setOfertas(data ?? []);
    setCargando(false);
  }, [filtros, supabase]);

  useEffect(() => {
    // Fetch asíncrono: el setState ocurre tras await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    buscar();
  }, [buscar]);

  return { ofertas, cargando };
}
