-- Many-to-many cross-references between content types. Each is a plain
-- composite-key join table. Read visibility follows the non-source side's
-- public_visibility (sources are always publicly readable on their own,
-- per 20260828120300_sources.sql); write access is editors/admins only.

create table public.person_sources (
  person_id uuid not null references public.people (id) on delete cascade,
  source_id uuid not null references public.sources (id) on delete cascade,
  primary key (person_id, source_id)
);

create table public.place_sources (
  place_id uuid not null references public.places (id) on delete cascade,
  source_id uuid not null references public.sources (id) on delete cascade,
  primary key (place_id, source_id)
);

create table public.place_people (
  place_id uuid not null references public.places (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  primary key (place_id, person_id)
);

create table public.place_events (
  place_id uuid not null references public.places (id) on delete cascade,
  event_id uuid not null references public.historical_events (id) on delete cascade,
  primary key (place_id, event_id)
);

create table public.event_people (
  event_id uuid not null references public.historical_events (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  primary key (event_id, person_id)
);

create table public.event_sources (
  event_id uuid not null references public.historical_events (id) on delete cascade,
  source_id uuid not null references public.sources (id) on delete cascade,
  primary key (event_id, source_id)
);

create table public.monarch_sources (
  monarch_id uuid not null references public.monarchs (id) on delete cascade,
  source_id uuid not null references public.sources (id) on delete cascade,
  primary key (monarch_id, source_id)
);

create table public.monarch_events (
  monarch_id uuid not null references public.monarchs (id) on delete cascade,
  event_id uuid not null references public.historical_events (id) on delete cascade,
  primary key (monarch_id, event_id)
);

alter table public.person_sources enable row level security;
alter table public.place_sources enable row level security;
alter table public.place_people enable row level security;
alter table public.place_events enable row level security;
alter table public.event_people enable row level security;
alter table public.event_sources enable row level security;
alter table public.monarch_sources enable row level security;
alter table public.monarch_events enable row level security;

create policy "person_sources: public can read for published people"
  on public.person_sources for select
  using (exists (select 1 from public.people p where p.id = person_id and p.public_visibility));
create policy "person_sources: staff can read all"
  on public.person_sources for select using (public.is_staff());
create policy "person_sources: editors can write"
  on public.person_sources for insert with check (public.can_edit());
create policy "person_sources: editors can delete"
  on public.person_sources for delete using (public.can_edit());

create policy "place_sources: public can read for published places"
  on public.place_sources for select
  using (exists (select 1 from public.places pl where pl.id = place_id and pl.public_visibility));
create policy "place_sources: staff can read all"
  on public.place_sources for select using (public.is_staff());
create policy "place_sources: editors can write"
  on public.place_sources for insert with check (public.can_edit());
create policy "place_sources: editors can delete"
  on public.place_sources for delete using (public.can_edit());

create policy "place_people: public can read for published places"
  on public.place_people for select
  using (
    exists (select 1 from public.places pl where pl.id = place_id and pl.public_visibility)
    and exists (select 1 from public.people p where p.id = person_id and p.public_visibility)
  );
create policy "place_people: staff can read all"
  on public.place_people for select using (public.is_staff());
create policy "place_people: editors can write"
  on public.place_people for insert with check (public.can_edit());
create policy "place_people: editors can delete"
  on public.place_people for delete using (public.can_edit());

create policy "place_events: public can read for published rows"
  on public.place_events for select
  using (
    exists (select 1 from public.places pl where pl.id = place_id and pl.public_visibility)
    and exists (select 1 from public.historical_events e where e.id = event_id and e.public_visibility)
  );
create policy "place_events: staff can read all"
  on public.place_events for select using (public.is_staff());
create policy "place_events: editors can write"
  on public.place_events for insert with check (public.can_edit());
create policy "place_events: editors can delete"
  on public.place_events for delete using (public.can_edit());

create policy "event_people: public can read for published rows"
  on public.event_people for select
  using (
    exists (select 1 from public.historical_events e where e.id = event_id and e.public_visibility)
    and exists (select 1 from public.people p where p.id = person_id and p.public_visibility)
  );
create policy "event_people: staff can read all"
  on public.event_people for select using (public.is_staff());
create policy "event_people: editors can write"
  on public.event_people for insert with check (public.can_edit());
create policy "event_people: editors can delete"
  on public.event_people for delete using (public.can_edit());

create policy "event_sources: public can read for published events"
  on public.event_sources for select
  using (exists (select 1 from public.historical_events e where e.id = event_id and e.public_visibility));
create policy "event_sources: staff can read all"
  on public.event_sources for select using (public.is_staff());
create policy "event_sources: editors can write"
  on public.event_sources for insert with check (public.can_edit());
create policy "event_sources: editors can delete"
  on public.event_sources for delete using (public.can_edit());

create policy "monarch_sources: public can read for published monarchs"
  on public.monarch_sources for select
  using (exists (select 1 from public.monarchs m where m.id = monarch_id and m.public_visibility));
create policy "monarch_sources: staff can read all"
  on public.monarch_sources for select using (public.is_staff());
create policy "monarch_sources: editors can write"
  on public.monarch_sources for insert with check (public.can_edit());
create policy "monarch_sources: editors can delete"
  on public.monarch_sources for delete using (public.can_edit());

create policy "monarch_events: public can read for published rows"
  on public.monarch_events for select
  using (
    exists (select 1 from public.monarchs m where m.id = monarch_id and m.public_visibility)
    and exists (select 1 from public.historical_events e where e.id = event_id and e.public_visibility)
  );
create policy "monarch_events: staff can read all"
  on public.monarch_events for select using (public.is_staff());
create policy "monarch_events: editors can write"
  on public.monarch_events for insert with check (public.can_edit());
create policy "monarch_events: editors can delete"
  on public.monarch_events for delete using (public.can_edit());
