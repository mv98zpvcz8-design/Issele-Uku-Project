# Oligbo Digital Archive (working name)

An independent, in-development digital heritage archive for Issele-Uku,
Delta State, Nigeria — history, culture, oral history and photographic
records, presented with clear sourcing and evidence labelling.

**This is a prototype.** It is not an official palace, government, or
Issele-Uku Development Union publication. See [`/transparency`](src/app/(site)/transparency/page.tsx)
(or the live `/transparency` page) for the full status statement.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript (strict mode)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Supabase](https://supabase.com) (Postgres, Auth, Storage) — introduced in Phase 2
- Deployed on [Vercel](https://vercel.com)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. No environment variables are required to run
the site as of Phase 1 — see `.env.example` for what Phase 2 (database)
will add, and `DEPLOYMENT.md` for how those get configured in Vercel.

Useful scripts:

```bash
npm run dev     # local dev server
npm run build   # production build
npm run start   # run a production build locally
npm run lint    # ESLint
```

## Project documentation

This repository's documentation is treated as persistent project memory —
read it before making changes, and update it when something material
changes:

- [`ROADMAP.md`](ROADMAP.md) — phased build plan and current status
- [`DECISIONS.md`](DECISIONS.md) — the technical decision log
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — how the app is put together
- [`DATABASE.md`](DATABASE.md) — schema, evidence model, RLS design
- [`CONTENT_GUIDELINES.md`](CONTENT_GUIDELINES.md) — editorial rules for what goes on the site
- [`HISTORICAL_METHOD.md`](HISTORICAL_METHOD.md) — how historical claims are evaluated and labelled
- [`COPYRIGHT_GUIDELINES.md`](COPYRIGHT_GUIDELINES.md) — rights handling for archive media
- [`DEPLOYMENT.md`](DEPLOYMENT.md) — Vercel + Supabase setup and environment variables
- [`ADMIN_GUIDE.md`](ADMIN_GUIDE.md) — how a non-technical administrator uses the admin panel
- [`PRE_PALACE_REVIEW.md`](PRE_PALACE_REVIEW.md) — the readiness checklist before any stakeholder demo (added in Phase 10)

## Working rules (short version)

No invented historical facts, citations, quotations, or dates. Uncertain
or oral material is labelled, never presented as settled fact. No
donation/payment functionality yet. Admin and public surfaces are kept
strictly separate. Full rules live in `CONTENT_GUIDELINES.md` and
`HISTORICAL_METHOD.md`.

## Branding note

"Oligbo Digital Archive" is a working name only. All user-facing branding
strings live in `src/lib/site-config.ts` so a rename doesn't require
touching individual pages.
