import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminForm } from "@/components/admin/AdminForm";
import { TextField, TextAreaField, SelectField, ListField } from "@/components/admin/fields";
import { STATUS_OPTIONS, EVIDENCE_OPTIONS, CONFIDENCE_OPTIONS } from "@/lib/admin/options";
import { PreviewLink } from "@/components/admin/PreviewLink";
import { PhotoAttachmentPanel } from "@/components/admin/PhotoAttachmentPanel";
import { requireEditorPage } from "@/lib/admin/session";
import { updatePlace, deletePlace } from "../actions";

export default async function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireEditorPage("/admin/places");
  const supabase = await createClient();
  const { data: place } = await supabase.from("places").select("*").eq("id", id).maybeSingle();
  if (!place) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">Edit place</h1>
        <PreviewLink href={`/places/${place.slug}`} />
      </div>
      <div className="mt-6">
        <AdminForm
          action={updatePlace.bind(null, id)}
          deleteAction={deletePlace.bind(null, id)}
          submitLabel="Save changes"
          cancelHref="/admin/places"
        >
          <TextField name="name" label="Name" defaultValue={place.name} required />
          <TextField name="slug" label="Slug" defaultValue={place.slug} />
          <ListField name="alternative_names" label="Alternative names" defaultValue={place.alternative_names} />
          <TextField name="category" label="Category" defaultValue={place.category} />
          <TextAreaField name="description" label="Description" defaultValue={place.description} />
          <TextAreaField
            name="historical_significance"
            label="Historical significance"
            defaultValue={place.historical_significance}
          />
          <TextField name="latitude" label="Latitude" defaultValue={place.latitude?.toString()} />
          <TextField name="longitude" label="Longitude" defaultValue={place.longitude?.toString()} />
          <TextField
            name="cover_media_id"
            label="Cover image (Archive Media ID — see an Archive Item's Media list, or its /media/… link)"
            defaultValue={place.cover_media_id}
          />
          <SelectField name="evidence_type" label="Evidence type" defaultValue={place.evidence_type} options={EVIDENCE_OPTIONS} />
          <SelectField
            name="confidence_level"
            label="Confidence level"
            defaultValue={place.confidence_level}
            options={CONFIDENCE_OPTIONS}
          />
          <SelectField
            name="verification_status"
            label="Workflow status"
            defaultValue={place.verification_status}
            options={STATUS_OPTIONS}
          />
        </AdminForm>
      </div>

      <PhotoAttachmentPanel entityType="place" entityId={place.id} />
    </div>
  );
}
