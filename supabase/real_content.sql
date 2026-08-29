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
