"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import {
  getScorecardPopulation,
  submitScorecardOptIn,
  type ScorecardOptInState,
} from "@/app/actions";
import { buttonArrow, buttonClass } from "@/components/buttonStyles";
import SendingOverlay from "@/components/SendingOverlay";
import {
  CategoryBars,
  SCORECARD_RESULT_KEY,
  ScoreHero,
  type StoredScorecardResult,
} from "@/components/ScorecardParts";
import { trackLead } from "@/lib/pixel";
import {
  buildReport,
  titleCase,
  type FollowerCount,
  type ScorecardAnswers,
  type ScorecardReport,
} from "@/lib/scorecard";
import { buildScorecardDoc } from "@/lib/scorecardReport";
import { US_STATES, questions, type Question } from "@/data/scorecard";
import { NO_QUALIFYING_ROLE, freeGuideRoles } from "@/data/freeGuideRoles";

type Draft = Partial<ScorecardAnswers>;
type Phase = "quiz" | "calculating" | "results";

const inputClass =
  "w-full rounded-xl border border-navy/15 bg-offwhite px-4 py-3 text-navy outline-none transition-colors focus:border-navy/50 focus:bg-white focus:ring-2 focus:ring-gold/30";

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
      contentMix: d.contentMix ?? [],
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
  const [picked, setPicked] = useState<string[]>(draft.contentMix ?? []);
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
      ) : q.kind === "multi" ? (
        <div className="mt-6 space-y-4">
          <div className="grid gap-2.5" role="group" aria-label={q.question}>
            {q.choices.map((c) => {
              const on = picked.includes(c.value);
              return (
                <button
                  key={c.value}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  onClick={() =>
                    setPicked((p) => (on ? p.filter((v) => v !== c.value) : [...p, c.value]))
                  }
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-base transition-colors ${
                    on
                      ? "border-navy bg-navy text-offwhite"
                      : "border-navy/15 bg-offwhite text-navy hover:border-navy/40 hover:bg-white"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
                      on ? "border-gold bg-gold" : "border-navy/30"
                    }`}
                    aria-hidden="true"
                  >
                    {on && <Check className="h-3 w-3 text-navy" strokeWidth={3} />}
                  </span>
                  {c.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => onNext({ contentMix: picked })}
            className={buttonClass("primary", "w-full")}
          >
            {picked.length ? "Continue" : "None of These"}
            <ArrowRight className={buttonArrow} aria-hidden="true" />
          </button>
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
// Results: free score view → "where should we send your report?" → summary
// page (/scorecard/summary). The full report itself goes out by email.
// ---------------------------------------------------------------------------

function Results({
  report,
  answers,
  onRestart,
}: {
  report: ScorecardReport;
  answers: ScorecardAnswers;
  onRestart: () => void;
}) {
  // The written report's problems (no name/parish yet, so it's generic).
  const doc = useMemo(() => buildScorecardDoc(answers, report.population), [answers, report.population]);
  const topProblem = doc.problems[0];
  // Lowest-scoring category, for a parish with no major problems.
  const weakest = [...report.categories].sort((x, y) => x.points / x.max - y.points / y.max)[0];
  const problemCount = ["", "one major problem", "two major problems", "three major problems"][
    doc.problems.length
  ];

  // Bring the results to the top of the screen so the score, the biggest
  // problem, and the start of the opt-in form are all in view.
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div ref={rootRef} className="scroll-mt-24 space-y-5">
      <ScoreHero report={report} compact />

      {/* Biggest problem, then straight into the opt-in */}
      <div className="rounded-3xl bg-white p-5 shadow-xl shadow-navy/5 ring-1 ring-navy/5 sm:p-8">
        <div className="rounded-2xl bg-parchment p-5 sm:p-6">
          {topProblem ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-deep">
                The Biggest Problem We Found
              </p>
              <p className="mt-2 text-pretty font-serif text-lg leading-snug text-navy sm:text-xl">
                {topProblem.title}.
              </p>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-navy/70">
                Your full report covers {problemCount}: what we saw, why each
                one matters, and the first step to fix&nbsp;it.
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-deep">
                Your Lowest Category: {weakest.label}
              </p>
              <p className="mt-2 text-pretty font-serif text-lg leading-snug text-navy sm:text-xl">
                {weakest.status}
              </p>
            </>
          )}
        </div>

        <div className="pt-7 sm:pt-8">
          <OptInForm answers={answers} population={report.population} />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-xl shadow-navy/5 ring-1 ring-navy/5 sm:p-10">
        <h3 className="font-serif text-2xl font-medium tracking-tight text-navy">
          Your Score by Category
        </h3>
        <div className="mt-6">
          <CategoryBars report={report} />
        </div>
      </div>

      <div className="text-center">
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

const initialOptIn: ScorecardOptInState = { status: "idle" };

function OptInForm({
  answers,
  population,
}: {
  answers: ScorecardAnswers;
  population: number | null;
}) {
  const [state, formAction, pending] = useActionState(submitScorecardOptIn, initialOptIn);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const ineligible = role === NO_QUALIFYING_ROLE;
  const answersJson = useMemo(() => JSON.stringify(answers), [answers]);
  const done = state.status === "success";
  // Fades the sending screen out just before we leave for the summary page.
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (state.status !== "success") return;
    // Browser half of the Lead; the server sent the same eventId to the
    // Conversions API. A tracking failure must never block the redirect.
    try {
      trackLead("Social Media Scorecard", state.eventId);
    } catch (err) {
      console.error("Failed to fire Meta Pixel Lead (scorecard):", err);
    }
    // Lets the summary page show their results. Kept out of the URL so
    // name/email never reach analytics or the pixel.
    try {
      const result: StoredScorecardResult = {
        answers,
        population,
        name: name.trim(),
        email: email.trim(),
        organization: organization.trim(),
        role,
        pdfUrl: state.pdfUrl,
      };
      sessionStorage.setItem(SCORECARD_RESULT_KEY, JSON.stringify(result));
    } catch {
      // Storage blocked: the summary page falls back to a generic version.
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const fade = setTimeout(() => setLeaving(true), 1400);
    const go = setTimeout(() => {
      window.location.href = "/scorecard/summary";
    }, 1650);
    return () => {
      clearTimeout(fade);
      clearTimeout(go);
      document.body.style.overflow = prevOverflow;
    };
  }, [state.status, state.eventId, state.pdfUrl, answers, population, name, email, organization, role]);

  return (
    <>
      {done &&
        createPortal(
          <SendingOverlay leaving={leaving} message={"Sending your report…"} />,
          document.body,
        )}
      <form action={formAction} className="mx-auto max-w-md space-y-4">
        <div className="text-center">
          <h3 className="text-balance font-serif text-2xl font-medium tracking-tight text-navy sm:text-3xl">
            Where Should We Send Your Full Report?
          </h3>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-navy/65">
            Your report shows what to fix first, plus specific next steps for
            every category, written for your&nbsp;parish.
          </p>
        </div>

        {state.status === "error" && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {state.message}
          </div>
        )}

        <input type="hidden" name="answers" value={answersJson} />

        <Field id="sc-name" label="Full Name">
          <input
            id="sc-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="John Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <input
            id="sc-org"
            name="organization"
            type="text"
            required
            placeholder="St. Mary Parish"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className={inputClass}
          />
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
          disabled={pending || done || ineligible}
          className={`group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-base font-semibold text-navy shadow-lg shadow-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/40 disabled:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
            ineligible ? "disabled:opacity-60" : "disabled:cursor-wait"
          }`}
        >
          {pending || done ? (
            <span className="inline-flex items-center justify-center gap-2.5">
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-navy/25 border-t-navy motion-reduce:animate-none"
                aria-hidden="true"
              />
              Sending&hellip;
            </span>
          ) : (
            <>
              Send Me My Full Report
              <ArrowRight className={buttonArrow} aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </>
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
