create table public.monarchs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  regnal_name text,
  reign_start date,
  reign_end date,
  reign_display text,
  predecessor_id uuid references public.monarchs (id) on delete set null,
  successor_id uuid references public.monarchs (id) on delete set null,
  biography text,
  image_media_id uuid references public.archive_media (id) on delete set null,
  evidence_type evidence_type not null default 'UNVERIFIED',
  confidence_level confidence_level not null default 'UNKNOWN',
  verification_status content_status not null default 'DRAFT',
  public_visibility boolean generated always as (verification_status = 'PUBLISHED') stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index monarchs_verification_status_idx on public.monarchs (verification_status);

create trigger monarchs_set_updated_at
  before update on public.monarchs
  for each row execute function public.set_updated_at();

alter table public.monarchs enable row level security;

create policy "monarchs: public can read published"
  on public.monarchs for select
  using (public_visibility);

create policy "monarchs: staff can read all"
  on public.monarchs for select
  using (public.is_staff());

create policy "monarchs: editors can write"
  on public.monarchs for insert
  with check (public.can_edit());

create policy "monarchs: editors can update"
  on public.monarchs for update
  using (public.can_edit());

create policy "monarchs: editors can delete"
  on public.monarchs for delete
  using (public.can_edit());
