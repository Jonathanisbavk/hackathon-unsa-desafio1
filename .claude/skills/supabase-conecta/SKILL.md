---
name: supabase-conecta
description: >
  Esquema de base de datos, políticas RLS, índices, pgvector y patrones de consulta para CONECTA
  UNSA en Supabase. Úsala SIEMPRE que la tarea toque la base de datos: crear/alterar tablas,
  migraciones, políticas de seguridad, guardar ofertas o perfiles, alertas, matching por embeddings,
  o cualquier query. Úsala antes de escribir SQL o de usar el MCP de Supabase, para mantener el
  esquema consistente.
---

# Supabase — CONECTA UNSA

Proyecto Supabase free: Postgres + Auth + pgvector + Edge Functions. Usa el **MCP de Supabase**
para aplicar migraciones y correr queries. Habilita la extensión `vector` antes de usar embeddings.

## Convenciones

- Nombres de tablas y columnas en **español, snake_case** (reflejan el dominio del Lab UNSA).
- Toda tabla con datos de usuario lleva **RLS activado**.
- `id` UUID por defecto `gen_random_uuid()`. Timestamps `created_at timestamptz default now()`.
- Embeddings con `vector(768)` (tamaño de `text-embedding-004` de Gemini).

## Esquema

```sql
-- Extensiones
create extension if not exists vector;

-- Perfil del egresado (1:1 con auth.users)
create table egresados (
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

-- Preferencias del onboarding
create table preferencias (
  egresado_id uuid primary key references egresados(id) on delete cascade,
  escuelas_interes text[] default '{}',     -- escuelas que quiere recibir
  tipos_oferta text[] default '{}',         -- 'practica_pre','practica_pro','empleo'
  modalidades text[] default '{}',          -- 'presencial','remoto','hibrido'
  solo_con_sueldo boolean default false,    -- filtro de transparencia salarial
  updated_at timestamptz default now()
);

-- Ofertas laborales
create table ofertas (
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

-- Alertas por palabra clave (creadas desde la búsqueda)
create table alertas (
  id uuid primary key default gen_random_uuid(),
  egresado_id uuid references egresados(id) on delete cascade,
  palabra_clave text not null,
  escuela text,                             -- opcional, acota la alerta
  activa boolean default true,
  created_at timestamptz default now()
);

-- Notificaciones (in-app)
create table notificaciones (
  id uuid primary key default gen_random_uuid(),
  egresado_id uuid references egresados(id) on delete cascade,
  oferta_id uuid references ofertas(id) on delete cascade,
  motivo text,                              -- 'alerta' | 'match_carrera' | 'recomendacion'
  leida boolean default false,
  created_at timestamptz default now()
);

-- Índices
create index on ofertas using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index on ofertas (estado);
create index on ofertas using gin (escuela_objetivo);
create index on alertas (egresado_id) where activa = true;
```

## RLS (políticas)

```sql
alter table egresados enable row level security;
alter table preferencias enable row level security;
alter table alertas enable row level security;
alter table notificaciones enable row level security;
alter table ofertas enable row level security;

-- El egresado solo ve/edita su propio perfil, preferencias, alertas y notificaciones
create policy "egresado_self" on egresados
  for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "pref_self" on preferencias
  for all using (auth.uid() = egresado_id) with check (auth.uid() = egresado_id);
create policy "alertas_self" on alertas
  for all using (auth.uid() = egresado_id) with check (auth.uid() = egresado_id);
create policy "notif_self" on notificaciones
  for all using (auth.uid() = egresado_id);

-- Ofertas publicadas: lectura para cualquier usuario autenticado
create policy "ofertas_publicas_lectura" on ofertas
  for select using (estado = 'publicada');

-- Escritura de ofertas: solo rol admin (usa un claim/role 'admin' en Supabase Auth o tabla aparte)
create policy "ofertas_admin_escritura" on ofertas
  for all using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');
```

## Patrones de consulta

**Feed del egresado respetando preferencias y filtro de sueldo:**
```sql
select * from ofertas o
where o.estado = 'publicada'
  and (cardinality($1::text[]) = 0 or o.escuela_objetivo && $1)   -- escuelas_interes
  and (cardinality($2::text[]) = 0 or o.tipo = any($2))            -- tipos_oferta
  and ($3 = false or o.sueldo_visible = true)                     -- solo_con_sueldo
order by o.publicada_at desc;
```

**Matching por embeddings (recomendación):**
```sql
select id, titulo, empresa, 1 - (embedding <=> $1) as score
from ofertas
where estado = 'publicada' and embedding is not null
order by embedding <=> $1
limit 20;
```

**Disparar alertas al publicar una oferta** (en Edge Function tras `publicar`):
```sql
insert into notificaciones (egresado_id, oferta_id, motivo)
select a.egresado_id, $1, 'alerta'
from alertas a
where a.activa
  and lower($2) like '%' || lower(a.palabra_clave) || '%'        -- título/desc contiene la palabra
  and (a.escuela is null or a.escuela = any($3::text[]));        -- escuela_objetivo de la oferta
```

## Notas

- Genera el embedding de la oferta **al publicar**, no al guardar borrador (ahorra cuota de IA).
- `sueldo_visible` es el corazón de la transparencia: derívalo en el pipeline (sueldo presente → true).
- Para el panel admin, define el rol `admin` vía custom claim en Supabase Auth.
