import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonArrow, buttonClass } from "@/components/buttonStyles";

// The /results page is middle-of-funnel: its CTAs send people to the free
// scorecard rather than straight to a call.

export function ScorecardButton({
  variant = "primary",
  children = "Get your free parish scorecard",
}: {
  variant?: "primary" | "gold";
  children?: React.ReactNode;
}) {
  return (
    <Link href="/scorecard" className={buttonClass(variant)}>
      {children}
      <ArrowRight className={buttonArrow} aria-hidden="true" />
    </Link>
  );
}

export function ScorecardCard({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="grid items-center gap-6 rounded-3xl bg-linear-to-br from-lapis to-lapis-deep px-8 py-10 text-vellum shadow-2xl shadow-lapis/30 sm:px-12 md:grid-cols-[1fr_auto] md:gap-12">
      <div>
        <h3 className="text-balance font-serif text-3xl font-medium leading-tight sm:text-4xl">{heading}</h3>
        <p className="mt-3 max-w-xl text-pretty text-lg text-vellum/80">{body}</p>
      </div>
      <div>
        <ScorecardButton variant="gold">Take the free scorecard</ScorecardButton>
      </div>
    </div>
  );
}
