import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ContentStatus } from "@/lib/supabase/types";

const STATUSES: ContentStatus[] = ["DRAFT", "RESEARCH", "REVIEW", "APPROVED", "PUBLISHED", "RESTRICTED"];

const TABLES = [
  { table: "archive_items", label: "Archive Items", href: "/admin/archive-items" },
  { table: "sources", label: "Sources", href: "/admin/sources" },
  { table: "historical_events", label: "Historical Events", href: "/admin/historical-events" },
  { table: "people", label: "People", href: "/admin/people" },
  { table: "places", label: "Places", href: "/admin/places" },
  { table: "monarchs", label: "Monarchs", href: "/admin/monarchs" },
  { table: "culture_categories", label: "Culture Categories", href: "/admin/culture-categories" },
] as const;

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const counts = await Promise.all(
    TABLES.map(async ({ table }) => {
      const { data } = await supabase.from(table).select("verification_status");
      const tally: Record<ContentStatus, number> = {
        DRAFT: 0,
        RESEARCH: 0,
        REVIEW: 0,
        APPROVED: 0,
        PUBLISHED: 0,
        RESTRICTED: 0,
      };
      for (const row of data ?? []) tally[row.verification_status]++;
      return tally;
    }),
  );

  const { count: pendingSubmissions } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("review_status", "pending");

  const totalInReview = counts.reduce((sum, tally) => sum + tally.REVIEW, 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>

      {totalInReview > 0 && (
        <div className="mt-4 rounded-lg border border-accent/40 bg-accent-soft p-4 text-sm text-ink">
          <strong>{totalInReview}</strong> record{totalInReview === 1 ? "" : "s"} across the tables
          below {totalInReview === 1 ? "is" : "are"} waiting in REVIEW status — nothing there is
          public yet.
        </div>
      )}

      {typeof pendingSubmissions === "number" && pendingSubmissions > 0 && (
        <div className="mt-4 rounded-lg border border-line bg-paper p-4 text-sm text-ink">
          <strong>{pendingSubmissions}</strong> pending submission{pendingSubmissions === 1 ? "" : "s"}{" "}
          from the public correction/contribution form (Phase 7 will add a review UI here).
        </div>
      )}

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="py-2 pr-4">Content type</th>
              {STATUSES.map((status) => (
                <th key={status} className="px-2 py-2 text-right">
                  {status}
                </th>
              ))}
              <th className="py-2 pl-2"></th>
            </tr>
          </thead>
          <tbody>
            {TABLES.map(({ label, href }, i) => (
              <tr key={href} className="border-b border-line">
                <td className="py-3 pr-4 font-medium text-ink">{label}</td>
                {STATUSES.map((status) => (
                  <td key={status} className="px-2 py-3 text-right text-ink-soft">
                    {counts[i][status] || "—"}
                  </td>
                ))}
                <td className="py-3 pl-2 text-right">
                  <Link href={href} className="text-sm font-medium text-accent hover:underline">
                    Manage →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
