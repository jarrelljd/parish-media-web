import type { Metadata } from "next";
import Nav from "@/components/Nav";
import VocationsContent from "@/components/VocationsContent";

export const metadata: Metadata = {
  title: "Vocations | Parish Media Company",
  description:
    "Targeted outreach that reaches young men discerning a vocation, for vocation offices and religious orders.",
};

export default function VocationsPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <VocationsContent />
      </main>
    </>
  );
}
