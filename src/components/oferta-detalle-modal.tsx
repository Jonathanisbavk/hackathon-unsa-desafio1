"use client";

import { useEffect } from "react";
import type { Oferta } from "@/lib/types";
import { formatUbicacion } from "@/lib/format";
import SueldoBadge from "@/components/sueldo-badge";

// Alias retrocompatible: el modal recibe la misma forma de oferta del dominio.
export type OfertaDetalle = Oferta;

function soloDigitos(t: string): string {
  const d = t.replace(/\D/g, "");
  // Perú: si son 9 dígitos, anteponer código país 51.
  return d.length === 9 ? `51${d}` : d;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
      {children}
    </span>
  );
}

export default function OfertaDetalleModal({
  oferta,
  onClose,
}: {
  oferta: OfertaDetalle;
  onClose: () => void;
}) {
  // Cerrar con Esc + bloquear scroll del fondo.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const ubic = formatUbicacion(oferta);
  const tel = oferta.contacto_telefono ?? "";
  const asunto = encodeURIComponent(`Postulación: ${oferta.titulo}`);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detalle-titulo"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl dark:bg-zinc-900"
      >
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 p-6 dark:border-zinc-800">
          <div>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {oferta.tipo_empleo && <Badge>{oferta.tipo_empleo}</Badge>}
              {oferta.modalidad && <Badge>{oferta.modalidad}</Badge>}
              {oferta.nivel_jerarquia && <Badge>{oferta.nivel_jerarquia}</Badge>}
            </div>
            <h2 id="detalle-titulo" className="text-2xl font-bold leading-tight text-zinc-900 dark:text-white">
              {oferta.titulo}
            </h2>
            <p className="mt-1 text-zinc-600 dark:text-zinc-300">
              {oferta.empresa}
              {ubic && <span className="text-zinc-400"> · {ubic}</span>}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cuerpo */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Sueldo */}
          <div className="mb-6">
            <SueldoBadge
              visible={oferta.sueldo_visible}
              min={oferta.sueldo_min}
              max={oferta.sueldo_max}
              size="md"
            />
          </div>

          {oferta.descripcion && (
            <section className="mb-6">
              <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Descripción</h3>
              <p className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">{oferta.descripcion}</p>
            </section>
          )}

          {oferta.requisitos && oferta.requisitos.length > 0 && (
            <section className="mb-6">
              <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Requisitos</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
                {oferta.requisitos.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </section>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {oferta.escuela_objetivo && oferta.escuela_objetivo.length > 0 && (
              <section>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">Carreras</h3>
                <div className="flex flex-wrap gap-1.5">
                  {oferta.escuela_objetivo.map((e) => (
                    <span key={e} className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {e}
                    </span>
                  ))}
                </div>
              </section>
            )}
            {oferta.dirigido_a && oferta.dirigido_a.length > 0 && (
              <section>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">Dirigido a</h3>
                <div className="flex flex-wrap gap-1.5">
                  {oferta.dirigido_a.map((d) => (
                    <span key={d} className="rounded bg-unsa-primary/10 px-2 py-0.5 text-xs font-medium text-unsa-primary">
                      {d}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {oferta.fecha_cierre && (
            <p className="mt-6 text-sm text-zinc-500">
              📅 Postula antes del <strong>{oferta.fecha_cierre}</strong>
            </p>
          )}

          {/* Contacto */}
          <section className="mt-6 rounded-xl border border-unsa-primary/20 bg-unsa-primary/5 p-5 dark:border-unsa-primary/30 dark:bg-unsa-primary/10">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
              <span>📇</span> Contacto para postular
            </h3>
            {oferta.contacto_nombre && (
              <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">{oferta.contacto_nombre}</p>
            )}
            {!oferta.contacto_email && !tel && (
              <p className="text-sm text-zinc-500">No se especificó un contacto directo en esta oferta.</p>
            )}
            <div className="flex flex-wrap gap-2">
              {oferta.contacto_email && (
                <a
                  href={`mailto:${oferta.contacto_email}?subject=${asunto}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-unsa-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-unsa-primary-dark"
                >
                  ✉️ {oferta.contacto_email}
                </a>
              )}
              {tel && (
                <>
                  <a
                    href={`tel:${tel.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    📞 {tel}
                  </a>
                  <a
                    href={`https://wa.me/${soloDigitos(tel)}?text=${asunto}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    WhatsApp
                  </a>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
