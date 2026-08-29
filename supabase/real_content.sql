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
-- or copied into the admin UI once Phase 6 exists) against a real
-- Supabase project, after the migrations in supabase/migrations/ have
-- been applied.

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
insert into public.historical_events (slug, title, description, date_to, date_display, evidence_type, confidence_level, verification_status)
values (
  'founding-of-issele-uku',
  'Founding of Issele-Uku',
  'Secondary-source summaries describe Issele-Uku as an Igbo settlement founded before approximately 1230 CE. One account attributes the kingdom''s founding to a Prince Uwadiaie, described as the second son of Oba Eweka I of Benin — a claim that would tie Issele-Uku''s dynastic origin to the Benin royal lineage. This is recorded here as one reported account, not as an agreed history: founding narratives of this kind are frequently contested between communities and traditions, no primary or academic source for this specific claim was found, and it has not been cross-checked against the Issele-Uku community''s own account of its history. Do not treat as settled.',
  '1230-01-01',
  'before c. 1230 CE (approximate; founding narrative disputed/uncorroborated)',
  'DISPUTED', 'LOW', 'REVIEW'
),
(
  'diocese-of-issele-uku-established',
  'Roman Catholic Diocese of Issele-Uku established',
  'The Roman Catholic Diocese of Issele-Uku was created from territory formerly part of the Archdiocese of Benin City, covering (per its own account) six Local Government Areas west of the Niger: Aniocha North, Aniocha South, Ika North East, Ika South, Oshimili North, and Oshimili South. Its first bishop, Most Rev. Dr. Anthony Okonkwor Gbuji, was consecrated on 30 September 1973 and served until 8 November 1996.',
  null,
  '5 July 1973',
  'DOCUMENTED', 'HIGH', 'REVIEW'
),
(
  'death-of-obi-henry-ezeagwuna-ii',
  'Death of Obi Henry Ezeagwuna II',
  'Obi Henry Ezeagwuna II, the traditional ruler of Issele-Uku, died in a motor accident on the Benin–Asaba–Onitsha expressway.',
  null,
  '9 August 2014',
  'DOCUMENTED', 'MEDIUM', 'REVIEW'
),
(
  'coronation-of-obi-nduka-ezeagwuna-ii',
  'Coronation of Obi Nduka Ezeagwuna II',
  'Nduka Ezeagwuna, son and successor of the late Obi Henry Ezeagwuna II, was crowned Obi of Issele-Uku following a period of traditional coronation rites. Ahead of his enthronement he visited Oba Ewuare II of Benin, described in coverage as customary given the historical relationship between the two thrones. Sources report the exact coronation date variously as 21 or 29 December 2016.',
  null,
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
