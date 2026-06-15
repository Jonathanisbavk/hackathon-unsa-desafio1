// Ilustración de marca para el login: el Misti (Arequipa), arcos de sillar,
// un egresado y tarjetas de empleo conectadas. Paleta oficial UNSA.

export function HeroArequipa({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Egresados de la UNSA conectando con oportunidades laborales en Arequipa"
    >
      <defs>
        <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5e151d" />
          <stop offset="1" stopColor="#7a2530" />
        </linearGradient>
        <linearGradient id="misti" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4ece9" />
          <stop offset="1" stopColor="#c9a7ac" />
        </linearGradient>
      </defs>

      {/* Panel de fondo */}
      <rect x="0" y="0" width="480" height="440" rx="28" fill="url(#cielo)" />
      <circle cx="380" cy="80" r="34" fill="#f4f4f5" opacity="0.85" />

      {/* Volcán Misti con nieve */}
      <path d="M40 300 L150 150 L200 215 L250 130 L420 300 Z" fill="url(#misti)" />
      <path d="M232 152 L250 130 L270 158 L250 168 Z" fill="#ffffff" />
      <path d="M138 168 L150 150 L165 172 L150 180 Z" fill="#ffffff" />

      {/* Arcos de sillar (Ciudad Blanca) */}
      <g fill="#f4f4f5" opacity="0.96">
        <path d="M60 300 h70 v60 h-18 v-30 a17 17 0 0 0 -34 0 v30 H60 Z" />
        <path d="M150 300 h70 v60 h-18 v-30 a17 17 0 0 0 -34 0 v30 H150 Z" />
        <path d="M240 300 h70 v60 h-18 v-30 a17 17 0 0 0 -34 0 v30 H240 Z" />
      </g>
      <rect x="50" y="294" width="280" height="10" rx="3" fill="#e7d2d5" />

      {/* Egresado (silueta con birrete) */}
      <g>
        <circle cx="360" cy="270" r="26" fill="#141e42" />
        <path d="M334 360 a26 30 0 0 1 52 0 Z" fill="#141e42" />
        <path d="M360 236 l26 11 -26 11 -26 -11 Z" fill="#f4f4f5" />
        <path d="M386 247 l0 12" stroke="#f4f4f5" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="386" cy="261" r="3" fill="#f4f4f5" />
      </g>

      {/* Tarjetas de empleo conectadas */}
      <g>
        <path d="M360 250 C 300 200, 230 180, 150 120" stroke="#f4f4f5" strokeWidth="2" strokeDasharray="3 6" opacity="0.7" />
        <path d="M360 250 C 320 150, 250 120, 110 70" stroke="#f4f4f5" strokeWidth="2" strokeDasharray="3 6" opacity="0.5" />

        {/* Card match % */}
        <g transform="translate(86 92)">
          <rect width="120" height="56" rx="12" fill="#ffffff" />
          <rect x="14" y="14" width="58" height="9" rx="4" fill="#5e151d" />
          <rect x="14" y="32" width="40" height="7" rx="3" fill="#cbb4b7" />
          <rect x="82" y="16" width="26" height="26" rx="8" fill="#141e42" />
          <path d="M88 29 l4 4 8 -9" stroke="#ffffff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Card empleo (maletín) */}
        <g transform="translate(54 40)">
          <rect width="108" height="48" rx="12" fill="#ffffff" />
          <rect x="14" y="16" width="22" height="18" rx="4" fill="#5e151d" />
          <rect x="20" y="12" width="10" height="6" rx="2" fill="#5e151d" />
          <rect x="46" y="16" width="48" height="8" rx="4" fill="#141e42" />
          <rect x="46" y="29" width="32" height="6" rx="3" fill="#cbb4b7" />
        </g>
      </g>
    </svg>
  );
}
