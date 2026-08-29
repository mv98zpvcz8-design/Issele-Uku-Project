# Architecture

## Overview

A single Next.js (App Router) application, deployed to Vercel, backed by a
single Supabase project (Postgres + Auth + Storage). No separate backend
service — server components and route handlers talk to Supabase directly.

```
Browser
  │
  ▼
Next.js (Vercel)
  ├─ Public site  → app/(site)/**        (RSC, reads via anon key + RLS)
  └─ Admin panel  → app/admin/**          (Supabase Auth session required;
                                            reads/writes go through the
                                            same RLS-respecting client as
                                            the public site — RLS itself
                                            is what permits an ADMIN/
                                            EDITOR write, so the
                                            service-role key isn't needed
                                            for ordinary CRUD; see D-025)
  │
  ▼
Supabase
  ├─ Postgres (schema in DATABASE.md, RLS policies enforce visibility)
  ├─ Auth (admin/editor/researcher/reviewer accounts only — no public
  │        end-user accounts in the MVP)
  └─ Storage (media: images, audio, documents — access-controlled buckets)
```

## Directory layout

```
src/
  app/
    layout.tsx           Root HTML shell: fonts, global metadata, robots policy
    globals.css          Design tokens (Tailwind v4 @theme) — the design system
    robots.ts            Search-indexing policy (env-gated, see DECISIONS.md D-012)
    not-found.tsx         Global 404
    (site)/               Route group: all public pages share Header/Footer/StatusBanner
      layout.tsx
      page.tsx            Home
      history/, monarchy/, culture/, people/, places/,
      archive/, research-library/, timeline/,
      transparency/, submit/, privacy/, contact/
    admin/                Never nested under (site).
      login/               Public (outside the auth guard): magic-link sign-in form
      actions.ts           signOut()
      (protected)/          Route group carrying the real auth guard — see below
        layout.tsx           Redirects to /admin/login if there's no staff session
        page.tsx             Dashboard: per-table status counts, pending submissions
        archive-items/, sources/, historical-events/, people/,
        places/, monarchs/, culture-categories/
          page.tsx            List
          actions.ts          Server actions: create/update/delete (+ media for archive-items)
          new/page.tsx         Create form
          [id]/page.tsx        Edit form (+ delete, + a Preview link to the live public page)
    auth/callback/route.ts Exchanges a magic-link code for a session
  components/
    layout/               Header, Footer, Container, StatusBanner — shared chrome
    ui/                   Small reusable presentational pieces (PagePlaceholder,
                           StateNotice, etc.)
    archive/               EvidenceBadge, ConfidenceLabel, CopyrightNotice, ArchiveCard
    admin/                 AdminList, AdminForm, StatusBadge, form fields, PreviewLink —
                           shared across every admin entity's list/create/edit pages
  lib/
    site-config.ts        Branding + nav, single source of truth for rename-ability
    admin/
      session.ts            getAdminSession()/canEdit()/requireEditorPage() — the actual
                           role-check logic, called from the (protected) layout and
                           from every create/edit page and server action
      nav.ts, options.ts, slugify.ts
    supabase/
      types.ts             Hand-authored Database types matching supabase/migrations/*.sql
      config.ts             SUPABASE_CONFIGURED — used everywhere to fail gracefully
                           (an honest message, not a crash) before a project is connected
      browser.ts           Client-side client (anon key) — for "use client" components
      server.ts             Server Components/Actions client (anon key, cookie-based session)
      service-role.ts       Server-only client that bypasses RLS — see its own doc comment
                           (not currently used by any admin CRUD — see D-025)
```

middleware.ts (project root) refreshes the Supabase session cookie on
every request and does a cheap, session-only redirect for `/admin/**`
(no session at all → `/admin/login`) — it does NOT check role, since
that needs a database call; the real access-control check is the
`(protected)` layout, which does look up the caller's `profiles` row.
The middleware also no-ops entirely when Supabase isn't configured
(`SUPABASE_CONFIGURED` false), which matters more than it sounds: without
that check, `createServerClient()` throws on empty credentials, and
because the middleware's matcher covers nearly every route, that would
500 the *entire* public site, not just `/admin` — found and fixed during
the Phase 6 audit.

## Why a route group for the public site (and another one for admin)

`app/(site)` groups every public page under one layout (header, footer,
status banner) without adding a `/site` URL segment. `app/admin` sits
outside that group entirely — the structural enforcement of the "public
and admin must stay clearly separated" rule (see DECISIONS.md D-004).
Within `app/admin`, the login page and the rest of the admin further
split across a second route group, `app/admin/(protected)`: the actual
auth-guard layout lives there, not on `app/admin` itself, specifically so
`/admin/login` doesn't inherit a guard that would redirect it to itself
in a loop (a real bug caught while building Phase 6). Every other admin
page lives inside `(protected)` and is guaranteed to pass through that
layout's session check before rendering.

## Data access pattern

- **Public reads**: Server Components query Supabase with the anon key;
  Row Level Security policies are the actual enforcement of what's
  visible (status = PUBLISHED, consent satisfied for oral history, etc.),
  not application-code `if` statements. This means a bug in a page
  component cannot leak restricted data — the database refuses the row.
- **Admin reads/writes**: go through the same RLS-respecting client as
  the public site, using the signed-in staff member's own session — RLS
  policies already grant ADMIN/EDITOR roles insert/update/delete (see
  DATABASE.md's Row Level Security section), so a plain authenticated
  request is sufficient; the service-role key isn't needed for ordinary
  CRUD (see D-025). Each admin server action *also* checks the caller's
  role itself before attempting a write (`requireEditor()` inside the
  action, `requireEditorPage()` on the page) — redundant with RLS by
  design, so a mistake in one layer doesn't remove protection, and so a
  non-editor gets a clear redirect instead of a raw database rejection.

## Rendering strategy

Content pages are Server Components by default (good for SEO once
indexing is enabled, and for a content-heavy archive site). Interactive
pieces (mobile nav, search/filter controls, forms, the timeline) are
isolated `"use client"` components so the majority of the tree stays
server-rendered.

## Fonts and design tokens

Fonts are self-hosted via `next/font/google` (no runtime calls to a font
CDN) — see `src/app/layout.tsx`. Color, spacing and semantic tokens
(paper/ink palette, evidence-type colors) are defined once in
`src/app/globals.css` under Tailwind v4's `@theme`, so evidence badges,
buttons, etc. stay visually consistent as they're built out in later
phases.

## What is intentionally not built yet

No ORM (Supabase's JS client + generated types is sufficient for this
schema size — see DECISIONS.md D-010), no client-side state manager. The
admin has no real file-upload widget yet (media rows are added by
pasting a Storage path a developer already uploaded — see D-025 and
ROADMAP.md); no admin UI for the submissions review queue yet (Phase 7);
no UI for promoting a staff member's role (an ADMIN can do this today
only via direct SQL/the Supabase dashboard, since `profiles.role` is
change-guarded by a database trigger regardless of how it's edited).
