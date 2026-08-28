import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseArchiveSearchParams,
  escapePostgrestOrValue,
  buildArchiveSearchFilter,
  archiveOffset,
  ARCHIVE_PAGE_SIZE,
} from "./search.ts";

test("parseArchiveSearchParams: defaults with no params", () => {
  const f = parseArchiveSearchParams({});
  assert.equal(f.q, null);
  assert.equal(f.recordType, null);
  assert.equal(f.evidenceType, null);
  assert.equal(f.sort, "recent");
  assert.equal(f.page, 1);
});

test("parseArchiveSearchParams: trims whitespace-only q to null", () => {
  const f = parseArchiveSearchParams({ q: "   " });
  assert.equal(f.q, null);
});

test("parseArchiveSearchParams: rejects an invalid evidence value rather than passing it through", () => {
  const f = parseArchiveSearchParams({ evidence: "TOTALLY_MADE_UP" });
  assert.equal(f.evidenceType, null);
});

test("parseArchiveSearchParams: accepts a valid evidence value", () => {
  const f = parseArchiveSearchParams({ evidence: "ORAL_TRADITION" });
  assert.equal(f.evidenceType, "ORAL_TRADITION");
});

test("parseArchiveSearchParams: page defaults to 1 for zero, negative, or non-numeric input", () => {
  assert.equal(parseArchiveSearchParams({ page: "0" }).page, 1);
  assert.equal(parseArchiveSearchParams({ page: "-5" }).page, 1);
  assert.equal(parseArchiveSearchParams({ page: "not-a-number" }).page, 1);
  assert.equal(parseArchiveSearchParams({ page: "3.5" }).page, 1);
});

test("parseArchiveSearchParams: accepts a valid page number", () => {
  assert.equal(parseArchiveSearchParams({ page: "4" }).page, 4);
});

test("parseArchiveSearchParams: takes the first value when a param repeats", () => {
  const f = parseArchiveSearchParams({ q: ["first", "second"] });
  assert.equal(f.q, "first");
});

test("archiveOffset: page 1 starts at 0", () => {
  assert.equal(archiveOffset({ page: 1 }), 0);
});

test("archiveOffset: page 3 skips two full pages", () => {
  assert.equal(archiveOffset({ page: 3 }), ARCHIVE_PAGE_SIZE * 2);
});

test("escapePostgrestOrValue: wraps in quotes", () => {
  assert.equal(escapePostgrestOrValue("hello"), '"hello"');
});

test("escapePostgrestOrValue: escapes embedded double quotes", () => {
  assert.equal(escapePostgrestOrValue('say "hi"'), '"say \\"hi\\""');
});

test("escapePostgrestOrValue: escapes backslashes before quoting quotes (order matters)", () => {
  // If quotes were escaped before backslashes, the backslash just added
  // by escaping the quote would itself get doubled — this pins the
  // correct order (backslashes first).
  assert.equal(escapePostgrestOrValue('a\\"b'), '"a\\\\\\"b"');
});

test("buildArchiveSearchFilter: a comma/period in the search term cannot inject an extra OR condition", () => {
  const malicious = "foo,updated_at.eq.2000-01-01,or(title.eq.x)";
  const filter = buildArchiveSearchFilter(malicious);
  // A naive filter.split(",") would be fooled by the literal comma
  // sitting inside the quoted value, so instead count actual condition
  // starts: each of the 5 search columns should produce exactly one
  // `<col>.ilike."` regardless of what the (quoted, literal) search term
  // contains.
  const conditionStarts = filter.match(/\.ilike\."/g) ?? [];
  assert.equal(conditionStarts.length, 5);
  // And the malicious text must appear as one literal, quoted value —
  // not parsed into extra conditions.
  assert.ok(filter.includes(`"%${malicious}%"`));
});

test("buildArchiveSearchFilter: covers every intended search column exactly once", () => {
  const filter = buildArchiveSearchFilter("issele");
  for (const col of ["title", "subtitle", "description", "abstract", "source_name"]) {
    assert.ok(filter.includes(`${col}.ilike.`), `expected ${col} to be searched`);
  }
});
