"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession, canEdit } from "@/lib/admin/session";
import { slugify } from "@/lib/admin/slugify";
import type { ContentStatus, EvidenceType, ConfidenceLevel, CopyrightStatus } from "@/lib/supabase/types";

async function requireEditor() {
  const session = await getAdminSession();
  if (!session || !canEdit(session.role)) redirect("/admin/archive-items");
}

function str(formData: FormData, key: string): string | null {
  return String(formData.get(key) ?? "").trim() || null;
}

function fieldsFromForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  return {
    title,
    slug: slugInput || slugify(title),
    subtitle: str(formData, "subtitle"),
    description: str(formData, "description"),
    abstract: str(formData, "abstract"),
    record_type: str(formData, "record_type"),
    date_exact: str(formData, "date_exact"),
    date_from: str(formData, "date_from"),
    date_to: str(formData, "date_to"),
    date_display: str(formData, "date_display"),
    historical_period: str(formData, "historical_period"),
    creator: str(formData, "creator"),
    contributor: str(formData, "contributor"),
    source_name: str(formData, "source_name"),
    source_url: str(formData, "source_url"),
    source_citation: str(formData, "source_citation"),
    source_type: str(formData, "source_type"),
    source_repository: str(formData, "source_repository"),
    language: str(formData, "language"),
    location: str(formData, "location"),
    rights_holder: str(formData, "rights_holder"),
    copyright_status: String(formData.get("copyright_status") ?? "UNKNOWN") as CopyrightStatus,
    publication_permission: formData.get("publication_permission") === "on",
    access_status: String(formData.get("access_status") ?? "metadata_only"),
    verification_status: String(formData.get("verification_status") ?? "DRAFT") as ContentStatus,
    evidence_type: String(formData.get("evidence_type") ?? "UNVERIFIED") as EvidenceType,
    confidence_level: String(formData.get("confidence_level") ?? "UNKNOWN") as ConfidenceLevel,
    cultural_sensitivity: str(formData, "cultural_sensitivity"),
    featured: formData.get("featured") === "on",
  };
}

export async function createArchiveItem(formData: FormData) {
  await requireEditor();
  const supabase = await createClient();
  const { data, error } = await supabase.from("archive_items").insert(fieldsFromForm(formData)).select("id").single();
  if (error) throw new Error(error.message);
  revalidatePath("/admin/archive-items");
  redirect(`/admin/archive-items/${data.id}`);
}

export async function updateArchiveItem(id: string, formData: FormData) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("archive_items").update(fieldsFromForm(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/archive-items");
  redirect("/admin/archive-items");
}

export async function deleteArchiveItem(id: string) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("archive_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/archive-items");
  redirect("/admin/archive-items");
}

/** Strips path separators and anything but a conservative filename character set. */
function sanitizeFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "file";
  return base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
}

function inferMediaType(mimeType: string): string {
  const [kind] = mimeType.split("/");
  if (kind === "image" || kind === "audio" || kind === "video") return kind;
  return "document";
}

/**
 * Uploads the actual file to the private `archive-media` Storage bucket
 * (see the storage migration for why it's private) using the caller's
 * own authenticated session — Storage's own RLS-equivalent policies on
 * that bucket require can_edit(), same as archive_media's table
 * policies, so this is an ordinary RLS-respecting write, not a
 * service-role shortcut (consistent with D-025). The storage path is
 * generated here from a fresh UUID, never taken from the client, so a
 * submitter/admin can't control where their file lands or overwrite
 * another item's file by guessing a path.
 */
export async function uploadArchiveMedia(itemId: string, formData: FormData) {
  await requireEditor();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose a file to upload.");
  }

  const supabase = await createClient();
  const storagePath = `${itemId}/${crypto.randomUUID()}-${sanitizeFilename(file.name)}`;
  const { error: uploadError } = await supabase.storage
    .from("archive-media")
    .upload(storagePath, file, { contentType: file.type || undefined });
  if (uploadError) throw new Error(uploadError.message);

  const { error } = await supabase.from("archive_media").insert({
    archive_item_id: itemId,
    storage_path: storagePath,
    media_type: inferMediaType(file.type),
    caption: str(formData, "caption"),
    is_primary: formData.get("is_primary") === "on",
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/archive-items/${itemId}`);
  revalidatePath(`/archive/${itemId}`);
  redirect(`/admin/archive-items/${itemId}`);
}

export async function deleteArchiveMedia(mediaId: string, itemId: string) {
  await requireEditor();
  const supabase = await createClient();

  const { data: media } = await supabase.from("archive_media").select("storage_path").eq("id", mediaId).maybeSingle();
  const { error } = await supabase.from("archive_media").delete().eq("id", mediaId);
  if (error) throw new Error(error.message);

  // Best-effort: the DB row is the source of truth for what's "deleted"
  // from the archive's perspective, so a Storage cleanup failure here
  // doesn't block the delete or get shown as an error — an orphaned
  // file with no database row is invisible everywhere the app actually
  // reads from (every read goes through archive_media, never lists the
  // bucket directly), just wasted storage space, not a data-integrity
  // or visibility problem.
  if (media?.storage_path) {
    await supabase.storage.from("archive-media").remove([media.storage_path]);
  }

  revalidatePath(`/admin/archive-items/${itemId}`);
  redirect(`/admin/archive-items/${itemId}`);
}
