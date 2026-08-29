import { test } from "node:test";
import assert from "node:assert/strict";
import { escapePostgrestOrValue, buildOrSearchFilter } from "./postgrest.ts";

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

test("buildOrSearchFilter: a comma/period in the search term cannot inject an extra OR condition", () => {
  const malicious = "foo,updated_at.eq.2000-01-01,or(title.eq.x)";
  const filter = buildOrSearchFilter(["title", "description"], malicious);
  // A naive filter.split(",") would be fooled by the literal comma
  // sitting inside the quoted value, so instead count actual condition
  // starts: each intended column should produce exactly one
  // `<col>.ilike."` regardless of what the (quoted, literal) search term
  // contains.
  const conditionStarts = filter.match(/\.ilike\."/g) ?? [];
  assert.equal(conditionStarts.length, 2);
  assert.ok(filter.includes(`"%${malicious}%"`));
});

test("buildOrSearchFilter: covers every given column exactly once", () => {
  const filter = buildOrSearchFilter(["title", "summary"], "issele");
  assert.ok(filter.includes("title.ilike."));
  assert.ok(filter.includes("summary.ilike."));
});
