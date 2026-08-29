import { createClient } from "@/lib/supabase/server";
import { getAdminSession, canEdit } from "@/lib/admin/session";
import { AdminList } from "@/components/admin/AdminList";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdminMonarchsPage() {
  const session = await getAdminSession();
  const supabase = await createClient();
  const { data } = await supabase.from("monarchs").select("*").order("name", { ascending: true });

  return (
    <AdminList
      title="Monarchs"
      rows={data ?? []}
      canEdit={canEdit(session!.role)}
      newHref="/admin/monarchs/new"
      newLabel="New monarch"
      editHref={(row) => `/admin/monarchs/${row.id}`}
      emptyMessage="No monarchs yet."
      columns={[
        { header: "Name", render: (r) => <span className="font-medium text-ink">{r.regnal_name ?? r.name}</span> },
        { header: "Reign", render: (r) => r.reign_display ?? "—" },
        { header: "Status", render: (r) => <StatusBadge status={r.verification_status} /> },
      ]}
    />
  );
}
