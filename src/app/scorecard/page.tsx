import type { Metadata } from "next";
import Scorecard from "@/components/Scorecard";

export const metadata: Metadata = {
  title: "Parish Social Media Scorecard | Parish Media Company",
  description:
    "Answer 14 quick questions and get a free score out of 100 for how well your parish reaches new people on Facebook and Instagram.",
};

export default function ScorecardPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-clip px-4 pt-8 pb-20 sm:px-6 sm:pt-14 sm:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[30rem] w-[48rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-parchment blur-3xl"
        />

        <div className="mx-auto max-w-2xl text-center print:hidden">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">
            Free Parish Social Media Scorecard
          </span>
          <h1 className="mt-4 text-balance font-serif text-4xl font-medium leading-[1.08] tracking-tight text-navy sm:text-6xl">
            How Well Is Your Parish Reaching New People?
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-navy/70 sm:text-xl">
            Answer 14 quick questions about your Facebook, Instagram, and
            newcomer follow-up. In about 3 minutes, you&rsquo;ll get your
            parish&rsquo;s score out of&nbsp;100.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl sm:mt-12">
          <Scorecard />
        </div>
      </section>
    </main>
  );
}
