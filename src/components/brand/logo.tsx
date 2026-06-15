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
      <Image
        src="/logo_unsa.jpg"
        alt="Logo UNSA"
        width={size}
        height={size}
        className="object-contain drop-shadow-md rounded-full mix-blend-multiply dark:mix-blend-normal bg-white"
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
      {/* Usamos el logo del proyecto CONECTA */}
      <Image
        src="/logo-unsa-conecta.jpeg"
        alt="Logo Proyecto CONECTA UNSA"
        width={compact ? 120 : 180}
        height={compact ? 40 : 60}
        className="object-contain drop-shadow-sm mix-blend-multiply dark:mix-blend-normal rounded-xl"
        unoptimized
      />
    </span>
  );
}
