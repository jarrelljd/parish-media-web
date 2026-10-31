import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  Check,
  Megaphone,
  RefreshCw,
  Target,
  TrendingUp,
  UserRound,
  Video,
  X,
} from "lucide-react";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import BookACallButton from "@/components/BookACallButton";
import TrustedByMarquee from "@/components/TrustedByMarquee";
import { buttonArrow, buttonClass } from "@/components/buttonStyles";
import youngAdultsPhoto from "../../public/images/parish-growth/young-adults-with-priest.png";
import frDavePhoto from "../../public/images/clients/fr-dave-aufiero-headshot.png";

// Arched "church window" photo frame (outer mat + inner photo).
const archOuter = "[border-radius:50%_50%_2.25rem_2.25rem/40%_40%_2.25rem_2.25rem]";
const archInner = "[border-radius:50%_50%_1.75rem_1.75rem/40%_40%_1.75rem_1.75rem]";

const eyebrow = "text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep";
const h2 = "font-serif text-4xl font-medium leading-[1.1] tracking-tight text-balance text-navy sm:text-5xl";

const steps = [
  {
    icon: Video,
    title: "Weekly Content",
    body: "Weekly homily clips and parish-life posts on Facebook and Instagram help people get to know, like, and trust your parish, with no extra work for your staff.",
  },
  {
    icon: Megaphone,
    title: "Invitations",
    body: "Targeted local campaigns invite people to a specific next step, like an event, a young adult night, or a warm invitation back to Mass, so they can raise their hand.",
  },
  {
    icon: BarChart3,
    title: "Tracking & Simple Reports",
    body: "We track every response so you see real outcomes, like how many new young adults expressed interest in Mass in the last 90 days, and use that to improve what comes next.",
  },
];

const alone = [
  "Posting is one of many responsibilities",
  "Success is “we are active” rather than concrete outcomes",
  "Platforms are used, but not connected to invitations, follow up, or data",
];

const withUs = [
  "Clear goals: new Mass attendees, event sign ups, volunteer inquiries",
  "Tracking from first click to first step into parish life",
  "Lessons learned across 8 dioceses applied to your parish",
];

