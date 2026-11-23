import Image from "next/image";
import CalendlyEmbed from "./CalendlyEmbed";
import ScrollToBookingButton from "./ScrollToBookingButton";
import TitheRoadmap, { type RoadStep } from "./TitheRoadmap";
import {
  FilmAndBuildVisual,
  GivingAdVisual,
  GoalThermometerVisual,
  ThankYouVideoVisual,
} from "./GivingMockups";
import RecurringGivingChart from "./RecurringGivingChart";
import WaxSeal from "./WaxSeal";
import { GROWTH_REVIEW_CALENDLY_URL } from "@/data/booking";
import { PRIEST_TESTIMONIALS } from "@/data/priestTestimonials";
import reportOnLaptop from "../../public/images/proof/report-on-laptop.png";

// The Parish $10K Monthly Giving Campaign landing page (/monthly-giving).
// Built on the same layout and pieces as /parish, but sold as a funding
// campaign, not a social media service. Same brand palette, different
// balance: deep lapis (navy) bands and gold feature cards, where /parish
// uses ink bands and lapis cards.

const CALENDLY_URL = GROWTH_REVIEW_CALENDLY_URL;

// Pill buttons: navy on light sections, gold on dark ones (same as /parish).
const BUTTON_BASE =
  "inline-flex items-center justify-center rounded-full px-10 py-4 text-base font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0";
const BUTTON = `${BUTTON_BASE} bg-lapis text-vellum shadow-lapis/30 hover:bg-lapis-deep`;
const BUTTON_GOLD = `${BUTTON_BASE} bg-gilt-light text-ink shadow-black/40 hover:bg-[#e0bf75]`;
const BUTTON_LABEL = (
  <>
    <span className="sm:hidden">Book a Free Demo</span>
    <span className="hidden sm:inline">Book a Free Demo for Your Parish</span>
  </>
);
const h2 = "font-serif text-4xl font-medium leading-[1.08] text-balance sm:text-5xl";

// What steady, recurring income does for a parish.
const RECURRING_BENEFITS: [string, string][] = [
  ["Budget with confidence", "Know what’s coming in before the month starts."],
  ["Say yes to the next thing", "The roof repair, the youth minister, the new ministry."],
  ["Steady in every season", "Recurring gifts arrive in July just like at Christmas."],
];

// The TITHE Framework, one milestone per letter on the roadmap.
const STEPS: RoadStep[] = [
  {
    letter: "T",
    title: "Tell the story",
    body: "We fly in and film your pastor and parish, then build a polished video, clean ads, and a giving page where monthly giving takes a few taps.",
    visual: <FilmAndBuildVisual />,
  },
  {
    letter: "I",
    title: "Invite",
    body: "Targeted Facebook and Instagram ads invite local families to give monthly.",
    visual: <GivingAdVisual />,
  },
  {
    letter: "T",
    title: "Track",
    body: "Pixel tracking on every visit and gift shows exactly which ads bring in donors.",
    visual: (
      <Image
        src={reportOnLaptop}
        alt="Ad results dashboard on a laptop showing every response tracked"
        sizes="(min-width: 640px) 420px, 80vw"
        className="mx-auto h-56 w-auto max-w-full object-contain drop-shadow-xl sm:h-72"
      />
    ),
  },
  {
    letter: "H",
    title: "Hit the goal",
    body: "We refresh ads before they go stale, and a goal thermometer shows parishioners how many families have joined, inspiring others to join too.",
    visual: <GoalThermometerVisual />,
  },
  {
    letter: "E",
    title: "Express thanks",
    body: "Every new monthly donor receives a personal video thank-you from their pastor.",
    visual: <ThankYouVideoVisual />,
  },
];

const FAQS = [
  {
    question: "How much does it cost?",
    answer:
      "$10,000 for the campaign, plus your ad budget and travel for the filming trip. Ad spend is always paid by the parish. We’ll recommend a budget on the call, so you know the full investment up front.",
  },
  {
    question: "We already have online giving. How is this different?",
    answer:
      "Most parish giving pages are buried on the website, and no one is ever sent to them. We send the right people to a clean page with a simple form, so they actually give.",
  },
  {
    question: "How much of the pastor’s time does this take?",
    answer:
      "Mainly the filming visit, plus approving the message before launch. We handle everything else.",
  },
];

