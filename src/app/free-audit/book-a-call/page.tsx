import type { Metadata } from "next";
import Nav from "@/components/Nav";
import AuditBookACall from "@/components/AuditBookACall";

export const metadata: Metadata = {
  title: "Book a Call | Parish Media Company",
  description: "Book a quick call with Parish Media Company.",
};

export default async function AuditBookACallPage({
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
          <AuditBookACall role={role} />
        </section>
      </main>
    </>
  );
}
