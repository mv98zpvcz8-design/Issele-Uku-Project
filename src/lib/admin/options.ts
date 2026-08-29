export const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "RESEARCH", label: "Research" },
  { value: "REVIEW", label: "Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "PUBLISHED", label: "Published (public)" },
  { value: "RESTRICTED", label: "Restricted" },
] as const;

export const EVIDENCE_OPTIONS = [
  { value: "DOCUMENTED", label: "Documented" },
  { value: "ORAL_TRADITION", label: "Oral tradition" },
  { value: "INTERPRETATION", label: "Interpretation" },
  { value: "DISPUTED", label: "Disputed" },
  { value: "UNVERIFIED", label: "Unverified" },
] as const;

export const CONFIDENCE_OPTIONS = [
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
  { value: "UNKNOWN", label: "Unknown" },
] as const;

export const COPYRIGHT_OPTIONS = [
  { value: "PUBLIC_DOMAIN", label: "Public domain" },
  { value: "PERMISSION_GRANTED", label: "Permission granted" },
  { value: "COPYRIGHTED_METADATA_ONLY", label: "Copyrighted — metadata only" },
  { value: "UNKNOWN", label: "Unknown" },
  { value: "RESTRICTED", label: "Restricted" },
] as const;

export const SUBMISSION_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_review", label: "In review" },
  { value: "resolved", label: "Resolved" },
  { value: "declined", label: "Declined" },
] as const;
