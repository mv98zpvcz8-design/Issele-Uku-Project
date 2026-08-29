import { createClient } from "@/lib/supabase/server";
import { getAdminSession, canEdit } from "@/lib/admin/session";
import { AdminList } from "@/components/admin/AdminList";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdminArchiveItemsPage() {
  const session = await getAdminSession();
  const supabase = await createClient();
  const { data } = await supabase.from("archive_items").select("*").order("updated_at", { ascending: false });

  return (
    <AdminList
      title="Archive Items"
      rows={data ?? []}
      canEdit={canEdit(session!.role)}
      newHref="/admin/archive-items/new"
      newLabel="New archive item"
      editHref={(row) => `/admin/archive-items/${row.id}`}
      emptyMessage="No archive items yet."
      columns={[
        { header: "Title", render: (r) => <span className="font-medium text-ink">{r.title}</span> },
        { header: "Type", render: (r) => r.record_type ?? "—" },
        { header: "Evidence", render: (r) => r.evidence_type },
        { header: "Status", render: (r) => <StatusBadge status={r.verification_status} /> },
      ]}
    />
  );
}
