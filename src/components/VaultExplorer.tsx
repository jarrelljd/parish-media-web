"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  isComingSoon,
  vaultItemHref,
  vaultItems,
  vaultSections,
  videoEmbedUrl,
  type VaultItem,
} from "@/data/vault";

// How long the dial spins before the door swings open.
const SPIN_MS = 750;

function VaultDoor({ spinning, open }: { spinning: boolean; open: boolean }) {
  const bolts = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <div className="relative aspect-square w-full">
      {/* What's behind the door */}
      <div
        className={`absolute inset-[6%] rounded-full transition-all duration-700 ${
          open
            ? "bg-[radial-gradient(circle,rgba(255,236,170,0.95),rgba(201,162,39,0.55)_45%,rgba(201,162,39,0.1)_75%)] shadow-[0_0_80px_10px_rgba(201,162,39,0.45)]"
            : "bg-[radial-gradient(circle,rgba(201,162,39,0.35),transparent_70%)]"
        }`}
      />

      {/* Frame */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full text-gold" aria-hidden="true">
        <circle cx="100" cy="100" r="97" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
        <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="6" />
      </svg>

      {/* Door */}
      <div className="absolute inset-[6%] [perspective:900px]">
        <div
          className="h-full w-full origin-left transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transform: open ? "rotateY(-75deg)" : "rotateY(0deg)" }}
        >
          <svg viewBox="0 0 200 200" className="h-full w-full text-gold drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]" aria-hidden="true">
            <defs>
              <radialGradient id="vault-door-fill" cx="40%" cy="35%" r="75%">
                <stop offset="0%" stopColor="#2a3c63" />
                <stop offset="100%" stopColor="#121c33" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="99" fill="url(#vault-door-fill)" stroke="currentColor" strokeOpacity="0.7" strokeWidth="2" />
            {bolts.map((deg) => (
              <circle
                key={deg}
                cx={100 + 86 * Math.cos((deg * Math.PI) / 180)}
                cy={100 + 86 * Math.sin((deg * Math.PI) / 180)}
                r="3"
                fill="currentColor"
                fillOpacity="0.75"
              />
            ))}
            <circle cx="100" cy="100" r="74" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
            <g
              className="transition-transform ease-in-out motion-reduce:transition-none"
              style={{
                transformBox: "view-box",
                transformOrigin: "100px 100px",
                transform: spinning || open ? "rotate(300deg)" : "rotate(0deg)",
                transitionDuration: `${SPIN_MS}ms`,
              }}
            >
              <circle cx="100" cy="100" r="54" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="2 4" />
              {[0, 120, 240].map((deg) => (
                <g key={deg} transform={`rotate(${deg} 100 100)`}>
                  <line x1="100" y1="100" x2="100" y2="46" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="100" cy="44" r="6" fill="currentColor" />
                </g>
              ))}
            </g>
            <circle cx="100" cy="100" r="18" fill="#121c33" stroke="currentColor" strokeWidth="2" />
            <circle cx="100" cy="100" r="6" fill="currentColor" />
            <rect x="0" y="60" width="8" height="18" rx="2" fill="currentColor" fillOpacity="0.6" />
            <rect x="0" y="122" width="8" height="18" rx="2" fill="currentColor" fillOpacity="0.6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function LockIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path strokeLinecap="round" d={open ? "M8 11V7a4 4 0 0 1 7.5-2" : "M8 11V7a4 4 0 0 1 8 0v4"} />
    </svg>
  );
}

