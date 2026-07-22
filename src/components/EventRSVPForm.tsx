"use client";

import { useActionState } from "react";
import { submitEventRSVP, type EventRSVPState } from "@/app/actions";

const initialState: EventRSVPState = { status: "idle" };

export default function EventRSVPForm({
  eventName,
  parishName,
}: {
  eventName: string;
  parishName: string;
}) {
  const boundAction = submitEventRSVP.bind(null, eventName, parishName);
  const [state, formAction, pending] = useActionState(
    boundAction,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-navy/10 bg-white p-8 text-center shadow-sm">
        <p className="font-serif text-xl font-semibold text-navy">
          You&rsquo;re on the list!
        </p>
        <p className="mt-3 text-navy/70">
          We&rsquo;ll see you at {eventName}.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-navy/10 bg-white p-8 shadow-sm"
    >
      {state.status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-navy">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-navy"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-navy"
        >
          Phone (optional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-navy px-8 py-3 text-sm font-medium text-offwhite transition-colors hover:bg-navy/90 disabled:opacity-60"
      >
        {pending ? "Submitting..." : "RSVP"}
      </button>
    </form>
  );
}
