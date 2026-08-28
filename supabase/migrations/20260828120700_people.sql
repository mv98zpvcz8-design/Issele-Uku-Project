create table public.people (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  alternative_names text[] not null default '{}',
  titles text[] not null default '{}',
  biography text,
  birth_date date,
  death_date date,
  associated_locations text[] not null default '{}',
  historical_period text,
  image_media_id uuid references public.archive_media (id) on delete set null,
  evidence_type evidence_type not null default 'UNVERIFIED',
  confidence_level confidence_level not null default 'UNKNOWN',
  verification_status content_status not null default 'DRAFT',
  public_visibility boolean generated always as (verification_status = 'PUBLISHED') stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index people_verification_status_idx on public.people (verification_status);

create trigger people_set_updated_at
  before update on public.people
  for each row execute function public.set_updated_at();

alter table public.people enable row level security;

create policy "people: public can read published"
  on public.people for select
  using (public_visibility);

create policy "people: staff can read all"
  on public.people for select
  using (public.is_staff());

create policy "people: editors can write"
  on public.people for insert
  with check (public.can_edit());

create policy "people: editors can update"
  on public.people for update
  using (public.can_edit());

create policy "people: editors can delete"
  on public.people for delete
  using (public.can_edit());
