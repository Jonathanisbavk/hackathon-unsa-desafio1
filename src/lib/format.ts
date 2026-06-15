// Helpers de presentación compartidos.

const SOLES = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 });

/** Formatea un monto en soles con separador de miles: 1200 → "S/ 1,200". */
export function formatMonto(valor: number): string {
  return `S/ ${SOLES.format(valor)}`;
}

/**
 * Texto de un rango salarial para mostrar al egresado.
 * - min y max → "S/ 1,200 - 1,800"
 * - solo min  → "S/ 1,200"
 * - sin datos → null (el llamador decide el fallback "Sueldo no especificado").
 */
export function formatRangoSueldo(
  min?: number | null,
  max?: number | null,
): string | null {
  if (min != null && max != null && max !== min) {
    return `${formatMonto(min)} - ${SOLES.format(max)}`;
  }
  const unico = min ?? max;
  return unico != null ? formatMonto(unico) : null;
}

/** Une distrito/provincia/ciudad en una sola línea legible, omitiendo vacíos. */
export function formatUbicacion(o: {
  distrito?: string | null;
  provincia?: string | null;
  ciudad?: string | null;
}): string {
  return [o.distrito, o.provincia, o.ciudad].filter(Boolean).join(", ");
}
