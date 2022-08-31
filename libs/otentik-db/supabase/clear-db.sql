-- select current_setting('server_version_num') as pg_version;

-- truncate table auth.users cascade;
drop table if exists public.profiles;
drop trigger if exists on_auth_user_created on auth.users cascade;
drop trigger if exists on_profiles_updated on public.profiles cascade;
drop function if exists handle_new_user;
drop function if exists handle_profiles_updated_at;

drop table if exists public.vaults;
drop trigger if exists on_vaults_updated on public.vaults cascade;
drop function if exists handle_vaults_updated_at;

drop table if exists public.devices;
