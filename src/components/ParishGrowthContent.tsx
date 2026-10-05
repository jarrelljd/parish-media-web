import Image from "next/image";
import CalendlyEmbed from "./CalendlyEmbed";
import ScrollToBookingButton from "./ScrollToBookingButton";
import stepNurture from "../../public/images/proof/st-joseph-instagram-grid.png";
import stepAsk from "../../public/images/proof/ad-on-phone.png";
import stepFollowUp from "../../public/images/events/st-rose/2026-picnic-enhanced.png";

const CALENDLY_URL =
  "https://calendly.com/parishmedia/consult?hide_gdpr_banner=1&text_color=1b2a4a&primary_color=c9a227";

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

export default function ParishGrowthContent() {
  return (
    <>
      {/* Hero */}
      <section className="pb-16 sm:pb-20">
        {/* Navy band runs behind the headline and the top ~2/3 of the
            video, then breaks to off-white so the video sits on the seam. */}
        <div className="bg-navy px-6 pt-10 sm:pt-14">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance font-serif text-3xl font-semibold leading-tight text-offwhite sm:text-5xl">
              Help Your Parish Reach More Young&nbsp;Adults
            </h1>
            <p className="mt-5 text-pretty text-lg text-offwhite/75">
              Show them what&rsquo;s happening at your parish and make it
              easy to get involved, all through Facebook and&nbsp;Instagram.
            </p>
          </div>
        </div>
        <div className="bg-linear-to-b from-navy from-65% to-transparent to-65% px-6 pt-8">
          <div className="relative mx-auto aspect-video w-full max-w-2xl overflow-hidden rounded-2xl bg-navy shadow-2xl ring-1 ring-gold/30">
            <iframe
              src="https://player.vimeo.com/video/1233188537?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Parish Media VSL 1"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-navy/80">
            We use your parish&rsquo;s existing events, ministries, and Mass
            schedule to reach local young adults and families and give them
            a clear next&nbsp;step.
          </p>
          <div className="mt-8">
            <ScrollToBookingButton className="inline-flex items-center justify-center rounded-full bg-gold px-10 py-4 text-base font-semibold text-navy shadow-md transition-colors hover:bg-gold/90">
              Book 30-Min Parish Growth&nbsp;Assessment
            </ScrollToBookingButton>
          </div>
        </div>
      </section>

      {/* What other priests are saying */}
      <section className="bg-navy/5 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-balance font-serif text-2xl font-semibold text-navy sm:text-3xl">
            What Other Priests Are Saying
          </h2>
          <div className="mt-10 grid gap-12 md:grid-cols-3 md:gap-8">
            {PRIEST_TESTIMONIALS.map((t) => (
              <div key={t.name}>
                <div className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-2xl bg-navy shadow-lg">
                  <iframe
                    src={`https://player.vimeo.com/video/${t.videoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                    className="absolute inset-0 h-full w-full"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    title={`${t.name} testimonial for Parish Media Company`}
                  />
                </div>
                <p className="mt-5 font-semibold text-navy">{t.name}</p>
                <p className="mx-auto mt-1 max-w-[280px] text-pretty text-sm text-navy/60">
                  {t.role}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <ScrollToBookingButton className="inline-flex items-center justify-center rounded-full bg-gold px-10 py-4 text-base font-semibold text-navy shadow-md transition-colors hover:bg-gold/90">
              Book 30-Min Parish Growth&nbsp;Assessment
            </ScrollToBookingButton>
          </div>
        </div>
      </section>

      {/* What we do for your parish */}
      <section className="pb-16 sm:pb-20">
        <div className="bg-navy px-6 py-10 sm:py-12">
          <span className="mx-auto block h-1 w-12 rounded-full bg-gold" />
          <h2 className="mt-5 text-balance text-center font-serif text-3xl font-semibold text-offwhite sm:text-4xl">
            What We Do For Your&nbsp;Parish
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-12 px-6 sm:mt-16 md:grid-cols-3 md:gap-8">
          <div className="text-center">
            <h3 className="font-serif text-xl font-semibold text-navy">
              #1: Nurture
            </h3>
            <div className="relative mt-5 aspect-square overflow-hidden rounded-2xl shadow-md">
              <Image
                src={stepNurture}
                alt="St. Joseph Catholic Church Instagram grid with the pastor's homily clips and parish events"
                fill
                sizes="(min-width: 768px) 320px, 100vw"
                className="object-cover object-bottom"
              />
            </div>
            <p className="mt-5 text-pretty text-navy/80">
              Consistent posts aren&apos;t enough. We need to consistently post
              content that gets the viewer to know, like, and trust the parish.
              Over and over, week after&nbsp;week.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-serif text-xl font-semibold text-navy">
              #2: Ask
            </h3>
            <div className="relative mt-5 aspect-square overflow-hidden rounded-2xl bg-gold/10 shadow-md">
              <Image
                src={stepAsk}
                alt="A parish picnic invitation ad on Facebook"
                fill
                sizes="(min-width: 768px) 320px, 100vw"
                className="object-contain py-3"
              />
            </div>
            <p className="mt-5 text-pretty text-navy/80">
              Once they&apos;re nurtured, they&apos;re more likely to respond
              positively to an ask (attend, volunteer, etc.). We ask through
              social media ads, because that&apos;s where everyone spends
              their&nbsp;time.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-serif text-xl font-semibold text-navy">
              #3: Follow-Up
            </h3>
            <div className="relative mt-5 aspect-square overflow-hidden rounded-2xl shadow-md">
              <Image
                src={stepFollowUp}
                alt="A parish priest greeting parishioners at a picnic"
                fill
                sizes="(min-width: 768px) 320px, 100vw"
                className="object-cover object-top"
              />
            </div>
            <p className="mt-5 text-pretty text-navy/80">
              Finally, when people respond to the ad, we do the next step. If
              it&apos;s a &ldquo;Plan Your Visit&rdquo; ad, we reach out and
              talk with them. If it&apos;s an event ad, we add the event to
              their&nbsp;calendar.
            </p>
          </div>
        </div>
      </section>

      {/* Before you book + Calendly */}
      <section
        id="book"
        className="scroll-mt-20 border-t border-navy/10 px-6 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-serif text-2xl font-semibold text-navy sm:text-3xl">
            Before You Book&hellip;
          </h2>
          <p className="mt-4 text-pretty text-navy/80">
            To make this conversation as useful as possible for your parish,
            we ask that the pastor join the call. Assistant priests, deacons,
            and office staff are welcome to book, provided they can bring the
            pastor into the&nbsp;meeting.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          {/* No trackScheduleEvent here: Calendly redirects to
              /call-confirmed after booking, which fires Schedule. */}
          <CalendlyEmbed url={CALENDLY_URL} />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-navy/5 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-balance text-center font-serif text-2xl font-semibold text-navy sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-10 space-y-3">
            {FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-navy/10 bg-white shadow-sm open:border-gold/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-navy [&::-webkit-details-marker]:hidden">
                  <span className="text-pretty">{faq.question}</span>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.25}
                      className="h-4 w-4"
                    >
                      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <div className="space-y-3 px-6 pb-6 text-navy/80">
                  {faq.answer.map((paragraph) => (
                    <p key={paragraph} className="text-pretty">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </details>
            ))}
          </div>
          <div className="mt-12 text-center">
            <ScrollToBookingButton className="inline-flex items-center justify-center rounded-full bg-gold px-10 py-4 text-base font-semibold text-navy shadow-md transition-colors hover:bg-gold/90">
              Book 30-Min Parish Growth&nbsp;Assessment
            </ScrollToBookingButton>
          </div>
        </div>
      </section>
    </>
  );
}
