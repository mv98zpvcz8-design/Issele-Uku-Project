-- Public correction/material submissions (Phase 7 UI, schema now).
-- Submissions never write directly to content tables — a staff member
-- reviews a submission and, separately, edits the target record if they
-- agree. The two confirmation checkboxes required by the brief are
-- enforced as a database CHECK, not just a UI requirement, so a row
-- literally cannot exist without both being true.

create or replace function public.can_review()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('ADMIN', 'EDITOR', 'REVIEWER');
$$;

comment on function public.can_review() is
  'True for ADMIN/EDITOR/REVIEWER — staff who may triage the submissions queue.';

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  submission_type text not null,
  related_archive_item_id uuid references public.archive_items (id) on delete set null,
  submitter_name text,
  submitter_email text,
  message text not null,
  attached_storage_path text,
  confirmed_ownership_or_permission boolean not null,
  confirmed_understands_review boolean not null,
  review_status text not null default 'pending',
  reviewer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint submissions_confirmations_required check (
    confirmed_ownership_or_permission and confirmed_understands_review
  )
);

create index submissions_review_status_idx on public.submissions (review_status);

create trigger submissions_set_updated_at
  before update on public.submissions
  for each row execute function public.set_updated_at();

alter table public.submissions enable row level security;

-- Anyone (including an unauthenticated visitor) may submit a correction
-- or material offer, but can never read the queue back — this is a
-- write-only mailbox for the public, matching the brief's privacy intent.
create policy "submissions: anyone can submit"
  on public.submissions for insert
  with check (true);

create policy "submissions: staff can read all"
  on public.submissions for select
  using (public.is_staff());

create policy "submissions: reviewers can update"
  on public.submissions for update
  using (public.can_review());

create policy "submissions: editors can delete"
  on public.submissions for delete
  using (public.can_edit());
