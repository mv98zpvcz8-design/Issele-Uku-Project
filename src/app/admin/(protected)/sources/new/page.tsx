import { AdminForm } from "@/components/admin/AdminForm";
import { TextField, TextAreaField, SelectField } from "@/components/admin/fields";
import { STATUS_OPTIONS } from "@/lib/admin/options";
import { requireEditorPage } from "@/lib/admin/session";
import { createSource } from "../actions";

const ACCESS_STATUS_OPTIONS = [
  { value: "full_text_available", label: "Full text available" },
  { value: "external_access", label: "External access available" },
  { value: "metadata_only", label: "Metadata only" },
  { value: "restricted", label: "Access restricted" },
] as const;

export default async function NewSourcePage() {
  await requireEditorPage("/admin/sources");
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">New source</h1>
      <div className="mt-6">
        <AdminForm action={createSource} submitLabel="Create source" cancelHref="/admin/sources">
          <TextField name="title" label="Title" required />
          <TextField name="slug" label="Slug (leave blank to auto-generate from title)" />
          <TextField name="author" label="Author" />
          <TextField name="publisher" label="Publisher" />
          <TextField name="publication_date" label="Publication date" type="date" />
          <TextField name="source_type" label="Source type (e.g. book, journal_article, newspaper)" />
          <TextField name="url" label="URL" type="url" />
          <TextField name="isbn" label="ISBN" />
          <TextField name="archive_reference" label="Archive reference" />
          <TextAreaField name="citation" label="Full citation" />
          <TextAreaField name="reliability_notes" label="Reliability notes" />
          <SelectField name="access_status" label="Access status" options={ACCESS_STATUS_OPTIONS} />
          <SelectField name="verification_status" label="Workflow status" options={STATUS_OPTIONS} />
        </AdminForm>
      </div>
    </div>
  );
}
