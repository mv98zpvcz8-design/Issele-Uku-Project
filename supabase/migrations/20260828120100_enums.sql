-- Closed-vocabulary enums for the historical-evidence and workflow model
-- (see DATABASE.md and DECISIONS.md D-005/D-006). These are intentionally
-- real Postgres enums, not admin-editable lookup tables: the whole point
-- is that this vocabulary is fixed and enforced by the database, not a
-- UI convention that could drift. Fields that ARE meant to be freely
-- extended by a non-technical admin later (culture categories, record
-- types, place categories, etc.) are plain `text` columns instead — see
-- the tables that use them.

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
