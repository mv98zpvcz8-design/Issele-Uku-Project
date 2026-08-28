/**
 * Shared "nothing to show, and here's honestly why" notice, used by
 * every listing/detail page that reads from Supabase. Three distinct
 * reasons a page might have nothing to render — never collapsed into one
 * generic "no data" message, because they mean different things to a
 * visitor and (especially "not-connected") to whoever is developing this
 * further.
 */
export function StateNotice({
  variant,
  title,
  description,
}: {
  variant: "not-connected" | "error" | "empty";
  title: string;
  description: string;
}) {
  const dashed = variant !== "error";
  return (
    <div
      className={`rounded-lg border bg-paper-muted p-8 text-center ${
        dashed ? "border-dashed border-line" : "border-line"
      }`}
    >
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-2 text-sm text-ink-soft">{description}</p>
    </div>
  );
}

export const NOT_CONNECTED_NOTICE = {
  title: "The archive database isn't connected yet.",
  description:
    "This page is fully built and will show live records as soon as a Supabase project is connected (see DEPLOYMENT.md). This is expected during development — it is not a bug.",
} as const;

export const LOAD_ERROR_NOTICE = {
  title: "This couldn't be loaded.",
  description: "Something went wrong reaching the database. Please try again shortly.",
} as const;
