import { createClient } from "@/lib/supabase/server";
import { getLinkedArchiveItemIds, type PhotoLinkEntityType } from "@/lib/content/photoLinks";
import { MediaItem } from "./ArchiveMediaGallery";

/**
 * Renders every photo/document attached to a culture category, event,
 * source, person, place, or monarch — via the archive items linked to
 * it (see photoLinks.ts) — as a plain grid at the bottom of the page,
 * same spot the brief's own screenshots asked for ("after the text").
 * Nothing renders at all if there's nothing attached, rather than an
 * empty-state placeholder — this is a bonus section, not a required one
 * like the archive item's own media gallery.
 */
export async function AttachedPhotos({ entityType, entityId }: { entityType: PhotoLinkEntityType; entityId: string }) {
  const archiveItemIds = await getLinkedArchiveItemIds(entityType, entityId);
  if (archiveItemIds.length === 0) return null;

  const supabase = await createClient();
  const { data: media } = await supabase
    .from("archive_media")
    .select("*")
    .in("archive_item_id", archiveItemIds)
    .order("created_at", { ascending: true });

  if (!media || media.length === 0) return null;

  return (
    <div className="mt-8 border-t border-line pt-6">
      <h2 className="font-display text-lg font-semibold text-ink">Photos &amp; documents</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {media.map((m) => (
          <li key={m.id}>
            <MediaItem media={m} itemTitle="" />
          </li>
        ))}
      </ul>
    </div>
  );
}
