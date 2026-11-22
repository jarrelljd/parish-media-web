"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// A case study told in steps. A gold line draws itself down the left side as
// the visitor scrolls (same feel as the /parish framework path), and each
// step's marker fills in when the line reaches it.

export type StoryStep = {
  marker: string;
  /** Small label above the title, e.g. "Step 1" */
  label?: string;
  title: string;
  body: ReactNode;
  visual?: ReactNode;
};

export default function StoryRail({ steps }: { steps: StoryStep[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [geo, setGeo] = useState<{ x: number; ys: number[] } | null>(null);
  const [progress, setProgress] = useState(0); // 0..1 along the line
  const [reached, setReached] = useState(0);

  // Where the markers sit inside the list.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const box = list.getBoundingClientRect();
      const ys = dotRefs.current.map((el) => {
        const r = el!.getBoundingClientRect();
        return r.top + r.height / 2 - box.top;
      });
      const first = dotRefs.current[0]!.getBoundingClientRect();
      setGeo({ x: first.left + first.width / 2 - box.left, ys });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  // Fill the line down to 60% of the way down the screen.
  useEffect(() => {
    const list = listRef.current;
    if (!geo || !list) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const first = geo.ys[0];
    const last = geo.ys[geo.ys.length - 1];
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = reduce ? Infinity : window.innerHeight * 0.6 - list.getBoundingClientRect().top;
      setProgress(Math.min(1, Math.max(0, (y - first) / (last - first))));
      setReached(geo.ys.filter((dy) => dy <= y + 1).length);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [geo]);

  const lineTop = geo ? geo.ys[0] : 0;
  const lineLen = geo ? geo.ys[geo.ys.length - 1] - geo.ys[0] : 0;

  return (
    <ol ref={listRef} className="relative">
      {geo && (
        <>
          {/* Faint track */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute w-0.5 -translate-x-1/2 rounded-full bg-gilt/20"
            style={{ left: geo.x, top: lineTop, height: lineLen }}
          />
          {/* Gold fill */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute w-[3px] origin-top -translate-x-1/2 rounded-full bg-gilt"
            style={{ left: geo.x, top: lineTop, height: lineLen, transform: `translateX(-50%) scaleY(${progress})` }}
          />
        </>
      )}

      {steps.map((s, i) => {
        const on = i < reached;
        return (
          <li
            key={s.title}
            className="grid grid-cols-[auto_1fr] gap-x-5 pb-16 last:pb-0 sm:gap-x-10 sm:pb-24"
          >
            <div className="relative flex justify-center">
              <span
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className={`relative z-10 mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 font-serif text-xl font-semibold transition-all duration-500 sm:h-12 sm:w-12 sm:text-2xl ${
                  on
                    ? "scale-110 border-gilt bg-gilt text-vellum shadow-lg shadow-gilt/40"
                    : "border-gilt/40 bg-vellum text-gilt"
                }`}
              >
                {s.marker}
              </span>
            </div>

            <div
              className={`grid gap-8 transition-all duration-700 ease-out motion-reduce:transition-none ${
                s.visual ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14" : ""
              } ${on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-60"}`}
            >
              <div>
                {s.label && (
                  <p className="mb-2 text-base font-semibold text-gold-deep">{s.label}</p>
                )}
                <h3 className="text-balance font-serif text-3xl font-medium leading-tight text-ink sm:text-4xl">
                  {s.title}
                </h3>
                <div className="mt-4 space-y-4 text-pretty text-lg leading-relaxed text-ink/75">
                  {s.body}
                </div>
              </div>
              {s.visual && <div className="lg:pt-2">{s.visual}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
