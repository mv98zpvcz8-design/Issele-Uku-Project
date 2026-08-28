-- Culture categories (Ine Aho, festivals, Akwa Ocha, titles, ceremonies,
-- language, etc.) have no fixed list in the brief — it explicitly says
-- "the system should allow new categories later." A real table (rather
-- than an enum, or reusing archive_items.record_type) is the right model
-- here specifically because each category itself needs a description,
-- sourcing, and its own publish workflow — it's a content type in its
-- own right, not just a tag. An admin adding a new category is a normal
-- row insert, no migration required.

create table public.culture_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  evidence_type evidence_type not null default 'UNVERIFIED',
  confidence_level confidence_level not null default 'UNKNOWN',
  verification_status content_status not null default 'DRAFT',
  public_visibility boolean generated always as (verification_status = 'PUBLISHED') stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger culture_categories_set_updated_at
  before update on public.culture_categories
  for each row execute function public.set_updated_at();

alter table public.culture_categories enable row level security;

create policy "culture_categories: public can read published"
  on public.culture_categories for select
  using (public_visibility);

create policy "culture_categories: staff can read all"
  on public.culture_categories for select
  using (public.is_staff());

create policy "culture_categories: editors can write"
  on public.culture_categories for insert
  with check (public.can_edit());

create policy "culture_categories: editors can update"
  on public.culture_categories for update
  using (public.can_edit());

create policy "culture_categories: editors can delete"
  on public.culture_categories for delete
  using (public.can_edit());

-- Cross-links relevant archive records (a photograph, a recording, a
-- document) to the culture categories they illustrate.
create table public.archive_item_culture_categories (
  archive_item_id uuid not null references public.archive_items (id) on delete cascade,
  category_id uuid not null references public.culture_categories (id) on delete cascade,
  primary key (archive_item_id, category_id)
);

alter table public.archive_item_culture_categories enable row level security;

create policy "archive_item_culture_categories: public can read for published rows"
  on public.archive_item_culture_categories for select
  using (
    exists (select 1 from public.archive_items ai where ai.id = archive_item_id and ai.public_visibility)
    and exists (select 1 from public.culture_categories c where c.id = category_id and c.public_visibility)
  );

create policy "archive_item_culture_categories: staff can read all"
  on public.archive_item_culture_categories for select
  using (public.is_staff());

create policy "archive_item_culture_categories: editors can write"
  on public.archive_item_culture_categories for insert
  with check (public.can_edit());

create policy "archive_item_culture_categories: editors can delete"
  on public.archive_item_culture_categories for delete
  using (public.can_edit());
