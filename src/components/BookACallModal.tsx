"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { submitBookACallRequest, type BookACallState } from "@/app/actions";

const initialState: BookACallState = { status: "idle" };

export default function BookACallModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    submitBookACallRequest,
    initialState,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [role, setRole] = useState("");
  const showMore = name.trim() !== "" && email.trim() !== "" && confirmed;
  const showOtherExplain = role === "Other";

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (state.status === "success") {
      const timer = setTimeout(() => {
        window.location.href = `/book-a-call?role=${encodeURIComponent(role)}`;
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.status, role]);

  if (!open) return null;

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

        {state.status === "success" ? (
          <div className="text-center">
            <p
              id="book-a-call-title"
              className="font-serif text-xl font-semibold text-navy"
            >
              Thank you!
            </p>
            <p className="mt-3 text-navy/70">
              Taking you to book a time now...
            </p>
          </div>
        ) : (
          <form action={formAction} className="space-y-5">
            <div>
              <p
                id="book-a-call-title"
                className="font-serif text-xl font-semibold text-navy"
              >
                Book a Call
              </p>
              <p className="mt-1 text-sm text-navy/60">
                A couple quick questions first, then we&rsquo;ll get you on
                the calendar.
              </p>
            </div>

            {state.status === "error" && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {state.message}
              </div>
            )}

            <div>
              <label
                htmlFor="modal-name"
                className="block text-sm font-medium text-navy"
              >
                Name
              </label>
              <input
                id="modal-name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
              />
            </div>

            <div>
              <label
                htmlFor="modal-email"
                className="block text-sm font-medium text-navy"
              >
                Email
              </label>
              <input
                id="modal-email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
              />
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
              Not working for one of these?{" "}
              <Link
                href="/contact"
                className="underline decoration-gold decoration-2 underline-offset-4 hover:text-navy"
              >
                Contact us instead
              </Link>
              .
            </p>

            <div
              className={`grid overflow-hidden transition-all duration-500 ease-out motion-reduce:transition-none ${
                showMore
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 space-y-5">
                <div>
                  <label
                    htmlFor="modal-organization"
                    className="block text-sm font-medium text-navy"
                  >
                    Parish, Diocese, or Religious Order
                  </label>
                  <input
                    id="modal-organization"
                    name="organization"
                    type="text"
                    required={showMore}
                    className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
                  />
                </div>

                <div>
                  <label
                    htmlFor="modal-role"
                    className="block text-sm font-medium text-navy"
                  >
                    Your Role
                  </label>
                  <select
                    id="modal-role"
                    name="role"
                    required={showMore}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
                  >
                    <option value="" disabled>
                      Select one...
                    </option>
                    <option value="Priest">Priest</option>
                    <option value="Office Staff">Office Staff</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div
                  className={`grid overflow-hidden transition-all duration-500 ease-out motion-reduce:transition-none ${
                    showOtherExplain
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0">
                    <label
                      htmlFor="modal-roleOther"
                      className="block text-sm font-medium text-navy"
                    >
                      Tell us your role
                    </label>
                    <input
                      id="modal-roleOther"
                      name="roleOther"
                      type="text"
                      required={showOtherExplain}
                      className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-navy px-8 py-3 text-sm font-medium text-offwhite transition-colors hover:bg-navy/90 disabled:opacity-60"
            >
              {pending ? "Sending..." : "Book My Call"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
