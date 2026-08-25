import Script from "next/script";
import CalendlyEmbed from "@/components/CalendlyEmbed";

const CALENDLY_URL_PRIEST = "https://calendly.com/parishmedia/consult";
const CALENDLY_URL_STAFF =
  "https://calendly.com/parishmedia/triage?hide_gdpr_banner=1&background_color=faf8f4&text_color=c9a227&primary_color=1b2a4a";

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-navy/80">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold"
        aria-hidden="true"
      >
        &#10003;
      </span>
      <span className="text-pretty">{children}</span>
    </li>
  );
}

export default function FreeGuideBookACall({
  isPriest,
}: {
  isPriest: boolean;
}) {
  const calendlyUrl = isPriest ? CALENDLY_URL_PRIEST : CALENDLY_URL_STAFF;

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
            ? "Before you close this page, reserve your no-cost 30-minute parish outreach consult."
            : "Watch this 60-sec video to see how your parish can reach more people. Then, book a free 10-min call to talk about your parish’s goals."}
        </p>
      </div>

      {!isPriest && (
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-balance text-center font-serif text-2xl font-semibold text-navy sm:text-3xl">
            How Your Parish Can Reach More People Through Social Media
          </h2>
          <div
            className="relative mt-6 overflow-hidden rounded-xl shadow-lg"
            style={{ paddingTop: "56.25%" }}
          >
            <iframe
              src="https://player.vimeo.com/video/1221266693?badge=0&autopause=0&player_id=0&app_id=58479"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full border-0"
              title="Triage Call VSL"
            />
          </div>
          <Script src="https://player.vimeo.com/api/player.js" strategy="afterInteractive" />
        </div>
      )}

      {isPriest ? (
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
          <p className="text-pretty text-navy/80">
            Thank you for requesting{" "}
            <em>Social Media for Catholic Churches</em>. It will arrive in
            your inbox in the next few minutes.
          </p>

          <p className="mt-4 text-pretty text-navy/80">
            Because you requested the book, you&rsquo;re invited to a
            one-time, no-cost 30-minute Zoom conversation to apply it to
            your parish.
          </p>

          <p className="mt-6 font-semibold text-navy">
            In this brief Zoom call we will:
          </p>
          <ul className="mt-3 space-y-2">
            <CheckItem>
              See how people currently find your parish online
            </CheckItem>
            <CheckItem>
              Identify the biggest gap between a first visit and regular
              Mass attendance
            </CheckItem>
            <CheckItem>
              Choose 1&ndash;2 simple outreach steps for the next 30 days
            </CheckItem>
          </ul>

          <p className="mt-6 text-pretty text-sm text-navy/60">
            No pressure or long presentation, just a focused conversation
            about your parish.
          </p>

          <p className="mt-4 text-pretty text-navy/80">
            Please choose a time on the calendar below.
          </p>
        </div>
      ) : (
        <div className="mx-auto mt-10 max-w-xl text-center">
          <p className="text-balance font-serif text-2xl font-semibold text-navy sm:text-3xl">
            Want to see how this could work for your parish?
          </p>
          <p className="mt-4 text-pretty text-lg text-navy/80">
            Book a free 10-min call with Joe to review your social media
            and see if it makes sense to keep talking.
          </p>
        </div>
      )}

      <div className="mx-auto mt-10 max-w-3xl">
        <CalendlyEmbed url={calendlyUrl} />
      </div>
    </>
  );
}
