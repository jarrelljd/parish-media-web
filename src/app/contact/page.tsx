import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact | Parish Media Company",
  description:
    "Get in touch with Parish Media Company to grow your parish, vocation office, or diocese's online reach.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <Contact />
      </main>
    </>
  );
}
