-- A dedicated citation record, reusable across content types via join
-- tables added later. `source_type` is intentionally free text (not an
-- enum) so an admin can record a new kind of source without a migration.

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  publisher text,
  publication_date date,
  source_type text,
  url text,
  isbn text,
  archive_reference text,
  citation text,
  reliability_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger sources_set_updated_at
  before update on public.sources
  for each row execute function public.set_updated_at();

alter table public.sources enable row level security;

-- Bibliographic/citation information is not sensitive on its own — it's
-- shown publicly alongside any DOCUMENTED/INTERPRETATION claim regardless
-- of that claim's own publication status, so the citation itself is
-- always readable. Only staff can create/edit sources.
create policy "sources: public can read"
  on public.sources for select
  using (true);

create policy "sources: editors can write"
  on public.sources for insert
  with check (public.can_edit());

create policy "sources: editors can update"
  on public.sources for update
  using (public.can_edit());

create policy "sources: editors can delete"
  on public.sources for delete
  using (public.can_edit());
