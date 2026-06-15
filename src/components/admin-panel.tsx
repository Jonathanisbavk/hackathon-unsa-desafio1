"use client";

import { useState } from "react";
import { type OfertaExtraida } from "@/lib/ai/types";
import { TIPOS_EMPLEO, NIVELES_JERARQUIA, ESTADOS_EDUCACION } from "@/lib/constants";
import { formatRangoSueldo } from "@/lib/format";
import { toast } from "sonner";

export default function AdminPanel() {
  const [textoCrudo, setTextoCrudo] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oferta, setOferta] = useState<OfertaExtraida | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Editar un campo de la oferta en la vista previa antes de publicar.
  function setCampo<K extends keyof OfertaExtraida>(campo: K, valor: OfertaExtraida[K]) {
    setOferta((o) => (o ? { ...o, [campo]: valor } : o));
  }
  function toggleDirigido(valor: string) {
    setOferta((o) => {
      if (!o) return o;
      const actual = o.dirigido_a ?? [];
      return { ...o, dirigido_a: actual.includes(valor) ? actual.filter((x) => x !== valor) : [...actual, valor] };
    });
  }

  // ── Botón 1: Pegar ──
  async function handlePegar() {
    try {
      const text = await navigator.clipboard.readText();
      setTextoCrudo(text);
      setOferta(null);
      setError(null);
      setMensajeExito(null);
    } catch {
      setError("No se pudo acceder al portapapeles. Pega el texto manualmente.");
    }
  }

  // ── Botón 2: Mejorar ──
  async function handleMejorar() {
    if (textoCrudo.trim().length < 20) {
      setError("El texto es muy corto para ser una oferta real.");
      return;
    }

    setProcesando(true);
    setError(null);
    setOferta(null);
    setMensajeExito(null);

    try {
      const res = await fetch("/api/mejorar-oferta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto_crudo: textoCrudo }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar la oferta.");

      setOferta(data);
      toast.success("Oferta procesada correctamente.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido al procesar.";
      setError(msg);
      toast.error(msg);
    } finally {
      setProcesando(false);
    }
  }

  // ── Botón 3: Publicar / Descartar ──
  async function handlePublicar(esRuido: boolean = false) {
    if (!oferta) return;
    
    setPublicando(true);
    setError(null);

    try {
      const payload = {
        oferta: oferta,
        texto_crudo: textoCrudo,
        es_ruido: esRuido || oferta.clasificacion !== "oferta",
      };

      const res = await fetch("/api/publicar-oferta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al publicar la oferta.");

      const msg = esRuido 
        ? "✅ Oferta descartada correctamente." 
        : `🚀 ¡Oferta publicada exitosamente! (${data.alertas_disparadas} alertas enviadas)`;
        
      setMensajeExito(msg);
      toast.success(msg);
      
      setOferta(null);
      setTextoCrudo("");
      
      // Limpiar mensaje de éxito después de 5s
      setTimeout(() => setMensajeExito(null), 5000);
      
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al guardar en base de datos.";
      setError(msg);
      toast.error(msg);
    } finally {
      setPublicando(false);
    }
  }

  function handleCopiarMensaje() {
    if (oferta?.mensaje_empleador) {
      navigator.clipboard.writeText(oferta.mensaje_empleador);
      toast.success("¡Mensaje copiado al portapapeles!");
    }
  }

  function handleRechazar() {
    if (!oferta?.contacto_email) {
      toast.error("La IA no detectó el correo del empleador. Agrégalo manualmente abajo antes de rechazar.");
      return;
    }
    const subject = encodeURIComponent(`Observaciones sobre su oferta laboral: ${oferta.titulo || "Sin Título"}`);
    const body = encodeURIComponent(`Estimado empleador,\n\nHemos revisado su oferta de trabajo, pero para mantener la transparencia en la bolsa de trabajo de la UNSA, requerimos que la oferta cumpla con ciertos criterios.\n\nObservaciones detectadas:\n- [Escriba aquí sus observaciones. Ej: Falta el rango salarial / Perfil no definido].\n\nPor favor, confírmenos estos datos respondiendo a este correo para proceder con la publicación inmediata.\n\nAtentamente,\nEquipo CONECTA UNSA`);
    
    // Abrir cliente de correo
    window.location.href = `mailto:${oferta.contacto_email}?subject=${subject}&body=${body}`;
    
    // Descartamos la oferta en nuestra base de datos (se guarda como descartada)
    handlePublicar(true);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {/* LADO IZQUIERDO: Input crudo */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">1. Correo Original</h2>
          <button
            onClick={handlePegar}
            className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-200 transition-all hover:bg-zinc-50 hover:text-unsa-primary hover:ring-unsa-primary/30 active:scale-95 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-white dark:hover:ring-unsa-primary/50"
            aria-label="Pegar texto"
            title="Pegar desde el portapapeles"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="hidden sm:inline">Pegar Texto</span>
            <span className="sm:hidden">Pegar</span>
          </button>
        </div>
        
        <div className="relative w-full flex-grow flex flex-col">
          <textarea
            value={textoCrudo}
            onChange={(e) => setTextoCrudo(e.target.value)}
            placeholder=""
            className="w-full flex-grow min-h-[400px] lg:min-h-[600px] resize-none rounded-xl border border-zinc-200 bg-white p-4 text-sm font-mono text-zinc-700 shadow-inner focus:border-unsa-primary focus:outline-none focus:ring-4 focus:ring-unsa-primary/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          />
          
          {/* Overlay de Pegado Intuitivo cuando está vacío */}
          {textoCrudo.length === 0 && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
              <button
                onClick={handlePegar}
                className="pointer-events-auto flex w-full max-w-sm flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/80 px-8 py-12 text-zinc-500 backdrop-blur-sm transition-all hover:border-unsa-primary/50 hover:bg-unsa-primary/5 hover:text-unsa-primary hover:shadow-xl hover:scale-[1.02] active:scale-95 dark:border-zinc-700 dark:bg-zinc-900/80 dark:hover:border-unsa-primary/50 dark:hover:bg-unsa-primary/10"
              >
                <div className="rounded-full bg-white p-4 shadow-sm ring-1 ring-zinc-200 transition-transform group-hover:scale-110 dark:bg-zinc-800 dark:ring-zinc-700">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-center">Pegar texto del portapapeles</span>
                <span className="text-xs font-medium uppercase tracking-wider opacity-70 text-center">
                  Haz clic aquí o presiona Ctrl+V
                </span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleMejorar}
          disabled={procesando || textoCrudo.trim().length === 0}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-unsa-primary px-6 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-unsa-primary-dark hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {procesando ? (
            <>
              <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Procesando con IA...
            </>
          ) : (
            <>
              ✨ Mejorar Oferta
            </>
          )}
        </button>
      </div>

      {/* LADO DERECHO: Vista Previa y Acciones */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">2. Vista Previa Estandarizada</h2>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
            ❌ {error}
          </div>
        )}

        {mensajeExito && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-200 font-semibold animate-in fade-in slide-in-from-top-2">
            {mensajeExito}
          </div>
        )}

        {!oferta && !procesando && !error && !mensajeExito && (
          <div className="flex flex-col items-center justify-center flex-grow min-h-[400px] rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="text-4xl mb-4">✨</span>
            <p className="text-zinc-500 font-medium">La IA estructurará la oferta aquí</p>
            <p className="text-zinc-400 text-sm mt-1">Lista para publicar en 1 clic</p>
          </div>
        )}

        {/* CASO: RUIDO */}
        {oferta && oferta.clasificacion !== "oferta" && (
          <div className="flex flex-col gap-4 rounded-xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-900/50 dark:bg-orange-950/30">
            <div className="flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="font-bold text-orange-900 dark:text-orange-100 text-lg">
                  El sistema detectó que esto es ruido
                </h3>
                <p className="mt-1 text-orange-800 dark:text-orange-200">
                  Motivo: {oferta.motivo_ruido || "Contenido no relacionado a empleo."}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => handlePublicar(true)}
              disabled={publicando}
              className="mt-4 w-full rounded-lg bg-orange-600 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-orange-700 disabled:opacity-60"
            >
              {publicando ? "Descartando..." : "Descartar este correo"}
            </button>
          </div>
        )}

        {/* CASO: OFERTA VÁLIDA */}
        {oferta && oferta.clasificacion === "oferta" && (
          <div className="flex flex-col gap-6 flex-grow rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            
            {/* Header Oferta */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md bg-unsa-primary/10 text-unsa-primary text-xs font-bold uppercase tracking-wider">
                  {oferta.tipo?.replace("_", " ")}
                </span>
                {oferta.modalidad && (
                  <span className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600 text-xs font-bold uppercase tracking-wider dark:bg-zinc-800 dark:text-zinc-400">
                    {oferta.modalidad}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
                {oferta.titulo}
              </h3>
              <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400 mt-1">
                {oferta.empresa}
              </p>
            </div>

            <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800" />

            {/* ADVERTENCIA DE SUELDO (NUDGE) */}
            {!oferta.sueldo_visible ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/30">
                <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                  <span>⚠️</span> Faltan datos salariales
                </h4>
                <p className="text-sm text-amber-800 dark:text-amber-200 mb-4">
                  Esta oferta perderá visibilidad entre los egresados que activaron el filtro de transparencia. 
                  Te recomendamos pedir el sueldo al empleador usando este mensaje automático:
                </p>
                <div className="relative">
                  <textarea
                    readOnly
                    value={oferta.mensaje_empleador}
                    className="w-full h-32 rounded-lg border border-amber-300/50 bg-white/50 p-3 text-xs text-amber-900 font-mono focus:outline-none dark:border-amber-700/50 dark:bg-black/20 dark:text-amber-100"
                  />
                  <button 
                    onClick={handleCopiarMensaje}
                    className="absolute bottom-3 right-3 rounded-md bg-amber-200/50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-300/50 transition dark:bg-amber-900/50 dark:text-amber-100"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/30 flex items-center gap-3">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-bold text-green-900 dark:text-green-100">Transparencia Salarial OK</p>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Sueldo: {formatRangoSueldo(oferta.sueldo_min, oferta.sueldo_max) ?? "—"}
                  </p>
                </div>
              </div>
            )}

            {/* Detalles */}
            <div className="flex flex-col gap-4 flex-grow">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Escuelas Objetivo</h4>
                <div className="flex flex-wrap gap-1.5">
                  {oferta.escuela_objetivo?.length ? oferta.escuela_objetivo.map(e => (
                    <span key={e} className="px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {e}
                    </span>
                  )) : (
                    <span className="text-sm text-zinc-500">Todas / No especificado</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Descripción</h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                  {oferta.descripcion}
                </p>
              </div>

              {oferta.requisitos && oferta.requisitos.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Requisitos</h4>
                  <ul className="list-disc pl-4 text-sm text-zinc-700 dark:text-zinc-300">
                    {oferta.requisitos.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Campos adicionales editables (la IA pudo no detectarlos) */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Datos para filtros y contacto (editable)</h4>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Tipo de empleo
                  <select value={oferta.tipo_empleo ?? ""} onChange={(e) => setCampo("tipo_empleo", e.target.value || null)} className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                    <option value="">—</option>
                    {TIPOS_EMPLEO.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Jerarquía
                  <select value={oferta.nivel_jerarquia ?? ""} onChange={(e) => setCampo("nivel_jerarquia", e.target.value || null)} className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                    <option value="">—</option>
                    {NIVELES_JERARQUIA.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Ciudad
                  <input value={oferta.ciudad ?? ""} onChange={(e) => setCampo("ciudad", e.target.value || null)} placeholder="Arequipa" className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" />
                </label>
                <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Distrito
                  <input value={oferta.distrito ?? ""} onChange={(e) => setCampo("distrito", e.target.value || null)} placeholder="Cayma" className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" />
                </label>
              </div>

              <p className="mt-3 mb-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">Dirigido a</p>
              <div className="flex flex-wrap gap-1.5">
                {ESTADOS_EDUCACION.map((d) => (
                  <button key={d} type="button" onClick={() => toggleDirigido(d)} className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${oferta.dirigido_a?.includes(d) ? "border-unsa-primary bg-unsa-primary text-white" : "border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"}`}>
                    {d}
                  </button>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3">
                <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Contacto
                  <input value={oferta.contacto_nombre ?? ""} onChange={(e) => setCampo("contacto_nombre", e.target.value || null)} placeholder="Nombre/área" className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" />
                </label>
                <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Correo
                  <input value={oferta.contacto_email ?? ""} onChange={(e) => setCampo("contacto_email", e.target.value || null)} placeholder="rrhh@empresa.pe" className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" />
                </label>
                <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Teléfono
                  <input value={oferta.contacto_telefono ?? ""} onChange={(e) => setCampo("contacto_telefono", e.target.value || null)} placeholder="959123456" className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" />
                </label>
              </div>
            </div>

            {/* Botones de Acción (Rechazar o Publicar) */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-auto grid grid-cols-2 gap-3">
              <button
                onClick={handleRechazar}
                disabled={publicando}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-bold text-red-700 shadow-sm transition-all hover:bg-red-100 disabled:opacity-60 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-900/50"
              >
                ❌ Rechazar
              </button>
              <button
                onClick={() => handlePublicar(false)}
                disabled={publicando}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-zinc-800 hover:shadow-lg disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                {publicando ? "..." : "✅ Publicar Oferta"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
