"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession, canEdit } from "@/lib/admin/session";
import { slugify } from "@/lib/admin/slugify";
import type { ContentStatus, EvidenceType, ConfidenceLevel } from "@/lib/supabase/types";

async function requireEditor() {
  const session = await getAdminSession();
  if (!session || !canEdit(session.role)) redirect("/admin/historical-events");
}

function fieldsFromForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const locationId = String(formData.get("location_id") ?? "").trim();
  return {
    title,
    slug: slugInput || slugify(title),
    description: String(formData.get("description") ?? "").trim() || null,
    date_exact: String(formData.get("date_exact") ?? "").trim() || null,
    date_from: String(formData.get("date_from") ?? "").trim() || null,
    date_to: String(formData.get("date_to") ?? "").trim() || null,
    date_display: String(formData.get("date_display") ?? "").trim() || null,
    location_id: locationId || null,
    evidence_type: String(formData.get("evidence_type") ?? "UNVERIFIED") as EvidenceType,
    confidence_level: String(formData.get("confidence_level") ?? "UNKNOWN") as ConfidenceLevel,
    verification_status: String(formData.get("verification_status") ?? "DRAFT") as ContentStatus,
  };
}

export async function createHistoricalEvent(formData: FormData) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("historical_events").insert(fieldsFromForm(formData));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/historical-events");
  redirect("/admin/historical-events");
}

export async function updateHistoricalEvent(id: string, formData: FormData) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("historical_events").update(fieldsFromForm(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/historical-events");
  redirect("/admin/historical-events");
}

export async function deleteHistoricalEvent(id: string) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("historical_events").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/historical-events");
  redirect("/admin/historical-events");
}
