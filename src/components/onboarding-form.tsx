"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  ESCUELAS,
  TIPOS_OFERTA,
  MODALIDADES,
  ANIOS_EGRESO,
  type TipoOferta,
  type Modalidad,
} from "@/lib/constants";
import { guardarPerfilDemo } from "@/lib/demo";

// ── Chip genérico reutilizable ────────────────────────────────────────────────
function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-unsa-primary/30 ${
        selected
          ? "border-unsa-primary bg-unsa-primary text-white shadow-sm"
          : "border-zinc-300 bg-white text-zinc-700 hover:border-unsa-primary/60 hover:text-unsa-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
      }`}
    >
      {label}
    </button>
  );
}

// ── Indicador de pasos ────────────────────────────────────────────────────────
function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all ${
            i < step
              ? "bg-unsa-primary w-6"
              : i === step
                ? "bg-unsa-primary w-8"
                : "bg-zinc-200 dark:bg-zinc-700 w-2"
          }`}
        />
      ))}
    </div>
  );
}

// Campo: selector de año de egreso (reutilizado en demo y auth).
function CampoAnioEgreso({
  value,
  onChange,
}: {
  value: number | "";
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="anio" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Año de egreso
      </label>
      <select
        id="anio"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 dark:text-white outline-none transition focus:border-unsa-primary focus:bg-white focus:ring-4 focus:ring-unsa-primary/10 dark:border-zinc-700 dark:bg-zinc-900"
      >
        <option value="">Selecciona el año…</option>
        {ANIOS_EGRESO.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Onboarding ────────────────────────────────────────────────────────────────
export default function OnboardingForm({
  userId,
  modo = "auth",
}: {
  userId?: string;
  modo?: "auth" | "demo";
}) {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario
  const [nombre, setNombre] = useState("");
  const [escuela, setEscuela] = useState("");
  const [anioEgreso, setAnioEgreso] = useState<number | "">("");
  const [escuelasInteres, setEscuelasInteres] = useState<string[]>([]);
  const [tiposOferta, setTiposOferta] = useState<TipoOferta[]>([]);
  const [modalidades, setModalidades] = useState<Modalidad[]>([]);
  const [soloConSueldo, setSoloConSueldo] = useState(false);
  const [areasAbiertas, setAreasAbiertas] = useState(false);
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);

  function toggleItem<T extends string>(list: T[], item: T): T[] {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  }

  async function guardar() {
    setGuardando(true);
    setError(null);
    try {
      if (modo === "demo" || !userId) {
        // Demo: el perfil vive en el navegador.
        guardarPerfilDemo({
          nombre: nombre.trim() || undefined,
          carrera: escuela,
          anioEgreso: anioEgreso === "" ? undefined : anioEgreso,
          escuelasInteres,
        });
        router.push("/");
        router.refresh();
        return;
      }

      // 1) Crear perfil del egresado
      const { error: eErr } = await supabase.from("egresados").upsert({
        id: userId,
        nombre: nombre.trim(),
        escuela_profesional: escuela,
        anio_egreso: anioEgreso === "" ? null : anioEgreso,
      });
      if (eErr) throw eErr;

      // 2) Guardar preferencias
      const { error: pErr } = await supabase.from("preferencias").upsert({
        egresado_id: userId,
        escuelas_interes: escuelasInteres,
        tipos_oferta: tiposOferta,
        modalidades,
        solo_con_sueldo: soloConSueldo,
        updated_at: new Date().toISOString(),
      });
      if (pErr) throw pErr;

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  // ── Modo DEMO: un solo paso (carrera + año + intereses) ───────────────────
  if (modo === "demo") {
    const puedeComenzar = escuela.length > 0 && anioEgreso !== "";
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Cuéntanos de ti
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Con tu carrera y año de egreso te mostramos ofertas relevantes al instante. Sin cuenta.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="escuela" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Tu Escuela Profesional
          </label>
          <select
            id="escuela"
            value={escuela}
            onChange={(e) => setEscuela(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 dark:text-white outline-none transition focus:border-unsa-primary focus:bg-white focus:ring-4 focus:ring-unsa-primary/10 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">Selecciona tu escuela…</option>
            {ESCUELAS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>

        <CampoAnioEgreso value={anioEgreso} onChange={setAnioEgreso} />

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setAreasAbiertas((v) => !v)}
            className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            <span className="flex items-center gap-2">
              ¿Otras áreas que te interesan? <span className="font-normal text-zinc-400">(opcional)</span>
              {escuelasInteres.length > 0 && (
                <span className="rounded-full bg-unsa-primary px-2 py-0.5 text-[11px] font-bold text-white">{escuelasInteres.length}</span>
              )}
            </span>
            <svg className={`h-4 w-4 text-zinc-400 transition-transform ${areasAbiertas ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {areasAbiertas && (
            <div className="max-h-56 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
              <div className="flex flex-wrap gap-1.5">
                {ESCUELAS.map((e) => (
                  <Chip
                    key={e}
                    label={e}
                    selected={escuelasInteres.includes(e)}
                    onClick={() => setEscuelasInteres(toggleItem(escuelasInteres, e))}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        <div className="mt-4 flex items-start gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
          <input
            id="politicas-onboarding"
            type="checkbox"
            checked={aceptaPoliticas}
            onChange={(e) => setAceptaPoliticas(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-unsa-primary focus:ring-unsa-primary dark:border-zinc-600 dark:bg-zinc-700"
          />
          <label htmlFor="politicas-onboarding" className="text-xs text-zinc-600 dark:text-zinc-400">
            He leído y acepto la{" "}
            <Link href="/politicas-de-privacidad" target="_blank" className="font-semibold text-unsa-primary hover:underline">
              Política de Privacidad
            </Link>
            , otorgando mi consentimiento para el tratamiento de mis datos personales en el marco de la <strong className="font-semibold text-zinc-900 dark:text-zinc-200">Ley N° 29733 (Ley de Protección de Datos Personales del Perú)</strong> y su reglamento.
          </label>
        </div>

        <button
          type="button"
          disabled={!puedeComenzar || guardando || !aceptaPoliticas}
          onClick={guardar}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-unsa-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-unsa-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {guardando && (
            <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          Ver ofertas para mí
        </button>
      </div>
    );
  }

  // ── Modo AUTH: 3 pasos ────────────────────────────────────────────────────
  const Step0 = (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">¿Cómo te llamas?</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Cuéntanos un poco sobre ti para personalizar tu experiencia.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="nombre" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Nombre completo
        </label>
        <input
          id="nombre"
          type="text"
          autoComplete="name"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ana Quispe Mamani"
          className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-sm outline-none transition focus:border-unsa-primary focus:bg-white focus:ring-4 focus:ring-unsa-primary/10 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="escuela" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Tu Escuela Profesional
        </label>
        <select
          id="escuela"
          value={escuela}
          onChange={(e) => setEscuela(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 dark:text-white outline-none transition focus:border-unsa-primary focus:bg-white focus:ring-4 focus:ring-unsa-primary/10 dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">Selecciona tu escuela…</option>
          {ESCUELAS.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      <CampoAnioEgreso value={anioEgreso} onChange={setAnioEgreso} />

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setAreasAbiertas((v) => !v)}
          className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          <span className="flex items-center gap-2">
            ¿Qué otras escuelas te interesan? <span className="font-normal text-zinc-400">(opcional)</span>
            {escuelasInteres.length > 0 && (
              <span className="rounded-full bg-unsa-primary px-2 py-0.5 text-[11px] font-bold text-white">{escuelasInteres.length}</span>
            )}
          </span>
          <svg className={`h-4 w-4 text-zinc-400 transition-transform ${areasAbiertas ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {areasAbiertas && (
          <div className="max-h-56 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex flex-wrap gap-1.5">
              {ESCUELAS.map((e) => (
                <Chip
                  key={e}
                  label={e}
                  selected={escuelasInteres.includes(e)}
                  onClick={() => setEscuelasInteres(toggleItem(escuelasInteres, e))}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const Step1 = (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">¿Qué tipo de oportunidad buscas?</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Selecciona todo lo que aplique.</p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tipo de oferta</p>
        <div className="flex flex-wrap gap-3">
          {TIPOS_OFERTA.map(({ value, label }) => (
            <Chip
              key={value}
              label={label}
              selected={tiposOferta.includes(value)}
              onClick={() => setTiposOferta(toggleItem(tiposOferta, value) as TipoOferta[])}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Modalidad preferida</p>
        <div className="flex flex-wrap gap-3">
          {MODALIDADES.map(({ value, label }) => (
            <Chip
              key={value}
              label={label}
              selected={modalidades.includes(value)}
              onClick={() => setModalidades(toggleItem(modalidades, value) as Modalidad[])}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const Step2 = (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Transparencia salarial</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Esta es una de las funciones clave de CONECTA UNSA. Tú decides.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setSoloConSueldo((v) => !v)}
        className={`flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
          soloConSueldo
            ? "border-unsa-primary bg-unsa-primary/5 dark:bg-unsa-primary/10"
            : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
        }`}
      >
        <div className={`mt-0.5 h-6 w-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
          soloConSueldo ? "border-unsa-primary bg-unsa-primary" : "border-zinc-300 dark:border-zinc-600"
        }`}>
          {soloConSueldo && (
            <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div>
          <p className={`font-semibold ${soloConSueldo ? "text-unsa-primary" : "text-zinc-800 dark:text-zinc-100"}`}>
            Mostrar solo ofertas con sueldo especificado
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Las ofertas que no muestran el sueldo quedarán ocultas en tu feed. Puedes cambiar esto en cualquier momento.
          </p>
        </div>
      </button>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 dark:bg-amber-950/30 dark:border-amber-800/50">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          💡 <strong>¿Por qué importa?</strong> Las ofertas sin sueldo pierden visibilidad en la plataforma,
          lo que incentiva a los empleadores a ser transparentes. Puedes dejar esta opción desactivada para ver todas las ofertas.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  );

  const steps = [Step0, Step1, Step2];
  const stepLabels = ["Tu perfil", "Preferencias", "Filtros"];

  const canContinue = [
    nombre.trim().length > 0 && escuela.length > 0 && anioEgreso !== "",
    tiposOferta.length > 0,
    true,
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <StepIndicator step={step} total={3} />
        <span className="text-xs font-medium text-zinc-400">
          Paso {step + 1} de 3 — {stepLabels[step]}
        </span>
      </div>

      <div className="min-h-[340px]">{steps[step]}</div>

      <div className="flex items-center gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          >
            Atrás
          </button>
        )}

        {step < 2 ? (
          <button
            type="button"
            disabled={!canContinue[step]}
            onClick={() => setStep((s) => s + 1)}
            className="flex-1 rounded-lg bg-unsa-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-unsa-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continuar
          </button>
        ) : (
          <button
            type="button"
            disabled={guardando}
            onClick={guardar}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-unsa-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-unsa-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guardando && (
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            Listo, comenzar
          </button>
        )}
      </div>
    </div>
  );
}
