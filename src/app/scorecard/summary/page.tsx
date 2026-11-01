import type { Metadata } from "next";
import ScorecardSummary from "@/components/ScorecardSummary";

export const metadata: Metadata = {
  title: "Your Scorecard Summary | Parish Media Company",
  description: "A quick summary of your Parish Social Media Scorecard results.",
  // Post-opt-in page; never meant to be found through search.
  robots: { index: false, follow: false },
};

export default function ScorecardSummaryPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-clip px-4 pt-10 pb-20 sm:px-6 sm:pt-16 sm:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[30rem] w-[48rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-parchment blur-3xl"
        />
        <div className="mx-auto max-w-2xl">
          <ScorecardSummary />
        </div>
      </section>
    </main>
  );
}
