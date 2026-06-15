import Link from "next/link";
import { ConectaLogo } from "@/components/brand/logo";

interface AppHeaderProps {
  /** Ancho del contenedor; debe coincidir con el <main> de la página. */
  maxWidth?: "3xl" | "5xl" | "7xl";
  /** Acciones del lado derecho (campana, email, botones…). */
  right?: React.ReactNode;
  /** Reemplaza el branding por defecto del lado izquierdo (ej: identidad del admin). */
  left?: React.ReactNode;
}

const MAX_WIDTH = {
  "3xl": "max-w-3xl",
  "5xl": "max-w-5xl",
  "7xl": "max-w-7xl",
} as const;

/**
 * Cascarón de cabecera institucional: barra fija, contenedor centrado y la franja
 * degradada granate→dorado. Única fuente de verdad del header en todas las páginas.
 */
export default function AppHeader({ maxWidth = "5xl", right, left }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className={`mx-auto flex h-16 items-center justify-between px-4 sm:px-6 ${MAX_WIDTH[maxWidth]}`}>
        {left ?? (
          <Link href="/" className="flex items-center gap-2.5">
            <ConectaLogo size={36} />
            <span className="hidden font-semibold tracking-tight text-zinc-900 sm:block dark:text-white">
              CONECTA <span className="text-unsa-primary">UNSA</span>
            </span>
          </Link>
        )}
        {right && <div className="flex items-center gap-4">{right}</div>}
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-unsa-primary to-unsa-secondary" />
    </header>
  );
}
