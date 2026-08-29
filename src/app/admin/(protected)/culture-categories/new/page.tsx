import { AdminForm } from "@/components/admin/AdminForm";
import { TextField, TextAreaField, SelectField } from "@/components/admin/fields";
import { STATUS_OPTIONS, EVIDENCE_OPTIONS, CONFIDENCE_OPTIONS } from "@/lib/admin/options";
import { requireEditorPage } from "@/lib/admin/session";
import { createCultureCategory } from "../actions";

export default async function NewCultureCategoryPage() {
  await requireEditorPage("/admin/culture-categories");
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">New culture category</h1>
      <div className="mt-6">
        <AdminForm action={createCultureCategory} submitLabel="Create category" cancelHref="/admin/culture-categories">
          <TextField name="name" label="Name" required />
          <TextField name="slug" label="Slug (leave blank to auto-generate)" />
          <TextAreaField name="description" label="Description" />
          <SelectField name="evidence_type" label="Evidence type" options={EVIDENCE_OPTIONS} />
          <SelectField name="confidence_level" label="Confidence level" options={CONFIDENCE_OPTIONS} />
          <SelectField name="verification_status" label="Workflow status" options={STATUS_OPTIONS} />
        </AdminForm>
      </div>
    </div>
  );
}
