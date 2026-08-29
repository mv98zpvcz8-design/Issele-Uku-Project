# Roadmap — Oligbo Digital Archive

Working name only; branding is designed to be changed without a rebuild (see DECISIONS.md).

Status legend: ✅ done · 🚧 in progress · ⏳ not started

## Phase 0 — Initial Audit
✅ Repository inspected (empty, no prior work). ROADMAP.md and DECISIONS.md created. Domain model and information architecture proposed.

## Phase 1 — Foundation
✅ Next.js (App Router) + TypeScript (strict) + Tailwind CSS v4 set up. Design system tokens (paper/ink archival palette, verified WCAG AA+ contrast, evidence-type colors reserved for Phase 3). Self-hosted fonts (Newsreader display + Source Sans 3 body). Header (desktop + mobile nav), footer, and a permanent independence/status banner. Homepage with hero, section grid, and status statement. Stub pages for every planned route (history, monarchy, culture, people, places, archive, research-library, timeline, submit) using a shared "Research pending" placeholder pattern — never inventing content. Full `/transparency`, `/privacy`, `/contact` pages written. Restrained, CSS-only motion (hero entrance, scroll reveal, hover micro-interactions), added after explicit user calibration — see DECISIONS.md D-014. `robots`/indexing blocked by default until a deliberate decision to go public (D-012). `.env.example` documents Phase 2's variables without requiring any yet. All of README/ARCHITECTURE/DATABASE (design)/CONTENT_GUIDELINES/HISTORICAL_METHOD/COPYRIGHT_GUIDELINES/DEPLOYMENT/ADMIN_GUIDE written. Verified: `next build`, `eslint`, `tsc --noEmit` all clean; every route returns 200 (404 page verified separately); desktop + mobile screenshots reviewed; link audit found no broken internal links.

