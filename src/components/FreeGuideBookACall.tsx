import Script from "next/script";
import { Mrs_Saint_Delafield } from "next/font/google";
import { ArrowDown } from "lucide-react";
import DeliveryAnimation from "@/components/DeliveryAnimation";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import LetterGreeting from "@/components/LetterGreeting";
import ScrollToBookingButton from "@/components/ScrollToBookingButton";
import { buttonClass } from "@/components/buttonStyles";

// Handwritten signature on the letter
const signature = Mrs_Saint_Delafield({ weight: "400", subsets: ["latin"] });

const CALENDLY_URL = "https://calendly.com/parishmedia/consult";

const VSL = {
  videoId: "1233188537",
  title: "Parish Media VSL 1",
};

export default function FreeGuideBookACall() {
  return (
    <>
      <div className="pmc-rise mx-auto max-w-2xl text-center">
        <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
        <h1 className="mt-8 text-balance font-serif text-3xl font-semibold text-navy sm:text-4xl">
          Your Free Book Is on Its Way.
        </h1>
        <div className="mt-7">
          <DeliveryAnimation />
        </div>
      </div>

      {/* A short note from Joe, set like a letter on stacked paper */}
      <div className="pmc-rise pmc-rise-2 relative mx-auto mt-10 max-w-xl">
        {/* Second sheet peeking out behind */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rotate-[2.2deg] rounded-sm bg-[#f6efe1] shadow-md shadow-navy/10 ring-1 ring-navy/5"
        />
        <div className="relative -rotate-[0.6deg] rounded-sm bg-[#fffdf8] px-7 pb-9 pt-8 text-left shadow-xl shadow-navy/10 ring-1 ring-navy/10 sm:px-12 sm:pb-12 sm:pt-10">
          {/* Letterhead */}
          <div className="flex items-center justify-between gap-4 border-b border-gold/40 pb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-navy/45">
              Parish Media Company
            </p>
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold/70" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path d="M12 3v18M7 8h10" strokeLinecap="round" />
            </svg>
          </div>

          <div className="mt-7 space-y-5 text-pretty font-serif text-[1.075rem] leading-[1.8] text-navy/85">
            <LetterGreeting />
            <p>
              Your book will arrive by email in a couple of minutes. It explains
              everything when it comes to social media for parishes, both organic
              posting and paid&nbsp;ads.
            </p>
            <p>
              If you&rsquo;d rather not add strategy, ad campaigns, content
              creation, and video editing to your staff&rsquo;s workload, we can
              handle the implementation for you. That way, your team can focus
              less on the technical side and more on ministry&nbsp;work.
            </p>
            <p>
              If that sounds helpful, book a free 30-minute Parish
              Growth Assessment below and we&rsquo;ll create a social media game
              plan for your parish. You can keep the plan whether we work together
              or&nbsp;not.
            </p>
          </div>

          {/* Sign-off */}
          <div className="mt-8">
            <p className="font-serif text-[1.075rem] italic text-navy/70">In Christ,</p>
            <p
              className={`${signature.className} mt-1 -rotate-3 py-2 text-5xl leading-none text-navy sm:text-6xl`}
              aria-hidden="true"
            >
              Joe Jarrell
            </p>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.15em] text-navy">
              Joe Jarrell
            </p>
            <p className="text-sm text-navy/60">Founder, Parish Media Company</p>
          </div>
        </div>
      </div>

      {/* Jump past the video to the booking section */}
      <div className="mt-12 flex justify-center">
        <ScrollToBookingButton className={buttonClass("primary")}>
          Book Your Free Assessment
          <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transition-none" aria-hidden="true" />
        </ScrollToBookingButton>
      </div>

      <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl bg-navy/5 py-6 sm:py-8">
        <h2 className="text-balance px-6 text-center font-serif text-2xl font-semibold text-navy sm:px-8 sm:text-3xl">
          Watch: What to Expect on Your Parish Growth&nbsp;Assessment
        </h2>
        <div className="relative mt-6" style={{ paddingTop: "56.25%" }}>
          <iframe
            src={`https://player.vimeo.com/video/${VSL.videoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
            title={VSL.title}
          />
        </div>
        <Script src="https://player.vimeo.com/api/player.js" strategy="afterInteractive" />
      </div>

      <div id="book" className="mx-auto mt-10 max-w-xl scroll-mt-8 text-center">
        <p className="text-balance font-serif text-2xl font-semibold text-navy sm:text-3xl">
          Before You Book&hellip;
        </p>
        <p className="mt-4 text-pretty text-lg text-navy/80">
          To make this conversation as useful as possible for your parish,{" "}
          <strong className="font-semibold text-navy">
            we ask that the pastor join the call.
          </strong>{" "}
          Assistant priests, deacons, and office staff are welcome to book,
          provided they can bring the pastor into the&nbsp;meeting.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <CalendlyEmbed url={CALENDLY_URL} />
      </div>
    </>
  );
}
