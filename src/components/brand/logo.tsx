// Emblema de CONECTA UNSA. Construido con la paleta oficial del Manual de Marca
// (granate #5e151d, azul #141e42). Birrete de egresado + nodo de conexión + Misti.

export function ConectaLogo({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="CONECTA UNSA"
      className={className}
    >
      {/* Base granate */}
      <rect width="64" height="64" rx="16" fill="#5e151d" />
      {/* Silueta del Misti (Arequipa) al pie */}
      <path d="M8 56 L24 36 L31 44 L40 30 L56 56 Z" fill="#470f16" />
      <path d="M36 35 L40 30 L44 35 L40 38 Z" fill="#f4f4f5" opacity="0.9" />
      {/* Birrete (mortarboard) */}
      <path d="M32 16 L50 24 L32 32 L14 24 Z" fill="#f4f4f5" />
      <path d="M22 27 L22 36 C22 39 42 39 42 36 L42 27 L32 31 Z" fill="#e7d2d5" />
      {/* Borla */}
      <path d="M50 24 L50 33" stroke="#141e42" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="50" cy="35" r="2.6" fill="#141e42" />
      {/* Nodo de conexión (azul) */}
      <circle cx="32" cy="24" r="2.4" fill="#141e42" />
    </svg>
  );
}

// Logotipo horizontal: emblema + texto.
export function ConectaWordmark({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <ConectaLogo size={compact ? 32 : 40} />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
            CONECTA <span className="text-unsa-primary dark:text-unsa-primary-light">UNSA</span>
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400">
            Bolsa de trabajo
          </span>
        </span>
      )}
    </span>
  );
}
