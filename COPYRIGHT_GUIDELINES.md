# Copyright Guidelines

## Core rule

**Finding something online does not mean we may re-host it.** Every
archive item has a `copyright_status` (see DATABASE.md) that governs what
we're allowed to store and show.

| Status | What we store | What we show publicly |
|---|---|---|
| `PUBLIC_DOMAIN` | The file itself. | The file, with a note on why it's public domain (age, jurisdiction, explicit dedication). |
| `PERMISSION_GRANTED` | The file itself, plus a record of who granted permission and on what terms. | The file, credited per the terms of permission. |
| `COPYRIGHTED_METADATA_ONLY` | Bibliographic information, description, citation, and an external link **only if legally appropriate**. Never the full file. | Citation + description + (optional) external link. No embedded viewer, no download of the work itself. |
| `UNKNOWN` | Whatever metadata we have. | Treated as `COPYRIGHTED_METADATA_ONLY` until resolved — never treat unknown rights as permission. |
| `RESTRICTED` | Metadata may be limited too, per the restriction. | Nothing, or a note that the record exists but is restricted, depending on the reason for restriction. |

## Practical rules for admins

- When adding a book, newspaper article, photograph, or recording found
  online or in a physical archive: if you don't have explicit permission
  from the rights holder, set `copyright_status` to
  `COPYRIGHTED_METADATA_ONLY` and do **not** upload the full file to
  Storage — only bibliographic fields and, if legally appropriate, a link
  to where it can be legally accessed elsewhere.
- "I found a PDF of this book" is not permission. Permission means the
  rights holder (author, publisher, estate, photographer, or their
  designated representative) has said yes, ideally in writing, recorded
  in the `rights_holder` field and referenced in admin notes.
- Family-owned or community-owned photographs and recordings still need a
  stated basis for hosting (family/community consent) — treat oral
  history's consent rules (below) as the model even for photographs of
  identifiable living people.
- When rights status is genuinely unclear after reasonable effort, use
  `UNKNOWN` rather than guessing `PUBLIC_DOMAIN`. `UNKNOWN` is treated the
  same as metadata-only for public display, so this is the safe default.

## Oral history and consent

Oral history has its own, stricter gate (see DATABASE.md `oral_histories`
and DECISIONS.md D-007): recording a file does not make it public. An
interview is only publicly visible when its `consent_status = GRANTED`
and `publication_permission = true`, in addition to being `PUBLISHED`.
Partial restriction (`restricted_sections`) lets a family or interviewee
allow most of an interview to be public while keeping specific sections
private.

## If you're unsure

Default to the more restrictive option (`COPYRIGHTED_METADATA_ONLY` /
`UNKNOWN` / not publishing) and flag the item for a human copyright
decision rather than guessing. This is one of the categories of decision
Claude Code is instructed to escalate to the project owner rather than
resolve unilaterally.
