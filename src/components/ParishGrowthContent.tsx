import Image from "next/image";
import CalendlyEmbed from "./CalendlyEmbed";
import ScrollToBookingButton from "./ScrollToBookingButton";
import stepNurture from "../../public/images/events/st-patrick/tug-of-war.jpg";
import stepAsk from "../../public/images/proof/ad-on-phone.png";
import stepFollowUp from "../../public/images/events/st-rose/2026-picnic-enhanced.png";

const CALENDLY_URL =
  "https://calendly.com/parishmedia/consult?hide_gdpr_banner=1&text_color=1b2a4a&primary_color=c9a227";

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
      <section className="px-6 pt-4 pb-16 sm:pt-8 sm:pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance font-serif text-3xl font-semibold leading-tight text-navy sm:text-5xl">
            Help Your Parish Reach More Young Adults and&nbsp;Families
          </h1>
          <p className="mt-5 text-pretty text-lg text-navy/70">
            We help Catholic parishes reach nearby young adults through
            Facebook and Instagram, give them clear next steps, and generate
            inquiries without adding work for&nbsp;staff.
          </p>
          <div className="relative mx-auto mt-8 aspect-video w-full max-w-2xl overflow-hidden rounded-2xl bg-navy shadow-lg">
            <iframe
              src="https://player.vimeo.com/video/1156503108?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Parish Media VSL 1"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <div className="mt-8">
            <ScrollToBookingButton className="inline-flex items-center justify-center rounded-full bg-gold px-10 py-4 text-base font-semibold text-navy shadow-md transition-colors hover:bg-gold/90">
              Book 30-Min Parish Growth Strategy&nbsp;Call
            </ScrollToBookingButton>
          </div>
          <p className="mt-8 text-pretty text-navy/80">
            <span className="font-semibold text-navy">
              Fr. Dave&rsquo;s parish generated 65 young-adult inquiries in 60
              days.
            </span>{" "}
            The campaign gave interested young adults a simple way to raise
            their hand and take the next step with the parish.
          </p>
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
                The Guarantee
              </p>
              <p className="mt-1 text-pretty text-sm text-navy/70">
                If we don&rsquo;t generate the agreed number of qualified
                young-adult inquiries within 90&nbsp;days, you don&rsquo;t pay
                our management&nbsp;fee.
              </p>
            </div>
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
        </div>
      </section>

      {/* How it works */}
      <section className="pb-16 sm:pb-20">
        <div className="bg-navy px-6 py-10 sm:py-12">
          <span className="mx-auto block h-1 w-12 rounded-full bg-gold" />
          <h2 className="mt-5 text-center font-serif text-3xl font-semibold text-offwhite sm:text-4xl">
            How It Works
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-12 px-6 sm:mt-16 md:grid-cols-3 md:gap-8">
          <div className="text-center">
            <h3 className="font-serif text-xl font-semibold text-navy">
              #1: Nurture
            </h3>
            <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-2xl shadow-md">
              <Image
                src={stepNurture}
                alt="Families playing tug-of-war at a parish picnic"
                fill
                sizes="(min-width: 768px) 320px, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-5 text-pretty text-navy/80">
              Consistent posts and targeted ads introduce your parish to{" "}
              <strong className="font-semibold text-navy">
                nearby young adults and families
              </strong>{" "}
              and keep them&nbsp;connected.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-serif text-xl font-semibold text-navy">
              #2: Ask
            </h3>
            <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-2xl bg-gold/10 shadow-md">
              <Image
                src={stepAsk}
                alt="A parish picnic invitation ad on Facebook"
                fill
                sizes="(min-width: 768px) 320px, 100vw"
                className="object-contain py-3"
              />
            </div>
            <p className="mt-5 text-pretty text-navy/80">
              Clear invitations give interested people a simple way to{" "}
              <strong className="font-semibold text-navy">
                raise their hand
              </strong>{" "}
              for an event, ministry, or volunteer&nbsp;opportunity.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-serif text-xl font-semibold text-navy">
              #3: Follow-Up
            </h3>
            <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-2xl shadow-md">
              <Image
                src={stepFollowUp}
                alt="A parish priest greeting parishioners at a picnic"
                fill
                sizes="(min-width: 768px) 320px, 100vw"
                className="object-cover object-top"
              />
            </div>
            <p className="mt-5 text-pretty text-navy/80">
              Your parish{" "}
              <strong className="font-semibold text-navy">
                reaches out personally
              </strong>{" "}
              and helps each person take the next&nbsp;step.
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
    </>
  );
}
