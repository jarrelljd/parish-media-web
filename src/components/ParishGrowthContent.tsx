import Image from "next/image";
import CalendlyEmbed from "./CalendlyEmbed";
import ScrollToBookingButton from "./ScrollToBookingButton";
import { comparison, methodSteps, proofFacts } from "@/data/method";
import navePhoto from "../../public/images/events/st-mary-mountains/landing/nave.jpg";

const CALENDLY_URL =
  "https://calendly.com/parishmedia/consult?hide_gdpr_banner=1&text_color=1d1a16&primary_color=1f3263";

const FAQS = [
  {
    question:
      "We already have someone handling our social media. Do we still need this?",
    answer: [
      "Possibly. We’re not here to replace someone who knows your parish. We provide the strategy, campaigns, and execution needed to consistently reach nearby young adults and families, promote specific parish activities, and generate inquiries. We’ll bring the inquiries to the parish so your staff member can focus less on posting and more on what they do best: ministry work for the new inquirers.",
    ],
  },
  {
    question: "How much does it cost?",
    answer: [
      "Pricing depends on your parish’s goals, location, campaign scope, and the level of support needed. We’ll walk through the recommended plan on the call and give you a clear investment before anything moves forward.",
    ],
  },
  {
    question:
      "We have other priorities right now. Why should this be one of them?",
    answer: [
      "That’s exactly why we focus on a 90-day plan. The goal isn’t to create another ongoing project for your parish. It’s to help more people discover what your parish already offers and take a clear next step toward participating.",
      "If reaching more young adults and families is a priority, this gives your parish a practical system for doing it.",
    ],
  },
  {
    question: "We’re already too busy. How would we manage this?",
    answer: [
      "You shouldn’t have to manage it. We handle the campaign strategy, content coordination, advertising, and reporting. Your staff’s main responsibility is helping us understand parish events and responding when interested people raise their hands.",
    ],
  },
];

const PRIEST_TESTIMONIALS = [
  {
    name: "Fr. Dave Aufiero",
    role: "Pastor, St. Patrick’s Catholic Church, South Hadley, MA",
    videoId: "1224059968",
  },
  {
    name: "Fr. Nicholas Fleming",
    role: "Pastor, Ss. John and James Catholic Parish, West Warwick, RI",
    videoId: "1224307339",
  },
  {
    name: "Fr. Nathan Linton",
    role: "Vocations Director, Capuchin Franciscans, Midwest Province of St. Joseph",
    videoId: "1225765800",
  },
];

// Wording for each step on this page (images and captions come from
// src/data/method.ts, shared with the homepage).
const STEP_COPY = [
  "Consistent posts aren’t enough. We need to consistently post content that gets the viewer to know, like, and trust the parish. Over and over, week after week.",
  "Once they’re nurtured, they’re more likely to respond positively to an ask (attend, volunteer, etc.). We ask through social media ads, because that’s where everyone spends their time.",
  "Finally, when people respond to the ad, we do the next step. If it’s a “Plan Your Visit” ad, we reach out and talk with them. If it’s an event ad, we add the event to their calendar. Every response is tracked and reported to you each month.",
];

const BUTTON =
  "inline-flex items-center justify-center rounded-[3px] bg-lapis px-9 py-4 text-base font-semibold text-vellum transition-colors hover:bg-lapis-deep";
const BUTTON_LABEL = "Book your free 30-minute assessment";
const rubric = "font-serif text-lg italic text-rubric";
const h2 = "font-serif text-4xl font-medium leading-[1.08] text-balance sm:text-5xl";

