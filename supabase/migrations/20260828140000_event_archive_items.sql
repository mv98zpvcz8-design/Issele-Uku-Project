-- The brief asks the timeline to "link to relevant archive records," but
-- nothing previously connected historical_events to archive_items (only
-- archive_items <-> culture_categories exists, added in Phase 4). Same
-- join-table pattern as everywhere else.

create table public.event_archive_items (
  event_id uuid not null references public.historical_events (id) on delete cascade,
  archive_item_id uuid not null references public.archive_items (id) on delete cascade,
  primary key (event_id, archive_item_id)
);

alter table public.event_archive_items enable row level security;

create policy "event_archive_items: public can read for published rows"
  on public.event_archive_items for select
  using (
    exists (select 1 from public.historical_events e where e.id = event_id and e.public_visibility)
    and exists (select 1 from public.archive_items ai where ai.id = archive_item_id and ai.public_visibility)
  );

create policy "event_archive_items: staff can read all"
  on public.event_archive_items for select
  using (public.is_staff());

create policy "event_archive_items: editors can write"
  on public.event_archive_items for insert
  with check (public.can_edit());

create policy "event_archive_items: editors can delete"
  on public.event_archive_items for delete
  using (public.can_edit());
