import type { Metadata } from "next";
import BrandMark from "@/components/BrandMark";
import ThankYouContent from "@/components/free-website/ThankYouContent";

export const metadata: Metadata = {
  title: "We're Building Your New Website | Parish Media Company",
  robots: { index: false, follow: false },
};

export default function FreeWebsiteThankYouPage() {
  return (
    <>
      <style>{`html{font-size:90%}`}</style>
      {/* Logo only: nothing here should pull them away. */}
      <header className="border-b border-vellum/10 bg-ink">
        <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-5 py-3 text-vellum sm:px-6">
          <BrandMark className="h-8 w-6 shrink-0 text-vellum" />
          <span className="font-serif text-lg font-semibold leading-none sm:text-[1.35rem]">Parish Media Company</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <ThankYouContent />
      </main>
    </>
  );
}
