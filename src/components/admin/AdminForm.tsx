import type { ReactNode } from "react";
import Link from "next/link";
import { ConfirmSubmitButton } from "./ConfirmSubmitButton";

export function AdminForm({
  action,
  children,
  submitLabel,
  cancelHref,
  deleteAction,
  deleteLabel = "Delete this record",
}: {
  action: (formData: FormData) => void;
  children: ReactNode;
  submitLabel: string;
  cancelHref: string;
  deleteAction?: (formData: FormData) => void;
  deleteLabel?: string;
}) {
  return (
    <div className="max-w-2xl">
      <form action={action} className="space-y-4 rounded-lg border border-line bg-paper p-6">
        {children}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-accent"
          >
            {submitLabel}
          </button>
          <Link
            href={cancelHref}
            className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink"
          >
            Cancel
          </Link>
        </div>
      </form>

      {deleteAction && (
        <form action={deleteAction} className="mt-6">
          <ConfirmSubmitButton
            confirmMessage="Delete this record permanently? This cannot be undone."
            className="text-sm font-medium text-evidence-disputed hover:underline"
          >
            {deleteLabel}
          </ConfirmSubmitButton>
        </form>
      )}
    </div>
  );
}
