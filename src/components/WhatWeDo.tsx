"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import homilyClip from "../../public/images/proof/core-four/homily-clip.jpg";
import activityPost from "../../public/images/proof/core-four/activity-post.jpg";
import connectionPost from "../../public/images/proof/core-four/connection-post.jpg";
import adOnPhone from "../../public/images/proof/ad-on-phone.png";
import reportOnLaptop from "../../public/images/proof/report-on-laptop.png";

// "How Parish Social Media Should Work" on /parish: three simple steps
// (nurture, ask, optimize), each beside real client work. A curved gold line
// draws itself between the step numbers as the visitor scrolls, and each
// number fills in when the line reaches it.

type Pic = { src: StaticImageData; alt: string };

type Step = {
  title: string;
  body: string;
  pics: Pic[];
};

const STEPS: Step[] = [
  {
    title: "Nurture",
    body: "Post value, proof, and connection content every week, so locals feel nurtured: they get to know, like, and trust your parish. (That’s right, no more sky photos with random quotes.)",
    pics: [
      { src: activityPost, alt: "Confirmation class group photo posted by St. Joseph Parish, Los Banos" },
      { src: homilyClip, alt: "Homily clip Reel from St. Joseph Parish, Los Banos" },
      { src: connectionPost, alt: "Thank-you post for St. Joseph Parish's longtime office manager" },
    ],
  },
  {
    title: "Ask",
    body: "Once people are nurtured, they’re more likely to say yes when the parish asks. So we ask with targeted Facebook and Instagram ads, shown to the people most likely to say yes.",
    pics: [{ src: adOnPhone, alt: "Facebook ad inviting St. Patrick's parishioners and friends to the annual parish picnic" }],
  },
  {
    title: "Optimize",
    body: "Track every result and move your budget to what works, so no ad dollar is wasted and every month brings new followers.",
    pics: [{ src: reportOnLaptop, alt: "Ad results dashboard on a laptop: 126 leads at $1.40 per lead" }],
  },
];

// Three posts fanned out like cards in a hand; the middle one sits on top.
const FAN = [
  "left-[30%] -rotate-6",
  "left-1/2 z-10 -translate-y-[54%]",
  "left-[70%] rotate-6",
];

function StepVisual({ pics }: { pics: Pic[] }) {
  if (pics.length === 1) {
    return (
      <Image
        src={pics[0].src}
        alt={pics[0].alt}
        sizes="(min-width: 640px) 420px, 80vw"
        className="mx-auto h-56 w-auto max-w-full object-contain drop-shadow-xl sm:h-72"
      />
    );
  }
  return (
    <div className="relative mx-auto h-56 w-full max-w-sm sm:h-72">
      {pics.map((p, i) => (
        <div
          key={p.alt}
          className={`absolute top-1/2 aspect-[4/5] h-[80%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-ink shadow-xl shadow-ink/25 ring-1 ring-ink/10 ${FAN[i]}`}
        >
          <Image src={p.src} alt={p.alt} fill sizes="200px" className="object-cover" />
        </div>
      ))}
    </div>
  );
}

type Geo = { d: string; w: number; h: number; dotYs: number[] };

export default function WhatWeDo() {
  const listRef = useRef<HTMLOListElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [reached, setReached] = useState(0);

  // Measure where the numbers sit and build a gently curving path through them.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const box = list.getBoundingClientRect();
      const pts = dotRefs.current.map((el) => {
        const r = el!.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      });
      const bend = box.width >= 600 ? 60 : 12;
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const o = i % 2 ? bend : -bend;
        const dy = b.y - a.y;
        d += ` C ${a.x + o} ${a.y + dy * 0.3}, ${b.x + o} ${b.y - dy * 0.3}, ${b.x} ${b.y}`;
      }
      setGeo({ d, w: box.width, h: box.height, dotYs: pts.map((p) => p.y) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  // Draw the line down to wherever 60% of the way down the screen is.
  useEffect(() => {
    const list = listRef.current;
    const path = pathRef.current;
    if (!geo || !list || !path) return;
    const total = path.getTotalLength();
    path.style.strokeDasharray = `${total}`;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = reduce ? Infinity : window.innerHeight * 0.6 - list.getBoundingClientRect().top;
      // Find how far along the path that height is (the path only moves downward).
      let lo = 0;
      let hi = total;
      if (y >= geo.dotYs[geo.dotYs.length - 1]) lo = total;
      else if (y <= geo.dotYs[0]) hi = 0;
      else
        for (let i = 0; i < 18; i++) {
          const mid = (lo + hi) / 2;
          if (path.getPointAtLength(mid).y < y) lo = mid;
          else hi = mid;
        }
      path.style.strokeDashoffset = `${total - lo}`;
      setReached(geo.dotYs.filter((dy) => dy <= y + 1).length);
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

  return (
    <section className="bg-vellum px-6 py-20 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance font-serif text-4xl font-medium leading-[1.08] text-ink sm:text-6xl">
            Our proven social media framework for&nbsp;parishes
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-xl leading-relaxed text-ink/70 sm:text-2xl">
            The 3-step process we use again and again across Catholic churches in 12+&nbsp;dioceses.
          </p>
        </div>

        <ol ref={listRef} className="relative mt-14 sm:mt-20">
          {/* The path: a gold line that draws itself as you scroll */}
          {geo && (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-visible"
              width={geo.w}
              height={geo.h}
            >
              <path ref={pathRef} d={geo.d} fill="none" strokeWidth={3} strokeLinecap="round" className="stroke-gilt" />
            </svg>
          )}

          {STEPS.map((s, i) => {
            const on = i < reached;
            return (
              <li
                key={s.title}
                className="grid grid-cols-[auto_1fr] gap-x-5 sm:grid-cols-[minmax(0,5fr)_auto_minmax(0,6fr)] sm:gap-x-12"
              >
                {/* Proof: left column on desktop, under the text on mobile */}
                <div className="col-start-2 row-start-2 pb-12 pt-6 sm:col-start-1 sm:row-start-1 sm:py-10">
                  <StepVisual pics={s.pics} />
                </div>

                {/* Step number, sitting on the path */}
                <div className="relative col-start-1 row-span-2 row-start-1 flex flex-col items-center pt-5 sm:col-start-2 sm:row-span-1 sm:justify-center sm:pt-0">
                  <span
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-serif text-2xl font-semibold transition-all duration-500 ${
                      on
                        ? "scale-110 border-gilt bg-gilt text-vellum shadow-lg shadow-gilt/40"
                        : "border-gilt/40 bg-vellum text-gilt"
                    }`}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Step text */}
                <div
                  className="col-start-2 row-start-1 self-start pt-4 sm:col-start-3 sm:self-center sm:pt-0"
                >
                  <h3 className="font-serif text-4xl font-semibold text-ink sm:text-5xl">{s.title}</h3>
                  <p className="mt-3 max-w-md text-balance text-xl leading-relaxed text-ink/75">{s.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
