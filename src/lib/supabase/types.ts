/**
 * Hand-authored to match supabase/migrations/*.sql exactly. Once a real
 * Supabase project exists, regenerate this file with:
 *
 *   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
 *
 * and diff it against this file before overwriting, since some tables
 * (join tables in particular) were hand-simplified below.
 */

export type ContentStatus =
  | "DRAFT"
  | "RESEARCH"
  | "REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "RESTRICTED";

export type EvidenceType =
  | "DOCUMENTED"
  | "ORAL_TRADITION"
  | "INTERPRETATION"
  | "DISPUTED"
  | "UNVERIFIED";

export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";

export type CopyrightStatus =
  | "PUBLIC_DOMAIN"
  | "PERMISSION_GRANTED"
  | "COPYRIGHTED_METADATA_ONLY"
  | "UNKNOWN"
  | "RESTRICTED";

export type UserRole = "ADMIN" | "EDITOR" | "RESEARCHER" | "REVIEWER";

export type ConsentStatus =
  | "NOT_REQUESTED"
  | "REQUESTED"
  | "GRANTED"
  | "DECLINED"
  | "WITHDRAWN";

/**
 * `@supabase/supabase-js`'s generic client type requires each table to
 * carry a `Relationships` array and the schema to declare `Views`/
 * `Functions` (see node_modules/@supabase/postgrest-js's `GenericTable`/
 * `GenericSchema`) — without this, the generic silently fails to match
 * and every query's row type degrades to `never` with no clear error.
 * This wraps the actual Row/Insert/Update definitions below with the
 * `Relationships: []` field they need (we don't use embedded/nested
 * resource selects, so an empty array is accurate) without repeating it
 * on every table.
 */
type WithRelationships<T> = {
  [K in keyof T]: T[K] extends { Row: unknown; Insert: unknown; Update: unknown }
    ? T[K] & { Relationships: [] }
    : never;
};

