import Link from "next/link";
import { EvidenceBadge } from "./EvidenceBadge";
import { humanizeRecordType } from "@/lib/archive/labels";
import type { Database } from "@/lib/supabase/types";

type ArchiveItem = Database["public"]["Tables"]["archive_items"]["Row"];

export function ArchiveCard({ item }: { item: ArchiveItem }) {
  return (
    <Link
      href={`/archive/${item.slug}`}
      className="group flex flex-col rounded-lg border border-line bg-paper p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          {humanizeRecordType(item.record_type)}
        </p>
        {item.featured && (
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
            Featured
          </span>
        )}
      </div>

      <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink group-hover:text-accent">
        {item.title}
      </h3>

      {item.subtitle && <p className="mt-1 text-sm text-ink-soft">{item.subtitle}</p>}

      {item.description && (
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink-soft">{item.description}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <EvidenceBadge evidenceType={item.evidence_type} />
        {item.date_display && <span className="text-xs text-ink-soft">{item.date_display}</span>}
      </div>
    </Link>
  );
}
