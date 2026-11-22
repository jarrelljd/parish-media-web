"use client";

import { useInView } from "./useInView";

// "Same period last year vs. this year" as two bars that grow when scrolled to.
export default function CompareBars({
  label,
  before,
  after,
  beforeLabel,
  afterLabel,
}: {
  label: string;
  before: number;
  after: number;
  beforeLabel: string;
  afterLabel: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const max = Math.max(before, after);
  const rows = [
    { year: "2025", value: before, text: beforeLabel, bar: "bg-ink/20", delay: 0 },
    { year: "2026", value: after, text: afterLabel, bar: "bg-gilt", delay: 250 },
  ];

  return (
    <div ref={ref}>
      <p className="text-base font-semibold text-ink">{label}</p>
      <div className="mt-3 space-y-2.5">
        {rows.map((r) => (
          <div key={r.year} className="grid grid-cols-[3rem_1fr] items-center gap-3">
            <span className="text-sm text-ink/55">{r.year}</span>
            <div className="flex items-center gap-3">
              <div
                className={`h-3 rounded-full ${r.bar} transition-[width] duration-[1400ms] ease-out motion-reduce:transition-none`}
                style={{
                  width: inView ? `${Math.max(3, (r.value / max) * 78)}%` : "0%",
                  transitionDelay: `${r.delay}ms`,
                }}
              />
              <span className="whitespace-nowrap text-sm font-semibold text-ink">{r.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
