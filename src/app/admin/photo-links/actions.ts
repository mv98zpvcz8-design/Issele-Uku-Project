"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession, canEdit } from "@/lib/admin/session";
import { slugify } from "@/lib/admin/slugify";
import { PHOTO_LINK_ADMIN_PATH, type PhotoLinkEntityType } from "@/lib/content/photoLinks";

async function requireEditor(entityType: PhotoLinkEntityType, entityId: string) {
  const session = await getAdminSession();
  if (!session || !canEdit(session.role)) redirect(`${PHOTO_LINK_ADMIN_PATH[entityType]}/${entityId}`);
}

/** Inserts one row into the join table matching entityType — see photoLinks.ts for why this is a switch, not a dynamic table name. */
async function insertLink(
  supabase: Awaited<ReturnType<typeof createClient>>,
  entityType: PhotoLinkEntityType,
  entityId: string,
  archiveItemId: string,
) {
  switch (entityType) {
    case "culture_category":
      return supabase
        .from("archive_item_culture_categories")
        .insert({ category_id: entityId, archive_item_id: archiveItemId });
    case "event":
      return supabase.from("event_archive_items").insert({ event_id: entityId, archive_item_id: archiveItemId });
    case "source":
      return supabase.from("source_archive_items").insert({ source_id: entityId, archive_item_id: archiveItemId });
    case "person":
      return supabase.from("person_archive_items").insert({ person_id: entityId, archive_item_id: archiveItemId });
    case "place":
      return supabase.from("place_archive_items").insert({ place_id: entityId, archive_item_id: archiveItemId });
    case "monarch":
      return supabase
        .from("monarch_archive_items")
        .insert({ monarch_id: entityId, archive_item_id: archiveItemId });
  }
}

async function deleteLink(
  supabase: Awaited<ReturnType<typeof createClient>>,
  entityType: PhotoLinkEntityType,
  entityId: string,
  archiveItemId: string,
) {
  switch (entityType) {
    case "culture_category":
      return supabase
        .from("archive_item_culture_categories")
        .delete()
        .eq("category_id", entityId)
        .eq("archive_item_id", archiveItemId);
    case "event":
      return supabase
        .from("event_archive_items")
        .delete()
        .eq("event_id", entityId)
        .eq("archive_item_id", archiveItemId);
    case "source":
      return supabase
        .from("source_archive_items")
        .delete()
        .eq("source_id", entityId)
        .eq("archive_item_id", archiveItemId);
    case "person":
      return supabase
        .from("person_archive_items")
        .delete()
        .eq("person_id", entityId)
        .eq("archive_item_id", archiveItemId);
    case "place":
      return supabase
        .from("place_archive_items")
        .delete()
        .eq("place_id", entityId)
        .eq("archive_item_id", archiveItemId);
    case "monarch":
      return supabase
        .from("monarch_archive_items")
        .delete()
        .eq("monarch_id", entityId)
        .eq("archive_item_id", archiveItemId);
  }
}

function sanitizeFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "file";
  return base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
}

/** Links an archive item that already exists in the Archive to this entity. */
export async function attachExistingArchiveItem(entityType: PhotoLinkEntityType, entityId: string, formData: FormData) {
  await requireEditor(entityType, entityId);
  const archiveItemId = String(formData.get("archive_item_id") ?? "").trim();
  if (!archiveItemId) return;

  const supabase = await createClient();
  const { error } = await insertLink(supabase, entityType, entityId, archiveItemId);
  if (error) throw new Error(error.message);
  redirect(`${PHOTO_LINK_ADMIN_PATH[entityType]}/${entityId}`);
}

/**
 * Uploads a file directly and attaches it — hides the fact that, under
 * the hood, every photo/document is still an Archive Item (matching the
 * brief's own model), by creating a minimal one automatically. It lands
 * at DRAFT so it doesn't appear anywhere public until someone reviews
 * it properly (adding real evidence/copyright metadata) in Archive
 * Items — this shortcut is for getting a photo attached quickly, not a
 * replacement for cataloguing it properly.
 */
export async function uploadAndAttachArchiveItem(entityType: PhotoLinkEntityType, entityId: string, formData: FormData) {
  await requireEditor(entityType, entityId);

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose a file to upload.");
  }
  const caption = String(formData.get("caption") ?? "").trim() || null;
  const title = caption || file.name;

  const supabase = await createClient();

  const { data: item, error: itemError } = await supabase
    .from("archive_items")
    .insert({
      slug: `${slugify(title)}-${crypto.randomUUID().slice(0, 8)}`,
      title,
      subtitle: null,
      description: null,
      abstract: null,
      record_type: "photograph",
      date_exact: null,
      date_from: null,
      date_to: null,
      date_display: null,
      historical_period: null,
      creator: null,
      contributor: null,
      source_name: null,
      source_url: null,
      source_citation: null,
      source_type: null,
      source_repository: null,
      language: null,
      location: null,
      rights_holder: null,
      copyright_status: "UNKNOWN",
      publication_permission: false,
      access_status: "metadata_only",
      verification_status: "DRAFT",
      evidence_type: "UNVERIFIED",
      confidence_level: "UNKNOWN",
      cultural_sensitivity: null,
      featured: false,
    })
    .select("id")
    .single();
  if (itemError) throw new Error(itemError.message);

  const storagePath = `${item.id}/${crypto.randomUUID()}-${sanitizeFilename(file.name)}`;
  const { error: uploadError } = await supabase.storage
    .from("archive-media")
    .upload(storagePath, file, { contentType: file.type || undefined });
  if (uploadError) throw new Error(uploadError.message);

  const mediaType = file.type.split("/")[0];
  const { error: mediaError } = await supabase.from("archive_media").insert({
    archive_item_id: item.id,
    storage_path: storagePath,
    media_type: ["image", "audio", "video"].includes(mediaType) ? mediaType : "document",
    caption,
    is_primary: true,
  });
  if (mediaError) throw new Error(mediaError.message);

  const { error: linkError } = await insertLink(supabase, entityType, entityId, item.id);
  if (linkError) throw new Error(linkError.message);

  redirect(`${PHOTO_LINK_ADMIN_PATH[entityType]}/${entityId}`);
}

/** Unlinks the archive item from this entity — does NOT delete the archive item or its file, which may still be wanted in the Archive itself or linked elsewhere. */
export async function detachArchiveItem(entityType: PhotoLinkEntityType, entityId: string, archiveItemId: string) {
  await requireEditor(entityType, entityId);
  const supabase = await createClient();
  const { error } = await deleteLink(supabase, entityType, entityId, archiveItemId);
  if (error) throw new Error(error.message);
  redirect(`${PHOTO_LINK_ADMIN_PATH[entityType]}/${entityId}`);
}
