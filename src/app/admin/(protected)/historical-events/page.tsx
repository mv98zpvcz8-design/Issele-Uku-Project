import { createClient } from "@/lib/supabase/server";
import { getAdminSession, canEdit } from "@/lib/admin/session";
import { AdminList } from "@/components/admin/AdminList";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdminHistoricalEventsPage() {
  const session = await getAdminSession();
  const supabase = await createClient();
  const { data } = await supabase.from("historical_events").select("*").order("title", { ascending: true });

  return (
    <AdminList
      title="Historical Events"
      rows={data ?? []}
      canEdit={canEdit(session!.role)}
      newHref="/admin/historical-events/new"
      newLabel="New event"
      editHref={(row) => `/admin/historical-events/${row.id}`}
      emptyMessage="No historical events yet."
      columns={[
        { header: "Title", render: (r) => <span className="font-medium text-ink">{r.title}</span> },
        { header: "Date", render: (r) => r.date_display ?? "—" },
        { header: "Status", render: (r) => <StatusBadge status={r.verification_status} /> },
      ]}
    />
  );
}
