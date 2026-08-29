import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminForm } from "@/components/admin/AdminForm";
import { ArchiveItemFields } from "@/components/admin/ArchiveItemFields";
import { TextField, SelectField, CheckboxField } from "@/components/admin/fields";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { PreviewLink } from "@/components/admin/PreviewLink";
import { requireEditorPage } from "@/lib/admin/session";
import { updateArchiveItem, deleteArchiveItem, addArchiveMedia, deleteArchiveMedia } from "../actions";

const MEDIA_TYPE_OPTIONS = [
  { value: "image", label: "Image" },
  { value: "audio", label: "Audio" },
  { value: "video", label: "Video" },
  { value: "document", label: "Document" },
] as const;

export default async function EditArchiveItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireEditorPage("/admin/archive-items");
  const supabase = await createClient();
  const [{ data: item }, { data: media }] = await Promise.all([
    supabase.from("archive_items").select("*").eq("id", id).maybeSingle(),
    supabase.from("archive_media").select("*").eq("archive_item_id", id).order("created_at"),
  ]);
  if (!item) notFound();

  const metadataOnlyWarning = item.copyright_status === "COPYRIGHTED_METADATA_ONLY" && (media?.length ?? 0) > 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">Edit archive item</h1>
        <PreviewLink href={`/archive/${item.slug}`} />
      </div>
      <div className="mt-6">
        <AdminForm
          action={updateArchiveItem.bind(null, id)}
          deleteAction={deleteArchiveItem.bind(null, id)}
          submitLabel="Save changes"
          cancelHref="/admin/archive-items"
        >
          <ArchiveItemFields item={item} />
        </AdminForm>
      </div>

      <div className="mt-10 max-w-2xl border-t border-line pt-8">
        <h2 className="font-display text-xl font-semibold text-ink">Media</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Register a file already uploaded to Supabase Storage by its storage path. A file-upload
          widget with per-item access control (matching copyright status) is a documented
          follow-up — see ROADMAP.md — not yet built.
        </p>

        {metadataOnlyWarning && (
          <p className="mt-3 rounded-md border border-evidence-disputed/40 bg-evidence-disputed/10 p-3 text-sm text-evidence-disputed">
            This item is marked &quot;Copyrighted — metadata only&quot; but has media files attached.
            Per COPYRIGHT_GUIDELINES.md, a metadata-only item should not have the full file
            attached — double-check these files are appropriate (e.g. a separately-licensed
            thumbnail) before publishing.
          </p>
        )}

        {media && media.length > 0 && (
          <ul className="mt-4 space-y-2">
            {media.map((m) => (
              <li key={m.id} className="flex items-center justify-between rounded-md border border-line bg-paper p-3 text-sm">
                <div>
                  <p className="font-medium text-ink">{m.storage_path}</p>
                  <p className="text-ink-soft">
                    {m.media_type ?? "unknown type"}
                    {m.is_primary ? " · primary" : ""}
                    {m.caption ? ` · ${m.caption}` : ""}
                  </p>
                </div>
                <form action={deleteArchiveMedia.bind(null, m.id, id)}>
                  <ConfirmSubmitButton
                    confirmMessage="Remove this media entry?"
                    className="text-xs font-medium text-evidence-disputed hover:underline"
                  >
                    Remove
                  </ConfirmSubmitButton>
                </form>
              </li>
            ))}
          </ul>
        )}

        <form action={addArchiveMedia.bind(null, id)} className="mt-4 space-y-3 rounded-lg border border-line bg-paper p-4">
          <TextField name="storage_path" label="Storage path" required />
          <SelectField name="media_type" label="Media type" options={MEDIA_TYPE_OPTIONS} />
          <TextField name="caption" label="Caption" />
          <CheckboxField name="is_primary" label="Use as primary/cover media" />
          <button
            type="submit"
            className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent"
          >
            Add media entry
          </button>
        </form>
      </div>
    </div>
  );
}
