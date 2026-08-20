"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BookACallModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [role, setRole] = useState("");
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
    const destination =
      role === "Parish Priest"
        ? "/free-consult"
        : role === "Vocations Director"
          ? "/free-consult/vocations"
          : "/free-triage";
    window.location.href = destination;
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
              Book a Call
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
              I confirm I work for a parish, diocese, or religious order.
            </label>
          </div>

          <p className="text-xs text-navy/50">
            Not eligible?{" "}
            <Link
              href="/contact"
              onClick={onClose}
              className="underline decoration-gold decoration-2 underline-offset-4 hover:text-navy"
            >
              Contact us instead
            </Link>
            .
          </p>

          <div
            className={`grid overflow-hidden transition-all duration-500 ease-out motion-reduce:transition-none ${
              confirmed
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0">
              <label
                htmlFor="modal-role"
                className="block text-sm font-medium text-navy"
              >
                Your Role
              </label>
              <select
                id="modal-role"
                name="role"
                required={confirmed}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
              >
                <option value="" disabled>
                  Select one...
                </option>
                <option value="Parish Priest">Parish Priest</option>
                <option value="Vocations Director">Vocations Director</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
          </div>

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
