import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminForm } from "@/components/admin/AdminForm";
import { TextField, TextAreaField, SelectField } from "@/components/admin/fields";
import { STATUS_OPTIONS, EVIDENCE_OPTIONS, CONFIDENCE_OPTIONS } from "@/lib/admin/options";
import { PreviewLink } from "@/components/admin/PreviewLink";
import { requireEditorPage } from "@/lib/admin/session";
import { updateHistoricalEvent, deleteHistoricalEvent } from "../actions";

export default async function EditHistoricalEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireEditorPage("/admin/historical-events");
  const supabase = await createClient();
  const [{ data: event }, { data: places }] = await Promise.all([
    supabase.from("historical_events").select("*").eq("id", id).maybeSingle(),
    supabase.from("places").select("id, name").order("name"),
  ]);
  if (!event) notFound();

  const placeOptions = [{ value: "", label: "— None —" }, ...(places ?? []).map((p) => ({ value: p.id, label: p.name }))];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">Edit historical event</h1>
        <PreviewLink href={`/history/${event.slug}`} />
      </div>
      <div className="mt-6">
        <AdminForm
          action={updateHistoricalEvent.bind(null, id)}
          deleteAction={deleteHistoricalEvent.bind(null, id)}
          submitLabel="Save changes"
          cancelHref="/admin/historical-events"
        >
          <TextField name="title" label="Title" defaultValue={event.title} required />
          <TextField name="slug" label="Slug" defaultValue={event.slug} />
          <TextAreaField name="description" label="Description" defaultValue={event.description} />
          <TextField name="date_exact" label="Exact date (if known)" type="date" defaultValue={event.date_exact} />
          <TextField name="date_from" label="Date range: from" type="date" defaultValue={event.date_from} />
          <TextField name="date_to" label="Date range: to" type="date" defaultValue={event.date_to} />
          <TextField name="date_display" label="Date as shown to visitors" defaultValue={event.date_display} />
          <SelectField name="location_id" label="Location" defaultValue={event.location_id ?? ""} options={placeOptions} />
          <SelectField name="evidence_type" label="Evidence type" defaultValue={event.evidence_type} options={EVIDENCE_OPTIONS} />
          <SelectField
            name="confidence_level"
            label="Confidence level"
            defaultValue={event.confidence_level}
            options={CONFIDENCE_OPTIONS}
          />
          <SelectField
            name="verification_status"
            label="Workflow status"
            defaultValue={event.verification_status}
            options={STATUS_OPTIONS}
          />
        </AdminForm>
      </div>
    </div>
  );
}
