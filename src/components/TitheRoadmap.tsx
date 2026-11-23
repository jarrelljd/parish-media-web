"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Flag } from "lucide-react";

// The TITHE Framework on /monthly-giving, drawn as a roadmap: a navy road
// with a dashed gold center line that winds back and forth between the
// steps (steps alternate sides on desktop), from "Day 1" to a "Day 90"
// destination. The road paves itself as the visitor scrolls, and each
// milestone lights up when the road reaches it. On phones the steps stack
// and the road runs straight down the left.

export type RoadStep = {
  letter: string;
  title: string;
  body: string;
  visual: ReactNode;
};

type Geo = { d: string; w: number; h: number; pinYs: number[]; endY: number };

const ROAD = 22; // road width in px

export default function TitheRoadmap({
  heading,
  subheading,
  steps,
}: {
  heading: ReactNode;
  subheading: ReactNode;
  steps: RoadStep[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const pinRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const endRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const maskId = useId();
  const [geo, setGeo] = useState<Geo | null>(null);
  const [reached, setReached] = useState(0);
  const [arrived, setArrived] = useState(false);

  // Measure the milestones and lay a road through them: straight down out
  // of each milestone, a rounded turn, across the gap between rows, another
  // turn, and down into the next milestone.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      const box = wrap.getBoundingClientRect();
      const center = (el: Element) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      };
      const pins = pinRefs.current.map((el) => center(el!));
      const rows = rowRefs.current.map((el) => {
        const r = el!.getBoundingClientRect();
        return { top: r.top - box.top, bottom: r.bottom - box.top };
      });
      const end = center(endRef.current!);
      const endTop = endRef.current!.getBoundingClientRect().top - box.top;

      const turn = (a: { x: number; y: number }, b: { x: number; y: number }, mid: number) => {
        const dx = b.x - a.x;
        if (Math.abs(dx) < 2) return ` L ${b.x} ${b.y}`;
        const s = Math.sign(dx);
        const r = Math.max(0, Math.min(48, Math.abs(dx) / 2, mid - a.y, b.y - mid));
        return (
          ` L ${a.x} ${mid - r} Q ${a.x} ${mid} ${a.x + s * r} ${mid}` +
          ` L ${b.x - s * r} ${mid} Q ${b.x} ${mid} ${b.x} ${mid + r} L ${b.x} ${b.y}`
        );
      };

      let d = `M ${pins[0].x} 0 L ${pins[0].x} ${pins[0].y}`;
      for (let i = 1; i < pins.length; i++) {
        d += turn(pins[i - 1], pins[i], (rows[i - 1].bottom + rows[i].top) / 2);
      }
      d += turn(pins[pins.length - 1], end, (rows[rows.length - 1].bottom + endTop) / 2);
      setGeo({ d, w: box.width, h: box.height, pinYs: pins.map((p) => p.y), endY: end.y });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  // Pave the road down to 60% of the way down the screen.
  useEffect(() => {
    const wrap = wrapRef.current;
    const path = pathRef.current;
    if (!geo || !wrap || !path) return;
    const total = path.getTotalLength();
    const reveal = document.getElementById(`${maskId}-reveal`);
    if (!reveal) return;
    reveal.style.strokeDasharray = `${total}`;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = reduce ? Infinity : window.innerHeight * 0.6 - wrap.getBoundingClientRect().top;
      // The road only ever heads downward or sideways, so search along it
      // for the point at this height.
      let lo = 0;
      let hi = total;
      if (y >= geo.endY) lo = total;
      else if (y <= 0) hi = 0;
      else
        for (let i = 0; i < 20; i++) {
          const mid = (lo + hi) / 2;
          if (path.getPointAtLength(mid).y < y) lo = mid;
          else hi = mid;
        }
      reveal.style.strokeDashoffset = `${total - lo}`;
      setReached(geo.pinYs.filter((py) => py <= y + 1).length);
      setArrived(y >= geo.endY - 1);
    };
    update();
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [geo, maskId]);

  return (
    <section className="bg-vellum px-6 py-20 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance font-serif text-4xl font-medium leading-[1.08] text-ink sm:text-6xl">{heading}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-xl leading-relaxed text-ink/70 sm:text-2xl">{subheading}</p>
        </div>

        <div ref={wrapRef} className="relative mt-14 pt-16 sm:mt-20">
          {geo && (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-visible"
              width={geo.w}
              height={geo.h}
            >
              <defs>
                <mask id={maskId} maskUnits="userSpaceOnUse" x={-50} y={-50} width={geo.w + 100} height={geo.h + 100}>
                  <path
                    id={`${maskId}-reveal`}
                    d={geo.d}
                    fill="none"
                    stroke="white"
                    strokeWidth={ROAD + 12}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </mask>
              </defs>
              {/* The route ahead, faint, so visitors can see where it goes */}
              <path d={geo.d} fill="none" strokeWidth={ROAD} strokeLinecap="round" strokeLinejoin="round" className="stroke-ink/[0.07]" />
              {/* The paved road and its center line, revealed by the mask */}
              <g mask={`url(#${maskId})`}>
                <path ref={pathRef} d={geo.d} fill="none" strokeWidth={ROAD} strokeLinecap="round" strokeLinejoin="round" className="stroke-lapis" />
                <path d={geo.d} fill="none" strokeWidth={2.5} strokeDasharray="10 10" strokeLinecap="round" className="stroke-gilt-light" />
              </g>
            </svg>
          )}

          {/* Day 1: where the road begins */}
          <span className="absolute left-0 top-0 rounded-full bg-lapis px-3 py-1 text-sm font-semibold text-vellum shadow">
            Day 1
          </span>

          <ol className="relative space-y-16 md:space-y-24">
            {steps.map((s, i) => {
              const on = i < reached;
              const right = i % 2 === 1; // odd steps sit on the right on desktop
              return (
                <li
                  key={`${s.letter}-${s.title}`}
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
                >
                  {/* Milestone + text */}
                  <div className={`flex items-start gap-5 md:row-start-1 ${right ? "md:col-start-2" : "md:col-start-1"}`}>
                    <span
                      ref={(el) => {
                        pinRefs.current[i] = el;
                      }}
                      className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-serif text-2xl font-semibold ring-4 transition-all duration-500 motion-reduce:transition-none ${
                        on ? "scale-110 bg-gilt-light text-ink ring-lapis shadow-lg shadow-gilt/40" : "bg-vellum text-lapis ring-lapis/25"
                      }`}
                    >
                      {s.letter}
                    </span>
                    <div className="pt-1">
                      <h3 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">{s.title}</h3>
                      <p className="mt-2 max-w-md text-balance text-lg leading-relaxed text-ink/75">{s.body}</p>
                    </div>
                  </div>
                  {/* The step's visual, on the other side */}
                  <div className={`pl-[4.75rem] md:row-start-1 md:pl-0 ${right ? "md:col-start-1" : "md:col-start-2"}`}>
                    {s.visual}
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Day 90: the destination */}
          <div className="relative mt-20 flex items-center gap-5 md:mt-24 md:flex-col md:gap-0 md:text-center">
            <span
              ref={endRef}
              className={`relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full ring-4 ring-lapis transition-all duration-500 motion-reduce:transition-none ${
                arrived ? "scale-110 bg-gilt-light text-ink shadow-lg shadow-gilt/40" : "bg-vellum text-lapis"
              }`}
            >
              <Flag className="h-7 w-7" aria-hidden="true" />
            </span>
            <div className="md:mt-4">
              <span className="inline-block rounded-full bg-lapis px-3 py-1 text-sm font-semibold text-vellum">Day 90</span>
              <p className="mt-2 font-serif text-2xl font-semibold text-ink sm:text-3xl">$10,000 a month in recurring&nbsp;giving</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
