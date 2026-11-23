import { Check, ChevronDown } from "lucide-react";

/*
  Prices confirmed by Joe (2026-11-23): Parish Growth $30,000/yr, Parish
  Media Partnership $60,000/yr (Joe flies out with the team). Both get 10%
  off for deciding within 21 days and 10% off for paying in full, and the
  two stack. Whether stacking is a flat 20% or 10% then 10% isn't confirmed,
  so the page never shows a combined price.
  This page is sent to prospects after a call, so it has no booking CTAs.
  Intentionally not linked from Nav or other pages.
*/

type Plan = {
  name: string;
  price: string;
  summary: string;
  features: string[];
  details: { label: string; body: string }[];
  dark: boolean;
  highlight?: { title: string; body: string };
};

const plans: Plan[] = [
  {
    name: "Parish Growth",
    price: "$30,000",
    summary: "Social media and Meta ads, managed for you.",
    features: [
      "2 videos a week (homily clips)",
      "12 Meta ad campaigns a year",
      "Facebook & Instagram managed",
      "Event and ministry promotion",
      "Performance reports",
    ],
    details: [
      { label: "Videos", body: "2 videos a week, clipped from your homily, edited, and published." },
      { label: "Ads", body: "12 Meta ad campaigns a year that reach local Catholics and families, bring in new parishioners, and fill your events and programs." },
      { label: "Social media", body: "We manage your Facebook and Instagram accounts and posting schedule, and promote your events, ministries, and activities." },
      { label: "Reporting", body: "Performance reports and strategic guidance." },
    ],
    dark: false,
  },
  {
    name: "Parish Media Partnership",
    price: "$60,000",
    summary: "Everything in Parish Growth, plus:",
    features: [
      "3 videos a week (adds a Sunday reflection)",
      "15 Meta ad campaigns a year instead of 12",
      "Annual on-site filming visit with Joe",
      "Homily recording system installed",
    ],
    details: [
      { label: "Filming visit", body: "Joe and our production team fly to your parish for several days. We film your pastor's 52 Sunday reflections with multiple cameras and professional lighting and audio, plus your church, liturgy, ministries, parishioner interviews, and ads for events, evangelization, and fundraising." },
      { label: "Homily recording", body: "We install and set up a professional recording system in your church." },
      { label: "Videos", body: "3 videos a week: 2 homily clips plus a Sunday reflection, with short videos cut from your footage all year." },
      { label: "Ads", body: "15 Meta ad campaigns a year instead of 12." },
      { label: "Giving campaign", body: "A custom giving page, a video of your pastor making the appeal, targeted ads, donation tracking, and regular reporting." },
    ],
    dark: true,
    highlight: {
      title: "Built to pay for itself",
      body: "As soon as we're back from filming, we launch a monthly giving campaign with one goal: $5,000 a month in new recurring gifts, enough to cover the partnership.",
    },
  },
];

function CheckList({ items, dark }: { items: string[]; dark: boolean }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className={`flex items-start gap-3 ${dark ? "text-vellum/85" : "text-ink/80"}`}>
          <Check
            aria-hidden="true"
            strokeWidth={2.5}
            className={`mt-1 h-4 w-4 shrink-0 ${dark ? "text-gilt-light" : "text-gold-deep"}`}
          />
          <span className="text-pretty">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ParishPricing() {
  return (
    <section className="bg-vellum px-6 py-16 sm:py-24">
      <h1 className="text-center font-serif text-4xl font-medium text-ink sm:text-5xl">
        Pricing
      </h1>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2 md:items-start">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-3xl p-8 sm:p-10 ${
              plan.dark
                ? "bg-ink text-vellum shadow-2xl shadow-ink/30"
                : "bg-white text-ink shadow-xl shadow-ink/5 ring-1 ring-ink/5"
            }`}
          >
            <h2 className="font-serif text-2xl font-medium">{plan.name}</h2>
            <p className="mt-6 font-serif text-5xl font-medium">{plan.price}</p>
            <p className={`mt-1 ${plan.dark ? "text-vellum/60" : "text-ink/60"}`}>per year</p>

            {plan.highlight && (
              <div className="mt-6 rounded-2xl bg-gilt-light/10 p-5 ring-1 ring-gilt-light/40">
                <p className="font-semibold text-gilt-light">{plan.highlight.title}</p>
                <p className="mt-1.5 text-pretty text-vellum/85">{plan.highlight.body}</p>
              </div>
            )}

            <p className={`mt-8 font-semibold ${plan.dark ? "text-gilt-light" : "text-gold-deep"}`}>
              {plan.summary}
            </p>
            <div className="mt-4">
              <CheckList items={plan.features} dark={plan.dark} />
            </div>

            <details className="group mt-8">
              <summary
                className={`flex cursor-pointer list-none items-center gap-2 font-semibold [&::-webkit-details-marker]:hidden ${
                  plan.dark ? "text-gilt-light" : "text-lapis"
                }`}
              >
                See everything included
                <ChevronDown
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <dl
                className={`mt-5 space-y-5 rounded-2xl p-6 ${
                  plan.dark ? "bg-vellum/5" : "bg-parchment/60"
                }`}
              >
                {plan.details.map((d) => (
                  <div key={d.label}>
                    <dt className={`font-semibold ${plan.dark ? "text-vellum" : "text-ink"}`}>{d.label}</dt>
                    <dd className={`mt-1 text-pretty ${plan.dark ? "text-vellum/75" : "text-ink/70"}`}>{d.body}</dd>
                  </div>
                ))}
              </dl>
            </details>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-xl text-balance text-center text-ink/70">
        Save 10% when you decide within 21 days of your call, and another 10%
        when you pay for the year in&nbsp;full. Ad spend is billed
        separately.
      </p>
    </section>
  );
}
