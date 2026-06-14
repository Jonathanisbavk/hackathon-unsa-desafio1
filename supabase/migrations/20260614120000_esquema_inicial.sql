-- ════════════════════════════════════════════════════════════════
-- CONECTA UNSA — Esquema inicial
-- Tablas, extensiones e índices. RLS se activa en la migración 0002.
-- Convenciones: español snake_case, UUID gen_random_uuid(), embeddings vector(768).
-- ════════════════════════════════════════════════════════════════

-- ── Extensiones ──
create extension if not exists vector;

-- ── Perfil del egresado (1:1 con auth.users) ──
create table if not exists egresados (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  escuela_profesional text not null,        -- p.ej. 'Ingeniería de Sistemas'
  especialidad text,
  skills text[] default '{}',
  anio_egreso int,
  experiencia text,
  perfil_embedding vector(768),             -- para recomendación
  created_at timestamptz default now()
);

-- ── Preferencias del onboarding ──
create table if not exists preferencias (
  egresado_id uuid primary key references egresados(id) on delete cascade,
  escuelas_interes text[] default '{}',     -- escuelas que quiere recibir
  tipos_oferta text[] default '{}',         -- 'practica_pre','practica_pro','empleo'
  modalidades text[] default '{}',          -- 'presencial','remoto','hibrido'
  solo_con_sueldo boolean default false,    -- filtro de transparencia salarial
  updated_at timestamptz default now()
);

-- ── Ofertas laborales ──
create table if not exists ofertas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  empresa text,
  escuela_objetivo text[] default '{}',     -- carreras a las que aplica
  tipo text,                                -- 'practica_pre','practica_pro','empleo','ruido'
  descripcion text,
  requisitos text[] default '{}',
  modalidad text,
  sueldo_min numeric,
  sueldo_max numeric,
  sueldo_visible boolean default false,     -- false = no especificado (pierde visibilidad)
  fecha_cierre date,
  texto_original text,                      -- el correo crudo que pegó el admin
  estado text default 'borrador',           -- 'borrador' | 'publicada' | 'descartada'
  es_ruido boolean default false,           -- detectado por el pipeline
  embedding vector(768),
  created_at timestamptz default now(),
  publicada_at timestamptz
);

-- ── Alertas por palabra clave (creadas desde la búsqueda) ──
create table if not exists alertas (
  id uuid primary key default gen_random_uuid(),
  egresado_id uuid references egresados(id) on delete cascade,
  palabra_clave text not null,
  escuela text,                             -- opcional, acota la alerta
  activa boolean default true,
  created_at timestamptz default now()
);

-- ── Notificaciones (in-app) ──
create table if not exists notificaciones (
  id uuid primary key default gen_random_uuid(),
  egresado_id uuid references egresados(id) on delete cascade,
  oferta_id uuid references ofertas(id) on delete cascade,
  motivo text,                              -- 'alerta' | 'match_carrera' | 'recomendacion'
  leida boolean default false,
  created_at timestamptz default now()
);

-- ── Índices ──
create index if not exists ofertas_embedding_idx
  on ofertas using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index if not exists ofertas_estado_idx on ofertas (estado);
create index if not exists ofertas_escuela_objetivo_idx
  on ofertas using gin (escuela_objetivo);
create index if not exists alertas_egresado_activa_idx
  on alertas (egresado_id) where activa = true;
