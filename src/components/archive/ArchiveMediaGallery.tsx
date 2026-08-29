import type { Database } from "@/lib/supabase/types";

type ArchiveMedia = Database["public"]["Tables"]["archive_media"]["Row"];

/**
 * Every <img>/<audio>/<video> src and every download link below points
 * at /media/[id] — never a direct Storage URL — so visibility stays
 * entirely decided by archive_media's own RLS (see that route's own
 * comment). This component only ever receives rows the caller was
 * already allowed to see.
 */
export function ArchiveMediaGallery({ media, itemTitle }: { media: ArchiveMedia[]; itemTitle: string }) {
  if (media.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-line bg-paper-muted">
        <p className="text-sm text-ink-soft">No media attached to this record yet.</p>
      </div>
    );
  }

  const primary = media.find((m) => m.is_primary) ?? media[0];
  const rest = media.filter((m) => m.id !== primary.id);

  return (
    <div>
      <MediaItem media={primary} itemTitle={itemTitle} large />
      {rest.length > 0 && (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {rest.map((m) => (
            <li key={m.id}>
              <MediaItem media={m} itemTitle={itemTitle} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MediaItem({ media, itemTitle, large }: { media: ArchiveMedia; itemTitle: string; large?: boolean }) {
  const src = `/media/${media.id}`;
  const alt = media.caption || itemTitle;

  if (media.media_type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- src is a same-origin redirect to a short-lived signed URL, not a static asset next/image can optimize
      <img
        src={src}
        alt={alt}
        className={`w-full rounded-lg border border-line object-cover ${large ? "aspect-video" : "aspect-square"}`}
      />
    );
  }

  if (media.media_type === "audio") {
    return (
      <div className="rounded-lg border border-line bg-paper-muted p-4">
        {media.caption && <p className="mb-2 text-sm font-medium text-ink">{media.caption}</p>}
        <audio controls src={src} className="w-full" />
      </div>
    );
  }

  if (media.media_type === "video") {
    return <video controls src={src} className="w-full rounded-lg border border-line" />;
  }

  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-center rounded-lg border border-dashed border-line bg-paper-muted p-6 text-sm font-medium text-accent underline underline-offset-2"
    >
      {media.caption || "View document"}
    </a>
  );
}
