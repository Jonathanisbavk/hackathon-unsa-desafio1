-- ════════════════════════════════════════════════════════════════
-- CONECTA UNSA — Funciones RPC
-- Recomendación por embeddings, disparo de alertas y helper de admin.
-- ════════════════════════════════════════════════════════════════

-- ── Recomendadas para ti: similitud coseno contra ofertas publicadas ──
-- Invoker security: la RLS de "ofertas_publicas_lectura" ya acota a publicadas.
create or replace function match_ofertas(
  query_embedding vector(768),
  match_threshold float default 0.5,
  match_count int default 20
)
returns table (
  id uuid,
  titulo text,
  empresa text,
  score float
)
language sql
stable
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

-- ── Disparar alertas al publicar una oferta ──
-- SECURITY DEFINER: cruza datos de todos los egresados; se llama desde la
-- Edge Function "publicar-oferta". Evita duplicados con on conflict implícito
-- (filtra notificaciones ya existentes para esa oferta/egresado/motivo).
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
  if not found or v_oferta.estado <> 'publicada' then
    return 0;
  end if;

  -- Notificaciones por alerta (palabra clave + escuela opcional)
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

-- ── Helper: ¿el usuario actual es admin? (lee app_metadata.role del JWT) ──
create or replace function es_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;
