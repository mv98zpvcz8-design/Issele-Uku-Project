"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession, canEdit, canReview } from "@/lib/admin/session";

async function requireReviewer(id: string) {
  const session = await getAdminSession();
  if (!session || !canReview(session.role)) redirect(`/admin/submissions/${id}`);
}

async function requireEditor(id: string) {
  const session = await getAdminSession();
  if (!session || !canEdit(session.role)) redirect(`/admin/submissions/${id}`);
}

export async function updateSubmissionReview(id: string, formData: FormData) {
  await requireReviewer(id);
  const supabase = await createClient();
  const { error } = await supabase
    .from("submissions")
    .update({
      review_status: String(formData.get("review_status") ?? "pending"),
      reviewer_notes: String(formData.get("reviewer_notes") ?? "").trim() || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/submissions");
  revalidatePath(`/admin/submissions/${id}`);
  redirect("/admin/submissions");
}

export async function deleteSubmission(id: string) {
  await requireEditor(id);
  const supabase = await createClient();
  const { error } = await supabase.from("submissions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/submissions");
  redirect("/admin/submissions");
}
