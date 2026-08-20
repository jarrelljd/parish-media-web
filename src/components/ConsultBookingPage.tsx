import CalendlyEmbed from "@/components/CalendlyEmbed";

const CALENDLY_URL_PRIEST = "https://calendly.com/parishmedia/consult";
const CALENDLY_URL_STAFF = "https://calendly.com/parishmedia/triage";

export type ConsultVariant = "priest" | "vocations" | "staff";

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

export default function ConsultBookingPage({
  variant,
}: {
  variant: ConsultVariant;
}) {
  const calendlyUrl =
    variant === "staff" ? CALENDLY_URL_STAFF : CALENDLY_URL_PRIEST;

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
        <h1 className="mt-8 text-balance font-serif text-3xl font-semibold text-navy sm:text-4xl">
          {variant === "priest" &&
            "You’re Invited to a Free Consult, Father."}
          {variant === "vocations" &&
            "You’re Invited to a Free Vocations Outreach Consult."}
          {variant === "staff" && "Let’s Get You Scheduled."}
        </h1>
        <p className="mt-4 text-pretty text-lg text-navy/70">
          {variant === "priest" &&
            "Before you close this page, reserve your no-cost 30-minute parish outreach consult."}
          {variant === "vocations" &&
            "Before you close this page, reserve your no-cost 30-minute vocations outreach consult."}
          {variant === "staff" &&
            "Before you close this page, book a quick 10-minute triage call to see if a full consult for Father makes sense."}
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
        {variant === "priest" && (
          <>
            <p className="text-pretty text-navy/80">
              You&rsquo;re invited to a one-time, no-cost 30-minute Zoom
              conversation to talk through outreach for your parish.
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
        )}

        {variant === "vocations" && (
          <>
            <p className="text-pretty text-navy/80">
              You&rsquo;re invited to a no-cost 30-minute Zoom consult to
              talk through outreach for your vocations office.
            </p>

            <p className="mt-6 font-semibold text-navy">
              In this brief Zoom call we will:
            </p>
            <ul className="mt-3 space-y-2">
              <CheckItem>
                See how men discerning their vocation currently connect
                with your vocations office
              </CheckItem>
              <CheckItem>
                Identify your vocations office&rsquo;s primary goal over the
                next 90 days
              </CheckItem>
              <CheckItem>
                Develop a 90-day outreach plan to hit that goal
              </CheckItem>
            </ul>

            <p className="mt-6 text-pretty text-sm text-navy/60">
              No pressure or long presentation, just a focused conversation
              about your vocations office.
            </p>

            <p className="mt-4 text-pretty text-navy/80">
              Please choose a time on the calendar below.
            </p>
          </>
        )}

        {variant === "staff" && (
          <>
            <p className="text-pretty text-navy/80">
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
