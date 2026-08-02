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

export default function FreeGuideBookACall({ role }: { role?: string }) {
  const isPriest = role === "Priest";
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
            ? "While you wait, schedule your complimentary 30-minute parish outreach consult."
            : "Book a quick 10-minute triage call to see if a full consult for Father makes sense."}
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
        <p className="text-pretty text-navy/80">
          Thank you for requesting <em>Social Media for Catholic Churches</em>
          . It will arrive in your inbox shortly.
        </p>

        {isPriest ? (
          <>
            <p className="mt-4 text-pretty text-navy/80">
              As a bonus, you qualify for a free 30-minute Zoom consultation
              to apply the book to your parish.
            </p>

            <p className="mt-6 font-semibold text-navy">
              In this call we will:
            </p>
            <ul className="mt-3 space-y-2">
              <CheckItem>
                Review how people currently find your parish online
              </CheckItem>
              <CheckItem>
                Spot the biggest &ldquo;leaks&rdquo; between first visit and
                regular Mass
              </CheckItem>
              <CheckItem>
                Outline 1&ndash;2 simple outreach steps for the next 30 days
              </CheckItem>
              <CheckItem>
                If helpful, sketch a 90-day Facebook / Instagram pilot for
                your parish
              </CheckItem>
            </ul>

            <p className="mt-6 text-pretty text-sm text-navy/60">
              No pressure, no long presentation. Just a focused conversation
              about your parish and your goals.
            </p>
          </>
        ) : (
          <>
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
