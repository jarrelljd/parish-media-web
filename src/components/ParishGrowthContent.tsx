import Image from "next/image";
import CalendlyEmbed from "./CalendlyEmbed";
import ScrollToBookingButton from "./ScrollToBookingButton";
import stepNurture from "../../public/images/proof/st-joseph-instagram-grid.png";
import stepAsk from "../../public/images/proof/ad-on-phone.png";
import stepFollowUp from "../../public/images/parish-growth/young-adults-with-priest.png";

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

export default function ParishGrowthContent() {
  return (
    <>
      {/* Hero */}
      <section className="pb-16 sm:pb-20">
        {/* Navy band runs behind the headline and the top ~2/3 of the
            video, then breaks to off-white so the video sits on the seam. */}
        <div className="bg-ink px-6 pt-12 sm:pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-serif text-xl italic text-[#e3a196]">Parish Growth</p>
            <h1 className="mt-3 text-balance font-serif text-[2.6rem] font-medium leading-[1.05] text-vellum sm:text-6xl">
              Help your Catholic parish reach more young&nbsp;adults
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-pretty text-lg text-vellum/75">
              Show them what&rsquo;s happening at your parish and make it
              easy to get involved, all through Facebook and&nbsp;Instagram.
            </p>
          </div>
        </div>
        <div className="bg-linear-to-b from-ink from-65% to-transparent to-65% px-6 pt-10">
          <div className="relative mx-auto aspect-video w-full max-w-2xl overflow-hidden rounded-[4px] bg-ink shadow-2xl shadow-ink/30 ring-1 ring-vellum/10">
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
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-ink/80">
            We use your parish&rsquo;s existing events, ministries, and Mass
            schedule to reach local young adults and families and give them
            a clear next&nbsp;step.
          </p>
          <div className="mt-8">
            <ScrollToBookingButton className="inline-flex items-center justify-center rounded-[3px] bg-lapis px-9 py-4 text-base font-semibold text-vellum transition-colors hover:bg-lapis-deep">
              Book 30-Min Parish Growth&nbsp;Assessment
            </ScrollToBookingButton>
          </div>
        </div>
      </section>

      {/* What other priests are saying */}
      <section className="bg-vellum-deep px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-serif text-lg italic text-rubric">In their words</p>
          <h2 className="mt-2 text-balance font-serif text-4xl font-medium sm:text-5xl">
            What other priests are&nbsp;saying
          </h2>
          <div className="mt-10 grid gap-12 md:grid-cols-3 md:gap-8">
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
                <p className="mx-auto mt-1 max-w-[280px] text-pretty text-sm text-ink/60">
                  {t.role}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <ScrollToBookingButton className="inline-flex items-center justify-center rounded-[3px] bg-lapis px-9 py-4 text-base font-semibold text-vellum transition-colors hover:bg-lapis-deep">
              Book 30-Min Parish Growth&nbsp;Assessment
            </ScrollToBookingButton>
          </div>
        </div>
      </section>

      {/* What we do for your parish */}
      <section className="pb-16 sm:pb-20">
        <div className="px-6 pt-16 text-center sm:pt-24">
          <p className="font-serif text-lg italic text-rubric">How it works</p>
          <h2 className="mt-2 text-balance font-serif text-4xl font-medium sm:text-5xl">
            What we do for your&nbsp;parish
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-12 px-6 sm:mt-16 md:grid-cols-3 md:gap-8">
          <div className="text-center">
            <p className="font-serif text-5xl font-medium leading-none text-rubric">1</p>
            <h3 className="mt-3 font-serif text-3xl font-medium">Nurture</h3>
            <div className="relative mt-6 aspect-square overflow-hidden bg-black">
              <Image
                src={stepNurture}
                alt="St. Joseph Catholic Church Instagram grid with the pastor's homily clips and parish events"
                fill
                sizes="(min-width: 768px) 320px, 100vw"
                className="object-cover object-bottom"
              />
            </div>
            <p className="mt-5 text-pretty text-ink/80">
              Consistent posts aren&apos;t enough. We need to consistently post
              content that gets the viewer to know, like, and trust the parish.
              Over and over, week after&nbsp;week.
            </p>
          </div>
          <div className="text-center">
            <p className="font-serif text-5xl font-medium leading-none text-rubric">2</p>
            <h3 className="mt-3 font-serif text-3xl font-medium">Ask</h3>
            <div className="relative mt-6 aspect-square overflow-hidden bg-black">
              <Image
                src={stepAsk}
                alt="A parish picnic invitation ad on Facebook"
                fill
                sizes="(min-width: 768px) 320px, 100vw"
                className="object-contain py-3"
              />
            </div>
            <p className="mt-5 text-pretty text-ink/80">
              Once they&apos;re nurtured, they&apos;re more likely to respond
              positively to an ask (attend, volunteer, etc.). We ask through
              social media ads, because that&apos;s where everyone spends
              their&nbsp;time.
            </p>
          </div>
          <div className="text-center">
            <p className="font-serif text-5xl font-medium leading-none text-rubric">3</p>
            <h3 className="mt-3 font-serif text-3xl font-medium">Follow-up</h3>
            <div className="relative mt-6 aspect-square overflow-hidden bg-black">
              <Image
                src={stepFollowUp}
                alt="Fr. Nicholas Fleming taking a selfie with a large group of young adults at Ss. John and James Catholic Parish in West Warwick, RI"
                fill
                sizes="(min-width: 768px) 320px, 100vw"
                className="object-cover object-left"
              />
            </div>
            <p className="mt-5 text-pretty text-ink/80">
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
        className="scroll-mt-20 border-t border-ink/10 px-6 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-lg italic text-rubric">Book your assessment</p>
          <h2 className="mt-2 text-balance font-serif text-4xl font-medium sm:text-5xl">
            Before you book&hellip;
          </h2>
          <p className="mt-4 text-pretty text-ink/80">
            To make this conversation as useful as possible for your parish,{" "}
            <strong className="font-semibold text-ink">
              we ask that the pastor join the call.
            </strong>{" "}
            Assistant priests, deacons,
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
      <section className="bg-vellum-deep px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="text-center font-serif text-lg italic text-rubric">Questions</p>
          <h2 className="mt-2 text-balance text-center font-serif text-4xl font-medium sm:text-5xl">
            Frequently asked&nbsp;questions
          </h2>
          <div className="mt-10 border-t-2 border-ink">
            {FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group border-b border-ink/15"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 text-left font-serif text-xl font-medium [&::-webkit-details-marker]:hidden">
                  <span className="text-pretty">{faq.question}</span>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center text-rubric transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
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
                <div className="space-y-3 pb-7 text-ink/75">
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
            <ScrollToBookingButton className="inline-flex items-center justify-center rounded-[3px] bg-lapis px-9 py-4 text-base font-semibold text-vellum transition-colors hover:bg-lapis-deep">
              Book 30-Min Parish Growth&nbsp;Assessment
            </ScrollToBookingButton>
          </div>
        </div>
      </section>
    </>
  );
}
