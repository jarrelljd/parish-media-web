import type { Metadata } from "next";
import Nav from "@/components/Nav";
import HowItWorks from "@/components/HowItWorks";

export const metadata: Metadata = {
  title: "Services | Parish Media Company",
  description:
    "Organic social media content and targeted Meta ads for Catholic parishes, vocation offices, and dioceses. See exactly how we grow your reach.",
};

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <HowItWorks />
      </main>
    </>
  );
}
