import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Link from "next/link";
import LibraryExplorer from "@/components/LibraryExplorer";
import RoseWindow from "@/components/RoseWindow";

export const metadata: Metadata = {
  title: "The Parish House of Studies | Parish Media Company",
  description:
    "Free training in parish communications: books, video tutorials, and SOPs for growing your parish, diocese, or religious order.",
};

export default function HouseOfStudiesPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col bg-[#0e1628] text-white">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-12 pt-20 text-center sm:pb-16 sm:pt-24">
          <div className="relative mx-auto max-w-4xl">
            <div className="relative">
              {/* Rose window centered behind the title */}
              <div className="pointer-events-none absolute left-1/2 top-[58%] w-[420px] -translate-x-1/2 -translate-y-1/2 text-gold opacity-20 [mask-image:linear-gradient(to_bottom,black_55%,transparent_92%)] sm:w-[640px]">
                <RoseWindow className="block h-auto w-full motion-safe:animate-rose-spin" />
              </div>
              <h1 className="relative font-serif font-semibold">
                <span className="block text-2xl text-gold sm:text-3xl">The Parish</span>
                <span className="mt-2 block text-balance bg-[linear-gradient(110deg,#a07c1a_0%,#e6c25e_30%,#fff6d6_45%,#e6c25e_60%,#a07c1a_100%)] bg-[length:250%_100%] bg-clip-text pb-3 text-6xl leading-[0.95] tracking-tight text-transparent motion-safe:animate-title-shine sm:text-8xl">
                  House of Studies
                </span>
              </h1>
            </div>
            <p className="mx-auto mt-5 max-w-xl text-balance font-serif text-xl text-white/90 sm:text-2xl">
              A free online library of books, videos, and SOPs for parish&nbsp;communications.
            </p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-white/40">
              Choose a shelf to browse
            </p>
          </div>
        </section>

        {/* Bookshelves */}
        <section className="px-6 pb-20">
          <LibraryExplorer />
        </section>

        {/* CTA */}
        <section className="border-t border-gold/15 px-6 py-16 text-center">
          <div className="mx-auto max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">Beyond the House of&nbsp;Studies</p>
            <h2 className="mt-3 text-balance font-serif text-2xl font-semibold sm:text-3xl">
              Don&rsquo;t Have the Resources to Implement All of&nbsp;This?
            </h2>
            <p className="mt-3 text-balance text-white/70">
              We can handle it all for you, and implement at the highest
              level. At a fraction of the cost of a local comms&nbsp;hire.
            </p>
            <Link
              href="/parish"
              className="mt-7 inline-block rounded-full bg-gold px-8 py-3 font-semibold text-navy shadow-[0_0_30px_-5px_rgba(201,162,39,0.6)] transition-colors hover:bg-gold/90"
            >
              See What We Do for&nbsp;Parishes
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
