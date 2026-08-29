import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminForm } from "@/components/admin/AdminForm";
import { TextField, TextAreaField, SelectField } from "@/components/admin/fields";
import { STATUS_OPTIONS } from "@/lib/admin/options";
import { PreviewLink } from "@/components/admin/PreviewLink";
import { requireEditorPage } from "@/lib/admin/session";
import { updateSource, deleteSource } from "../actions";

const ACCESS_STATUS_OPTIONS = [
  { value: "full_text_available", label: "Full text available" },
  { value: "external_access", label: "External access available" },
  { value: "metadata_only", label: "Metadata only" },
  { value: "restricted", label: "Access restricted" },
] as const;

export default async function EditSourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireEditorPage("/admin/sources");
  const supabase = await createClient();
  const { data: source } = await supabase.from("sources").select("*").eq("id", id).maybeSingle();
  if (!source) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">Edit source</h1>
        <PreviewLink href={`/research-library/${source.slug}`} />
      </div>
      <div className="mt-6">
        <AdminForm
          action={updateSource.bind(null, id)}
          deleteAction={deleteSource.bind(null, id)}
          submitLabel="Save changes"
          cancelHref="/admin/sources"
        >
          <TextField name="title" label="Title" defaultValue={source.title} required />
          <TextField name="slug" label="Slug" defaultValue={source.slug} />
          <TextField name="author" label="Author" defaultValue={source.author} />
          <TextField name="publisher" label="Publisher" defaultValue={source.publisher} />
          <TextField name="publication_date" label="Publication date" type="date" defaultValue={source.publication_date} />
          <TextField name="source_type" label="Source type" defaultValue={source.source_type} />
          <TextField name="url" label="URL" type="url" defaultValue={source.url} />
          <TextField name="isbn" label="ISBN" defaultValue={source.isbn} />
          <TextField name="archive_reference" label="Archive reference" defaultValue={source.archive_reference} />
          <TextAreaField name="citation" label="Full citation" defaultValue={source.citation} />
          <TextAreaField name="reliability_notes" label="Reliability notes" defaultValue={source.reliability_notes} />
          <SelectField name="access_status" label="Access status" defaultValue={source.access_status} options={ACCESS_STATUS_OPTIONS} />
          <SelectField name="verification_status" label="Workflow status" defaultValue={source.verification_status} options={STATUS_OPTIONS} />
        </AdminForm>
      </div>
    </div>
  );
}
