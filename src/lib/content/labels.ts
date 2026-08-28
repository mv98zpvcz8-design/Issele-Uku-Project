const ACCESS_STATUS_LABELS: Record<string, string> = {
  full_text_available: "Full text available",
  external_access: "External access available",
  metadata_only: "Metadata only",
  restricted: "Access restricted",
};

/** For `sources.access_status` (Research Library) — see DATABASE.md. */
export function accessStatusLabel(status: string): string {
  return ACCESS_STATUS_LABELS[status] ?? status.replaceAll("_", " ");
}
