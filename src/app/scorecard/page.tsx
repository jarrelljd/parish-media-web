import type { Metadata } from "next";
import Scorecard from "@/components/Scorecard";

export const metadata: Metadata = {
  title: "Parish Social Media Scorecard | Parish Media Company",
  description:
    "Take the free Parish Social Media Scorecard to see how your parish compares and identify the biggest opportunities to improve.",
};

export default function ScorecardPage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero matches /parish: dark band, with the quiz card sitting on the
          seam between the dark band and the light page. */}
      <section className="pb-20 sm:pb-28">
        <div className="bg-ink px-6 pt-14 sm:pt-20 print:hidden">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-balance font-serif text-[2.6rem] font-medium leading-[1.06] text-vellum motion-safe:animate-fade-up sm:text-6xl">
              How Well Is Your Parish Reaching New&nbsp;People?
            </h1>
            <p
              className="mx-auto mt-5 max-w-2xl text-balance text-lg text-vellum/80 motion-safe:animate-fade-up"
              style={{ animationDelay: "240ms" }}
            >
              Take the free Parish Social Media Scorecard below to see where
              your parish stands. In about 3 minutes, you&rsquo;ll get your
              parish&rsquo;s score out of&nbsp;100.
            </p>
          </div>
        </div>
        <div className="bg-linear-to-b from-ink from-[12rem] to-transparent to-[12rem] px-4 print:bg-none pt-10 sm:px-6 sm:pt-12">
          <div className="mx-auto max-w-2xl">
            <Scorecard />
          </div>
        </div>
      </section>
    </main>
  );
}