export default function Home() {
  return (
    <>
      <Nav />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section id="home" className="relative overflow-hidden px-6 pb-20 pt-12 sm:pt-16 lg:pb-28 lg:pt-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-48 -top-48 -z-10 h-[36rem] w-[36rem] rounded-full bg-parchment blur-3xl"
          />

          <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
            <div className="text-center lg:text-left">
              <p className={eyebrow}>For Catholic Parishes</p>
              <h1 className="mt-5 font-serif text-5xl font-medium leading-[1.05] tracking-tight text-balance text-navy sm:text-6xl lg:text-[4rem]">
                Do You Want More Young Families at Your Parish?
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-navy/70 sm:text-xl lg:mx-0">
                Learn how we&rsquo;re helping Catholic churches get 30&ndash;50
                new people involved in parish life in just 90&nbsp;days.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="/free-guide" className={buttonClass("primary", "w-full sm:w-auto")}>
                  Get the Free Guide
                  <ArrowRight className={buttonArrow} aria-hidden="true" />
                </Link>
                <BookACallButton className={buttonClass("ghost", "w-full sm:w-auto")}>
                  Book a Call
                </BookACallButton>
              </div>
              <Link
                href="/services#for-vocation-offices"
                className="mt-7 inline-block text-balance text-sm font-medium text-navy/60 underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-navy"
              >
                We also help vocation offices reach young men discerning a&nbsp;call&nbsp;→
              </Link>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className={`${archOuter} bg-white p-3 shadow-2xl shadow-navy/10 ring-1 ring-navy/5`}>
                <div className={`${archInner} relative aspect-square overflow-hidden bg-linen`}>
                  <Image
                    src={youngAdultsPhoto}
                    alt="Fr. Nicholas Fleming taking a selfie with a large group of young adults in the church at Ss. John and James Catholic Parish, West Warwick, RI"
                    fill
                    priority
                    placeholder="blur"
                    sizes="(min-width: 1024px) 520px, 448px"
                    className="object-cover object-[35%_50%]"
                  />
                </div>
              </div>

              <div className="relative mx-auto -mt-8 flex w-fit items-center gap-3 rounded-2xl bg-white/95 p-3 pr-5 shadow-xl shadow-navy/10 ring-1 ring-navy/5 backdrop-blur sm:absolute sm:-right-6 sm:bottom-8 sm:mt-0">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-parchment text-gold-deep">
                  <TrendingUp className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-left leading-tight">
                  <span className="block font-serif text-lg font-medium text-navy">
                    0 &rarr; 320 Instagram followers
                  </span>
                  <span className="block text-xs text-navy/60">
                    in 30 days &middot; Ss. John &amp; James, RI
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By */}
        <section className="px-6 pb-20 sm:pb-24">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-navy/50">
              Trusted By
            </p>
            <div className="mt-8">
              <TrustedByMarquee />
            </div>
          </div>
        </section>

        {/* How Our Parish Growth System Works */}
        <section className="bg-parchment px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className={eyebrow}>How It Works</p>
                <h2 className={`mt-4 ${h2}`}>How Our Parish Growth System&nbsp;Works</h2>
                <p className="mt-5 text-pretty text-lg leading-relaxed text-navy/70">
                  We build a measurable communication system around Facebook
                  and Instagram to engage new people at your&nbsp;parish.
                </p>
              </div>
            </Reveal>

            <ol className="mt-14 grid gap-5 md:grid-cols-3">
              {steps.map((step, i) => (
                <Reveal key={step.title} delayMs={80 * (i + 1)} className="h-full">
                  <li className="h-full rounded-3xl bg-offwhite p-7 ring-1 ring-navy/5 sm:p-8">
                    <div className="flex items-center justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-parchment text-navy">
                        <step.icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <span className="font-serif text-3xl font-medium text-gold-deep/40">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="mt-6 font-serif text-2xl font-medium tracking-tight text-navy">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-pretty leading-relaxed text-navy/70">{step.body}</p>
                  </li>
                </Reveal>
              ))}
            </ol>

            <Reveal delayMs={120}>
              <div className="mt-10 flex flex-col items-center justify-center gap-x-8 gap-y-4 sm:flex-row">
                <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-navy/60">
                  <RefreshCw className="h-4 w-4 text-gold-deep" aria-hidden="true" />
                  Repeats every month
                </p>
                <Link
                  href="/services"
                  className="text-sm font-medium text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-navy/80"
                >
                  See how it works in detail →
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* "We already have someone for social media" */}
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className={eyebrow}>The Difference</p>
                <h2 className={`mt-4 ${h2} italic`}>
                  &ldquo;We Already Have Someone for Social&nbsp;Media.&rdquo;
                </h2>
                <p className="mt-6 text-pretty text-lg leading-relaxed text-navy/70">
                  That&rsquo;s great. Most parishes do. But there&rsquo;s a
                  difference between having someone who posts and having a
                  system that reliably brings new people to&nbsp;Mass.
                </p>
              </div>
            </Reveal>

            <div className="mt-14 grid gap-5 md:grid-cols-2">
              <Reveal delayMs={80} className="h-full">
                <div className="h-full rounded-3xl bg-white/50 p-7 ring-1 ring-navy/10 sm:p-9">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-navy/5 text-navy/50">
                      <UserRound className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <h3 className="font-serif text-xl font-medium tracking-tight text-navy/80">
                      A Volunteer or Staff&nbsp;Member
                    </h3>
                  </div>
                  <ul className="mt-6 space-y-4">
                    {alone.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-navy/70">
                        <X className="mt-1 h-4 w-4 shrink-0 text-navy/35" strokeWidth={2.5} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delayMs={160} className="h-full">
                <div className="h-full rounded-3xl bg-white p-7 shadow-xl shadow-navy/5 ring-1 ring-gold/40 sm:p-9">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold-deep">
                      <Target className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <h3 className="font-serif text-xl font-medium tracking-tight text-navy">
                      Parish Media Company
                    </h3>
                  </div>
                  <ul className="mt-6 space-y-4">
                    {withUs.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-navy/85">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-gold-deep" strokeWidth={2.5} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal delayMs={120}>
              <p className="mx-auto mt-12 max-w-2xl text-pretty text-center text-lg leading-relaxed text-navy/70">
                It&rsquo;s not their fault. Their job is to post, not to build
                campaigns and tracking from first click to the pew. Our work
                isn&rsquo;t &ldquo;more posting.&rdquo; It&rsquo;s a system that
                lets you say something&nbsp;like:
              </p>
            </Reveal>

            <Reveal delayMs={80}>
              <figure className="mx-auto mt-10 max-w-2xl border-l-2 border-gold pl-6 sm:pl-8">
                <blockquote className="font-serif text-2xl font-normal italic leading-snug text-navy sm:text-[1.7rem]">
                  &ldquo;We had 20 brand new young adults express interest in
                  coming to Mass in the last 90 days, and here is where they
                  came&nbsp;from.&rdquo;
                </blockquote>
              </figure>
            </Reveal>

            <div className="mt-10 text-center">
              <Link
                href="/services"
                className="text-sm font-medium text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-navy/80"
              >
                See how we track it →
              </Link>
            </div>
          </div>
        </section>

        {/* Proof: a named pastor and a real number */}
        <section className="overflow-hidden bg-parchment px-6 py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            <Reveal className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md">
              <div className={`${archOuter} bg-offwhite p-3 shadow-2xl shadow-navy/10 ring-1 ring-navy/5`}>
                <div className={`${archInner} relative aspect-[4/5] overflow-hidden bg-white`}>
                  <Image
                    src={frDavePhoto}
                    alt="Fr. Dave Aufiero, Pastor of St. Patrick’s Catholic Church in South Hadley, MA"
                    fill
                    sizes="(min-width: 1024px) 448px, 384px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </Reveal>

            <div className="text-center lg:text-left">
              <Reveal>
                <p className={eyebrow}>Results</p>
                <p className="mt-4 font-serif text-7xl font-medium tracking-tight text-navy sm:text-8xl">
                  65
                </p>
                <h2 className="mt-2 font-serif text-3xl font-medium leading-tight tracking-tight text-balance text-navy sm:text-4xl">
                  Young adults asked about young adult events in 60&nbsp;days
                </h2>
              </Reveal>
              <Reveal delayMs={100}>
                <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-navy/70 lg:mx-0">
                  St. Patrick&rsquo;s had a struggling Facebook page and no
                  young adult ministry. We ran targeted ads for monthly young
                  adult events while posting on the parish&rsquo;s socials.
                  After a few events, the parish had a full young
                  adult&nbsp;ministry.
                </p>
              </Reveal>
              <Reveal delayMs={150}>
                <p className="mt-8 font-serif text-2xl font-medium italic text-navy">
                  Fr. Dave Aufiero
                </p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-gold-deep">
                  Pastor, St. Patrick&rsquo;s, South Hadley, MA
                </p>
              </Reveal>
              <Reveal delayMs={200} className="mt-8">
                <Link href="/results" className={buttonClass("ghost")}>
                  See more results
                  <ArrowRight className={buttonArrow} aria-hidden="true" />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-navy px-6 py-20 text-center sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Get Started
          </p>
          <h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl font-medium leading-[1.1] tracking-tight text-balance text-offwhite sm:text-5xl">
            Ready to Get More Young Adults at Your&nbsp;Parish?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-offwhite/70">
            Get the free guide, or book a free&nbsp;consultation.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/free-guide" className={buttonClass("light", "w-full sm:w-auto")}>
              Get the Free Guide
              <ArrowRight className={buttonArrow} aria-hidden="true" />
            </Link>
            <BookACallButton className={buttonClass("ghostLight", "w-full sm:w-auto")}>
              Book a Call
            </BookACallButton>
          </div>
        </section>
      </main>
    </>
  );
}
