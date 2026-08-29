import { AdminForm } from "@/components/admin/AdminForm";
import { TextField, TextAreaField, SelectField, ListField } from "@/components/admin/fields";
import { STATUS_OPTIONS, EVIDENCE_OPTIONS, CONFIDENCE_OPTIONS } from "@/lib/admin/options";
import { requireEditorPage } from "@/lib/admin/session";
import { createPerson } from "../actions";

export default async function NewPersonPage() {
  await requireEditorPage("/admin/people");
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">New person</h1>
      <div className="mt-6">
        <AdminForm action={createPerson} submitLabel="Create person" cancelHref="/admin/people">
          <TextField name="name" label="Name" required />
          <TextField name="slug" label="Slug (leave blank to auto-generate)" />
          <ListField name="alternative_names" label="Alternative names" />
          <ListField name="titles" label="Titles" />
          <TextAreaField name="biography" label="Biography" />
          <TextField name="birth_date" label="Birth date" type="date" />
          <TextField name="death_date" label="Death date" type="date" />
          <ListField name="associated_locations" label="Associated locations" />
          <TextField name="historical_period" label="Historical period" />
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
