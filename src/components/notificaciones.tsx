"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NotificacionesCampana({ userId }: { userId?: string }) {
  const [count, setCount] = useState(0);
  const [abierto, setAbierto] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;
    
    // Cargar iniciales
    fetchNotifs();

    // En un caso real con Supabase Realtime, aquí nos suscribiríamos a cambios.
    // Para MVP haremos un polling ligero o simplemente lectura inicial.
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  async function fetchNotifs() {
    if (!userId) return;
    const { data } = await supabase
      .from("notificaciones")
      .select("*, oferta:ofertas(titulo, empresa)")
      .eq("egresado_id", userId)
      .eq("leida", false)
      .order("created_at", { ascending: false })
      .limit(10);
      
    if (data) {
      setNotifs(data);
      setCount(data.length);
    }
  }

  async function marcarComoLeidas() {
    if (!userId || notifs.length === 0) return;
    await supabase
      .from("notificaciones")
      .update({ leida: true })
      .in("id", notifs.map(n => n.id));
      
    setCount(0);
    setNotifs([]);
  }

  if (!userId) return null; // No hay notificaciones para invitados sin login

  return (
    <div className="relative">
      <button 
        onClick={() => setAbierto(!abierto)}
        className="relative rounded-full p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {count > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-zinc-900">
            {count}
          </span>
        )}
      </button>

      {abierto && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50">
          <div className="flex items-center justify-between border-b border-zinc-100 p-4 dark:border-zinc-800">
            <h3 className="font-bold text-zinc-900 dark:text-white">Notificaciones</h3>
            {count > 0 && (
              <button onClick={marcarComoLeidas} className="text-xs font-semibold text-unsa-primary hover:underline">
                Marcar leídas
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto p-2">
            {notifs.length === 0 ? (
              <p className="p-4 text-center text-sm text-zinc-500">No tienes notificaciones nuevas.</p>
            ) : (
              notifs.map(n => (
                <div key={n.id} className="rounded-lg p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 mb-1">
                  <p className="text-xs font-semibold text-unsa-primary uppercase tracking-wider mb-1">
                    {n.motivo === 'alerta' ? '🚨 Match de Alerta' : 'Match de Perfil'}
                  </p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    {n.oferta?.titulo}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">{n.oferta?.empresa}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
