import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Testimonials | Parish Media Company",
  description:
    "Real results from Catholic parishes, dioceses, and vocation offices working with Parish Media Company.",
};

export default function TestimonialsPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <Testimonials />
      </main>
    </>
  );
}
