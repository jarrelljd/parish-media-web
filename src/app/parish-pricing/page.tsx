import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ParishPricing from "@/components/ParishPricing";

export const metadata: Metadata = {
  title: "Pricing | Parish Media Company",
  description:
    "Parish growth plans from Parish Media Company: organic social media content, targeted Meta ads, and monthly reporting for Catholic parishes and dioceses.",
};

export default function ParishPricingPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <ParishPricing />
      </main>
    </>
  );
}
