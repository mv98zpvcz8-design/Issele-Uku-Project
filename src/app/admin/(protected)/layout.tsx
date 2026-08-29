import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/session";
import { ADMIN_NAV } from "@/lib/admin/nav";
import { signOut } from "../actions";

/**
 * The auth guard that actually matters is here, not in middleware.ts —
 * middleware only checks "is there a session at all" (cheap, no DB
 * call); this layout does the real check: does this session belong to
 * a staff profile? Every /admin/** page renders inside this layout, so
 * there is no route under /admin that can render without passing this
 * check (see ARCHITECTURE.md D-004 on public/admin separation).
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-paper-muted">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <Link href="/admin" className="font-display text-lg font-semibold text-ink">
              Oligbo Admin
            </Link>
            <p className="text-xs text-ink-soft">
              Signed in as {session.email ?? session.fullName ?? "staff"} · {session.role}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-ink-soft hover:text-ink">
              View public site
            </Link>
            <form action={signOut}>
              <button type="submit" className="text-sm font-medium text-accent hover:underline">
                Sign out
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Admin sections" className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6">
          <ul className="flex gap-5 whitespace-nowrap border-t border-line py-2 text-sm">
            {ADMIN_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-soft hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
