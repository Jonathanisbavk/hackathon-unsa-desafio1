-- ════════════════════════════════════════════════════════════════
-- CONECTA UNSA — Campos de filtrado y contacto en ofertas
-- Ubicación, tipo de empleo (jornada), jerarquía, a quién va dirigido,
-- y datos de contacto para la vista de detalle.
-- ════════════════════════════════════════════════════════════════

alter table ofertas add column if not exists ciudad text;
alter table ofertas add column if not exists provincia text;
alter table ofertas add column if not exists distrito text;
alter table ofertas add column if not exists tipo_empleo text;          -- Full-time, Part-time, Pasantía, Freelance, Práctica, Eventual
alter table ofertas add column if not exists nivel_jerarquia text;      -- Gerencia, Jefe/Supervisor, Senior/Semi-senior, Junior, Pasante/Interno, Primer Empleo, No requiere
alter table ofertas add column if not exists dirigido_a text[] default '{}'; -- Pre-grado, Egresado, Últimos años, Prácticas, Voluntariado
alter table ofertas add column if not exists contacto_nombre text;
alter table ofertas add column if not exists contacto_email text;
alter table ofertas add column if not exists contacto_telefono text;

-- Índices para los filtros del buscador.
create index if not exists ofertas_tipo_empleo_idx on ofertas (tipo_empleo);
create index if not exists ofertas_nivel_jerarquia_idx on ofertas (nivel_jerarquia);
create index if not exists ofertas_ciudad_idx on ofertas (ciudad);
create index if not exists ofertas_dirigido_a_idx on ofertas using gin (dirigido_a);
