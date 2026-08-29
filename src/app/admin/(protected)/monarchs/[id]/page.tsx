import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminForm } from "@/components/admin/AdminForm";
import { TextField, TextAreaField, SelectField } from "@/components/admin/fields";
import { STATUS_OPTIONS, EVIDENCE_OPTIONS, CONFIDENCE_OPTIONS } from "@/lib/admin/options";
import { PreviewLink } from "@/components/admin/PreviewLink";
import { requireEditorPage } from "@/lib/admin/session";
import { updateMonarch, deleteMonarch } from "../actions";

export default async function EditMonarchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireEditorPage("/admin/monarchs");
  const supabase = await createClient();
  const [{ data: monarch }, { data: monarchs }] = await Promise.all([
    supabase.from("monarchs").select("*").eq("id", id).maybeSingle(),
    supabase.from("monarchs").select("id, name").neq("id", id).order("name"),
  ]);
  if (!monarch) notFound();

  const monarchOptions = [
    { value: "", label: "— None —" },
    ...(monarchs ?? []).map((m) => ({ value: m.id, label: m.name })),
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">Edit monarch</h1>
        <PreviewLink href={`/monarchy/${monarch.slug}`} />
      </div>
      <div className="mt-6">
        <AdminForm
          action={updateMonarch.bind(null, id)}
          deleteAction={deleteMonarch.bind(null, id)}
          submitLabel="Save changes"
          cancelHref="/admin/monarchs"
        >
          <TextField name="name" label="Name" defaultValue={monarch.name} required />
          <TextField name="slug" label="Slug" defaultValue={monarch.slug} />
          <TextField name="regnal_name" label="Regnal name / title" defaultValue={monarch.regnal_name} />
          <TextField name="reign_start" label="Reign start" type="date" defaultValue={monarch.reign_start} />
          <TextField name="reign_end" label="Reign end" type="date" defaultValue={monarch.reign_end} />
          <TextField name="reign_display" label="Reign as shown to visitors" defaultValue={monarch.reign_display} />
          <SelectField name="predecessor_id" label="Predecessor" defaultValue={monarch.predecessor_id ?? ""} options={monarchOptions} />
          <SelectField name="successor_id" label="Successor" defaultValue={monarch.successor_id ?? ""} options={monarchOptions} />
          <TextAreaField name="biography" label="Biography" defaultValue={monarch.biography} />
          <TextField
            name="image_media_id"
            label="Cover image (Archive Media ID — see an Archive Item's Media list, or its /media/… link)"
            defaultValue={monarch.image_media_id}
          />
          <SelectField name="evidence_type" label="Evidence type" defaultValue={monarch.evidence_type} options={EVIDENCE_OPTIONS} />
          <SelectField
            name="confidence_level"
            label="Confidence level"
            defaultValue={monarch.confidence_level}
            options={CONFIDENCE_OPTIONS}
          />
          <SelectField
            name="verification_status"
            label="Workflow status"
            defaultValue={monarch.verification_status}
            options={STATUS_OPTIONS}
          />
        </AdminForm>
      </div>
    </div>
  );
}
