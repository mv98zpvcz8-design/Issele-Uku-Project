-- The core searchable archive record. `record_type`, `source_type`,
-- `access_status` and `language` are free text (extensible without a
-- migration); the evidence/confidence/copyright/workflow fields are the
-- fixed enums defined in 20260828120100_enums.sql.

create table public.archive_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text,
  abstract text,
  record_type text,
  date_exact date,
  date_from date,
  date_to date,
  date_display text,
  historical_period text,
  creator text,
  contributor text,
  source_name text,
  source_url text,
  source_citation text,
  source_type text,
  source_repository text,
  language text,
  location text,
  rights_holder text,
  copyright_status copyright_status not null default 'UNKNOWN',
  publication_permission boolean not null default false,
  access_status text not null default 'metadata_only',
  verification_status content_status not null default 'DRAFT',
  evidence_type evidence_type not null default 'UNVERIFIED',
  confidence_level confidence_level not null default 'UNKNOWN',
  cultural_sensitivity text,
  featured boolean not null default false,
  public_visibility boolean generated always as (
    verification_status = 'PUBLISHED' and copyright_status <> 'RESTRICTED'
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index archive_items_verification_status_idx on public.archive_items (verification_status);
create index archive_items_record_type_idx on public.archive_items (record_type);
create index archive_items_historical_period_idx on public.archive_items (historical_period);

create trigger archive_items_set_updated_at
  before update on public.archive_items
  for each row execute function public.set_updated_at();

alter table public.archive_items enable row level security;

create policy "archive_items: public can read published"
  on public.archive_items for select
  using (public_visibility);

create policy "archive_items: staff can read all"
  on public.archive_items for select
  using (public.is_staff());

create policy "archive_items: editors can write"
  on public.archive_items for insert
  with check (public.can_edit());

create policy "archive_items: editors can update"
  on public.archive_items for update
  using (public.can_edit());

create policy "archive_items: editors can delete"
  on public.archive_items for delete
  using (public.can_edit());
