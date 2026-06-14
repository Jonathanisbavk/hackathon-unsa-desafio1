-- ════════════════════════════════════════════════════════════════
-- CONECTA UNSA — Demo (alertas por correo), palabras clave y CVs
-- Permite que el invitado (sin auth) cree alertas con email y suba su CV,
-- usando políticas de insert para el rol anon (sin service role).
-- ════════════════════════════════════════════════════════════════

-- ── Alertas: correo para invitados ──
alter table alertas add column if not exists email text;

-- Insert de alertas por invitados (anon): sin egresado y con email obligatorio.
drop policy if exists "alertas_anon_insert" on alertas;
create policy "alertas_anon_insert" on alertas
  for insert to anon
  with check (egresado_id is null and email is not null);

-- ── Preferencias: palabras clave (escalable, indexado) ──
alter table preferencias add column if not exists palabras_clave text[] default '{}';
create index if not exists preferencias_palabras_clave_idx
  on preferencias using gin (palabras_clave);

-- ── CVs: persistencia del CV procesado (demo y auth) ──
create table if not exists cvs (
  id uuid primary key default gen_random_uuid(),
  egresado_id uuid references egresados(id) on delete cascade,  -- null en demo
  email text,
  texto text,                              -- texto plano extraído del PDF
  datos jsonb,                             -- perfil estructurado por la IA
  embedding vector(768),
  created_at timestamptz default now()
);

create index if not exists cvs_egresado_idx on cvs (egresado_id);

alter table cvs enable row level security;

-- Invitados (anon): pueden insertar su CV sin egresado.
drop policy if exists "cvs_anon_insert" on cvs;
create policy "cvs_anon_insert" on cvs
  for insert to anon
  with check (egresado_id is null);

-- Autenticados: ven/gestionan solo su propio CV.
drop policy if exists "cvs_self" on cvs;
create policy "cvs_self" on cvs
  for all to authenticated
  using (auth.uid() = egresado_id)
  with check (auth.uid() = egresado_id);
