-- `category` is free text (quarter, market, palace, church, school,
-- historical_site, ...) so new categories don't require a migration.

create table public.places (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  alternative_names text[] not null default '{}',
  category text,
  description text,
  historical_significance text,
  latitude numeric,
  longitude numeric,
  evidence_type evidence_type not null default 'UNVERIFIED',
  confidence_level confidence_level not null default 'UNKNOWN',
  verification_status content_status not null default 'DRAFT',
  public_visibility boolean generated always as (verification_status = 'PUBLISHED') stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index places_verification_status_idx on public.places (verification_status);

create trigger places_set_updated_at
  before update on public.places
  for each row execute function public.set_updated_at();

alter table public.places enable row level security;

create policy "places: public can read published"
  on public.places for select
  using (public_visibility);

create policy "places: staff can read all"
  on public.places for select
  using (public.is_staff());

create policy "places: editors can write"
  on public.places for insert
  with check (public.can_edit());

create policy "places: editors can update"
  on public.places for update
  using (public.can_edit());

create policy "places: editors can delete"
  on public.places for delete
  using (public.can_edit());
