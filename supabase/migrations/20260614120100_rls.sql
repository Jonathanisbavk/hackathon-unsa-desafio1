-- ════════════════════════════════════════════════════════════════
-- CONECTA UNSA — Row Level Security
-- Cada egresado solo accede a sus propios datos. Ofertas publicadas son
-- legibles por cualquier autenticado; escritura de ofertas solo admin.
-- ════════════════════════════════════════════════════════════════

alter table egresados      enable row level security;
alter table preferencias   enable row level security;
alter table alertas        enable row level security;
alter table notificaciones enable row level security;
alter table ofertas        enable row level security;

-- ── El egresado solo ve/edita lo suyo ──
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

-- ── Ofertas publicadas: lectura para cualquier usuario autenticado ──
drop policy if exists "ofertas_publicas_lectura" on ofertas;
create policy "ofertas_publicas_lectura" on ofertas
  for select using (estado = 'publicada');

-- ── Escritura de ofertas: solo rol admin ──
-- NOTA: la skill propone auth.jwt() ->> 'role' = 'admin', pero 'role' es el claim
-- reservado que PostgREST usa como rol de BD (authenticated); sobrescribirlo rompe
-- las peticiones. Usamos el patrón seguro de Supabase: app_metadata.role, que viaja
-- en el JWT sin tocar el claim reservado. Se concede con es_admin() (ver migración 0003).
drop policy if exists "ofertas_admin_escritura" on ofertas;
create policy "ofertas_admin_escritura" on ofertas
  for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
