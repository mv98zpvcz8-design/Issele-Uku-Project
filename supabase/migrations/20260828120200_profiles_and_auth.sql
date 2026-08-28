-- Profiles extend Supabase's managed auth.users 1:1 with a role. There are
-- no public end-user accounts in this MVP — every row in `profiles` is a
-- staff member (admin/editor/researcher/reviewer).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role user_role not null default 'RESEARCHER',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Staff accounts only (admin/editor/researcher/reviewer). No public end-user accounts in the MVP.';

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- New Supabase auth users automatically get a profile row, defaulting to
-- the least-privileged role. Promoting to EDITOR/ADMIN is a deliberate,
-- separate admin action, never automatic.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data ->> 'full_name', 'RESEARCHER');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper functions used by RLS policies across every content table.
-- SECURITY DEFINER lets these read `profiles` without being subject to
-- (and recursing into) profiles' own RLS policies below.

create or replace function public.current_user_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

comment on function public.current_user_role() is
  'The calling user''s staff role, or null if they have no profile (i.e. are not staff).';

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;

create or replace function public.can_edit()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('ADMIN', 'EDITOR');
$$;

comment on function public.can_edit() is
  'True for ADMIN/EDITOR. Researcher/reviewer are read-only staff roles for now — see DECISIONS.md.';

-- Prevent a non-admin from granting themselves a higher role via a
-- self-service profile update (RLS is row-level, not column-level, so
-- this is enforced with a trigger instead).
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and public.current_user_role() <> 'ADMIN' then
    raise exception 'Only an ADMIN can change a profile''s role.';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_self_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_self_escalation();

alter table public.profiles enable row level security;

create policy "profiles: self or admin can view"
  on public.profiles for select
  using (id = auth.uid() or public.current_user_role() = 'ADMIN');

create policy "profiles: self can update own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles: admin can update any profile"
  on public.profiles for update
  using (public.current_user_role() = 'ADMIN');
