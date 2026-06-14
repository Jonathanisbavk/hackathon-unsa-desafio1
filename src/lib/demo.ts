// Estado del perfil DEMO (sin cuenta). Vive en el navegador: cookie marca el modo
// demo y localStorage guarda el perfil. Pensado para el flujo de hackatón sin login.

export interface CVProcesado {
  nombre?: string;
  carrera?: string;
  anios_experiencia?: number;
  skills?: string[];
  resumen?: string;
  palabras_clave?: string[];
}

export interface PerfilDemo {
  nombre?: string;
  carrera?: string;
  anioEgreso?: number;
  escuelasInteres?: string[];
  palabrasClave?: string[];
  email?: string;
  cv?: CVProcesado;
}

const CLAVE = "conecta_demo_perfil";

/** ¿El usuario está en modo demo? (cookie demo=true). Solo en el cliente. */
export function esDemo(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split("; ")
    .some((c) => c.trim() === "demo=true");
}

export function activarDemo() {
  if (typeof document === "undefined") return;
  document.cookie = "demo=true; path=/; max-age=86400";
}

export function leerPerfilDemo(): PerfilDemo {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CLAVE);
    return raw ? (JSON.parse(raw) as PerfilDemo) : {};
  } catch {
    return {};
  }
}

export function guardarPerfilDemo(parcial: Partial<PerfilDemo>): PerfilDemo {
  if (typeof window === "undefined") return parcial;
  const actual = leerPerfilDemo();
  const nuevo = { ...actual, ...parcial };
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(nuevo));
  } catch {
    // localStorage lleno o no disponible: el demo sigue funcionando en memoria.
  }
  return nuevo;
}

export function limpiarPerfilDemo() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CLAVE);
  } catch {
    /* noop */
  }
}

/** Texto base para el matching del demo a partir de su perfil. */
export function textoPerfilDemo(p: PerfilDemo): string {
  return [
    p.carrera ? `Egresado de ${p.carrera}` : "",
    p.escuelasInteres?.length ? `Áreas de interés: ${p.escuelasInteres.join(", ")}` : "",
    p.palabrasClave?.length ? `Palabras clave: ${p.palabrasClave.join(", ")}` : "",
    p.cv?.resumen ?? "",
    p.cv?.skills?.length ? `Habilidades: ${p.cv.skills.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join(". ");
}
