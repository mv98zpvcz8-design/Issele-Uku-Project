# Pre-Palace Review Checklist

Before showing this site to the Obi of Issele-Uku, palace representatives, or
community stakeholders — even informally — everything on this page should be
checked. This is Phase 10 of ROADMAP.md: a final tightening pass, not a list
of new features. Nothing here should be treated as done until the project
owner has personally verified it, not just read that it was built.

Status legend: ⬜ not yet checked · ✅ verified · ⚠️ known issue, flagged below

---

## 1. Content — the thing itself

- ⬜ **Fix the contact email.** `src/lib/site-config.ts`'s `contactEmail` is
  still the placeholder `contact@example.org` — it renders on the live
  `/contact` page right now. This is a five-minute fix once a real address
  is chosen, but it must happen before anyone outside this project sees the
  site.
- ⬜ Personally re-verify the citations in `supabase/real_content.sql`
  (12+ sources) by opening each source URL yourself — the original research
  pass used web search only, not direct page access (see DECISIONS.md
  D-024), so this hasn't been independently confirmed against the live
  pages yet.
- ⬜ Confirm the two monarch records (Obi Henry Ezeagwuna II, Obi Nduka
  Ezeagwuna II) with the palace or another authoritative community source
  before publishing them — required per D-024, not optional given who this
  demo is for.
- ⬜ Decide, record by record, what actually moves from `REVIEW` to
  `PUBLISHED` before the demo. Nothing currently in the database is public
  by default — that's a deliberate choice to review, not a bug to fix.
- ⬜ If `supabase/seed.sql` (the `[SAMPLE]`/`[DEMO]`-labelled fictional data)
  was ever applied to the live project for testing, confirm none of it is
  at `PUBLISHED` status — a stakeholder must never see placeholder content
  presented as real.
- ⬜ Read every `DISPUTED`/`LOW`-confidence entry out loud as if a
  historian in the room were reading it — does the hedging read as honest
  rigor, or as an apology? (It should read as the former; the wording was
  written for that, but only a human ear catches tone.)
- ⬜ Check there's *enough* published content that the site doesn't read as
  empty on a first click-through — a mostly-empty archive undersells
  months of real infrastructure work.

## 2. Technical

- ⬜ Every migration in `supabase/migrations/` has been applied to the live
  project, in order, with no errors — cross-check the file list against
  what you've actually run (this session applied several in separate
  pastes; worth a final sanity pass rather than trusting memory).
- ⬜ `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `NEXT_PUBLIC_SITE_URL` are all correct in Vercel, with **no trailing
  whitespace** (see DECISIONS.md D-033 — this exact mistake cost real time
  once already).
- ⬜ Custom SMTP (Resend) is still configured and sending — do one real
  test sign-in before the demo, not just trust that it worked last time.
- ⬜ At least one working ADMIN account exists that isn't tied to a
  password only one person remembers.
- ⬜ Click through every public route on an actual phone, not just a
  desktop browser resized smaller: `/`, `/history`, `/monarchy`,
  `/culture`, `/people`, `/places`, `/archive`, `/research-library`,
  `/timeline`, `/transparency`, `/submit`, `/privacy`, `/contact`.
- ⬜ Same pass on desktop. Look for layout breaks, not just "does it load."
- ⬜ Open the browser console on a few pages and confirm no errors/warnings.
- ⬜ Confirm `NEXT_PUBLIC_ALLOW_SEARCH_INDEXING` is still `false` everywhere
  — this demo should not be the moment the site starts appearing in search
  results (see DECISIONS.md D-012).
- ⬜ Confirm you understand Supabase's and Resend's free-tier limits (email
  sends/day, database size, Storage size/bandwidth) well enough to know if
  a demo with several people clicking around at once could hit one.

## 3. Security

- ⬜ Confirm `/admin/**` genuinely redirects to login when signed out (test
  in a private/incognito window, not just trust the code).
- ⬜ Confirm a non-admin role (Researcher) really can't edit anything, by
  actually testing it with a second account if one exists — not just
  trusting the RLS tests from earlier phases.
- ⬜ Confirm the Supabase `service_role` key was never pasted into this
  chat, a committed file, or anywhere outside Vercel's environment
  variable store.
- ⬜ Submit a test correction through `/submit` yourself and confirm it
  lands in the admin queue and nowhere public.

## 4. Framing and honesty

- ⬜ The independence disclaimer ("An independent digital heritage
  initiative currently under development. Not an official palace,
  community union, or government publication.") is visible on every page
  and reads exactly as intended — re-read it once more before the demo,
  since this is the line a formal audience will scrutinize most.
- ⬜ `/transparency` accurately describes who built this and how, with
  nothing overstated.
- ⬜ Every piece of content a stakeholder is likely to react personally to
  (the founding narrative, the monarch records, anything touching a named
  living person) has been re-read by the project owner specifically for
  tone, not just for factual sourcing.

## 5. Known gaps — say these out loud before anyone finds them silently

Being upfront about what's *not* done is part of a credible demo, not a
weakness to hide:

- A cover image for a person/place/monarch is set by pasting an Archive
  Media ID, not picking one visually — functional, not polished (see
  DECISIONS.md D-035's "not yet built" note).
- No Content-Security-Policy header yet (D-032) — other security headers
  are in place.
- No sitemap.xml yet — deliberately deferred until public search indexing
  is turned on (robots.ts).
- No admin UI for promoting a staff member's role — direct SQL only
  (DEPLOYMENT.md).
- Submissions have basic bot-deterrence (a honeypot + minimum fill time,
  D-031), not a CAPTCHA — adequate for now, not bulletproof.

## 6. Suggested walkthrough order for the actual demo

A path that shows range without exposing an empty section early:

1. Homepage → tagline and status banner (sets honest expectations
   immediately)
2. `/monarchy` → the institution, since it's likely the audience's first
   interest
3. `/history` → a couple of well-sourced events, ideally including one
   with a photo attached
4. `/culture` → Ine Aho festival entry (currently the best-sourced,
   HIGH-confidence culture entry)
5. `/archive` → search for something, show a result, show its evidence
   badge and rights notice
6. `/timeline` → the same events in date order
7. `/transparency` → close on this deliberately, so the honesty framing
   is the last impression, not an afterthought

## 7. Sign-off

- ⬜ The project owner has personally clicked through every item above —
  not delegated, not assumed from earlier phase reports.
- ⬜ The project owner is comfortable being asked "why isn't X published
  yet?" in the room and has an honest answer ready (the REVIEW-status
  workflow itself is a good answer: "reviewed for sourcing, not yet
  confirmed with the community").
- ⬜ A fallback plan exists if the live site is unreachable during the demo
  (a phone hotspot, a second device, screenshots as backup).
