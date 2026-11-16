"use client";

import { useMemo, useSyncExternalStore } from "react";
import { FileText } from "lucide-react";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import { SCORECARD_RESULT_KEY, type StoredScorecardResult } from "@/components/ScorecardParts";
import { GROWTH_REVIEW_CALENDLY_URL } from "@/data/booking";

type Loaded = {
  name: string;
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

const h2 = "font-serif text-4xl font-medium leading-[1.08] text-balance sm:text-5xl";

// Shown after the scorecard opt-in. The full scorecard (the letter PDF) goes
// to their email via the Zap; this page confirms it's coming and lets them
// book a Free Parish Growth Review right here (Calendly embedded, no extra
// landing page). Clean and open like /parish, no boxes (Joe, 2026-11-16).
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
      // Only our own report links, never an arbitrary URL from storage.
      const pdfUrl =
        typeof stored.pdfUrl === "string" && /^https?:\/\/[^/]+\/api\/scorecard\/report(\/[\w.-]+\.pdf)?\?/.test(stored.pdfUrl)
          ? stored.pdfUrl
          : null;
      const name = String(stored.name ?? "").trim().slice(0, 120);
      return {
        name,
        email: String(stored.email ?? "").trim().slice(0, 120),
        pdfUrl,
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
      {/* 1. Confirmation */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-balance font-serif text-4xl font-medium leading-[1.08] sm:text-6xl">
            Your Full Scorecard Is on Its Way
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-ink/75">
            We sent your personalized scorecard to your inbox. If you don&rsquo;t
            see it within a few minutes, check your spam or promotions&nbsp;folder.
          </p>
          {data?.pdfUrl && (
            <a
              href={data.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-lapis underline decoration-gilt/60 decoration-2 underline-offset-[6px] transition-colors hover:decoration-gilt"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              Or download it now (PDF)
            </a>
          )}
        </div>
      </section>

      {/* 2. The offer */}
      <section className="bg-vellum-deep px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={h2}>Want Help Deciding What to Fix&nbsp;First?</h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-ink/75">
            Book your Free Parish Growth Review. We&rsquo;ll review your
            scorecard, identify the highest-priority opportunity, and map the
            next 90 days for your&nbsp;parish.
          </p>
        </div>
      </section>

      {/* 3. Before you book + calendar */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={h2}>Before you book&hellip;</h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-ink/75">
            To make this conversation as useful as possible for your parish,{" "}
            <strong className="font-semibold text-ink">we ask that the pastor join the call.</strong>{" "}
            Assistant priests, deacons, and office staff are welcome to book,
            provided they can bring the pastor into the&nbsp;meeting.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          {/* No trackScheduleEvent here: Calendly redirects to
              /call-confirmed after booking, which fires Schedule. */}
          <CalendlyEmbed url={calendlyUrl} />
        </div>
      </section>
    </>
  );
}