export default function ParishGrowthContent() {
  return (
    <>
      {/* Hero: church photo behind the headline; the video sits on the seam
          between the dark band and the light page. */}
      <section className="pb-14 sm:pb-16">
        <div className="relative overflow-hidden bg-ink px-6 pt-14 sm:pt-20">
          <Image
            src={navePhoto}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_45%] opacity-45 motion-safe:animate-kenburns"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/70 to-ink" />
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="font-serif text-xl italic text-[#e3a196] motion-safe:animate-fade-up">Social Media</p>
            <h1 className="mt-3 text-balance font-serif text-[2.6rem] font-medium leading-[1.06] text-vellum motion-safe:animate-fade-up sm:text-6xl" style={{ animationDelay: "120ms" }}>
              Help your Catholic parish reach more young&nbsp;adults
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-pretty text-lg text-vellum/80 motion-safe:animate-fade-up" style={{ animationDelay: "240ms" }}>
              Show them what&rsquo;s happening at your parish and make it
              easy to get involved, all through Facebook and&nbsp;Instagram.
            </p>
          </div>
        </div>
        <div className="bg-linear-to-b from-ink from-65% to-transparent to-65% px-6 pt-10">
          <div className="relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-[4px] bg-ink shadow-2xl shadow-ink/30 ring-1 ring-vellum/10">
            <iframe
              src="https://player.vimeo.com/video/1233188537?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Parish Media VSL 1"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>

        {/* Real results, right under the video */}
        <div className="mx-auto mt-12 max-w-5xl px-6">
          <dl className="grid divide-y divide-ink/10 border-y border-ink/15 md:grid-cols-3 md:divide-x md:divide-y-0">
            {proofFacts.map((f) => (
              <div key={f.who} className="py-6 text-center md:px-6">
                <dt className="sr-only">{f.who}</dt>
                <dd>
                  <span className="block font-serif text-5xl font-medium text-lapis">{f.stat}</span>
                  <span className="mx-auto mt-2 block max-w-[16rem] text-pretty text-ink/75">{f.label}</span>
                  <span className="mt-2 block font-serif text-base italic text-ink/50">{f.who}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="mx-auto mt-10 max-w-2xl text-pretty text-lg text-ink/75">
            We use your parish&rsquo;s existing events, ministries, and Mass
            schedule to reach local young adults and families and give them
            a clear next&nbsp;step.
          </p>
          <div className="mt-8">
            <ScrollToBookingButton className={BUTTON}>{BUTTON_LABEL}</ScrollToBookingButton>
          </div>
        </div>
      </section>

      {/* What other priests are saying */}
      <section className="bg-vellum-deep px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className={rubric}>In their words</p>
          <h2 className={`mt-2 ${h2}`}>What other priests are&nbsp;saying</h2>
          <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8">
            {PRIEST_TESTIMONIALS.map((t) => (
              <div key={t.name}>
                <div className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-[1.6rem] border-[6px] border-ink bg-ink shadow-xl shadow-ink/20">
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
                <p className="mx-auto mt-1 max-w-[280px] text-pretty text-sm text-ink/60">{t.role}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <ScrollToBookingButton className={BUTTON}>{BUTTON_LABEL}</ScrollToBookingButton>
          </div>
        </div>
      </section>

      {/* How it works: same three steps as the homepage, shown with real work */}
      <section className="px-6 py-20 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className={rubric}>How it works</p>
            <h2 className={`mt-3 ${h2}`}>Encounter, invitation, accompaniment.</h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-ink/70">
              Here&rsquo;s what we do for your parish every month, and what
              each part looks like in a real&nbsp;parish.
            </p>
          </div>

          <div className="mt-14 space-y-16 lg:space-y-24">
            {methodSteps.map((s, i) => (
              <article key={s.title} className="grid items-center gap-8 border-t border-ink/15 pt-10 lg:grid-cols-2 lg:gap-16">
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <p className="font-serif text-6xl font-medium leading-none text-rubric">{s.n}</p>
                  <h3 className="mt-4 font-serif text-4xl font-medium">{s.title}</h3>
                  <p className="mt-1 font-serif text-xl italic text-ink/60">{s.plain}</p>
                  <p className="mt-5 max-w-lg text-pretty text-lg leading-relaxed text-ink/75">{STEP_COPY[i]}</p>
                </div>
                <figure className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="flex h-[22rem] items-center justify-center overflow-hidden bg-black sm:h-[26rem]">
                    <Image src={s.image} alt={s.alt} sizes="(min-width: 1024px) 560px, 100vw" className="h-full w-auto object-contain" />
                  </div>
                  <figcaption className="mt-3 font-serif text-base italic text-ink/60">{s.caption}</figcaption>
                </figure>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* The difference */}
      <section className="bg-vellum-deep px-6 py-20 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <p className={rubric}>The difference</p>
          <h2 className={`mt-3 ${h2}`}>&ldquo;We already have someone for social&nbsp;media.&rdquo;</h2>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink/70">
            Most parishes do, and they&rsquo;re a blessing. But their job is
            to post. Ours is to get people to show up: targeted, trackable
            campaigns for your parish events, and Plan Your Visit campaigns
            that bring newcomers to Mass. Most parish staff were never
            trained to track that, and they shouldn&rsquo;t have to&nbsp;be.
          </p>
          <table className="mt-12 w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-ink">
                <th scope="col" className="w-1/2 pb-3 pr-6 font-serif text-xl font-medium text-ink/60">A volunteer or staff member</th>
                <th scope="col" className="w-1/2 pb-3 font-serif text-xl font-semibold text-lapis">Parish Media Company</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map(([a, b]) => (
                <tr key={a} className="border-b border-ink/15 align-top">
                  <td className="py-5 pr-6 text-pretty text-ink/55">{a}</td>
                  <td className="py-5 text-pretty font-medium text-ink">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-12">
            <ScrollToBookingButton className={BUTTON}>{BUTTON_LABEL}</ScrollToBookingButton>
          </div>
        </div>
      </section>

      {/* Before you book + Calendly */}
      <section id="book" className="scroll-mt-20 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className={rubric}>Book your assessment</p>
          <h2 className={`mt-2 ${h2}`}>Before you book&hellip;</h2>
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
          <p className="text-center font-serif text-lg italic text-rubric">Questions</p>
          <h2 className={`mt-2 text-center ${h2}`}>Frequently asked&nbsp;questions</h2>
          <div className="mt-10 border-t-2 border-ink">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group border-b border-ink/15">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 text-left font-serif text-xl font-medium [&::-webkit-details-marker]:hidden">
                  <span className="text-pretty">{faq.question}</span>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center text-rubric transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
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
