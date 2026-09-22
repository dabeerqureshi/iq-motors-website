-- ============================================================================
-- IQ Motors Limited - Supabase Storage hardening
-- Fixes: uploads to the `car-images` bucket rely on dashboard defaults, so a
--        fresh project / rotated keys can leave the admin photo uploads broken
--        (or, worse, writable by anyone). Run this after sql/enable_rls.sql.
--
-- HOW TO RUN:
--   1. Supabase Dashboard -> SQL Editor -> New query
--   2. Paste this whole file, then click "Run".
--
-- Idempotent: safe to run more than once.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. The bucket used for vehicle photos and happy-customer photos
--    (public read: the URLs are embedded in the public site)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true)
on conflict (id) do update set public = true;

-- ---------------------------------------------------------------------------
-- 2. Object policies
--    Public (anon + authenticated) may READ; only admins may WRITE.
--    public.is_admin() is defined in sql/enable_rls.sql.
-- ---------------------------------------------------------------------------

-- read -----------------------------------------------------------------
drop policy if exists "Public can view car images" on storage.objects;
create policy "Public can view car images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'car-images');

-- upload ---------------------------------------------------------------
drop policy if exists "Admins can upload car images" on storage.objects;
create policy "Admins can upload car images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'car-images' and public.is_admin());

-- replace --------------------------------------------------------------
drop policy if exists "Admins can update car images" on storage.objects;
create policy "Admins can update car images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'car-images' and public.is_admin())
  with check (bucket_id = 'car-images' and public.is_admin());

-- delete (used when a listing is deleted, an image is removed, or an upload
-- is rolled back after a failed save) ---------------------------------
drop policy if exists "Admins can delete car images" on storage.objects;
create policy "Admins can delete car images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'car-images' and public.is_admin());

-- ============================================================================
-- OPTIONAL: keep the admin check working if storage policies are ever applied
-- to a project where sql/enable_rls.sql has not been run yet. This is the same
-- function defined there, repeated so this file can stand alone.
-- ============================================================================
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
