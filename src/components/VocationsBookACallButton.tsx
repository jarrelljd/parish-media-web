"use client";

import { useEffect, useState } from "react";

export default function VocationsBookACallButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRedirecting(true);
    window.location.href = "/free-consult/vocations";
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div
            className="absolute inset-0 bg-navy/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="vocations-book-a-call-title"
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-8 shadow-xl"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-navy/50 transition-colors hover:bg-navy/5 hover:text-navy"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <form onSubmit={handleSubmit} className="space-y-5">
              <p
                id="vocations-book-a-call-title"
                className="font-serif text-xl font-semibold text-navy"
              >
                Book a Call
              </p>

              <div className="flex items-start gap-3">
                <input
                  id="vocations-confirmRole"
                  type="checkbox"
                  required
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-navy/30 text-navy focus:ring-navy"
                />
                <label
                  htmlFor="vocations-confirmRole"
                  className="text-sm text-navy/80"
                >
                  I confirm I am the vocations director (or an authorized
                  delegate) for my diocese or religious community.
                </label>
              </div>

              <button
                type="submit"
                disabled={!confirmed || redirecting}
                className="w-full rounded-full bg-navy px-8 py-3 text-sm font-medium text-offwhite transition-colors hover:bg-navy/90 disabled:opacity-60"
              >
                {redirecting ? "Taking you there..." : "Book My Call"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
