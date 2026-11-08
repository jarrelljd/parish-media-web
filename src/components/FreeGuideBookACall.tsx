import Image from "next/image";
import Script from "next/script";
import { Mrs_Saint_Delafield } from "next/font/google";
import DeliveryAnimation from "@/components/DeliveryAnimation";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import LetterGreeting from "@/components/LetterGreeting";
import ScrollToBookingButton from "@/components/ScrollToBookingButton";
import navePhoto from "../../public/images/events/st-mary-mountains/landing/nave.jpg";

// Handwritten signature on the letter
const signature = Mrs_Saint_Delafield({ weight: "400", subsets: ["latin"] });

const CALENDLY_URL =
  "https://calendly.com/parishmedia/consult?hide_gdpr_banner=1&text_color=1d1a16&primary_color=1f3263";

const VSL = {
  videoId: "1233188537",
  title: "Parish Media VSL 1",
};

// Same look as the Social Media page (ParishGrowthContent)
const BUTTON =
  "inline-flex items-center justify-center rounded-[3px] bg-lapis px-9 py-4 text-base font-semibold text-vellum transition-colors hover:bg-lapis-deep";
// Shorter label on phones so the button stays on one line
const BUTTON_LABEL = (
  <>
    <span className="sm:hidden">Book your free assessment</span>
    <span className="hidden sm:inline">Book your free 30-minute assessment</span>
  </>
);
const rubric = "font-serif text-lg italic text-rubric";
const h2 = "font-serif text-4xl font-medium leading-[1.08] text-balance sm:text-5xl";

export default function FreeGuideBookACall() {
  return (
    <>
      {/* Hero: church photo behind the headline; the letter overlaps the
          seam between the dark band and the light page. */}
      <section className="pb-16 sm:pb-20">
        <div className="relative overflow-hidden bg-ink px-6 pb-40 pt-14 sm:pb-44 sm:pt-20">
          <Image
            src={navePhoto}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_45%] opacity-45 motion-safe:animate-kenburns"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/70 to-ink" />
          <div className="pmc-rise relative mx-auto max-w-3xl text-center">
            <p className="font-serif text-xl italic text-[#e3a196]">Your free book</p>
            <h1 className="mt-3 text-balance font-serif text-[2.6rem] font-medium leading-[1.06] text-vellum sm:text-6xl">
              Your book is on its&nbsp;way.
            </h1>
            <div className="mt-8">
              <DeliveryAnimation />
            </div>
          </div>
        </div>

        {/* A short note from Joe, set like a letter on stacked paper */}
        <div className="pmc-rise pmc-rise-2 relative mx-auto -mt-28 max-w-xl px-5 sm:px-0">
          {/* Second sheet peeking out behind */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-5 right-5 rotate-[2.2deg] rounded-sm bg-[#f6efe1] shadow-md shadow-ink/20 ring-1 ring-ink/5 sm:left-0 sm:right-0"
          />
          <div className="relative -rotate-[0.6deg] rounded-sm bg-[#fffdf8] px-7 pb-9 pt-8 text-left shadow-2xl shadow-ink/25 ring-1 ring-ink/10 sm:px-12 sm:pb-12 sm:pt-10">
            {/* Letterhead */}
            <div className="flex items-center justify-between gap-4 border-b border-rubric/25 pb-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/45">
                Parish Media Company
              </p>
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-rubric/70" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path d="M12 3v18M7 8h10" strokeLinecap="round" />
              </svg>
            </div>

            <div className="mt-7 space-y-5 text-pretty font-serif text-[1.075rem] leading-[1.8] text-ink/85">
              <LetterGreeting />
              <p>
                Your book will arrive by email in a few minutes. It explains how
                parishes can use organic social media and paid advertising to
                attract young families and better engage current&nbsp;parishioners.
              </p>
              <p>
                You can absolutely learn and implement everything internally.
                I&rsquo;ve even included free video tutorials on my website
                to&nbsp;help.
              </p>
              <p>
                But let&rsquo;s be honest: most parish teams are not going to have
                someone learn video editing, targeted advertising, Meta tracking,
                content strategy, and everything else required to make this
                work&nbsp;consistently.
              </p>
              <p>
                Not because your team doesn&rsquo;t care, but because
                they&rsquo;re already busy serving the parish. New systems like
                this usually get pushed aside by more urgent responsibilities, and
                learning an entirely new set of technical skills rarely becomes
                a&nbsp;priority.
              </p>
              <p>
                And without consistent implementation, the strategies in this book
                will remain ideas instead of producing&nbsp;results.
              </p>
              <p>
                So you have two choices: continue leaving social media underused,
                or have someone implement the system for&nbsp;you.
              </p>
              <p>
                If you&rsquo;d rather not add strategy, content creation,
                advertising, and video editing to your team&rsquo;s workload, we
                can handle it for you. Your staff can spend less time managing
                technology and more time focused on&nbsp;ministry.
              </p>
              <p>
                Book a free 30&#8209;minute Parish Growth Assessment below.
                We&rsquo;ll create a social media game plan for your parish, and
                you can keep it whether we work together or&nbsp;not.
              </p>
            </div>

            {/* Sign-off */}
            <div className="mt-8">
              <p className="font-serif text-[1.075rem] italic text-ink/70">In Christ,</p>
              <p
                className={`${signature.className} mt-1 -rotate-3 py-2 text-5xl leading-none text-lapis sm:text-6xl`}
                aria-hidden="true"
              >
                Joe Jarrell
              </p>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.15em] text-ink">
                Joe Jarrell
              </p>
              <p className="text-sm text-ink/60">Founder, Parish Media Company</p>
            </div>
          </div>
        </div>

        <div className="mt-14 px-6 text-center">
          <ScrollToBookingButton className={BUTTON}>{BUTTON_LABEL}</ScrollToBookingButton>
        </div>
      </section>

      {/* What to expect on the call */}
      <section className="bg-vellum-deep px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className={rubric}>What to expect</p>
          <h2 className={`mt-2 ${h2}`}>Your Parish Growth&nbsp;Assessment</h2>
          <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-[4px] bg-ink shadow-2xl shadow-ink/30 ring-1 ring-ink/10">
            <iframe
              src={`https://player.vimeo.com/video/${VSL.videoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full border-0"
              title={VSL.title}
            />
          </div>
          <Script src="https://player.vimeo.com/api/player.js" strategy="afterInteractive" />
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
          <CalendlyEmbed url={CALENDLY_URL} />
        </div>
      </section>
    </>
  );
}
