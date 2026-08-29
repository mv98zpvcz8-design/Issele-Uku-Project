"use client";

import type { ReactNode } from "react";

/**
 * The one deliberate bit of client JS in the admin forms: a native
 * `confirm()` guard in front of a destructive action. No library, just
 * the browser API — not worth avoiding client-side JS for.
 */
export function ConfirmSubmitButton({
  children,
  confirmMessage,
  className,
}: {
  children: ReactNode;
  confirmMessage: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
