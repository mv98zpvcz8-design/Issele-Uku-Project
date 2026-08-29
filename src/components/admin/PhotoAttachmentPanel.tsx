import { createClient } from "@/lib/supabase/server";
import { getLinkedArchiveItemIds, type PhotoLinkEntityType } from "@/lib/content/photoLinks";
import { attachExistingArchiveItem, uploadAndAttachArchiveItem, detachArchiveItem } from "@/app/admin/photo-links/actions";
import { ConfirmSubmitButton } from "./ConfirmSubmitButton";
import { TextField } from "./fields";

export async function PhotoAttachmentPanel({
  entityType,
  entityId,
}: {
  entityType: PhotoLinkEntityType;
  entityId: string;
}) {
  const supabase = await createClient();
  const linkedIds = await getLinkedArchiveItemIds(entityType, entityId);

  const [{ data: linkedItems }, { data: allItems }] = await Promise.all([
    linkedIds.length
      ? supabase.from("archive_items").select("id, title, verification_status").in("id", linkedIds)
      : Promise.resolve({ data: [] as { id: string; title: string; verification_status: string }[] }),
    supabase.from("archive_items").select("id, title").order("title").limit(200),
  ]);

  const attachableItems = (allItems ?? []).filter((i) => !linkedIds.includes(i.id));

  return (
    <div className="mt-10 max-w-2xl border-t border-line pt-8">
      <h2 className="font-display text-xl font-semibold text-ink">Photos &amp; documents</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Attach an existing Archive Item, or upload a new photo/document directly — that creates a
        minimal Archive Item automatically, at Draft status. Edit it under Archive Items for full
        evidence/copyright metadata before publishing it.
      </p>

      {linkedItems && linkedItems.length > 0 && (
        <ul className="mt-4 space-y-2">
          {linkedItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-md border border-line bg-paper p-3 text-sm"
            >
              <div>
                <a href={`/admin/archive-items/${item.id}`} className="font-medium text-accent hover:underline">
                  {item.title}
                </a>
                <p className="text-ink-soft">{item.verification_status}</p>
              </div>
              <form action={detachArchiveItem.bind(null, entityType, entityId, item.id)}>
                <ConfirmSubmitButton
                  confirmMessage="Remove this photo/document from here? It stays in the Archive itself."
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
        action={uploadAndAttachArchiveItem.bind(null, entityType, entityId)}
        className="mt-4 space-y-3 rounded-lg border border-line bg-paper p-4"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Upload a new photo</p>
        <div>
          <label htmlFor="photo-file" className="block text-xs font-medium text-ink-soft">
            File
          </label>
          <input
            id="photo-file"
            name="file"
            type="file"
            required
            className="mt-1 w-full text-sm text-ink file:mr-3 file:rounded-md file:border file:border-line file:bg-paper-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink"
          />
        </div>
        <TextField name="caption" label="Caption" />
        <button
          type="submit"
          className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent"
        >
          Upload &amp; attach
        </button>
      </form>

      {attachableItems.length > 0 && (
        <form
          action={attachExistingArchiveItem.bind(null, entityType, entityId)}
          className="mt-4 space-y-3 rounded-lg border border-line bg-paper p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Or attach an existing Archive Item
          </p>
          <select
            name="archive_item_id"
            required
            defaultValue=""
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
          >
            <option value="" disabled>
              — Choose —
            </option>
            {attachableItems.map((i) => (
              <option key={i.id} value={i.id}>
                {i.title}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent"
          >
            Attach
          </button>
        </form>
      )}
    </div>
  );
}
