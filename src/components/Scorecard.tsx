"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Lock, Printer, RotateCcw } from "lucide-react";
import {
  getScorecardPopulation,
  submitScorecardOptIn,
  type ScorecardOptInState,
} from "@/app/actions";
import { useBookACallModal } from "@/components/BookACallModalProvider";
import { buttonArrow, buttonClass } from "@/components/buttonStyles";
import { trackLead } from "@/lib/pixel";
import {
  buildReport,
  titleCase,
  type FollowerCount,
  type ScorecardAnswers,
  type ScorecardReport,
} from "@/lib/scorecard";
import { US_STATES, questions, type Question, type Tier } from "@/data/scorecard";
import { NO_QUALIFYING_ROLE, freeGuideRoles } from "@/data/freeGuideRoles";

type Draft = Partial<ScorecardAnswers>;
type Phase = "quiz" | "calculating" | "results";

const inputClass =
  "w-full rounded-xl border border-navy/15 bg-offwhite px-4 py-3 text-navy outline-none transition-colors focus:border-navy/50 focus:bg-white focus:ring-2 focus:ring-gold/30";

const tierBar: Record<Tier, string> = {
  low: "bg-[#b4533c]",
  mid: "bg-gold",
  high: "bg-navy",
};
const tierText: Record<Tier, string> = {
  low: "text-[#9c4532]",
  mid: "text-gold-deep",
  high: "text-navy",
};
const tierLabel: Record<Tier, string> = {
  low: "Needs attention",
  mid: "Room to grow",
  high: "Strong",
};

const digitsOnly = (s: string) => s.replace(/\D/g, "").slice(0, 8);
const withCommas = (s: string) => (s ? Number(s).toLocaleString("en-US") : "");

// Skip the engagement question when the parish has neither account.
function visibleQuestions(d: Draft): Question[] {
  const noAccounts = d.fbFollowers === "none" && d.igFollowers === "none";
  return questions.filter((q) => !(noAccounts && q.id === "engagement"));
}

