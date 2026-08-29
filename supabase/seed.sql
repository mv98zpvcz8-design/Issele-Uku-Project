-- Demo/sample seed data. Every record here is FICTIONAL and exists only
-- to exercise the schema, RLS policies, and UI during development.
--
-- Per CONTENT_GUIDELINES.md rule 5: every title is prefixed [SAMPLE] or
-- [DEMO], every historical claim carries evidence_type = 'UNVERIFIED'
-- (this is placeholder data, not a real claim of any kind), and nothing
-- here should be read as, or migrated into, real Issele-Uku history.
--
-- This file is NOT applied automatically to a linked Supabase project by
-- `supabase db push` — it only runs via `supabase db reset` against a
-- local/dev database, or if explicitly run by hand. Never run this
-- against production.

-- A demo place, used as a location reference by other demo records.
insert into public.places (id, slug, name, category, description, evidence_type, confidence_level, verification_status)
values (
  '00000000-0000-0000-0001-000000000001',
  'sample-quarter',
  '[SAMPLE] Demo Quarter',
  'quarter',
  'A fictional quarter used only to demonstrate the Places section during development. Not a real location.',
  'UNVERIFIED',
  'UNKNOWN',
  'PUBLISHED'
);

-- A demo person, referenced by the demo oral history and event below.
insert into public.people (id, slug, name, biography, historical_period, evidence_type, confidence_level, verification_status)
values (
  '00000000-0000-0000-0002-000000000001',
  'sample-elder',
  '[SAMPLE] Demo Community Elder',
  'A fictional person used only to demonstrate the People section and its link to an oral history record. Not a real individual.',
  '[DEMO] Sample period',
  'UNVERIFIED',
  'UNKNOWN',
  'PUBLISHED'
);

-- A demo source, showing what a DOCUMENTED citation looks like in the
-- Research Library, published so it's visible there.
insert into public.sources (id, slug, title, author, publisher, publication_date, source_type, citation, reliability_notes, access_status, verification_status)
values (
  '00000000-0000-0000-0003-000000000001',
  'sample-bibliographic-record',
  '[SAMPLE] Demo Bibliographic Record',
  'A. Fictional Author',
  'Demo University Press',
  '1999-01-01',
  'book',
  'Fictional Author, A. (1999). [SAMPLE] Demo Bibliographic Record. Demo University Press.',
  'Fictional source, present only to demonstrate the citation/source display in the archive and research library.',
  'metadata_only',
  'PUBLISHED'
);

-- A second source, deliberately left in DRAFT, to demonstrate that a
-- newly-created Research Library entry is not public until published.
insert into public.sources (slug, title, source_type, access_status, verification_status)
values (
  'sample-draft-bibliographic-record',
  '[SAMPLE] Demo draft bibliographic record (not yet public)',
  'journal_article',
  'metadata_only',
  'DRAFT'
);

-- Two culture categories, one published, one draft.
insert into public.culture_categories (id, slug, name, description, evidence_type, confidence_level, verification_status)
values (
  '00000000-0000-0000-0006-000000000001',
  'sample-festivals',
  '[SAMPLE] Demo Festivals',
  'A fictional culture category used only to demonstrate the Culture section''s layout and its link to related archive records.',
  'UNVERIFIED', 'UNKNOWN', 'PUBLISHED'
);
insert into public.culture_categories (slug, name, description, verification_status)
values (
  'sample-draft-category',
  '[SAMPLE] Demo draft category (not yet public)',
  'Demonstrates that a newly-created culture category is not public until published.',
  'DRAFT'
);

-- Four archive items, one per evidence type that isn't UNVERIFIED, plus
-- one UNVERIFIED, so the UI's evidence badges can all be exercised.
insert into public.archive_items (
  slug, title, subtitle, description, record_type, date_display,
  historical_period, source_name, source_citation, copyright_status,
  access_status, verification_status, evidence_type, confidence_level, featured
) values
  (
    'sample-documented-record',
    '[SAMPLE] Demo documented record',
    'Illustrates the DOCUMENTED evidence badge',
    'A fictional archive record standing in for a documentary source (e.g. a colonial-era administrative record) — used only to demonstrate the evidence-badge system.',
    'document', 'c. 1930s (fictional)', '[DEMO] Sample period',
    '[SAMPLE] Demo Bibliographic Record', 'See linked source record.',
    'PUBLIC_DOMAIN', 'public', 'PUBLISHED', 'DOCUMENTED', 'HIGH', true
  ),
  (
    'sample-oral-tradition-record',
    '[SAMPLE] Demo oral-tradition record',
    'Illustrates the ORAL_TRADITION evidence badge',
    'A fictional record standing in for an account passed down through oral tradition — used only to demonstrate that oral tradition is labelled, not suppressed.',
    'oral_history_interview', 'date uncertain', '[DEMO] Sample period',
    null, null, 'UNKNOWN', 'metadata_only', 'PUBLISHED', 'ORAL_TRADITION', 'MEDIUM', false
  ),
  (
    'sample-disputed-record',
    '[SAMPLE] Demo disputed record',
    'Illustrates the DISPUTED evidence badge',
    'A fictional record standing in for a case where more than one historical account exists — used only to demonstrate the DISPUTED label.',
    'academic_research', 'date uncertain', '[DEMO] Sample period',
    null, null, 'UNKNOWN', 'metadata_only', 'PUBLISHED', 'DISPUTED', 'LOW', false
  ),
  (
    'sample-unverified-record',
    '[SAMPLE] Demo unverified record',
    'Illustrates the UNVERIFIED evidence badge and DRAFT workflow status',
    'A fictional record standing in for something recorded but not yet verified. Deliberately left in DRAFT status, so it is only visible to staff — demonstrating that unverified material is not published as fact.',
    'document', 'date uncertain', '[DEMO] Sample period',
    null, null, 'UNKNOWN', 'metadata_only', 'DRAFT', 'UNVERIFIED', 'UNKNOWN', false
  ),
  (
    'sample-copyrighted-metadata-only',
    '[SAMPLE] Demo copyrighted, metadata-only record',
    'Illustrates COPYRIGHTED_METADATA_ONLY handling',
    'A fictional record standing in for a copyrighted book/photograph we do not have permission to re-host — demonstrating that only bibliographic metadata is stored, never the file itself.',
    'book', '2005 (fictional)', '[DEMO] Sample period',
    '[SAMPLE] Demo Bibliographic Record', 'See linked source record.',
    'COPYRIGHTED_METADATA_ONLY', 'metadata_only', 'PUBLISHED', 'DOCUMENTED', 'MEDIUM', false
  );

