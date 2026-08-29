import type { ReactNode } from "react";
import Link from "next/link";

export interface AdminListColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
}

export function AdminList<T extends { id: string }>({
  title,
  rows,
  columns,
  editHref,
  newHref,
  newLabel,
  canEdit,
  emptyMessage,
}: {
  title: string;
  rows: T[];
  columns: AdminListColumn<T>[];
  editHref: (row: T) => string;
  newHref: string;
  newLabel: string;
  canEdit: boolean;
  emptyMessage: string;
}) {
  return (
    <div>
      <Link href="/admin" className="text-sm text-ink-soft hover:text-accent">
        ← Dashboard
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
        {canEdit && (
          <Link
            href={newHref}
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-accent"
          >
            {newLabel}
          </Link>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-line bg-paper p-6 text-sm text-ink-soft">
          {emptyMessage}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
                {columns.map((col) => (
                  <th key={col.header} className="py-2 pr-4">
                    {col.header}
                  </th>
                ))}
                <th className="py-2 pl-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-line">
                  {columns.map((col) => (
                    <td key={col.header} className="py-3 pr-4 align-top">
                      {col.render(row)}
                    </td>
                  ))}
                  <td className="py-3 pl-2 text-right align-top">
                    <Link href={editHref(row)} className="text-sm font-medium text-accent hover:underline">
                      {canEdit ? "Edit" : "View"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