export default function Scorecard() {
  const [phase, setPhase] = useState<Phase>("quiz");
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({});
  const [report, setReport] = useState<ScorecardReport | null>(null);
  const [answers, setAnswers] = useState<ScorecardAnswers | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const visible = visibleQuestions(draft);
  const q = visible[Math.min(step, visible.length - 1)];

  function keepCardInView() {
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function finish(d: Draft) {
    const full: ScorecardAnswers = {
      ...(d as ScorecardAnswers),
      engagement: d.engagement ?? "unsure",
    };
    setAnswers(full);
    setPhase("calculating");
    keepCardInView();
    const [population] = await Promise.all([
      getScorecardPopulation(full.city, full.state).catch(() => null),
      new Promise((r) => setTimeout(r, 1400)),
    ]);
    setReport(buildReport(full, population));
    setPhase("results");
  }

  function next(update: Draft = {}) {
    const d = { ...draft, ...update };
    setDraft(d);
    const list = visibleQuestions(d);
    const idx = list.findIndex((x) => x.id === q.id);
    if (idx >= list.length - 1) {
      void finish(d);
    } else {
      setStep(idx + 1);
      keepCardInView();
    }
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  function restart() {
    setDraft({});
    setStep(0);
    setReport(null);
    setAnswers(null);
    setUnlocked(false);
    setPhase("quiz");
    keepCardInView();
  }

  return (
    <div ref={cardRef} className="scroll-mt-24">
      {phase === "quiz" && (
        <QuizCard
          key={q.id}
          q={q}
          index={visible.findIndex((x) => x.id === q.id)}
          total={visible.length}
          draft={draft}
          onNext={next}
          onBack={back}
        />
      )}

      {phase === "calculating" && (
        <div className="flex flex-col items-center rounded-3xl bg-white px-8 py-20 text-center shadow-xl shadow-navy/5 ring-1 ring-navy/5">
          <span
            className="h-10 w-10 animate-spin rounded-full border-[3px] border-navy/15 border-t-gold motion-reduce:animate-none"
            aria-hidden="true"
          />
          <p className="mt-6 font-serif text-2xl text-navy" role="status">
            Scoring your parish&hellip;
          </p>
        </div>
      )}

      {phase === "results" && report && answers && (
        <Results
          report={report}
          answers={answers}
          unlocked={unlocked}
          onUnlock={() => setUnlocked(true)}
          onRestart={restart}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// One question per screen
// ---------------------------------------------------------------------------

function QuizCard({
  q,
  index,
  total,
  draft,
  onNext,
  onBack,
}: {
  q: Question;
  index: number;
  total: number;
  draft: Draft;
  onNext: (update?: Draft) => void;
  onBack: () => void;
}) {
  const [city, setCity] = useState(draft.city ?? "");
  const [state, setState] = useState(draft.state ?? "");
  const initialNumber =
    q.id === "attendance"
      ? draft.attendance
      : q.kind === "count"
        ? draft[q.id]
        : undefined;
  const [num, setNum] = useState(typeof initialNumber === "number" ? String(initialNumber) : "");
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Desktop only: on phones this would pop the keyboard open on every step.
    if (window.matchMedia("(pointer: fine)").matches) firstInput.current?.focus();
  }, []);

  const progress = Math.round((index / total) * 100);
  const selected =
    q.kind === "choice" ? (draft[q.id as keyof Draft] as string | undefined) : undefined;
  const countValue = q.kind === "count" ? (draft[q.id] as FollowerCount | undefined) : undefined;

  function submitText(e: React.FormEvent) {
    e.preventDefault();
    if (q.kind === "location") {
      if (city.trim() && state) onNext({ city: titleCase(city.trim()), state });
    } else if (q.kind === "attendance") {
      if (Number(num) >= 1) onNext({ attendance: Number(num) });
    } else if (q.kind === "count") {
      if (num !== "") onNext({ [q.id]: Number(num) });
    }
  }

  const canContinue =
    q.kind === "location"
      ? city.trim() !== "" && state !== ""
      : q.kind === "attendance"
        ? Number(num) >= 1
        : num !== "";

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-navy/5 ring-1 ring-navy/5 sm:p-10">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.15em] text-navy/50">
        <span>
          Question {index + 1} of {total}
        </span>
        {index > 0 && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 normal-case tracking-normal text-navy/60 hover:text-navy"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back
          </button>
        )}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-navy/10" aria-hidden="true">
        <div
          className="h-full rounded-full bg-gold transition-all duration-500 motion-reduce:transition-none"
          style={{ width: `${Math.max(progress, 3)}%` }}
        />
      </div>

      <h2 className="mt-8 text-balance font-serif text-2xl font-medium leading-snug tracking-tight text-navy sm:text-3xl">
        {q.question}
      </h2>
      {q.hint && <p className="mt-2 text-pretty text-sm text-navy/60">{q.hint}</p>}

      {q.kind === "choice" ? (
        <div className="mt-6 grid gap-2.5" role="radiogroup" aria-label={q.question}>
          {q.choices.map((c) => {
            const on = selected === c.value;
            return (
              <button
                key={c.value}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => onNext({ [q.id]: c.value })}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-base transition-colors ${
                  on
                    ? "border-navy bg-navy text-offwhite"
                    : "border-navy/15 bg-offwhite text-navy hover:border-navy/40 hover:bg-white"
                }`}
              >
                <span
                  className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                    on ? "border-gold bg-gold" : "border-navy/30"
                  }`}
                  aria-hidden="true"
                />
                {c.label}
              </button>
            );
          })}
        </div>
      ) : (
        <form onSubmit={submitText} className="mt-6 space-y-4">
          {q.kind === "location" && (
            <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
              <div>
                <label htmlFor="sc-city" className="block text-sm font-medium text-navy">
                  City
                </label>
                <input
                  ref={firstInput}
                  id="sc-city"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="Reno"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`mt-2 ${inputClass}`}
                />
              </div>
              <div>
                <label htmlFor="sc-state" className="block text-sm font-medium text-navy">
                  State
                </label>
                <select
                  id="sc-state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={`mt-2 ${inputClass} ${state === "" ? "text-navy/50" : ""}`}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {US_STATES.map(([abbr, name]) => (
                    <option key={abbr} value={abbr}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {(q.kind === "attendance" || q.kind === "count") && (
            <div>
              <label htmlFor="sc-num" className="sr-only">
                {q.question}
              </label>
              <input
                ref={firstInput}
                id="sc-num"
                type="text"
                inputMode="numeric"
                placeholder={q.kind === "attendance" ? "e.g. 1,200" : "e.g. 850"}
                value={withCommas(num)}
                onChange={(e) => setNum(digitsOnly(e.target.value))}
                className={inputClass}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={!canContinue}
            className={buttonClass("primary", "w-full disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0")}
          >
            Continue
            <ArrowRight className={buttonArrow} aria-hidden="true" />
          </button>

          {q.kind === "count" && (
            <div className="flex flex-col gap-2 pt-1 sm:flex-row">
              {q.fallbacks.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => onNext({ [q.id]: f.value })}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    countValue === f.value
                      ? "border-navy bg-navy text-offwhite"
                      : "border-navy/15 text-navy/70 hover:border-navy/40 hover:text-navy"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </form>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Results: free score view → opt-in → full report
// ---------------------------------------------------------------------------

function ScoreRing({ score }: { score: number }) {
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
          className="text-gold transition-[stroke-dashoffset] duration-[1200ms] ease-out motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-5xl font-medium text-offwhite sm:text-6xl">{score}</span>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/60">out of 100</span>
      </div>
    </div>
  );
}

function Results({
  report,
  answers,
  unlocked,
  onUnlock,
  onRestart,
}: {
  report: ScorecardReport;
  answers: ScorecardAnswers;
  unlocked: boolean;
  onUnlock: () => void;
  onRestart: () => void;
}) {
  // Lowest-scoring category, even for a parish that's strong everywhere.
  const weakest =
    report.priorities[0] ??
    [...report.categories].sort((x, y) => x.points / x.max - y.points / y.max)[0];
  const hasPriorities = report.priorities.length > 0;
  const reportRef = useRef<HTMLDivElement>(null);
  const openBookACall = useBookACallModal();

  useEffect(() => {
    if (unlocked) {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [unlocked]);

  return (
    <div className="space-y-6">
      {/* Score */}
      <div className="overflow-hidden rounded-3xl bg-navy px-6 py-10 text-center text-offwhite shadow-2xl shadow-navy/20 sm:px-12 sm:py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Your Parish Social Media Score
        </p>
        <div className="mt-6 flex justify-center">
          <ScoreRing score={report.score} />
        </div>
        <h2 className="mt-6 text-balance font-serif text-3xl font-medium tracking-tight sm:text-4xl">
          {report.band.label}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty leading-relaxed text-offwhite/75">
          {report.band.summary}
        </p>
      </div>

      {/* Category bars */}
      <div className="rounded-3xl bg-white p-6 shadow-xl shadow-navy/5 ring-1 ring-navy/5 sm:p-10">
        <h3 className="font-serif text-2xl font-medium tracking-tight text-navy">
          Your Score by Category
        </h3>
        <ul className="mt-6 space-y-5">
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

        {/* Free teaser */}
        <div className="mt-8 rounded-2xl bg-parchment p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-deep">
            {hasPriorities ? "Your Biggest Opportunity" : "Your Lowest Category"}: {weakest.label}
          </p>
          <p className="mt-2 text-pretty font-serif text-lg leading-snug text-navy sm:text-xl">
            {weakest.status}
          </p>
        </div>
      </div>

      {/* Locked report + opt-in, or the full report */}
      {unlocked ? (
        <div ref={reportRef} className="scroll-mt-24 space-y-6">
          <FullReport report={report} />

          <div className="rounded-3xl bg-navy px-6 py-10 text-center text-offwhite sm:px-12">
            <h3 className="text-balance font-serif text-2xl font-medium tracking-tight sm:text-3xl">
              Want Help Closing These Gaps?
            </h3>
            <p className="mx-auto mt-3 max-w-md text-pretty leading-relaxed text-offwhite/75">
              Book a free Parish Growth Assessment. We&rsquo;ll walk through your
              scorecard together and map out what to fix&nbsp;first.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button type="button" onClick={openBookACall} className={buttonClass("light")}>
                Book a Free Assessment
                <ArrowRight className={buttonArrow} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className={buttonClass("ghostLight", "print:hidden")}
              >
                <Printer className="h-4 w-4" aria-hidden="true" />
                Print or Save as PDF
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-navy/5 ring-1 ring-navy/5">
          {/* Blurred preview of what's inside. Decorative only. */}
          <div aria-hidden="true" className="pointer-events-none select-none px-6 pt-8 blur-[6px] sm:px-10">
            <p className="font-serif text-2xl text-navy">Your Full Report</p>
            {(hasPriorities ? report.priorities : report.categories.slice(0, 3)).map((p, i) => (
              <div key={p.id} className="mt-4 rounded-2xl bg-offwhite p-4">
                <p className="font-medium text-navy">
                  {i + 1}. {p.label}
                </p>
                <p className="mt-1 text-sm text-navy/70">{hasPriorities ? p.fix : p.status}</p>
              </div>
            ))}
          </div>
          <div className="relative -mt-24 bg-gradient-to-b from-white/0 via-white to-white px-6 pb-8 pt-24 sm:px-10 sm:pb-10">
            <OptInForm answers={answers} onUnlock={onUnlock} />
          </div>
        </div>
      )}

      <div className="text-center print:hidden">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-1.5 text-sm text-navy/60 underline-offset-4 hover:text-navy hover:underline"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Retake the scorecard
        </button>
      </div>
    </div>
  );
}

function FullReport({ report }: { report: ScorecardReport }) {
  return (
    <>
      <div className="rounded-3xl bg-white p-6 shadow-xl shadow-navy/5 ring-1 ring-navy/5 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">Full Report</p>
        <h3 className="mt-2 font-serif text-3xl font-medium tracking-tight text-navy">
          {report.priorities.length === 0
            ? "Every Category Scored Strong"
            : report.priorities.length === 1
              ? "Your Top Priority"
              : `Your Top ${report.priorities.length} Priorities`}
        </h3>
        {report.priorities.length === 0 && (
          <p className="mt-3 text-pretty leading-relaxed text-navy/75">
            Your parish is doing the things that bring new people to Mass. Keep
            protecting what&rsquo;s working, and use the breakdown below to see
            where you&rsquo;re&nbsp;strongest.
          </p>
        )}
        <ol className="mt-6 space-y-4 empty:hidden">
          {report.priorities.map((p, i) => (
            <li key={p.id} className="flex gap-4 rounded-2xl bg-parchment p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy font-serif text-offwhite">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-navy">{p.label}</p>
                <p className="mt-1 text-pretty leading-relaxed text-navy/75">{p.fix}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {report.categories.map((c) => (
        <div key={c.id} className="rounded-3xl bg-white p-6 shadow-xl shadow-navy/5 ring-1 ring-navy/5 sm:p-8">
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="font-serif text-2xl font-medium tracking-tight text-navy">{c.label}</h4>
            <span className="shrink-0 tabular-nums text-navy/60">
              {c.points}/{c.max}
            </span>
          </div>
          <p className={`mt-1 text-xs font-semibold uppercase tracking-wider ${tierText[c.tier]}`}>
            {tierLabel[c.tier]}
          </p>
          <p className="mt-4 text-pretty font-medium leading-relaxed text-navy">{c.status}</p>
          {c.facts.length > 0 && (
            <ul className="mt-3 space-y-2">
              {c.facts.map((f) => (
                <li key={f} className="flex gap-3 text-pretty leading-relaxed text-navy/75">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          )}
          {c.tier !== "high" && (
            <div className="mt-5 border-l-2 border-gold pl-4">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-deep">What to do</p>
              <p className="mt-1 text-pretty leading-relaxed text-navy/80">{c.fix}</p>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

const initialOptIn: ScorecardOptInState = { status: "idle" };

function OptInForm({
  answers,
  onUnlock,
}: {
  answers: ScorecardAnswers;
  onUnlock: () => void;
}) {
  const [state, formAction, pending] = useActionState(submitScorecardOptIn, initialOptIn);
  const [role, setRole] = useState("");
  const ineligible = role === NO_QUALIFYING_ROLE;
  const answersJson = useMemo(() => JSON.stringify(answers), [answers]);

  useEffect(() => {
    if (state.status !== "success") return;
    // Browser half of the Lead; the server sent the same eventId to the
    // Conversions API. A tracking failure must never block the report.
    try {
      trackLead("Social Media Scorecard", state.eventId);
    } catch (err) {
      console.error("Failed to fire Meta Pixel Lead (scorecard):", err);
    }
    onUnlock();
  }, [state.status, state.eventId, onUnlock]);

  return (
    <form action={formAction} className="mx-auto max-w-md space-y-4">
      <div className="text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="mt-4 text-balance font-serif text-2xl font-medium tracking-tight text-navy sm:text-3xl">
          Unlock Your Full Report
        </h3>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-navy/65">
          See what to fix first, plus specific next steps for every
          category, written for your&nbsp;parish.
        </p>
      </div>

      {state.status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </div>
      )}

      <input type="hidden" name="answers" value={answersJson} />

      <Field id="sc-name" label="Full Name">
        <input id="sc-name" name="name" type="text" required autoComplete="name" placeholder="John Smith" className={inputClass} />
      </Field>
      <Field id="sc-email" label="Email">
        <input
          id="sc-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
          title="Please enter a valid email address (e.g. name@example.com)"
          placeholder="name@example.com"
          className={inputClass}
        />
      </Field>
      <Field id="sc-phone" label="Phone Number">
        <input
          id="sc-phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          pattern="^(?:\D*\d){10,}\D*$"
          title="Please enter a valid phone number (at least 10 digits)"
          placeholder="(555) 123-4567"
          className={inputClass}
        />
      </Field>
      <Field id="sc-org" label="Name of Parish">
        <input id="sc-org" name="organization" type="text" required placeholder="St. Mary Parish" className={inputClass} />
      </Field>
      <Field id="sc-role" label="Your Role">
        <select
          id="sc-role"
          name="role"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={`${inputClass} ${role === "" ? "text-navy/50" : ""}`}
        >
          <option value="" disabled>
            Select your role
          </option>
          {freeGuideRoles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {ineligible && (
          <p className="mt-3 rounded-lg bg-gold/10 px-4 py-3 text-sm text-navy/80">
            The full report is only for the roles listed&nbsp;above.
          </p>
        )}
      </Field>

      <button
        type="submit"
        disabled={pending || ineligible || state.status === "success"}
        className={`w-full rounded-full bg-gold px-8 py-3.5 text-base font-semibold text-navy shadow-lg shadow-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/40 disabled:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
          ineligible ? "disabled:opacity-60" : "disabled:cursor-wait"
        }`}
      >
        {pending ? (
          <span className="inline-flex items-center justify-center gap-2.5">
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-navy/25 border-t-navy motion-reduce:animate-none"
              aria-hidden="true"
            />
            Unlocking&hellip;
          </span>
        ) : (
          "Show My Full Report"
        )}
      </button>
    </form>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-navy">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
