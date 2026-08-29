interface DatedEvent {
  date_from: string | null;
  date_exact: string | null;
  title: string;
}

/**
 * date_from and date_exact are alternative ways of expressing a known
 * date (see DATABASE.md) — an event normally has one or the other, not
 * both. For chronological sorting they need to be treated as one
 * coalesced value, not two independent sort levels: `.order('date_from')
 * .order('date_exact')` in PostgREST would put an event with only
 * date_exact set entirely after every event that has any date_from at
 * all, however much later those date_from values actually are. Sorting
 * client-side after fetch (rather than adding a generated "effective
 * date" column) keeps this a display concern, not a schema change, and
 * the timeline has no pagination to complicate fetching everything
 * first.
 */
export function effectiveDate(event: Pick<DatedEvent, "date_from" | "date_exact">): string | null {
  return event.date_from ?? event.date_exact;
}

/** Chronological ascending, undated events last, ISO date strings compare correctly as text. */
export function sortEventsChronologically<T extends DatedEvent>(events: T[]): T[] {
  return [...events].sort((a, b) => {
    const da = effectiveDate(a);
    const db = effectiveDate(b);
    if (da === null && db === null) return a.title.localeCompare(b.title);
    if (da === null) return 1;
    if (db === null) return -1;
    if (da !== db) return da < db ? -1 : 1;
    return a.title.localeCompare(b.title);
  });
}
