-- Oral history has a stricter, independent gate on top of the normal
-- content workflow (DECISIONS.md D-007): a recording/transcript existing,
-- or even verification_status being PUBLISHED, is not sufficient for
-- public visibility. Consent and publication_permission must ALSO hold.
--
-- `restricted_sections` marks parts of a transcript to exclude even when
-- the rest is public. RLS is row-level, so it cannot redact part of a
-- transcript by itself — that redaction happens in the public-facing
-- query/view layer built in a later phase (see DATABASE.md). This
-- migration only enforces the all-or-nothing row-level gate.

create table public.oral_histories (
  id uuid primary key default gen_random_uuid(),
  interviewee_person_id uuid references public.people (id) on delete set null,
  interviewee_name text not null,
  interviewer_name text,
  recording_date date,
  location text,
  audio_storage_path text,
  video_storage_path text,
  transcript text,
  summary text,
  topics text[] not null default '{}',
  language text,
  consent_status consent_status not null default 'NOT_REQUESTED',
  publication_permission boolean not null default false,
  restricted_sections jsonb,
  sensitivity_notes text,
  transcription_status text not null default 'not_started',
  verification_status content_status not null default 'DRAFT',
  public_visibility boolean generated always as (
    verification_status = 'PUBLISHED'
    and consent_status = 'GRANTED'
    and publication_permission = true
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index oral_histories_verification_status_idx on public.oral_histories (verification_status);
create index oral_histories_interviewee_person_id_idx on public.oral_histories (interviewee_person_id);

create trigger oral_histories_set_updated_at
  before update on public.oral_histories
  for each row execute function public.set_updated_at();

alter table public.oral_histories enable row level security;

create policy "oral_histories: public can read only fully consented+published"
  on public.oral_histories for select
  using (public_visibility);

create policy "oral_histories: staff can read all"
  on public.oral_histories for select
  using (public.is_staff());

create policy "oral_histories: editors can write"
  on public.oral_histories for insert
  with check (public.can_edit());

create policy "oral_histories: editors can update"
  on public.oral_histories for update
  using (public.can_edit());

create policy "oral_histories: editors can delete"
  on public.oral_histories for delete
  using (public.can_edit());
