import { createClient } from "@/lib/supabase/server";
import { getAdminSession, canEdit } from "@/lib/admin/session";
import { AdminList } from "@/components/admin/AdminList";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdminPeoplePage() {
  const session = await getAdminSession();
  const supabase = await createClient();
  const { data } = await supabase.from("people").select("*").order("name", { ascending: true });

  return (
    <AdminList
      title="People"
      rows={data ?? []}
      canEdit={canEdit(session!.role)}
      newHref="/admin/people/new"
      newLabel="New person"
      editHref={(row) => `/admin/people/${row.id}`}
      emptyMessage="No people yet."
      columns={[
        { header: "Name", render: (r) => <span className="font-medium text-ink">{r.name}</span> },
        { header: "Titles", render: (r) => r.titles.join(", ") || "—" },
        { header: "Status", render: (r) => <StatusBadge status={r.verification_status} /> },
      ]}
    />
  );
}
