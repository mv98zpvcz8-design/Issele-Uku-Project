# Admin Guide

A plain-language guide to the admin area for whoever is entering and
reviewing content — no coding knowledge needed. If something here
doesn't match what you see on screen, the software has moved on since
this was written; ask the developer to update this file (see
DECISIONS.md's rule that documentation is kept current).

## Logging in

Go to `/admin` (e.g. `https://yoursite.com/admin`). You'll be sent to a
sign-in page. Enter your email address and click **Send sign-in link** —
you'll get an email with a one-time link. Click it and you're in. There
is no password to remember or reset.

Only people an administrator has already set up with a staff account can
sign in this way — anyone else who tries just gets a link that doesn't
lead anywhere useful.

## Your role

Every staff account has one role, shown next to your email at the top of
every admin page:

- **Admin** — full access: create, edit, delete, publish, and (separately,
  outside this UI for now) promote other staff to a different role.
- **Editor** — same content access as Admin: create, edit, delete, publish.
- **Researcher** / **Reviewer** — can see everything (including drafts),
  but cannot create, edit, or delete anything. If you're one of these
  roles and need to make a change, ask an Admin or Editor.

## The dashboard

`/admin` shows every content type with a count of how many records are in
each stage of the workflow (see below), plus a callout if anything is
sitting in **Review** — that means it's written and sourced but not yet
double-checked and made public. It also shows how many public submissions
(corrections or offered material) are waiting to be looked at.

## The content workflow

Every record — an archive item, a person, a place, an event, a monarch,
a source, a culture category — moves through the same stages:

1. **Draft** — being written, not yet ready for anyone else to review.
2. **Research** — actively being researched/sourced.
3. **Review** — ready for someone else to check before it goes further.
4. **Approved** — checked and ready, but not yet live on the public site.
5. **Published** — live on the public site.
6. **Restricted** — was public (or could be), but has been pulled back for
   a reason (e.g. a sensitivity concern) and needs another look before
   ever being public again.

**Nothing goes live automatically.** A record only appears on the public
site once you've explicitly set its status to **Published**. To take
something off the public site, change its status away from Published
(usually to Restricted, if there's a concern, or back to Review/Approved
if it just needs more work).

## Evidence type and confidence level

Every historical record also carries two more fields, separate from the
workflow status:

- **Evidence type**: Documented / Oral tradition / Interpretation /
  Disputed / Unverified — what kind of evidence this claim rests on. See
  HISTORICAL_METHOD.md for what each means. Get this right even for
  content you're confident is true — "documented" means there's an actual
  citable source, not just that you believe it.
- **Confidence level**: High / Medium / Low / Unknown — how strong that
  evidence actually is. This is not a measure of how important or
  cherished something is; a beloved oral tradition can (and often will)
  have Low or Unknown confidence, and that's fine — it's still shown, just
  labelled honestly.

## Working with each content type

Each section (Archive Items, Sources, Historical Events, People, Places,
Monarchs, Culture Categories) works the same way: a list page with a
**New** button, and an edit page per record.

- **Slug**: the part of the web address for that record (e.g.
  `ine-aho-festival`). Leave it blank when creating something new and
  it's generated from the title automatically. Changing an existing
  slug changes that record's public web address — avoid doing that once
  something is published and linked to elsewhere, unless you have a
  reason to.
- **Comma-separated fields** (like "Titles" or "Alternative names"): type
  values separated by commas — e.g. `Obi, Agbogidi` — and they'll be
  stored as a list.
- **Preview on public site**: on every edit page, this link opens the
  real public page for that record — even if it's still a Draft. That's
  not a special "preview mode," it's the actual public page; you can see
  it because you're signed in as staff, but an anonymous visitor won't
  see it until you publish it.
- **Delete**: permanently removes the record. You'll be asked to confirm.
  There's no undo — if in doubt, set the status to Restricted instead of
  deleting.

### Archive Items specifically

Archive Items have extra fields for **copyright status** and **access
status** — see COPYRIGHT_GUIDELINES.md before filling these in,
especially before uploading anything you didn't create yourself. If in
doubt, choose "Copyrighted — metadata only" and leave the file itself
out — that's the safe default.

**Media (photos, audio, documents):** for now, adding a media entry means
typing in a storage path that a developer has already uploaded to
Supabase Storage — there isn't yet a drag-and-drop upload button in this
screen (see ROADMAP.md). Ask a developer to upload the file and give you
the path if you need to attach one.

### Monarchs specifically

Predecessor and successor are set by picking another monarch record from
a dropdown — create both monarch records first, then link them to each
other.

## Submissions (corrections and offered material)

The public correction/submission form and its review queue are being
built in a later phase. The dashboard already shows a count of pending
submissions once that form exists; a full review screen will follow.

## If something looks wrong

If a record on the public site looks incorrect and you're not sure why,
check its evidence type and confidence level first — it may be correctly
labelled as uncertain rather than actually wrong. If it's a genuine
error, edit the record directly (if you have Editor/Admin access) or ask
someone who does. Public visitors can also submit a correction through
the site's own submission form, which lands in the queue above rather
than changing anything automatically — see CONTENT_GUIDELINES.md.
