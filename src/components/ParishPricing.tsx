"use client";

import { useState } from "react";
import Link from "next/link";
import BookACallButton from "@/components/BookACallButton";

/*
  Tier names, prices, and the core differentiators (ads + organic only at
  Essentials; a team-shot photo/video day added at Expansion; Joe personally
  flying out to shoot plus several days on-site setup & staff training at
  Premium) are confirmed by Joe. The supporting bullets (report cadence,
  support level, account lead, etc.) are still drafted-by-proxy — worth a
  once-over before this page goes out to a prospect.
*/

type Tier = {
  name: string;
  price: string;
  tagline: string;
  featured?: boolean;
  features: string[];
  planTotal: string;
  down: string;
  installment: string;
  guarantee?: {
    label: string;
    description: string;
  };
};

// Payment plan = paid-in-full price + 10%, split 50% down / 25% at month 4 /
// 25% at month 8 of that increased total.
const tiers: Tier[] = [
  {
    name: "Essentials",
    price: "$20,000",
    tagline: "Ads management and organic posting for a single parish.",
    features: [
      "Weekly organic content for Facebook & Instagram",
      "Managed Meta ads campaign (ad spend billed separately)",
      "Monthly growth report",
      "Email support",
    ],
    planTotal: "$22,000",
    down: "$11,000",
    installment: "$5,500",
  },
  {
    name: "Expansion",
    price: "$30,000",
    tagline: "Everything in Essentials, plus a professional photo & video shoot to fuel your content.",
    featured: true,
    features: [
      "Everything in Essentials",
      "On-site photo & video (b-roll) shoot by our team",
      "Increased posting cadence with real photo & video content",
      "Quarterly strategy call",
      "Priority support",
    ],
    planTotal: "$33,000",
    down: "$16,500",
    installment: "$8,250",
    guarantee: {
      label: "Implementation Guarantee",
      description:
        "If we don’t hit your agreed-upon 90-day goal, we keep working at no additional cost until we do.",
    },
  },
  {
    name: "Premium",
    price: "$40,000",
    tagline: "Joe personally flies out to shoot your parish and train your staff on-site.",
    features: [
      "Everything in Expansion",
      "Photo & video shoot personally shot by Joe",
      "Several days on-site setting up your systems & training your staff",
      "Dedicated account lead",
      "Direct line for same-week turnaround requests",
    ],
    planTotal: "$44,000",
    down: "$22,000",
    installment: "$11,000",
    guarantee: {
      label: "Money-Back Guarantee",
      description:
        "If we don’t hit your agreed-upon 90-day goal, we’ll refund your investment.",
    },
  },
];

export default function ParishPricing() {
  const [openTier, setOpenTier] = useState<string | null>(null);

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
                <span className="absolute -top-3 left-1/2 w-[88%] max-w-56 -translate-x-1/2 rounded-xl bg-gold px-3 py-1.5 text-center text-xs font-semibold text-navy">
                  Recommended for Growing&nbsp;Parishes
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

              {tier.guarantee && (
                <div className="mt-6 rounded-xl border border-gold/40 bg-gold/5 p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                    {tier.guarantee.label}
                  </p>
                  <p className="mt-1 text-sm text-navy/80">
                    {tier.guarantee.description}
                  </p>
                </div>
              )}

              <div className="mt-8 border-t border-navy/10 pt-6">
                <button
                  type="button"
                  onClick={() =>
                    setOpenTier((current) =>
                      current === tier.name ? null : tier.name
                    )
                  }
                  aria-expanded={openTier === tier.name}
                  className="flex w-full items-center justify-between text-sm font-semibold text-navy"
                >
                  See Pricing Options
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                      openTier === tier.name ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                </button>

                {openTier === tier.name && (
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-navy/10 bg-navy/5 p-4">
                      <p className="text-sm font-semibold text-navy">
                        Paid in Full
                      </p>
                      <p className="mt-1 text-sm text-navy/70">
                        {tier.price} due at signing
                      </p>
                    </div>
                    <div className="rounded-xl border border-navy/10 bg-navy/5 p-4">
                      <p className="text-sm font-semibold text-navy">
                        Payment Plan &mdash; {tier.planTotal} total
                      </p>
                      <p className="mt-1 text-sm text-navy/70">
                        {tier.down} down, {tier.installment} in month 4,{" "}
                        {tier.installment} in month 8
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
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