-- Link the documented demo record to the demo Festivals category, so the
-- Culture section has something to show.
insert into public.archive_item_culture_categories (archive_item_id, category_id)
select ai.id, cc.id
from public.archive_items ai, public.culture_categories cc
where ai.slug = 'sample-documented-record' and cc.slug = 'sample-festivals';

-- A demo historical event, linked to the demo place and demo person.
insert into public.historical_events (
  id, slug, title, description, date_display, location_id,
  evidence_type, confidence_level, verification_status
) values (
  '00000000-0000-0000-0004-000000000001',
  'sample-event',
  '[SAMPLE] Demo community gathering',
  'A fictional event used only to demonstrate the History section and the timeline''s handling of an uncertain date.',
  'date uncertain (demo record)',
  '00000000-0000-0000-0001-000000000001',
  'ORAL_TRADITION', 'LOW', 'PUBLISHED'
);

insert into public.event_people (event_id, person_id) values
  ('00000000-0000-0000-0004-000000000001', '00000000-0000-0000-0002-000000000001');

-- Link the demo event to a demo archive record, so the timeline's
-- "link to relevant archive records" behaviour has something to show.
insert into public.event_archive_items (event_id, archive_item_id)
select '00000000-0000-0000-0004-000000000001', ai.id
from public.archive_items ai
where ai.slug = 'sample-documented-record';

-- A second demo event with an actual date range (rather than only an
-- unparseable "date uncertain" string), so the timeline demonstrates
-- both uncertain dates and date ranges, and so it has more than one
-- entry to sort chronologically.
insert into public.historical_events (
  slug, title, description, date_from, date_to, date_display,
  evidence_type, confidence_level, verification_status
) values (
  'sample-event-range',
  '[SAMPLE] Demo period of change',
  'A fictional second event, given an actual date range rather than an exact date, to demonstrate how the timeline orders and displays uncertain/ranged dates.',
  '1920-01-01', '1935-12-31', 'c. 1920s–1930s (demo record)',
  'INTERPRETATION', 'MEDIUM', 'PUBLISHED'
);

-- A demo monarch entry (fictional name, clearly not a real Obi), showing
-- the reign_display pattern for an uncertain reign period.
insert into public.monarchs (
  id, slug, name, regnal_name, reign_display, biography,
  evidence_type, confidence_level, verification_status
) values (
  '00000000-0000-0000-0005-000000000001',
  'sample-obi',
  '[SAMPLE] Demo Obi',
  '[SAMPLE] Demo Obi I',
  'reign dates unknown (demo record)',
  'A fictional monarchy entry used only to demonstrate the Monarchy section''s layout. This is not a real Obi of Issele-Uku, living or historical.',
  'UNVERIFIED', 'UNKNOWN', 'PUBLISHED'
);

-- Two oral histories: one correctly withheld (no consent yet), one
-- correctly public (fully consented) — demonstrating the consent gate
-- from DECISIONS.md D-007 end-to-end.
insert into public.oral_histories (
  interviewee_person_id, interviewee_name, interviewer_name, recording_date,
  summary, topics, consent_status, publication_permission, transcription_status,
  verification_status, sensitivity_notes
) values
  (
    '00000000-0000-0000-0002-000000000001', '[SAMPLE] Demo Community Elder', '[DEMO] Interviewer',
    '2024-01-01', 'A fictional interview summary, recorded but awaiting consent — correctly NOT publicly visible yet.',
    array['demo'], 'REQUESTED', false, 'complete', 'PUBLISHED',
    'Demonstrates that PUBLISHED status alone does not make an oral history public without consent + publication_permission.'
  ),
  (
    '00000000-0000-0000-0002-000000000001', '[SAMPLE] Demo Community Elder (consented)', '[DEMO] Interviewer',
    '2024-01-01', 'A fictional interview summary with full consent and publication permission on file — correctly publicly visible.',
    array['demo'], 'GRANTED', true, 'complete', 'PUBLISHED',
    null
  );

-- A demo submission, showing what an incoming correction looks like in
-- the review queue (visible only to staff, per its RLS policy).
insert into public.submissions (
  submission_type, submitter_name, submitter_email, message,
  confirmed_ownership_or_permission, confirmed_understands_review
) values (
  'correction', '[DEMO] Test Submitter', 'demo@example.org',
  '[DEMO] Example correction: "The date on record X looks wrong, here is a source that suggests otherwise." This is placeholder text demonstrating the submissions queue.',
  true, true
);
