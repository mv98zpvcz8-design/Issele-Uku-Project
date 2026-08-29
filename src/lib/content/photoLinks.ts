import { createClient } from "@/lib/supabase/server";

export type PhotoLinkEntityType = "culture_category" | "event" | "source" | "person" | "place" | "monarch";

/**
 * One config entry per entity type that can have photos/documents
 * attached via an archive_item_culture_categories-style join table.
 * Explicit per-type switches throughout this file rather than a single
 * generic `.from(dynamicTableName)` call — keeps every table name a
 * literal Supabase's generated types can actually check, matching this
 * codebase's existing preference for explicit per-entity code (see the
 * separate query blocks in every *_/[slug]/page.tsx) over a clever but
 * type-unsafe abstraction.
 */
export const PHOTO_LINK_ADMIN_PATH: Record<PhotoLinkEntityType, string> = {
  culture_category: "/admin/culture-categories",
  event: "/admin/historical-events",
  source: "/admin/sources",
  person: "/admin/people",
  place: "/admin/places",
  monarch: "/admin/monarchs",
};

export async function getLinkedArchiveItemIds(entityType: PhotoLinkEntityType, entityId: string): Promise<string[]> {
  const supabase = await createClient();
  switch (entityType) {
    case "culture_category": {
      const { data } = await supabase
        .from("archive_item_culture_categories")
        .select("archive_item_id")
        .eq("category_id", entityId);
      return (data ?? []).map((r) => r.archive_item_id);
    }
    case "event": {
      const { data } = await supabase.from("event_archive_items").select("archive_item_id").eq("event_id", entityId);
      return (data ?? []).map((r) => r.archive_item_id);
    }
    case "source": {
      const { data } = await supabase
        .from("source_archive_items")
        .select("archive_item_id")
        .eq("source_id", entityId);
      return (data ?? []).map((r) => r.archive_item_id);
    }
    case "person": {
      const { data } = await supabase
        .from("person_archive_items")
        .select("archive_item_id")
        .eq("person_id", entityId);
      return (data ?? []).map((r) => r.archive_item_id);
    }
    case "place": {
      const { data } = await supabase.from("place_archive_items").select("archive_item_id").eq("place_id", entityId);
      return (data ?? []).map((r) => r.archive_item_id);
    }
    case "monarch": {
      const { data } = await supabase
        .from("monarch_archive_items")
        .select("archive_item_id")
        .eq("monarch_id", entityId);
      return (data ?? []).map((r) => r.archive_item_id);
    }
  }
}
