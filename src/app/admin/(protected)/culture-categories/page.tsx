import { createClient } from "@/lib/supabase/server";
import { getAdminSession, canEdit } from "@/lib/admin/session";
import { AdminList } from "@/components/admin/AdminList";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdminCultureCategoriesPage() {
  const session = await getAdminSession();
  const supabase = await createClient();
  const { data } = await supabase.from("culture_categories").select("*").order("name", { ascending: true });

  return (
    <AdminList
      title="Culture Categories"
      rows={data ?? []}
      canEdit={canEdit(session!.role)}
      newHref="/admin/culture-categories/new"
      newLabel="New category"
      editHref={(row) => `/admin/culture-categories/${row.id}`}
      emptyMessage="No culture categories yet."
      columns={[
        { header: "Name", render: (r) => <span className="font-medium text-ink">{r.name}</span> },
        { header: "Status", render: (r) => <StatusBadge status={r.verification_status} /> },
      ]}
    />
  );
}
