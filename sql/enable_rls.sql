-- ============================================================================
-- IQ Motors Limited – Supabase hardening migration
-- Fixes: RLS disabled on public tables (Advisor CRITICAL findings)
--        missing admin_users table (blocked the new admin login flow)
--        RLS-silenced UPDATE/DELETE writes (admin "Mark Sold" / "Save Changes"
--        failed with "the server did not allow this change")
--
-- RELATED FILES
--   sql/diagnose_admin_writes.sql – read-only queries that show the live policy
--                                   state and explain the failure symptoms
--   sql/storage_policies.sql      – `car-images` bucket + admin upload policies
--
-- HOW TO RUN:
--   1. Supabase Dashboard -> SQL Editor -> New query
--   2. Paste this whole file, then click "Run".
--   3. Afterwards create the admin's Supabase Auth user + admin_users row
--      (see the SETUP-ADMIN section at the bottom).
-- This file is idempotent-safe (uses IF NOT EXISTS where possible).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. CREATE the admin_users table (needed by src/hooks/useAuth.tsx)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  last_login timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. Ensure created_at defaults exist for API inserts
--    (the app inserts rows without created_at)
-- ---------------------------------------------------------------------------
alter table public.stock_list alter column created_at set default now();
alter table public.happy_customers alter column created_at set default now();

-- ---------------------------------------------------------------------------
-- 2b. `is_available` must never be NULL, or the row disappears
--     NULL matches neither "available" (is_available = true) nor "sold"
--     (is_available = false), so the row shows up in neither public list and in
--     neither admin tab. Rows created before the column existed are NULL, and
--     an insert that omits the column would be NULL too - hence the default.
-- ---------------------------------------------------------------------------
update public.stock_list set is_available = true where is_available is null;
alter table public.stock_list alter column is_available set default true;
-- Optional extra hardening once you are happy with the data:
-- alter table public.stock_list alter column is_available set not null;

-- ---------------------------------------------------------------------------
-- 3. Enable Row Level Security
-- ---------------------------------------------------------------------------
alter table public.stock_list enable row level security;
alter table public.happy_customers enable row level security;
alter table public.admin_users enable row level security;

-- ---------------------------------------------------------------------------
-- 4. Helper function: is the caller an admin?
--    SECURITY DEFINER lets this read the admin list without RLS recursion.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

revoke execute on function public.is_admin from public;
grant execute on function public.is_admin to authenticated;

-- ---------------------------------------------------------------------------
-- 5. PUBLIC TABLES: anyone (anon) may READ; only admins may WRITE.
-- ---------------------------------------------------------------------------

-- stock_list: public read ------------------------------------------------
drop policy if exists "Public can view stock" on public.stock_list;
create policy "Public can view stock"
  on public.stock_list
  for select
  to anon, authenticated
  using (true);

-- stock_list: admin write ------------------------------------------------
drop policy if exists "Admins can insert stock" on public.stock_list;
create policy "Admins can insert stock"
  on public.stock_list
  for insert
  to authenticated
  with check (public.is_admin());

-- NOTE: an UPDATE policy needs BOTH expressions spelled out.
--   using (...)       -> which rows the admin may target
--   with check (...)  -> what the new row must look like afterwards
-- When USING is missing/does not match, Postgres silently updates 0 rows and
-- PostgREST still reports success, so the admin UI showed a green "Vehicle
-- updated" (or "Moved to Sold") while nothing persisted - and it is also why
-- "Mark Sold" / "Save Changes" can fail with the "server did not allow this
-- change" error. State both explicitly.
drop policy if exists "Admins can update stock" on public.stock_list;
create policy "Admins can update stock"
  on public.stock_list
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete stock" on public.stock_list;
create policy "Admins can delete stock"
  on public.stock_list
  for delete
  to authenticated
  using (public.is_admin());

-- happy_customers: public read --------------------------------------------
drop policy if exists "Public can view happy customers" on public.happy_customers;
create policy "Public can view happy customers"
  on public.happy_customers
  for select
  to anon, authenticated
  using (true);

-- happy_customers: admin write ---------------------------------------------
drop policy if exists "Admins can insert happy customers" on public.happy_customers;
create policy "Admins can insert happy customers"
  on public.happy_customers
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can delete happy customers" on public.happy_customers;
create policy "Admins can delete happy customers"
  on public.happy_customers
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6. ADMINS table: each logged-in admin sees/updates only their own row.
--    (Required so useAuth can stamp last_login without exposing other admins.)
-- ---------------------------------------------------------------------------
drop policy if exists "Admins can view own row" on public.admin_users;
create policy "Admins can view own row"
  on public.admin_users
  for select
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

drop policy if exists "Admins can update own row" on public.admin_users;
create policy "Admins can update own row"
  on public.admin_users
  for update
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'))
  with check (lower(email) = lower(auth.jwt() ->> 'email'));

-- ============================================================================
-- VERIFY (optional, read-only)
-- Every policy created above should be listed. If stock_list is missing an
-- UPDATE or DELETE policy, this script did not finish running: re-run it.
-- sql/diagnose_admin_writes.sql explains what each row means.
-- ============================================================================
select tablename, policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('stock_list', 'happy_customers', 'admin_users')
order by tablename, cmd, policyname;

-- ============================================================================
-- SETUP-ADMIN (run AFTER the above)
-- 1) Supabase Dashboard -> Authentication -> Users -> "Add user"
--       Email:    the email you will log in with (e.g. admin@iqmotors.co.uk)
--       Password: a strong password (NOT the old demo password!)
-- 2) Then run the INSERT below, replacing the placeholder email:
--
--     insert into public.admin_users (email)
--     values ('admin@iqmotors.co.uk')
--     on conflict (email) do nothing;
--
-- Log in at https://<your-domain>/admin-IQmotors with that email + password.
-- ============================================================================