import { createClient } from "@/lib/supabase/server";
import { AdminForm } from "@/components/admin/AdminForm";
import { TextField, TextAreaField, SelectField } from "@/components/admin/fields";
import { STATUS_OPTIONS, EVIDENCE_OPTIONS, CONFIDENCE_OPTIONS } from "@/lib/admin/options";
import { requireEditorPage } from "@/lib/admin/session";
import { createHistoricalEvent } from "../actions";

export default async function NewHistoricalEventPage() {
  await requireEditorPage("/admin/historical-events");
  const supabase = await createClient();
  const { data: places } = await supabase.from("places").select("id, name").order("name");
  const placeOptions = [{ value: "", label: "— None —" }, ...(places ?? []).map((p) => ({ value: p.id, label: p.name }))];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">New historical event</h1>
      <div className="mt-6">
        <AdminForm action={createHistoricalEvent} submitLabel="Create event" cancelHref="/admin/historical-events">
          <TextField name="title" label="Title" required />
          <TextField name="slug" label="Slug (leave blank to auto-generate)" />
          <TextAreaField name="description" label="Description" />
          <TextField name="date_exact" label="Exact date (if known)" type="date" />
          <TextField name="date_from" label="Date range: from" type="date" />
          <TextField name="date_to" label="Date range: to" type="date" />
          <TextField name="date_display" label="Date as shown to visitors (e.g. 'c. 1930s')" />
          <SelectField name="location_id" label="Location" options={placeOptions} />
          <SelectField name="evidence_type" label="Evidence type" options={EVIDENCE_OPTIONS} />
          <SelectField name="confidence_level" label="Confidence level" options={CONFIDENCE_OPTIONS} />
          <SelectField name="verification_status" label="Workflow status" options={STATUS_OPTIONS} />
        </AdminForm>
      </div>
    </div>
  );
}
