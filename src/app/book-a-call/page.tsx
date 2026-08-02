import type { Metadata } from "next";
import Nav from "@/components/Nav";
import CalendlyBooking from "@/components/CalendlyBooking";

export const metadata: Metadata = {
  title: "Book a Call | Parish Media Company",
  description: "Book a quick call with Parish Media Company.",
};

export default async function BookACallPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;

  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <section className="px-6 py-16 sm:py-20">
          <CalendlyBooking role={role} />
        </section>
      </main>
    </>
  );
}
