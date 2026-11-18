"use client";

import { useEffect, useRef, useState } from "react";
import { stTeresa } from "@/data/stTeresaLanding";

const TICKS = [0, 5, 10, 15, 20];

// The campaign goal thermometer. It fills once when scrolled into view; people who prefer
// less motion see it already filled.
export default function StTeresaThermometer() {
  const { progress } = stTeresa;
  const percent = (progress.raised / progress.goal) * 100;
  const ref = useRef<HTMLDivElement>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFilled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`${progress.raisedLabel} raised toward a goal of about 26 million dollars. ${progress.remainingLabel}.`}
      className="relative mx-auto h-[28rem] w-full max-w-[20rem] sm:h-[32rem]"
    >
      {/* Glass tube and bulb */}
      <div className="absolute top-0 bottom-14 left-12 w-14 rounded-t-full bg-white shadow-inner ring-2 ring-[#17352c]/20" aria-hidden="true" />
      <div className="absolute bottom-0 left-[1.25rem] size-[7.5rem] rounded-full bg-white ring-2 ring-[#17352c]/20" aria-hidden="true" />
      <div className="absolute bottom-2 left-[1.75rem] grid size-[6.5rem] place-items-center rounded-full bg-[#c9a227] shadow-inner" aria-hidden="true">
        <span className="font-classic text-2xl font-semibold text-[#10261f]">{Math.round(percent)}%</span>
      </div>

      {/* Scale: 0 sits at the top of the bulb, the goal at the top of the tube */}
      <div className="absolute top-7 right-0 bottom-[7.25rem] left-0">
        <div
          className="absolute left-[3.5rem] w-10 rounded-t-md bg-[#c9a227] transition-[height] duration-[1600ms] ease-out motion-reduce:transition-none"
          style={{ bottom: "-1.5rem", height: filled ? `calc(${percent}% + 1.5rem)` : "1.5rem" }}
          aria-hidden="true"
        />

        {TICKS.map((m) => (
          <div key={m} className="absolute left-0 flex w-12 -translate-y-1/2 items-center justify-end gap-1" style={{ top: `${100 - (m / 26) * 100}%` }} aria-hidden="true">
            <span className="text-xs font-semibold text-[#56635d]">${m}M</span>
            <span className="h-px w-2 bg-[#17352c]/40" />
          </div>
        ))}

        {/* Goal */}
        <div className="absolute top-0 left-[6.75rem] flex -translate-y-1/2 items-center gap-2">
          <span className="h-0.5 w-5 bg-[#17352c]" aria-hidden="true" />
          <span className="font-bold whitespace-nowrap text-[#17352c]">{progress.goalLabel}</span>
        </div>

        {/* Still to raise, halfway between the goal and the raised mark */}
        <p className="absolute left-[8.5rem] -translate-y-1/2 text-sm font-semibold whitespace-nowrap text-[#56635d]" style={{ top: `${(100 - percent) / 2}%` }}>
          {progress.remainingLabel}
        </p>

        {/* Raised */}
        <div className="absolute left-[6.75rem] flex -translate-y-1/2 items-center gap-2" style={{ top: `${100 - percent}%` }}>
          <span className="h-0.5 w-5 bg-[#c9a227]" aria-hidden="true" />
          <span className="leading-tight">
            <span className="block font-classic text-xl font-semibold whitespace-nowrap text-[#17352c]">{progress.raisedLabel}</span>
            <span className="block text-sm font-semibold text-[#56635d]">raised so far</span>
          </span>
        </div>
      </div>
    </div>
  );
}
