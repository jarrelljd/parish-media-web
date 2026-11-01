import type { Metadata } from "next";
import FreeGuideBookACall from "@/components/FreeGuideBookACall";

export const metadata: Metadata = {
  title: "Book a Call | Parish Media Company",
  description: "Book a quick call with Parish Media Company.",
};

export default function FreeGuideFreeConsultPage() {
  return (
    <>
      {/* Soft cross-fade in from the free-guide thank-you screen (same-site
          page loads only; browsers without support just load normally),
          then the header and letter rise into place. */}
      <style>{`
          @view-transition { navigation: auto; }
          ::view-transition-old(root), ::view-transition-new(root) { animation-duration: 0.45s; }
          @keyframes pmc-rise {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: none; }
          }
          .pmc-rise { animation: pmc-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both; }
          .pmc-rise-2 { animation-delay: 0.3s; }
          @media (prefers-reduced-motion: reduce) {
            .pmc-rise { animation: none; }
          }
      `}</style>
      <main className="flex flex-1 flex-col">
        <section className="px-6 pb-16 pt-8 sm:pb-20 sm:pt-12">
          <FreeGuideBookACall />
        </section>
      </main>
    </>
  );
}
