import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify } from "./slugify.ts";

test("slugify: lowercases and hyphenates", () => {
  assert.equal(slugify("Obi Nduka Ezeagwuna II"), "obi-nduka-ezeagwuna-ii");
});

test("slugify: collapses non-alphanumeric runs into one hyphen", () => {
  assert.equal(slugify("Ine Aho / Ine Festival"), "ine-aho-ine-festival");
});

test("slugify: trims leading/trailing hyphens", () => {
  assert.equal(slugify("  -- Akwa Ocha -- "), "akwa-ocha");
});
