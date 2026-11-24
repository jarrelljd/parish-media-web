"use client";

import { useState } from "react";
import Image from "next/image";

// Drag to compare an old parish homepage with our redesign. A real range
// input sits on top (invisible), so keyboard and screen readers work and
// touch dragging is native. The new site is on the LEFT (clipped from the
// right) because our homepages put the headline on the left half, so the
// part worth seeing is never hidden behind the old site.
export default function BeforeAfterSlider({
  before,
  after,
  label,
  start = 55,
  sizes = "(min-width: 1024px) 48rem, 100vw",
  priority = false,
}: {
  before: string;
  after: string;
  label: string;
  start?: number;
  sizes?: string;
  priority?: boolean;
}) {
  const [pos, setPos] = useState(start);

  return (
    <div className="relative aspect-[16/10] w-full select-none overflow-hidden bg-ink">
      <Image src={before} alt={`${label}, old website`} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={after} alt={`${label}, new website by Parish Media Company`} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-gilt-light px-3 py-1 text-xs font-semibold text-ink sm:left-4 sm:top-4 sm:text-sm">
        New
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink/75 px-3 py-1 text-xs font-semibold text-vellum backdrop-blur sm:right-4 sm:top-4 sm:text-sm">
        Old
      </span>

      {/* Divider line + handle */}
      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)]" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-xl">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} className="h-5 w-5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 6-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Compare ${label} old and new website`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
