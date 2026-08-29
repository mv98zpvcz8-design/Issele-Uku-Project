"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession, canEdit } from "@/lib/admin/session";
import { slugify } from "@/lib/admin/slugify";
import type { ContentStatus, EvidenceType, ConfidenceLevel } from "@/lib/supabase/types";

async function requireEditor() {
  const session = await getAdminSession();
  if (!session || !canEdit(session.role)) redirect("/admin/culture-categories");
}

function fieldsFromForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  return {
    name,
    slug: slugInput || slugify(name),
    description: String(formData.get("description") ?? "").trim() || null,
    evidence_type: String(formData.get("evidence_type") ?? "UNVERIFIED") as EvidenceType,
    confidence_level: String(formData.get("confidence_level") ?? "UNKNOWN") as ConfidenceLevel,
    verification_status: String(formData.get("verification_status") ?? "DRAFT") as ContentStatus,
  };
}

export async function createCultureCategory(formData: FormData) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("culture_categories").insert(fieldsFromForm(formData));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/culture-categories");
  redirect("/admin/culture-categories");
}

export async function updateCultureCategory(id: string, formData: FormData) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("culture_categories").update(fieldsFromForm(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/culture-categories");
  redirect("/admin/culture-categories");
}

export async function deleteCultureCategory(id: string) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("culture_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/culture-categories");
  redirect("/admin/culture-categories");
}
