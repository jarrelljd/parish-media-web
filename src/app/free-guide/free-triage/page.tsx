import type { Metadata } from "next";
import Nav from "@/components/Nav";
import FreeGuideBookACall from "@/components/FreeGuideBookACall";

export const metadata: Metadata = {
  title: "Book a Call | Parish Media Company",
  description: "Book a quick call with Parish Media Company.",
};

export default function FreeGuideFreeTriagePage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <section className="px-6 py-16 sm:py-20">
          <FreeGuideBookACall isPriest={false} />
        </section>
      </main>
    </>
  );
}
