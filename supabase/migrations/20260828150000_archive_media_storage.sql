-- Private Storage bucket backing archive_media.storage_path (see
-- DECISIONS.md D-035). Private, not public: visibility of a file must
-- follow its parent record's own public_visibility/copyright_status,
-- not a blanket bucket-level rule.
--
-- Deliberately NO SELECT policy for anon or authenticated at all. Every
-- read — staff included — goes through a signed URL minted by the
-- service-role client in application code (src/app/media/[id]/route.ts),
-- which performs its own archive_media/archive_items RLS check first
-- (via the ordinary, RLS-respecting client) and only then asks the
-- service-role client for a short-lived signed URL. This is exactly the
-- "legitimate RLS-bypassing operation, after the caller's access has
-- already been checked in application code" that
-- src/lib/supabase/service-role.ts's own comment anticipates (see
-- D-025) — not a shortcut around writing a policy, but the one case
-- Storage's own policy model can't express (it has no way to reference
-- a *different* table's row-level visibility). Keeping the bucket
-- itself fully closed means the existing, already-tested archive_media/
-- archive_items RLS remains the single place visibility is decided.
insert into storage.buckets (id, name, public)
values ('archive-media', 'archive-media', false)
on conflict (id) do nothing;

-- Staff-only SELECT on object METADATA (path/size/mimetype/timestamps),
-- not file contents. This is required for uploads to work at all, not
-- just a nice-to-have: Supabase's Storage API reads an uploaded
-- object's row back after insert to return its metadata to the caller,
-- which (like an INSERT ... RETURNING) needs a matching SELECT policy —
-- confirmed by local testing, where the insert's own WITH CHECK passed
-- but the upload still failed until this policy was added. Public/anon
-- still gets no SELECT policy at all here, so this doesn't weaken the
-- "no direct access — everything goes through a signed URL" guarantee;
-- it only lets staff see the private bucket's own file listing, same as
-- browsing archive_media rows in the admin UI already lets them do.
create policy "archive-media bucket: staff can read metadata"
  on storage.objects for select
  using (bucket_id = 'archive-media' and public.is_staff());

-- Only staff who can already write archive_media rows may write the
-- underlying files — mirrors archive_media's own can_edit() policies
-- exactly (20260828120600_archive_media.sql), so the two layers can't
-- drift apart.
create policy "archive-media bucket: editors can upload"
  on storage.objects for insert
  with check (bucket_id = 'archive-media' and public.can_edit());

create policy "archive-media bucket: editors can update"
  on storage.objects for update
  using (bucket_id = 'archive-media' and public.can_edit());

create policy "archive-media bucket: editors can delete"
  on storage.objects for delete
  using (bucket_id = 'archive-media' and public.can_edit());
