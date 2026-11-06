import CalendlyEmbed from "./CalendlyEmbed";
import ScrollToBookingButton from "./ScrollToBookingButton";

// Same Calendly event the old /free-consult/vocations page used.
const CALENDLY_URL =
  "https://calendly.com/parishmedia/free-consultation-joe-jarrell-clone?hide_gdpr_banner=1&text_color=1d1a16&primary_color=1f3263";

// Gold leads on this page (navy leads on Parish Growth), so the primary
// buttons flip to navy to stay visible on the gold bands.
const BUTTON_CLASS =
  "inline-flex items-center justify-center rounded-[3px] bg-lapis px-9 py-4 text-base font-semibold text-vellum transition-colors hover:bg-lapis-deep";

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
        <div className="bg-ink px-6 pt-12 sm:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-serif text-xl italic text-[#e3a196]">Vocations Outreach</p>
            <h1 className="mt-3 text-balance font-serif text-[2.6rem] font-medium leading-[1.05] text-vellum sm:text-6xl">
              Have more men reaching out about the&nbsp;priesthood
            </h1>
            <p className="mt-5 text-pretty text-lg text-vellum/75">
              Reach Catholic men who are already wondering about a call and
              make it easy to take the first step, all through Facebook
              and&nbsp;Instagram.
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
      <section className="bg-vellum-deep px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-serif text-lg italic text-rubric">In their words</p>
          <h2 className="mt-2 text-balance font-serif text-4xl font-medium sm:text-5xl">
            See what another vocation director is&nbsp;saying
          </h2>
          <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-[1.6rem] border-[6px] border-ink bg-ink shadow-xl shadow-ink/20">
                <iframe
                  src="https://player.vimeo.com/video/1225765800?badge=0&autopause=0&player_id=0&app_id=58479"
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Fr. Nathan Linton testimonial for Parish Media Company"
                />
              </div>
              <p className="mt-5 font-serif text-xl font-semibold">Fr. Nathan Linton</p>
              <p className="mx-auto mt-1 max-w-[280px] text-pretty text-sm text-ink/60">
                Vocations Director, Capuchin Franciscans, Midwest Province of
                St.&nbsp;Joseph
              </p>
            </div>
            <div className="divide-y divide-ink/15 border-y border-ink/15 text-left">
              <div className="py-8">
                <p className="font-serif text-6xl font-medium text-lapis">
                  190
                </p>
                <p className="mt-2 text-pretty text-ink/65">
                  men inquired about religious life in&nbsp;90&nbsp;days
                </p>
              </div>
              <div className="py-8">
                <p className="font-serif text-6xl font-medium text-lapis">
                  $500
                </p>
                <p className="mt-2 text-pretty text-ink/65">
                  total ad&nbsp;spend
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
        <div className="px-6 pt-16 text-center sm:pt-24">
          <p className="font-serif text-lg italic text-rubric">How it works</p>
          <h2 className="mt-2 text-balance font-serif text-4xl font-medium sm:text-5xl">
            What we do for your vocations&nbsp;office
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 px-6 sm:mt-16 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="border-t-2 border-ink pt-6 text-center"
            >
              <h3 className="font-serif text-2xl font-medium">
                {step.title}
              </h3>
              <p className="mt-4 text-pretty text-ink/80">{step.body}</p>
            </div>
          ))}
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
            <ScrollToBookingButton className={BUTTON_CLASS}>
              {BUTTON_LABEL}
            </ScrollToBookingButton>
          </div>
        </div>
      </section>
    </>
  );
}
