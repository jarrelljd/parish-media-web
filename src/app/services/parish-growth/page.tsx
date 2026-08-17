import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ParishGrowthContent from "@/components/ParishGrowthContent";

export const metadata: Metadata = {
  title: "Parish & Diocese Growth | Parish Media Company",
  description:
    "Organic social media content and targeted Meta ads for Catholic parishes and dioceses. See exactly how we grow your reach.",
};

export default function ParishGrowthPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <ParishGrowthContent />
      </main>
    </>
  );
}
