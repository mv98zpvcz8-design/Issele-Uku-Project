"use client";

import { useEffect } from "react";

/**
 * Catches an error thrown by the root layout itself — the one case
 * error.tsx can't handle, since error.tsx renders inside that same
 * layout. Must supply its own <html>/<body>; kept deliberately plain
 * (no design tokens, no Tailwind classes) since the root layout — which
 * defines those — is exactly what may have failed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "2rem",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ marginTop: "1rem", maxWidth: "28rem", color: "#555" }}>
          This wasn&apos;t supposed to happen. Nothing has been lost — try again, or reload the
          page.
          {error.digest && <> Reference: {error.digest}.</>}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: "1.5rem",
            padding: "0.75rem 1.25rem",
            borderRadius: "0.375rem",
            background: "#1a1a1a",
            color: "#fff",
            fontSize: "0.875rem",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
