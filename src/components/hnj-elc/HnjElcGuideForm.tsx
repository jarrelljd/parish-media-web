"use client";

import { useActionState, useEffect } from "react";
import { CheckCircle2, FileText, Loader2 } from "lucide-react";
import { submitEventRSVP, type EventRSVPState } from "@/app/actions";
import { trackLead } from "@/lib/pixel";
import { hnjElc } from "@/data/hnjElcLanding";

// The ELC guide form. Same server action as the St. Mary page: the Zap behind
// ZAPIER_WEBHOOK_HNJ_ELC_GUIDE emails the guide and logs the lead; Meta Pixel +
// Conversions API share one event_id so the Lead is counted once. The success state
// also links the PDF directly so nobody waits on the email.

const initialState: EventRSVPState = { status: "idle" };

const input =
  "mt-1.5 w-full rounded-2xl border-0 bg-[#fbf8f1] px-4 py-3 text-[#1f2a22] ring-1 ring-[#1f2a22]/10 transition-shadow placeholder:text-[#5b6359]/50 focus:ring-2 focus:ring-[#14603a] focus:outline-none";
const label = "block text-sm font-bold text-[#1f2a22]";

export default function HnjElcGuideForm() {
  const { form } = hnjElc;
  const boundAction = submitEventRSVP.bind(
    null,
    hnjElc.eventName,
    hnjElc.parishName,
    hnjElc.webhookEnvVar,
    hnjElc.parishSlug,
    hnjElc.eventSlug,
  );
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  useEffect(() => {
    if (state.status === "success") trackLead(hnjElc.eventName, state.eventId);
  }, [state.status, state.eventId]);

  if (state.status === "success") {
    return (
      <div className="py-8 text-center" role="status">
        <CheckCircle2 className="mx-auto size-14 text-[#14603a]" strokeWidth={1.5} aria-hidden="true" />
        <h2 className="mt-5 font-classic text-3xl font-medium">Thank you!</h2>
        <p className="mx-auto mt-3 max-w-sm text-lg leading-relaxed text-pretty text-[#5b6359]">{form.success}</p>
        <a
          href={hnjElc.guidePdf}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#14603a] px-6 py-3.5 font-bold text-[#fbf8f1] shadow-lg shadow-[#14603a]/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0f4a2d]"
        >
          <FileText className="size-5" aria-hidden="true" />
          Open the Guide
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <h2 className="font-classic text-3xl font-medium tracking-tight text-balance">{form.title}</h2>
        <p className="mt-2 leading-relaxed text-pretty text-[#5b6359]">{form.intro}</p>
      </div>

      <label className="block">
        <span className={label}>Your name</span>
        <input name="name" required autoComplete="name" className={input} />
      </label>

      <label className="block">
        <span className={label}>Email</span>
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>

      <label className="block">
        <span className={label}>
          Phone <span className="font-normal text-[#5b6359]">(optional, for tour questions)</span>
        </span>
        <input name="phone" type="tel" autoComplete="tel" className={input} />
      </label>

      {state.status === "error" && (
        <p className="rounded-2xl bg-[#b4441f]/10 px-4 py-3 text-sm font-semibold text-[#8a3418]" role="alert">
          {state.message} Or call the ELC at{" "}
          <a href={`tel:${hnjElc.phone.replace(/\D/g, "")}`} className="underline">
            {hnjElc.phone}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#14603a] px-7 py-4 font-bold text-[#fbf8f1] shadow-lg shadow-[#14603a]/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0f4a2d] disabled:translate-y-0 disabled:opacity-70"
      >
        {pending && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
        {pending ? "Sending…" : form.submit}
      </button>
      <p className="text-center text-xs text-[#5b6359]">{form.note}</p>
    </form>
  );
}
