import { Check, X } from "lucide-react";
import ScrollToBookingButton from "@/components/ScrollToBookingButton";
import StoryRail, { type StoryStep } from "@/components/results/StoryRail";
import { REDESIGNS } from "@/data/freeWebsite";
import BeforeAfterSlider from "./BeforeAfterSlider";
import StylePicker, { BrowserFrame } from "./StylePicker";
import FreeWebsiteForm from "./FreeWebsiteForm";

// The free website redesign landing page (/free-website). One goal: get the
// parish's current site address. The form sits at #book so the shared
// top-bar button scrolls to it.

const BUTTON_BASE =
  "inline-flex items-center justify-center rounded-full px-10 py-4 text-base font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0";
const BUTTON = `${BUTTON_BASE} bg-lapis text-vellum shadow-lapis/30 hover:bg-lapis-deep`;
const BUTTON_GOLD = `${BUTTON_BASE} bg-gilt-light text-ink shadow-black/40 hover:bg-[#e0bf75]`;
const BUTTON_LABEL = "Get My Free Redesign";
const h2 = "font-serif text-4xl font-medium leading-[1.08] text-balance sm:text-5xl";

const hero = REDESIGNS.find((r) => r.key === "st-patrick")!;

// What a young family is looking for, and where most parish sites lose them.
const QUESTIONS: [string, string][] = [
  ["When is Mass?", "Buried in a PDF bulletin, or out of date"],
  ["Where do I park, and what should I expect?", "Nothing written for a first-time visitor"],
  ["Is there anything for my kids?", "Faith Formation hidden three menus deep"],
  ["Will anyone notice me?", "No simple way to say “we’re coming Sunday”"],
  ["Does it work on my phone?", "Tiny text, broken menus, endless pinching"],
];

const INCLUDED = [
  "The whole website, not just a homepage",
  "Mass and confession times right on the homepage",
  "A Plan Your Visit page with a simple sign-up form",
  "Events, bulletins, and ministries, all easy to find",
  "A clear Give button",
  "Built for phones first",
  "English and Spanish, if your parish needs it",
  "Your content and photos moved over for you",
];

// How it works, on the same scroll-drawn gold line as /results and /free-guide.
const STEPS: StoryStep[] = [
  {
    marker: "1",
    label: "About a minute",
    title: "Tell us about your parish",
    body: <p>Your name, how to reach you, and your parish&rsquo;s current website. Nothing to write, nothing to gather.</p>,
  },
  {
    marker: "2",
    label: "Done for you",
    title: "We rebuild it",
    body: (
      <p>
        We bring over your Mass times, ministries, events, and photos, then
        build a clean, modern website around them. Your current site is never
        touched.
      </p>
    ),
  },
  {
    marker: "3",
    label: "In 3 business days",
    title: "Click through your new site",
    body: (
      <p>
        We call your pastor when it&rsquo;s ready and email him the link,
        with a walkthrough of the new site. If someone on staff asked for it,
        they&rsquo;re copied&nbsp;too.
      </p>
    ),
  },
];

const FAQS: { question: string; answer: string[] }[] = [
  {
    question: "What’s the catch?",
    answer: [
      "The redesign is free, with no ads, no sponsor, and no obligation. We build it so you can see exactly what your parish could have.",
      "If you’d like to use it, putting it live on your domain and hosting it is a paid service. We’ll give you a clear price before anything moves forward, and we never touch your current website in the meantime.",
    ],
  },
  {
    question: "What happens if we want to use it?",
    answer: [
      "Just tell us. We install it on your domain and host it for you. Your email and online giving stay as they are, old links are redirected, and your old site stays up until the day the new one replaces it.",
    ],
  },
  {
    question: "Does our pastor need to be involved?",
    answer: [
      "Yes. He’s the one who decides, so we send the new website to him and walk him through it. If you’re on staff, we copy you and let him know you asked for it.",
    ],
  },
  {
    question: "Who keeps it up to date?",
    answer: [
      "Mass times, events, and bulletins are quick to change. If you decide to use the new site, we’ll explain exactly how updates work before anything moves forward.",
    ],
  },
  {
    question: "What do you need from us?",
    answer: [
      "Only your current website address. We pull your Mass times, ministries, and photos from it. If you have better photos or something you’d like changed, you can tell us on the next page.",
    ],
  },
];

