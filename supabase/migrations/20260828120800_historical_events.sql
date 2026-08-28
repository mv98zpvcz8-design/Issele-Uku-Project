create table public.historical_events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  date_exact date,
  date_from date,
  date_to date,
  date_display text,
  location_id uuid references public.places (id) on delete set null,
  evidence_type evidence_type not null default 'UNVERIFIED',
  confidence_level confidence_level not null default 'UNKNOWN',
  verification_status content_status not null default 'DRAFT',
  public_visibility boolean generated always as (verification_status = 'PUBLISHED') stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index historical_events_verification_status_idx on public.historical_events (verification_status);
create index historical_events_location_id_idx on public.historical_events (location_id);
create index historical_events_date_from_idx on public.historical_events (date_from);

create trigger historical_events_set_updated_at
  before update on public.historical_events
  for each row execute function public.set_updated_at();

alter table public.historical_events enable row level security;

create policy "historical_events: public can read published"
  on public.historical_events for select
  using (public_visibility);

create policy "historical_events: staff can read all"
  on public.historical_events for select
  using (public.is_staff());

create policy "historical_events: editors can write"
  on public.historical_events for insert
  with check (public.can_edit());

create policy "historical_events: editors can update"
  on public.historical_events for update
  using (public.can_edit());

create policy "historical_events: editors can delete"
  on public.historical_events for delete
  using (public.can_edit());
