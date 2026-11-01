"use client";

import { useEffect, useState } from "react";
import type { BandTone, Tier } from "@/data/scorecard";
import type { ScorecardAnswers, ScorecardReport } from "@/lib/scorecard";
import { capNote } from "@/lib/scorecardReport";

// Pieces shared by the scorecard quiz (/scorecard) and its summary page
// (/scorecard/summary).

// Set by the opt-in form right before it redirects to /scorecard/summary.
// Kept in sessionStorage (not the URL) so name/email never reach analytics.
export const SCORECARD_RESULT_KEY = "pmc_scorecard_result";

export type StoredScorecardResult = {
  answers: ScorecardAnswers;
  population: number | null;
  name: string;
  email: string;
  organization?: string;
  role?: string;
  // Signed link to their PDF report (for the download button).
  pdfUrl?: string;
};

export const tierBar: Record<Tier, string> = {
  low: "bg-[#b4533c]",
  mid: "bg-gold",
  high: "bg-navy",
};
export const tierText: Record<Tier, string> = {
  low: "text-[#9c4532]",
  mid: "text-gold-deep",
  high: "text-navy",
};
export const tierLabel: Record<Tier, string> = {
  low: "Needs attention",
  mid: "Room to grow",
  high: "Strong",
};

// Band colors on the navy score card (brighter than the PDF's print colors).
export const bandToneOnNavy: Record<BandTone, string> = {
  critical: "#f26b5b",
  atRisk: "#f5934a",
  stalled: "#e8c14a",
  gaps: "#a6d16a",
  thriving: "#4fd68a",
};

export function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(score));
    return () => cancelAnimationFrame(t);
  }, [score]);
  return (
    <div className="relative h-40 w-40 sm:h-44 sm:w-44">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="9" className="text-offwhite/15" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown / 100)}
          style={{ color }}
          className="transition-[stroke-dashoffset] duration-[1200ms] ease-out motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-5xl font-medium text-offwhite sm:text-6xl">{score}</span>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/60">out of 100</span>
      </div>
    </div>
  );
}

export function ScoreHero({
  report,
  children,
}: {
  report: ScorecardReport;
  children?: React.ReactNode;
}) {
  const tone = bandToneOnNavy[report.band.tone];
  return (
    <div className="overflow-hidden rounded-3xl bg-navy px-6 py-10 text-center text-offwhite shadow-2xl shadow-navy/20 sm:px-12 sm:py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        Your Parish Social Media Score
      </p>
      <div className="mt-6 flex justify-center">
        <ScoreRing score={report.score} color={tone} />
      </div>
      <h2
        className="mt-6 text-balance font-serif text-3xl font-medium tracking-tight sm:text-4xl"
        style={{ color: tone }}
      >
        {report.band.label}
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-pretty leading-relaxed text-offwhite/75">
        {report.band.summary}
      </p>
      {children}
    </div>
  );
}

export function CategoryBars({ report }: { report: ScorecardReport }) {
  const note = capNote(report);
  return (
    <>
    {note && (
      <p className="mb-5 rounded-xl bg-[#b4533c]/10 px-4 py-3 text-pretty text-sm leading-relaxed text-[#7d3424]">
        {note}
      </p>
    )}
    <ul className="space-y-5">
      {report.categories.map((c) => (
        <li key={c.id}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-medium text-navy">{c.label}</span>
            <span className="shrink-0 text-sm tabular-nums text-navy/60">
              <span className={`mr-2 text-xs font-semibold uppercase tracking-wider ${tierText[c.tier]}`}>
                {tierLabel[c.tier]}
              </span>
              {c.points}/{c.max}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-navy/10">
            <div
              className={`h-full rounded-full ${tierBar[c.tier]}`}
              style={{ width: `${Math.max((c.points / c.max) * 100, 2)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
    </>
  );
}
