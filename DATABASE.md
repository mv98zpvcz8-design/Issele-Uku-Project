# Database Design

**Status: proposed design, not yet implemented.** Actual SQL migrations,
Row Level Security policies, and seed data are built in Phase 2 (see
ROADMAP.md). This document is the design that Phase 2 implements against;
update it whenever the real migrations diverge from what's written here.

## Guiding principles

1. Evidence, confidence, and workflow status are columns, not conventions
   (DECISIONS.md D-005, D-006) — they can be queried, filtered, and
   enforced by RLS, not just displayed by a well-behaved UI.
2. Nothing is publicly visible by default. A row becomes public only when
   its status/consent/permission columns say so, and that's enforced by
   RLS, not by every page component remembering to check.
3. Oral history has an extra, independent consent gate on top of the
   normal content workflow (D-007) — being "published" is necessary but
   not sufficient for an interview to be public.
4. Copyrighted material is metadata-only unless permission is on file
   (D-008) — this is a column the admin UI must respect, not a policy
   enforced by hoping.

## Shared enums

```sql
create type content_status as enum (
  'DRAFT', 'RESEARCH', 'REVIEW', 'APPROVED', 'PUBLISHED', 'RESTRICTED'
);

create type evidence_type as enum (
  'DOCUMENTED', 'ORAL_TRADITION', 'INTERPRETATION', 'DISPUTED', 'UNVERIFIED'
);

create type confidence_level as enum ('HIGH', 'MEDIUM', 'LOW', 'UNKNOWN');

create type copyright_status as enum (
  'PUBLIC_DOMAIN', 'PERMISSION_GRANTED', 'COPYRIGHTED_METADATA_ONLY',
  'UNKNOWN', 'RESTRICTED'
);

create type user_role as enum ('ADMIN', 'EDITOR', 'RESEARCHER', 'REVIEWER');

create type consent_status as enum (
  'NOT_REQUESTED', 'REQUESTED', 'GRANTED', 'DECLINED', 'WITHDRAWN'
);
```

## Tables

### `profiles`
Extends `auth.users` (1:1) so we can attach a role without touching
Supabase's managed auth table.

| column | type | notes |
|---|---|---|
| id | uuid, PK, references auth.users(id) | |
| full_name | text | |
| role | user_role | default `RESEARCHER`; only an existing `ADMIN` can change this |
| created_at | timestamptz | |

### `sources`
A dedicated citation record, reusable across content types via join tables.

| column | type |
|---|---|
| id | uuid PK |
| title | text |
| author | text |
| publisher | text |
| publication_date | date, nullable (dates are often uncertain — see "Uncertain dates" below) |
| source_type | text (e.g. book, journal_article, archive_record, interview, newspaper, website) |
| url | text, nullable |
| isbn | text, nullable |
| archive_reference | text, nullable |
| citation | text — full formatted citation |
| reliability_notes | text, nullable |
| created_at, updated_at | timestamptz |

### `archive_items`
The core searchable archive record. Field list matches the brief directly.

| column | type |
|---|---|
| id | uuid PK |
| slug | text, unique |
| title, subtitle | text |
| description, abstract | text |
| record_type | text (photograph, document, book, newspaper_article, map, audio, oral_history_interview, video, letter, government_document, academic_research, festival_material, historical_object, external_reference) |
| date_exact | date, nullable |
| date_from, date_to | date, nullable (for ranges/uncertain dates) |
| date_display | text — human-readable date shown to visitors, e.g. "c. 1930s" (see below) |
| historical_period | text, nullable |
| creator, contributor | text, nullable |
| source_name, source_url, source_citation, source_type, source_repository | text, nullable |
| language | text, nullable |
| location | text, nullable |
| rights_holder | text, nullable |
| copyright_status | copyright_status, default `UNKNOWN` |
| publication_permission | boolean, default false |
| access_status | text (public, metadata_only, restricted) |
| verification_status | content_status, default `DRAFT` |
| evidence_type | evidence_type, default `UNVERIFIED` |
| confidence_level | confidence_level, default `UNKNOWN` |
| cultural_sensitivity | text, nullable — free-text note for reviewers |
| public_visibility | boolean, generated/derived — true only when verification_status = 'PUBLISHED' AND (copyright_status != 'RESTRICTED') |
| featured | boolean, default false |
| created_at, updated_at | timestamptz |

### `archive_media`
Supports "multiple media files" per archive item (1 item : many files).

| column | type |
|---|---|
| id | uuid PK |
| archive_item_id | uuid, references archive_items(id) |
| storage_path | text — Supabase Storage object path |
| media_type | text (image, audio, video, document) |
| caption | text, nullable |
| is_primary | boolean, default false |
| created_at | timestamptz |

Note: per COPYRIGHT_GUIDELINES.md, a row with `copyright_status =
'COPYRIGHTED_METADATA_ONLY'` should generally have **no** full-file
`archive_media` row (citation/description only), unless a separately
licensed thumbnail/cover is explicitly permitted.

### `people`

| column | type |
|---|---|
| id | uuid PK |
| slug | text, unique |
| name | text |
| alternative_names | text[] |
| titles | text[] |
| biography | text |
| birth_date, death_date | date, nullable |
| associated_locations | text[] |
| historical_period | text, nullable |
| image_media_id | uuid, references archive_media(id), nullable |
| verification_status | content_status, default `DRAFT` |
| public_visibility | boolean, derived from verification_status |
| created_at, updated_at | timestamptz |

