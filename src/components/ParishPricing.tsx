import { Check } from "lucide-react";

/*
  Prices confirmed by Joe (2026-11-23):
  - 30-Day Kickstart $6,000, paid in full, no discounts. Campaign choice:
    plan your visit, volunteering, or an event (not giving).
  - Parish Growth $30,000/yr. Monthly reporting, homily clips, flyers,
    connection posts, 3 campaign types (not giving), and the landing
    pages and backend automations each campaign needs.
  - Parish Media Partnership $60,000/yr (Joe flies out with the team).
  The annual plans get 10% off for deciding within 21 days and 10% off for
  paying in full, and the two stack. Whether stacking is a flat 20% or 10%
  then 10% isn't confirmed, so the page never shows a combined price.
  Kept deliberately minimal: the page is sent to prospects after a call,
  so details are covered there. No booking CTAs, not linked from Nav.

  Visual hierarchy is intentional: Kickstart is a compact card, Growth is
  a fuller white card, Partnership is the large dark premium card.
*/

type Tier = "basic" | "mid" | "premium";

type Plan = {
  name: string;
  price: string;
  period: string;
  tier: Tier;
  badge?: string;
  lead?: string;
  features: string[];
  note?: string;
};

const plans: Record<Tier, Plan> = {
  basic: {
    name: "30-Day Kickstart",
    price: "$6,000",
    period: "for 30 days, paid in full",
    tier: "basic",
    features: ["8 homily clips", "1 Meta ad campaign", "Social media and ads setup"],
  },
  mid: {
    name: "Parish Growth",
    price: "$30,000",
    period: "per year",
    tier: "mid",
    features: [
      "2 homily clips a week, edited and published",
      "Flyers and connection posts",
      "12 ad campaigns a year for Plan Your Visit, volunteering, and parish events",
      "Landing pages and follow-up automations built for every campaign",
      "Monthly reports",
    ],
  },
  premium: {
    name: "Parish Media Partnership",
    price: "$60,000",
    period: "per year",
    tier: "premium",
    badge: "Our most complete plan",
    lead: "Everything in Parish Growth, plus:",
    features: [
      "Joe flies out for several days to film your parish",
      "52 professionally filmed Sunday reflections from your pastor, plus footage of parish life",
      "A giving campaign, filmed on-site and launched as soon as we're back",
      "A professional homily recording system, installed in your church",
      "3 videos a week instead of 2",
      "15 ad campaigns a year instead of 12",
    ],
    note: "The giving campaign aims for $5,000 a month in new recurring gifts, enough to cover the partnership.",
  },
};

const cardStyles: Record<Tier, string> = {
  basic: "bg-white p-8 text-ink shadow-xl shadow-ink/5 ring-1 ring-ink/5",
  mid: "bg-white p-9 text-ink shadow-2xl shadow-lapis/10 ring-2 ring-lapis/20",
  premium: "bg-ink p-10 text-vellum shadow-2xl shadow-ink/40 ring-2 ring-gilt-light/60",
};

function PlanCard({ plan }: { plan: Plan }) {
  const dark = plan.tier === "premium";
  const compact = plan.tier === "basic";

  return (
    <div className={`flex flex-col rounded-3xl ${cardStyles[plan.tier]}`}>
      {plan.badge && (
        <p className="mb-5 self-start rounded-full bg-gilt-light px-3.5 py-1 text-sm font-semibold text-ink">
          {plan.badge}
        </p>
      )}

      {compact ? (
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1">
          <h2 className="font-serif text-2xl font-medium">{plan.name}</h2>
          <div className="text-right">
            <p className="font-serif text-3xl font-medium">{plan.price}</p>
            <p className="mt-1 text-ink/60">{plan.period}</p>
          </div>
        </div>
      ) : (
        <>
          <h2 className={`font-serif font-medium ${dark ? "text-3xl" : "text-[1.75rem]"}`}>{plan.name}</h2>
          <p className={`mt-5 font-serif font-medium ${dark ? "text-6xl" : "text-5xl"}`}>{plan.price}</p>
          <p className={`mt-1 ${dark ? "text-vellum/60" : "text-ink/60"}`}>{plan.period}</p>
        </>
      )}

      {plan.lead && <p className="mt-8 font-semibold text-gilt-light">{plan.lead}</p>}

      <ul className={`${plan.lead ? "mt-4" : compact ? "mt-6" : "mt-7"} space-y-3`}>
        {plan.features.map((f) => (
          <li key={f} className={`flex items-start gap-3 ${dark ? "text-vellum/85" : "text-ink/80"}`}>
            <Check
              aria-hidden="true"
              strokeWidth={2.5}
              className={`mt-1 h-4 w-4 shrink-0 ${dark ? "text-gilt-light" : plan.tier === "mid" ? "text-lapis" : "text-gold-deep"}`}
            />
            <span className="text-pretty">{f}</span>
          </li>
        ))}
      </ul>

      {plan.note && (
        <p className="mt-8 rounded-2xl bg-gilt-light/10 p-5 text-pretty text-vellum/85 ring-1 ring-gilt-light/40">
          {plan.note}
        </p>
      )}
    </div>
  );
}

export default function ParishPricing() {
  return (
    <section className="bg-vellum px-6 py-16 sm:py-24">
      <h1 className="text-center font-serif text-4xl font-medium text-ink sm:text-5xl">
        Pricing
      </h1>

      <div className="mx-auto mt-12 grid max-w-md gap-6 lg:max-w-5xl lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <PlanCard plan={plans.basic} />
          <PlanCard plan={plans.mid} />
        </div>
        <PlanCard plan={plans.premium} />
      </div>

      <p className="mx-auto mt-10 max-w-xl text-balance text-center text-ink/70">
        On the annual plans, save 10% when you decide within 21 days of your
        call, and another 10% when you pay for the year in&nbsp;full. Ad spend
        is billed separately.
      </p>
    </section>
  );
}
