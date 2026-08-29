-- REAL, SOURCED CONTENT — not demo/sample data (contrast with seed.sql).
--
-- Every fact below is attributed to a specific, named, real source found
-- via web search. Per CONTENT_GUIDELINES.md and HISTORICAL_METHOD.md:
-- nothing here was invented, no citation was fabricated, and every claim
-- carries an evidence_type and confidence_level reflecting how solid its
-- sourcing actually is.
--
-- IMPORTANT METHODOLOGY NOTE: research for this file was done with a web
-- search tool only — direct page-fetching (which would have let a human
-- reviewer's equivalent verify exact wording against the live page) was
-- blocked by this environment's network policy for every domain tried,
-- Wikipedia included. Citations below point at the real, named source
-- page, but the exact text was relayed through the search tool's own
-- summarization rather than independently confirmed against raw HTML.
-- That is a meaningfully weaker verification step than normally
-- expected before publication, which is exactly why every row below is
-- inserted at 'REVIEW' status, not 'PUBLISHED' — someone with normal,
-- unrestricted internet access should open each source URL and confirm
-- it says what's cited here before anything goes live.
--
-- EXTRA CAUTION ON MONARCHY CONTENT: this concerns a real, living
-- traditional ruler and his immediate predecessor. Per the project
-- brief's own instruction ("historical information requires
-- interpretation" is a case to escalate rather than resolve alone), the
-- monarch records below should specifically be confirmed with the
-- palace/community before publication, not published on the strength of
-- news coverage alone.
--
-- This file is NOT applied automatically by any tooling — it must be
-- run deliberately (`psql <connection> -f supabase/real_content.sql`,
-- or pasted into the Supabase SQL Editor) against a real Supabase
-- project, after the migrations in supabase/migrations/ have been
-- applied. Re-run safely fails on the second attempt (unique slugs) —
-- if re-applying after the ADDENDUM below was added, either run only
-- the new statements, or drop and re-insert deliberately.
--
-- Current total: 18 sources, 4 culture categories, 12 places, 2
-- monarchs, 5 historical events, 2 people. Validated end-to-end against
-- a local Postgres instance (all migrations + this file applying
-- cleanly with no errors) before being handed over — see DECISIONS.md
-- D-034 for the second research pass (ADDENDUM) that added the people
-- table's first two rows.

-- ============================= SOURCES =============================

insert into public.sources (slug, title, source_type, url, publisher, access_status, reliability_notes, verification_status) values
(
  'wikipedia-issele-ukwu',
  'Issele Ukwu',
  'website',
  'https://en.wikipedia.org/wiki/Issele_Ukwu',
  'Wikipedia',
  'external_access',
  'Tertiary/crowd-sourced source. Content here (settlement date "before 1230AD", founding narrative, list of ten quarters) was relayed via a search-engine summary, not a direct page fetch (blocked in this environment) — recommend a reviewer with normal internet access open the article directly and check its own citations before treating any specific claim as confirmed.',
  'REVIEW'
),
(
  'wikipedia-aniocha-north',
  'Aniocha North',
  'website',
  'https://en.wikipedia.org/wiki/Aniocha_North',
  'Wikipedia',
  'external_access',
  'Same access caveat as the Issele Ukwu article — relayed via search summary, not directly fetched.',
  'REVIEW'
),
(
  'wikipedia-diocese-issele-uku',
  'Diocese of Issele-Uku / Roman Catholic Diocese of Issele-Uku',
  'website',
  'https://en.wikipedia.org/wiki/Roman_Catholic_Diocese_of_Issele-Uku',
  'Wikipedia',
  'external_access',
  'Corroborated independently by the diocese''s own site and by catholic-hierarchy.org/gcatholic.org in search results, which raises confidence in this particular set of facts despite the general Wikipedia-access caveat.',
  'REVIEW'
),
(
  'issele-uku-diocese-history',
  'History of the Diocese',
  'website',
  'https://www.issele-ukudiocese.org/profile/history/',
  'Roman Catholic Diocese of Issele-Uku (official site)',
  'external_access',
  'Primary/official source for the diocese''s own history — the strongest-tier source in this file, though still relayed via search summary rather than direct fetch.',
  'REVIEW'
),
(
  'vanguard-2016-crown-prince-benin',
  'Royal solidarity: When Crown Prince of Issele-Uku visits Benin Kingdom prior to his enthronement',
  'newspaper',
  'https://www.vanguardngr.com/2016/04/royal-solidarity-crown-prince-issele-uku-visits-benin-kingdom-prior-enthronement/',
  'Vanguard News',
  'external_access',
  'Nigerian national newspaper, published April 2016, ahead of the coronation.',
  'REVIEW'
),
(
  'vanguard-2017-obi-emerges',
  'Excitement as Obi of Issele-Uku emerges with call for kingdom''s recreation',
  'newspaper',
  'https://www.vanguardngr.com/2017/01/excitement-obi-issele-uku-emerges-call-kingdoms-recreation/',
  'Vanguard News',
  'external_access',
  'Nigerian national newspaper, published January 2017, shortly after the December 2016 coronation. Reports the coronation date as 29 December 2016 and states the predecessor, Obi Henry Ezeagwuna, died in a motor accident.',
  'REVIEW'
),
(
  'vanguard-2020-afor-market',
  'Issele-Uku ascribes much respect to Afor Market — HRM, Agbogidi Obi Nduka',
  'newspaper',
  'https://www.vanguardngr.com/2020/06/issele-uku-ascribes-much-respect-to-afor-market-hrm-agbogidi-obi-nduka/',
  'Vanguard News',
  'external_access',
  'Nigerian national newspaper, published June 2020.',
  'REVIEW'
),
(
  'vanguard-2021-ine-festival',
  'Issele-Uku Kingdom celebrates Ine festival',
  'newspaper',
  'https://www.vanguardngr.com/2021/09/issele-uku-kingdom-celebrates-ine-festival/',
  'Vanguard News',
  'external_access',
  'Nigerian national newspaper, published September 2021.',
  'REVIEW'
),
(
  'thenigerianvoice-anasi-obi',
  'Isele-Uku: Akamu Crowns Queen Dumebi Ezeagwuna As Anasi-Obi',
  'newspaper',
  'https://www.thenigerianvoice.com/news/247062/isele-uku-akamu-crowns-queen-dumebi-ezeagwuna-as-anasi-obi.html',
  'The Nigerian Voice',
  'external_access',
  'Reports the March 2017 coronation of the Anasi-Obi (queen) and names the palace.',
  'REVIEW'
),
(
  'issele-uku-union-uk-history',
  'Issele-Uku History',
  'website',
  'https://issele-uku.org.uk/issele-uku-history/',
  'Issele-Uku Union UK (diaspora community organisation)',
  'external_access',
  'A community/diaspora organisation''s own account, not an independent academic source — treat any historical narrative from this page as community oral tradition rather than documentary proof, per HISTORICAL_METHOD.md, even where it corroborates other sources.',
  'REVIEW'
),
(
  'citypopulation-aniocha-north',
  'Aniocha North (Local Government Area, Nigeria)',
  'website',
  'https://www.citypopulation.de/en/nigeria/admin/delta/NGA010001__aniocha_north/',
  'citypopulation.de',
  'external_access',
  'Aggregates official Nigerian census figures (2006 national census: population 104,062, land area 406 km²). A specialist population-statistics site, not itself a primary census document.',
  'REVIEW'
),
(
  'iwriteafrica-akwa-ocha',
  'Akwa Ocha, Symbol of Purity and Pride of Anioma Kingdom',
  'website',
  'https://iwriteafrica.com/akwa-ocha-delta-nigeria-fashion-culture-tradition/',
  'iwriteafrica.com',
  'external_access',
  'States Akwa Ocha''s origin is credited to Ubulu-Uku (a different Anioma community), not Issele-Uku — important not to misattribute when describing Issele-Uku''s own relationship to the cloth.',
  'REVIEW'
);

-- ========================= CULTURE CATEGORIES =========================

insert into public.culture_categories (slug, name, description, evidence_type, confidence_level, verification_status)
values (
  'ine-aho-festival',
  'Ine Aho / Ine Festival',
  'Ine Aho is Issele-Uku''s annual new-year festival cycle, tied to the Igbo new yam festival (Iwa Ji). Its climax, the Ine Festival (also called Ine Onyimi, "Festival of Joy"), is described in press coverage as satirical in character: participants are traditionally free to speak candidly — including to the Obi himself — about wrongdoing in the community during the celebration. Ceremonial elements reported include the Agbogidi (the Obi, in his warrior-king role) performing traditional rites, palace chiefs paying homage to the monarch, and the closing Ihu/Ishu Onicha rite. Multiple independent news reports (2021, 2024, 2025) describe the festival recurring annually, with the Obi using the occasion to speak on cultural continuity and, in some years, on community concerns such as peaceful elections.',
  'DOCUMENTED', 'HIGH', 'REVIEW'
);

insert into public.culture_categories (slug, name, description, evidence_type, confidence_level, verification_status)
values (
  'akwa-ocha',
  'Akwa Ocha',
  'Akwa Ocha ("white cloth") is a hand-woven white fabric worn across Anioma communities — the broader Igbo-speaking group in Delta State''s Delta North senatorial district that Issele-Uku belongs to — for weddings, title-taking, and other formal occasions, typically tied across the shoulder by men. Sourcing is clear that the cloth''s origin is credited to Ubulu-Uku, a separate Anioma community, not to Issele-Uku itself; Issele-Uku''s relationship to it is as a wearer/practitioner of the shared Anioma tradition, not as its origin point. Separately, a Delta State government fabric-production training programme has operated out of a facility in Issele-Uku (Aniocha North LGA), teaching Akwa Ocha weaving to local trainees — a present-day economic/cultural link distinct from the cloth''s historical origin.',
  'DOCUMENTED', 'MEDIUM', 'REVIEW'
);

insert into public.culture_categories (slug, name, description, evidence_type, confidence_level, verification_status)
values (
  'issele-uku-chieftaincy-titles',
  'Chieftaincy titles',
  'News coverage of Issele-Uku''s traditional institution names several chieftaincy/royal titles in current use: Agbogidi, the royal title/style of the reigning Obi (used as, e.g., "Agbogidi Obi Nduka"); Anasi-Obi, a queenly title (Queen Chukwudumebi Rosemary Ezeagwuna was crowned Anasi-Obi of the kingdom in March 2017); and Isagba, a palace chieftaincy title. Available sources name these titles and some of their holders but do not give a full account of the chieftaincy system''s structure or the precise meaning/etymology of each title — recorded here as "research pending" beyond what is directly cited.',
  'DOCUMENTED', 'LOW', 'REVIEW'
);

-- =============================== PLACES ===============================

insert into public.places (slug, name, alternative_names, category, description, evidence_type, confidence_level, verification_status) values
(
  'oligbo-royal-palace',
  'Oligbo Royal Palace',
  array['Ugeh'],
  'palace',
  'The palace of the Obi of Issele-Uku, seat of what is referred to in press coverage as "Oligbo Kingdom" — the traditional name closely associated with the Issele-Uku throne (and the origin of this project''s own working name). Locally known as "Ugeh." Used for coronations and major cultural ceremonies, including the March 2017 coronation of the Anasi-Obi (queen) and palace observances during the annual Ine festival.',
  'DOCUMENTED', 'MEDIUM', 'REVIEW'
),
(
  'afor-market',
  'Afor Market',
  '{}',
  'market',
  'A market held in high regard by the Issele-Uku community according to the reigning Obi; subject of a 2020 redevelopment/modernisation effort discussed at the Issele-Uku Royal Palace.',
  'DOCUMENTED', 'MEDIUM', 'REVIEW'
);

-- The ten traditional quarters. Only the names are sourced; each
-- quarter's individual history is "research pending" (CONTENT_GUIDELINES.md)
-- rather than guessed.
insert into public.places (slug, name, category, description, evidence_type, confidence_level, verification_status)
values
  ('ogbe-owelle-quarter', 'Ogbe-Owelle', 'quarter', 'One of the ten traditional quarters of Issele-Uku. Individual quarter history: research pending.', 'DOCUMENTED', 'MEDIUM', 'REVIEW'),
  ('ogbe-utu-quarter', 'Ogbe-Utu', 'quarter', 'One of the ten traditional quarters of Issele-Uku. Individual quarter history: research pending.', 'DOCUMENTED', 'MEDIUM', 'REVIEW'),
  ('ukpai-quarter', 'Ukpai', 'quarter', 'One of the ten traditional quarters of Issele-Uku. Individual quarter history: research pending.', 'DOCUMENTED', 'MEDIUM', 'REVIEW'),
  ('ogbe-ofu-quarter', 'Ogbe-Ofu', 'quarter', 'One of the ten traditional quarters of Issele-Uku. Individual quarter history: research pending.', 'DOCUMENTED', 'MEDIUM', 'REVIEW'),
  ('ogboli-quarter', 'Ogboli', 'quarter', 'One of the ten traditional quarters of Issele-Uku. Individual quarter history: research pending.', 'DOCUMENTED', 'MEDIUM', 'REVIEW'),
  ('idumuinei-quarter', 'Idumuinei', 'quarter', 'One of the ten traditional quarters of Issele-Uku. Individual quarter history: research pending.', 'DOCUMENTED', 'MEDIUM', 'REVIEW'),
  ('isheakpe-quarter', 'Isheakpe', 'quarter', 'One of the ten traditional quarters of Issele-Uku. Individual quarter history: research pending.', 'DOCUMENTED', 'MEDIUM', 'REVIEW'),
  ('ogbidibo-quarter', 'Ogbidibo', 'quarter', 'One of the ten traditional quarters of Issele-Uku. Individual quarter history: research pending.', 'DOCUMENTED', 'MEDIUM', 'REVIEW'),
  ('ogbe-ntiobi-quarter', 'Ogbe-Ntiobi', 'quarter', 'One of the ten traditional quarters of Issele-Uku. Individual quarter history: research pending.', 'DOCUMENTED', 'MEDIUM', 'REVIEW'),
  ('idumu-ahaba-quarter', 'Idumu Ahaba', 'quarter', 'One of the ten traditional quarters of Issele-Uku. Individual quarter history: research pending.', 'DOCUMENTED', 'MEDIUM', 'REVIEW');

-- ============================== MONARCHS ==============================

insert into public.monarchs (id, slug, name, regnal_name, reign_end, reign_display, biography, evidence_type, confidence_level, verification_status)
values (
  '10000000-0000-0000-0006-000000000001',
  'henry-ezeagwuna-ii',
  'Henry Ezeagwuna',
  'Obi Henry Ezeagwuna II',
  '2014-08-09',
  'Reign ended with his death on 9 August 2014',
  'Obi Henry Ezeagwuna II was the traditional ruler (Obi) of Issele-Uku prior to the current Obi, Nduka Ezeagwuna II, his son. He died on 9 August 2014 in a motor accident on the Benin–Asaba–Onitsha expressway. Reign start date and further biographical detail: research pending.',
  'DOCUMENTED', 'MEDIUM', 'REVIEW'
);

insert into public.monarchs (slug, name, regnal_name, predecessor_id, reign_display, biography, evidence_type, confidence_level, verification_status)
values (
  'nduka-ezeagwuna-ii',
  'Nduka Ezeagwuna',
  'Obi Nduka Ezeagwuna II',
  '10000000-0000-0000-0006-000000000001',
  'Crowned December 2016 (sources report the exact coronation date variously as 21 or 29 December 2016 — flagged for confirmation, not resolved here)',
  'The current Obi of Issele-Uku, styled Agbogidi Obi Nduka. Succeeded his father, Obi Henry Ezeagwuna II, following a period of traditional coronation rites; visited Oba Ewuare II of Benin as part of customary royal protocol ahead of his enthronement (reported April 2016). A chemical engineering graduate of the University of Ibadan, described in press coverage as an advocate for Anioma/Issele-Uku cultural promotion, including the annual Ine festival. Exact birth date is reported inconsistently across sources and is deliberately omitted here rather than guessed.',
  'DOCUMENTED', 'MEDIUM', 'REVIEW'
);

-- ========================= HISTORICAL EVENTS =========================

-- Handled with particular caution: origin/founding narratives for a
-- living traditional institution are exactly the kind of claim
-- HISTORICAL_METHOD.md requires be presented as contested, not settled,
-- especially where they touch dynastic descent from another kingdom.
-- Column note: date_exact is used for a precisely-known single day,
-- date_from for an approximate placement of a fuzzier date (here, a
-- month-only coronation date), date_to for a known upper bound on an
-- otherwise-uncertain date (the founding). All three previously had NO
-- machine-readable date at all except the founding row — a real bug
-- (see DECISIONS.md and src/lib/timeline/sort.ts's own comment) that
-- made the timeline sort these three as "undated," dumping them at the
-- end instead of in chronological order. Fixed here, not just in the
-- sort logic, since the sort fix alone couldn't invent a date that was
-- never stored.
insert into public.historical_events
  (slug, title, description, date_exact, date_from, date_to, date_display, evidence_type, confidence_level, verification_status)
values (
  'founding-of-issele-uku',
  'Founding of Issele-Uku',
  'Secondary-source summaries describe Issele-Uku as an Igbo settlement founded before approximately 1230 CE. One account attributes the kingdom''s founding to a Prince Uwadiaie, described as the second son of Oba Eweka I of Benin — a claim that would tie Issele-Uku''s dynastic origin to the Benin royal lineage. This is recorded here as one reported account, not as an agreed history: founding narratives of this kind are frequently contested between communities and traditions, no primary or academic source for this specific claim was found, and it has not been cross-checked against the Issele-Uku community''s own account of its history. Do not treat as settled.',
  null, null, '1230-01-01',
  'before c. 1230 CE (approximate; founding narrative disputed/uncorroborated)',
  'DISPUTED', 'LOW', 'REVIEW'
),
(
  'diocese-of-issele-uku-established',
  'Roman Catholic Diocese of Issele-Uku established',
  'The Roman Catholic Diocese of Issele-Uku was created from territory formerly part of the Archdiocese of Benin City, covering (per its own account) six Local Government Areas west of the Niger: Aniocha North, Aniocha South, Ika North East, Ika South, Oshimili North, and Oshimili South. Its first bishop, Most Rev. Dr. Anthony Okonkwor Gbuji, was consecrated on 30 September 1973 and served until 8 November 1996.',
  '1973-07-05', null, null,
  '5 July 1973',
  'DOCUMENTED', 'HIGH', 'REVIEW'
),
(
  'death-of-obi-henry-ezeagwuna-ii',
  'Death of Obi Henry Ezeagwuna II',
  'Obi Henry Ezeagwuna II, the traditional ruler of Issele-Uku, died in a motor accident on the Benin–Asaba–Onitsha expressway.',
  '2014-08-09', null, null,
  '9 August 2014',
  'DOCUMENTED', 'MEDIUM', 'REVIEW'
),
(
  'coronation-of-obi-nduka-ezeagwuna-ii',
  'Coronation of Obi Nduka Ezeagwuna II',
  'Nduka Ezeagwuna, son and successor of the late Obi Henry Ezeagwuna II, was crowned Obi of Issele-Uku following a period of traditional coronation rites. Ahead of his enthronement he visited Oba Ewuare II of Benin, described in coverage as customary given the historical relationship between the two thrones. Sources report the exact coronation date variously as 21 or 29 December 2016.',
  null, '2016-12-01', null,
  'December 2016',
  'DOCUMENTED', 'MEDIUM', 'REVIEW'
);

-- ========================= CROSS-REFERENCE JOINS =========================

insert into public.monarch_sources (monarch_id, source_id)
select m.id, s.id from public.monarchs m, public.sources s
where m.slug = 'henry-ezeagwuna-ii' and s.slug in ('vanguard-2017-obi-emerges');

insert into public.monarch_sources (monarch_id, source_id)
select m.id, s.id from public.monarchs m, public.sources s
where m.slug = 'nduka-ezeagwuna-ii' and s.slug in ('vanguard-2017-obi-emerges', 'vanguard-2016-crown-prince-benin', 'vanguard-2020-afor-market');

insert into public.event_sources (event_id, source_id)
select e.id, s.id from public.historical_events e, public.sources s
where e.slug = 'founding-of-issele-uku' and s.slug in ('wikipedia-issele-ukwu', 'issele-uku-union-uk-history');

insert into public.event_sources (event_id, source_id)
select e.id, s.id from public.historical_events e, public.sources s
where e.slug = 'diocese-of-issele-uku-established' and s.slug in ('wikipedia-diocese-issele-uku', 'issele-uku-diocese-history');

insert into public.event_sources (event_id, source_id)
select e.id, s.id from public.historical_events e, public.sources s
where e.slug = 'death-of-obi-henry-ezeagwuna-ii' and s.slug in ('vanguard-2017-obi-emerges');

insert into public.event_sources (event_id, source_id)
select e.id, s.id from public.historical_events e, public.sources s
where e.slug = 'coronation-of-obi-nduka-ezeagwuna-ii' and s.slug in ('vanguard-2016-crown-prince-benin', 'vanguard-2017-obi-emerges');

insert into public.place_sources (place_id, source_id)
select p.id, s.id from public.places p, public.sources s
where p.slug = 'oligbo-royal-palace' and s.slug in ('thenigerianvoice-anasi-obi', 'vanguard-2020-afor-market');

insert into public.place_sources (place_id, source_id)
select p.id, s.id from public.places p, public.sources s
where p.slug = 'afor-market' and s.slug = 'vanguard-2020-afor-market';

insert into public.place_sources (place_id, source_id)
select p.id, s.id from public.places p, public.sources s
where p.slug in (
  'ogbe-owelle-quarter','ogbe-utu-quarter','ukpai-quarter','ogbe-ofu-quarter','ogboli-quarter',
  'idumuinei-quarter','isheakpe-quarter','ogbidibo-quarter','ogbe-ntiobi-quarter','idumu-ahaba-quarter'
) and s.slug = 'wikipedia-issele-ukwu';

-- ============================================================================
-- ADDENDUM (second research pass) — same rules, same caveats as above: every
-- claim below was found via WebSearch only (no direct page-fetch), every row
-- lands at REVIEW, nothing here is invented. Where a fact could NOT be
-- confirmed to a standard worth including, it was left out rather than
-- guessed — e.g. a search for playwright Sam Ukala's birthplace turned up
-- strong biographical detail but no confirmation he was specifically from
-- Issele-Uku (only Delta State generally), so he is deliberately not
-- included here.
-- ============================================================================

-- ============================= SOURCES (2) =============================

insert into public.sources (slug, title, source_type, url, publisher, access_status, reliability_notes, verification_status) values
(
  'wikipedia-zulu-sofola',
  'Zulu Sofola',
  'website',
  'https://en.wikipedia.org/wiki/Zulu_Sofola',
  'Wikipedia',
  'external_access',
  'Tertiary/crowd-sourced source, relayed via search summary rather than direct fetch (same environment limitation noted throughout this file).',
  'REVIEW'
),
(
  'ascleiden-zulu-sofola',
  'Zulu Sofola (library note)',
  'website',
  'https://www.ascleiden.nl/content/library-weekly/zulu-sofola',
  'African Studies Centre Leiden',
  'external_access',
  'An academic area-studies institute''s library page — a stronger tier of source than a general news or community site, though still relayed via search summary.',
  'REVIEW'
),
(
  'wikipedia-ekumeku-movement',
  'Ekumeku Movement',
  'website',
  'https://en.wikipedia.org/wiki/Ekumeku_Movement',
  'Wikipedia',
  'external_access',
  'Tertiary/crowd-sourced source, relayed via search summary. Corroborated in its broad outline (dates, nature of the movement) by the Vanguard News article cited alongside it.',
  'REVIEW'
),
(
  'vanguard-2019-ekumeku-war',
  'Ekumeku war: Anioma uprising against British rule',
  'newspaper',
  'https://www.vanguardngr.com/2019/03/ekumeku-war-anioma-uprising-against-british-rule/',
  'Vanguard News',
  'external_access',
  'Nigerian national newspaper, published March 2019.',
  'REVIEW'
),
(
  'guardian-inne-festival',
  'Inne Festival lights up Issele-Ukwu community',
  'newspaper',
  'https://guardian.ng/saturday-magazine/inne-festival-lights-up-issele-ukwu-community/',
  'The Guardian Nigeria',
  'external_access',
  'Nigerian national newspaper.',
  'REVIEW'
),
(
  'wavesngr-igbu-awai',
  'The Significance Of Igbu Awai Festival In Issele-Uku',
  'website',
  'https://www.wavesngr.com/2022/09/02/the-significance-of-igbu-awai-festival-in-issele-uku/',
  'Nigeria Waves',
  'external_access',
  'A single, less-established outlet — not corroborated elsewhere in this research pass. Included per the project''s "include what''s found, label honestly" approach, but flagged LOW confidence specifically because it is not independently corroborated, unlike most other entries in this file.',
  'REVIEW'
);

-- ========================= CULTURE CATEGORIES (2) =========================

insert into public.culture_categories (slug, name, description, evidence_type, confidence_level, verification_status)
values (
  'igbu-awai-festival',
  'Igbu Awai',
  'Igbu Awai is reported as a festival/ceremony observed in Issele-Uku, per a single web article found in this research pass. That article was not corroborated by any second, independent source in this search session — unlike this file''s other festival entries (Ine Aho), which multiple national newspapers independently describe. Recorded here rather than omitted, per the project''s policy of including what was found with an honest confidence label, but a reviewer should treat this entry as needing corroboration before it is relied on for anything beyond "a source claims this exists."',
  'DOCUMENTED', 'LOW', 'REVIEW'
);

-- ============================== PEOPLE =================================

insert into public.people (slug, name, titles, biography, birth_date, associated_locations, historical_period, evidence_type, confidence_level, verification_status)
values (
  'zulu-sofola',
  'Zulu Sofola',
  array['Professor of Theatre Arts'],
  'Born 22 June 1935 in Issele-Uku, Zulu Sofola was a Nigerian playwright described in multiple sources as Africa''s first female professor of theatre arts and, per one source, the first published female author in Nigeria. Exact death date and further biographical/career detail: research pending — this entry reflects only what was directly corroborated across the sources cited, not a full biography.',
  '1935-06-22',
  array['Issele-Uku'],
  'Post-independence Nigeria (20th century)',
  'DOCUMENTED', 'MEDIUM', 'REVIEW'
);

insert into public.people (slug, name, titles, biography, associated_locations, historical_period, evidence_type, confidence_level, verification_status)
values (
  'nwabuzo-olimagwo',
  'Nwabuzo Olimagwo',
  array['Ekumeku commander'],
  'Named in sourcing as one of the Anioma Ekumeku commanders associated with Issele-Uku during the Ekumeku resistance movement against British colonial rule (see the Ekumeku Movement historical event). This is a thin, single-mention citation rather than a developed biography — dates, role, and further detail: research pending.',
  array['Issele-Uku'],
  'Colonial period (1883–1914)',
  'DOCUMENTED', 'LOW', 'REVIEW'
);

-- ========================= HISTORICAL EVENTS (2) =========================

insert into public.historical_events (slug, title, description, date_from, date_to, date_display, evidence_type, confidence_level, verification_status)
values (
  'ekumeku-resistance-movement',
  'Ekumeku Movement (Anglo-Ekumeku War)',
  'The Ekumeku Movement was a guerrilla resistance movement across Anioma (Western Igboland) against British colonial incursion, fought in two phases (1883–1902 and 1904–1914) and organised as a secret, oath-bound network rather than a single standing force. Issele-Uku is reported as one of the movement''s operational bases and the site of some of its fiercest battles with British forces; the town later became a British colonial administrative headquarters. Sourcing names the "Idabor of Issele-Uku" (a chieftaincy title, individual not otherwise identified in what was found) and Nwabuzo Olimagwo as figures associated with Issele-Uku''s part in the resistance — see the linked person record for the latter. Broad outline corroborated by Wikipedia and Vanguard News independently; Issele-Uku''s specific role is reported consistently across sources found but was not cross-checked against an academic/primary source in this pass.',
  '1883-01-01',
  '1914-01-01',
  '1883–1914 (two phases; Issele-Uku''s specific role not precisely dated)',
  'DOCUMENTED', 'MEDIUM', 'REVIEW'
);

-- ========================= CROSS-REFERENCE JOINS (2) =========================

insert into public.person_sources (person_id, source_id)
select p.id, s.id from public.people p, public.sources s
where p.slug = 'zulu-sofola' and s.slug in ('wikipedia-zulu-sofola', 'ascleiden-zulu-sofola');

insert into public.person_sources (person_id, source_id)
select p.id, s.id from public.people p, public.sources s
where p.slug = 'nwabuzo-olimagwo' and s.slug = 'wikipedia-ekumeku-movement';

insert into public.event_sources (event_id, source_id)
select e.id, s.id from public.historical_events e, public.sources s
where e.slug = 'ekumeku-resistance-movement' and s.slug in ('wikipedia-ekumeku-movement', 'vanguard-2019-ekumeku-war');

insert into public.event_people (event_id, person_id)
select e.id, p.id from public.historical_events e, public.people p
where e.slug = 'ekumeku-resistance-movement' and p.slug = 'nwabuzo-olimagwo';

-- ============================================================================
-- SECOND ADDENDUM — filling real chronological gaps in the timeline. The
-- previous content left a ~650-year gap between the disputed c.1230
-- founding and the 1883 Ekumeku movement, and another ~60-year gap between
-- 1914 and 1973. Searched specifically for real, dateable, Issele-Uku-
-- specific events in those gaps rather than padding with generic regional
-- history — a search for the town's own experience of the 1967-1970
-- Nigerian Civil War turned up nothing town-specific (only region-wide
-- Anioma coverage), so nothing was added for that period rather than
-- presenting a regional claim as if it were about Issele-Uku itself. The
-- pre-1883 gap remains real and unfilled: no source beyond the disputed
-- founding narrative was found for that span.
-- ============================================================================

insert into public.sources (slug, title, source_type, url, publisher, access_status, reliability_notes, verification_status) values
(
  'aniocha-north-lga-official',
  'About Aniocha North Local Government Council',
  'website',
  'https://aniochanorthlga.dl.gov.ng/about/anlgc',
  'Aniocha North Local Government Council (official site)',
  'external_access',
  'Primary/official source for the LGA''s own founding date and headquarters. Corroborated independently by Wikipedia and Wikidata in search results.',
  'REVIEW'
),
(
  'deltastate-technical-education-issele-uku-tech',
  'Issele-Uku Tech',
  'website',
  'https://technicaleducation.deltastate.gov.ng/issele-uku-tech/',
  'Delta State Ministry of Technical Education (official site)',
  'external_access',
  'Official state government source, but a single source with no independent corroboration found — treat the exact 2021 date as reasonably reliable (it is the source''s own stated launch timeframe) but not independently confirmed.',
  'REVIEW'
);

insert into public.historical_events (slug, title, description, date_exact, date_display, evidence_type, confidence_level, verification_status)
values (
  'aniocha-north-lga-created',
  'Aniocha North Local Government Area created, headquartered in Issele-Uku',
  'Aniocha North Local Government Area was carved out of the former Aniocha Local Government Area of the then Bendel State on 27 August 1991, the same day Delta State itself was created from Bendel State, by the military government of General Ibrahim Babangida. Issele-Uku became — and remains — the LGA''s headquarters. The area comprises three major clans (Ezechima, Idumuje, and Odiani) and 18 communities.',
  '1991-08-27',
  '27 August 1991',
  'DOCUMENTED', 'MEDIUM', 'REVIEW'
),
(
  'issele-uku-technical-college-established',
  'Issele-Uku Technical College established',
  'A government technical college was established in Issele-Uku under Delta State''s technical education programme, per the state Ministry of Technical Education''s own site, which states a September 2021 kickoff for its new technical colleges including this one. Further detail beyond the launch timeframe: research pending.',
  '2021-09-01',
  'September 2021',
  'DOCUMENTED', 'LOW', 'REVIEW'
);

insert into public.event_sources (event_id, source_id)
select e.id, s.id from public.historical_events e, public.sources s
where e.slug = 'aniocha-north-lga-created' and s.slug = 'aniocha-north-lga-official';

insert into public.event_sources (event_id, source_id)
select e.id, s.id from public.historical_events e, public.sources s
where e.slug = 'issele-uku-technical-college-established' and s.slug = 'deltastate-technical-education-issele-uku-tech';

-- ============================================================================
-- THIRD ADDENDUM — a systematic pass across the broader Anioma/Enuani/
-- Western Igbo region, not restricted to "Issele-Uku" as a search term,
-- per an explicit request to widen the net. Two important honesty notes:
--
-- 1. WebSearch is a general web search tool, not an authenticated login to
--    JSTOR/ProQuest/Scopus/Web of Science — those paywalled databases were
--    not actually searched (this environment has no access to them). What
--    follows comes from what a normal web search surfaces: Google Scholar-
--    indexed results, ResearchGate/Academia.edu public paper pages, an
--    open-access journal PDF (eajournals.org), a Wiley journal abstract,
--    and public archive catalogue entries (UK National Archives, SOAS).
--    Several of the academic-tier hits (a Wiley History Compass series, an
--    open-access West African studies journal article) are a real step up
--    in tier from the newspaper/community-site sourcing used elsewhere in
--    this file, but still only relayed via search summary, same caveat as
--    everything above.
--
-- 2. Most of what a region-wide search actually turns up is about the
--    *Anioma region generally* (Asaba, Ubulu-Uku, the Ezechima dynasty
--    controversy, the Enuani dialect) — not Issele-Uku specifically. Per
--    this file's standing rule against misattribution, regional facts are
--    recorded as regional, not dressed up as town-specific. Where a
--    regional academic source directly strengthens an existing
--    Issele-Uku-specific entry (the disputed founding narrative), it is
--    linked to that entry as an additional source, not used to upgrade its
--    confidence for the Issele-Uku-specific claim itself.
-- ============================================================================

insert into public.sources (slug, title, source_type, url, publisher, access_status, reliability_notes, verification_status) values
(
  'wikipedia-enuani-dialect',
  'Enuani dialect',
  'website',
  'https://en.wikipedia.org/wiki/Enuani_dialect',
  'Wikipedia',
  'external_access',
  'Names Issele-Uku ("Isseles") directly among the Enu-Ani dialect area''s communities, alongside Ibusa, Ogwashi-Uku, Asaba, and others — the one source in this addendum that is genuinely town-specific, not just regional.',
  'REVIEW'
),
(
  'researchgate-anioma-origin-identity',
  'Interrogating the origin and identity of the Anioma of the Western Niger Delta of Nigeria',
  'academic_paper',
  'https://www.researchgate.net/publication/363325736_Interrogating_the_origin_and_identity_of_the_Anioma_of_the_Western_Niger_Delta_of_Nigeria',
  'ResearchGate (publication host; original journal not confirmed via search summary)',
  'external_access',
  'An academic-tier paper directly addressing the Benin-origin-vs-Igbo-origin debate for the Anioma region generally, of which the Ezechima/Issele-Uku founding narrative is one instance. Relayed via search summary, not read directly — a reviewer with full access should confirm the paper''s actual journal/publication venue and read its argument in full before citing its conclusions.',
  'REVIEW'
),
(
  'eajournals-benin-factor-ubulu-ukwu',
  'The Benin Factor in the West Niger Igbo History: The Example of Ubulu-Ukwu',
  'academic_paper',
  'https://eajournals.org/wp-content/uploads/The-Benin-Factor-in-the-West-Niger-Igbo-History-The-Example-of-Ubulu-Ukwu.pdf',
  'European-American Journals (eajournals.org)',
  'full_text_available',
  'An open-access PDF appears directly available at this URL per search results — the strongest-access source in this addendum, though the file itself was not opened/read in this environment. Examines the same Benin-origin question via a neighbouring Anioma kingdom (Ubulu-Ukwu), not Issele-Uku itself.',
  'REVIEW'
),
(
  'wiley-chuku-igbo-historiography',
  'Igbo historiography (series)',
  'academic_paper',
  'https://compass.onlinelibrary.wiley.com/doi/10.1111/hic3.12488',
  'History Compass (Wiley)',
  'metadata_only',
  'A peer-reviewed academic journal (by Gloria Chuku) surveying Igbo historiography broadly, including the Benin-influence debate relevant to Anioma/West Niger Igbo communities. Paywalled — only the abstract/existence was confirmed via search, not the article text.',
  'REVIEW'
),
(
  'academia-benin-origin-controversy-eziorsu',
  'The Benin Origin Controversy among the western Niger Igbo communities in Nigeria: A Case Study of Eziorsu Autonomous Community',
  'academic_paper',
  'https://www.academia.edu/144026831/The_Benin_Origin_Controversy_among_the_western_Niger_Igbo_communities_in_Nigeria_A_Case_Study_of_Eziorsu_Autonomous_Community',
  'Academia.edu (self-archived paper)',
  'external_access',
  'A case study of the same type of Benin-origin dispute in a different western Niger Igbo community (Eziorsu, not Issele-Uku) — useful as evidence this is a well-documented pattern of contested founding narratives across the region, not evidence for Issele-Uku''s own case specifically.',
  'REVIEW'
),
(
  'nationalarchives-uk-benin-province-file',
  'Nigeria: activities of the Benin/Delta Peoples'' Party (Colonial Office: West Africa Original Correspondence)',
  'archival_record',
  'https://beta.nationalarchives.gov.uk/catalogue/id/C566005',
  'The National Archives (UK), Kew',
  'restricted',
  'A catalogue entry, not a read document — confirms a real archival file exists covering Benin Province-area political activity in the colonial period. Recorded here as a pointer for a future researcher with archive access, not as a source for any specific claim in this database.',
  'REVIEW'
),
(
  'cambridge-soas-nigeria-archives',
  'Archives and Manuscripts in the School of Oriental and African Studies (SOAS) Library relating to Nigeria',
  'academic_paper',
  'https://www.cambridge.org/core/journals/african-research-and-documentation/article/abs/archives-and-manuscripts-in-the-school-of-oriental-and-african-studies-soas-library-relating-to-nigeria/2928514EADBD5EA5CA04C3EC26D2CA9F',
  'African Research & Documentation (Cambridge Core)',
  'metadata_only',
  'A guide to SOAS''s Nigeria-related archival holdings (missionary, civil-service, and scholarly papers) — a pointer for future primary-source research, not itself a source for any specific claim here. Abstract only; paywalled.',
  'REVIEW'
);

-- One culture entry that IS genuinely Issele-Uku-specific (the town is
-- directly named in the source), plus one enrichment of the existing
-- disputed founding-narrative event with the regional academic context
-- found above.
insert into public.culture_categories (slug, name, description, evidence_type, confidence_level, verification_status)
values (
  'enuani-dialect',
  'Enuani (the Anioma Igbo dialect)',
  'Enuani is one of the dialect groupings of the Anioma (Western Igbo) region of Delta State, spoken across communities including Ibusa, Ogwashi-Uku, Asaba, and Issele-Uku itself (named directly in sourcing) — distinct from the other regional groupings Ukwuani, Ika, and Aboh. Issele-Uku''s own relationship to Enuani is as one of its speaking communities, not a distinguishing feature unique to the town. Further detail on Issele-Uku''s own dialectal features specifically: research pending.',
  'DOCUMENTED', 'MEDIUM', 'REVIEW'
);

insert into public.event_sources (event_id, source_id)
select e.id, s.id from public.historical_events e, public.sources s
where e.slug = 'founding-of-issele-uku'
  and s.slug in (
    'researchgate-anioma-origin-identity',
    'eajournals-benin-factor-ubulu-ukwu',
    'wiley-chuku-igbo-historiography',
    'academia-benin-origin-controversy-eziorsu'
  );

update public.historical_events
set description = description || ' Widening the search beyond Issele-Uku specifically, the Benin-origin-versus-Igbo-origin question this founding narrative poses is a well-documented, actively studied pattern across the wider Anioma/West Niger Igbo region (see the linked academic sources on Ubulu-Ukwu, Eziorsu, and Igbo historiography generally) — this makes the underlying question a genuine scholarly debate, not an isolated or fringe claim, even though no source specific to Issele-Uku''s own case was found beyond the original community/tertiary accounts. The DISPUTED/LOW rating for this specific claim is unchanged: what is now better evidenced is that the dispute itself is real and regionally documented, not that Issele-Uku''s particular version of it has been confirmed.'
where slug = 'founding-of-issele-uku';

-- Further archival/bibliographic pointers found in the same widened pass —
-- none of these are read in full (paywalled, archival-access-only, or a
-- monograph this environment cannot open), so each is recorded as a
-- pointer for a future researcher, not as a source for a specific claim.
insert into public.sources (slug, title, source_type, url, publisher, access_status, reliability_notes, verification_status) values
(
  'ohadike-asaba-ibo-polity-1885',
  'Historical Change in an Ibo Polity: Asaba to 1885',
  'book',
  'https://www.africabib.org/rec.php?RID=191581356',
  'Publisher not confirmed via search summary',
  'restricted',
  'An academic historical monograph on Asaba (a neighbouring Anioma community, not Issele-Uku) up to 1885 — found via a bibliographic index (AfricaBib) and a library catalogue (AUC Library), not read directly. A strong-tier source in principle; recorded here as a research pointer.',
  'REVIEW'
),
(
  'dike-origins-niger-mission-1957',
  'Origins of the Niger Mission, 1841-1891',
  'book',
  'https://anglicanhistory.org/africa/ng/dike_origins1957.html',
  'K. Onwuka Dike (1957); hosted at anglicanhistory.org',
  'full_text_available',
  'A classic academic history of the Anglican Niger Mission (including Asaba, opened as a mission station in 1874) by a major Nigerian historian. Full text appears hosted at this URL per search results, though not opened directly in this environment.',
  'REVIEW'
),
(
  'cms-archive-niger-mission',
  'Church Missionary Society Archive — Nigeria/Niger Mission papers, 1857-1934',
  'archival_record',
  'https://www.libraries.rutgers.edu/databases/church-missionary-society-archive',
  'Church Missionary Society (archive hosted/indexed by multiple university libraries)',
  'restricted',
  'A large Anglican missionary archive covering the Niger Mission broadly (Asaba opened 1874) — a research pointer for the region''s Christian mission history generally, distinct from and not a source for this database''s existing Roman Catholic Diocese of Issele-Uku entry.',
  'REVIEW'
),
(
  'bodleian-royal-niger-company-papers',
  'Papers of the Royal Niger Company',
  'archival_record',
  'https://archives.bodleian.ox.ac.uk/repositories/2/resources/2005',
  'Bodleian Library, University of Oxford',
  'restricted',
  'Archival collection (1888-1930) confirming the Royal Niger Company''s documented administrative presence in the region during the period it operated from Asaba. A catalogue-level pointer, not read directly.',
  'REVIEW'
);

insert into public.historical_events (slug, title, description, date_from, date_to, date_display, evidence_type, confidence_level, verification_status)
values (
  'royal-niger-company-at-asaba',
  'Royal Niger Company period at Asaba (regional context, not Issele-Uku specifically)',
  'The Royal Niger Company, a British chartered company, was headquartered on the Niger at Asaba (a neighbouring Anioma town, not Issele-Uku) between approximately 1886 and 1900, before the Crown took over administration and established Native Courts across the Protectorate of Southern Nigeria in 1900. An earlier treaty was reportedly signed at Asaba on 30 August 1885 between the explorer William Balfour Baikie and a local chief. Recorded here as regional historical context for the colonial period immediately preceding the Ekumeku resistance movement (see that event) — no source found ties this specifically to Issele-Uku itself.',
  '1885-08-30',
  '1900-01-01',
  'c. 1885–1900 (Asaba specifically; regional context)',
  'DOCUMENTED', 'MEDIUM', 'REVIEW'
);

insert into public.event_sources (event_id, source_id)
select e.id, s.id from public.historical_events e, public.sources s
where e.slug = 'royal-niger-company-at-asaba'
  and s.slug in ('ohadike-asaba-ibo-polity-1885', 'bodleian-royal-niger-company-papers');

-- ============================================================================
-- FOURTH ADDENDUM — built from a research dossier the project owner supplied
-- (compiled by a separate research process, not by this environment's own
-- WebSearch). CRITICAL PROVENANCE NOTE, stated as plainly as possible:
-- none of the archival items below (National Archives of Nigeria case files,
-- Bodleian/SOAS/CMS/Kew/British Library/Cambridge/Library of Congress
-- holdings) were independently verified by re-searching or opening them in
-- this environment. They are recorded here exactly as the supplied dossier
-- described them — shelfmarks, case numbers and catalogue URLs included —
-- as a bibliography of real, checkable research leads, not as confirmed
-- content. Every one lands at REVIEW like everything else in this file, and
-- several carry an explicit note that even the dossier itself could not
-- confirm a detail (e.g. an exact date discrepancy on the Vaux Intelligence
-- Report). A person with real archive access should treat this as a
-- prioritised reading list, not a finished citation set.
--
-- Two genuinely new, directly citable facts (not requiring anyone to have
-- read an unread archival file) came out of this pass and are added as real
-- content below: named components of the Ine Aho festival from a 2018
-- interview with the Obi, and a Civil War-era trade route from a
-- peer-reviewed article's own oral-history fieldwork. A third addition is
-- not new content but a methodological correction: the widely-repeated
-- "1230 AD, founded by Prince Uwadiaie" narrative appears traceable to one
-- specific 1992 local history book, not to independent corroboration —
-- important enough to state explicitly on the existing founding-narrative
-- entry.
-- ============================================================================

insert into public.sources (slug, title, source_type, url, publisher, access_status, reliability_notes, verification_status) values
-- National Archives of Nigeria — town-specific Native/Clan Court files
(
  'nai-petition-elders-vs-obi',
  'Elders of Issele-Uku — Petition Against the Obi for Mismanagement of Affairs in the Town',
  'archival_record',
  'https://nationalarchivesofnigeria.org/index.php/elders-of-issele-uku-petition-by-against-the-obi-for-mismanagement-of-affairs-in-the-town',
  'National Archives of Nigeria',
  'restricted',
  'Catalogue entry only — no date or full archival reference is exposed on the online listing per the supplied dossier. If real, this would be an unusually direct primary record of internal town political conflict; the file itself has not been read or its existence independently re-confirmed by this environment. Request full reference and extent before relying on it for anything.',
  'REVIEW'
),
(
  'nai-case-23-1934-onweazu',
  'Issele-Uku Native Court Criminal Case No. 23/1934 (Native Court v. Onweazu)',
  'archival_record',
  'https://nationalarchivesofnigeria.org/index.php/onweazu-m-of-issele-uku-petition-by-re-issele-uku-native-court-criminal-case-no-23-1934-native-court-versus-onweazu-c-m-of-issele-uku-2',
  'National Archives of Nigeria',
  'restricted',
  'A named criminal case from Issele-Uku''s own Native Court, 1934, per catalogue listing. Not read — a research pointer for reconstructing colonial-era customary law and named residents, not a source for any specific claim in this database yet.',
  'REVIEW'
),
(
  'nai-case-11-37-adinmaolo',
  'Issele-Uku Native Court Civil Case No. 11/37 (Adinmaolo petition)',
  'archival_record',
  'https://nationalarchivesofnigeria.org/index.php/adinmaolo-m-of-issele-uku-petition-by-re-issele-uku-native-court-civil-case-no-11-37',
  'National Archives of Nigeria',
  'restricted',
  'A named 1937 civil dispute from Issele-Uku''s Native Court per catalogue listing. Not read.',
  'REVIEW'
),
(
  'nai-case-100-49-nkiti-odogwu',
  'Application for D.O.''s Review Order, Case No. 100/49 (Nkiti v. I. A. Odogwu of Issele-Uku)',
  'archival_record',
  'https://nationalarchivesofnigeria.org/index.php/application-for-d-os-review-order-case-no-100-49-nkiti-versus-i-a-odogwu-of-issele-uku%3Bisad?sf_culture=en',
  'National Archives of Nigeria',
  'restricted',
  'A 1949 District Officer review of a local dispute, per catalogue listing — useful in principle for how colonial administration supervised Native Court decisions. Not read.',
  'REVIEW'
),
(
  'nai-case-64-31-ikenwa',
  'Issele-Uku Native Court Civil Case No. 64/31 (Okwufuflueze v. Ikenwa)',
  'archival_record',
  'https://nationalarchivesofnigeria.org/index.php/mr-j-i-ikenwa-m-of-issele-uku-petition-by-re-issele-uku-native-court-civil-case-number-64-31-ukwufuflueze-f-of-issele-versus-ikenwa-m-of',
  'National Archives of Nigeria',
  'restricted',
  'A 1931 civil case naming a female litigant (Okwufuflueze) — per catalogue listing, potentially relevant to women''s property/marriage/litigation history in colonial Issele-Uku. Not read; a name spelling difference between the petition title and the versus-line in the dossier''s own transcription should be checked against the original file, not assumed.',
  'REVIEW'
),
(
  'nai-case-212-32-chianu',
  'Issele-Uku Native Court Civil Case No. 212/32 (Chianu v. Nwabuokei)',
  'archival_record',
  'https://nationalarchivesofnigeria.org/index.php/issele-uku-native-court-civil-case-number-212-32-chianu-f-of-issele-uku-versus-john-nwabuokei-m-of-issele-uku-and-vice-versa',
  'National Archives of Nigeria',
  'restricted',
  'A 1932 civil case naming a female litigant, per catalogue listing. Not read.',
  'REVIEW'
),
(
  'nai-ezechima-clan-court-8-38',
  'Ezechima Clan Court Criminal Case No. 8/38 (Nwabuje of Issele-Uku v. Obeleke and Okolie of Onicha-Ugbo)',
  'archival_record',
  'https://nationalarchivesofnigeria.org/index.php/obeleke-m-of-oni-cha-ugbo-petition-by-re-ezechima-clan-court-crim-case-no-8-38-nwabuje-m-of-issele-uku-versus-1-obeleke-m-and-2-okolie-m',
  'National Archives of Nigeria',
  'restricted',
  'Per catalogue listing, a 1938 case in the Ezechima Clan Court naming parties from both Issele-Uku and Onicha-Ugbo — if accurate, real documentary evidence of an inter-community clan-court structure linking the two. Not read or independently confirmed.',
  'REVIEW'
),
(
  'nai-case-15-54-appeal',
  'District Officer''s Appeal Court Case No. 15/54 (Ikeduba of Ogbentu Issele-Uku v. Okolie Odoh of Ogbidibo)',
  'archival_record',
  'https://www.nationalarchivesofnigeria.org/index.php/application-from-okolie-odolu-m-for-district-officers-appeal-court-case-no-15-54-ikeduba-and-one-othr-of-ogbentu-issele-uku-vs-okolie-odoh-odoh-m-of-ogbidibo?sf_culture=en',
  'National Archives of Nigeria',
  'restricted',
  'A 1954 appeal naming two of Issele-Uku''s own traditional quarters (Ogbentu, Ogbidibo) per catalogue listing — of interest since this database already has separate place records for the ten traditional quarters (Wikipedia-sourced) but "Ogbentu" does not match any of those ten names exactly, worth checking against the original file. Not read.',
  'REVIEW'
),
(
  'nai-vaux-asaba-intelligence-report-1934',
  'Vaux, H. — Intelligence Report on Asaba Clan, Asaba Division, Benin Province',
  'archival_record',
  'https://nationalarchivesofnigeria.org/index.php/intelligence-report-on-asaba-clan-asaba-division-benin-province-1934-by-h-vaux-assistant-district-officer',
  'National Archives of Nigeria',
  'restricted',
  'A foundational-type colonial intelligence report for the administrative division surrounding Issele-Uku. The supplied dossier itself flags an unresolved date discrepancy: NAI''s own catalogue says 1934, while at least one scholarly citation (Isichei) dates a Vaux Asaba report to 1936 — recorded here exactly as an open discrepancy, not resolved by guessing.',
  'REVIEW'
),
(
  'nai-simpson-akumazi-intelligence-report-1935',
  'Simpson, J. M. — Intelligence Report on Akumazi Clan, Agbor District, Asaba Division, Benin Province',
  'archival_record',
  'https://nationalarchivesofnigeria.org/',
  'National Archives of Nigeria',
  'restricted',
  'A neighbouring-clan intelligence report (1935) in the same administrative division as Issele-Uku, useful for comparison — not itself about Issele-Uku. Catalogue URL is the archive''s general search page, not a direct item link, per the supplied dossier.',
  'REVIEW'
),
(
  'nln-southern-nigeria-annual-report-1908',
  'Annual Report of the Colony of Southern Nigeria for the Year 1908',
  'archival_record',
  'https://nigeriareposit.nln.gov.ng/items/0684bc38-1cc6-4bec-abb4-b749d0a797fb',
  'National Repository of Nigeria / National Library of Nigeria',
  'full_text_available',
  'A digitised official annual report for the whole Southern Nigeria protectorate, pre-dating Issele-Uku-specific administrative detail — broad period context only, per the supplied dossier.',
  'REVIEW'
),
(
  'nml-ethnographic-survey-ibo-1936-1945',
  'International African Institute — Ethnographic Survey: Draft Section of the Ibo Speaking Peoples of Southern Nigeria',
  'archival_record',
  'https://lagosmuseumarchives.ng/intelligence_reports/general_topics',
  'National Museum Lagos Library and Archives',
  'full_text_available',
  'Per the supplied dossier, covers Northern/Western/Eastern Ibo classification generally (1936-1945) — relevant to the wider Western Igbo/Enuani area, not Issele-Uku specifically. The museum''s digital archive states a CC BY-NC-ND 4.0 licence on its published items, per the dossier.',
  'REVIEW'
),
(
  'nml-native-festivals-calendar-1941-1945',
  'Native Festivals Calendar, 1941-1945',
  'archival_record',
  'https://lagosmuseumarchives.ng/intelligence_reports/general_topics',
  'National Museum Lagos Library and Archives',
  'full_text_available',
  'Per the supplied dossier''s catalogue description, correspondence recording native festivals of Igbo clan communities where schools were located — worth checking specifically for Issele-Uku/Ezechima/Aniocha entries, not yet confirmed to mention the town.',
  'REVIEW'
),
(
  'loc-pilgrim-baptist-mission-issele-uku',
  'National Baptist Convention, U.S.A., Foreign Mission Board Records — "Pilgrim Baptist Mission, Issele-Uku, Nigeria, 1958-1959"',
  'archival_record',
  'https://findingaids.loc.gov/repositories/19/archival_objects/4966031',
  'Library of Congress, Manuscript Division',
  'restricted',
  'A folder explicitly titled with Issele-Uku''s own name, Box 1 per the supplied dossier''s finding-aid reference — a genuinely town-specific primary-source target for a Baptist mission presence not otherwise represented in this database (the diocese entries here are Roman Catholic). Not read; existence not independently re-confirmed by this environment.',
  'REVIEW'
),
(
  'bodleian-asaba-division-annual-report-1947',
  'Cohen — Annual Report on Asaba Division, 1947',
  'archival_record',
  'https://archives.bodleian.ox.ac.uk/',
  'Bodleian Library, University of Oxford (former Rhodes House African collections)',
  'restricted',
  'Per the supplied dossier, shelfmark MSS. Afr. 727 h, cited by the scholar Elizabeth Isichei. A divisional annual report that would in principle cover Issele-Uku as part of Asaba Division — not read, shelfmark not independently re-verified by this environment.',
  'REVIEW'
),
(
  'bodleian-oxfam-refugee-resettlement-1969',
  'Oxfam — Nigeria: equipment for resettlement of refugees in Ibusa and Asaba, 1969-1971',
  'archival_record',
  'https://archives.bodleian.ox.ac.uk/repositories/2/archival_objects/780081',
  'Bodleian Library, University of Oxford (Oxfam Project Files)',
  'restricted',
  'Post-Civil-War humanitarian documentation for neighbouring Anioma communities (Ibusa, Asaba — not Issele-Uku itself), per the supplied dossier. Shelfmark given as MS. Oxfam PRF NIG 042.',
  'REVIEW'
),
(
  'soas-henry-lyon-papers',
  'Lyon, Henry — Journal and Papers',
  'archival_record',
  'https://archives.soas.ac.uk/records/MS_380402',
  'SOAS University of London',
  'restricted',
  'Personal colonial papers (1897-1917) of an officer in the Niger Coast Protectorate/Benin City administration, per the supplied dossier — regional colonial-administration context, not about Issele-Uku specifically. Shelfmark MS 380402.',
  'REVIEW'
),
(
  'cms-macaulay-report-asaba-1889',
  'Macaulay, H. S. — Report on Asaba, 31 December 1889',
  'archival_record',
  'https://churchmissionsociety.org/library-and-archives/church-mission-society-archives/',
  'Church Missionary Society, Niger Mission (Cadbury Research Library, University of Birmingham)',
  'restricted',
  'A near-contemporary Anglican mission report on Asaba (not Issele-Uku), identified via the scholar Elizabeth Isichei''s own archival footnotes per the supplied dossier. Reference given as Niger Mission 1890/29.',
  'REVIEW'
),
(
  'cms-phillips-crowther-correspondence-1875',
  'Phillips to Crowther, 8 October 1875',
  'archival_record',
  'https://churchmissionsociety.org/library-and-archives/church-mission-society-archives/',
  'Church Missionary Society Niger Mission correspondence (Cadbury Research Library)',
  'restricted',
  'Early Anglican missionary correspondence in the lower Niger/Asaba area, per the supplied dossier (citing Isichei). Reference given as CA3/031. Not about Issele-Uku specifically.',
  'REVIEW'
),
(
  'cms-crowther-niger-mission-report-1880',
  'Crowther, Samuel Ajayi — Report for 1880',
  'archival_record',
  'https://churchmissionsociety.org/library-and-archives/church-mission-society-archives/',
  'Church Missionary Society Niger Mission (Cadbury Research Library)',
  'restricted',
  'Bishop Crowther''s own Niger Mission reporting for 1880, per the supplied dossier (citing Isichei). Reference given as G3A3/01.',
  'REVIEW'
),
(
  'sma-zappa-letter-1888',
  'Zappa, Carlo — letter to Superior General, 4 October 1888',
  'archival_record',
  '',
  'Société des Missions Africaines Archives, Rome',
  'restricted',
  'A Catholic missionary letter from the same year the Diocese of Issele-Uku''s own retrospective history dates the first Mass in the wider diocesan territory (5 March 1888) — potentially useful corroboration of that date, per the supplied dossier (citing Isichei). Reference given as 14/80302 15829. No public URL available; contact the SMA archive directly.',
  'REVIEW'
),
(
  'tna-co592-southern-nigeria-annual-reports',
  'Colonial Office and successors — Annual Reports (Southern Nigeria), CO 592 series',
  'archival_record',
  'https://discovery.nationalarchives.gov.uk/details/r/C11669495',
  'The National Archives (UK), Kew',
  'restricted',
  'A systematic administrative-reporting series for Southern Nigeria, especially 1906-1913 per the supplied dossier — a route to context, not an Issele-Uku-specific item.',
  'REVIEW'
),
(
  'bl-western-region-map-1957',
  'Survey Department, Western Region, Nigeria — Outline Map of Nigeria, Western Region',
  'map',
  'https://searcharchives.bl.uk/',
  'British Library',
  'restricted',
  'A 1957 map of Nigeria''s Western Region, useful for placing Issele-Uku in its pre-Mid-West-Region administrative/transport landscape, per the supplied dossier. Shelfmark given as IOR/X/14724.',
  'REVIEW'
),
(
  'cambridge-cms-photo-asaba-1962',
  'Church Missionary Society Photograph Collection — "Fish from ponds, Asaba Rural Training College"',
  'photograph',
  'https://archivesearch.lib.cam.ac.uk/repositories/2/archival_objects/171069',
  'Cambridge University Library',
  'restricted',
  'A dated 1962 photograph from the Asaba (not Issele-Uku) educational/mission environment, per the supplied dossier. Reference given as GBR/0115/RCS/CMS/10/3/45.',
  'REVIEW'
),
(
  'guardian-2017-engineer-king',
  'Omohinmin, Gabriel — "The Making of a ''Special Engineer King'' in Issele-Uku"',
  'newspaper',
  'https://guardian.ng/sunday-magazine/the-making-of-a-special-engineer-king-in-issele-uku/',
  'The Guardian Nigeria',
  'external_access',
  'Detailed 2017 contemporary coverage of Obi Nduka Ezeagwuna''s accession, per the supplied dossier — notes this covers the modern monarchy specifically; any older historical-origin claims repeated within the article still need independent evidence of their own, same standard as everywhere else in this file.',
  'REVIEW'
),
(
  'punch-2017-obi-interview',
  'Okpare, Ovie (interviewer) — "At first, I was embarrassed to see elders bow before me – 25-year-old Obi of Issele-Uku"',
  'newspaper',
  'https://punchng.com/at-first-i-was-embarrassed-to-see-elders-bow-before-me-25-year-old-obi-of-issele-uku/',
  'The Punch',
  'external_access',
  'A direct 2017 interview with the reigning Obi, per the supplied dossier — statements attributable to him personally on accession and cultural preservation goals.',
  'REVIEW'
),
(
  'vanguard-2018-ine-aho-components',
  '"Culture, traditional heritage our pride — Issele Uku Monarch"',
  'newspaper',
  'https://www.vanguardngr.com/2018/09/culture-traditional-heritage-our-pride-issele-uku-monarch/',
  'Vanguard News',
  'external_access',
  'A 2018 article in which the Obi names specific component activities of the Ine Aho festival (Izu Afiachi, Ilo Chi Ikpala, Ilo Chi Ikolo, Mgba Ututu, Iba Nzu, Ihu Onicha), per the supplied dossier — used directly to enrich the existing Ine Aho culture entry below.',
  'REVIEW'
),
(
  'thisday-2019-inne-festival-programme',
  '"Issele Uku Plan Inne Festival to Showcase Obi Nduka"',
  'newspaper',
  'https://www.thisdaylive.com/2019/08/31/issele-uku-plan-inne-festival-to-showcase-obi-nduka/',
  'THISDAY',
  'external_access',
  'A 2019 article giving a detailed programme for that year''s festival, including reported diaspora participation, per the supplied dossier.',
  'REVIEW'
),
-- Academic secondary sources
(
  'ohadike-anioma-social-history-1994',
  'Ohadike, Don C. — Anioma: A Social History of the Western Igbo People',
  'book',
  'https://archive.org/details/aniomasocialhist0000ohad',
  'Ohio University Press, 1994',
  'restricted',
  'Described in the supplied dossier as the single most important broad academic monograph on Anioma/Western Igbo social history. Not read directly by this environment.',
  'REVIEW'
),
(
  'ohadike-ekumeku-movement-1991',
  'Ohadike, Don C. — The Ekumeku Movement: Western Igbo Resistance to the British Conquest of Nigeria, 1883-1914',
  'book',
  'https://archive.org/details/isbn_9780821409923',
  'Ohio University Press, 1991',
  'restricted',
  'A dedicated academic monograph on exactly the resistance movement already recorded in this database''s ekumeku-resistance-movement event — per the supplied dossier, a strong upgrade to that event''s evidentiary base if its content is read and checked. Not read directly by this environment; linked to that event as a citation to follow up, not as independently confirmed content.',
  'REVIEW'
),
(
  'isichei-1969-asaba-polity-jstor',
  'Isichei, Elizabeth — "Historical Change in an Ibo Polity: Asaba to 1885"',
  'academic_paper',
  'https://www.jstor.org/stable/179675',
  'The Journal of African History, vol. 10 (1969), pp. 421-438',
  'restricted',
  'Per the supplied dossier, this peer-reviewed article''s own footnotes are themselves a map of exact CMS/SMA/Foreign Office/NAI/Oxford archival references — several of the CMS/SMA items in this addendum were identified via this route. Paywalled; not read directly.',
  'REVIEW'
),
(
  'nwaokocha-2015-anioma-identity-jstor',
  'Nwaokocha, Odigwe A. — "An Interrogation of the Anioma Identity"',
  'academic_paper',
  'https://www.jstor.org/stable/24768927',
  'Journal publication venue not confirmed via supplied dossier',
  'restricted',
  'Per the supplied dossier, this article''s bibliography points to both Nwaobi''s 1973 Catholic history of Issele-Uku and Akeh-Osu''s 1992 Issele-Uku history — possibly the same underlying work as the ResearchGate-hosted "researchgate-anioma-origin-identity" source already in this file, or a related/different paper by the same author; not confirmed either way. Paywalled; not read.',
  'REVIEW'
),
(
  'afigbo-1983-igbo-origins-jstor',
  'Afigbo, A. E. — "Traditions of Igbo Origins: A Comment"',
  'academic_paper',
  'https://www.jstor.org/stable/3171687',
  'Journal publication venue not confirmed via supplied dossier (1983)',
  'restricted',
  'A methodological piece, per the supplied dossier, cautioning against treating migration/origin oral traditions as literal political chronology — directly relevant to how this database already handles the disputed founding-of-issele-uku entry. Paywalled; not read.',
  'REVIEW'
),
(
  'bird-2011-asaba-massacres-jstor',
  'Bird, S. Elizabeth — "The History and Legacy of the Asaba, Nigeria, Massacres"',
  'academic_paper',
  'https://www.jstor.org/stable/41304792',
  'Journal publication venue not confirmed via supplied dossier (2011)',
  'restricted',
  'Peer-reviewed treatment of the 1967 Asaba massacres during the Nigerian Civil War — regional Anioma history, not about Issele-Uku specifically. Paywalled; not read.',
  'REVIEW'
),
(
  'ayandele-1968-royal-niger-company-jstor',
  'Ayandele, E. A. — "Society and the Royal Niger Company, 1886-1900"',
  'academic_paper',
  'https://www.jstor.org/stable/41856763',
  'Journal publication venue not confirmed via supplied dossier (1968)',
  'restricted',
  'Analysis of society under Royal Niger Company administration, per the supplied dossier — relevant background for this database''s royal-niger-company-at-asaba event. Paywalled; not read.',
  'REVIEW'
),
(
  'ojo-2013-womens-war-jstor',
  'Ojo, Olatunji — "''Shaving of a woman''s head'': Isinmo and the Igbo women''s war on forced marriages in Southern Nigeria, 1900-1936"',
  'academic_paper',
  'https://www.jstor.org/stable/43860469',
  'Canadian Journal of African Studies, vol. 47, no. 3 (2013)',
  'restricted',
  'Engages the Asaba district/Western Igbo environment specifically, per the supplied dossier — a possible companion piece for interpreting the Native Court cases above involving women. Paywalled; not read.',
  'REVIEW'
),
(
  'igbafe-1978-benin-british-administration',
  'Igbafe, Philip Aigbona — Benin Under British Administration: The Impact of Colonial Rule on an African Kingdom, 1897-1938',
  'book',
  'https://books.google.com/books/about/Benin_Under_British_Administration.html?id=2FR0AAAAMAAJ',
  'Humanities Press, 1978',
  'restricted',
  'Standard academic study of colonial Benin, per the supplied dossier — relevant background for Issele-Uku''s claimed relationship with the Benin kingdom, not itself about Issele-Uku. Not read.',
  'REVIEW'
),
(
  'bird-ottanelli-2017-asaba-massacre-book',
  'Bird, S. Elizabeth, and Fraser M. Ottanelli — The Asaba Massacre: Trauma, Memory, and the Nigerian Civil War',
  'book',
  'https://www.cambridge.org/core/books/asaba-massacre/what-happened-at-asaba/E250E2E81FC43F6229FEDC3C5FEAE812',
  'Cambridge University Press, 2017',
  'restricted',
  'Detailed academic treatment of the 1967 Asaba massacre and its memory — regional Civil War history for the Anioma area, not Issele-Uku specifically, per the supplied dossier. Not read.',
  'REVIEW'
),
(
  'nwaokocha-2021-wartime-trade-bjas',
  'Nwaokocha, Odigwe A. — "Exchange over Troubled Waters: The Anioma and the War-Time Trade with Biafra, 1967-1970"',
  'academic_paper',
  'https://pdfs.semanticscholar.org/3b78/0223a9da4183d0611d6bb56ae90ea422592c.pdf',
  'Brazilian Journal of African Studies, vol. 6, no. 12 (2021), pp. 69-86',
  'full_text_available',
  'Per the supplied dossier, this article identifies an Agbor-Issele Uku-Illah wartime trade route and a second Agbor-Issele Uku-Issele Azagba route, based on oral-history fieldwork including a named Issele-Uku trader (Achasia Nwose) interviewed 8 April 2009. Used directly below for a new, explicitly oral-tradition-labelled historical event. An open PDF mirror appears available at this URL per the dossier; not opened directly by this environment.',
  'REVIEW'
),
(
  'fenske-2014-rubber-colonial-benin',
  'Fenske, James — "Trees, Tenure and Conflict: Rubber in Colonial Benin"',
  'academic_paper',
  'https://wrap.warwick.ac.uk/85603/1/WRAP_S0304387813000709-main.pdf',
  'Journal of Development Economics, vol. 110 (2014), pp. 226-238',
  'full_text_available',
  'Peer-reviewed economic history of colonial Benin using British and Nigerian archives, per the supplied dossier — regional background, not about Issele-Uku specifically. Open-access PDF at this URL; not opened directly by this environment.',
  'REVIEW'
),
-- Local histories (the likely root of several widely-repeated community claims)
(
  'akeh-osu-1992-issele-uku-history',
  'Akeh-Osu, Chris Afumata — The History of Great Isi-Ile-Uku (Issele-Uku) Kingdom: Founded in 1230 A.D. by Ogie (King) Uwadiaie ... and the Emergence of the Mighty Umu-Ezechimas',
  'book',
  'https://books.google.com/books/about/The_History_of_Great_Isi_ile_Uku_Issele.html?id=UOVq0AEACAAJ',
  'Etukokwu, Onitsha, 1992',
  'restricted',
  'The most directly focused published local history of Issele-Uku identified, per the supplied dossier — and very likely the ultimate source of the "1230 AD, founded by Prince Uwadiaie" narrative already recorded (as DISPUTED/LOW) in this database''s founding-of-issele-uku event, given the claim is embedded in this book''s own title. Community websites and possibly Wikipedia repeating this narrative are plausibly repeating this one book, not independently confirming it — an important distinction the supplied dossier explicitly flags, added here as a methodological note rather than upgrading the underlying claim''s confidence. Not read directly by this environment; existence confirmed independently by both Google Books and WorldCat per the dossier.',
  'REVIEW'
),
(
  'okpuno-1968-eze-chima-history',
  'Okpuno, Lawrence N. — A Short History of Eze-Chima: Idumuje, Odi Ani Clans and Akwukwu-Igbo, Ukala, Illah Towns in Asaba Division',
  'book',
  'https://books.google.com/books/about/A_Short_History_of_Eze_Chima.html?id=NL7iAAAAMAAJ',
  'Midwest Newspapers Corporation, 1968',
  'restricted',
  'An earlier (1968) local history of the Eze-Chima/Ezechima dynasty and related western Niger communities, per the supplied dossier, useful as an independent-ish comparison point to Akeh-Osu''s later 1992 account, though not necessarily independent in its own sourcing. Not read directly by this environment.',
  'REVIEW'
),
(
  'nwaobi-1973-catholic-history-issele-uku',
  'Nwaobi — A Brief History of Catholic Church in Issele-Uku',
  'book',
  '',
  'Sketch Publishing Co., Ibadan, 1973',
  'restricted',
  'A locally-focused Catholic mission history predating the 1973 creation of the Diocese of Issele-Uku, identified via its citation in Nwaokocha''s scholarly bibliography per the supplied dossier — no public URL available; the project owner would need to contact the diocese or a Nigerian library directly. Not read.',
  'REVIEW'
);

-- New, directly citable fact #1: the diocesan retrospective's own dating of
-- the first Catholic Mass in the wider diocesan territory, corroborated in
-- year (not exact date) by an independent missionary letter from the same
-- year.
insert into public.historical_events (slug, title, description, date_exact, date_display, evidence_type, confidence_level, verification_status)
values (
  'first-catholic-mass-diocesan-territory',
  'Traditionally-dated first Catholic Mass in the diocesan territory',
  'The Roman Catholic Diocese of Issele-Uku''s own retrospective history dates the first Mass celebrated in what later became its diocesan territory to 5 March 1888, naming Fr Carlo Zappa (a Society of African Missions priest) as the first missionary. A letter from Zappa to his Superior General dated 4 October 1888 — the same year — exists in the Société des Missions Africaines archive in Rome per a supplied research dossier, offering same-year (though not same-date) corroboration from outside the diocese''s own institutional memory. This predates the diocese''s own formal creation in 1973 (see that separate event) by 85 years, and is not itself specifically about Issele-Uku town as opposed to the wider mission territory.',
  '1888-03-05',
  '5 March 1888 (per diocesan tradition)',
  'DOCUMENTED', 'LOW', 'REVIEW'
);

insert into public.event_sources (event_id, source_id)
select e.id, s.id from public.historical_events e, public.sources s
where e.slug = 'first-catholic-mass-diocesan-territory'
  and s.slug in ('issele-uku-diocese-history', 'sma-zappa-letter-1888', 'cms-macaulay-report-asaba-1889');

-- New, directly citable fact #2: a Civil War-era trade route, explicitly
-- labelled ORAL_TRADITION since the underlying evidence is a single named
-- informant's 2009 account, even though relayed through a peer-reviewed
-- article.
insert into public.historical_events (slug, title, description, date_from, date_to, date_display, evidence_type, confidence_level, verification_status)
values (
  'civil-war-trade-route-through-issele-uku',
  'A reported wartime trade route through Issele-Uku (oral history)',
  'A peer-reviewed academic article on Anioma''s war-time trade during the Nigerian Civil War (1967-1970) identifies a trade route running Agbor-Issele Uku-Illah, and a second route Agbor-Issele Uku-Issele Azagba, based on oral-history fieldwork. The specific source for this claim is a named Issele-Uku trader, Achasia Nwose, interviewed on 8 April 2009 — meaning this is fundamentally one person''s recollection of events roughly 40 years earlier, published by a scholar, not a contemporary documentary record. Recorded as ORAL_TRADITION for that reason, not DOCUMENTED.',
  '1967-01-01',
  '1970-01-01',
  '1967-1970 (approximate; based on a single 2009 oral history interview)',
  'ORAL_TRADITION', 'LOW', 'REVIEW'
);

insert into public.event_sources (event_id, source_id)
select e.id, s.id from public.historical_events e, public.sources s
where e.slug = 'civil-war-trade-route-through-issele-uku' and s.slug = 'nwaokocha-2021-wartime-trade-bjas';

-- New, regional-context event: the 1967 Asaba massacre. Explicitly scoped
-- as Asaba (not Issele-Uku), same discipline as the Royal Niger Company
-- entry — real, grave, and well-documented Anioma Civil War history, not
-- attributed to the town itself absent any source tying it there.
insert into public.historical_events (slug, title, description, date_exact, date_display, evidence_type, confidence_level, verification_status)
values (
  'asaba-massacre-1967-regional-context',
  'Asaba Massacre, October 1967 (regional context, not Issele-Uku specifically)',
  'In October 1967, during the early Nigerian Civil War, federal Nigerian troops killed a large number of Igbo civilians at Asaba (a neighbouring Anioma town, not Issele-Uku) after federal forces retook the town from Biafran control. This is documented in peer-reviewed academic literature, per a supplied research dossier — a Journal of African History-adjacent-tier article and a dedicated Cambridge University Press monograph. Recorded here as grave, well-documented regional Civil War history for the Anioma area Issele-Uku belongs to, not because any source ties this event to Issele-Uku itself specifically — none was found.',
  '1967-10-07',
  'October 1967 (Asaba specifically; regional context)',
  'DOCUMENTED', 'MEDIUM', 'REVIEW'
);

insert into public.event_sources (event_id, source_id)
select e.id, s.id from public.historical_events e, public.sources s
where e.slug = 'asaba-massacre-1967-regional-context'
  and s.slug in ('bird-2011-asaba-massacres-jstor', 'bird-ottanelli-2017-asaba-massacre-book');

-- Enrichment: named components of the Ine Aho festival, from a direct 2018
-- interview with the reigning Obi, plus a note on 2019 diaspora
-- participation. Appends to the existing HIGH-confidence entry rather than
-- replacing it.
update public.culture_categories
set description = description || ' A 2018 interview with the reigning Obi names specific component activities of the festival: Izu Afiachi, Ilo Chi Ikpala, Ilo Chi Ikolo, Mgba Ututu, Iba Nzu, and Ihu Onicha — the latter already referenced above via earlier sourcing, now corroborated by this second, independent interview. A 2019 article additionally reports diaspora participation in that year''s festival programme, consistent with this project''s own observation (see the Issele-Uku Union UK source elsewhere in this database) that the diaspora maintains active interest in the festival.'
where slug = 'ine-aho-festival';

-- culture_categories has no dedicated source-join table (see ARCHITECTURE.md
-- note on Phase 4), so citations for this update are recorded in the
-- description text itself, matching every other culture_categories entry
-- in this file.

-- Link Ohadike's dedicated Ekumeku monograph to the existing Ekumeku event
-- as a strong additional citation.
insert into public.event_sources (event_id, source_id)
select e.id, s.id from public.historical_events e, public.sources s
where e.slug = 'ekumeku-resistance-movement' and s.slug = 'ohadike-ekumeku-movement-1991';

-- Link additional Royal-Niger-Company-era sources to the existing entry.
insert into public.event_sources (event_id, source_id)
select e.id, s.id from public.historical_events e, public.sources s
where e.slug = 'royal-niger-company-at-asaba'
  and s.slug in ('ayandele-1968-royal-niger-company-jstor', 'bodleian-asaba-division-annual-report-1947');

-- Link new monarch-related press sources to the existing (still-REVIEW,
-- still requiring palace confirmation) current-Obi record.
insert into public.monarch_sources (monarch_id, source_id)
select m.id, s.id from public.monarchs m, public.sources s
where m.slug = 'nduka-ezeagwuna-ii' and s.slug in ('guardian-2017-engineer-king', 'punch-2017-obi-interview');

-- Methodological correction to the existing disputed founding-narrative
-- event: the "1230 AD / Prince Uwadiaie" claim is very likely traceable to
-- one specific 1992 local history book, not to independent confirmation
-- across the sources that repeat it. This does not change the DISPUTED/LOW
-- rating — it explains more precisely *why* that rating is appropriate.
update public.historical_events
set description = description || ' A supplied research dossier makes an important methodological point about this narrative''s likely evidentiary lineage: the specific claim of an 1230 AD founding by "Prince Uwadiaie" appears in the title of a 1992 local history book (Akeh-Osu, cited elsewhere in this database''s sources), and websites repeating the same specific claim (including, plausibly, the Wikipedia article already cited here) may simply be repeating that one book rather than independently confirming it. Community/oral accounts repeating a single written source are not the same as multiple independent lines of evidence agreeing — this does not make the claim false, but it does mean the number of places it appears should not be mistaken for corroboration.'
where slug = 'founding-of-issele-uku';

insert into public.event_sources (event_id, source_id)
select e.id, s.id from public.historical_events e, public.sources s
where e.slug = 'founding-of-issele-uku'
  and s.slug in ('akeh-osu-1992-issele-uku-history', 'okpuno-1968-eze-chima-history', 'nwaokocha-2015-anioma-identity-jstor');
