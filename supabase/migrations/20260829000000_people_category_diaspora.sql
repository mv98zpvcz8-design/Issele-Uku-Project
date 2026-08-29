-- Widen "People" beyond biography subjects with a fixed birth/death window
-- to also cover: notable diaspora figures who now live elsewhere, people
-- still living locally today, and people who are only mentioned within a
-- story/event/source rather than having their own dedicated research yet.
-- `person_category` is free text with a check constraint (matching the
-- existing convention for constrained-but-not-enum fields such as
-- submission status), not a Postgres enum, since this is a lighter-weight
-- classification than evidence_type/confidence_level and more likely to
-- gain a new category later.
alter table public.people
  add column person_category text not null default 'historical'
    check (person_category in ('historical', 'notable_diaspora', 'contemporary_local', 'mentioned')),
  add column current_residence text;

comment on column public.people.person_category is
  'historical: primarily known from the past. notable_diaspora: originally from Issele-Uku, notable, now based elsewhere. contemporary_local: notable and currently resident locally. mentioned: appears in a story/event/source but does not yet have dedicated research of their own.';
comment on column public.people.current_residence is
  'Free-text current location (e.g. a diaspora city/country), most relevant for notable_diaspora and contemporary_local.';
