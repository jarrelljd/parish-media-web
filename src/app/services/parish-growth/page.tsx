import type { Metadata } from "next";
import ParishGrowthContent from "@/components/ParishGrowthContent";

export const metadata: Metadata = {
  title: "Parish & Diocese Growth | Parish Media Company",
  description:
    "Organic social media content and targeted Meta ads for Catholic parishes and dioceses. See exactly how we grow your reach.",
};

export default function ParishGrowthPage() {
  return (
    <>
      {/* Landing page: brand only, no nav links, so visitors stay focused on booking. */}
      <header className="border-b border-navy/10 bg-offwhite">
        <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-4">
          <span className="font-serif text-lg font-semibold tracking-tight text-navy">
            Parish Media Company
          </span>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <ParishGrowthContent />
      </main>
    </>
  );
}
