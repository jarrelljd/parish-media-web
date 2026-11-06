"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image, { type StaticImageData } from "next/image";

export type Slide = {
  src: StaticImageData;
  alt: string;
  caption: string;
  // CSS object-position, e.g. "50% 60%"
  position?: string;
};

const SLIDE_MS = 7000;

function subscribe(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

// Full-bleed photos that crossfade with a slow zoom. Holds still on the first
// photo for visitors who prefer reduced motion.
export default function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const reducedMotion = useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  function go(next: number) {
    setPrev(active);
    setActive(next);
  }

  useEffect(() => {
    if (reducedMotion) return;
    const id = setTimeout(() => {
      setPrev(active);
      setActive((active + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearTimeout(id);
  }, [active, reducedMotion, slides.length]);

  return (
    <>
      <div className="absolute inset-0 overflow-hidden motion-safe:animate-fade-in">
        {slides.map((slide, i) => {
          const visible = i === active;
          // Keep zooming while the old photo fades out, so it doesn't jump.
          const zooming = i === active || i === prev;
          return (
            <div
              key={i}
              aria-hidden={!visible}
              className={`absolute inset-0 transition-opacity duration-[1800ms] ease-in-out ${visible ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className={`object-cover ${zooming ? "motion-safe:animate-kenburns" : ""}`}
                style={{ objectPosition: slide.position ?? "50% 50%" }}
              />
            </div>
          );
        })}
        {/* Shade for legible text: darker on the left and at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0c0a]/85 via-[#0e0c0a]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0a]/70 via-transparent to-[#0e0c0a]/35" />
      </div>

      {/* Progress bars and caption */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-7 lg:px-10 lg:pb-9">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex gap-2.5" role="group" aria-label="Hero photos">
            {slides.map((slide, i) => (
              <button
                key={i}
                type="button"
                onClick={() => i !== active && go(i)}
                aria-label={`Show photo ${i + 1}: ${slide.caption}`}
                aria-current={i === active}
                className="group py-3"
              >
                <span className="block h-px w-12 overflow-hidden bg-vellum/25 sm:w-16">
                  <span
                    key={i === active ? `on-${active}` : "off"}
                    className={`block h-full origin-left bg-vellum ${
                      i === active ? (reducedMotion ? "" : "animate-progress") : "scale-x-0"
                    }`}
                  />
                </span>
              </button>
            ))}
          </div>
          <p key={active} className="font-display text-base italic text-vellum/70 motion-safe:animate-fade-up">
            {slides[active].caption}
          </p>
        </div>
      </div>
    </>
  );
}
