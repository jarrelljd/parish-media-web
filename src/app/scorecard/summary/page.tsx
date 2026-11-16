import type { Metadata } from "next";
import ScorecardSummary from "@/components/ScorecardSummary";

export const metadata: Metadata = {
  title: "Your Scorecard Is on Its Way | Parish Media Company",
  description: "Your Parish Social Media Scorecard is on its way. Book a Free Parish Growth Review.",
  // Post-opt-in page; never meant to be found through search.
  robots: { index: false, follow: false },
};

export default function ScorecardSummaryPage() {
  return (
    <main className="flex flex-1 flex-col bg-vellum text-ink">
      <ScorecardSummary />
    </main>
  );
}
