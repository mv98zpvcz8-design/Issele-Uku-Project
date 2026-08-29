import { AdminForm } from "@/components/admin/AdminForm";
import { ArchiveItemFields } from "@/components/admin/ArchiveItemFields";
import { requireEditorPage } from "@/lib/admin/session";
import { createArchiveItem } from "../actions";

export default async function NewArchiveItemPage() {
  await requireEditorPage("/admin/archive-items");
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">New archive item</h1>
      <div className="mt-6">
        <AdminForm action={createArchiveItem} submitLabel="Create archive item" cancelHref="/admin/archive-items">
          <ArchiveItemFields />
        </AdminForm>
      </div>
    </div>
  );
}
