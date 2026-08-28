-- Supports multiple media files per archive item. `storage_path` points
-- into Supabase Storage. `media_type` is free text (image/audio/video/
-- document, extensible).
--
-- Per COPYRIGHT_GUIDELINES.md: a row on the parent archive_item with
-- copyright_status = 'COPYRIGHTED_METADATA_ONLY' should generally have no
-- corresponding full-file archive_media row at all. That rule is
-- editorial (enforced by admin process / ADMIN_GUIDE.md), not a database
-- constraint, because a separately-licensed thumbnail/cover can still be
-- legitimate for such an item.

create table public.archive_media (
  id uuid primary key default gen_random_uuid(),
  archive_item_id uuid not null references public.archive_items (id) on delete cascade,
  storage_path text not null,
  media_type text,
  caption text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index archive_media_archive_item_id_idx on public.archive_media (archive_item_id);

alter table public.archive_media enable row level security;

-- Media visibility follows its parent archive item's public_visibility.
create policy "archive_media: public can read for published items"
  on public.archive_media for select
  using (
    exists (
      select 1 from public.archive_items ai
      where ai.id = archive_item_id and ai.public_visibility
    )
  );

create policy "archive_media: staff can read all"
  on public.archive_media for select
  using (public.is_staff());

create policy "archive_media: editors can write"
  on public.archive_media for insert
  with check (public.can_edit());

create policy "archive_media: editors can update"
  on public.archive_media for update
  using (public.can_edit());

create policy "archive_media: editors can delete"
  on public.archive_media for delete
  using (public.can_edit());

-- Now that archive_media exists, people/monarchs can reference a cover
-- image. Added here (rather than reordering table creation) to keep each
-- migration file focused on one table.
alter table public.places
  add column cover_media_id uuid references public.archive_media (id) on delete set null;
