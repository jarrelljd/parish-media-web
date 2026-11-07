"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { hnjElc } from "@/data/hnjElcLanding";

// Phones only: a bottom bar with the one button, shown once the hero has scrolled away
// and hidden while the form itself is on screen.
export default function HnjElcStickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const form = document.getElementById("elc-guide");
    const observer = form ? new IntersectionObserver(([e]) => setFormVisible(e.isIntersecting)) : null;
    if (form && observer) observer.observe(form);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  const show = pastHero && !formVisible;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-[#1f2a22]/10 bg-[#fbf8f1]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 motion-reduce:transition-none sm:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
    >
      <a
        href={hnjElc.cta.href}
        tabIndex={show ? 0 : -1}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#14603a] px-6 py-3.5 font-bold text-[#fbf8f1] shadow-lg shadow-[#14603a]/25"
      >
        {hnjElc.cta.label}
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}
