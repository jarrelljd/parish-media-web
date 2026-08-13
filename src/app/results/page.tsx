import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Results from "@/components/Results";

export const metadata: Metadata = {
  title: "Results | Parish Media Company",
  description:
    "Real results from Catholic parishes, dioceses, and vocation offices working with Parish Media Company.",
};

export default function ResultsPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <Results />
      </main>
    </>
  );
}
