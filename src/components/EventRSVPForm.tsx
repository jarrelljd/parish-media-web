"use client";

import { useActionState, useEffect } from "react";
import { submitEventRSVP, type EventRSVPState } from "@/app/actions";
import { uiStrings, type Language } from "@/lib/i18n";
import { trackLead } from "@/lib/pixel";

const initialState: EventRSVPState = { status: "idle" };

export default function EventRSVPForm({
  eventName,
  parishName,
  parishSlug,
  eventSlug,
  webhookEnvVar,
  language = "en",
  title,
  buttonLabel,
  introText,
  successMessage,
  collectPhone = true,
}: {
  eventName: string;
  parishName: string;
  parishSlug: string;
  eventSlug: string;
  webhookEnvVar?: string;
  language?: Language;
  title?: string;
  buttonLabel?: string;
  introText?: string;
  successMessage?: string;
  collectPhone?: boolean;
}) {
  const t = uiStrings[language];
  const boundAction = submitEventRSVP.bind(
    null,
    eventName,
    parishName,
    webhookEnvVar,
    parishSlug,
    eventSlug,
  );
  const [state, formAction, pending] = useActionState(
    boundAction,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") {
      trackLead(eventName, state.eventId);
    }
  }, [state.status, state.eventId, eventName]);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-[var(--brand-primary-10)] bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-8px_var(--brand-shadow)]">
        <p className="font-serif text-xl font-semibold text-[var(--brand-primary)]">
          {successMessage ?? t.defaultSuccessTitle}
        </p>
        {!successMessage && (
          <p className="mt-3 text-[var(--brand-text)]">
            {t.defaultSuccessBody} {eventName}.
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
      {(title || introText) && (
        <div className="text-center">
          {title && (
            <>
              <span className="mx-auto mb-3 block h-1 w-10 rounded-full bg-[var(--brand-secondary)]" />
              <p className="text-balance font-serif text-xl font-semibold tracking-tight text-[var(--brand-primary)]">
                {title}
              </p>
            </>
          )}
          {introText && (
            <p
              className={`text-sm leading-relaxed text-[var(--brand-text)] ${title ? "mt-2" : ""}`}
            >
              {introText}
            </p>
          )}
        </div>
      )}

      {state.status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[var(--brand-primary)]">
          {t.nameLabel}
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
          {t.emailLabel}
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
            {t.phoneLabel}
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
        {pending ? t.submitting : (buttonLabel ?? t.defaultRsvpButton)}
      </button>
    </form>
  );
}
