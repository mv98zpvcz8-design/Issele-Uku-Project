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

/**
 * Adds a media ROW (storage_path/caption/type) — not a file upload
 * widget. Actual file upload needs a configured Supabase Storage bucket
 * with access-control policies matching each item's copyright_status
 * (public bucket vs. signed URLs), which hasn't been built yet — see
 * ROADMAP.md. An admin can still register a file that was uploaded to
 * Storage by some other means (the Supabase dashboard, for now) by
 * pasting its storage path here.
 */
export async function addArchiveMedia(itemId: string, formData: FormData) {
  await requireEditor();
  const supabase = await createClient();
  const storagePath = str(formData, "storage_path");
  if (!storagePath) return;
  const { error } = await supabase.from("archive_media").insert({
    archive_item_id: itemId,
    storage_path: storagePath,
    media_type: str(formData, "media_type"),
    caption: str(formData, "caption"),
    is_primary: formData.get("is_primary") === "on",
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/archive-items/${itemId}`);
  redirect(`/admin/archive-items/${itemId}`);
}

export async function deleteArchiveMedia(mediaId: string, itemId: string) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("archive_media").delete().eq("id", mediaId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/archive-items/${itemId}`);
  redirect(`/admin/archive-items/${itemId}`);
}
