import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminForm } from "@/components/admin/AdminForm";
import { TextField, TextAreaField, SelectField } from "@/components/admin/fields";
import { STATUS_OPTIONS, EVIDENCE_OPTIONS, CONFIDENCE_OPTIONS } from "@/lib/admin/options";
import { PreviewLink } from "@/components/admin/PreviewLink";
import { PhotoAttachmentPanel } from "@/components/admin/PhotoAttachmentPanel";
import { requireEditorPage } from "@/lib/admin/session";
import { updateCultureCategory, deleteCultureCategory } from "../actions";

export default async function EditCultureCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireEditorPage("/admin/culture-categories");
  const supabase = await createClient();
  const { data: category } = await supabase.from("culture_categories").select("*").eq("id", id).maybeSingle();
  if (!category) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">Edit culture category</h1>
        <PreviewLink href={`/culture/${category.slug}`} />
      </div>
      <div className="mt-6">
        <AdminForm
          action={updateCultureCategory.bind(null, id)}
          deleteAction={deleteCultureCategory.bind(null, id)}
          submitLabel="Save changes"
          cancelHref="/admin/culture-categories"
        >
          <TextField name="name" label="Name" defaultValue={category.name} required />
          <TextField name="slug" label="Slug" defaultValue={category.slug} />
          <TextAreaField name="description" label="Description" defaultValue={category.description} />
          <SelectField name="evidence_type" label="Evidence type" defaultValue={category.evidence_type} options={EVIDENCE_OPTIONS} />
          <SelectField
            name="confidence_level"
            label="Confidence level"
            defaultValue={category.confidence_level}
            options={CONFIDENCE_OPTIONS}
          />
          <SelectField
            name="verification_status"
            label="Workflow status"
            defaultValue={category.verification_status}
            options={STATUS_OPTIONS}
          />
        </AdminForm>
      </div>

      <PhotoAttachmentPanel entityType="culture_category" entityId={category.id} />
    </div>
  );
}
