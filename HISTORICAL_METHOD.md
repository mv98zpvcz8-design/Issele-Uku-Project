# Historical Method

How this project classifies and presents historical claims. This is the
reference for both the database schema (DATABASE.md) and the editorial
rules (CONTENT_GUIDELINES.md).

## Evidence types

| Type | Meaning | Public presentation |
|---|---|---|
| `DOCUMENTED` | Supported by documentary, archival, academic, or otherwise verifiable sources. | Shown with its citation(s) directly. |
| `ORAL_TRADITION` | Based primarily on oral history, community tradition, or inherited accounts. | Shown with an "Oral tradition" label — never merged visually with documented fact. |
| `INTERPRETATION` | A scholarly or editorial conclusion drawn from evidence, rather than a directly documented fact itself. | Labelled "Interpretation," attributed to whoever drew the conclusion where known. |
| `DISPUTED` | Multiple conflicting historical accounts exist. | Multiple accounts shown, each with its own evidence type, rather than the site picking a winner. |
| `UNVERIFIED` | Currently recorded but not yet sufficiently verified for publication as fact. | Labelled clearly; not published as settled fact, and generally not `PUBLISHED` status until reviewed. |

**Oral tradition is not suppressed for being undocumented** — it is
labelled. Suppressing it would erase a legitimate and often primary
source of Issele-Uku history; presenting it as documented fact would
misrepresent its nature. Labelling is the resolution.

## Confidence levels

| Level | Meaning |
|---|---|
| `HIGH` | Strong, consistent, well-attested evidence. |
| `MEDIUM` | Reasonable evidence with some gaps or a single source. |
| `LOW` | Thin, indirect, or contested evidence. |
| `UNKNOWN` | Not yet assessed. |

**Confidence describes the evidence, not cultural importance.** A
widely-cherished tradition with thin documentary evidence gets `LOW` or
`UNKNOWN` confidence and is still presented respectfully as oral
tradition — confidence level is not a judgment of value.

## Content workflow

`DRAFT → RESEARCH → REVIEW → APPROVED → PUBLISHED`, with a parallel
`RESTRICTED` state reachable from any point (e.g. a published item later
flagged as sensitive). Nothing skips straight to `PUBLISHED` on creation.
See DATABASE.md for how this is enforced at the RLS level, and
ADMIN_GUIDE.md for how an administrator moves an item through it.

## Sources

Every `DOCUMENTED` or `INTERPRETATION` claim should link to a `sources`
record (title, author, publisher, citation, etc. — DATABASE.md). Where a
source is a book or document we don't have rights to re-host, we store
the bibliographic record and citation only (COPYRIGHT_GUIDELINES.md), not
the file.

## What this project will never do

- State a specific date, name, or event as fact without a source or an
  explicit `ORAL_TRADITION`/`UNVERIFIED` label.
- Fabricate a citation, quotation, or archive reference to fill a gap.
- Silently resolve a historical dispute by picking one account and
  discarding the others.
- Treat "commonly believed" as equivalent to "documented."
