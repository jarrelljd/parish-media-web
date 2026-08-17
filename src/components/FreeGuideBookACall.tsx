import CalendlyEmbed from "@/components/CalendlyEmbed";

const CALENDLY_URL_PRIEST = "https://calendly.com/parishmedia/consult";
const CALENDLY_URL_STAFF = "https://calendly.com/parishmedia/triage";

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
            : "Before you close this page, book a quick 10-minute triage call to see if a full consult for Father makes sense."}
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
        {isPriest ? (
          <>
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
          </>
        ) : (
          <>
            <p className="text-pretty text-navy/80">
              Thank you for requesting{" "}
              <em>Social Media for Catholic Churches</em>. It will arrive in
              your inbox shortly.
            </p>

            <p className="mt-4 text-pretty text-navy/80">
              Because you indicated you&rsquo;re parish staff, the next step
              is a brief 10-minute triage call. The goal is to see whether a
              full consult with your priest would actually be helpful right
              now.
            </p>

            <p className="mt-6 font-semibold text-navy">
              On this short call we will:
            </p>
            <ul className="mt-3 space-y-2">
              <CheckItem>
                Clarify what you&rsquo;re hoping to improve (Mass attendance,
                events, volunteers, etc.)
              </CheckItem>
              <CheckItem>
                Get a quick picture of your current Facebook / Instagram
                efforts and any limits (time, budget, diocesan policies)
              </CheckItem>
              <CheckItem>
                Decide whether it makes sense to recommend a full consult
                with Father or simply email you a short custom action plan
                you can use in-house or share with him
              </CheckItem>
            </ul>

            <p className="mt-6 text-pretty text-sm text-navy/60">
              No pressure. It&rsquo;s just to give you clear next steps
              without wasting your time or Father&rsquo;s.
            </p>

            <p className="mt-4 text-pretty text-navy/80">
              Please choose a time on the calendar below.
            </p>
          </>
        )}
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <CalendlyEmbed url={calendlyUrl} />
      </div>
    </>
  );
}
