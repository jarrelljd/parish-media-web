import { Check } from "lucide-react";

/*
  Prices confirmed by Joe (2026-11-23):
  - 30-Day Pilot $6,000, paid in full, no discounts. Campaign choice:
    plan your visit, volunteering, or an event (not giving). If the parish
    continues into Parish Growth within 30 days, the $6,000 is credited
    toward the annual engagement.
  - Parish Growth $30,000/yr. Recommended plan. Monthly reporting, homily
    clips, flyers, connection posts, 3 campaign types (not giving), and the
    landing pages and backend automations each campaign needs.
  - Parish Growth and Giving Engine $60,000/yr (formerly Parish Media
    Partnership; Joe flies out with the team). The recurring giving
    campaign is the headline proposition of the page.
  The annual plans get 10% off for deciding within 21 days and 10% off for
  paying in full, and the two stack. Whether stacking is a flat 20% or 10%
  then 10% isn't confirmed, so the page never shows a combined price.
  Sent to prospects after a call. No booking CTAs, not linked from Nav.

  Page order (Joe, 2026-11-23): simple heading, $60k anchor, $30k
  recommended, $6k pilot, ad spend note, FAQ.
*/

const engine = {
  name: "Parish Growth and Giving Engine",
  price: "$60,000",
  period: "per year",
  lead: "Everything in Parish Growth, plus:",
  features: [
    "Joe flies out for several days to film your parish",
    "52 professionally filmed Sunday reflections from your pastor, plus footage of parish life",
    "A professional homily recording system, installed in your church",
    "3 videos a week instead of 2",
    "15 ad campaigns a year instead of 12",
  ],
};

const growth = {
  name: "Parish Growth",
  price: "$30,000",
  period: "per year",
  badge: "Best fit for most parishes",
  description:
    "A year-round system for increasing parish visibility, event participation, volunteer inquiries, and visits without adding work to parish staff.",
  features: [
    "2 homily clips a week, edited and published",
    "Flyers and connection posts",
    "12 ad campaigns a year for Plan Your Visit, volunteering, and parish events",
    "Landing pages and follow-up automations built for every campaign",
    "Monthly reports",
  ],
};

const pilot = {
  name: "30-Day Pilot",
  price: "$6,000",
  period: "for 30 days, paid in full",
  description:
    "A 30-day proof-of-concept for parishes that want to see the system in action before committing to an annual partnership.",
  features: ["8 homily clips", "1 Meta ad campaign", "Social media and ads setup"],
  credit:
    "If you continue into Parish Growth within 30 days, your $6,000 pilot fee is credited toward the annual engagement.",
};

/*
  FAQ answers are drafts built only from facts already on this page.
  Joe to confirm wording before this goes live.
*/
const faqs = [
  {
    q: "Can I take this to my finance council first?",
    a: "Yes, and most pastors do. The 10% decision discount stays open for 21 days after your call, which is enough time for a council meeting. If it would help, we're glad to answer the council's questions directly.",
  },
  {
    q: "How does the on-site filming work?",
    a: "On the Parish Growth and Giving Engine, Joe and the team fly out and spend several days at your parish. In that visit we film 52 Sunday reflections with your pastor, capture footage of parish life, film the giving campaign, and install the homily recording system. We work around your Mass and office schedule.",
  },
  {
    q: "What's the timeline?",
    a: "The pilot runs for 30 days. The annual plans run for 12 months. On the Giving Engine, the recurring giving campaign launches as soon as we're back from filming.",
  },
  {
    q: "What does success look like?",
    a: "For the Giving Engine, new recurring gifts, with the campaign designed to create up to $5,000 per month. For Parish Growth, more people seeing your parish, coming to events, asking about volunteering, and planning a visit, all tracked in your monthly report. For the pilot, one campaign that shows you the system working before you commit to a year.",
  },
];

function Feature({ text, tone }: { text: string; tone: "dark" | "lapis" | "gold" }) {
  const iconColor = tone === "dark" ? "text-gilt-light" : tone === "lapis" ? "text-lapis" : "text-gold-deep";
  return (
    <li className={`flex items-start gap-3 ${tone === "dark" ? "text-vellum/85" : "text-ink/80"}`}>
      <Check aria-hidden="true" strokeWidth={2.5} className={`mt-1 h-4 w-4 shrink-0 ${iconColor}`} />
      <span className="text-pretty">{text}</span>
    </li>
  );
}

