"use client";

import { useState } from "react";
import Image from "next/image";
import { SITE_STYLES, type SiteStyle } from "@/data/freeWebsite";

// A browser window with three tabs that swap the homepage style shown inside.
// Every style is a screenshot of a real build from the Parish Website Template
// (Classic = hero.photo, Cathedral = hero.video, Family = hero.mosaic).
export function BrowserFrame({ children, url = "yourparish.org" }: { children: React.ReactNode; url?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-ink/30 ring-1 ring-ink/10">
      <div className="flex items-center gap-3 border-b border-ink/10 bg-[#efe9df] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e06b5b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e2b14a]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#6cbf5d]" />
        </span>
        <span className="mx-auto w-full max-w-xs truncate rounded-md bg-white/80 px-3 py-1 text-center text-xs text-ink/50">{url}</span>
        <span className="w-10" aria-hidden="true" />
      </div>
      {children}
    </div>
  );
}

function StyleView({ style }: { style: SiteStyle }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink">
      <Image
        src={style.example.image}
        alt={`${style.name} style homepage: ${style.example.parish}`}
        fill
        sizes="(min-width: 1024px) 56rem, 100vw"
        className="object-cover object-top"
      />
    </div>
  );
}

export default function StylePicker() {
  const [active, setActive] = useState(0);
  const style = SITE_STYLES[active];

  return (
    <div>
      <div role="tablist" aria-label="Homepage styles" className="mx-auto flex w-fit gap-1 rounded-full bg-white/10 p-1 ring-1 ring-vellum/15">
        {SITE_STYLES.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls="style-panel"
            onClick={() => setActive(i)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors sm:px-7 sm:text-base ${
              i === active ? "bg-gilt-light text-ink" : "text-vellum/75 hover:text-vellum"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div id="style-panel" role="tabpanel" className="mx-auto mt-8 max-w-4xl">
        <BrowserFrame>
          <StyleView style={style} />
        </BrowserFrame>
        <div className="mx-auto mt-6 max-w-2xl text-center">
          <p className="text-balance text-lg text-vellum/85">{style.tagline}</p>
          <p className="mt-2 text-sm text-vellum/50">
            Best for: {style.bestFor} &middot; Shown: {style.example.parish}
          </p>
        </div>
      </div>
    </div>
  );
}
