import CalendlyEmbed from "@/components/CalendlyEmbed";

const CALENDLY_URL_PRIEST = "https://calendly.com/parishmedia/consult";
const CALENDLY_URL_VOCATIONS =
  "https://calendly.com/parishmedia/free-consultation-joe-jarrell-clone?hide_gdpr_banner=1&text_color=1b2a4a&primary_color=c9a227";

export type ConsultVariant = "priest" | "vocations";

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
    variant === "vocations" ? CALENDLY_URL_VOCATIONS : CALENDLY_URL_PRIEST;

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
        <h1 className="mt-8 text-balance font-serif text-3xl font-semibold text-navy sm:text-4xl">
          {variant === "priest" &&
            "You’re Invited to a Free Consult."}
          {variant === "vocations" &&
            "You’re Invited to a Free Vocations Strategy Call."}
        </h1>
        <p className="mt-4 text-pretty text-lg text-navy/70">
          {variant === "priest" &&
            "Before you close this page, reserve your no-cost 30-minute parish outreach consult."}
          {variant === "vocations" &&
            "Before you close this page, reserve your no-cost 30-minute vocations strategy call below."}
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
              You&rsquo;re invited to a no-cost 30-minute Zoom strategy call
              to talk through outreach for your vocations office.
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
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        {/* Priest and vocations calls both count as a booked call for Meta
            ad tracking. */}
        <CalendlyEmbed url={calendlyUrl} trackScheduleEvent />
      </div>
    </>
  );
}