export default function ParishPricing() {
  return (
    <section className="bg-vellum px-6 py-16 sm:py-24">
      <h1 className="text-center font-serif text-4xl font-medium text-ink sm:text-5xl">
        Plans and Pricing
      </h1>

      {/* $60k anchor */}
      <div className="mx-auto mt-12 max-w-5xl rounded-3xl bg-ink p-8 text-vellum shadow-2xl shadow-ink/40 ring-2 ring-gilt-light/60 sm:p-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col">
            <h2 className="text-balance font-serif text-3xl font-medium sm:text-4xl">{engine.name}</h2>
            <p className="mt-5 font-serif text-6xl font-medium">{engine.price}</p>
            <p className="mt-1 text-vellum/60">{engine.period}</p>

            <div className="mt-8 rounded-2xl bg-gilt-light/10 p-6 ring-1 ring-gilt-light/50">
              <p className="font-serif text-2xl font-medium text-gilt-light">
                The recurring giving campaign
              </p>
              <p className="mt-3 text-pretty text-vellum/90">
                Filmed on-site at your parish and launched as soon as we&apos;re back. Designed
                to create up to $5,000 per month in new recurring&nbsp;gifts.
              </p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gilt-light">{engine.lead}</p>
            <ul className="mt-4 space-y-3">
              {engine.features.map((f) => (
                <Feature key={f} text={f} tone="dark" />
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* $30k recommended, then $6k pilot */}
      <div className="mx-auto mt-6 grid max-w-5xl gap-6 lg:grid-cols-[1.25fr_1fr]">
        <div className="flex flex-col rounded-3xl bg-white p-9 text-ink shadow-2xl shadow-lapis/10 ring-2 ring-lapis/40">
          <p className="mb-5 self-start rounded-full bg-lapis px-3.5 py-1 text-sm font-semibold text-white">
            {growth.badge}
          </p>
          <h2 className="font-serif text-[1.75rem] font-medium">{growth.name}</h2>
          <p className="mt-5 font-serif text-5xl font-medium">{growth.price}</p>
          <p className="mt-1 text-ink/60">{growth.period}</p>
          <p className="mt-6 text-pretty text-ink/80">{growth.description}</p>
          <ul className="mt-6 space-y-3">
            {growth.features.map((f) => (
              <Feature key={f} text={f} tone="lapis" />
            ))}
          </ul>
        </div>

        <div className="flex flex-col rounded-3xl bg-white p-8 text-ink shadow-xl shadow-ink/5 ring-1 ring-ink/5">
          <h2 className="font-serif text-2xl font-medium">{pilot.name}</h2>
          <p className="mt-4 font-serif text-4xl font-medium">{pilot.price}</p>
          <p className="mt-1 text-ink/60">{pilot.period}</p>
          <p className="mt-6 text-pretty text-ink/80">{pilot.description}</p>
          <ul className="mt-6 space-y-3">
            {pilot.features.map((f) => (
              <Feature key={f} text={f} tone="gold" />
            ))}
          </ul>
          <p className="mt-8 rounded-2xl bg-vellum p-5 text-pretty text-ink/80 ring-1 ring-ink/10">
            {pilot.credit}
          </p>
        </div>
      </div>

      {/* Ad spend + discounts */}
      <p className="mx-auto mt-10 max-w-2xl text-balance text-center text-ink/70">
        Ad spend is billed separately and isn&apos;t included in the prices above. On the annual
        plans, save 10% when you decide within 21 days of your call, and another 10% when you pay
        for the year in&nbsp;full.
      </p>

      {/* FAQ */}
      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center font-serif text-3xl font-medium text-ink sm:text-4xl">
          Common questions
        </h2>
        <div className="mt-8 space-y-3">
          {faqs.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5 open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl font-medium text-ink">
                {q}
                <span
                  aria-hidden="true"
                  className="text-2xl leading-none text-gold-deep transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-pretty text-ink/75">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
