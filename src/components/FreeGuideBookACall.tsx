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
        <p className="mt-4 text-pretty text-lg text-navy/70">
          {isPriest
            ? "Before you close this page, reserve your no-cost 30-minute parish outreach consult."
            : "Book a quick 10-minute triage call to see if a full consult for Father makes sense."}
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
              On this call, we will:
            </p>
            <ul className="mt-3 space-y-2">
              <CheckItem>
                Review how people currently find your parish online (Google,
                Facebook, website)
              </CheckItem>
              <CheckItem>
                Spot the biggest &ldquo;leaks&rdquo; between first visit and
                becoming a regular Mass attendee
              </CheckItem>
              <CheckItem>
                Choose 1&ndash;2 simple outreach steps your team can take in
                the next 30 days
              </CheckItem>
              <CheckItem>
                If helpful, sketch a 90-day Facebook / Instagram pilot
                tailored to your parish
              </CheckItem>
            </ul>

            <p className="mt-6 text-pretty text-navy/80">
              You will leave with a clear outreach plan you can share with
              your staff or pastoral council.
            </p>

            <p className="mt-4 text-pretty text-navy/80">
              I only hold a small number of these consults each week for
              pastors who request the book, so if this would serve your
              parish, please choose a time that works for you below.
            </p>

            <p className="mt-4 text-pretty text-sm text-navy/60">
              No pressure, no long presentation, and no obligation. Just a
              focused conversation about your parish and the people you hope
              to reach.
            </p>

            <p className="mt-6 text-pretty text-navy/80">
              <strong>Step 1:</strong> Pick an available time on the calendar
              below.
            </p>
            <p className="mt-2 text-pretty text-navy/80">
              <strong>Step 2:</strong> Add it to your calendar, and
              I&rsquo;ll send a brief confirmation email with the Zoom link.
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
                efforts
              </CheckItem>
              <CheckItem>
                Note any constraints (time, budget, diocesan policies)
              </CheckItem>
            </ul>

            <p className="mt-6 font-semibold text-navy">
              Decide together whether to:
            </p>
            <ul className="mt-3 space-y-2">
              <CheckItem>Recommend a full consult with Father, or</CheckItem>
              <CheckItem>
                Send you a short custom action plan to use in-house
              </CheckItem>
            </ul>
          </>
        )}
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <CalendlyEmbed url={calendlyUrl} />
      </div>
    </>
  );
}
