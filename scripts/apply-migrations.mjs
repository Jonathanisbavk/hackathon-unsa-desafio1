// Script para aplicar las migraciones a Supabase via Management API
// Ejecutar: node scripts/apply-migrations.mjs

const PROJECT_REF = "uotggkwplqwffibfvlki";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error("❌ Falta SUPABASE_SERVICE_ROLE_KEY en el entorno.");
  process.exit(1);
}

const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;

// SQL de todas las migraciones combinadas
const SQL = `
-- ════════════════════════════════════════════════════════════════
-- CONECTA UNSA — Esquema inicial
-- ════════════════════════════════════════════════════════════════
create extension if not exists vector;

create table if not exists egresados (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  escuela_profesional text not null,
  especialidad text,
  skills text[] default '{}',
  anio_egreso int,
  experiencia text,
  perfil_embedding vector(768),
  created_at timestamptz default now()
);

create table if not exists preferencias (
  egresado_id uuid primary key references egresados(id) on delete cascade,
  escuelas_interes text[] default '{}',
  tipos_oferta text[] default '{}',
  modalidades text[] default '{}',
  solo_con_sueldo boolean default false,
  updated_at timestamptz default now()
);

create table if not exists ofertas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  empresa text,
  escuela_objetivo text[] default '{}',
  tipo text,
  descripcion text,
  requisitos text[] default '{}',
  modalidad text,
  sueldo_min numeric,
  sueldo_max numeric,
  sueldo_visible boolean default false,
  fecha_cierre date,
  texto_original text,
  estado text default 'borrador',
  es_ruido boolean default false,
  embedding vector(768),
  created_at timestamptz default now(),
  publicada_at timestamptz
);

create table if not exists alertas (
  id uuid primary key default gen_random_uuid(),
  egresado_id uuid references egresados(id) on delete cascade,
  palabra_clave text not null,
  escuela text,
  activa boolean default true,
  created_at timestamptz default now()
);

create table if not exists notificaciones (
  id uuid primary key default gen_random_uuid(),
  egresado_id uuid references egresados(id) on delete cascade,
  oferta_id uuid references ofertas(id) on delete cascade,
  motivo text,
  leida boolean default false,
  created_at timestamptz default now()
);

create index if not exists ofertas_embedding_idx
  on ofertas using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index if not exists ofertas_estado_idx on ofertas (estado);
create index if not exists ofertas_escuela_objetivo_idx
  on ofertas using gin (escuela_objetivo);
create index if not exists alertas_egresado_activa_idx
  on alertas (egresado_id) where activa = true;

-- ════════════════════════════════════════════════════════════════
-- RLS
-- ════════════════════════════════════════════════════════════════
alter table egresados      enable row level security;
alter table preferencias   enable row level security;
alter table alertas        enable row level security;
alter table notificaciones enable row level security;
alter table ofertas        enable row level security;

drop policy if exists "egresado_self" on egresados;
create policy "egresado_self" on egresados
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "pref_self" on preferencias;
create policy "pref_self" on preferencias
  for all using (auth.uid() = egresado_id) with check (auth.uid() = egresado_id);

drop policy if exists "alertas_self" on alertas;
create policy "alertas_self" on alertas
  for all using (auth.uid() = egresado_id) with check (auth.uid() = egresado_id);

drop policy if exists "notif_self" on notificaciones;
create policy "notif_self" on notificaciones
  for all using (auth.uid() = egresado_id);

drop policy if exists "ofertas_publicas_lectura" on ofertas;
create policy "ofertas_publicas_lectura" on ofertas
  for select using (estado = 'publicada');

drop policy if exists "ofertas_admin_escritura" on ofertas;
create policy "ofertas_admin_escritura" on ofertas
  for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ════════════════════════════════════════════════════════════════
-- Funciones RPC
-- ════════════════════════════════════════════════════════════════
create or replace function match_ofertas(
  query_embedding vector(768),
  match_threshold float default 0.5,
  match_count int default 20
)
returns table (id uuid, titulo text, empresa text, score float)
language sql stable
as $$
  select o.id, o.titulo, o.empresa,
         1 - (o.embedding <=> query_embedding) as score
  from ofertas o
  where o.estado = 'publicada'
    and o.embedding is not null
    and 1 - (o.embedding <=> query_embedding) >= match_threshold
  order by o.embedding <=> query_embedding
  limit match_count;
$$;

create or replace function disparar_alertas(p_oferta_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_oferta ofertas%rowtype;
  v_insertadas int := 0;
begin
  select * into v_oferta from ofertas where id = p_oferta_id;
  if not found or v_oferta.estado <> 'publicada' then return 0; end if;

  with candidatos as (
    insert into notificaciones (egresado_id, oferta_id, motivo)
    select distinct a.egresado_id, v_oferta.id, 'alerta'
    from alertas a
    where a.activa
      and (
        lower(coalesce(v_oferta.titulo, '')) like '%' || lower(a.palabra_clave) || '%'
        or lower(coalesce(v_oferta.descripcion, '')) like '%' || lower(a.palabra_clave) || '%'
      )
      and (a.escuela is null or a.escuela = any(v_oferta.escuela_objetivo))
      and not exists (
        select 1 from notificaciones n
        where n.egresado_id = a.egresado_id
          and n.oferta_id = v_oferta.id
          and n.motivo = 'alerta'
      )
    returning 1
  )
  select count(*) into v_insertadas from candidatos;
  return v_insertadas;
end;
$$;

create or replace function es_admin()
returns boolean
language sql stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;
`;

async function runSQL(sql) {
  // Usamos la API de Supabase para ejecutar SQL via un helper
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql_admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

// Intentar via el endpoint de Management API (query directo)
async function applyViaMgmtAPI() {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: SQL }),
    }
  );

  const text = await res.text();
  console.log(`Respuesta (${res.status}):`, text);
  return res.ok;
}

console.log("🚀 Aplicando migraciones a Supabase...");
applyViaMgmtAPI().then((ok) => {
  if (ok) {
    console.log("✅ Migraciones aplicadas correctamente.");
  } else {
    console.log("❌ No se pudo aplicar via Management API.");
    console.log("👉 Aplica el SQL manualmente en el Editor de Supabase (ver instrucciones).");
  }
}).catch(console.error);
