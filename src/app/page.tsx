import Link from "next/link";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import BookACallButton from "@/components/BookACallButton";
import TrustedByMarquee from "@/components/TrustedByMarquee";

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes flow-pulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.18); }
        }
        .flow-pulse {
          animation: flow-pulse 1.8s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-slow {
          animation: spin-slow 7s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .flow-pulse, .spin-slow {
            animation: none;
          }
        }
      `}</style>
      <Nav />

      <main className="flex flex-1 flex-col">
        <section
          id="home"
          className="mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-14 text-center sm:pb-32 sm:pt-20"
        >
          <span className="h-1 w-16 rounded-full bg-gold" />
          <h1 className="mt-8 font-serif text-4xl font-semibold leading-tight text-navy sm:text-5xl md:text-6xl">
            Do You Want More Young Families at Your Parish?
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-navy/70 sm:text-xl">
            Learn how we&rsquo;re helping Catholic churches get 30&ndash;50
            new people involved in parish life in just 90 days.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/free-guide"
              className="rounded-full bg-navy px-8 py-3.5 text-base font-medium text-offwhite transition-colors hover:bg-navy/90"
            >
              Get My Free Guide
            </Link>
            <BookACallButton className="rounded-full border border-navy px-8 py-3.5 text-base font-medium text-navy transition-colors hover:bg-navy/5">
              Book a Call
            </BookACallButton>
          </div>
          <Link
            href="/services#for-vocation-offices"
            className="mt-6 text-sm font-medium text-navy/60 underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-navy"
          >
            We also help vocation offices reach young men discerning a call →
          </Link>
        </section>

        {/* Trusted By */}
        <section className="px-6 pb-20 sm:pb-24">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-navy/50">
              Trusted By
            </p>
            <div className="mt-8">
              <TrustedByMarquee />
            </div>
          </div>
        </section>

        {/* How Our Parish Growth System Works */}
        <section className="px-6 pb-24 sm:pb-32">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-serif text-3xl font-semibold text-navy sm:text-4xl">
                  How Our Parish Growth System Works
                </h2>
                <p className="mt-4 text-lg text-navy/70">
                  We build a measurable communication system around
                  Facebook and Instagram to engage new people at your
                  parish.
                </p>
              </div>
            </Reveal>

            <Reveal delayMs={80}>
              <div className="relative mx-auto mt-12 h-64 w-64 sm:h-72 sm:w-72">
                <svg viewBox="0 0 200 200" className="h-full w-full">
                  <g transform="rotate(-90 100 100)">
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#1b2a4a"
                      strokeWidth="26"
                      strokeDasharray="152 350.66"
                      strokeDashoffset="-335.1"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#c9a227"
                      strokeWidth="26"
                      strokeDasharray="152 350.66"
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#8a6d2f"
                      strokeWidth="26"
                      strokeDasharray="152 350.66"
                      strokeDashoffset="-167.55"
                    />
                  </g>
                  <g>
                    <circle cx="30.7" cy="60" r="17" fill="white" />
                    <text
                      x="30.7"
                      y="61"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="18"
                    >
                      🎥
                    </text>
                  </g>
                  <g>
                    <circle cx="169.3" cy="60" r="17" fill="white" />
                    <text
                      x="169.3"
                      y="61"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="18"
                    >
                      🎯
                    </text>
                  </g>
                  <g>
                    <circle cx="100" cy="180" r="17" fill="white" />
                    <text
                      x="100"
                      y="181"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="18"
                    >
                      📊
                    </text>
                  </g>
                </svg>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span
                    className="spin-slow text-xl text-gold"
                    aria-hidden="true"
                  >
                    ↻
                  </span>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-navy/50">
                    Repeats
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">
                    Every Month
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mx-auto mt-10 grid max-w-4xl gap-8 sm:grid-cols-3">
              <Reveal delayMs={80}>
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center gap-2 sm:justify-start">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full bg-navy"
                      aria-hidden="true"
                    />
                    <h3 className="font-serif text-lg font-semibold text-navy">
                      1. Weekly Content
                    </h3>
                  </div>
                  <p className="mt-2 text-navy/70">
                    Weekly homily clips and parish-life posts on
                    Facebook and Instagram help people get to know,
                    like, and trust your parish, with no extra work
                    added to your staff&rsquo;s plate.
                  </p>
                </div>
              </Reveal>

              <Reveal delayMs={160}>
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center gap-2 sm:justify-start">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full bg-gold"
                      aria-hidden="true"
                    />
                    <h3 className="font-serif text-lg font-semibold text-navy">
                      2. Invitations
                    </h3>
                  </div>
                  <p className="mt-2 text-navy/70">
                    Targeted local campaigns invite people to a
                    specific next step, an event, a young adult night,
                    or simply a warm invitation to come back to Mass,
                    so they can raise their hand and say they&rsquo;re
                    interested.
                  </p>
                </div>
              </Reveal>

              <Reveal delayMs={240}>
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center gap-2 sm:justify-start">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: "#8a6d2f" }}
                      aria-hidden="true"
                    />
                    <h3 className="font-serif text-lg font-semibold text-navy">
                      3. Tracking &amp; Simple Reports
                    </h3>
                  </div>
                  <p className="mt-2 text-navy/70">
                    We track every response so you see real outcomes,
                    like how many new young adults expressed interest
                    in coming to Mass in the last 90 days, and use
                    that data to improve what comes next.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/services"
                className="inline-block text-sm font-medium text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-navy/80"
              >
                See how it works in detail →
              </Link>
            </div>
          </div>
        </section>

        {/* The Real Difference */}
        <section className="px-6 pb-24 sm:pb-32">
          <div className="mx-auto max-w-4xl rounded-2xl bg-navy/5 p-8 sm:p-12">
            <Reveal>
              <h2 className="mx-auto max-w-md text-balance text-center font-serif text-3xl font-semibold italic leading-tight text-navy sm:max-w-lg sm:text-4xl">
                &ldquo;We Already Have Someone for Social Media.&rdquo;
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-center text-lg text-navy/70">
                That&rsquo;s great. Most parishes do. But there&rsquo;s a
                difference between having someone who posts and having a
                system that reliably brings new people to Mass.
              </p>
            </Reveal>

            {/* Comparison: doing it alone vs. Parish Media Company */}
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <Reveal delayMs={80}>
                <div className="h-full rounded-2xl border border-rose-200/70 bg-rose-50/60 p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xl"
                      aria-hidden="true"
                    >
                      🤷
                    </span>
                    <h3 className="font-serif text-xl font-semibold text-navy">
                      A Volunteer or Staff Member
                    </h3>
                  </div>
                  <ul className="mt-5 space-y-3">
                    <li className="flex items-start gap-2.5 text-navy/80">
                      <span
                        className="mt-0.5 font-bold text-rose-500"
                        aria-hidden="true"
                      >
                        ✕
                      </span>
                      <span>Posting is one of many responsibilities</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-navy/80">
                      <span
                        className="mt-0.5 font-bold text-rose-500"
                        aria-hidden="true"
                      >
                        ✕
                      </span>
                      <span>
                        Success is &ldquo;we are active&rdquo; rather than
                        concrete outcomes
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5 text-navy/80">
                      <span
                        className="mt-0.5 font-bold text-rose-500"
                        aria-hidden="true"
                      >
                        ✕
                      </span>
                      <span>
                        Platforms are used, but not fully connected to
                        invitations, follow up, or data
                      </span>
                    </li>
                  </ul>
                </div>
              </Reveal>

              <Reveal delayMs={180}>
                <div className="h-full rounded-2xl border border-gold/40 bg-gold/5 p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xl"
                      aria-hidden="true"
                    >
                      🎯
                    </span>
                    <h3 className="font-serif text-xl font-semibold text-navy">
                      Parish Media Company
                    </h3>
                  </div>
                  <ul className="mt-5 space-y-3">
                    <li className="flex items-start gap-2.5 text-navy/80">
                      <span
                        className="mt-0.5 font-bold text-emerald-600"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      <span>
                        Clear goals: new Mass attendees, event sign ups,
                        volunteer inquiries
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5 text-navy/80">
                      <span
                        className="mt-0.5 font-bold text-emerald-600"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      <span>
                        Tracking from first click to first step into
                        parish life
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5 text-navy/80">
                      <span
                        className="mt-0.5 font-bold text-emerald-600"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      <span>
                        Lessons learned across 8 dioceses applied to your
                        specific context
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5 text-navy/80">
                      <span
                        className="mt-0.5 font-bold text-emerald-600"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      <span>Guaranteed results</span>
                    </li>
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal delayMs={120}>
              <p className="mx-auto mt-10 max-w-xl text-center text-navy/70">
                It&rsquo;s not their fault. Their job is to post, not to
                design campaigns, funnels, and tracking from first click
                to the pew. Meanwhile, young adults are spending hours a
                day on social media. If that channel isn&rsquo;t tracked,
                it quietly slides to the back burner while your
                parish keeps aging.
              </p>
            </Reveal>

            <Reveal delayMs={140}>
              <p className="mx-auto mt-6 max-w-xl text-center text-navy/70">
                So, our work is not just &ldquo;more posting.&rdquo; We
                build a measurable communication system around Facebook
                and Instagram so that you can say things like:
              </p>
            </Reveal>

            {/* The report you could send */}
            <Reveal delayMs={80}>
              <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-navy/10 bg-white p-6 text-center shadow-sm sm:p-8">
                <span className="text-2xl" aria-hidden="true">
                  📈
                </span>
                <p className="mt-3 font-serif text-lg italic text-navy">
                  &ldquo;We had 20 brand new young adults express interest
                  in coming to Mass in the last 90 days, and here is where
                  they came from.&rdquo;
                </p>
              </div>
            </Reveal>

            <Reveal delayMs={120}>
              <p className="mx-auto mt-8 max-w-xl text-center text-navy/70">
                And we back it with a simple promise:
              </p>
            </Reveal>

            {/* Our promise, bundled with the closing statement */}
            <Reveal delayMs={160}>
              <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-gold/40 bg-gold/5 p-8 text-center sm:p-10">
                <span
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-2xl"
                  aria-hidden="true"
                >
                  🤝
                </span>
                <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-gold">
                  Our Promise
                </p>
                <p className="mt-3 text-navy/80">
                  If we don&rsquo;t hit the agreed-upon goal in the first
                  90 days (for example, 20 new young adults who express
                  interest in coming to Mass), we keep working with you
                  at no additional fee until we do.
                </p>

                <div className="mx-auto mt-6 h-px w-16 bg-gold/30" />

                <p className="mt-6 font-serif text-xl font-semibold text-navy">
                  Your existing staff cannot reasonably make that claim.
                  We can, because this is all we do, for Catholic
                  parishes like yours.
                </p>
              </div>
            </Reveal>

            <div className="mt-8 text-center">
              <Link
                href="/services"
                className="inline-block text-sm font-medium text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-navy/80"
              >
                See how we track it →
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-navy px-6 py-20 text-center sm:py-24">
          <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
          <h2 className="mx-auto mt-8 max-w-2xl font-serif text-3xl font-semibold text-offwhite sm:text-4xl">
            Ready to Get More Young Adults at Your Parish?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-offwhite/70">
            Grab your free guide now, or book a free consultation.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/free-guide"
              className="inline-block rounded-full bg-offwhite px-8 py-3.5 text-base font-medium text-navy transition-colors hover:bg-offwhite/90"
            >
              Get My Free Guide
            </Link>
            <BookACallButton className="inline-block rounded-full border border-offwhite/40 px-8 py-3.5 text-base font-medium text-offwhite transition-colors hover:bg-offwhite/10">
              Book a Free Consultation
            </BookACallButton>
          </div>
        </section>
      </main>
    </>
  );
}
