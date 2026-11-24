"use client";

import { useMemo, useRef, useState } from "react";
import { Play, Search, X } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import { flyerCategories, type FlyerTemplate } from "@/data/flyers";
import { indexTemplates, searchFlyers } from "@/lib/flyerSearch";
import FlyerCard from "./FlyerCard";

const steps = [
  { title: "Find your event", body: "Search for it, or tap one of the suggestions." },
  { title: "Pick a design", body: "Click \"Customize in Canva.\" Canva makes you your own copy." },
  { title: "Add your details", body: "Change the date, time, and place, then download it to print or post." },
];

function Chips({ items, onPick, active }: { items: string[]; onPick: (s: string) => void; active: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s) => {
        const on = active.trim().toLowerCase() === s.toLowerCase();
        return (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            aria-pressed={on}
            className={`rounded-full px-3.5 py-1.5 text-[15px] transition-colors ${
              on ? "bg-lapis text-vellum" : "bg-white text-ink/80 ring-1 ring-ink/10 hover:text-ink hover:ring-ink/25"
            }`}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}

export default function FlyerLibrary({
  templates,
  seasonal,
  parishName,
  isAdmin = false,
}: {
  templates: FlyerTemplate[];
  seasonal: string[];
  parishName?: string;
  isAdmin?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const index = useMemo(() => indexTemplates(templates), [templates]);
  const groups = useMemo(() => searchFlyers(index, query, category), [index, query, category]);
  const designCount = groups.reduce((n, g) => n + g.templates.length, 0);

  // On phones the results sit below the search column, so bring them into view.
  const showResults = () => {
    if (window.innerWidth < 1024) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const pickSearch = (s: string) => {
    setQuery(s);
    setCategory(null);
    showResults();
  };
  const pickCategory = (c: string | null) => {
    setCategory(c);
    setQuery("");
    showResults();
  };
  const reset = () => {
    setQuery("");
    setCategory(null);
  };

  const label = query.trim() ? `"${query.trim()}"` : category ?? "All flyers";

  return (
    <div className="flex min-h-screen flex-col bg-vellum">
      <header className="bg-ink text-vellum">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <button type="button" onClick={reset} className="flex items-center gap-3 text-left">
            <BrandMark className="h-8 w-auto text-gilt-light" />
            <span className="leading-tight">
              <span className="block font-serif text-lg font-semibold">Parish Flyer Library</span>
              <span className="block text-sm text-vellum/60">by Parish Media Company</span>
            </span>
          </button>
          <div className="flex items-center gap-5 text-[15px]">
            {parishName && <span className="hidden text-vellum/60 md:block">{parishName}</span>}
            {isAdmin && (
              <a href="/flyers/admin" className="font-semibold text-vellum/80 hover:text-vellum">
                Manage flyers
              </a>
            )}
            <a href="#how-it-works" className="font-semibold text-gilt-light hover:text-vellum">
              How it works
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[300px_1fr] lg:gap-14 lg:py-12">
        {/* Search column */}
        <aside className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:self-start lg:overflow-y-auto lg:pb-4">
          <h1 className="font-serif text-2xl font-semibold text-ink">Find a flyer</h1>
          <p className="mt-1.5 text-ink/65 text-pretty">Search for your event, then make it yours in&nbsp;Canva.</p>

          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCategory(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && showResults()}
              placeholder="e.g. Fish Fry"
              aria-label="Search flyers"
              className="w-full rounded-full bg-white py-3.5 pl-12 pr-11 text-[17px] text-ink shadow-sm ring-1 ring-ink/15 placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-lapis [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink/45 hover:bg-ink/10 hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {seasonal.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 font-semibold text-gold-deep">Coming up</h2>
              <Chips items={seasonal} onPick={pickSearch} active={query} />
            </div>
          )}

          <div className="mt-7">
            <h2 className="mb-2 font-semibold text-gold-deep">Categories</h2>
            <ul className="-mx-3 flex gap-1 overflow-x-auto [scrollbar-width:none] lg:block">
              {[null, ...flyerCategories].map((c) => {
                const on = category === c && !query.trim();
                return (
                  <li key={c ?? "all"} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => pickCategory(c)}
                      aria-pressed={on}
                      className={`w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-[16px] transition-colors ${
                        on ? "bg-lapis/10 font-semibold text-lapis" : "text-ink/75 hover:bg-parchment hover:text-ink"
                      }`}
                    >
                      {c ?? "All flyers"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Results */}
        <main ref={resultsRef} className="scroll-mt-4" aria-live="polite">
          {groups.length > 0 ? (
            <>
              <p className="mb-8 text-[15px] text-ink/60">
                {label}: {designCount} {designCount === 1 ? "design" : "designs"}
              </p>
              <div className="space-y-14">
                {groups.map((g) => (
                  <section key={g.event} aria-label={g.event}>
                    <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h2 className="font-serif text-2xl font-semibold text-ink">{g.event}</h2>
                      <span className="text-[15px] font-semibold text-gold-deep">{g.category}</span>
                    </div>
                    <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                      {g.templates.map((t) => (
                        <FlyerCard key={t.id} t={t} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </>
          ) : (
            <div className="max-w-lg py-10">
              <h2 className="font-serif text-2xl font-semibold text-ink">No flyers for {label} yet</h2>
              <p className="mt-3 text-lg text-ink/70 text-pretty">
                Try a shorter word, or tell your Parish Media Company contact and we&apos;ll add&nbsp;it.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-6 rounded-full px-6 py-3 font-semibold text-lapis ring-1 ring-lapis/25 hover:bg-parchment"
              >
                Show all flyers
              </button>
            </div>
          )}
        </main>
      </div>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-4 bg-parchment">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:py-16">
          <div>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-ink text-balance">
              How to use these templates
            </h2>
            <ol className="mt-7 space-y-5">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lapis font-semibold text-vellum">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-ink">{s.title}</p>
                    <p className="mt-0.5 text-ink/70 text-pretty">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-7 text-[15px] text-ink/60 text-pretty">
              You&apos;ll need a free Canva account. Your copy is yours to edit, and our original stays&nbsp;untouched.
            </p>
          </div>

          {/* Video tutorial placeholder */}
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-2xl bg-ink">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gilt-light text-ink shadow-lg shadow-black/40">
              <Play className="ml-1 h-7 w-7" aria-hidden="true" />
            </span>
            <p className="text-vellum/70">Video walkthrough coming soon</p>
          </div>
        </div>
      </section>

      <footer className="bg-parchment pb-10 text-center text-sm text-ink/50">
        Need a flyer that isn&apos;t here? Tell your Parish Media Company contact and we&apos;ll add&nbsp;it.
      </footer>
    </div>
  );
}
