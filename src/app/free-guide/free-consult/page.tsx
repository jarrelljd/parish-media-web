import type { Metadata } from "next";
import Nav from "@/components/Nav";
import FreeGuideBookACall from "@/components/FreeGuideBookACall";

export const metadata: Metadata = {
  title: "Book a Call | Parish Media Company",
  description: "Book a quick call with Parish Media Company.",
};

export default function FreeGuideFreeConsultPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <section className="px-6 pb-16 pt-8 sm:pb-20 sm:pt-12">
          <FreeGuideBookACall isPriest={true} />
        </section>
      </main>
    </>
  );
}
