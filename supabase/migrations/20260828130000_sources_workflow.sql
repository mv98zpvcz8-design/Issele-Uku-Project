-- The Research Library (Phase 4) makes `sources` directly browsable
-- public content, not just a citation attached to other published
-- records. That means it needs the same draft/publish workflow as every
-- other content table — without this, a source would be publicly
-- visible the instant an admin creates the row, with no chance to stage
-- it first. This supersedes the narrower reasoning in the original
-- sources migration (20260828120300_sources.sql / DECISIONS.md
-- discussion of D-016's neighboring context): a citation is not
-- sensitive, but "not yet ready to publish" still applies to it.
--
-- `access_status` mirrors archive_items' pattern and directly answers
-- the brief's Research Library requirement ("show clearly whether: full
-- text is available, external access is available, metadata only, or
-- access restricted") — free text, not an enum, for the same
-- extensibility reason as DECISIONS.md D-017.

alter table public.sources
  add column slug text,
  add column access_status text not null default 'metadata_only',
  add column verification_status content_status not null default 'DRAFT',
  add column public_visibility boolean generated always as (verification_status = 'PUBLISHED') stored;

-- Backfill is unnecessary (no live project has real rows yet — see
-- DEPLOYMENT.md), but the constraint is added the safe, explicit way
-- rather than inline on the column so a future backfill migration
-- against real data has a clear, separate step to do first.
alter table public.sources alter column slug set not null;
alter table public.sources add constraint sources_slug_key unique (slug);

create index sources_verification_status_idx on public.sources (verification_status);

drop policy "sources: public can read" on public.sources;

create policy "sources: public can read published"
  on public.sources for select
  using (public_visibility);

create policy "sources: staff can read all"
  on public.sources for select
  using (public.is_staff());