`person_sources` join table: `(person_id, source_id)`.

### `places`

| column | type |
|---|---|
| id | uuid PK |
| slug | text, unique |
| name | text |
| alternative_names | text[] |
| category | text (quarter, market, palace, church, school, historical_site, other) |
| description | text |
| historical_significance | text, nullable |
| latitude, longitude | numeric, nullable — stored now, no map UI built yet (see ROADMAP future features) |
| verification_status | content_status, default `DRAFT` |
| public_visibility | boolean, derived |
| created_at, updated_at | timestamptz |

Join tables: `place_sources`, `place_people` (associated people),
`place_events` (associated events).

### `historical_events`

| column | type |
|---|---|
| id | uuid PK |
| slug | text, unique |
| title | text |
| description | text |
| date_exact | date, nullable |
| date_from, date_to | date, nullable |
| date_display | text |
| location_id | uuid, references places(id), nullable |
| evidence_type | evidence_type, default `UNVERIFIED` |
| confidence_level | confidence_level, default `UNKNOWN` |
| verification_status | content_status, default `DRAFT` |
| public_visibility | boolean, derived |
| created_at, updated_at | timestamptz |

Join tables: `event_people`, `event_sources`.

### `monarchs`

| column | type |
|---|---|
| id | uuid PK |
| slug | text, unique |
| name | text |
| regnal_name | text, nullable |
| reign_start, reign_end | date, nullable — nullable because exact reign dates may be unknown; `date_display` pattern applies here too via a `reign_display` text column |
| reign_display | text, nullable |
| predecessor_id, successor_id | uuid, self-referencing to monarchs(id), nullable |
| biography | text |
| evidence_type | evidence_type, default `UNVERIFIED` |
| confidence_level | confidence_level, default `UNKNOWN` |
| verification_status | content_status, default `DRAFT` |
| public_visibility | boolean, derived |
| created_at, updated_at | timestamptz |

Join tables: `monarch_sources`, `monarch_events` (major events).

### `oral_histories`

| column | type |
|---|---|
| id | uuid PK |
| interviewee_person_id | uuid, references people(id), nullable (interviewee may not have a public Person page) |
| interviewee_name | text — always stored directly, independent of a Person link |
| interviewer_name | text |
| recording_date | date, nullable |
| location | text, nullable |
| audio_storage_path, video_storage_path | text, nullable |
| transcript | text, nullable |
| summary | text, nullable |
| topics | text[] |
| language | text, nullable |
| consent_status | consent_status, default `NOT_REQUESTED` |
| publication_permission | boolean, default false |
| restricted_sections | jsonb, nullable — structured markers for transcript sections excluded from public view |
| sensitivity_notes | text, nullable |
| transcription_status | text (not_started, in_progress, complete), default `not_started` |
| verification_status | content_status, default `DRAFT` |
| public_visibility | boolean, generated — true only if `verification_status = 'PUBLISHED' AND consent_status = 'GRANTED' AND publication_permission = true` (D-007) |
| created_at, updated_at | timestamptz |

### `submissions`
Covers both "corrections" and "material offered for review" (Phase 7).

| column | type |
|---|---|
| id | uuid PK |
| submission_type | text (correction, source_suggestion, copyright_concern, person_identification, new_material) |
| related_archive_item_id | uuid, nullable |
| submitter_name, submitter_email | text, nullable |
| message | text |
| attached_storage_path | text, nullable |
| confirmed_ownership_or_permission | boolean, required true to submit |
| confirmed_understands_review | boolean, required true to submit |
| review_status | text (pending, accepted, rejected, needs_more_info), default `pending` |
| reviewer_notes | text, nullable |
| created_at, updated_at | timestamptz |

Submissions never write directly to public content tables — an admin
reviews a submission and, separately, edits the target record if they
agree (D- rule: "Do not directly modify published content based on user
submissions").

## Row Level Security (implemented in Phase 2)

Pattern applied to every content table:

```sql
-- Public read: only rows that are actually publishable
create policy "public read published"
  on archive_items for select
  using (verification_status = 'PUBLISHED' and copyright_status != 'RESTRICTED');

-- Authenticated staff read: any row, for admin/editor/researcher/reviewer
create policy "staff read all"
  on archive_items for select
  using (auth.uid() in (select id from profiles));

-- Writes: editors and admins only (checked against profiles.role)
create policy "editors write"
  on archive_items for insert, update, delete
  using (exists (
    select 1 from profiles
    where id = auth.uid() and role in ('ADMIN', 'EDITOR')
  ));
```

`oral_histories` gets a stricter public-read policy reflecting D-007's
extra gate, and a `restricted_sections`-aware view (or column-level
redaction in the query layer) so a partially-restricted transcript never
serves its restricted portion to the public role.

## Uncertain and range dates

Rather than forcing every historical date into a single `date` column
(which would falsely imply precision we don't have), date-bearing tables
use three columns: `date_exact` (when a precise date is known),
`date_from`/`date_to` (for a known range or margin of uncertainty), and
`date_display` (the human-readable string actually shown to visitors,
e.g. "c. 1897", "1920s", "before 1950"). The timeline (Phase 5) sorts by
`date_from`/`date_exact` but always renders `date_display`.

## Export / data portability

Every table above is designed to export cleanly to JSON (via
`supabase db dump` / direct SQL `COPY ... TO STDOUT WITH CSV/JSON`) and to
CSV for the flat, non-array-typed tables. Detailed export commands are
documented in DEPLOYMENT.md once the schema exists.