export default function MonthlyGivingContent() {
  return (
    <>
      {/* Hero: the goal card sits on the seam between the navy band and the
          light page, like the video on /parish. */}
      <section className="pb-14 sm:pb-16">
        <div className="bg-lapis-deep px-6 pt-14 sm:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-balance font-serif text-[2.6rem] font-medium leading-[1.06] text-vellum motion-safe:animate-fade-up sm:text-6xl">
              Add $10,000 in Monthly, <span className="text-gilt-light">Recurring</span>&nbsp;Giving to Your Catholic Parish in 90&nbsp;Days
            </h1>
            <p
              className="mx-auto mt-5 max-w-2xl text-balance text-lg text-vellum/80 motion-safe:animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              We turn parish families and supporters into recurring monthly&nbsp;donors.
            </p>
          </div>
        </div>
        <div className="bg-linear-to-b from-lapis-deep from-60% to-transparent to-60% px-6 pt-10">
          <div className="mx-auto grid max-w-5xl items-center gap-6 rounded-3xl bg-ink px-8 py-10 text-vellum shadow-2xl shadow-ink/40 ring-1 ring-gilt-light/30 sm:px-12 md:grid-cols-[auto_1fr] md:gap-12 md:py-12">
            <p className="text-center font-serif text-8xl font-medium leading-none text-gilt-light sm:text-9xl md:text-left">
              $10K
            </p>
            <div className="text-center md:text-left">
              <p className="text-balance font-serif text-3xl font-medium leading-tight sm:text-4xl">
                in monthly, recurring giving within 90&nbsp;days
              </p>
              <p className="mt-4 inline-block rounded-full bg-gilt-light px-4 py-1.5 text-base font-semibold text-ink">
                Recurring every month: $120,000 a year
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-3xl px-6 text-center md:mt-14">
          <ScrollToBookingButton className={BUTTON}>{BUTTON_LABEL}</ScrollToBookingButton>
        </div>
      </section>

      {/* Why recurring giving matters: steady monthly income */}
      <section className="bg-parchment px-6 py-20 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className={h2}>Steady, recurring income changes what your parish can&nbsp;do</h2>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-ink/70">
              The Sunday collection rises and falls with the weather and the
              holidays. Recurring gifts arrive every&nbsp;month.
            </p>
          </div>

          <div className="mt-14 grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <RecurringGivingChart />
            {/* Roman numerals instead of check icons: reads like a missal. */}
            <ul className="space-y-8">
              {RECURRING_BENEFITS.map(([title, body], i) => (
                <li key={title} className="flex items-baseline gap-5">
                  <span className="w-10 shrink-0 text-right font-serif text-3xl font-medium leading-none text-gilt" aria-hidden="true">
                    {["I", "II", "III"][i]}
                  </span>
                  <span>
                    <span className="block font-serif text-2xl font-semibold text-ink">{title}</span>
                    <span className="mt-1 block text-pretty text-lg leading-relaxed text-ink/70">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The TITHE Framework: five milestones on a winding roadmap */}
      <TitheRoadmap
        heading={<>Our 5-step T.I.T.H.E.&nbsp;Framework</>}
        subheading={<>Top-tier digital marketing, the kind parishes rarely have, built around your&nbsp;pastor.</>}
        steps={STEPS}
      />

      {/* What other priests are saying */}
      <section className="bg-lapis-deep px-6 py-16 text-vellum sm:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className={h2}>What other priests are&nbsp;saying</h2>
          <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8">
            {PRIEST_TESTIMONIALS.map((t) => (
              <div key={t.name}>
                <div className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-[1.6rem] border-[6px] border-black/60 bg-black shadow-2xl shadow-black/50 ring-1 ring-vellum/15">
                  <iframe
                    src={`https://player.vimeo.com/video/${t.videoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                    className="absolute inset-0 h-full w-full"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    title={`${t.name} testimonial for Parish Media Company`}
                  />
                </div>
                <p className="mt-5 font-serif text-xl font-semibold">{t.name}</p>
                <p className="mx-auto mt-1 max-w-[280px] text-pretty text-sm text-vellum/60">{t.role}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <ScrollToBookingButton className={BUTTON_GOLD}>{BUTTON_LABEL}</ScrollToBookingButton>
          </div>
        </div>
      </section>

      {/* The 90-day promise, sealed, leading straight into the calendar */}
      <section className="px-6 pt-20 sm:pt-28">
        <div className="relative mx-auto max-w-3xl">
          <WaxSeal className="absolute -right-3 -top-8 z-10 h-24 w-24 rotate-12 sm:-right-8 sm:-top-10 sm:h-32 sm:w-32" />
          <div className="rounded-[2rem] bg-linear-to-br from-gilt-light via-[#cfa752] to-gilt px-7 py-12 text-center text-ink shadow-2xl shadow-gilt/40 ring-1 ring-ink/10 sm:px-14 sm:py-16">
            <p className="font-semibold text-ink/70">Our 90-day promise</p>
            <h2 className="mt-4 text-balance font-serif text-4xl font-medium leading-[1.08] sm:text-[3.4rem]">
              $10,000 a month in recurring giving, or we keep going at no extra management&nbsp;fee
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-ink/70">
              Provided your parish gives us account access, timely approvals,
              your donor list, pastor participation, and the agreed ad&nbsp;budget.
            </p>
          </div>
        </div>
      </section>

      {/* Before you book + Calendly */}
      <section id="book" className="scroll-mt-20 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={h2}>Book your free&nbsp;demo</h2>
          <p className="mt-5 text-pretty text-lg text-ink/75">
            <strong className="font-semibold text-ink">We ask that the pastor join the call.</strong>{" "}
            Staff are welcome to book if they can bring him&nbsp;along.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          {/* No trackScheduleEvent here: Calendly redirects to
              /call-confirmed after booking, which fires Schedule. */}
          <CalendlyEmbed url={CALENDLY_URL} />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-parchment px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className={`text-center ${h2}`}>Questions</h2>
          <div className="mt-10 border-t-2 border-ink">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group border-b border-ink/15">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 text-left font-serif text-xl font-medium [&::-webkit-details-marker]:hidden">
                  <span className="text-pretty">{faq.question}</span>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center text-gilt transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} className="h-4 w-4">
                      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="pb-7 text-pretty text-ink/75">{faq.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-12 text-center">
            <ScrollToBookingButton className={BUTTON}>{BUTTON_LABEL}</ScrollToBookingButton>
          </div>
        </div>
      </section>
    </>
  );
}
