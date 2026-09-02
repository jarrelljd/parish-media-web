import Script from "next/script";
import CalendlyEmbed from "@/components/CalendlyEmbed";

const CALENDLY_URL_PRIEST = "https://calendly.com/parishmedia/consult";
const CALENDLY_URL_STAFF =
  "https://calendly.com/parishmedia/triage?hide_gdpr_banner=1&background_color=faf8f4&text_color=1b2a4a&primary_color=c9a227";

const VSL = {
  priest: {
    videoId: "1220874027",
    title: "Priest Consult VSL",
  },
  staff: {
    videoId: "1221266693",
    title: "Triage Call VSL",
  },
};

export default function FreeGuideBookACall({
  isPriest,
}: {
  isPriest: boolean;
}) {
  const calendlyUrl = isPriest ? CALENDLY_URL_PRIEST : CALENDLY_URL_STAFF;
  const vsl = isPriest ? VSL.priest : VSL.staff;

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
        <h1 className="mt-8 text-balance font-serif text-3xl font-semibold text-navy sm:text-4xl">
          {isPriest
            ? "Your Free Book Is on Its Way, Father."
            : "Your Free Book Is on Its Way."}
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
          {isPriest
            ? "Watch this quick video, then reserve your no-cost 30-minute parish outreach consult below."
            : "Watch this 60-sec video to see how your parish can reach more people. Then, book a free 10-min call to talk about your parish’s goals."}
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl bg-navy/5 py-6 sm:py-8">
        <h2 className="text-balance px-6 text-center font-serif text-2xl font-semibold text-navy sm:px-8 sm:text-3xl">
          How Your Parish Can Reach More People Through Social Media
        </h2>
        <div className="relative mt-6" style={{ paddingTop: "56.25%" }}>
          <iframe
            src={`https://player.vimeo.com/video/${vsl.videoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
            title={vsl.title}
          />
        </div>
        <Script src="https://player.vimeo.com/api/player.js" strategy="afterInteractive" />
      </div>

      <div className="mx-auto mt-10 max-w-xl text-center">
        <p className="text-balance font-serif text-2xl font-semibold text-navy sm:text-3xl">
          Want to see how this could work for your parish?
        </p>
        <p className="mt-4 text-pretty text-lg text-navy/80">
          Book a free {isPriest ? "30-min" : "10-min"} call with Joe to
          review your social media and see if it makes sense to keep
          talking.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <CalendlyEmbed url={calendlyUrl} />
      </div>
    </>
  );
}
