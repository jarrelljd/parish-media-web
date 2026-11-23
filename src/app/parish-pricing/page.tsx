import type { Metadata } from "next";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import ParishPricing from "@/components/ParishPricing";

export const metadata: Metadata = {
  title: "Pricing | Parish Media Company",
  description:
    "We build and launch a recurring giving campaign designed to create up to $5,000 per month in new recurring gifts. Plans: the Parish Growth and Giving Engine, Parish Growth, and a 30-Day Pilot.",
};

export default function ParishPricingPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <ParishPricing />
      </main>
      <SiteFooter />
    </>
  );
}
