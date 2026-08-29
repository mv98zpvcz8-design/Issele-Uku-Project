import { createClient } from "@/lib/supabase/server";
import { getAdminSession, canEdit } from "@/lib/admin/session";
import { AdminList } from "@/components/admin/AdminList";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdminSourcesPage() {
  const session = await getAdminSession();
  const supabase = await createClient();
  const { data } = await supabase.from("sources").select("*").order("title", { ascending: true });

  return (
    <AdminList
      title="Sources"
      rows={data ?? []}
      canEdit={canEdit(session!.role)}
      newHref="/admin/sources/new"
      newLabel="New source"
      editHref={(row) => `/admin/sources/${row.id}`}
      emptyMessage="No sources yet."
      columns={[
        { header: "Title", render: (r) => <span className="font-medium text-ink">{r.title}</span> },
        { header: "Author", render: (r) => r.author ?? "—" },
        { header: "Type", render: (r) => r.source_type ?? "—" },
        { header: "Status", render: (r) => <StatusBadge status={r.verification_status} /> },
      ]}
    />
  );
}
