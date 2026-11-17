"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CALENDLY_URL = "https://calendly.com/parishmedia/consult";

export default function BookACallModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRedirecting(true);
    window.location.href = CALENDLY_URL;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 bg-navy/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-a-call-title"
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-8 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
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
          <div>
            <p
              id="book-a-call-title"
              className="font-serif text-xl font-semibold text-navy"
            >
              Book a Free Parish Growth&nbsp;Review
            </p>
            <p className="mt-1 text-sm text-navy/60">
              Pastor attendance is required so we can tailor the
              conversation to your parish. Others may book on the
              pastor&rsquo;s&nbsp;behalf.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <input
              id="modal-confirmEligible"
              type="checkbox"
              required
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-navy/30 text-navy focus:ring-navy"
            />
            <label
              htmlFor="modal-confirmEligible"
              className="text-sm text-navy/80"
            >
              I confirm I&rsquo;m the pastor, or the pastor will join
              the&nbsp;call.
            </label>
          </div>

          <p className="text-balance text-xs text-navy/50">
            Pastor can&rsquo;t join, or reaching out about something other
            than parish growth?{" "}
            <Link
              href="/contact"
              onClick={onClose}
              className="whitespace-nowrap underline decoration-gold decoration-2 underline-offset-4 hover:text-navy"
            >
              Contact us instead
            </Link>
            .
          </p>

          <button
            type="submit"
            disabled={redirecting}
            className="w-full rounded-full bg-navy px-8 py-3 text-sm font-medium text-offwhite transition-colors hover:bg-navy/90 disabled:opacity-60"
          >
            {redirecting ? "Taking you there..." : "Book My Call"}
          </button>
        </form>
      </div>
    </div>
  );
}
