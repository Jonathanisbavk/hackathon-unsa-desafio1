import Image from "next/image";

export function ConectaLogo({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div className={`relative shrink-0 flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Usamos el logo proporcionado. Asegúrate de guardar la imagen en public/unsa-logo.png */}
      <Image
        src="/unsa-logo.png"
        alt="Logo UNSA"
        width={size}
        height={size}
        className="object-contain drop-shadow-md"
        unoptimized
      />
    </div>
  );
}

// Logotipo horizontal: emblema + texto complementario con slogan.
export function ConectaWordmark({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <ConectaLogo size={compact ? 40 : 54} />
      {!compact && (
        <span className="flex flex-col justify-center leading-none">
          {/* Tipografía única y distintiva para "CONECTA" */}
          <span 
            className="text-2xl sm:text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-unsa-primary to-unsa-secondary-light drop-shadow-sm"
            style={{ fontFamily: "Georgia, serif" }}
          >
            CONECTA
          </span>
          {/* Slogan de la propuesta */}
          <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400 mt-1">
            Te ayudamos a lograrlo
          </span>
        </span>
      )}
    </span>
  );
}
