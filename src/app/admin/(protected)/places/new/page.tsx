import { AdminForm } from "@/components/admin/AdminForm";
import { TextField, TextAreaField, SelectField, ListField } from "@/components/admin/fields";
import { STATUS_OPTIONS, EVIDENCE_OPTIONS, CONFIDENCE_OPTIONS } from "@/lib/admin/options";
import { requireEditorPage } from "@/lib/admin/session";
import { createPlace } from "../actions";

export default async function NewPlacePage() {
  await requireEditorPage("/admin/places");
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">New place</h1>
      <div className="mt-6">
        <AdminForm action={createPlace} submitLabel="Create place" cancelHref="/admin/places">
          <TextField name="name" label="Name" required />
          <TextField name="slug" label="Slug (leave blank to auto-generate)" />
          <ListField name="alternative_names" label="Alternative names" />
          <TextField name="category" label="Category (e.g. quarter, market, palace, church, school)" />
          <TextAreaField name="description" label="Description" />
          <TextAreaField name="historical_significance" label="Historical significance" />
          <TextField name="latitude" label="Latitude" />
          <TextField name="longitude" label="Longitude" />
          <TextField
            name="cover_media_id"
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
