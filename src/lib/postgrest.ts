/**
 * PostgREST's `.or()` filter takes a raw string you build yourself, where
 * comma/period/parenthesis are structurally significant (they separate
 * and group conditions). A search term containing one of those characters
 * would otherwise be interpreted as filter syntax rather than a literal
 * value — e.g. a user searching for "market, 1950" could smuggle in an
 * unintended extra condition. Per PostgREST's documented escaping rule,
 * wrapping the value in double quotes (with `\` and `"` themselves
 * backslash-escaped) makes everything inside it literal.
 *
 * Shared by every page that builds a multi-column free-text search (see
 * archive/search.ts and the timeline) so this sharp edge is handled in
 * exactly one place.
 */
export function escapePostgrestOrValue(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/** Builds an `.or(...)` filter searching `q` (as a substring) across several ilike columns. */
export function buildOrSearchFilter(columns: readonly string[], q: string): string {
  const pattern = escapePostgrestOrValue(`%${q}%`);
  return columns.map((col) => `${col}.ilike.${pattern}`).join(",");
}
