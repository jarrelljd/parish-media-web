"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutTemplate, MousePointerClick, Target, type LucideIcon } from "lucide-react";

// "Why it works" on /monthly-giving: the three parts of the campaign drawn as
// one ring around the result (recurring gifts). When the ring scrolls into
// view each arc draws in, one after another, with its text. After that the
// ring slowly cycles through the parts; hovering, focusing, or tapping a
// part holds it. Reduced motion: everything shows at once, no cycling.

type Part = { icon: LucideIcon; title: string; body: string };

const PARTS: Part[] = [
  {
    icon: Target,
    title: "Targeted advertising",
    body: "Your pastor’s message reaches the local families most likely to give.",
  },
  {
    icon: LayoutTemplate,
    title: "A clean landing page",
    body: "One page, one purpose: your story, your pastor’s video, one clear ask.",
  },
  {
    icon: MousePointerClick,
    title: "Low payment friction",
    body: "A few taps from a phone. No paper forms, no long checkout.",
  },
];

// Ring geometry (SVG units). Arc i is centered at -90° + i*120° (top,
// lower right, lower left), with a small gap between arcs.
const C = 200;
const R = 158;
const GAP = 16;
const DRAW_MS = 700;

function polar(deg: number, r = R) {
  const rad = (deg * Math.PI) / 180;
  return { x: C + r * Math.cos(rad), y: C + r * Math.sin(rad) };
}

function arcPath(i: number) {
  const mid = -90 + i * 120;
  const a = polar(mid - 60 + GAP / 2);
  const b = polar(mid + 60 - GAP / 2);
  return `M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`;
}

export default function MechanismWheel() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0); // how many arcs have drawn in
  const [active, setActive] = useState<number | null>(null);
  const [held, setHeld] = useState(false);

  // Draw the arcs in one by one once the ring is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (reduce) {
          setShown(PARTS.length);
          return;
        }
        PARTS.forEach((_, i) => {
          timers.push(window.setTimeout(() => setShown(i + 1), 250 + i * DRAW_MS));
        });
        timers.push(window.setTimeout(() => setActive(0), 250 + PARTS.length * DRAW_MS + 600));
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  // Slowly cycle through the parts unless the visitor is holding one.
  useEffect(() => {
    if (active === null || held) return;
    const t = window.setTimeout(() => setActive((a) => ((a ?? 0) + 1) % PARTS.length), 3800);
    return () => clearTimeout(t);
  }, [active, held]);

  const hold = (i: number) => {
    setActive(i);
    setHeld(true);
  };
  const release = () => setHeld(false);

  // Before the cycle starts every drawn part is fully lit.
  const lit = (i: number) => i < shown && (active === null || active === i);

  return (
    <div ref={ref} className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16">
      {/* The ring */}
      <div className="relative mx-auto aspect-square w-full max-w-[28rem]">
        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {/* Faint full track so the circle reads before it draws */}
          <circle cx={C} cy={C} r={R} fill="none" strokeWidth={24} className="stroke-vellum/[0.04]" />
          {PARTS.map((p, i) => (
            <path
              key={p.title}
              d={arcPath(i)}
              fill="none"
              strokeWidth={lit(i) ? 32 : 24}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={i < shown ? 0 : 1}
              style={{
                stroke: lit(i) ? "#d4af5f" : "rgba(244,238,227,0.16)",
                opacity: i < shown ? 1 : 0,
                transition: `stroke-dashoffset ${DRAW_MS}ms cubic-bezier(0.3,0.7,0.2,1), stroke 500ms ease, stroke-width 400ms ease`,
              }}
            />
          ))}
          {/* Chevrons in the gaps: the ring flows clockwise, ads -> page -> gift */}
          {PARTS.map((p, i) => {
            const deg = -30 + i * 120;
            const pt = polar(deg);
            return (
              <path
                key={`chev-${p.title}`}
                d="M -4 -7 L 4 0 L -4 7"
                fill="none"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-gilt-light/70"
                transform={`translate(${pt.x} ${pt.y}) rotate(${deg + 90})`}
                style={{ opacity: shown === PARTS.length ? 1 : 0, transition: "opacity 600ms ease" }}
              />
            );
          })}
        </svg>

        {/* Icons sitting on each arc */}
        {PARTS.map((p, i) => {
          const pt = polar(-90 + i * 120);
          return (
            <button
              key={p.title}
              type="button"
              onMouseEnter={() => hold(i)}
              onMouseLeave={release}
              onFocus={() => hold(i)}
              onBlur={release}
              onClick={() => hold(i)}
              aria-label={p.title}
              className={`absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-lapis-deep ring-2 transition-all duration-500 motion-reduce:transition-none ${
                lit(i) ? "scale-110 ring-gilt-light" : "ring-gilt-light/30"
              } ${i < shown ? "opacity-100" : "scale-75 opacity-0"}`}
              style={{ left: `${(pt.x / 400) * 100}%`, top: `${(pt.y / 400) * 100}%` }}
            >
              <p.icon className={`h-7 w-7 transition-colors duration-500 ${lit(i) ? "text-gilt-light" : "text-vellum/50"}`} />
            </button>
          );
        })}

        {/* The result, in the middle of the ring */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-700 ${
            shown === PARTS.length ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="font-serif text-5xl font-medium leading-none text-gilt-light sm:text-6xl">$10K</span>
          <span className="mt-2 max-w-[10rem] text-balance text-base text-vellum/80">
            in recurring gifts, every&nbsp;month
          </span>
        </div>
      </div>

      {/* The three parts, lighting up with their arc */}
      <ol className="space-y-3">
        {PARTS.map((p, i) => (
          <li key={p.title}>
            <button
              type="button"
              onMouseEnter={() => hold(i)}
              onMouseLeave={release}
              onFocus={() => hold(i)}
              onBlur={release}
              onClick={() => hold(i)}
              className={`w-full rounded-2xl px-5 py-4 text-left transition-all duration-500 motion-reduce:transition-none ${
                lit(i) && active !== null ? "bg-white/[0.07]" : "bg-transparent"
              } ${i < shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
            >
              <span className={`block font-serif text-2xl font-semibold transition-colors duration-500 ${lit(i) ? "text-vellum" : "text-vellum/45"}`}>
                {p.title}
              </span>
              <span className={`mt-1.5 block text-balance text-lg leading-relaxed transition-colors duration-500 ${lit(i) ? "text-vellum/80" : "text-vellum/40"}`}>
                {p.body}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
