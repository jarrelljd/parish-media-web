"use client";

import { useActionState } from "react";
import { submitEventRSVP, type EventRSVPState } from "@/app/actions";

const initialState: EventRSVPState = { status: "idle" };

export default function EventRSVPForm({
  eventName,
  parishName,
  buttonLabel = "RSVP",
  introText,
  successMessage,
  collectPhone = true,
}: {
  eventName: string;
  parishName: string;
  buttonLabel?: string;
  introText?: string;
  successMessage?: string;
  collectPhone?: boolean;
}) {
  const boundAction = submitEventRSVP.bind(null, eventName, parishName);
  const [state, formAction, pending] = useActionState(
    boundAction,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-[var(--brand-primary-10)] bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-8px_var(--brand-shadow)]">
        <p className="font-serif text-xl font-semibold text-[var(--brand-primary)]">
          {successMessage ?? "You’re on the list!"}
        </p>
        {!successMessage && (
          <p className="mt-3 text-[var(--brand-primary-70)]">
            We&rsquo;ll see you at {eventName}.
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-[var(--brand-primary-10)] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-8px_var(--brand-shadow)]"
    >
      {introText && (
        <p className="text-sm leading-relaxed text-[var(--brand-primary-70)]">{introText}</p>
      )}

      {state.status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[var(--brand-primary)]">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-2 w-full rounded-lg border border-[var(--brand-primary-20)] bg-[var(--brand-background)] px-4 py-2.5 text-[var(--brand-primary)] outline-none transition-shadow focus:border-[var(--brand-primary)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary-20)]"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[var(--brand-primary)]"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-lg border border-[var(--brand-primary-20)] bg-[var(--brand-background)] px-4 py-2.5 text-[var(--brand-primary)] outline-none transition-shadow focus:border-[var(--brand-primary)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary-20)]"
        />
      </div>

      {collectPhone && (
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-[var(--brand-primary)]"
          >
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="mt-2 w-full rounded-lg border border-[var(--brand-primary-20)] bg-[var(--brand-background)] px-4 py-2.5 text-[var(--brand-primary)] outline-none transition-shadow focus:border-[var(--brand-primary)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary-20)]"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[var(--brand-primary)] px-8 py-3 text-sm font-medium text-[var(--brand-background)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {pending ? "Submitting..." : buttonLabel}
      </button>
    </form>
  );
}
