"use client";

import { useRef } from "react";

/**
 * Native <dialog> rather than a hand-rolled modal: free backdrop,
 * Escape-to-close, and focus handling from the browser — no state
 * library or portal needed for what's otherwise a lot of accessibility
 * work to redo by hand.
 */
export function LightboxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="block w-full cursor-zoom-in"
        aria-label={`View "${alt}" fullscreen`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- src is a same-origin redirect to a short-lived signed URL, not a static asset next/image can optimize */}
        <img src={src} alt={alt} className={className} />
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto max-h-none max-w-none rounded-lg bg-transparent p-0 backdrop:bg-ink/90"
      >
        <div className="relative flex max-h-[100vh] items-center justify-center p-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- same reasoning as above */}
          <img src={src} alt={alt} className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain" />
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close fullscreen image"
            className="absolute right-2 top-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink/70 text-paper hover:bg-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </dialog>
    </>
  );
}
