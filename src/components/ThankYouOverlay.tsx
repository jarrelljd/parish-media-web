import DeliveryAnimation from "@/components/DeliveryAnimation";

// Full-screen thank-you shown after the free-guide form succeeds. It covers
// the whole viewport so the page underneath never jumps, whatever the
// scroll position. `leaving` fades the text out just before redirecting.
export default function ThankYouOverlay({ leaving = false }: { leaving?: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pmc-thanks fixed inset-0 z-[100] flex items-center justify-center bg-offwhite px-6"
    >
      <style>{`
        @keyframes pmc-thanks-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pmc-thanks-rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: none; }
        }
        .pmc-thanks { animation: pmc-thanks-in 0.4s ease-out both; }
        .pmc-thanks-inner {
          animation: pmc-thanks-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .pmc-thanks-inner.is-leaving { opacity: 0; transform: translateY(-8px); }
        @media (prefers-reduced-motion: reduce) {
          .pmc-thanks, .pmc-thanks-inner { animation: none; transition: none; }
        }
      `}</style>
      <div className={`pmc-thanks-inner max-w-sm text-center ${leaving ? "is-leaving" : ""}`}>
        <DeliveryAnimation once />
        <p className="mt-9 font-serif text-4xl font-medium tracking-tight text-navy">
          Thank you!
        </p>
        <p className="mt-3 text-pretty text-lg text-navy/70">
          Your copy is on its way to your&nbsp;inbox.
        </p>
        <p className="mt-7 font-serif text-lg italic text-navy">
          While you wait, a quick note from&nbsp;Joe&hellip;
        </p>
      </div>
    </div>
  );
}
