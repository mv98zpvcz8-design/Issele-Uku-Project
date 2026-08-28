import type { CopyrightStatus } from "@/lib/supabase/types";

/**
 * Mirrors COPYRIGHT_GUIDELINES.md exactly. UNKNOWN is deliberately worded
 * the same as COPYRIGHTED_METADATA_ONLY — per that policy, unknown rights
 * are treated as metadata-only for public display, never assumed to be
 * permissive.
 */
const COPYRIGHT_MESSAGES: Record<CopyrightStatus, string> = {
  PUBLIC_DOMAIN: "Public domain.",
  PERMISSION_GRANTED: "Used with permission from the rights holder.",
  COPYRIGHTED_METADATA_ONLY:
    "Copyrighted material. Only bibliographic/citation information is shown here — the original work is not reproduced.",
  UNKNOWN:
    "Rights status not yet established. Only bibliographic/citation information is shown here — the original work is not reproduced.",
  RESTRICTED: "Access to this record is restricted.",
};

export function CopyrightNotice({
  copyrightStatus,
  rightsHolder,
}: {
  copyrightStatus: CopyrightStatus;
  rightsHolder: string | null;
}) {
  return (
    <p className="text-sm text-ink-soft">
      {COPYRIGHT_MESSAGES[copyrightStatus]}
      {rightsHolder && copyrightStatus !== "RESTRICTED" ? ` Rights holder: ${rightsHolder}.` : null}
    </p>
  );
}
