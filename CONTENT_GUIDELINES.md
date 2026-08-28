# Content Guidelines

These rules apply to anyone adding content to the archive — developer or
administrator — and to Claude Code when generating placeholder/demo data.

## Hard rules

1. **Never invent historical facts, dates, names, quotations, or
   citations.** If real, sourced content isn't available yet, use
   structured placeholder copy: "Research pending" or "Historical account
   requires verification." Never fill a gap with a plausible-sounding
   guess.
2. **Every historical claim carries an evidence type and a confidence
   level** (see HISTORICAL_METHOD.md). A claim without either is not
   ready to publish.
3. **No historical narrative is presented as universally agreed.** Where
   accounts differ, represent more than one, and mark the claim
   `DISPUTED` where appropriate.
4. **No implied endorsement.** Do not use "Official," "Royal Archive,"
   "Palace Archive," or similar wording anywhere on the site unless
   explicit written confirmation of endorsement has been given and
   recorded in DECISIONS.md.
5. **Test/demo data must be unmistakably fake.** Prefix titles with
   `[SAMPLE]` or `[DEMO]`, and give it `evidence_type = UNVERIFIED`.
   Nothing in a seed file should be readable as real Issele-Uku history.
6. **No personal information about living private individuals** is
   published without appropriate care — err toward omission or a
   `RESTRICTED` status rather than guessing at someone's wishes.
7. **No re-hosted copyrighted files** without permission on file — see
   COPYRIGHT_GUIDELINES.md.

## Writing tone

Serious, archival, plain. Avoid promotional language ("amazing,"
"vibrant," "must-see"). Prefer precise, checkable statements. When in
doubt, write less rather than pad with unverifiable color.

## Placeholder copy patterns

Use these consistently rather than inventing new phrasing per page:

- Section not yet populated: "Research pending."
- A specific field unknown: "Not yet documented."
- A date that can't be pinned down: use `date_display` values like "c.
  1930s" or "date uncertain" rather than leaving the field blank or
  guessing a specific year.

## Review before publish

Nothing reaches `PUBLISHED` status without: a stated source (or an
explicit `ORAL_TRADITION`/`UNVERIFIED` label if none exists), a confidence
level, and — for anything touching a living person or an oral history
recording — a consent/sensitivity check per HISTORICAL_METHOD.md and the
Oral History rules in DATABASE.md.
