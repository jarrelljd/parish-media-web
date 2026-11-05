"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { stMary } from "@/data/stMaryLanding";

// Phones only: a bottom bar with the one button, shown once the hero has scrolled away
// and hidden while the form itself is on screen.
export default function StMaryStickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const form = document.getElementById("visit-guide");
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
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-[#2e211c]/10 bg-[#fbf7f1]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 motion-reduce:transition-none sm:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
    >
      <a
        href={stMary.cta.href}
        tabIndex={show ? 0 : -1}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#7b2d26] px-6 py-3.5 font-bold text-[#fbf7f1] shadow-lg shadow-[#7b2d26]/25"
      >
        {stMary.cta.label}
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}
