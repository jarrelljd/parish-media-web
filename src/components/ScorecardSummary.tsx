"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { useBookACallModal } from "@/components/BookACallModalProvider";
import { buttonArrow, buttonClass } from "@/components/buttonStyles";
import {
  CategoryBars,
  SCORECARD_RESULT_KEY,
  ScoreHero,
  type StoredScorecardResult,
} from "@/components/ScorecardParts";
import { greetingFor } from "@/lib/greeting";
import { buildReport, parseAnswers, type ScorecardReport } from "@/lib/scorecard";

type Loaded = { report: ScorecardReport; greeting: string; email: string };

// The stored result never changes while this page is open.
const subscribeNever = () => () => {};

function readStoredResult(): string {
  try {
    return sessionStorage.getItem(SCORECARD_RESULT_KEY) ?? "";
  } catch {
    return "";
  }
}

// Quick summary shown after the scorecard opt-in. The full report went to
// their email (via the Zap); this page recaps it and pushes toward a call.
export default function ScorecardSummary() {
  // null on the server render (storage not readable yet), "" when nothing
  // is stored or storage is blocked.
  const raw = useSyncExternalStore(subscribeNever, readStoredResult, () => null);
  // undefined = still loading, null = nothing usable (generic view).
  const data = useMemo<Loaded | null | undefined>(() => {
    if (raw === null) return undefined;
    if (!raw) return null;
    try {
      const stored = JSON.parse(raw) as StoredScorecardResult;
      const answers = parseAnswers(stored.answers);
      if (!answers) return null;
      const population = typeof stored.population === "number" ? stored.population : null;
      return {
        report: buildReport(answers, population),
        greeting: greetingFor(String(stored.name ?? "").slice(0, 80)),
        email: String(stored.email ?? "").slice(0, 120),
      };
    } catch {
      return null;
    }
  }, [raw]);
  const openBookACall = useBookACallModal();

  const bookButton = (variant: "primary" | "light") => (
    <button type="button" onClick={openBookACall} className={buttonClass(variant)}>
      Book a Free Assessment
      <ArrowRight className={buttonArrow} aria-hidden="true" />
    </button>
  );

  if (data === undefined) {
    return <div className="min-h-[60vh]" aria-hidden="true" />;
  }

  const report = data?.report;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
          <Mail className="h-5 w-5" aria-hidden="true" />
        </span>
        {data && (
          <p className="mt-5 font-serif text-lg italic text-navy/70">
            Thank you, {data.greeting}.
          </p>
        )}
        <h1 className="mt-2 text-balance font-serif text-4xl font-medium leading-[1.08] tracking-tight text-navy sm:text-5xl">
          Your Full Report Is on Its Way
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-balance leading-relaxed text-navy/70 sm:text-lg">
          {data?.email ? (
            <>
              We sent your complete scorecard to{" "}
              <strong className="break-all font-semibold text-navy">{data.email}</strong>.
              If you don&rsquo;t see it, check your spam folder.
            </>
          ) : (
            <>
              We sent your complete scorecard to your inbox. If you don&rsquo;t
              see it, check your spam&nbsp;folder.
            </>
          )}
          {report && " Here’s a quick summary in the meantime."}
        </p>
      </div>

      {report ? (
        <>
          <ScoreHero report={report}>
            <div className="mt-8 border-t border-offwhite/15 pt-8">
              <p className="mx-auto max-w-md text-pretty text-sm leading-relaxed text-offwhite/75">
                Want help closing these gaps? We&rsquo;ll go over your
                scorecard with you on a free Parish Growth&nbsp;Assessment.
              </p>
              <div className="mt-5">{bookButton("light")}</div>
            </div>
          </ScoreHero>

          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-navy/5 ring-1 ring-navy/5 sm:p-10">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-navy sm:text-3xl">
              {report.priorities.length ? "What to Fix First" : "Every Category Scored Strong"}
            </h2>
            {report.priorities.length > 0 ? (
              <>
                <ol className="mt-6 space-y-3">
                  {report.priorities.map((p, i) => (
                    <li key={p.id} className="flex gap-4 rounded-2xl bg-parchment p-5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy font-serif text-offwhite">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-navy">{p.label}</p>
                        <p className="mt-1 text-pretty leading-relaxed text-navy/75">{p.status}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-pretty text-sm text-navy/60">
                  Step-by-step fixes for each of these are in your&nbsp;email.
                </p>
              </>
            ) : (
              <p className="mt-3 text-pretty leading-relaxed text-navy/75">
                Your parish is doing the things that bring new people to Mass.
                Your email has the full breakdown of where you&rsquo;re&nbsp;strongest.
              </p>
            )}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-navy/5 ring-1 ring-navy/5 sm:p-10">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-navy">
              Your Score by Category
            </h2>
            <div className="mt-6">
              <CategoryBars report={report} />
            </div>
          </div>
        </>
      ) : null}

      <div className="rounded-3xl bg-navy px-6 py-10 text-center text-offwhite sm:px-12 sm:py-12">
        <h2 className="text-balance font-serif text-3xl font-medium tracking-tight sm:text-4xl">
          Let&rsquo;s Fix These Together
        </h2>
        <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-offwhite/75">
          Book a free Parish Growth Assessment. We&rsquo;ll walk through your
          scorecard with you and map out a plan for your top&nbsp;priorities.
        </p>
        <div className="mt-7">{bookButton("light")}</div>
      </div>

      {!report && (
        <p className="text-center text-sm text-navy/60">
          Haven&rsquo;t taken it yet?{" "}
          <Link href="/scorecard" className="underline decoration-gold decoration-2 underline-offset-4 hover:text-navy">
            Take the Parish Social Media Scorecard
          </Link>
        </p>
      )}
    </div>
  );
}
