import CalendlyEmbed from "@/components/CalendlyEmbed";

const CALENDLY_URL_PRIEST = "https://calendly.com/parishmedia/consult";
const CALENDLY_URL_STAFF = "https://calendly.com/parishmedia/triage";

export default function CalendlyBooking({ role }: { role?: string }) {
  const isPriest = role === "Priest";
  const calendlyUrl = isPriest ? CALENDLY_URL_PRIEST : CALENDLY_URL_STAFF;

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
        <h1 className="mt-8 font-serif text-3xl font-semibold text-navy sm:text-4xl">
          Thanks! Let&rsquo;s Talk.
        </h1>
        <p className="mt-4 text-lg text-navy/70">
          {isPriest
            ? "Pick a time below for a full 30-minute consultation."
            : "Pick a time below for a quick 10-minute call."}
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <CalendlyEmbed url={calendlyUrl} />
      </div>
    </>
  );
}
