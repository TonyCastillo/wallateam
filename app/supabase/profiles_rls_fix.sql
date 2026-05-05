-- Fix: Permitir que los perfiles sean visibles para cualquier usuario autenticado,
-- de modo que los nombres y avatares de otros miembros del wallet sean visibles.

drop policy if exists "profiles_select_own" on profiles;
drop policy if exists "profiles_select_all" on profiles;

create policy "profiles_select_all" on profiles
  for select using (auth.role() = 'authenticated');
