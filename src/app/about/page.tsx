import type { Metadata } from "next";
import Nav from "@/components/Nav";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "About | Parish Media Company",
  description:
    "Meet Joe Jarrell, founder of Parish Media Company, and the mission behind helping parishes reach the people who need them most.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <About />
      </main>
    </>
  );
}
