import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookACallButton from "@/components/BookACallButton";
import VaultExplorer from "@/components/VaultExplorer";

export const metadata: Metadata = {
  title: "The Vault | Parish Media Company",
  description:
    "Every free Parish Media Company resource in one place: books, video tutorials, and tools for growing your parish.",
};

export default function VaultPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col bg-[#0e1628] text-white">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-12 pt-20 text-center sm:pb-16 sm:pt-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.18),transparent_60%)]" />
          <div className="relative mx-auto max-w-2xl">
            <h1 className="font-serif font-semibold">
              <span className="block text-2xl italic text-gold sm:text-3xl">The</span>
              <span className="-mt-1 block bg-[linear-gradient(110deg,#a07c1a_0%,#e6c25e_30%,#fff6d6_45%,#e6c25e_60%,#a07c1a_100%)] bg-[length:250%_100%] bg-clip-text pb-2 text-8xl leading-none tracking-tight text-transparent drop-shadow-[0_4px_30px_rgba(201,162,39,0.35)] motion-safe:animate-vault-shine sm:text-9xl">
                Vault
              </span>
            </h1>
            <div className="mt-5 flex items-center justify-center gap-4">
              <span className="hidden h-px w-16 bg-linear-to-r from-transparent to-gold/70 sm:block" />
              <p className="whitespace-nowrap font-serif text-lg italic text-white/90 sm:text-2xl">
                Free Books, Videos, and SOPs
              </p>
              <span className="hidden h-px w-16 bg-linear-to-l from-transparent to-gold/70 sm:block" />
            </div>
            <p className="mx-auto mt-5 max-w-lg text-balance text-lg text-white/70">
              Every free resource we&rsquo;ve made for growing your parish,
              diocese, or religious order. All in one&nbsp;place.
            </p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-white/40">
              Choose a vault to unlock
            </p>
          </div>
        </section>

        {/* Vaults */}
        <section className="px-6 pb-20">
          <VaultExplorer />
        </section>

        {/* CTA */}
        <section className="border-t border-gold/15 px-6 py-16 text-center">
          <div className="mx-auto max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">Beyond the Vault</p>
            <h2 className="mt-3 text-balance font-serif text-2xl font-semibold sm:text-3xl">
              Want us to run it for you?
            </h2>
            <p className="mt-3 text-balance text-white/70">
              Book a free call and we&rsquo;ll walk through what growth could
              look like for your&nbsp;parish.
            </p>
            <BookACallButton className="mt-7 rounded-full bg-gold px-8 py-3 font-semibold text-navy shadow-[0_0_30px_-5px_rgba(201,162,39,0.6)] transition-colors hover:bg-gold/90">
              Book a Free Call
            </BookACallButton>
          </div>
        </section>
      </main>
    </>
  );
}
