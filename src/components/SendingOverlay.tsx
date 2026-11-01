// Full-screen "sending" screen shown after the free-guide form succeeds. It
// covers the whole viewport so the page underneath never jumps, whatever the
// scroll position. A thin gold bar fills, then `leaving` fades the content
// out just before we move on to the letter page (which delivers the payoff).
export default function SendingOverlay({ leaving = false }: { leaving?: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pmc-sending fixed inset-0 z-[100] flex items-center justify-center bg-offwhite px-6"
    >
      <style>{`
        @keyframes pmc-sending-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pmc-sending-rise {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes pmc-sending-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .pmc-sending { animation: pmc-sending-in 0.3s ease-out both; }
        .pmc-sending-inner {
          animation: pmc-sending-rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.08s both;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .pmc-sending-inner.is-leaving { opacity: 0; transform: translateY(-6px); }
        .pmc-sending-bar { animation: pmc-sending-fill 1.1s cubic-bezier(0.65, 0, 0.35, 1) 0.2s both; }
        @media (prefers-reduced-motion: reduce) {
          .pmc-sending, .pmc-sending-inner { animation: none; transition: none; }
          .pmc-sending-bar { animation: none; transform: none; }
        }
      `}</style>
      <div className={`pmc-sending-inner text-center ${leaving ? "is-leaving" : ""}`}>
        <p className="font-serif text-2xl font-medium italic tracking-tight text-navy">
          Sending your book&hellip;
        </p>
        <div className="mx-auto mt-5 h-0.5 w-48 overflow-hidden rounded-full bg-navy/10">
          <div className="pmc-sending-bar h-full w-full origin-left rounded-full bg-gold" />
        </div>
      </div>
    </div>
  );
}
