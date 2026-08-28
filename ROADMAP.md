# Roadmap — Oligbo Digital Archive

Working name only; branding is designed to be changed without a rebuild (see DECISIONS.md).

Status legend: ✅ done · 🚧 in progress · ⏳ not started

## Phase 0 — Initial Audit
✅ Repository inspected (empty, no prior work). ROADMAP.md and DECISIONS.md created. Domain model and information architecture proposed.

## Phase 1 — Foundation
✅ Next.js (App Router) + TypeScript (strict) + Tailwind CSS v4 set up. Design system tokens (paper/ink archival palette, verified WCAG AA+ contrast, evidence-type colors reserved for Phase 3). Self-hosted fonts (Newsreader display + Source Sans 3 body). Header (desktop + mobile nav), footer, and a permanent independence/status banner. Homepage with hero, section grid, and status statement. Stub pages for every planned route (history, monarchy, culture, people, places, archive, research-library, timeline, submit) using a shared "Research pending" placeholder pattern — never inventing content. Full `/transparency`, `/privacy`, `/contact` pages written. Restrained, CSS-only motion (hero entrance, scroll reveal, hover micro-interactions), added after explicit user calibration — see DECISIONS.md D-014. `robots`/indexing blocked by default until a deliberate decision to go public (D-012). `.env.example` documents Phase 2's variables without requiring any yet. All of README/ARCHITECTURE/DATABASE (design)/CONTENT_GUIDELINES/HISTORICAL_METHOD/COPYRIGHT_GUIDELINES/DEPLOYMENT/ADMIN_GUIDE written. Verified: `next build`, `eslint`, `tsc --noEmit` all clean; every route returns 200 (404 page verified separately); desktop + mobile screenshots reviewed; link audit found no broken internal links.

## Phase 2 — Database
⏳ Full schema design for ArchiveItem, Person, Place, HistoricalEvent, Monarch, Source, OralHistory, Submission/Correction tables, and media tables. SQL migrations (version-controlled, Supabase CLI format). Row Level Security policies for public/draft/restricted visibility. Demo/sample seed data, clearly labelled SAMPLE/DEMO.

## Phase 3 — Public Archive
⏳ Archive listing page, archive detail pages, search, filters, source display, evidence-type badges, confidence-level labels.

## Phase 4 — Core Content
⏳ History section, Monarchy section (Obi list + detail pages), Culture section (flexible categories), People & Places, Research Library.

## Phase 5 — Timeline
⏳ Public interactive historical timeline supporting uncertain dates and date ranges, filterable, linking to archive/people/places.

## Phase 6 — Admin
⏳ Supabase Auth-based admin authentication. Role architecture (ADMIN/EDITOR/RESEARCHER/REVIEWER) — simple initially, structured for growth. CRUD for archive records, sources, events, people, places, monarchs. Draft/preview/publish/unpublish workflow. Verification and sensitivity flags.

## Phase 7 — Submissions
⏳ Public correction-submission form and material-submission form. Submissions land in a review queue; nothing publishes automatically.

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
