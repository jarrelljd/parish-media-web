import type { Metadata } from "next";
import NpsForm from "@/components/NpsForm";

export const metadata: Metadata = {
  title: "Quick Question | Parish Media Company",
  description: "One quick question about working with Parish Media Company.",
  robots: { index: false, follow: false },
};

export default async function NpsPage({
  searchParams,
}: {
  searchParams: Promise<{ parish?: string | string[] }>;
}) {
  const { parish } = await searchParams;
  const parishName = (Array.isArray(parish) ? parish[0] : parish) ?? "";

  return (
    <main className="flex flex-1 flex-col">
      <section className="px-4 pt-12 pb-20 sm:px-6 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-2xl">
          <NpsForm parish={parishName} />
        </div>
      </section>
    </main>
  );
}
