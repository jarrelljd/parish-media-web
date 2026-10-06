import CalendlyEmbed from "./CalendlyEmbed";
import ScrollToBookingButton from "./ScrollToBookingButton";

// Same Calendly event the old /free-consult/vocations page used.
const CALENDLY_URL =
  "https://calendly.com/parishmedia/free-consultation-joe-jarrell-clone?hide_gdpr_banner=1&text_color=1b2a4a&primary_color=c9a227";

// Gold leads on this page (navy leads on Parish Growth), so the primary
// buttons flip to navy to stay visible on the gold bands.
const BUTTON_CLASS =
  "inline-flex items-center justify-center rounded-full bg-navy px-10 py-4 text-base font-semibold text-offwhite shadow-md transition-colors hover:bg-navy/90";

const BUTTON_LABEL = (
  <>Book 30-Min Vocations Outreach&nbsp;Assessment</>
);

const STEPS = [
  {
    title: "#1: Reach",
    body: "We run vocation-specific ads on Facebook and Instagram that put your priests, your charism, and your community in front of Catholic men 21–35, the age most men begin seriously discerning.",
  },
  {
    title: "#2: Invite",
    body: "Men who are curious get a clear, low-pressure next step: a simple inquiry form connected to your vocations office, instead of a general website they have to figure out alone.",
  },
  {
    title: "#3: Follow-Up",
    body: "We pre-screen for basic fit and pass serious inquirers to you, then report back weekly. You keep full control of screening, discernment, and formation.",
  },
];

const FAQS = [
  {
    question: "Will this bring in men who aren’t serious?",
    answer: [
      "Some curiosity is a good thing. That’s where many vocations start. But we build in a short pre-screen on the inquiry form so your time goes to the men who are ready for a real conversation, and we adjust targeting as we learn who responds.",
    ],
  },
  {
    question: "How much does it cost?",
    answer: [
      "Pricing depends on your goals, your region, campaign scope, and the level of support needed. We’ll walk through the recommended plan on the call and give you a clear investment before anything moves forward.",
    ],
  },
  {
    question: "We already have a communications office. Do we still need this?",
    answer: [
      "Possibly. We’re not here to replace the people who know your diocese or community. Most communications offices are stretched across every ministry. We focus on one job: running the campaigns that get discerning men to raise their hands and reach your vocations office.",
    ],
  },
  {
    question: "How much of my time will this take?",
    answer: [
      "Very little beyond what you already do. We handle the strategy, ads, inquiry form, and reporting. Your part is helping us tell your community’s story at the start and responding personally when a man reaches out.",
    ],
  },
];

export default function VocationsContent() {
  return (
    <>
      {/* Hero */}
      <section className="pb-16 sm:pb-20">
        {/* Gold band runs behind the headline and the top ~2/3 of the
            video, then breaks to off-white so the video sits on the seam. */}
        <div className="bg-gold px-6 pt-10 sm:pt-14">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance font-serif text-3xl font-semibold leading-tight text-navy sm:text-5xl">
              Have More Men Reaching Out About the&nbsp;Priesthood
            </h1>
            <p className="mt-5 text-pretty text-lg text-navy/80">
              Reach Catholic men who are already wondering about a call and
              make it easy to take the first step, all through Facebook
              and&nbsp;Instagram.
            </p>
          </div>
        </div>
        <div className="bg-linear-to-b from-gold from-65% to-transparent to-65% px-6 pt-8">
          <div className="relative mx-auto aspect-video w-full max-w-2xl overflow-hidden rounded-2xl bg-navy shadow-2xl ring-1 ring-navy/20">
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
            We use your community&rsquo;s own story, priests, and discernment
            events to reach Catholic men 21&ndash;35 and send serious
            inquiries straight to your vocations&nbsp;office.
          </p>
          <div className="mt-8">
            <ScrollToBookingButton className={BUTTON_CLASS}>
              {BUTTON_LABEL}
            </ScrollToBookingButton>
          </div>
        </div>
      </section>

      {/* See what another vocation director is saying */}
      <section className="bg-gold/10 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-balance font-serif text-2xl font-semibold text-navy sm:text-3xl">
            See What Another Vocation Director Is&nbsp;Saying
          </h2>
          <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-2xl bg-navy shadow-lg">
                <iframe
                  src="https://player.vimeo.com/video/1225765800?badge=0&autopause=0&player_id=0&app_id=58479"
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Fr. Nathan Linton testimonial for Parish Media Company"
                />
              </div>
              <p className="mt-5 font-semibold text-navy">Fr. Nathan Linton</p>
              <p className="mx-auto mt-1 max-w-[280px] text-pretty text-sm text-navy/60">
                Vocations Director, Capuchin Franciscans, Midwest Province of
                St.&nbsp;Joseph
              </p>
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border border-gold/30 bg-white p-8 shadow-sm">
                <p className="font-serif text-5xl font-semibold text-navy">
                  190
                </p>
                <p className="mt-2 text-pretty text-sm font-medium uppercase tracking-wide text-navy/60">
                  Men inquired about religious life in&nbsp;90&nbsp;days
                </p>
              </div>
              <div className="rounded-2xl border border-gold/30 bg-white p-8 shadow-sm">
                <p className="font-serif text-5xl font-semibold text-navy">
                  $500
                </p>
                <p className="mt-2 text-pretty text-sm font-medium uppercase tracking-wide text-navy/60">
                  Total ad&nbsp;spend
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <ScrollToBookingButton className={BUTTON_CLASS}>
              {BUTTON_LABEL}
            </ScrollToBookingButton>
          </div>
        </div>
      </section>

      {/* What we do for your vocations office */}
      <section className="pb-16 sm:pb-20">
        <div className="bg-gold px-6 py-10 sm:py-12">
          <span className="mx-auto block h-1 w-12 rounded-full bg-navy" />
          <h2 className="mt-5 text-balance text-center font-serif text-3xl font-semibold text-navy sm:text-4xl">
            What We Do For Your Vocations&nbsp;Office
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 px-6 sm:mt-16 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border-t-4 border-gold bg-white p-8 text-center shadow-md"
            >
              <h3 className="font-serif text-xl font-semibold text-navy">
                {step.title}
              </h3>
              <p className="mt-4 text-pretty text-navy/80">{step.body}</p>
            </div>
          ))}
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
            To make this conversation as useful as possible, we ask that the
            vocations director, or whoever makes the final decision, join the
            call. Assistants and office staff are welcome to book, provided
            they can bring that person into the&nbsp;meeting.
          </p>
        </div>
        {/* Bleeds past the section padding on phones: Calendly's widget has
            a 320px min-width that would otherwise overflow small screens. */}
        <div className="-mx-6 mt-10 sm:mx-auto sm:max-w-3xl">
          <CalendlyEmbed url={CALENDLY_URL} trackScheduleEvent />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gold/10 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-balance text-center font-serif text-2xl font-semibold text-navy sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-10 space-y-3">
            {FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-navy/10 bg-white shadow-sm open:border-gold/60"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-navy [&::-webkit-details-marker]:hidden">
                  <span className="text-pretty">{faq.question}</span>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-gold transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
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
            <ScrollToBookingButton className={BUTTON_CLASS}>
              {BUTTON_LABEL}
            </ScrollToBookingButton>
          </div>
        </div>
      </section>
    </>
  );
}
