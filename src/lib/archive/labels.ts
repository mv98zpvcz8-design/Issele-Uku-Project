import { RECORD_TYPES, type RecordType } from "./search";

const RECORD_TYPE_LABELS: Record<RecordType, string> = {
  photograph: "Photograph",
  document: "Document",
  book: "Book",
  newspaper_article: "Newspaper article",
  map: "Map",
  audio: "Audio recording",
  oral_history_interview: "Oral history interview",
  video: "Video",
  letter: "Letter",
  government_document: "Government document",
  academic_research: "Academic research",
  festival_material: "Festival material",
  historical_object: "Historical object",
  external_reference: "External reference",
};

/**
 * `record_type` is free text at the database level (DECISIONS.md D-017),
 * so a value outside RECORD_TYPES is possible (an admin entered something
 * new) — fall back to the raw value with underscores turned to spaces
 * rather than hiding it.
 */
export function humanizeRecordType(recordType: string | null): string {
  if (!recordType) return "Unspecified";
  if ((RECORD_TYPES as readonly string[]).includes(recordType)) {
    return RECORD_TYPE_LABELS[recordType as RecordType];
  }
  return recordType.replaceAll("_", " ");
}
