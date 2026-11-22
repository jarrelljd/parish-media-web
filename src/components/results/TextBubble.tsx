"use client";

import { useEffect, useState } from "react";
import { useInView } from "./useInView";

// An incoming iMessage that shows "typing…" for a beat, then pops in.
export default function TextBubble({ text, caption }: { text: string; caption: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.6);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setShown(true), reduce ? 0 : 1300);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <figure ref={ref} className="rounded-[1.75rem] bg-black px-5 py-6 shadow-2xl shadow-ink/30 sm:px-7 sm:py-8">
      <div className="relative min-h-[7.5rem]">
        {/* Typing indicator */}
        <div
          aria-hidden="true"
          className={`absolute left-0 top-0 flex gap-1.5 rounded-3xl bg-[#26252a] px-5 py-4 transition-opacity duration-300 ${
            inView && !shown ? "opacity-100" : "opacity-0"
          }`}
        >
          {[0, 150, 300].map((d) => (
            <span
              key={d}
              className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/50"
              style={{ animationDelay: `${d}ms` }}
            />
          ))}
        </div>
        {/* The message */}
        <p
          className={`relative max-w-[19rem] origin-bottom-left rounded-3xl rounded-bl-md bg-[#26252a] px-5 py-3.5 text-xl font-medium leading-snug text-white transition-all duration-500 ease-out motion-reduce:transition-none sm:text-2xl ${
            shown ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          {text}
        </p>
      </div>
      <figcaption className="mt-4 text-sm text-white/55">{caption}</figcaption>
    </figure>
  );
}
