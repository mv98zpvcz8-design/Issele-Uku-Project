"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession, canEdit } from "@/lib/admin/session";
import { slugify } from "@/lib/admin/slugify";
import type { ContentStatus, EvidenceType, ConfidenceLevel } from "@/lib/supabase/types";

async function requireEditor() {
  const session = await getAdminSession();
  if (!session || !canEdit(session.role)) redirect("/admin/monarchs");
}

function fieldsFromForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const predecessorId = String(formData.get("predecessor_id") ?? "").trim();
  const successorId = String(formData.get("successor_id") ?? "").trim();
  return {
    name,
    slug: slugInput || slugify(name),
    regnal_name: String(formData.get("regnal_name") ?? "").trim() || null,
    reign_start: String(formData.get("reign_start") ?? "").trim() || null,
    reign_end: String(formData.get("reign_end") ?? "").trim() || null,
    reign_display: String(formData.get("reign_display") ?? "").trim() || null,
    predecessor_id: predecessorId || null,
    successor_id: successorId || null,
    biography: String(formData.get("biography") ?? "").trim() || null,
    image_media_id: String(formData.get("image_media_id") ?? "").trim() || null,
    evidence_type: String(formData.get("evidence_type") ?? "UNVERIFIED") as EvidenceType,
    confidence_level: String(formData.get("confidence_level") ?? "UNKNOWN") as ConfidenceLevel,
    verification_status: String(formData.get("verification_status") ?? "DRAFT") as ContentStatus,
  };
}

export async function createMonarch(formData: FormData) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("monarchs").insert(fieldsFromForm(formData));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/monarchs");
  redirect("/admin/monarchs");
}

export async function updateMonarch(id: string, formData: FormData) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("monarchs").update(fieldsFromForm(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/monarchs");
  redirect("/admin/monarchs");
}

export async function deleteMonarch(id: string) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("monarchs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/monarchs");
  redirect("/admin/monarchs");
}
