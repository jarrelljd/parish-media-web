import Link from "next/link";
import BookACallButton from "@/components/BookACallButton";

/*
  PLACEHOLDER TIER CONTENTS — Joe, please review/edit before this goes live.
  You gave me the three price points ($20k / $30k / $40k per year); I drafted
  what scales between them based on the existing 3-pillar model (Weekly
  Content, Meta Ads, Monthly Reporting) used elsewhere on the site. Nothing
  below is a number or claim you've confirmed — swap in the real deliverables,
  ad-spend handling, and support terms for each tier before sharing this link.
*/

type Tier = {
  name: string;
  price: string;
  tagline: string;
  featured?: boolean;
  features: string[];
};

const tiers: Tier[] = [
  {
    name: "Foundation",
    price: "$20,000",
    tagline: "For a single parish ready to build a real content system.",
    features: [
      "Weekly organic content for Facebook & Instagram",
      "One targeted Meta ads campaign (ad spend billed separately)",
      "Monthly growth report",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "$30,000",
    tagline: "Our most common plan for parishes actively working toward a 90-day goal.",
    featured: true,
    features: [
      "Everything in Foundation",
      "Increased posting cadence, including Reels & video",
      "Multiple Meta ad campaigns across events & ministries",
      "Quarterly strategy call",
      "Priority support",
    ],
  },
  {
    name: "Complete",
    price: "$40,000",
    tagline: "For parishes and dioceses that want a fully managed communications system.",
    features: [
      "Everything in Growth",
      "Bulletin design & redesign included",
      "Custom event landing pages",
      "Dedicated account lead",
      "Direct line for same-week turnaround requests",
    ],
  },
];

export default function ParishPricing() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pb-16 pt-14 sm:pb-20 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
          <h1 className="mt-8 text-balance font-serif text-4xl font-semibold leading-tight text-navy sm:text-5xl">
            Parish Growth Plans
          </h1>
          <p className="mt-6 text-pretty text-lg text-navy/70 sm:text-xl">
            Three ways to bring your parish&rsquo;s social media, ads, and
            reporting under one system, each built around the same goal:
            more real people involved in parish life.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 sm:pb-32">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3 lg:items-start">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex h-full flex-col rounded-2xl border p-8 shadow-sm ${
                tier.featured
                  ? "border-gold/40 bg-gold/5 lg:-translate-y-4"
                  : "border-navy/10 bg-white"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-xs font-semibold uppercase tracking-wide text-navy">
                  Most Popular
                </span>
              )}

              <h2 className="font-serif text-2xl font-semibold text-navy">
                {tier.name}
              </h2>
              <p className="mt-2 text-pretty text-sm text-navy/70">
                {tier.tagline}
              </p>

              <div className="mt-6 border-t border-navy/10 pt-6">
                <p className="font-serif text-4xl font-semibold text-navy">
                  {tier.price}
                </p>
                <p className="mt-1 text-sm font-medium uppercase tracking-wide text-navy/60">
                  Per Year
                </p>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-navy/80"
                  >
                    <span
                      className="mt-0.5 font-bold text-emerald-600"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <BookACallButton
                className={`mt-8 rounded-full px-6 py-3 text-center text-sm font-medium transition-colors ${
                  tier.featured
                    ? "bg-navy text-offwhite hover:bg-navy/90"
                    : "border border-navy text-navy hover:bg-navy/5"
                }`}
              >
                Book a Call
              </BookACallButton>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-navy/70">
          Custom engagement for dioceses,{" "}
          <Link
            href="/contact"
            className="font-medium text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-navy/80"
          >
            let&rsquo;s talk
          </Link>
          .
        </p>
      </section>

      {/* Our Promise */}
      <section className="px-6 pb-24 sm:pb-32">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gold/40 bg-gold/5 p-8 text-center sm:p-10">
          <span
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-2xl"
            aria-hidden="true"
          >
            🤝
          </span>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-gold">
            Our Promise
          </p>
          <p className="mt-3 text-navy/80">
            If we don&rsquo;t hit your agreed-upon 90-day goal, we keep
            working at no additional cost until we do.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy px-6 py-20 text-center sm:py-24">
        <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
        <h2 className="mx-auto mt-8 max-w-2xl text-balance font-serif text-3xl font-semibold text-offwhite sm:text-4xl">
          Not Sure Which Plan Fits Your Parish?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-offwhite/70">
          Book a free call and we&rsquo;ll walk through your parish&rsquo;s
          situation and recommend where to start.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <BookACallButton className="inline-block rounded-full bg-offwhite px-8 py-3.5 text-base font-medium text-navy transition-colors hover:bg-offwhite/90">
            Book a Call
          </BookACallButton>
          <Link
            href="/contact"
            className="inline-block rounded-full border border-offwhite/40 px-8 py-3.5 text-base font-medium text-offwhite transition-colors hover:bg-offwhite/10"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
