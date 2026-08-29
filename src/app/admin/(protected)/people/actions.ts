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
  if (!session || !canEdit(session.role)) redirect("/admin/people");
}

function fieldsFromForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  return {
    name,
    slug: slugInput || slugify(name),
    alternative_names: parseListField(formData.get("alternative_names")),
    titles: parseListField(formData.get("titles")),
    biography: String(formData.get("biography") ?? "").trim() || null,
    birth_date: String(formData.get("birth_date") ?? "").trim() || null,
    death_date: String(formData.get("death_date") ?? "").trim() || null,
    associated_locations: parseListField(formData.get("associated_locations")),
    historical_period: String(formData.get("historical_period") ?? "").trim() || null,
    evidence_type: String(formData.get("evidence_type") ?? "UNVERIFIED") as EvidenceType,
    confidence_level: String(formData.get("confidence_level") ?? "UNKNOWN") as ConfidenceLevel,
    verification_status: String(formData.get("verification_status") ?? "DRAFT") as ContentStatus,
  };
}

export async function createPerson(formData: FormData) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("people").insert(fieldsFromForm(formData));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/people");
  redirect("/admin/people");
}

export async function updatePerson(id: string, formData: FormData) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("people").update(fieldsFromForm(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/people");
  redirect("/admin/people");
}

export async function deletePerson(id: string) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("people").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/people");
  redirect("/admin/people");
}
