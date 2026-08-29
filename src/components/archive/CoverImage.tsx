import { LightboxImage } from "./LightboxImage";

/** Same /media/[id] mechanism as ArchiveMediaGallery — see that route's own comment on why. */
export function CoverImage({ mediaId, alt }: { mediaId: string | null; alt: string }) {
  if (!mediaId) return null;
  return (
    <div className="mt-4">
      <LightboxImage
        src={`/media/${mediaId}`}
        alt={alt}
        className="aspect-video w-full rounded-lg border border-line object-cover"
      />
    </div>
  );
}
