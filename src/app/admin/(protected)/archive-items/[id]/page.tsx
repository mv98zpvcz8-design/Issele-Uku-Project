import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminForm } from "@/components/admin/AdminForm";
import { ArchiveItemFields } from "@/components/admin/ArchiveItemFields";
import { TextField, CheckboxField } from "@/components/admin/fields";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { PreviewLink } from "@/components/admin/PreviewLink";
import { requireEditorPage } from "@/lib/admin/session";
import { updateArchiveItem, deleteArchiveItem, uploadArchiveMedia, deleteArchiveMedia } from "../actions";

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
          Files are stored privately — nobody can view or download one directly by URL. Public
          visitors can only see a file if this item is Published; staff can always preview it via
          the item&apos;s own page.
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
                  <a href={`/media/${m.id}`} target="_blank" rel="noreferrer" className="font-medium text-accent hover:underline">
                    {m.caption || m.storage_path.split("/").pop()}
                  </a>
                  <p className="text-ink-soft">
                    {m.media_type ?? "unknown type"}
                    {m.is_primary ? " · primary" : ""}
                  </p>
                </div>
                <form action={deleteArchiveMedia.bind(null, m.id, id)}>
                  <ConfirmSubmitButton
                    confirmMessage="Remove this media entry? The file is deleted from storage too."
                    className="text-xs font-medium text-evidence-disputed hover:underline"
                  >
                    Remove
                  </ConfirmSubmitButton>
                </form>
              </li>
            ))}
          </ul>
        )}

        <form
          action={uploadArchiveMedia.bind(null, id)}
          className="mt-4 space-y-3 rounded-lg border border-line bg-paper p-4"
        >
          <div>
            <label htmlFor="file" className="block text-xs font-medium text-ink-soft">
              File
            </label>
            <input
              id="file"
              name="file"
              type="file"
              required
              className="mt-1 w-full text-sm text-ink file:mr-3 file:rounded-md file:border file:border-line file:bg-paper-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink"
            />
          </div>
          <TextField name="caption" label="Caption" />
          <CheckboxField name="is_primary" label="Use as primary/cover media" />
          <button
            type="submit"
            className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
