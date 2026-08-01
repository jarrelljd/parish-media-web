import type { Metadata } from "next";
import Nav from "@/components/Nav";
import FreeGuideForm from "@/components/FreeGuideForm";

export const metadata: Metadata = {
  title: "Free Guide | Parish Media Company",
  description:
    "Get a free copy of Social Media for Catholic Churches, Joe Jarrell's field guide for parish teams.",
};

export default function FreeGuidePage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <FreeGuideForm />
      </main>
    </>
  );
}
