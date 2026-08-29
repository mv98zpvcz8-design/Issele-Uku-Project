"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession, canEdit } from "@/lib/admin/session";
import { slugify } from "@/lib/admin/slugify";
import type { ContentStatus } from "@/lib/supabase/types";

async function requireEditor() {
  const session = await getAdminSession();
  if (!session || !canEdit(session.role)) {
    // RLS would reject the write anyway (defense in depth) — this just
    // gives a clean redirect instead of a raw database error.
    redirect("/admin/sources");
  }
}

function fieldsFromForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  return {
    title,
    slug: slugInput || slugify(title),
    author: String(formData.get("author") ?? "").trim() || null,
    publisher: String(formData.get("publisher") ?? "").trim() || null,
    publication_date: String(formData.get("publication_date") ?? "").trim() || null,
    source_type: String(formData.get("source_type") ?? "").trim() || null,
    url: String(formData.get("url") ?? "").trim() || null,
    isbn: String(formData.get("isbn") ?? "").trim() || null,
    archive_reference: String(formData.get("archive_reference") ?? "").trim() || null,
    citation: String(formData.get("citation") ?? "").trim() || null,
    reliability_notes: String(formData.get("reliability_notes") ?? "").trim() || null,
    access_status: String(formData.get("access_status") ?? "metadata_only"),
    verification_status: String(formData.get("verification_status") ?? "DRAFT") as ContentStatus,
  };
}

export async function createSource(formData: FormData) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("sources").insert(fieldsFromForm(formData));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/sources");
  redirect("/admin/sources");
}

export async function updateSource(id: string, formData: FormData) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("sources").update(fieldsFromForm(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/sources");
  redirect("/admin/sources");
}

export async function deleteSource(id: string) {
  await requireEditor();
  const supabase = await createClient();
  const { error } = await supabase.from("sources").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/sources");
  redirect("/admin/sources");
}
