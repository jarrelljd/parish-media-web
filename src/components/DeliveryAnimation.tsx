import { BookOpen, Check, Mail } from "lucide-react";

// Book → inbox: a gold dot travels the dotted line, then a check pops on the
// envelope. Loops.
export default function DeliveryAnimation() {
  const dot = "pmc-send-dot";
  const check = "pmc-send-check";

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
        .pmc-send-dot { animation: pmc-send-dot 3.2s ease-in-out infinite; }
        .pmc-send-check { animation: pmc-send-check 3.2s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .pmc-send-dot { animation: none; opacity: 0; }
          .pmc-send-check { animation: none; transform: none; opacity: 1; }
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
