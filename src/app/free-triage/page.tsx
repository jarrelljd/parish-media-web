import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ConsultBookingPage from "@/components/ConsultBookingPage";

export const metadata: Metadata = {
  title: "Book a Call | Parish Media Company",
  description: "Book a quick call with Parish Media Company.",
};

export default function FreeTriagePage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <section className="px-6 py-16 sm:py-20">
          <ConsultBookingPage isPriest={false} />
        </section>
      </main>
    </>
  );
}
