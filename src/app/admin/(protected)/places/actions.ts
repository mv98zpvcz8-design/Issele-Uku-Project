"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession, canEdit } from "@/lib/admin/session";
import { slugify } from "@/lib/admin/slugify";
import { parseListField } from "@/components/admin/fields";
import type { ContentStatus, EvidenceType, ConfidenceLevel } from "@/lib/supabase/types";

async function requireEditor() {
  const session = await getAdminSession();
  if (!session || !canEdit(session.role)) redirect("/admin/places");
}

function fieldsFromForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const lat = String(formData.get("latitude") ?? "").trim();
  const lng = String(formData.get("longitude") ?? "").trim();
  return {
    name,
    slug: slugInput || slugify(name),
    alternative_names: parseListField(formData.get("alternative_names")),
    category: String(formData.get("category") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    historical_significance: String(formData.get("historical_significance") ?? "").trim() || null,
    latitude: lat ? Number(lat) : null,
    longitude: lng ? Number(lng) : null,
    cover_media_id: String(formData.get("cover_media_id") ?? "").trim() || null,
    evidence_type: String(formData.get("evidence_type") ?? "UNVERIFIED") as EvidenceType,
    confidence_level: String(formData.get("confidence_level") ?? "UNKNOWN") as ConfidenceLevel,
    verification_status: String(formData.get("verification_status") ?? "DRAFT") as ContentStatus,
  };
}

export async function createPlace(formData: FormData) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("places").insert(fieldsFromForm(formData));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/places");
  redirect("/admin/places");
}

export async function updatePlace(id: string, formData: FormData) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("places").update(fieldsFromForm(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/places");
  redirect("/admin/places");
}

export async function deletePlace(id: string) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("places").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/places");
  redirect("/admin/places");
}
