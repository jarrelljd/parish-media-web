import { BookOpen, Check, Mail } from "lucide-react";

// Book → inbox: a gold dot travels the dotted line, then a check pops on the
// envelope. `once` plays it a single time and leaves the check showing (used
// on the free-guide thank-you screen); otherwise it loops.
export default function DeliveryAnimation({ once = false }: { once?: boolean }) {
  const dot = once ? "pmc-send-dot-once" : "pmc-send-dot";
  const check = once ? "pmc-send-check-once" : "pmc-send-check";

  return (
    <div className="mx-auto flex w-72 max-w-full items-center gap-3" aria-hidden="true">
      <style>{`
        @keyframes pmc-send-dot {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          60% { left: 100%; opacity: 1; }
          68%, 100% { left: 100%; opacity: 0; }
        }
        @keyframes pmc-send-check {
          0%, 58% { transform: scale(0); opacity: 0; }
          66% { transform: scale(1.2); opacity: 1; }
          72%, 92% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
        @keyframes pmc-send-dot-once {
          0% { left: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { left: 100%; opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes pmc-send-check-once {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pmc-send-dot { animation: pmc-send-dot 3.2s ease-in-out infinite; }
        .pmc-send-check { animation: pmc-send-check 3.2s ease-out infinite; }
        .pmc-send-dot-once { animation: pmc-send-dot-once 1.1s ease-in-out 0.35s both; }
        .pmc-send-check-once { animation: pmc-send-check-once 0.35s ease-out 1.35s both; }
        @media (prefers-reduced-motion: reduce) {
          .pmc-send-dot, .pmc-send-dot-once { animation: none; opacity: 0; }
          .pmc-send-check, .pmc-send-check-once { animation: none; transform: none; opacity: 1; }
        }
      `}</style>

      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-navy shadow-md shadow-navy/5 ring-1 ring-navy/10">
        <BookOpen className="h-6 w-6" strokeWidth={1.5} />
      </span>

      <span className="relative h-px flex-1 border-t-2 border-dotted border-gold/50">
        <span
          className={`${dot} absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_0_4px_rgba(201,162,39,0.18)]`}
        />
      </span>

      <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-navy shadow-md shadow-navy/5 ring-1 ring-navy/10">
        <Mail className="h-6 w-6" strokeWidth={1.5} />
        <span
          className={`${check} absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-gold text-navy ring-2 ring-offwhite`}
        >
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      </span>
    </div>
  );
}
