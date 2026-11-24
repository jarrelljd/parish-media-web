import type { ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import { ArrowRight, Check, Heart, MessageCircle, ThumbsUp, X } from "lucide-react";
import CalendlyEmbed from "./CalendlyEmbed";
import ScrollToBookingButton from "./ScrollToBookingButton";
import { GROWTH_REVIEW_CALENDLY_URL } from "@/data/booking";
import { planYourVisitProof, proofFacts } from "@/data/method";
import { PRIEST_TESTIMONIALS } from "@/data/priestTestimonials";
import TitheRoadmap, { type RoadStep } from "./TitheRoadmap";
import {
  FilmAndBuildVisual,
  GivingAdVisual,
  GoalThermometerVisual,
  ThankYouVideoVisual,
} from "./GivingMockups";
import reportOnLaptop from "../../public/images/proof/report-on-laptop.png";
import igPhoneScreen from "../../public/images/proof/ig-phone-screen.jpg";
import fbAdScreen from "../../public/images/proof/fb-ad-screen.jpg";
import givingForm from "../../public/images/proof/st-joseph-giving-form.jpg";
import { FacebookLogo, InstagramLogo } from "./SocialIcons";

// The Parish Growth and Giving landing page (/parish). One offer: weekly
// content that builds trust, then ads that invite local families to visit,
// get involved, and give monthly. /monthly-giving redirects here.

const CALENDLY_URL = GROWTH_REVIEW_CALENDLY_URL;

const FAQS = [
  {
    question: "How much does it cost?",
    answer: [
      "It depends on your parish’s goals, size, and the level of support you need. We’ll walk through the plans on the call and give you a clear investment before anything moves forward. Ad spend is always paid by the parish.",
    ],
  },
  {
    question: "We already have online giving. How is this different?",
    answer: [
      "Most parish giving pages are buried on the website, and no one is ever sent to them. We send the right people to a clean page with a simple form, so they actually give.",
    ],
  },
  {
    question: "We’re already too busy. How would we manage this?",
    answer: [
      "You shouldn’t have to manage it. We handle the strategy, filming, editing, ads, and reporting. Your pastor’s main commitment is the filming visit and approving the message before launch.",
      "Your staff help us know about parish events and respond when interested people raise their hands.",
    ],
  },
  {
    question:
      "We have other priorities right now. Why should this be one of them?",
    answer: [
      "This isn’t another project for your staff to run. It’s a system that helps more people discover what your parish already offers and take a clear next step, from planning a visit to giving monthly.",
      "If reaching young families and steadying your budget are priorities, this gives your parish a practical way to do both.",
    ],
  },
];

// The TITHE Framework, one milestone per letter on the roadmap. Covers the
// whole system: weekly content (Tell), ads (Invite), and the giving campaign.
const STEPS: RoadStep[] = [
  {
    letter: "T",
    title: "Tell the story",
    body: "We fly in and film your pastor and parish. Then every week we post homily clips and parish life, so local families get to know, like, and trust your parish.",
    // B-roll: Joe filming with the Bishop of Reno.
    visual: <FilmAndBuildVisual videoSrc="/videos/bishop-reno-broll.mp4" poster="/videos/bishop-reno-broll.jpg" />,
  },
  {
    letter: "I",
    title: "Invite",
    body: "Targeted Facebook and Instagram ads invite local families to plan a visit, come to events, and give monthly on a clean page that’s easy to use on a phone.",
    visual: <GivingAdVisual />,
  },
  {
    letter: "T",
    title: "Track",
    body: "Pixel tracking on every visit, sign-up, and gift shows exactly which ads bring people in.",
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
    body: "We refresh ads before they go stale, and a goal thermometer shows parishioners how many families have joined, inspiring others to join too.",
    visual: <GoalThermometerVisual />,
  },
  {
    letter: "E",
    title: "Express thanks",
    body: "Every new monthly donor gets a personal thank-you video from their pastor, sent by text.",
    visual: <ThankYouVideoVisual />,
  },
];

// Us vs. a staff member. Our side is [before, bold, after] so the key words
// stand out, like the comparison cards it's modeled on.
const VERSUS: [[string, string, string], string][] = [
  [["Every post is made to ", "nurture your parishioners", ""], "Things get posted because someone asked, with no strategy"],
  [["", "Helpful videos from your pastor", ", like homily clips"], "No time or editing help, so videos rarely get made"],
  [["A ", "proven strategy", " from a Catholic creator, tested in 12+ dioceses"], "No real plan, and no social media training"],
  [["", "No potential wasted:", " ads reach every local family, backed by steady posts"], "Huge potential missed, while everyone nearby is on their phones"],
  [["A ", "clean giving page", " anyone can join from their phone"], "Online giving buried on the website, where no one is sent"],
];

// Nurture, then ask: the whole system as three real phone screens, the
// path a local family takes from following the parish to giving monthly.
const SYSTEM: {
  title: string;
  body: string;
  who: string;
  image: StaticImageData;
  alt: string;
}[] = [
  {
    title: "Nurture",
    body: "Weekly homily clips and parish posts, so local families get to know, like, and trust your parish.",
    who: "St. Joseph, Los Banos, CA",
    image: igPhoneScreen,
    alt: "St. Joseph Catholic Parish Instagram profile with 941 followers and a grid of homily clips and parish photos",
  },
  {
    title: "Ask",
    body: "Targeted Facebook and Instagram ads invite them to plan a visit, come to an event, or get involved.",
    who: "St. Patrick’s, South Hadley, MA",
    image: fbAdScreen,
    alt: "Facebook ad inviting St. Patrick parishioners and friends to the annual parish picnic",
  },
  {
    title: "Give monthly",
    body: "One of those asks is monthly giving, on a clean page anyone can join from their phone.",
    who: "St. Joseph, Los Banos, CA",
    image: givingForm,
    alt: "St. Joseph monthly giving page with gift amounts and a short sign-up form",
  },
];

// Pill buttons: navy on light sections, gold on dark ones. Same shape
// everywhere so visitors learn what a button looks like.
const BUTTON_BASE =
  "inline-flex items-center justify-center rounded-full px-10 py-4 text-base font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0";
const BUTTON = `${BUTTON_BASE} bg-lapis text-vellum shadow-lapis/30 hover:bg-lapis-deep`;
const BUTTON_GOLD = `${BUTTON_BASE} bg-gilt-light text-ink shadow-black/40 hover:bg-[#e0bf75]`;
// Shorter label on phones so the button stays on one line
const BUTTON_LABEL = (
  <>
    <span className="sm:hidden">Book Your Free Review</span>
    <span className="hidden sm:inline">Book Your Free 30-Min Parish Growth Review</span>
  </>
);
const h2 = "font-serif text-4xl font-medium leading-[1.08] text-balance sm:text-5xl";

// A platform logo that floats and pulses while reactions pop up off it.
function PlatformEmblem({
  color,
  shape,
  delay,
  reactions,
  children,
}: {
  color: string;
  shape: string;
  delay: string;
  reactions: [ReactNode, ReactNode];
  children: ReactNode;
}) {
  const chip =
    "absolute flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg shadow-black/40 motion-safe:animate-emblem-react";
  return (
    <div className="relative motion-safe:animate-emblem-float" style={{ animationDelay: delay }}>
      <span className={`absolute inset-0 opacity-50 blur-2xl ${shape}`} style={{ backgroundColor: color }} />
      <span
        className={`absolute inset-0 border-2 opacity-0 motion-safe:animate-emblem-halo ${shape}`}
        style={{ borderColor: color, animationDelay: delay }}
      />
      <div className="relative">{children}</div>
      <span className={`${chip} -right-3 -top-2`}>{reactions[0]}</span>
      <span className={`${chip} -left-3 top-1`} style={{ animationDelay: "2.5s" }}>{reactions[1]}</span>
    </div>
  );
}

export default function ParishGrowthContent() {
  return (
    <>
      {/* Hero: the video sits on the seam between the dark band and the
          light page. */}
      <section className="pb-14 sm:pb-16">
        <div className="bg-ink px-6 pt-14 sm:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-balance font-serif text-[2.2rem] font-medium leading-[1.08] text-vellum motion-safe:animate-fade-up sm:text-6xl">
              Reach More Young Families and Grow Monthly Giving at Your Catholic&nbsp;Parish
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-balance text-lg text-vellum/80 motion-safe:animate-fade-up" style={{ animationDelay: "240ms" }}>
              Weekly content that builds trust, then Facebook and Instagram
              ads that invite local families to visit, get involved, and
              give&nbsp;monthly.
            </p>
          </div>
        </div>
        <div className="relative bg-linear-to-b from-ink from-65% to-transparent to-65% px-6 pt-10">
          {/* Platform logos centered in the dark space on either side of the
              video (wide screens only). */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 bottom-[35%] hidden lg:block">
            <div className="mx-auto grid h-full max-w-7xl grid-cols-[1fr_48rem_1fr] items-center justify-items-center">
              <PlatformEmblem
                color="#0866ff"
                shape="rounded-full"
                delay="0s"
                reactions={[
                  <ThumbsUp key="like" className="h-5 w-5 fill-[#0866ff] text-[#0866ff]" />,
                  <Heart key="love" className="h-5 w-5 fill-[#f33e58] text-[#f33e58]" />,
                ]}
              >
                <FacebookLogo className="h-20 w-20 xl:h-28 xl:w-28" />
              </PlatformEmblem>
              <span />
              <PlatformEmblem
                color="#d6249f"
                shape="rounded-[25%]"
                delay="-2.5s"
                reactions={[
                  <Heart key="love" className="h-5 w-5 fill-[#ff3040] text-[#ff3040]" />,
                  <MessageCircle key="comment" className="h-5 w-5 fill-[#d6249f] text-[#d6249f]" />,
                ]}
              >
                <InstagramLogo className="h-20 w-20 xl:h-28 xl:w-28" />
              </PlatformEmblem>
            </div>
          </div>
          <div className="relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-2xl bg-ink shadow-2xl shadow-ink/30 ring-1 ring-vellum/10">
            <iframe
              src="https://player.vimeo.com/video/1233188537?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Parish Media VSL 1"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>

        {/* Real results, right under the video: one featured result, then
            a slim row of supporting results */}
        <div className="mx-auto mt-12 max-w-5xl px-6 md:mt-16">
          <div className="grid items-center gap-6 rounded-3xl bg-linear-to-br from-lapis to-lapis-deep px-8 py-10 text-vellum shadow-2xl shadow-lapis/30 ring-1 ring-white/5 sm:px-12 md:grid-cols-[auto_1fr] md:gap-12 md:py-12">
            <p className="text-center font-serif text-8xl font-medium leading-none text-gilt-light sm:text-9xl md:text-left">
              {planYourVisitProof.stat}
            </p>
            <div className="text-center md:text-left">
              <p className="text-balance font-serif text-3xl font-medium leading-tight sm:text-4xl">
                {planYourVisitProof.label}
              </p>
              <p className="mt-4 inline-block rounded-full bg-gilt-light px-4 py-1.5 text-base font-semibold text-ink">
                {`On only ${planYourVisitProof.spend} in ad spend`}
              </p>
              <p className="mt-5 text-pretty text-base text-vellum/65">
                {planYourVisitProof.who}
              </p>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {proofFacts.map((f) => (
              <div key={f.who} className="rounded-2xl bg-white px-6 py-8 text-center shadow-lg shadow-ink/5 ring-1 ring-ink/5">
                <dt className="sr-only">{f.who}</dt>
                <dd>
                  <span className="block font-serif text-5xl font-medium text-lapis">{f.stat}</span>
                  <span className="mx-auto mt-3 block max-w-[15rem] text-balance text-ink/80">{f.label}</span>
                  <span className="mx-auto mt-3 block max-w-[15rem] text-balance text-sm text-ink/50">{f.who}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto mt-12 max-w-3xl px-6 text-center md:mt-14">
          <ScrollToBookingButton className={BUTTON}>{BUTTON_LABEL}</ScrollToBookingButton>
        </div>
      </section>

      {/* What other priests are saying */}
      <section className="bg-ink px-6 py-16 text-vellum sm:py-24">
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

      {/* The difference: us vs. a staff member, then what staff do instead */}
      <section className="bg-vellum-deep px-6 py-20 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className={h2}>&ldquo;But we already have someone posting on our social&nbsp;media.&rdquo;</h2>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-ink/70">
              We don&rsquo;t doubt it. But they&rsquo;re posting as an extra
              admin task, with no targeted ads and no real strategy to bring
              new young families&nbsp;in.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl items-center md:grid-cols-2">
            {/* Us: raised white card */}
            <div className="relative z-10 rounded-3xl bg-white px-7 py-9 shadow-2xl shadow-ink/15 ring-1 ring-ink/5 sm:px-10">
              <p className="text-balance text-center font-serif text-3xl font-semibold text-lapis md:min-h-[4.5rem]">We run the whole system</p>
              <ul className="mt-6 border-t border-ink/15">
                {VERSUS.map(([us]) => (
                  <li key={us.join("")} className="flex items-center gap-3 border-b border-ink/10 py-4 text-lg leading-snug last:border-b-0 md:min-h-24">
                    <Check className="h-5 w-5 shrink-0 text-emerald-600" strokeWidth={3} aria-hidden="true" />
                    <span>
                      {us[0]}
                      <strong className="font-semibold text-ink">{us[1]}</strong>
                      {us[2]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Staff member: flatter card tucked behind */}
            <div className="-mt-4 rounded-b-3xl bg-vellum/70 px-7 pb-9 pt-12 ring-1 ring-ink/5 md:-ml-4 md:mt-0 md:rounded-3xl md:py-9 md:pl-12 md:pr-8">
              <p className="text-balance text-center font-serif text-3xl font-medium text-ink/65 md:min-h-[4.5rem]">A staff member runs it on the side</p>
              <ul className="mt-6 border-t border-ink/10">
                {VERSUS.map(([, them]) => (
                  <li key={them} className="flex items-center gap-3 border-b border-ink/10 py-4 text-lg leading-snug text-ink/60 last:border-b-0 md:min-h-24">
                    <X className="h-5 w-5 shrink-0 text-rubric" strokeWidth={3} aria-hidden="true" />
                    <span>{them}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The question every pastor asks next: open, no box */}
          <div className="mx-auto mt-20 max-w-2xl text-center">
            <p className="text-balance text-xl font-medium text-ink/60 sm:text-2xl">
              So what does our staff member do&nbsp;instead?
            </p>
            <p className="mt-3 font-serif text-6xl font-medium text-lapis sm:text-7xl">Ministry.</p>
            <p className="mx-auto mt-5 max-w-lg text-balance text-lg leading-relaxed text-ink/75">
              We bring in people ready to plan a visit, come to an event, get
              involved, or give monthly. Your staff member welcomes them and gets them over
              the finish line. It&rsquo;s a perfect role for a communications&nbsp;person.
            </p>
          </div>

          <div className="mt-12 text-center">
            <ScrollToBookingButton className={BUTTON}>{BUTTON_LABEL}</ScrollToBookingButton>
          </div>
        </div>
      </section>

      {/* The system: nurture first, then ask. Three real phone screens in a
          row (desktop), or phone-beside-text rows (mobile). Giving is the
          last step, so it gets the gold ring. */}
      <section className="bg-ink px-6 py-20 text-vellum sm:py-28 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className={h2}>Nurture first. Then&nbsp;ask.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-vellum/75">
              People say yes to a parish they already know and trust. So we
              build that trust every week, then ask with targeted&nbsp;ads.
            </p>
          </div>

          <ol className="mx-auto mt-14 grid max-w-md gap-4 md:max-w-none md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start md:gap-6">
            {SYSTEM.map((step, i) => {
              const last = i === SYSTEM.length - 1;
              return (
                <li key={step.title} className="contents">
                  <div className="flex items-center gap-5 md:flex-col md:items-center md:gap-0 md:text-center">
                    <div
                      className={`relative aspect-[9/17] w-28 shrink-0 overflow-hidden rounded-[1.3rem] border-[5px] border-black/70 bg-black shadow-2xl sm:w-32 md:w-52 md:rounded-[1.8rem] md:border-[6px] ${
                        last ? "shadow-gilt/30 ring-2 ring-gilt-light" : "shadow-black/50 ring-1 ring-vellum/15"
                      }`}
                    >
                      <Image
                        src={step.image}
                        alt={step.alt}
                        fill
                        sizes="(min-width: 768px) 208px, 128px"
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="md:mt-7">
                      <p className={`font-semibold ${last ? "text-gilt-light" : "text-vellum/55"}`}>Step {i + 1}</p>
                      <h3 className={`mt-1 font-serif text-2xl font-semibold sm:text-3xl ${last ? "text-gilt-light" : ""}`}>
                        {step.title}
                      </h3>
                      <p className="mt-2 text-pretty leading-relaxed text-vellum/75 md:mx-auto md:max-w-[17rem] md:text-lg">
                        {step.body}
                      </p>
                      <p className="mt-2 text-sm text-vellum/45">{step.who}</p>
                    </div>
                  </div>
                  {!last && (
                    <ArrowRight
                      aria-hidden="true"
                      className="ml-11 h-6 w-6 rotate-90 text-gilt-light sm:ml-[3.25rem] md:ml-0 md:mt-44 md:rotate-0"
                    />
                  )}
                </li>
              );
            })}
          </ol>

          {/* Where the system leads */}
          <div className="mx-auto mt-16 max-w-xl border-t border-vellum/15 pt-10 text-center">
            <p className="font-semibold text-vellum/60">Our goal for your parish</p>
            <p className="mt-2 font-serif text-5xl font-medium text-gilt-light sm:text-6xl">$5,000 a&nbsp;month</p>
            <p className="mt-2 text-lg text-vellum/75">in new, recurring&nbsp;giving</p>
          </div>
        </div>
      </section>

      {/* The TITHE Framework: five milestones on a winding roadmap */}
      <TitheRoadmap
        heading={<>Our 5-step T.I.T.H.E.&nbsp;Framework</>}
        subheading={<>The whole system, step by step. Top&#8209;tier digital marketing, the kind parishes rarely have, built around your&nbsp;pastor.</>}
        steps={STEPS}
        destination={<>Goal: $5,000 a month in recurring&nbsp;giving</>}
      />

      {/* Before you book + Calendly */}
      <section id="book" className="scroll-mt-20 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={h2}>Before you book&hellip;</h2>
          <p className="mt-5 text-pretty text-lg text-ink/75">
            To make this conversation as useful as possible for your parish,{" "}
            <strong className="font-semibold text-ink">we ask that the pastor join the call.</strong>{" "}
            Assistant priests, deacons, and office staff are welcome to book,
            provided they can bring the pastor into the&nbsp;meeting.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          {/* No trackScheduleEvent here: Calendly redirects to
              /call-confirmed after booking, which fires Schedule. */}
          <CalendlyEmbed url={CALENDLY_URL} />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-vellum-deep px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className={`text-center ${h2}`}>Frequently asked&nbsp;questions</h2>
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
                <div className="space-y-3 pb-7 text-ink/75">
                  {faq.answer.map((paragraph) => (
                    <p key={paragraph} className="text-pretty">{paragraph}</p>
                  ))}
                </div>
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
