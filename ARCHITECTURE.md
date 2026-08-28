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
  └─ Admin panel  → app/admin/**          (Phase 6; Supabase Auth session
                                            required; mutations via
                                            server actions/route handlers
                                            using the service-role key,
                                            after checking the caller's
                                            role)
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
    admin/                Added in Phase 6. Own layout with a server-side
                           auth guard; never nested under (site).
  components/
    layout/               Header, Footer, Container, StatusBanner — shared chrome
    ui/                   Small reusable presentational pieces (e.g. PagePlaceholder,
                           and later EvidenceBadge, ConfidenceLabel, etc.)
  lib/
    site-config.ts        Branding + nav, single source of truth for rename-ability
    supabase/              Added in Phase 2: typed client factories (browser vs.
                           server vs. service-role), generated DB types
```

## Why a route group for the public site

`app/(site)` groups every public page under one layout (header, footer,
status banner) without adding a `/site` URL segment. `app/admin` sits
outside that group entirely, with its own layout and its own auth check —
this is the structural enforcement of the "public and admin must stay
clearly separated" rule (see DECISIONS.md D-004). A page can only render
admin functionality if it lives under `app/admin`, and every page under
`app/admin` is required to pass through that layout's session check.

## Data access pattern (finalized in Phase 2)

- **Public reads**: Server Components query Supabase with the anon key;
  Row Level Security policies are the actual enforcement of what's
  visible (status = PUBLISHED, consent satisfied for oral history, etc.),
  not application-code `if` statements. This means a bug in a page
  component cannot leak restricted data — the database refuses the row.
- **Admin writes**: Server Actions / route handlers under `app/admin`
  check the authenticated user's role (via their Supabase session and the
  `profiles` table), then perform the write. Some admin operations (e.g.
  publishing, which changes what the public can see) use the
  service-role key server-side, after that role check — the service-role
  key is never sent to the browser.

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
schema size — see DECISIONS.md D-010), no client-side state manager, no
admin routes, no Supabase client code (added when the schema exists in
Phase 2, to avoid dead/unused scaffolding).
