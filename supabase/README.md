# Supabase — CONECTA UNSA

Esquema, RLS y funciones del proyecto. Migraciones en `migrations/` (orden por timestamp).

## Aplicar las migraciones

**Opción A — SQL Editor del dashboard:** pega cada archivo de `migrations/` en orden y ejecútalo.

**Opción B — CLI de Supabase:**

```bash
supabase link --project-ref TU_PROJECT_REF
supabase db push
```

Orden:

1. `20260614120000_esquema_inicial.sql` — extensión `vector`, tablas e índices (incl. ivfflat).
2. `20260614120100_rls.sql` — activa RLS y todas las políticas.
3. `20260614120200_funciones.sql` — `match_ofertas`, `disparar_alertas`, `es_admin`.

## Rol admin

No se usa el claim reservado `role` (lo consume PostgREST como rol de BD). El admin se marca en
`app_metadata.role = 'admin'`, que viaja en el JWT. Para conceder admin a un usuario:

```sql
-- Desde el SQL Editor (service role), por email:
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
where email = 'admin@unsa.edu.pe';
```

El usuario debe re-loguearse para que el nuevo JWT incluya el claim. La política
`ofertas_admin_escritura` y la función `es_admin()` ya leen `app_metadata.role`.

## Verificar aislamiento RLS

Con RLS activo, un egresado solo debe ver sus propios datos. Prueba rápida en el SQL Editor
simulando el JWT de un usuario:

```sql
-- Simula el contexto de autenticación del usuario A
select set_config('request.jwt.claims',
  json_build_object('sub', '<UUID_USUARIO_A>', 'role', 'authenticated')::text, true);
set role authenticated;

-- Debe devolver solo filas de A (no de otros egresados)
select id, nombre from egresados;

reset role;
```

Si la consulta devuelve filas de otros usuarios, RLS no está aplicado correctamente.

## Notas de IA

- El `embedding` de la oferta se genera **al publicar**, no al guardar borrador (ahorra cuota).
- `sueldo_visible` es el corazón de la transparencia: lo deriva el pipeline (sueldo presente → true).
