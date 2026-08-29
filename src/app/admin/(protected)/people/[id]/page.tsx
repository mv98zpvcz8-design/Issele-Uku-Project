import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminForm } from "@/components/admin/AdminForm";
import { TextField, TextAreaField, SelectField, ListField } from "@/components/admin/fields";
import { STATUS_OPTIONS, EVIDENCE_OPTIONS, CONFIDENCE_OPTIONS, PERSON_CATEGORY_OPTIONS } from "@/lib/admin/options";
import { PreviewLink } from "@/components/admin/PreviewLink";
import { PhotoAttachmentPanel } from "@/components/admin/PhotoAttachmentPanel";
import { requireEditorPage } from "@/lib/admin/session";
import { updatePerson, deletePerson } from "../actions";

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireEditorPage("/admin/people");
  const supabase = await createClient();
  const { data: person } = await supabase.from("people").select("*").eq("id", id).maybeSingle();
  if (!person) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">Edit person</h1>
        <PreviewLink href={`/people/${person.slug}`} />
      </div>
      <div className="mt-6">
        <AdminForm
          action={updatePerson.bind(null, id)}
          deleteAction={deletePerson.bind(null, id)}
          submitLabel="Save changes"
          cancelHref="/admin/people"
        >
          <TextField name="name" label="Name" defaultValue={person.name} required />
          <TextField name="slug" label="Slug" defaultValue={person.slug} />
          <ListField name="alternative_names" label="Alternative names" defaultValue={person.alternative_names} />
          <ListField name="titles" label="Titles" defaultValue={person.titles} />
          <TextAreaField name="biography" label="Biography" defaultValue={person.biography} />
          <TextField name="birth_date" label="Birth date" type="date" defaultValue={person.birth_date} />
          <TextField name="death_date" label="Death date" type="date" defaultValue={person.death_date} />
          <ListField name="associated_locations" label="Associated locations" defaultValue={person.associated_locations} />
          <TextField name="historical_period" label="Historical period" defaultValue={person.historical_period} />
          <TextField
            name="image_media_id"
            label="Cover image (Archive Media ID — see an Archive Item's Media list, or its /media/… link)"
            defaultValue={person.image_media_id}
          />
          <SelectField
            name="person_category"
            label="Category"
            defaultValue={person.person_category}
            options={PERSON_CATEGORY_OPTIONS}
          />
          <TextField
            name="current_residence"
            label="Current residence (e.g. a diaspora city/country)"
            defaultValue={person.current_residence}
          />
          <SelectField name="evidence_type" label="Evidence type" defaultValue={person.evidence_type} options={EVIDENCE_OPTIONS} />
          <SelectField
            name="confidence_level"
            label="Confidence level"
            defaultValue={person.confidence_level}
            options={CONFIDENCE_OPTIONS}
          />
          <SelectField
            name="verification_status"
            label="Workflow status"
            defaultValue={person.verification_status}
            options={STATUS_OPTIONS}
          />
        </AdminForm>
      </div>

      <PhotoAttachmentPanel entityType="person" entityId={person.id} />
    </div>
  );
}
