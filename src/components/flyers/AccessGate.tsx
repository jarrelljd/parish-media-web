"use client";

import { useActionState } from "react";
import BrandMark from "@/components/BrandMark";
import { enterAccessCode, type FormState } from "@/app/flyers/actions";

export default function AccessGate({ turnedOff = false }: { turnedOff?: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(enterAccessCode, {
    error: turnedOff ? "Your parish's code has been turned off. Contact Parish Media Company." : undefined,
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-vellum px-5 py-16">
      <div className="w-full max-w-md text-center">
        <BrandMark className="mx-auto h-12 w-auto text-gilt" />
        <h1 className="mt-6 font-serif text-3xl font-semibold text-ink text-balance">Parish Flyer Library</h1>
        <p className="mt-3 text-lg text-ink/70 text-pretty">
          Enter your parish&apos;s access code to see the&nbsp;flyers.
        </p>

        <form action={action} className="mt-8 space-y-4">
          <input
            name="code"
            required
            autoFocus
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="Access code"
            aria-label="Access code"
            className="w-full rounded-full bg-white px-6 py-4 text-center text-lg uppercase tracking-wide text-ink shadow-sm ring-1 ring-ink/15 placeholder:normal-case placeholder:tracking-normal placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-lapis"
          />
          {state.error && (
            <p role="alert" className="text-[15px] font-semibold text-rubric">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-lapis px-8 py-4 text-lg font-semibold text-vellum shadow-lg shadow-lapis/30 transition-all hover:-translate-y-0.5 hover:bg-lapis-deep disabled:opacity-60"
          >
            {pending ? "Checking..." : "Open the library"}
          </button>
        </form>

        <p className="mt-8 text-[15px] text-ink/55 text-pretty">
          Don&apos;t have a code? Ask your Parish Media Company&nbsp;contact.
        </p>
      </div>
    </div>
  );
}