export default function FreeWebsiteContent() {
  return (
    <>
      {/* Hero: before/after sits on the seam between the dark band and the
          light page, like the video on /parish. */}
      <section className="pb-14 sm:pb-16">
        <div className="bg-ink px-6 pt-14 sm:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-balance font-serif text-[2.2rem] font-medium leading-[1.08] text-vellum motion-safe:animate-fade-up sm:text-6xl">
              We&rsquo;ll Redesign Your Parish Website for&nbsp;Free
            </h1>
            <p
              className="mx-auto mt-5 max-w-2xl text-balance text-lg text-vellum/80 motion-safe:animate-fade-up sm:text-xl"
              style={{ animationDelay: "240ms" }}
            >
              Send us your current site. In 3 business days, you&rsquo;ll get a
              brand new, live website you can click through, built for the
              young families looking for a parish near&nbsp;them.
            </p>
            <div className="mt-8 motion-safe:animate-fade-up" style={{ animationDelay: "400ms" }}>
              <ScrollToBookingButton className={BUTTON_GOLD}>{BUTTON_LABEL}</ScrollToBookingButton>
              <p className="mt-3 text-sm text-vellum/55">No cost. No ads. No obligation.</p>
            </div>
          </div>
        </div>
        <div className="bg-linear-to-b from-ink from-60% to-transparent to-60% px-6 pt-12">
          <div className="mx-auto max-w-4xl">
            <BrowserFrame>
              <BeforeAfterSlider before={hero.before} after={hero.after} start={58} priority />
            </BrowserFrame>
          </div>
        </div>
      </section>

      {/* The problem, in the family's own questions */}
      <section className="bg-vellum-deep px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className={h2}>Young families visit your website before they visit your&nbsp;parish</h2>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-ink/70">
              They&rsquo;re asking five simple questions. Most parish websites
              make them dig for every&nbsp;answer.
            </p>
          </div>
          <ul className="mt-12 space-y-3">
            {QUESTIONS.map(([q, problem]) => (
              <li key={q} className="grid gap-1 rounded-2xl bg-white px-6 py-5 shadow-lg shadow-ink/5 ring-1 ring-ink/5 sm:grid-cols-[1fr_1fr] sm:items-center sm:gap-6">
                <p className="font-serif text-xl font-medium text-ink">{q}</p>
                <p className="flex items-start gap-2.5 text-ink/60">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-rubric" strokeWidth={2.5} aria-hidden="true" />
                  <span>{problem}</span>
                </p>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-12 max-w-xl text-balance text-center text-xl font-medium text-ink">
            Your new website answers all five on the first screen.
          </p>
        </div>
      </section>

      {/* Pick a style */}
      <section className="bg-ink px-6 py-20 text-vellum sm:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className={h2}>Pick a style. We&rsquo;ll do the&nbsp;rest.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-vellum/75">
              Every design is built around your church, your people, and your
              photos. Choose one after you sign up, or let us pick what fits
              your parish&nbsp;best.
            </p>
          </div>
          <div className="mt-12">
            <StylePicker />
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-vellum-deep px-6 py-20 sm:py-28">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1fr_1.1fr] md:items-center">
          <div>
            <h2 className={h2}>What you get in 3 business&nbsp;days</h2>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-ink/70">
              Not a sketch or a sample page. A real, working website with your
              parish&rsquo;s information, live at a private link you can share
              with your staff and finance&nbsp;council.
            </p>
          </div>
          <ul className="rounded-3xl bg-white px-7 py-6 shadow-2xl shadow-ink/10 ring-1 ring-ink/5 sm:px-9">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-3 border-b border-ink/10 py-4 text-lg leading-snug last:border-b-0">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" strokeWidth={3} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works: gold line draws down as they scroll */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className={`text-center ${h2}`}>How it&nbsp;works</h2>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
            <StoryRail steps={STEPS} />
          </div>
          <div className="mt-16 text-center sm:mt-20">
            <ScrollToBookingButton className={BUTTON}>{BUTTON_LABEL}</ScrollToBookingButton>
          </div>
        </div>
      </section>

      {/* The form */}
      <section id="book" className="scroll-mt-16 bg-vellum-deep px-6 py-20 sm:py-28">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="text-center md:text-left">
            <h2 className={h2}>See what your parish&rsquo;s website could&nbsp;be</h2>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-ink/70">
              Tell us where your current site is. On the next page you can pick
              a style and tell us anything you&rsquo;d like changed.
            </p>
            <ul className="mx-auto mt-8 max-w-sm space-y-3 text-left text-lg md:mx-0">
              {["Delivered in 3 business days", "A live site you can click through", "Your current site stays untouched"].map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <Check className="h-5 w-5 shrink-0 text-emerald-600" strokeWidth={3} aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <FreeWebsiteForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 sm:py-24">
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
                  {faq.answer.map((p) => (
                    <p key={p} className="text-pretty">{p}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-ink px-6 py-20 text-center text-vellum sm:py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className={h2}>Your parish deserves a website as welcoming as your&nbsp;people</h2>
          <p className="mt-5 text-lg text-vellum/75">Free, live, and in your inbox in 3 business&nbsp;days.</p>
          <div className="mt-8">
            <ScrollToBookingButton className={BUTTON_GOLD}>{BUTTON_LABEL}</ScrollToBookingButton>
          </div>
        </div>
      </section>
    </>
  );
}
