import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/**
 * Refreshes the Supabase auth session on every request (the standard
 * @supabase/ssr Next.js pattern) and gates /admin routes at the edge:
 * no session at all -> straight to /admin/login. This is a cheap,
 * session-only check — it does NOT look up the caller's role (that
 * would mean a database round trip on every matched request). The
 * actual role check (is this user staff? can they write?) happens in
 * the admin layout/pages themselves, which already need to hit the
 * database to render — see src/app/admin/layout.tsx.
 */
export async function middleware(request: NextRequest) {
  // createServerClient() THROWS synchronously on empty URL/key, and this
  // middleware's matcher covers nearly every route — without this guard,
  // an unconfigured Supabase project (true for every environment before
  // DEPLOYMENT.md's setup steps are done) would 500 the entire public
  // site, not just /admin. The admin layout's own guard (which redirects
  // to /admin/login) still applies once Supabase is configured.
  if (!SUPABASE_CONFIGURED) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  // Do not add logic between createServerClient and getUser() — the
  // session refresh depends on getUser() actually being called here.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets, so the auth cookie
     * stays fresh site-wide, while keeping the /admin gate above.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
