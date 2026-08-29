import type { NextConfig } from "next";

/**
 * Baseline security headers a security review should expect by default.
 * Deliberately not attempting a Content-Security-Policy here: Next.js's
 * own streaming/hydration scripts need either 'unsafe-inline' (weak
 * enough to not be worth the false confidence) or a per-request nonce
 * threaded through middleware — real, non-trivial work with a real risk
 * of breaking the app if rushed. Flagged as future work rather than
 * shipped half-correct; see DECISIONS.md.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
