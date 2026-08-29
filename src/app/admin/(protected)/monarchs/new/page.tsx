import { createClient } from "@/lib/supabase/server";
import { AdminForm } from "@/components/admin/AdminForm";
import { TextField, TextAreaField, SelectField } from "@/components/admin/fields";
import { STATUS_OPTIONS, EVIDENCE_OPTIONS, CONFIDENCE_OPTIONS } from "@/lib/admin/options";
import { requireEditorPage } from "@/lib/admin/session";
import { createMonarch } from "../actions";

export default async function NewMonarchPage() {
  await requireEditorPage("/admin/monarchs");
  const supabase = await createClient();
  const { data: monarchs } = await supabase.from("monarchs").select("id, name").order("name");
  const monarchOptions = [
    { value: "", label: "— None —" },
    ...(monarchs ?? []).map((m) => ({ value: m.id, label: m.name })),
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">New monarch</h1>
      <div className="mt-6">
        <AdminForm action={createMonarch} submitLabel="Create monarch" cancelHref="/admin/monarchs">
          <TextField name="name" label="Name" required />
          <TextField name="slug" label="Slug (leave blank to auto-generate)" />
          <TextField name="regnal_name" label="Regnal name / title (e.g. 'Obi ... II')" />
          <TextField name="reign_start" label="Reign start (if known)" type="date" />
          <TextField name="reign_end" label="Reign end (if known)" type="date" />
          <TextField name="reign_display" label="Reign as shown to visitors (e.g. 'crowned December 2016')" />
          <SelectField name="predecessor_id" label="Predecessor" options={monarchOptions} />
          <SelectField name="successor_id" label="Successor" options={monarchOptions} />
          <TextAreaField name="biography" label="Biography" />
          <TextField
            name="image_media_id"
            label="Cover image (Archive Media ID — see an Archive Item's Media list, or its /media/… link)"
          />
          <SelectField name="evidence_type" label="Evidence type" options={EVIDENCE_OPTIONS} />
          <SelectField name="confidence_level" label="Confidence level" options={CONFIDENCE_OPTIONS} />
          <SelectField name="verification_status" label="Workflow status" options={STATUS_OPTIONS} />
        </AdminForm>
      </div>
    </div>
  );
}
