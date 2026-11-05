"use client";

import { useActionState, useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitEventRSVP, type EventRSVPState } from "@/app/actions";
import { trackLead } from "@/lib/pixel";
import { stMary } from "@/data/stMaryLanding";

// The visit-guide form, in the Capuchin "Talk With a Friar" card style. Posts through the
// same server action and Zap as the earlier draft (Zapier sends the guide; Meta Pixel +
// Conversions API share one event_id so the Lead is counted once).

const initialState: EventRSVPState = { status: "idle" };

const input =
  "mt-1.5 w-full rounded-2xl border-0 bg-[#fbf7f1] px-4 py-3 text-[#2e211c] ring-1 ring-[#2e211c]/10 transition-shadow placeholder:text-[#6b5a50]/50 focus:ring-2 focus:ring-[#7b2d26] focus:outline-none";
const label = "block text-sm font-bold text-[#2e211c]";

export default function StMaryVisitForm() {
  const { form } = stMary;
  const boundAction = submitEventRSVP.bind(
    null,
    stMary.eventName,
    stMary.parishName,
    stMary.webhookEnvVar,
    stMary.parishSlug,
    stMary.eventSlug,
  );
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  useEffect(() => {
    if (state.status === "success") trackLead(stMary.eventName, state.eventId);
  }, [state.status, state.eventId]);

  if (state.status === "success") {
    return (
      <div className="py-10 text-center" role="status">
        <CheckCircle2 className="mx-auto size-14 text-[#7b2d26]" strokeWidth={1.5} aria-hidden="true" />
        <h2 className="mt-5 font-serif text-3xl font-medium">Thank you!</h2>
        <p className="mx-auto mt-3 max-w-sm text-lg leading-relaxed text-pretty text-[#6b5a50]">{form.success}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <h2 className="font-serif text-3xl font-medium tracking-tight text-balance">{form.title}</h2>
        <p className="mt-2 leading-relaxed text-pretty text-[#6b5a50]">{form.intro}</p>
      </div>

      <label className="block">
        <span className={label}>Your name</span>
        <input name="name" required autoComplete="name" className={input} />
      </label>

      <label className="block">
        <span className={label}>Email</span>
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>

      {state.status === "error" && (
        <p className="rounded-2xl bg-[#7b2d26]/10 px-4 py-3 text-sm font-semibold text-[#5e211b]" role="alert">
          {state.message} Or call the parish at{" "}
          <a href={`tel:${stMary.phone.replace(/\D/g, "")}`} className="underline">
            {stMary.phone}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7b2d26] px-7 py-4 font-bold text-[#fbf7f1] shadow-lg shadow-[#7b2d26]/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#5e211b] disabled:translate-y-0 disabled:opacity-70"
      >
        {pending && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
        {pending ? "Sending…" : form.submit}
      </button>
      <p className="text-center text-xs text-[#6b5a50]">{form.note}</p>
    </form>
  );
}
