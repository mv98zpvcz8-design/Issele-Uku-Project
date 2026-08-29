import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTimelineSearchParams } from "./search.ts";

test("parseTimelineSearchParams: defaults with no params", () => {
  const f = parseTimelineSearchParams({});
  assert.equal(f.q, null);
  assert.equal(f.evidenceType, null);
});

test("parseTimelineSearchParams: rejects an invalid evidence value", () => {
  const f = parseTimelineSearchParams({ evidence: "NOT_REAL" });
  assert.equal(f.evidenceType, null);
});

test("parseTimelineSearchParams: accepts a valid evidence value", () => {
  const f = parseTimelineSearchParams({ evidence: "DISPUTED" });
  assert.equal(f.evidenceType, "DISPUTED");
});