function VideoItem({
  item,
  expanded,
  onToggle,
}: {
  item: VaultItem;
  expanded: boolean;
  onToggle: () => void;
}) {
  const video = item.video!;
  const panelId = `vault-video-${item.slug}`;

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white/[0.03] transition-colors duration-300 ${
        expanded ? "border-gold/60" : "border-gold/25 hover:border-gold/60"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="group flex w-full items-center gap-4 p-3 text-left sm:gap-5 sm:p-4"
      >
        <span className="relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-md bg-black ring-1 ring-gold/30 sm:w-28">
          {video.thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element -- remote Loom thumbnail
            <img src={video.thumbnail} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-navy/40 transition-colors group-hover:bg-navy/20">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-navy shadow-[0_0_20px_rgba(201,162,39,0.6)] transition-transform group-hover:scale-110">
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-4 w-4" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">
            Video
            {video.duration && (
              <>
                <span className="h-1 w-1 rounded-full bg-gold/50" />
                {video.duration}
              </>
            )}
          </span>
          <span className="mt-1 block text-balance font-serif text-lg font-semibold leading-snug text-white sm:text-xl">
            {item.title}
          </span>
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        id={panelId}
        inert={!expanded}
        className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-3 pb-4 sm:px-4">
            <p className="text-pretty text-sm text-white/60 sm:text-base">{item.description}</p>
            <div
              style={{ aspectRatio: video.aspect ?? 16 / 9 }}
              className="relative mt-4 w-full overflow-hidden rounded-lg bg-black ring-1 ring-gold/30"
            >
              {/* Only mount the player while expanded, so collapsing it stops playback. */}
              {expanded && (
                <iframe
                  src={videoEmbedUrl(video, true)}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  title={item.title}
                  className="absolute inset-0 h-full w-full border-0"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkItem({ item }: { item: VaultItem }) {
  const href = vaultItemHref(item);
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center gap-5 rounded-xl border border-gold/25 bg-white/[0.03] p-5 transition-all duration-300 hover:border-gold/70 hover:shadow-[0_0_40px_-10px_rgba(201,162,39,0.5)] sm:gap-7 sm:p-6"
    >
      {item.image && (
        <div className="w-20 shrink-0 overflow-hidden rounded shadow-[0_10px_30px_rgba(0,0,0,0.6)] ring-1 ring-gold/30 transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-105 sm:w-28">
          <Image src={item.image} alt={item.title} width={224} height={336} className="h-auto w-full" />
        </div>
      )}
      <div className="min-w-0">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">
          {item.kind === "book" ? "Free Book" : "Resource"}
        </p>
        <h4 className="mt-2 text-balance font-serif text-xl font-semibold text-white sm:text-2xl">{item.title}</h4>
        <p className="mt-2 text-pretty text-sm text-white/60 sm:text-base">{item.description}</p>
        <span className="mt-4 inline-block font-medium text-gold">{item.cta} →</span>
      </div>
    </Link>
  );
}

function SealedItem({ item }: { item: VaultItem }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Coming soon</p>
      <h4 className="mt-2 font-serif text-xl font-semibold text-white/70">{item.title}</h4>
      <p className="mt-2 text-pretty text-sm text-white/50">{item.description}</p>
    </div>
  );
}

function VaultContents({
  sectionId,
  open,
  beamAt,
  openCount,
  className = "",
}: {
  sectionId: string | null;
  open: boolean;
  openCount: number;
  // Horizontal position (in %) the light beam shines down from.
  beamAt: number;
  className?: string;
}) {
  const section = vaultSections.find((s) => s.id === sectionId);
  // One video open at a time per vault.
  const [expanded, setExpanded] = useState<{ slug: string; openCount: number } | null>(null);
  const items = section ? vaultItems.filter((item) => item.section === section.id) : [];

  return (
    <div
      data-vault-panel
      inert={!open}
      aria-hidden={!open}
      className={`grid transition-[grid-template-rows] duration-700 ease-out motion-reduce:transition-none ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      } ${className}`}
    >
      <div className="overflow-hidden">
        {section && (
          <div className="relative pt-2">
            {/* Light spilling out of the open vault */}
            <div
              className={`pointer-events-none absolute top-0 h-72 w-[70%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.35),transparent_70%)] transition-[left,opacity] duration-700 ${
                open ? "opacity-100" : "opacity-0"
              }`}
              style={{ left: `${beamAt}%` }}
            />
            <div className="relative rounded-3xl border border-gold/25 bg-linear-to-b from-gold/[0.07] to-white/[0.01] px-5 py-8 sm:px-10 sm:py-10">
              <div className="mx-auto max-w-3xl">
                <div className="flex flex-col gap-4">
                  {items.map((item, i) => (
                    <div
                      key={item.slug}
                      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
                        open ? "translate-y-0 scale-100 opacity-100 blur-0" : "translate-y-12 scale-[0.97] opacity-0 blur-[2px]"
                      }`}
                      style={{ transitionDelay: open ? `${300 + i * 150}ms` : "0ms" }}
                    >
                      {isComingSoon(item) ? (
                        <SealedItem item={item} />
                      ) : item.kind === "video" ? (
                        <VideoItem
                          item={item}
                          // Collapse videos again each time the vault reopens.
                          expanded={open && expanded?.slug === item.slug && expanded.openCount === openCount}
                          onToggle={() =>
                            setExpanded((cur) =>
                              cur?.slug === item.slug && cur.openCount === openCount
                                ? null
                                : { slug: item.slug, openCount },
                            )
                          }
                        />
                      ) : (
                        <LinkItem item={item} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VaultExplorer() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [spinningId, setSpinningId] = useState<string | null>(null);
  // Keep the last-opened vault's contents rendered while the desktop panel closes.
  const [shownId, setShownId] = useState<string | null>(null);
  // Bumped on every open so the light burst replays and video players reset.
  const [openCount, setOpenCount] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function scrollToPanel() {
    setTimeout(() => {
      const panel = Array.from(document.querySelectorAll<HTMLElement>("[data-vault-panel]")).find(
        (el) => el.offsetParent !== null && el.getAttribute("aria-hidden") === "false",
      );
      panel?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 700);
  }

  function toggle(id: string) {
    if (timer.current) clearTimeout(timer.current);
    if (openId === id) {
      setOpenId(null);
      setSpinningId(null);
      return;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setOpenId(null);
    setSpinningId(id);
    timer.current = setTimeout(
      () => {
        setSpinningId(null);
        setOpenId(id);
        setShownId(id);
        setOpenCount((n) => n + 1);
        scrollToPanel();
      },
      reduceMotion ? 0 : SPIN_MS,
    );
  }

  const shownIndex = Math.max(0, vaultSections.findIndex((s) => s.id === shownId));

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-12 lg:grid-cols-3 lg:gap-6">
        {vaultSections.map((section) => {
          const sealed = vaultItems.every((item) => item.section !== section.id);
          const isOpen = openId === section.id;
          const isSpinning = spinningId === section.id;

          return (
            <div key={section.id}>
              <div className="flex flex-col items-center text-center">
                <div className={`relative w-44 sm:w-52 ${sealed ? "opacity-40 grayscale" : ""}`}>
                  {isOpen && (
                    <span
                      key={openCount}
                      className="pointer-events-none absolute inset-0 animate-vault-burst rounded-full bg-[radial-gradient(circle,rgba(255,236,170,0.9),rgba(201,162,39,0.4)_40%,transparent_70%)] motion-reduce:hidden"
                    />
                  )}
                  <VaultDoor spinning={isSpinning} open={isOpen} />
                </div>
                <h2 className="mt-6 font-serif text-2xl font-semibold text-white sm:text-3xl">{section.title}</h2>
                <button
                  type="button"
                  disabled={sealed}
                  onClick={() => toggle(section.id)}
                  aria-expanded={isOpen}
                  className={`mt-5 flex items-center gap-2 rounded-full px-7 py-2.5 text-sm font-semibold transition-all ${
                    sealed
                      ? "cursor-not-allowed border border-white/15 text-white/40"
                      : isOpen
                        ? "border border-gold/60 text-gold hover:bg-gold/10"
                        : "bg-gold text-navy shadow-[0_0_30px_-8px_rgba(201,162,39,0.8)] hover:bg-gold/90"
                  }`}
                >
                  <LockIcon open={isOpen} />
                  {sealed ? "Coming Soon" : isSpinning ? "Unlocking…" : isOpen ? "Close" : "Unlock"}
                </button>
              </div>

              {/* Mobile/tablet: contents open right under this vault */}
              <VaultContents
                sectionId={section.id}
                open={isOpen}
                beamAt={50}
                openCount={openCount}
                className="mt-6 lg:hidden"
              />
            </div>
          );
        })}
      </div>

      {/* Desktop: contents open under the row of vaults, lit from the open one */}
      <VaultContents
        sectionId={shownId}
        open={openId !== null}
        beamAt={((shownIndex * 2 + 1) / 6) * 100}
        openCount={openCount}
        className="mt-8 hidden lg:grid"
      />
    </div>
  );
}
