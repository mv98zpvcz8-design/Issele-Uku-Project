import { createClient } from "@/lib/supabase/server";
import { getAdminSession, canEdit } from "@/lib/admin/session";
import { AdminList } from "@/components/admin/AdminList";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdminPlacesPage() {
  const session = await getAdminSession();
  const supabase = await createClient();
  const { data } = await supabase.from("places").select("*").order("name", { ascending: true });

  return (
    <AdminList
      title="Places"
      rows={data ?? []}
      canEdit={canEdit(session!.role)}
      newHref="/admin/places/new"
      newLabel="New place"
      editHref={(row) => `/admin/places/${row.id}`}
      emptyMessage="No places yet."
      columns={[
        { header: "Name", render: (r) => <span className="font-medium text-ink">{r.name}</span> },
        { header: "Category", render: (r) => r.category ?? "—" },
        { header: "Status", render: (r) => <StatusBadge status={r.verification_status} /> },
      ]}
    />
  );
}
