-- Extends the archive_item cross-linking pattern already established by
-- archive_item_culture_categories (Phase 4) and event_archive_items
-- (Phase 5) to sources, people, places, and monarchs — so a photograph
-- or document can illustrate any content type, not just events and
-- culture categories. Same shape, same RLS pattern, every time.

create table public.source_archive_items (
  source_id uuid not null references public.sources (id) on delete cascade,
  archive_item_id uuid not null references public.archive_items (id) on delete cascade,
  primary key (source_id, archive_item_id)
);

alter table public.source_archive_items enable row level security;

create policy "source_archive_items: public can read for published rows"
  on public.source_archive_items for select
  using (
    exists (select 1 from public.sources s where s.id = source_id and s.public_visibility)
    and exists (select 1 from public.archive_items ai where ai.id = archive_item_id and ai.public_visibility)
  );

create policy "source_archive_items: staff can read all"
  on public.source_archive_items for select
  using (public.is_staff());

create policy "source_archive_items: editors can write"
  on public.source_archive_items for insert
  with check (public.can_edit());

create policy "source_archive_items: editors can delete"
  on public.source_archive_items for delete
  using (public.can_edit());

create table public.person_archive_items (
  person_id uuid not null references public.people (id) on delete cascade,
  archive_item_id uuid not null references public.archive_items (id) on delete cascade,
  primary key (person_id, archive_item_id)
);

alter table public.person_archive_items enable row level security;

create policy "person_archive_items: public can read for published rows"
  on public.person_archive_items for select
  using (
    exists (select 1 from public.people p where p.id = person_id and p.public_visibility)
    and exists (select 1 from public.archive_items ai where ai.id = archive_item_id and ai.public_visibility)
  );

create policy "person_archive_items: staff can read all"
  on public.person_archive_items for select
  using (public.is_staff());

create policy "person_archive_items: editors can write"
  on public.person_archive_items for insert
  with check (public.can_edit());

create policy "person_archive_items: editors can delete"
  on public.person_archive_items for delete
  using (public.can_edit());

create table public.place_archive_items (
  place_id uuid not null references public.places (id) on delete cascade,
  archive_item_id uuid not null references public.archive_items (id) on delete cascade,
  primary key (place_id, archive_item_id)
);

alter table public.place_archive_items enable row level security;

create policy "place_archive_items: public can read for published rows"
  on public.place_archive_items for select
  using (
    exists (select 1 from public.places p where p.id = place_id and p.public_visibility)
    and exists (select 1 from public.archive_items ai where ai.id = archive_item_id and ai.public_visibility)
  );

create policy "place_archive_items: staff can read all"
  on public.place_archive_items for select
  using (public.is_staff());

create policy "place_archive_items: editors can write"
  on public.place_archive_items for insert
  with check (public.can_edit());

create policy "place_archive_items: editors can delete"
  on public.place_archive_items for delete
  using (public.can_edit());

create table public.monarch_archive_items (
  monarch_id uuid not null references public.monarchs (id) on delete cascade,
  archive_item_id uuid not null references public.archive_items (id) on delete cascade,
  primary key (monarch_id, archive_item_id)
);

alter table public.monarch_archive_items enable row level security;

create policy "monarch_archive_items: public can read for published rows"
  on public.monarch_archive_items for select
  using (
    exists (select 1 from public.monarchs m where m.id = monarch_id and m.public_visibility)
    and exists (select 1 from public.archive_items ai where ai.id = archive_item_id and ai.public_visibility)
  );

create policy "monarch_archive_items: staff can read all"
  on public.monarch_archive_items for select
  using (public.is_staff());

create policy "monarch_archive_items: editors can write"
  on public.monarch_archive_items for insert
  with check (public.can_edit());

create policy "monarch_archive_items: editors can delete"
  on public.monarch_archive_items for delete
  using (public.can_edit());
