# Decision Log — Oligbo Digital Archive

Each entry records a meaningful technical or product decision: what was decided, why, what alternatives were considered, and the consequences. Newest entries at the top.

---

## D-023 — Shared lib modules use relative imports + explicit `.ts`, not the `@/` alias
**Decision:** Modules under `src/lib/**` that have a `.test.ts` counterpart (currently `archive/search.ts`, `timeline/search.ts`, `postgrest.ts`) import each other with relative paths and explicit `.ts` extensions (e.g. `../postgrest.ts`), never the `@/` tsconfig path alias. `tsconfig.json`'s `allowImportingTsExtensions` (already present, since `noEmit: true` is set) keeps this valid for `tsc`/Next's type-checking.
**Reason:** Found while adding `src/lib/timeline/search.ts`: it and `archive/search.ts` need a real (not type-only) import of `buildOrSearchFilter` from the new shared `src/lib/postgrest.ts`. The `@/` alias is a tsconfig/Next-bundler-only convention — plain `node --experimental-strip-types --test` (used to run `*.test.ts` directly, D-010's "no test framework needed") has no knowledge of it and fails with `ERR_MODULE_NOT_FOUND`. Node's own ESM resolution also requires explicit extensions for relative specifiers, which is why `.ts` must be written out.
**Alternatives considered:** A Node loader/tsconfig-paths hook to resolve `@/` under the test runner (rejected — adds a dependency and configuration surface for a project that deliberately has neither, per D-010, just to avoid writing `../`). Keeping the shared logic un-refactored/duplicated instead of extracting `postgrest.ts` (rejected — see D-021's neighbor reasoning on reuse; duplicating the security-sensitive escaping logic was the actual alternative on the table and is worse).
**Consequences:** Same fix applies to any future `lib` module that both (a) has unit tests and (b) needs to import another `lib` module at runtime (not just for types). Page/component files under `src/app` and `src/components` are unaffected and keep using `@/` normally, since nothing imports them from a `node --test` context.

Also while running this check: fixed `package.json`'s `test` script, which passed the glob `src/**/*.test.ts` **unquoted** — the interactive shell's non-recursive `**` handling had been silently expanding it to only the shallowest matching file (or, when nothing matched at all, leaving it as a literal string that Node's own recursive glob then handled correctly by accident). Quoting it (`'src/**/*.test.ts'`) forces Node's own test-file discovery to always do the (correct, recursive) matching, rather than depending on which shell happens to run the script and how many test files exist at which depth.

## D-022 — Timeline/History chronological sort is client-side, not `.order()`
**Decision:** `historical_events` gets no new "effective date" column. Instead, `src/lib/timeline/sort.ts` exports a pure `sortEventsChronologically()` that coalesces `date_from ?? date_exact` and sorts the already-fetched array; the Timeline and History listing pages use this instead of chaining `.order('date_from').order('date_exact')`.
**Reason:** Found during the Phase 5 five-perspective audit (historian/archivist lens): PostgREST's `.order()` calls are independent sort levels, not a fallback chain. `ORDER BY date_from NULLS LAST, date_exact NULLS LAST` groups every row with `date_from IS NULL` together — including ones that DO have a `date_exact` — and only sorts *within* that group by `date_exact`. An event with only `date_exact = '1800-01-01'` set would sort after an event with `date_from = '1990-01-01'`, which is chronologically backwards. Neither page paginates, so fetching everything and sorting in application code is cheap and correct.
**Alternatives considered:** A generated `sort_date date generated always as (coalesce(date_from, date_exact)) stored` column, matching the `public_visibility` pattern (D-015) — rejected for now as a schema change for what is purely a display-ordering concern, not a data-integrity one; worth revisiting if the timeline ever needs server-side pagination (at which point sorting must happen in SQL, and this column would become the right fix).
**Consequences:** The sort function is unit-tested (`sort.test.ts`) directly, including the exact bug scenario (a `date_exact`-only event against a `date_from` event) as a regression test. Any future page that lists `historical_events` chronologically must use this helper rather than reinventing `.order()` calls — flagged here so it isn't missed.

## D-021 — `sources` gets a publish workflow; `culture_categories` is a real table, not a tag
**Decision:** Two schema changes made while building Phase 4. First, `sources` gains `slug`, `access_status`, `verification_status`, and a generated `public_visibility` column, with its RLS policy changed from "public can read all sources" to "public can read published sources" (staff still read all). Second, a new `culture_categories` table (with the same evidence/workflow columns as every other content table) plus an `archive_item_culture_categories` join table, rather than modeling Culture as a fixed enum or a tag on `archive_items`.
**Reason:** (1) The original `sources` design (DATABASE.md, D-016's neighboring reasoning) assumed a source only ever appears as a citation attached to other already-reviewed content, where "citations aren't sensitive" justified being always-public. Phase 4's Research Library makes `sources` directly browsable primary content in its own right, so a newly-created source needs to be draftable/stageable like everything else — otherwise an admin's in-progress bibliography entry would be public the instant they hit save. (2) The brief has no fixed list for culture categories and explicitly says new ones should be addable later; each category also needs its own description, sourcing, and evidence type, which makes it a content type, not a label — a real table is a better fit than extending `record_type`'s free-text pattern (D-017) or forcing a closed enum.
**Alternatives considered:** Leaving `sources` always-public and just not exposing unfinished ones in the UI (rejected — relying on application code to hide a database-visible row contradicts the project's whole RLS-is-the-enforcement-point architecture, D-004/ARCHITECTURE.md). A `culture` enum (rejected — brief explicitly wants runtime extensibility, which an enum doesn't give without a migration). Tagging `archive_items.record_type` with culture values (rejected — conflates "what kind of media is this" with "what cultural topic does it relate to," and a photograph can relate to more than one culture topic, which a single text column can't express).
**Consequences:** Existing seed data updated to give every source a slug and a `DRAFT`/`PUBLISHED` example of each. Validated locally the same way as Phase 2 (real Postgres, RLS checked with `anon`): a draft source and a draft culture category are correctly invisible to the public role, and an anonymous insert into `culture_categories` is correctly rejected.

## D-020 — Supabase generic client types need `Relationships`/`Views`/`Functions`, not just `Tables`
**Decision:** `src/lib/supabase/types.ts`'s `Database` interface wraps the hand-authored table definitions with a `WithRelationships<T>` mapped type (adding `Relationships: []` to every table) and declares empty `Views`/`Functions` on the `public` schema.
**Reason:** Discovered while building Phase 3: the installed `@supabase/supabase-js`/`@supabase/postgrest-js` version's generic constraint (`GenericTable`/`GenericSchema`) requires every table to carry `Relationships` and the schema to declare `Views`/`Functions`. Without them, `SupabaseClient<Database>` doesn't raise a type error — it silently falls back and every query's row type becomes `never`, which then surfaces as confusing "property does not exist on type never" errors at every call site instead of one clear error where the mismatch actually is. Caught by running `next build`'s real type-check, not by inspection.
**Alternatives considered:** Manually adding `Relationships: []` to all 18 table definitions (rejected — repetitive, and the next hand-edited table would likely forget it, reintroducing the same silent failure).
**Consequences:** Documented with an inline comment in `types.ts` pointing at the exact upstream type definitions, so a future contributor hitting the same `never`-typed-row confusion finds the explanation immediately rather than re-diagnosing it. When regenerating this file with `supabase gen types`, the generated output already includes `Relationships` correctly — this wrapper only matters for the hand-authored version.

## D-019 — `node:test` instead of a test-framework dependency
**Decision:** Unit tests use Node's built-in test runner (`node --experimental-strip-types --test`) and `node:assert`, not Vitest/Jest. `tsconfig.json` gains `allowImportingTsExtensions: true` (safe alongside the existing `noEmit: true`) so test files can import their subject with an explicit `.ts` extension, which Node's native TS support requires at runtime.
**Reason:** Working rules #8/#9 (don't install unnecessary packages, justify every dependency) and #24 (add tests for important logic — here, the PostgREST `.or()`-filter escaping in `src/lib/archive/search.ts`, where a bug would be a real injection-shaped correctness issue). Node 22 (this project's runtime) has a built-in test runner and native TypeScript execution; nothing a test framework provides is currently needed (no component rendering tests yet, no mocking framework requirement).
**Alternatives considered:** Vitest (the common Next.js choice) — rejected for now as an unjustified dependency for the current, small amount of pure-logic testing; revisit if/when component-level testing (e.g. React Testing Library) becomes genuinely necessary.
**Consequences:** `npm test` runs `node --experimental-strip-types --test src/**/*.test.ts`. If real component tests are needed later, adding Vitest at that point should be proposed with justification, not assumed.

## D-018 — One Supabase project for now, not separate Preview/Production projects
**Decision:** Use a single free-tier Supabase project for Development, Preview, and Production for now, rather than provisioning a second project purely for Preview isolation.
**Reason:** Cost-control rule: a second project is a real (if free) additional resource, and there's no real archive data yet to protect from an experimental Preview deployment — the risk the isolation would guard against doesn't exist yet. Flagged to the user rather than created unilaterally.
**Alternatives considered:** Two projects from day one (rejected for now — premature; revisit once real content exists, at which point this becomes a real risk worth the second free project, per the user's own "avoid Preview accidentally modifying production archive data" instruction).
**Consequences:** DEPLOYMENT.md documents the upgrade path; revisit this decision before real (non-demo) content is entered.

## D-017 — Extensible categories are plain `text`, not enums
**Decision:** Fields the brief explicitly wants extensible by a non-technical admin later — `record_type`, `category` (places), `source_type`, `media_type`, `access_status`, `submission_type`, `review_status`, `transcription_status`, `language` — are plain `text` columns with no CHECK constraint, not Postgres enums.
**Reason:** The brief says culture categories (and by the same logic, similar fields) "should allow new categories later." A Postgres enum requires a migration (`ALTER TYPE ... ADD VALUE`) to add a value; free text doesn't. This is deliberately the opposite choice from evidence_type/confidence_level/copyright_status/content_status/user_role/consent_status (D-005), which ARE enums because that vocabulary is meant to be fixed and enforced.
**Alternatives considered:** A lookup table per field (e.g. `record_types(name)`) with a foreign key — more "correct" relationally, but adds real complexity (a table + join + admin UI per field) for a Phase 2 MVP; rejected as over-engineering for now, revisitable later without breaking existing data (the column stays `text` either way).
**Consequences:** No database-level protection against a typo'd category value; Phase 6's admin UI should offer a select-from-existing-values-or-add-new control rather than a free-text box, to get most of the safety without the schema rigidity.

## D-016 — `SECURITY DEFINER` helper functions instead of direct `profiles` subqueries in RLS
**Decision:** Every RLS policy that needs to know the caller's role goes through `public.is_staff()` / `public.can_edit()` / `public.can_review()` — `SECURITY DEFINER` SQL functions defined once — rather than each policy writing its own `exists (select 1 from profiles where ...)` subquery.
**Reason:** A policy on `profiles` itself that subqueries `profiles` directly risks Postgres RLS recursion (evaluating the policy requires evaluating the policy). `SECURITY DEFINER` functions run with the definer's privileges, bypassing RLS on that internal lookup, which is the standard Supabase-documented pattern for this. It also means the role-check logic exists in exactly one place.
**Alternatives considered:** Per-table subqueries (rejected — recursion risk on `profiles`, and the logic would be duplicated across ~15 policy definitions instead of 3 functions). Storing role in the JWT custom claims instead of a table lookup (rejected for now — adds an auth-hook configuration step; the function-based lookup is simpler to reason about for an MVP and can be swapped later without changing any policy).
**Consequences:** Every RLS-relevant query does one extra function call; negligible at this scale, and it's `stable`, so Postgres can cache it within a single query.

## D-015 — `public_visibility` as a generated column, not a trigger
**Decision:** Every content table's `public_visibility` boolean is `GENERATED ALWAYS AS (...) STORED` from that table's own status/consent columns, rather than maintained by a trigger.
**Reason:** The expression is a deterministic, same-row boolean (e.g. `verification_status = 'PUBLISHED' AND copyright_status <> 'RESTRICTED'`) — exactly what generated columns are for. It can never drift out of sync with the columns it depends on (a trigger could be forgotten on some code path; a generated column physically cannot be), and it reads as documentation of the visibility rule directly in the schema.
**Alternatives considered:** A `BEFORE INSERT/UPDATE` trigger computing the same value (rejected — more code for no benefit here, since the expression has no cross-row/cross-table dependency that would require one). A view instead of a column (rejected — would complicate the RLS policies, which are simplest when they can reference a real column directly).
**Consequences:** None of the inputs to a `public_visibility` expression can ever reference another table (Postgres generated columns must be same-row), which is fine here — nothing in the current model needs that — but worth remembering if a future visibility rule needs a cross-table check (that would need a trigger or view instead).

## D-014 — Restrained motion tier: CSS-only, opt-out-safe animation
**Decision:** Add a small, deliberately limited amount of motion: a one-time fade/rise on the homepage hero (plain CSS keyframes), a scroll-triggered fade/rise on below-the-fold sections and cards (CSS `animation-timeline: view()`, gated behind `@supports` so unsupported browsers just render the content fully visible with no animation at all), and hover micro-interactions (lift + shadow on cards/buttons, an underline sweep on nav links). Everything is wrapped in `@media (prefers-reduced-motion: no-preference)`. No JavaScript animation library, no IntersectionObserver, no client-side reveal logic.
**Reason:** The user asked for a more "modern, young, animated" feel; the original brief explicitly warned against "excessive animations" and a "tech-startup aesthetic" for an archive meant to be credible to the Obi and cultural institutions. Asked the user directly to calibrate (AskUserQuestion) and they chose the restrained option: keep the archival palette and avoid stock/AI imagery, add only subtle motion. A CSS-only approach means the base (no-JS, unsupported browser, or reduced-motion) state is always fully visible content — there is no risk of a broken page if a script fails to load or a browser lacks support, which a JS-driven "hidden until observed" pattern would risk.
**Alternatives considered:** A JS `IntersectionObserver`-based reveal (rejected — adds a client bundle, and risks content staying invisible if JS fails, which would be a real regression for a heritage-archive audience that may include lower-end devices/connections); a full "startup" visual treatment with stock imagery and heavy animation (rejected per the user's own choice, and per the original brief's explicit prohibition).
**Consequences:** No new dependency added. Motion is invisible/no-op on browsers without `animation-timeline` support (notably Safari, as of this writing) — they simply see the static, always-visible layout, which is an acceptable and intentional degradation.

## D-013 — Vercel branch workflow: feature branch → Preview → review → merge → production
**Decision:** All development happens on feature branches (this project's designated branch, `claude/oligbo-digital-archive-mvp-amovee`, for AI-assisted work). Vercel Preview Deployments are the verification step before any merge to the production branch. Nothing is pushed to production without the Preview build succeeding, loading correctly (including on mobile), showing no runtime errors or broken routes, exposing no secrets, connecting correctly to required services, and passing lint/type/test checks locally.
**Reason:** Explicit project instruction, and good practice for a project that will eventually be demonstrated to palace/community stakeholders — production should never be in a broken or half-finished state.
**Alternatives considered:** Direct commits to production — rejected, too high-risk for a project with a credibility bar to clear before a stakeholder demo.
**Consequences:** PRs are opened only when explicitly requested; the deployment checklist in DEPLOYMENT.md is followed before proposing any merge.

## D-012 — Search engines are blocked (noindex) until a deliberate decision to open up
**Decision:** `robots` metadata and `app/robots.ts` default to disallowing all indexing, gated behind `NEXT_PUBLIC_ALLOW_SEARCH_INDEXING` (default false/unset).
**Reason:** Explicit project instruction: during early development, unfinished/demo content should not be surfaced by search engines as if it were authoritative Issele-Uku history.
**Alternatives considered:** Leaving default Next.js behavior (indexable) and relying on a launch-day manual change — rejected as an easy step to forget; an explicit env flag makes the current state visible in every environment's config and in code review.
**Consequences:** Before any public promotion, `NEXT_PUBLIC_ALLOW_SEARCH_INDEXING=true` must be deliberately set in Vercel for Production (and a real `sitemap.ts` added) — tracked in ROADMAP.md/PRE_PALACE_REVIEW.md.

---

## D-001 — Repository is a greenfield build
**Decision:** Treat this as a from-scratch project; no existing code was found to preserve or migrate.
**Reason:** Repository inspection (Phase 0) found zero commits and zero files.
**Alternatives considered:** N/A — nothing existed to choose between.
**Consequences:** Full freedom in Phase 1 structure; no legacy constraints.

## D-002 — Next.js App Router, not Pages Router
**Decision:** Use the Next.js App Router (`app/` directory) for all routing.
**Reason:** It is the current, actively developed Next.js paradigm, has better support for nested layouts (useful for admin vs. public separation), server components (good for a content-heavy, SEO-sensitive archive site), and built-in metadata APIs for SEO.
**Alternatives considered:** Pages Router — rejected as legacy, weaker metadata/SEO ergonomics.
**Consequences:** Requires care with client/server component boundaries; admin interactivity will need explicit `"use client"` components.

## D-003 — Supabase for auth, database, and storage
**Decision:** Use Supabase (PostgreSQL + Auth + Storage) as specified.
**Reason:** Mandated by the project brief; also a good fit — Postgres gives us relational integrity for the historical/evidence model, Row Level Security gives us a real enforcement layer for public/draft/restricted visibility, and Storage handles media (photos, audio, documents) with signed URLs for access control.
**Alternatives considered:** None — specified technology.
**Consequences:** All admin mutations must go through server-side code using the service-role key (never exposed to the client); public reads use the anon key constrained by RLS policies.

## D-004 — Route groups to separate public site from admin
**Decision:** Structure the App Router with `app/(public)/...` for all public-facing pages and `app/admin/...` (with its own layout and auth guard) for the admin interface.
**Reason:** Working rule #16 requires clear separation between public content and admin functionality. Route groups plus a dedicated admin layout with a server-side session check make the boundary explicit and hard to bypass accidentally.
**Alternatives considered:** A single flat route tree with per-page auth checks — rejected as easier to forget a guard on a new page.
**Consequences:** Slightly more directory nesting; much lower risk of an unguarded admin page.

## D-005 — Evidence/confidence model lives at the database layer, not just the UI
**Decision:** `evidence_type`, `confidence_level`, and `verification_status` are first-class columns (backed by Postgres enums) on ArchiveItem and HistoricalEvent, not just a UI convention.
**Reason:** The brief treats historical rigor as a hard requirement ("never invent facts," "clearly distinguish oral tradition from documented fact"). Enforcing this at the schema level means it can't be silently dropped in a future UI redesign, and it lets us build server-side guarantees (e.g., a DB constraint or admin-form requirement that every published item has an evidence type).
**Alternatives considered:** Free-text tags — rejected as unstructured and easy for the badges to get out of sync with reality.
**Consequences:** Requires an explicit migration for the enum types; adding a new evidence category later means a migration, not just a UI change (acceptable trade-off given how central this is).

## D-006 — Content workflow as an explicit status enum, not a boolean `published`
**Decision:** Use a `content_status` enum: `DRAFT → RESEARCH → REVIEW → APPROVED → PUBLISHED`, plus a separate `RESTRICTED` state, on every content model (ArchiveItem, Person, Place, HistoricalEvent, Monarch).
**Reason:** The brief specifies this exact workflow. A boolean can't express "approved but not yet published" or "was published, now restricted pending a sensitivity review."
**Alternatives considered:** Boolean `is_published` + separate `is_restricted` flag — rejected, it allows contradictory states and doesn't capture the research/review pipeline the brief asks for.
**Consequences:** RLS policies key off this enum (`PUBLISHED` = publicly visible, everything else = admin/role-only). Admin UI needs a clear status stepper.

## D-007 — Oral history visibility defaults to private/restricted
**Decision:** `OralHistory` records default to non-public visibility even after a file is uploaded and a transcript exists; publication requires an explicit admin action confirming consent and publication permission are on file.
**Reason:** Working rule and the brief's Oral History Rules section: "An interview must not automatically become publicly visible simply because a file has been uploaded." This is a consent/privacy requirement, not just a workflow nicety.
**Alternatives considered:** Reusing the generic content_status pipeline alone — insufficient, because oral history needs consent_status and publication_permission as independent gates that must ALL be satisfied, not just "PUBLISHED" status.
**Consequences:** OralHistory publication logic (and its RLS policy) checks `content_status = PUBLISHED AND consent_status = 'GRANTED' AND publication_permission = true` before public exposure, with support for `restricted_sections` to redact part of a transcript even when the rest is public.

## D-008 — Copyright/rights status modeled as an explicit enum per ArchiveItem
**Decision:** `copyright_status` enum: `PUBLIC_DOMAIN | PERMISSION_GRANTED | COPYRIGHTED_METADATA_ONLY | UNKNOWN | RESTRICTED`, paired with `publication_permission` (boolean/notes) and `access_status`.
**Reason:** The brief is explicit that copyrighted material without permission must be stored as metadata/citation only, never as a re-hosted file. This needs to be enforced at data-entry time, and the public UI needs to render differently for metadata-only records (citation + external link, no embedded viewer/download).
**Alternatives considered:** Leaving this to admin discipline/documentation only — rejected as too easy to get wrong with real consequences (copyright infringement).
**Consequences:** Media upload UI in the admin must branch on `copyright_status`; `COPYRIGHTED_METADATA_ONLY` records should not have an attached full-file media record at all (only cover/thumbnail if separately licensed).

## D-009 — Placeholder/demo content policy
**Decision:** No real Issele-Uku historical facts, names, dates, or citations will be invented. All seed/demo data is clearly prefixed/labelled `[SAMPLE]` or `[DEMO]` in title fields and carries `evidence_type = UNVERIFIED`. Where real content is referenced structurally but not yet supplied, the UI renders literal placeholder copy such as "Research pending" or "Historical account requires verification."
**Reason:** Explicit, repeated working rule from the brief; avoids the site ever being mistaken for a source of verified Issele-Uku history before real research is vetted.
**Alternatives considered:** Leaving fields empty — rejected because empty fields read as a bug rather than an intentional research-pending state; explicit placeholder text is clearer to a non-technical reviewer (including palace stakeholders).
**Consequences:** Slightly more upfront copywriting for empty/placeholder states across every content type.

## D-010 — Tooling: ESLint + Prettier + TypeScript strict mode, no extra state/UI libraries yet
**Decision:** Use Next.js's built-in ESLint config, Prettier for formatting, TypeScript in `strict` mode. Do not add a client state manager (Redux/Zustand), UI kit (MUI/Chakra), or ORM (Prisma/Drizzle) in Phase 1.
**Reason:** Working rules #6–9 and #11 (prefer maintainability, avoid unnecessary packages, justify every dependency, keep TypeScript strict). The MVP's data needs are served well by Supabase's JS client directly with hand-written types generated from the schema; React Server Components reduce the need for client state; Tailwind covers styling without a component-kit dependency.
**Alternatives considered:** Prisma (rejected for now — Supabase's generated types + SQL migrations are sufficient and avoid a second schema-definition source of truth; can be revisited later without a rebuild). Zustand (rejected — no cross-page client state need identified yet in the MVP).
**Consequences:** If a genuine need for client state or an ORM emerges later, it will be proposed with justification before adding, per working rule #9.

## D-011 — Fonts and imagery approach
**Decision:** Use a serif display typeface paired with a clean sans-serif body face (self-hosted via `next/font`, no external font CDN calls at runtime), generous whitespace, and real/placeholder photography rather than illustration, icon patterns, or stock "African pattern" motifs.
**Reason:** Brief explicitly asks for a museum/archival-institution feel, not a startup or stereotyped-African-pattern look, and calls out avoiding AI-looking stock imagery.
**Alternatives considered:** A patterned/decorative design system — rejected per explicit brief guidance.
**Consequences:** Until real photography is supplied, image slots will show neutral placeholder treatments (e.g. muted background + caption "Image pending") rather than generic stock photos or invented decorative art.
