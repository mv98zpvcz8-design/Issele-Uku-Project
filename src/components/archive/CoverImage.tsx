/** Same /media/[id] mechanism as ArchiveMediaGallery — see that route's own comment on why. */
export function CoverImage({ mediaId, alt }: { mediaId: string | null; alt: string }) {
  if (!mediaId) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- src is a same-origin redirect to a short-lived signed URL, not a static asset next/image can optimize
    <img
      src={`/media/${mediaId}`}
      alt={alt}
      className="mt-4 aspect-video w-full rounded-lg border border-line object-cover"
    />
  );
}
