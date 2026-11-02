"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Mail } from "lucide-react";
import { useBookACallModal } from "@/components/BookACallModalProvider";
import { buttonArrow, buttonClass } from "@/components/buttonStyles";
import {
  SCORECARD_RESULT_KEY,
  ScoreHero,
  type StoredScorecardResult,
} from "@/components/ScorecardParts";
import { greetingFor } from "@/lib/greeting";
import { parseAnswers, type ScorecardReport } from "@/lib/scorecard";
import { buildScorecardDoc, type ScorecardDoc } from "@/lib/scorecardReport";

type Loaded = {
  report: ScorecardReport;
  doc: ScorecardDoc;
  greeting: string;
  email: string;
  pdfUrl: string | null;
};

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
      const greeting = greetingFor(String(stored.name ?? "").slice(0, 80));
      const doc = buildScorecardDoc(answers, population, {
        name: String(stored.name ?? "").slice(0, 120),
        organization: String(stored.organization ?? "").slice(0, 120),
        role: String(stored.role ?? ""),
        greeting,
      });
      // Only our own report links, never an arbitrary URL from storage.
      const pdfUrl =
        typeof stored.pdfUrl === "string" && /^https?:\/\/[^/]+\/api\/scorecard\/report\?/.test(stored.pdfUrl)
          ? stored.pdfUrl
          : null;
      return {
        report: doc.report,
        doc,
        greeting,
        email: String(stored.email ?? "").slice(0, 120),
        pdfUrl,
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
              <strong className="font-semibold text-navy [overflow-wrap:anywhere]">{data.email}</strong>.
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
        {data?.pdfUrl && (
          <a
            href={data.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("ghost", "mt-6")}
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Download Your Report (PDF)
          </a>
        )}
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">
              Our Diagnosis
            </p>
            <h2 className="mt-2 text-balance font-serif text-2xl font-medium leading-snug tracking-tight text-navy sm:text-3xl">
              {data.doc.diagnosis.lead}
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-navy/75">{data.doc.diagnosis.body}</p>
            {data.doc.problems.length > 0 && (
              <>
                <h3 className="mt-8 font-serif text-xl font-medium tracking-tight text-navy">
                  {data.doc.problems.length === 1
                    ? "The Biggest Problem We Found"
                    : "The Biggest Problems We Found"}
                </h3>
                <ol className="mt-4 space-y-3">
                  {data.doc.problems.map((p, i) => (
                    <li key={p.id} className="flex gap-4 rounded-2xl bg-parchment p-5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy font-serif text-offwhite">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-pretty font-semibold text-navy">{p.title}</p>
                        <p className="mt-1 text-pretty text-sm leading-relaxed text-navy/70">
                          {p.saw.join(" ")}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-pretty text-sm text-navy/60">
                  Your report explains why each one matters and the first step
                  to fix it.
                </p>
              </>
            )}
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
