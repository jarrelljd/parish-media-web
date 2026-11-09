"use client";

import { useActionState, useEffect, useState } from "react";
import { submitNps, type NpsState } from "@/app/actions";
import { buttonClass } from "@/components/buttonStyles";

const initialState: NpsState = { status: "idle" };
const SCORES = Array.from({ length: 11 }, (_, i) => i);

export default function NpsForm({ parish }: { parish: string }) {
  const [state, formAction, pending] = useActionState(submitNps, initialState);
  const [score, setScore] = useState<number | null>(null);

  // After a thank-you pause, send them to the homepage.
  useEffect(() => {
    if (state.status !== "success") return;
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 5000);
    return () => clearTimeout(timer);
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div className="text-center">
        <h1 className="text-balance font-serif text-3xl font-medium text-navy sm:text-5xl">
          Thank you!
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty text-base leading-relaxed text-navy/70 sm:text-lg">
          You can close this page now. Otherwise, we&rsquo;ll take you to our
          homepage in a few&nbsp;seconds.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="text-center">
      <h1 className="text-balance font-serif text-3xl font-medium leading-tight tracking-tight text-navy sm:text-5xl">
        How likely are you to recommend Parish Media Company to a fellow&nbsp;parish?
      </h1>

      <input type="hidden" name="parish" value={parish} />
      {score !== null && <input type="hidden" name="score" value={score} />}

      <div className="mt-10">
        <div
          role="radiogroup"
          aria-label="Score from 0 to 10"
          className="grid grid-cols-6 gap-2 sm:grid-cols-11"
        >
          {SCORES.map((n) => {
            const selected = score === n;
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setScore(n)}
                className={`aspect-square rounded-[3px] text-lg font-semibold transition-colors ring-1 ${
                  selected
                    ? "bg-navy text-offwhite ring-navy"
                    : "bg-white text-navy ring-navy/20 hover:bg-navy/5 hover:ring-navy/40"
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-sm text-navy/60">
          <span>Not likely</span>
          <span>Extremely likely</span>
        </div>
      </div>

      {score !== null && (
        <div className="mt-10 text-left">
          <label htmlFor="reason" className="block font-serif text-xl text-navy">
            What made you choose {score}?{" "}
            <span className="text-base text-navy/50">(optional)</span>
          </label>
          <textarea
            id="reason"
            name="reason"
            rows={4}
            maxLength={2000}
            autoFocus
            className="mt-3 w-full rounded-[3px] bg-white p-4 text-base text-navy ring-1 ring-navy/20 focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <div className="mt-6 text-center">
            <button type="submit" disabled={pending} className={buttonClass("primary", "min-w-40 disabled:opacity-60")}>
              {pending ? "Sending…" : "Submit"}
            </button>
          </div>
        </div>
      )}

      {state.status === "error" && (
        <p className="mt-6 text-sm text-red-700">{state.message}</p>
      )}
    </form>
  );
}
