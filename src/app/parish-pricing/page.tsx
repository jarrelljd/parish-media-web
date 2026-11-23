import type { Metadata } from "next";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import ParishPricing from "@/components/ParishPricing";

export const metadata: Metadata = {
  title: "Pricing | Parish Media Company",
  description:
    "Two ways to work with Parish Media Company: Parish Growth (social media and Meta ads) or the Parish Media Partnership (on-site filming, social media, ads, and a recurring giving campaign).",
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