interface PublicTables {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: UserRole;
        };
        Update: {
          full_name?: string | null;
          role?: UserRole;
        };
      };
      sources: {
        Row: {
          id: string;
          slug: string;
          title: string;
          author: string | null;
          publisher: string | null;
          publication_date: string | null;
          source_type: string | null;
          url: string | null;
          isbn: string | null;
          archive_reference: string | null;
          citation: string | null;
          reliability_notes: string | null;
          access_status: string;
          verification_status: ContentStatus;
          public_visibility: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          PublicTables["sources"]["Row"],
          "id" | "public_visibility" | "created_at" | "updated_at"
        > & { id?: string };
        Update: Partial<PublicTables["sources"]["Insert"]>;
      };
      culture_categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          evidence_type: EvidenceType;
          confidence_level: ConfidenceLevel;
          verification_status: ContentStatus;
          public_visibility: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          PublicTables["culture_categories"]["Row"],
          "id" | "public_visibility" | "created_at" | "updated_at"
        > & { id?: string };
        Update: Partial<PublicTables["culture_categories"]["Insert"]>;
      };
      places: {
        Row: {
          id: string;
          slug: string;
          name: string;
          alternative_names: string[];
          category: string | null;
          description: string | null;
          historical_significance: string | null;
          latitude: number | null;
          longitude: number | null;
          cover_media_id: string | null;
          evidence_type: EvidenceType;
          confidence_level: ConfidenceLevel;
          verification_status: ContentStatus;
          public_visibility: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          PublicTables["places"]["Row"],
          "id" | "public_visibility" | "created_at" | "updated_at"
        > & { id?: string };
        Update: Partial<PublicTables["places"]["Insert"]>;
      };
      archive_items: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          description: string | null;
          abstract: string | null;
          record_type: string | null;
          date_exact: string | null;
          date_from: string | null;
          date_to: string | null;
          date_display: string | null;
          historical_period: string | null;
          creator: string | null;
          contributor: string | null;
          source_name: string | null;
          source_url: string | null;
          source_citation: string | null;
          source_type: string | null;
          source_repository: string | null;
          language: string | null;
          location: string | null;
          rights_holder: string | null;
          copyright_status: CopyrightStatus;
          publication_permission: boolean;
          access_status: string;
          verification_status: ContentStatus;
          evidence_type: EvidenceType;
          confidence_level: ConfidenceLevel;
          cultural_sensitivity: string | null;
          featured: boolean;
          public_visibility: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          PublicTables["archive_items"]["Row"],
          "id" | "public_visibility" | "created_at" | "updated_at"
        > & { id?: string };
        Update: Partial<PublicTables["archive_items"]["Insert"]>;
      };
      archive_media: {
        Row: {
          id: string;
          archive_item_id: string;
          storage_path: string;
          media_type: string | null;
          caption: string | null;
          is_primary: boolean;
          created_at: string;
        };
        Insert: Omit<PublicTables["archive_media"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<PublicTables["archive_media"]["Insert"]>;
      };
      people: {
        Row: {
          id: string;
          slug: string;
          name: string;
          alternative_names: string[];
          titles: string[];
          biography: string | null;
          birth_date: string | null;
          death_date: string | null;
          associated_locations: string[];
          historical_period: string | null;
          image_media_id: string | null;
          evidence_type: EvidenceType;
          confidence_level: ConfidenceLevel;
          verification_status: ContentStatus;
          public_visibility: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          PublicTables["people"]["Row"],
          "id" | "public_visibility" | "created_at" | "updated_at"
        > & { id?: string };
        Update: Partial<PublicTables["people"]["Insert"]>;
      };
      historical_events: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          date_exact: string | null;
          date_from: string | null;
          date_to: string | null;
          date_display: string | null;
          location_id: string | null;
          evidence_type: EvidenceType;
          confidence_level: ConfidenceLevel;
          verification_status: ContentStatus;
          public_visibility: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          PublicTables["historical_events"]["Row"],
          "id" | "public_visibility" | "created_at" | "updated_at"
        > & { id?: string };
        Update: Partial<PublicTables["historical_events"]["Insert"]>;
      };
      monarchs: {
        Row: {
          id: string;
          slug: string;
          name: string;
          regnal_name: string | null;
          reign_start: string | null;
          reign_end: string | null;
          reign_display: string | null;
          predecessor_id: string | null;
          successor_id: string | null;
          biography: string | null;
          image_media_id: string | null;
          evidence_type: EvidenceType;
          confidence_level: ConfidenceLevel;
          verification_status: ContentStatus;
          public_visibility: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          PublicTables["monarchs"]["Row"],
          "id" | "public_visibility" | "created_at" | "updated_at"
        > & { id?: string };
        Update: Partial<PublicTables["monarchs"]["Insert"]>;
      };
      oral_histories: {
        Row: {
          id: string;
          interviewee_person_id: string | null;
          interviewee_name: string;
          interviewer_name: string | null;
          recording_date: string | null;
          location: string | null;
          audio_storage_path: string | null;
          video_storage_path: string | null;
          transcript: string | null;
          summary: string | null;
          topics: string[];
          language: string | null;
          consent_status: ConsentStatus;
          publication_permission: boolean;
          restricted_sections: unknown | null;
          sensitivity_notes: string | null;
          transcription_status: string;
          verification_status: ContentStatus;
          public_visibility: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          PublicTables["oral_histories"]["Row"],
          "id" | "public_visibility" | "created_at" | "updated_at"
        > & { id?: string };
        Update: Partial<PublicTables["oral_histories"]["Insert"]>;
      };
      submissions: {
        Row: {
          id: string;
          submission_type: string;
          related_archive_item_id: string | null;
          submitter_name: string | null;
          submitter_email: string | null;
          message: string;
          attached_storage_path: string | null;
          confirmed_ownership_or_permission: boolean;
          confirmed_understands_review: boolean;
          review_status: string;
          reviewer_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          PublicTables["submissions"]["Row"],
          "id" | "review_status" | "reviewer_notes" | "created_at" | "updated_at"
        > & { id?: string };
        Update: Partial<Pick<PublicTables["submissions"]["Row"], "review_status" | "reviewer_notes">>;
      };
      person_sources: {
        Row: { person_id: string; source_id: string };
        Insert: { person_id: string; source_id: string };
        Update: never;
      };
      place_sources: {
        Row: { place_id: string; source_id: string };
        Insert: { place_id: string; source_id: string };
        Update: never;
      };
      place_people: {
        Row: { place_id: string; person_id: string };
        Insert: { place_id: string; person_id: string };
        Update: never;
      };
      place_events: {
        Row: { place_id: string; event_id: string };
        Insert: { place_id: string; event_id: string };
        Update: never;
      };
      event_people: {
        Row: { event_id: string; person_id: string };
        Insert: { event_id: string; person_id: string };
        Update: never;
      };
      event_sources: {
        Row: { event_id: string; source_id: string };
        Insert: { event_id: string; source_id: string };
        Update: never;
      };
      monarch_sources: {
        Row: { monarch_id: string; source_id: string };
        Insert: { monarch_id: string; source_id: string };
        Update: never;
      };
      monarch_events: {
        Row: { monarch_id: string; event_id: string };
        Insert: { monarch_id: string; event_id: string };
        Update: never;
      };
      archive_item_culture_categories: {
        Row: { archive_item_id: string; category_id: string };
        Insert: { archive_item_id: string; category_id: string };
        Update: never;
      };
}

export interface Database {
  public: {
    Tables: WithRelationships<PublicTables>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
