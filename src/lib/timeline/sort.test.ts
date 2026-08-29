import { test } from "node:test";
import assert from "node:assert/strict";
import { sortEventsChronologically } from "./sort.ts";

test("sortEventsChronologically: an event with only date_exact sorts correctly against date_from events (not dumped at the end)", () => {
  const events = [
    { title: "Late event (date_from)", date_from: "1990-01-01", date_exact: null },
    { title: "Early event (date_exact only)", date_from: null, date_exact: "1800-01-01" },
  ];
  const sorted = sortEventsChronologically(events);
  assert.deepEqual(
    sorted.map((e) => e.title),
    ["Early event (date_exact only)", "Late event (date_from)"],
  );
});

test("sortEventsChronologically: undated events sort last, alphabetically among themselves", () => {
  const events = [
    { title: "Zebra undated", date_from: null, date_exact: null },
    { title: "Dated event", date_from: "1950-01-01", date_exact: null },
    { title: "Apple undated", date_from: null, date_exact: null },
  ];
  const sorted = sortEventsChronologically(events);
  assert.deepEqual(
    sorted.map((e) => e.title),
    ["Dated event", "Apple undated", "Zebra undated"],
  );
});

test("sortEventsChronologically: ties on the same date break by title", () => {
  const events = [
    { title: "B event", date_from: "1900-01-01", date_exact: null },
    { title: "A event", date_from: "1900-01-01", date_exact: null },
  ];
  const sorted = sortEventsChronologically(events);
  assert.deepEqual(
    sorted.map((e) => e.title),
    ["A event", "B event"],
  );
});

test("sortEventsChronologically: does not mutate the input array", () => {
  const events = [
    { title: "B", date_from: "2000-01-01", date_exact: null },
    { title: "A", date_from: "1900-01-01", date_exact: null },
  ];
  const original = [...events];
  sortEventsChronologically(events);
  assert.deepEqual(events, original);
});
