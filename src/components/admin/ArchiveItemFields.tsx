import { TextField, TextAreaField, SelectField, CheckboxField } from "@/components/admin/fields";
import { STATUS_OPTIONS, EVIDENCE_OPTIONS, CONFIDENCE_OPTIONS, COPYRIGHT_OPTIONS } from "@/lib/admin/options";
import { RECORD_TYPES } from "@/lib/archive/search";
import { humanizeRecordType } from "@/lib/archive/labels";
import type { Database } from "@/lib/supabase/types";

type ArchiveItemRow = Database["public"]["Tables"]["archive_items"]["Row"];

const RECORD_TYPE_OPTIONS = [
  { value: "", label: "— Not set —" },
  ...RECORD_TYPES.map((t) => ({ value: t, label: humanizeRecordType(t) })),
];

const ACCESS_STATUS_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "metadata_only", label: "Metadata only" },
  { value: "restricted", label: "Restricted" },
] as const;

/** Shared by the create and edit pages — one 26-field form, defined once. */
export function ArchiveItemFields({ item }: { item?: ArchiveItemRow }) {
  return (
    <>
      <TextField name="title" label="Title" defaultValue={item?.title} required />
      <TextField name="slug" label="Slug (leave blank to auto-generate from title)" defaultValue={item?.slug} />
      <TextField name="subtitle" label="Subtitle" defaultValue={item?.subtitle} />
      <TextAreaField name="description" label="Description" defaultValue={item?.description} />
      <TextAreaField name="abstract" label="Abstract" defaultValue={item?.abstract} />
      <SelectField name="record_type" label="Record type" defaultValue={item?.record_type ?? ""} options={RECORD_TYPE_OPTIONS} />

      <TextField name="date_exact" label="Exact date (if known)" type="date" defaultValue={item?.date_exact} />
      <TextField name="date_from" label="Date range: from" type="date" defaultValue={item?.date_from} />
      <TextField name="date_to" label="Date range: to" type="date" defaultValue={item?.date_to} />
      <TextField name="date_display" label="Date as shown to visitors" defaultValue={item?.date_display} />
      <TextField name="historical_period" label="Historical period" defaultValue={item?.historical_period} />

      <TextField name="creator" label="Creator" defaultValue={item?.creator} />
      <TextField name="contributor" label="Contributor" defaultValue={item?.contributor} />
      <TextField name="language" label="Language" defaultValue={item?.language} />
      <TextField name="location" label="Location" defaultValue={item?.location} />

      <TextField name="source_name" label="Source name" defaultValue={item?.source_name} />
      <TextField name="source_url" label="Source URL" type="url" defaultValue={item?.source_url} />
      <TextAreaField name="source_citation" label="Source citation" defaultValue={item?.source_citation} />
      <TextField name="source_type" label="Source type" defaultValue={item?.source_type} />
      <TextField name="source_repository" label="Source repository" defaultValue={item?.source_repository} />

      <TextField name="rights_holder" label="Rights holder" defaultValue={item?.rights_holder} />
      <SelectField
        name="copyright_status"
        label="Copyright status"
        defaultValue={item?.copyright_status}
        options={COPYRIGHT_OPTIONS}
      />
      <CheckboxField
        name="publication_permission"
        label="Publication permission confirmed"
        defaultChecked={item?.publication_permission}
      />
      <SelectField name="access_status" label="Access status" defaultValue={item?.access_status} options={ACCESS_STATUS_OPTIONS} />

      <SelectField name="evidence_type" label="Evidence type" defaultValue={item?.evidence_type} options={EVIDENCE_OPTIONS} />
      <SelectField
        name="confidence_level"
        label="Confidence level"
        defaultValue={item?.confidence_level}
        options={CONFIDENCE_OPTIONS}
      />
      <SelectField
        name="verification_status"
        label="Workflow status"
        defaultValue={item?.verification_status}
        options={STATUS_OPTIONS}
      />
      <TextAreaField name="cultural_sensitivity" label="Cultural sensitivity notes" defaultValue={item?.cultural_sensitivity} />
      <CheckboxField name="featured" label="Feature on homepage/section highlights" defaultChecked={item?.featured} />
    </>
  );
}
