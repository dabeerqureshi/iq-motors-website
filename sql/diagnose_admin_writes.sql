-- ============================================================================
-- IQ Motors Limited – admin write diagnostics (READ ONLY)
--
-- Symptom this explains
--   "Mark Sold", "Back to Available", "Save Changes" (edit) or "Delete" show:
--      "The server did not allow this update/change. Your session may have
--       expired — please log out and log back in, then try again."
--
--   That message means PostgREST reported success but the write touched 0 rows.
--   Postgres behaves that way when a Row Level Security policy filters the row
--   out for the current role: no error is raised, the row is simply not
--   visible/updatable. Reads and INSERTs keep working, which is why the stock
--   list still loads and adding a vehicle can still succeed - only UPDATE and
--   DELETE fail.
--
-- HOW TO RUN
--   Supabase Dashboard -> SQL Editor -> New query -> paste this file -> Run.
--   Every statement is a SELECT; nothing is modified.
--
--   The whole file is ONE query, so the single table it prints contains every
--   answer (the editor only displays the last result set).
-- ============================================================================

-- Expected values (see the comments in sql/enable_rls.sql):
--   1. RLS on for all three tables: true
--   2. stock_list policies: SELECT (using true), INSERT (with check is_admin()),
--      UPDATE (using AND with check is_admin()), DELETE (using is_admin())
--      -> a missing UPDATE/DELETE row is the cause of 0-row admin writes
--   3. is_admin() must exist and compare case-insensitively
--   4. the admin email must match the address you sign in with
--   5. only TRUE/FALSE counts expected - NULL rows appear in neither list
--   6. the car-images bucket must exist (and be public for photos to render)

with rls as (
  select '1. RLS enabled: ' || c.relname as check_name,
         c.relrowsecurity::text          as result
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname in ('stock_list', 'happy_customers', 'admin_users')
),
policies as (
  select '2. policy: ' || p.tablename || ' ' || upper(p.cmd) || ' "' || p.policyname || '"' as check_name,
         'using=' || coalesce(p.qual, 'NULL') || ' | with check=' || coalesce(p.with_check, 'NULL') as result
  from pg_policies p
  where p.schemaname = 'public'
    and p.tablename in ('stock_list', 'happy_customers', 'admin_users')
),
is_admin_fn as (
  select '3. is_admin() installed' as check_name,
         case when exists (
                select 1 from pg_proc pr
                join pg_namespace n on n.oid = pr.pronamespace
                where n.nspname = 'public' and pr.proname = 'is_admin'
              )
              then 'YES'
              else 'NO - run sql/enable_rls.sql' end as result
),
is_admin_body as (
  select '3b. is_admin() body' as check_name,
         replace(pg_get_functiondef(pr.oid), chr(10), ' ') as result
  from pg_proc pr
  join pg_namespace n on n.oid = pr.pronamespace
  where n.nspname = 'public' and pr.proname = 'is_admin'
),
admins as (
  select '4. admin_users: ' || a.email as check_name,
         'last_login=' || coalesce(a.last_login::text, 'never') as result
  from public.admin_users a
),
list_counts as (
  select '5. stock_list is_available=' || coalesce(s.is_available::text, 'NULL') as check_name,
         count(*)::text || ' rows' as result
  from public.stock_list s
  group by s.is_available
),
bucket as (
  select '6. storage bucket car-images' as check_name,
         case when exists (select 1 from storage.buckets b where b.id = 'car-images')
              then 'exists'
              else 'MISSING - run sql/storage_policies.sql' end as result
),
column_types as (
  select '7. stock_list.' || c.column_name as check_name,
         c.data_type as result
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'stock_list'
    and c.column_name in
        ('price', 'year', 'miles_driven', 'attributes', 'image_url', 'is_available', 'created_at')
)
select check_name, result from rls
union all select check_name, result from policies
union all select check_name, result from is_admin_fn
union all select check_name, result from is_admin_body
union all select check_name, result from admins
union all select check_name, result from list_counts
union all select check_name, result from bucket
union all select check_name, result from column_types
order by check_name;

