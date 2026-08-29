# Deployment

## Platform

Deployment target is **Vercel**, connected directly to this GitHub
repository. Framework-native Next.js configuration is preferred — Vercel
project settings are not modified unless there's a documented reason.

**Documented exception:** `vercel.json` pins `"framework": "nextjs"`.
The Vercel project was connected to this repo before any code existed,
so Vercel couldn't auto-detect the framework at connection time and
defaulted to a static-site preset (expecting a `public/` output
directory), which fails on a Next.js build with "No Output Directory
named 'public' found." Pinning the framework in version control fixes
this durably. If deployments still fail after this file is present,
also check Project Settings → General → Build & Development Settings →
Framework Preset in the Vercel dashboard and confirm it says "Next.js"
(an explicit dashboard override can in some cases take precedence).

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

## Database environments

**Status: connected.** A live Supabase project exists, the full schema
is applied, custom SMTP is configured, and the first ADMIN account has
signed in successfully end-to-end. The steps below are kept as a
reference for setting up a future second environment (e.g. a dedicated
Preview project) or for anyone rebuilding this from scratch, not as an
outstanding task.

The schema (`supabase/migrations/`) and demo seed data
(`supabase/seed.sql`) are built and validated (see DATABASE.md).

**One free-tier Supabase project is enough to start** (a single project
can serve both Preview and Production for now, since there's no real
archive data yet to protect — see the cost note below). A second project
purely for Preview isolation is a reasonable future upgrade once the
archive holds real content worth protecting from an experimental Preview
deployment; it would be a second free-tier project, flagged to you before
creating it, per the cost-control rule.

### To connect Supabase, here's what I need from you

1. **Create a Supabase project** at supabase.com (free tier) if you
   haven't already — any project name/region is fine.
2. In that project's dashboard, go to **Project Settings → API** and
   copy:
   - the **Project URL**
   - the **anon / public key**
   - the **service_role key** (click "reveal" — keep this one private)
3. Add these to your Vercel project (**Project Settings → Environment
   Variables**), applied to **Development, Preview, and Production**:

   | Variable | Value from Supabase | Public or secret |
   |---|---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL | Public |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / public key | Public |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role key | **Secret — enter it directly in Vercel, don't paste it into chat or a file** |

4. Apply the schema to that project: `npx supabase link --project-ref <your-project-ref>` then `npx supabase db push` (pushes `supabase/migrations/`). Demo data is separate and optional: `npx supabase db reset` only against a local/dev database, never against the linked project, seeds it — see DATABASE.md.
   - Separately, `supabase/real_content.sql` holds the first pass of real, web-sourced (not demo) content — see DECISIONS.md D-024 for exactly how it was researched and why every row lands at `REVIEW` status. It is not applied by `db push` or `db reset`; run it deliberately once against the real project (`psql "<connection string>" -f supabase/real_content.sql`) **after** re-verifying its citations yourself (the sourcing pass had no direct page-fetch access — see the file's own header comment) and, for the monarch records specifically, after confirming them with the palace/community. Nothing in it becomes public until you also move its rows from `REVIEW` to `PUBLISHED`.
5. For local development, copy `.env.example` to `.env.local` and fill in the same three values (`.env.local` is already git-ignored).
6. **Auth setup for the admin sign-in (Phase 6):** the admin area uses passwordless magic-link sign-in. In the Supabase dashboard, go to **Authentication → URL Configuration** and set:
   - **Site URL** to your deployed site's URL (e.g. `https://issele-uku-project.vercel.app`, or your custom domain once set up).
   - **Redirect URLs**: add `<your-site-url>/auth/callback` (and, for local dev, `http://localhost:3000/auth/callback`) — Supabase rejects a magic-link redirect to any URL not on this list. If your app builds the redirect with extra query parameters (this one does: `?next=/admin`), add a wildcard entry too (`<your-site-url>/auth/callback**`) rather than only the exact path, or Supabase's allow-list match can fail on the query string and silently fall back to the Site URL instead — a genuinely confusing failure mode to debug from the symptom alone (see DECISIONS.md D-033).
   - **Double-check `NEXT_PUBLIC_SITE_URL` in Vercel has no trailing whitespace/newline** if you're pasting it from somewhere — see D-033. A trailing newline produces the exact same "silently falls back to Site URL" symptom as the wildcard issue above, and is easy to miss since the value *looks* correct at a glance.
7. **Custom SMTP for auth emails — required almost immediately.** Supabase's built-in email sender has a very low hourly cap (fine for one smoke-test sign-in, not for real use) and gives no useful error back to the app when exhausted — the sign-in form just shows a generic "something went wrong." Before relying on magic-link sign-in for real work: pick a transactional email provider (Resend and Brevo both have a free tier sufficient for a small admin team), and in **Authentication → SMTP Settings**, enable custom SMTP with that provider's host/port/username/password. **Note if using Resend without a verified sending domain:** its default `onboarding@resend.dev` sender can only deliver to the email address the Resend account itself was signed up with — verify a real domain (or use an address on one) before inviting a second staff member, or their sign-in emails will silently fail to send.
8. **Create the first staff account.** Every new Supabase Auth user automatically gets a `profiles` row defaulting to the `RESEARCHER` role (least privilege — see DECISIONS.md D-026's neighboring migration). To get your first `ADMIN`: have that person sign in once via `/admin/login` (this creates their `auth.users`/`profiles` rows), then, in the Supabase dashboard's SQL editor, run:
   ```sql
   update public.profiles set role = 'ADMIN' where id = (
     select id from auth.users where email = 'their-email@example.com'
   );
   ```
   There is no admin-UI way to do this yet (promoting a role currently requires direct database access) — the `profiles.role` self-escalation trigger (see DATABASE.md) means this genuinely has to come from an existing ADMIN or direct database access, not a UI shortcut.

I can run step 4 myself if you paste the project ref and the two public
values here — the service-role key doesn't need to pass through this
chat at all. The admin CRUD system (Phase 6) does not use the
service-role key either — it writes through the same RLS-respecting
client as the public site, relying on RLS itself to permit ADMIN/EDITOR
writes (see DECISIONS.md D-025) — so that key still isn't needed for
day-to-day content work, only for the kind of RLS-bypassing operation
described in `src/lib/supabase/service-role.ts`'s own comment, if one
ever comes up.

## Backup and data portability

The archive must not be locked to one vendor.

**Schema**: fully defined in `supabase/migrations/`, already portable to
any Postgres host — nothing here is Supabase-proprietary except the
`auth.uid()`/`auth.users` references (standard Supabase Auth), which a
migration away from Supabase would need to replace.

**Data export**, once a live project has real content:

```bash
# Full logical dump (schema + data), restorable into any Postgres:
npx supabase db dump --db-url "<connection string from Supabase dashboard>" -f backup.sql

# Or, per table, plain CSV/JSON for portability into a spreadsheet or another system:
psql "<connection string>" -c "\copy (select * from archive_items) to 'archive_items.csv' with csv header"
```

**Media**: every `archive_media`/oral-history media row stores a
`storage_path` into Supabase Storage rather than embedding the file, so
bucket contents can be bulk-downloaded independently of the database
(`supabase storage` CLI commands, or the dashboard) and re-linked to a
different storage backend later if ever needed — the `storage_path`
column is just a string, not a Supabase-specific reference type.

**Recommended cadence**: a scheduled `supabase db dump` (e.g. weekly via
a simple GitHub Action once there's real content worth protecting) kept
somewhere outside Supabase itself (e.g. a private repo or cloud storage
bucket you control). Not yet set up — flagged here for Phase 9/10 rather
than built speculatively before there's real data to back up.

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
