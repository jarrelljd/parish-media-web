import Script from "next/script";
import CalendlyEmbed from "@/components/CalendlyEmbed";

const CALENDLY_URL = "https://calendly.com/parishmedia/consult";

const VSL = {
  videoId: "1233188537",
  title: "Parish Media VSL 1",
};

export default function FreeGuideBookACall() {
  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
        <h1 className="mt-8 text-balance font-serif text-3xl font-semibold text-navy sm:text-4xl">
          Your Free Book Is on Its Way.
        </h1>
        <div
          className="relative mx-auto mt-6 h-14 w-64 max-w-full"
          aria-hidden="true"
        >
          <style>{`
            @keyframes pmc-delivery-truck {
              0% { left: -15%; opacity: 0; }
              10% { opacity: 1; }
              55% { left: 66%; opacity: 1; }
              72% { left: 66%; opacity: 1; }
              88% { left: 66%; opacity: 0; }
              100% { left: -15%; opacity: 0; }
            }
            .pmc-delivery-truck {
              animation: pmc-delivery-truck 4s ease-in-out infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .pmc-delivery-truck {
                animation: none;
                left: 66%;
                opacity: 1;
              }
            }
          `}</style>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-3xl">
            📧
          </span>
          <div className="pmc-delivery-truck absolute top-1/2 flex -translate-y-1/2 flex-col items-center">
            <span className="text-base leading-none">📖</span>
            <span
              className="text-3xl leading-none"
              style={{ transform: "scaleX(-1)" }}
            >
              🚚
            </span>
          </div>
        </div>
        <p className="mt-4 text-pretty text-lg text-navy/70">
          Your book will arrive by email shortly. Watch the video below,
          then reserve your free 30-minute Parish Growth Assessment to
          create a practical social media plan for your&nbsp;parish.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl bg-navy/5 py-6 sm:py-8">
        <h2 className="text-balance px-6 text-center font-serif text-2xl font-semibold text-navy sm:px-8 sm:text-3xl">
          How Your Parish Can Reach More People Through Social Media
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

      <div className="mx-auto mt-10 max-w-xl text-center">
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