## Phase 2 — Database
✅ Full schema implemented as 13 version-controlled SQL migrations (`supabase/migrations/`) covering profiles/roles, sources, places, archive_items + archive_media, people, historical_events, monarchs, 8 join/cross-reference tables, oral_histories, and submissions — plus `supabase/seed.sql` demo data (all `[SAMPLE]`/`[DEMO]`-labelled, spanning every evidence type, a DRAFT item, and both a withheld and a fully-consented oral history). Row Level Security implemented via generated `public_visibility` columns (D-015) and three `SECURITY DEFINER` helper functions (D-016) — validated with 13 functional tests against a real local Postgres instance (not just read for syntax): anonymous visitors correctly see only published/consented rows, cannot write, can submit a correction but never read the queue back, and a two-confirmation CHECK constraint genuinely blocks an incomplete submission; staff roles are correctly gated (researcher = read-all/write-none, editor = read+write, self role-escalation blocked by trigger). Supabase client scaffolding added (`src/lib/supabase/{types,browser,server,service-role}.ts`) using the official `@supabase/supabase-js` + `@supabase/ssr` packages; not yet wired into any page (that's Phase 3). No live Supabase project connected yet — see DEPLOYMENT.md for exactly what's needed from the project owner to connect one; nothing blocks continuing to Phase 3 in the meantime since pages will be built against the same schema.

## Phase 3 — Public Archive
✅ Archive listing (`/archive`) with search (title/subtitle/description/abstract/source_name via a PostgREST `.or()` filter, with a unit-tested escaping helper so a comma/period/parenthesis in a search term can't inject an extra filter condition — see D-020's neighbor bug class), filters (record type, evidence type, historical period, location, sort), and pagination — implemented as a plain GET `<form>` so filtering needs no client JavaScript and every result is a shareable/bookmarkable URL. Archive detail pages (`/archive/[slug]`) with full metadata, source citation, and a copyright-aware rights notice matching COPYRIGHT_GUIDELINES.md exactly. `EvidenceBadge`/`ConfidenceLabel`/`CopyrightNotice` components reused wherever evidence needs to be shown (Phase 4 will reuse them for people/places/events/monarchs). RLS (not app code) is what actually restricts visibility, per ARCHITECTURE.md's design. Both pages handle three distinct states honestly: no Supabase configured yet (current real state — verified against the running dev server), a real query error, and zero results — never a raw crash or a misleading empty screen. Verified: `next build`/`eslint`/`tsc --noEmit` clean; 14 `node:test` cases for the search/filter logic; manually verified against a running dev server including the unreachable-database error path; desktop + mobile screenshots reviewed. Along the way, fixed a real Supabase TypeScript-generics gotcha (D-020) that was silently turning every query's row type into `never`.

## Phase 4 — Core Content
✅ History (`/history` + `/history/[slug]`), Monarchy (`/monarchy` + `/monarchy/[slug]`, with predecessor/successor navigation), Culture (`/culture` + `/culture/[slug]`, backed by a new `culture_categories` table so new categories never need a migration — see D-021), People (`/people` + `/people/[slug]`), Places (`/places` + `/places/[slug]`, with associated-people/associated-events cross-links), and Research Library (`/research-library` + `/research-library/[slug]`, showing each entry's full-text/external/metadata-only/restricted access status per the brief). All reuse the `EvidenceBadge`/`ConfidenceLabel`/`StateNotice` components from Phase 3. Along the way, gave `sources` a real publish workflow (it was previously always-public the instant a row existed — a real gap now that the Research Library makes sources primary, browsable content, not just an attached citation) — see D-021. Cross-page citations now link through to the source's own Research Library page rather than showing as unlinked text (caught in the five-perspective audit). Every related-item lookup (people on an event, sources on a place, etc.) goes through separate, RLS-respecting queries rather than a PostgREST nested embed, since the embed syntax couldn't be verified against a live project. Verified: full migration+seed chain re-validated locally (including new RLS checks proving a draft source/category is correctly invisible to the public role and an anonymous insert is rejected); `next build`/`eslint`/`node:test` all clean; all 12 new routes manually checked against a running dev server; screenshots reviewed.

## Phase 5 — Timeline
✅ `/timeline`: a vertical, dot-marker timeline (deliberately not a horizontal scrubber — simpler, more robust on mobile, no JS animation needed) of `historical_events`, each showing its date display, evidence badge, description excerpt, and links to its place/people/relevant archive records. Supports uncertain dates and ranges via `date_display`. Filterable by free-text search and evidence type via a plain GET form (no JS, shareable URLs — same pattern as Archive's filters). A new `event_archive_items` join table was added first, since nothing previously connected events to archive records despite the brief asking for that link. Extracted the PostgREST search-escaping logic (previously only in `archive/search.ts`) into a shared `src/lib/postgrest.ts` so the timeline's search reuses the same vetted, tested escaping rather than a second copy. Verified: new migration validated against local Postgres (RLS + visibility); layout verified against real mock data via a temporary preview route (deleted before commit) on both desktop and mobile; full build/lint/test clean.

**Two real bugs found and fixed during the five-perspective audit, not just this feature's own code:**
- A chronological-sort bug affecting both `/timeline` and the existing `/history` listing (from Phase 4): PostgREST's `.order('date_from').order('date_exact')` can't express "use whichever is set," so an event with only `date_exact` populated would incorrectly sort after every event with any `date_from`, however much later. Fixed with a client-side, unit-tested coalescing sort (`lib/timeline/sort.ts`) — see DECISIONS.md D-022.
- The `test` npm script's glob was unquoted, so shell expansion (not Node's own correct recursive matching) was silently deciding which test files actually ran — it had been passing only by accident. Fixed by quoting it, which surfaced two further `@/`-alias-under-plain-Node import errors, also fixed (D-023).

## Phase 6 — Admin
⏳ Supabase Auth-based admin authentication. Role architecture (ADMIN/EDITOR/RESEARCHER/REVIEWER) — simple initially, structured for growth. CRUD for archive records, sources, events, people, places, monarchs. Draft/preview/publish/unpublish workflow. Verification and sensitivity flags.

## Phase 7 — Submissions
⏳ Public correction-submission form and material-submission form. Submissions land in a review queue; nothing publishes automatically. **Two known gaps flagged during the Phase 2 security-reviewer audit, to close here, not before:** (1) the `submissions` INSERT policy is intentionally open to anyone (it's a public form with no accounts), which also means it has no rate-limiting at the database level — the form itself needs abuse protection (e.g. a lightweight bot-check) before launch. (2) `attached_storage_path` is a plain text column with no constraint on what path a submitter can name — file uploads must go through a server action that generates the storage path itself (e.g. namespaced by a fresh UUID) rather than trusting a client-supplied path, plus a dedicated Storage bucket policy restricting public uploads to that pattern.

## Phase 8 — Quality
⏳ Accessibility pass (WCAG 2.1 AA where practical), responsiveness pass, performance review, security review, TypeScript/lint checks, tests for critical logic.

## Phase 9 — Deployment
⏳ Vercel deployment configuration and documentation. Supabase project setup instructions. Backup/export strategy documented.

## Phase 10 — Pre-Palace Review
⏳ PRE_PALACE_REVIEW.md checklist completed and verified before any stakeholder demo.

---

## Explicitly out of scope for MVP (architected for later, not built)
- Payments / donations / investment functionality
- Diaspora professional directory
- Community business directory
- Enuani language archive
- Interactive maps
- Tourism portal
- Infrastructure project dashboard / community development fund
- Annual impact reporting
- Membership system
- Crowdsourced archive submissions (beyond the basic review-queue form in Phase 7)
- Mobile app

## Open items requiring human input later
- Real historical content, sources, and citations for Issele-Uku (none will be invented)
- Final branding/name decision
- Supabase project credentials (to be provided via environment variables, never committed)
- Domain name for deployment
