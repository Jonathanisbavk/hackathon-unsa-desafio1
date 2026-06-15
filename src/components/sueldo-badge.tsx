import { formatRangoSueldo } from "@/lib/format";

interface SueldoBadgeProps {
  visible?: boolean;
  min?: number | null;
  max?: number | null;
  /** "sm" para tarjetas del feed, "md" para el modal de detalle. */
  size?: "sm" | "md";
}

const TAMANOS = {
  sm: "px-2 py-1 text-xs",
  md: "gap-2 px-3 py-2 text-sm",
} as const;

/**
 * Pastilla de transparencia salarial. Única fuente de verdad para mostrar el
 * sueldo (verde con monto formateado) o el estado "no especificado" (gris).
 */
export default function SueldoBadge({ visible, min, max, size = "sm" }: SueldoBadgeProps) {
  const rango = visible ? formatRangoSueldo(min, max) : null;
  const base = `inline-flex shrink-0 items-center rounded-md font-bold ${TAMANOS[size]}`;

  if (rango) {
    return (
      <span className={`${base} bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-300`}>
        💰 {rango}
      </span>
    );
  }

  return (
    <span className={`${base} bg-zinc-100 font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10 dark:bg-zinc-800 dark:text-zinc-400`}>
      Sueldo no especificado
    </span>
  );
}
