"use client";

import { ArrowRight } from "lucide-react";

export default function FreeGuideCtaButton() {
  return (
    <button
      type="button"
      onClick={() =>
        document
          .getElementById("free-guide-form")
          ?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-10 py-4 text-base font-semibold text-navy shadow-lg shadow-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/40 active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      Get the Free Digital Copy
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
    </button>
  );
}
