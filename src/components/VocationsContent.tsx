import Image from "next/image";
import VocationsBookACallButton from "./VocationsBookACallButton";
import nathanLintonPhoto from "../../public/images/proof/nathan-linton-vocations.jpg";
import daveAufieroPhoto from "../../public/images/clients/fr-dave-aufiero.jpg";

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-navy/80">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold"
        aria-hidden="true"
      >
        &#10003;
      </span>
      <span className="text-pretty">{children}</span>
    </li>
  );
}

export default function VocationsContent() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-6 pb-16 sm:pt-14 sm:pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
          <h1 className="mt-8 text-balance font-serif text-3xl font-semibold leading-tight text-navy sm:text-5xl">
            30+ Serious Vocation Inquiries in 90 Days for Your Diocese or
            Religious Order
          </h1>
          <p className="mt-6 text-pretty text-lg text-navy/70">
            We use targeted Facebook and Instagram campaigns to reach
            discerning Catholic men 21&ndash;35 and send only serious
            inquiries to your vocations desk.
          </p>
          <div className="mt-8">
            <VocationsBookACallButton className="inline-flex items-center justify-center rounded-full bg-gold px-10 py-4 text-base font-semibold text-navy shadow-md transition-colors hover:bg-gold/90">
              Book 30-Min Vocations Strategy&nbsp;Call
            </VocationsBookACallButton>
          </div>
          <div className="mx-auto mt-8 flex max-w-md items-center gap-4 rounded-2xl border border-gold/30 bg-white px-6 py-4 text-left shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-10 w-10 shrink-0 text-gold"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M12 3c-2.755 0-5.455.386-8.032 1.113a1.125 1.125 0 0 0-.734 1.352 1.125 1.125 0 0 0 .01.104C3.2 12.4 6.4 18.9 12 21c5.6-2.1 8.8-8.6 8.756-15.43a1.125 1.125 0 0 0-.734-1.352A48.424 48.424 0 0 0 12 3Z"
              />
            </svg>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                100% Guarantee
              </p>
              <p className="mt-1 text-pretty text-sm text-navy/70">
                If we don&rsquo;t deliver 30 new inquiries in 90 days, you pay
                nothing and we donate $1,000 to your diocese or
                religious&nbsp;community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why you're here */}
      <section className="bg-navy/5 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-2xl font-semibold text-navy sm:text-3xl">
            Why You&rsquo;re Here
          </h2>
          <p className="mt-4 text-pretty text-navy/80">
            If you&rsquo;re responsible for vocations, you already know the
            numbers are challenging. Fewer young men are hearing the
            invitation, and most will never meet your community in person.
          </p>
          <p className="mt-4 text-pretty text-navy/80">
            Our work is simple: we use Facebook and Instagram to help the
            right men actually find you and take the next concrete step in
            discernment.
          </p>
        </div>
      </section>

      {/* Client snapshot */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-semibold text-navy sm:text-3xl">
              Client Snapshot: The Capuchin Franciscans
            </h2>
            <p className="mt-4 text-navy/80">
              In a recent campaign with the Midwest Province of St. Joseph, we
              generated:
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
              <p className="font-serif text-4xl font-semibold text-navy">
                190
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wide text-navy/60">
                Men Inquired About Religious Life in 90 Days
              </p>
            </div>
            <div className="rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
              <p className="font-serif text-4xl font-semibold text-navy">
                $500
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wide text-navy/60">
                Total Ad Spend
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-6 rounded-2xl border border-navy/10 bg-white p-8 shadow-sm sm:flex-row sm:items-start sm:text-left">
            <Image
              src={nathanLintonPhoto}
              alt="Fr. Nathan Linton"
              className="h-24 w-24 shrink-0 rounded-full object-cover"
              style={{ objectPosition: "65% 50%" }}
            />
            <div>
              <p className="text-pretty text-lg italic text-navy/80">
                &ldquo;This has been great. The other provinces have even
                been talking about how good our socials have gotten.&rdquo;
              </p>
              <p className="mt-4 font-semibold text-navy">
                Fr. Nathan Linton
              </p>
              <p className="text-sm text-navy/60">
                Vocations Director, Capuchins &mdash; Midwest Province of St.
                Joseph
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we do for you */}
      <section className="bg-navy/5 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center font-serif text-2xl font-semibold text-navy sm:text-3xl">
            What We Do for You
          </h2>
          <p className="mt-4 text-center text-navy/80">
            If we work together, we:
          </p>
          <ul className="mt-6 space-y-3">
            <CheckItem>
              Build and run vocation-specific ads on Facebook and Instagram
            </CheckItem>
            <CheckItem>
              Drive men 21&ndash;35 to a simple inquiry form connected to
              your vocations office
            </CheckItem>
            <CheckItem>
              Pre-screen for basic fit so your time is spent with more
              serious inquirers
            </CheckItem>
            <CheckItem>
              Report back weekly on inquiries and what we&rsquo;re learning
            </CheckItem>
          </ul>
          <p className="mt-6 text-center text-pretty text-navy/80">
            You keep full control of screening, discernment, and formation.
            We just help more men reach your front door.
          </p>

          <div className="mx-auto mt-10 flex max-w-md items-center gap-4 border-t border-navy/10 pt-8">
            <Image
              src={daveAufieroPhoto}
              alt="Fr. Dave Aufiero"
              className="h-14 w-14 shrink-0 rounded-full object-cover"
            />
            <p className="text-pretty text-sm italic text-navy/70">
              &ldquo;He helped build our young adult ministry, it&rsquo;s
              been a pleasure working with him. I recommended Joe to our
              Diocese.&rdquo;
              <span className="mt-1 block font-semibold not-italic text-navy">
                Fr. Dave Aufiero, Vocations Director, Diocese&nbsp;of&nbsp;Springfield
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* The guarantee */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gold/40 bg-white p-8 shadow-sm sm:p-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            The Guarantee
          </span>
          <p className="mt-4 text-pretty text-navy/80">
            We agree together on your community&rsquo;s profile and approval
            process. If, within 90 days of launch, you do not receive at
            least 30 new inquiries from men 21&ndash;35:
          </p>
          <ul className="mt-6 space-y-3">
            <CheckItem>We refund 100% of our fee, and</CheckItem>
            <CheckItem>
              We donate $1,000 to your diocese or religious order for having
              wasted your time
            </CheckItem>
          </ul>
          <p className="mt-6 font-semibold text-navy">
            No fine print games. If we don&rsquo;t deliver, you&rsquo;re
            still having more conversations with discerners for free.
          </p>
        </div>
      </section>

      {/* Who this is for */}
      <section className="bg-navy/5 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center font-serif text-2xl font-semibold text-navy sm:text-3xl">
            Who This Is For
          </h2>
          <p className="mt-4 text-center text-navy/80">This is a fit if:</p>
          <ul className="mt-6 space-y-3">
            <CheckItem>
              You are a Catholic diocese or religious community with an
              active vocations director
            </CheckItem>
            <CheckItem>
              You have capacity to respond personally to new inquiries
            </CheckItem>
            <CheckItem>
              You want to use social media as a mission field, not a gimmick
            </CheckItem>
          </ul>
        </div>
      </section>

      {/* Next step */}
      <section className="border-t border-navy/10 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance font-serif text-2xl font-semibold text-navy sm:text-3xl">
            Let&rsquo;s Talk
          </h2>
          <p className="mt-3 text-pretty text-navy/70">
            If this sounds like it could serve your vocations work, the next
            step is a short conversation.
          </p>
          <div className="mt-8">
            <VocationsBookACallButton className="inline-block rounded-full bg-navy px-8 py-3.5 text-base font-medium text-offwhite transition-colors hover:bg-navy/90">
              Book 30-Min Vocations Strategy&nbsp;Call
            </VocationsBookACallButton>
          </div>
        </div>
      </section>
    </>
  );
}
