"use client";

import { useMemo, useSyncExternalStore } from "react";
import { ChevronDown, ClipboardCheck } from "lucide-react";
import DeliveryAnimation from "@/components/DeliveryAnimation";
import Reveal from "@/components/Reveal";
import RoseWindow from "@/components/RoseWindow";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import { SCORECARD_RESULT_KEY, type StoredScorecardResult } from "@/components/ScorecardParts";
import { GROWTH_REVIEW_CALENDLY_URL } from "@/data/booking";

type Loaded = {
  name: string;
  email: string;
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

// Glide down to the calendar (instant when the visitor prefers reduced motion).
function scrollToBooking(e: React.MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById("book");
  if (!target) return;
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

const h2 = "font-serif text-4xl font-medium leading-[1.08] text-balance sm:text-5xl";

// Shown after the scorecard opt-in. The full scorecard (the letter PDF) goes
// to their email via the Zap; this page confirms it's coming and lets them
// book a Free Parish Growth Review right here (Calendly embedded, no extra
// landing page). Clean and open like /parish, no boxes (Joe, 2026-11-16);
// subtle graphics only, no added copy (mobile-first, Meta ad traffic).
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
      const name = String(stored.name ?? "").trim().slice(0, 120);
      return {
        name,
        email: String(stored.email ?? "").trim().slice(0, 120),
      };
    } catch {
      return null;
    }
  }, [raw]);

  // Prefill Calendly with what they just typed, so booking is one less form.
  const calendlyUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (data?.name) params.set("name", data.name);
    if (data?.email) params.set("email", data.email);
    const extra = params.toString();
    return extra ? `${GROWTH_REVIEW_CALENDLY_URL}&${extra}` : GROWTH_REVIEW_CALENDLY_URL;
  }, [data]);

  if (data === undefined) {
    return <div className="min-h-[60vh]" aria-hidden="true" />;
  }

  return (
    <>
      {/* 1. Confirmation: the scorecard "flying" to their inbox, with a
          faint gold rose window turning behind the headline. */}
      <section className="relative overflow-hidden px-6 pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div
          className="pointer-events-none absolute left-1/2 top-24 w-[460px] -translate-x-1/2 text-gilt opacity-[0.14] [mask-image:radial-gradient(circle,black_45%,transparent_72%)] sm:top-16 sm:w-[680px]"
          aria-hidden="true"
        >
          <RoseWindow className="block h-auto w-full motion-safe:animate-rose-spin" />
        </div>
        <div className="relative mx-auto max-w-2xl text-center">
          <Reveal>
            <DeliveryAnimation icon={ClipboardCheck} />
          </Reveal>
          <Reveal delayMs={120}>
            <h1 className="mt-10 text-balance font-serif text-4xl font-medium leading-[1.08] sm:text-6xl">
              Your Full Scorecard Is on Its Way
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-ink/75">
              We sent your personalized scorecard to your inbox. If you don&rsquo;t
              see it within a few minutes, check your spam or promotions&nbsp;folder.
            </p>
            <div className="mt-8 flex flex-col items-center gap-5">
              <a
                href="#book"
                onClick={scrollToBooking}
                className="inline-flex items-center gap-2 rounded-full bg-lapis px-8 py-4 text-lg font-semibold text-vellum shadow-lg shadow-lapis/20 transition hover:bg-lapis-deep"
              >
                Book My Free Review
                <ChevronDown className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. The offer: a deep lapis band so it reads as the turn of the page,
          with a gold ornament and a nudge down toward the calendar. */}
      <section className="relative overflow-hidden bg-lapis px-6 py-16 text-vellum sm:py-24">
        <div
          className="pointer-events-none absolute -right-28 -top-28 w-80 text-gilt opacity-20 sm:-right-20 sm:w-[420px]"
          aria-hidden="true"
        >
          <RoseWindow className="block h-auto w-full motion-safe:animate-rose-spin" />
        </div>
        <Reveal className="relative mx-auto max-w-2xl text-center">
          <Ornament className="text-gilt" />
          <h2 className={`${h2} mt-8`}>Want Help Deciding What to Fix&nbsp;First?</h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-vellum/80">
            Book your Free Parish Growth Review. We&rsquo;ll review your
            scorecard, identify the highest-priority opportunity, and map the
            next 90 days for your&nbsp;parish.
          </p>
          <a
            href="#book"
                onClick={scrollToBooking}
            aria-label="Jump to the calendar"
            className="mt-10 inline-grid h-12 w-12 place-items-center rounded-full text-gilt ring-1 ring-gilt/50 transition hover:bg-gilt/10"
          >
            <ChevronDown className="h-5 w-5 motion-safe:animate-bounce" aria-hidden="true" />
          </a>
        </Reveal>
      </section>

      {/* 3. Before you book + calendar */}
      <section id="book" className="scroll-mt-4 px-6 py-16 sm:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className={h2}>Before you book&hellip;</h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-ink/75">
            To make this conversation as useful as possible for your parish,{" "}
            <strong className="font-semibold text-ink">we ask that the pastor join the call.</strong>{" "}
            Assistant priests, deacons, and office staff are welcome to book,
            provided they can bring the pastor into the&nbsp;meeting.
          </p>
          <Ornament className="mt-10 text-gilt/70" />
        </Reveal>
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl shadow-lapis/10 ring-1 ring-gilt/30">
          {/* No trackScheduleEvent here: Calendly redirects to
              /call-confirmed after booking, which fires Schedule. */}
          <CalendlyEmbed url={calendlyUrl} />
        </div>
      </section>
    </>
  );
}

// Gold rule with a small cross at the center, used as a section ornament.
function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto flex w-40 items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-current opacity-60" />
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <path d="M10 2v16M4 7.5h12" />
      </svg>
      <span className="h-px flex-1 bg-current opacity-60" />
    </div>
  );
}
