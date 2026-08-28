# Deployment

## Platform

Deployment target is **Vercel**, connected directly to this GitHub
repository. Framework-native Next.js configuration is preferred — Vercel
project settings are not modified unless there's a documented reason
(none exist yet).

## Branching and environments

| Branch / PR | Vercel environment | Purpose |
|---|---|---|
| Feature branch (e.g. `claude/oligbo-digital-archive-mvp-amovee`) | **Preview** deployment, auto-built per push | Where all development happens and gets verified before merge. |
| Production branch (`main`, or whatever is configured in Vercel) | **Production** deployment | Only receives merges of already-verified changes. |

Rules we follow:

- Development never happens directly against the production branch.
- Every meaningful change is verified on its Preview deployment before a
  merge to production is proposed: build succeeds, the site loads and
  works on mobile, no obvious runtime errors, no broken routes, no
  exposed secrets, required services connect correctly, and local
  lint/type/test checks pass.
- No destructive database migration ever runs automatically against
  production. Migrations are version-controlled SQL (Phase 2 onward),
  applied deliberately.

## Environment variables

None are required to build or run the site as of Phase 1. `.env.example`
lists every variable the project uses; only variables from that file
should ever exist in Vercel.

**Do not assume Preview and Production share configuration.** Each
variable below must be set per-environment in the Vercel dashboard
(Project → Settings → Environment Variables), and Development/Preview
values should point at non-production resources once Supabase is
introduced (see "Database environments" below) so a Preview deployment
can never write to production archive data.

| Variable | Public or secret | Introduced |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public | Phase 1 |
| `NEXT_PUBLIC_ALLOW_SEARCH_INDEXING` | Public | Phase 1 — keep `false` on Preview and on Production until there's a deliberate decision to open the site to search engines (see DECISIONS.md D-012) |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Phase 2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Phase 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret — server only, never `NEXT_PUBLIC_`** | Phase 2 |

Whenever a new secret needs to be added, this document will be updated
first, and you'll be told explicitly: the exact variable name, where to
obtain it, where to enter it in Vercel, which environments it applies to,
and whether it's public or secret. None of that has come up yet.

## Database environments (Phase 2 onward)

To avoid a Preview deployment accidentally modifying production archive
data, the plan is a **separate Supabase project (or schema) for
development/preview** versus production, with Preview's environment
variables pointed at the non-production project. This will be finalized
and documented here when Phase 2 starts; it is a cost consideration (an
additional free-tier Supabase project) that will be flagged before
creating it, per the project's cost-control rule.

## Backup and data portability

The archive must not be locked to one vendor. Once the schema exists
(Phase 2), this section will document: how to export every table to
JSON/CSV (`supabase db dump`, or scripted `COPY` statements), how media
in Supabase Storage is organized so it can be bulk-downloaded/migrated,
and a recommended backup cadence.

## Deployment checklist (used before every production merge)

- [ ] `npm run build` succeeds locally
- [ ] `npm run lint` passes
- [ ] TypeScript has no errors (`tsc --noEmit`, or via the build)
- [ ] Preview deployment loads correctly on desktop and mobile
- [ ] No console/runtime errors on key pages
- [ ] No broken internal links
- [ ] No secret values visible in client bundles or page source
- [ ] Any required external service (Supabase, once introduced) connects
      correctly from the Preview environment
