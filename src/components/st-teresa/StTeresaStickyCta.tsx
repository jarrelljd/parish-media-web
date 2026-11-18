"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { stTeresa } from "@/data/stTeresaLanding";

// Phones only: a bottom bar with the give button, shown once the hero has scrolled away
// and hidden while the donation form itself is on screen.
export default function StTeresaStickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [giveVisible, setGiveVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const give = document.getElementById("give");
    const observer = give ? new IntersectionObserver(([e]) => setGiveVisible(e.isIntersecting)) : null;
    if (give && observer) observer.observe(give);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  const show = pastHero && !giveVisible;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-[#17352c]/10 bg-[#fbf8f1]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 motion-reduce:transition-none sm:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
    >
      <a
        href={stTeresa.cta.href}
        tabIndex={show ? 0 : -1}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#c9a227] px-6 py-3.5 font-bold text-[#10261f] shadow-lg shadow-[#c9a227]/25"
      >
        <Heart className="size-4 fill-current" aria-hidden="true" />
        {stTeresa.cta.label}
      </a>
    </div>
  );
}
