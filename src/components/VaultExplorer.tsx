"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  isComingSoon,
  vaultItemHref,
  vaultItems,
  vaultSections,
  videoEmbedUrl,
  type VaultItem,
  type VaultMetal,
} from "@/data/vault";

// How long the wheel spins (and the bolts retract) before the door swings open.
const SPIN_MS = 900;

// Door colors for each vault. `rgb` drives the glow, light beam, and button.
const METALS: Record<VaultMetal, { hi: string; mid: string; lo: string; rgb: string }> = {
  brass: { hi: "#f7e6a6", mid: "#c9a227", lo: "#5c470e", rgb: "201,162,39" },
  steel: { hi: "#f1f5fa", mid: "#a3b3c7", lo: "#34425a", rgb: "163,179,199" },
  copper: { hi: "#f9cfae", mid: "#c8733f", lo: "#55250e", rgb: "200,115,63" },
  violet: { hi: "#e6d4f7", mid: "#8a5cc0", lo: "#2c1446", rgb: "138,92,192" },
  crimson: { hi: "#f9c9c6", mid: "#b8393e", lo: "#470d12", rgb: "184,57,62" },
  emerald: { hi: "#cdf2db", mid: "#2f9461", lo: "#0b3820", rgb: "47,148,97" },
  sapphire: { hi: "#d3e3fc", mid: "#3d72c9", lo: "#102657", rgb: "61,114,201" },
};

const C = 110; // center of the 220×220 door drawing
// Rounded so server and browser render identical coordinates.
const round = (n: number) => Math.round(n * 100) / 100;
const polar = (r: number, deg: number) => ({
  x: round(C + r * Math.cos((deg * Math.PI) / 180)),
  y: round(C + r * Math.sin((deg * Math.PI) / 180)),
});

function VaultDoor({
  number,
  metal,
  spinning,
  open,
  nudge = false,
}: {
  number: string;
  metal: VaultMetal;
  spinning: boolean;
  open: boolean;
  // Hovering the vault turns the wheel slightly, as if it's ready to open.
  nudge?: boolean;
}) {
  const m = METALS[metal];
  const id = `vault-${number}`;
  const unlocked = spinning || open;
  const lockBolts = [-60, -20, 20, 60, 130, 230];
  const spokes = [-90, -18, 54, 126, 198];
  const rivets = Array.from({ length: 24 }, (_, i) => i * 15);
  const frameRivets = [
    [22, 22], [110, 14], [198, 22], [206, 110], [198, 198], [110, 206], [22, 198],
  ];

  return (
    <div className="relative aspect-square w-full">
      {/* Frame + dark opening */}
      <svg viewBox="0 0 220 220" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-frame`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#323b51" />
            <stop offset="100%" stopColor="#0d1322" />
          </linearGradient>
          <radialGradient id={`${id}-hole`} cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#03060c" />
            <stop offset="100%" stopColor="#141b2b" />
          </radialGradient>
        </defs>
        <rect x="3" y="3" width="214" height="214" rx="24" fill={`url(#${id}-frame)`} stroke={m.mid} strokeOpacity="0.45" strokeWidth="1.5" />
        <rect x="9" y="9" width="202" height="202" rx="19" fill="none" stroke="#ffffff" strokeOpacity="0.06" />
        {frameRivets.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="3.2" fill={m.lo} />
            <circle cx={x - 0.8} cy={y - 0.8} r="1.6" fill={m.hi} fillOpacity="0.8" />
          </g>
        ))}
        <circle cx={C} cy={C} r="96" fill={`url(#${id}-hole)`} stroke={m.lo} strokeWidth="4" />
      </svg>

      {/* Light behind the door */}
      <div
        className="absolute inset-[7%] rounded-full transition-all duration-700"
        style={{
          background: open
            ? `radial-gradient(circle, rgba(255,245,215,0.95), rgba(${m.rgb},0.6) 45%, rgba(${m.rgb},0.1) 75%)`
            : "transparent",
          boxShadow: open ? `0 0 80px 10px rgba(${m.rgb},0.45)` : "none",
        }}
      />

      {/* Door, hinged on its left edge (x = 22 of 220) */}
      <div className="absolute inset-0 [perspective:1000px]">
        <div
          className="h-full w-full transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transformOrigin: "10% 50%", transform: open ? "rotateY(-78deg)" : "rotateY(0deg)" }}
        >
          <svg
            viewBox="0 0 220 220"
            className="h-full w-full overflow-visible drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id={`${id}-face`} cx="35%" cy="28%" r="80%">
                <stop offset="0%" stopColor={m.hi} />
                <stop offset="45%" stopColor={m.mid} />
                <stop offset="100%" stopColor={m.lo} />
              </radialGradient>
              <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={m.hi} />
                <stop offset="100%" stopColor={m.lo} />
              </linearGradient>
            </defs>

            {/* Locking bolts: slide back into the door as it unlocks */}
            {lockBolts.map((deg) => (
              <g key={deg} transform={`rotate(${deg} ${C} ${C})`}>
                <rect
                  x={C + 78}
                  y={C - 4.5}
                  width="22"
                  height="9"
                  rx="2"
                  fill={`url(#${id}-bar)`}
                  stroke={m.lo}
                  strokeWidth="1"
                  className="transition-transform ease-in-out motion-reduce:transition-none"
                  style={{
                    transform: unlocked ? "translateX(-16px)" : "translateX(0px)",
                    transitionDuration: `${SPIN_MS * 0.8}ms`,
                  }}
                />
              </g>
            ))}

            {/* Door face */}
            <circle cx={C} cy={C} r="88" fill={`url(#${id}-face)`} stroke={m.lo} strokeWidth="2" />
            <circle cx={C} cy={C} r="83" fill="none" stroke={m.hi} strokeOpacity="0.55" strokeWidth="1" />
            <circle cx={C} cy={C} r="78" fill="none" stroke={m.lo} strokeOpacity="0.7" strokeWidth="3" />
            {rivets.map((deg) => {
              const p = polar(70, deg);
              return <circle key={deg} cx={p.x} cy={p.y} r="2.2" fill={m.lo} fillOpacity="0.75" />;
            })}
            <circle cx={C} cy={C} r="60" fill={m.lo} fillOpacity="0.22" stroke={m.hi} strokeOpacity="0.4" strokeWidth="1" />

            {/* Hinges */}
            {[68, 152].map((y) => (
              <rect key={y} x="12" y={y - 12} width="18" height="24" rx="4" fill={`url(#${id}-bar)`} stroke={m.lo} strokeWidth="1" />
            ))}

            {/* Handle wheel */}
            <g
              className="transition-transform ease-in-out motion-reduce:transition-none"
              style={{
                transformBox: "view-box",
                transformOrigin: `${C}px ${C}px`,
                transform: unlocked ? "rotate(-200deg)" : nudge ? "rotate(-22deg)" : "rotate(0deg)",
                transitionDuration: unlocked ? `${SPIN_MS}ms` : "400ms",
              }}
            >
              <circle cx={C} cy={C} r="34" fill="none" stroke={m.lo} strokeWidth="5" />
              <circle cx={C} cy={C} r="34" fill="none" stroke={m.hi} strokeOpacity="0.6" strokeWidth="1.5" />
              {spokes.map((deg) => {
                const a = polar(24, deg);
                const b = polar(46, deg);
                return (
                  <g key={deg}>
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={m.lo} strokeWidth="6" strokeLinecap="round" />
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={m.hi} strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
                    <circle cx={b.x} cy={b.y} r="6.5" fill={`url(#${id}-face)`} stroke={m.lo} strokeWidth="1.5" />
                  </g>
                );
              })}
            </g>

            {/* Hub with the vault number */}
            <circle cx={C} cy={C} r="25" fill={`url(#${id}-face)`} stroke={m.lo} strokeWidth="2.5" />
            <circle cx={C} cy={C} r="21" fill="none" stroke={m.hi} strokeOpacity="0.5" strokeWidth="1" />
            <text
              x={C}
              y={C + 0.8}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="19"
              fontWeight="700"
              fill={m.hi}
              fillOpacity="0.6"
            >
              {number}
            </text>
            <text
              x={C}
              y={C}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="19"
              fontWeight="700"
              fill={m.lo}
            >
              {number}
            </text>
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

type Metal = (typeof METALS)[VaultMetal];

const pad2 = (n: number) => String(n).padStart(2, "0");

// The book (or any link resource): a borderless feature at the top of a vault.
function FeatureItem({ item, m }: { item: VaultItem; m: Metal }) {
  const href = vaultItemHref(item);
  const external = (url: string) => (url.startsWith("http") || url.toLowerCase().endsWith(".pdf") ? { target: "_blank", rel: "noopener noreferrer" } : {});
  const buttons = item.buttons?.length ? item.buttons : [{ label: `${item.cta} →`, href }];

  return (
    <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-10 sm:text-left">
      {item.image && (
        <div className="w-36 shrink-0 drop-shadow-[0_18px_28px_rgba(0,0,0,0.65)] sm:w-44">
          <Image src={item.image} alt={item.title} width={352} height={440} className="h-auto w-full" />
        </div>
      )}
      <div className="min-w-0">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: m.hi, opacity: 0.75 }}>
          {item.kind === "book" ? "Free Book" : "Resource"}
        </p>
        <h4 className="mt-2 text-balance font-serif text-2xl font-semibold text-white sm:text-3xl">{item.title}</h4>
        <p className="mt-3 text-pretty text-white/65">{item.description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
          {buttons.map((button, i) => (
            <a
              key={button.href}
              href={button.href}
              {...external(button.href)}
              className="rounded-full border px-6 py-2.5 text-sm font-semibold transition-all hover:brightness-110"
              style={
                i === 0
                  ? {
                      borderColor: m.mid,
                      background: `linear-gradient(to bottom, ${m.hi}, ${m.mid})`,
                      color: "#0e1628",
                      boxShadow: `0 0 30px -10px rgba(${m.rgb},0.9)`,
                    }
                  : { borderColor: `rgba(${m.rgb},0.6)`, color: m.hi }
              }
            >
              {button.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function RowNumber({ n, m }: { n: number; m: Metal }) {
  return (
    <span
      className="w-10 shrink-0 font-serif text-3xl font-semibold tabular-nums sm:w-14 sm:text-4xl"
      style={{ color: m.mid, opacity: 0.8 }}
    >
      {pad2(n)}
    </span>
  );
}

// A video in the vault's ledger: one clean row that expands to play.
function VideoRow({
  item,
  n,
  m,
  expanded,
  onToggle,
}: {
  item: VaultItem;
  n: number;
  m: Metal;
  expanded: boolean;
  onToggle: () => void;
}) {
  const video = item.video!;
  const panelId = `vault-video-${item.slug}`;

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="group flex w-full items-center gap-4 rounded-lg px-2 py-5 text-left transition-colors hover:bg-[var(--tint)] sm:gap-6 sm:px-4"
        style={{ "--tint": `rgba(${m.rgb},0.08)` } as React.CSSProperties}
      >
        <RowNumber n={n} m={m} />
        <span className="min-w-0 flex-1">
          <span
            className={rowTitleClass(item)}
            style={item.featured ? { color: m.hi } : undefined}
          >
            {item.title}
          </span>
          <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
            {item.label ?? "Video"}{video.duration ? ` · ${video.duration}` : ""}
          </span>
        </span>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 group-hover:scale-110"
          style={
            expanded
              ? { borderColor: m.mid, color: m.hi }
              : { borderColor: m.mid, background: `linear-gradient(to bottom, ${m.hi}, ${m.mid})`, color: "#0e1628" }
          }
        >
          {expanded ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 15l6-6 6 6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-4 w-4" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </span>
      </button>

      <div
        id={panelId}
        inert={!expanded}
        className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-2 pb-6 sm:pl-[6rem] sm:pr-4">
            <p className="text-pretty text-sm text-white/60 sm:text-base">{item.description}</p>
            <div
              style={{ aspectRatio: video.aspect ?? 16 / 9, boxShadow: `0 20px 60px -25px rgba(${m.rgb},0.6)` }}
              className="relative mt-4 w-full overflow-hidden rounded-lg bg-black"
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

// Row title style. Featured items (e.g. the Core Four) are bigger and bolder.
function rowTitleClass(item: VaultItem) {
  return item.featured
    ? "block text-balance font-serif text-xl font-bold leading-snug sm:text-2xl"
    : "block text-balance font-serif text-lg font-semibold leading-snug text-white sm:text-xl";
}

// A document or link in the vault's list: opens in a new tab.
function LinkRow({ item, n, m }: { item: VaultItem; n: number; m: Metal }) {
  const href = vaultItemHref(item);
  const external = href.startsWith("http");
  const isPdf = href.toLowerCase().endsWith(".pdf");
  const newTab = external || isPdf;
  return (
    <a
      href={href}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex w-full items-center gap-4 rounded-lg px-2 py-5 transition-colors hover:bg-[var(--tint)] sm:gap-6 sm:px-4"
      style={{ "--tint": `rgba(${m.rgb},0.08)` } as React.CSSProperties}
    >
      <RowNumber n={n} m={m} />
      <span className="min-w-0 flex-1">
        <span className={rowTitleClass(item)} style={item.featured ? { color: m.hi } : undefined}>
          {item.title}
        </span>
        <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
          {item.label ?? "Document"}
        </span>
      </span>
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 group-hover:scale-110"
        style={{ borderColor: m.mid, background: `linear-gradient(to bottom, ${m.hi}, ${m.mid})`, color: "#0e1628" }}
      >
        {isPdf ? (
          // Document icon: a page with a folded corner and text lines
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="h-[18px] w-[18px]" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5M9 13h6M9 17h4" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
          </svg>
        )}
      </span>
    </a>
  );
}

function SealedRow({ item, n, m }: { item: VaultItem; n: number; m: Metal }) {
  return (
    <div className="flex items-center gap-4 px-2 py-5 opacity-55 sm:gap-6 sm:px-4">
      <RowNumber n={n} m={m} />
      <span className="min-w-0 flex-1">
        <span className={rowTitleClass(item)} style={item.featured ? { color: m.hi } : undefined}>
          {item.title}
        </span>
        <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
          {item.label ? `${item.label} · ` : ""}Coming soon
        </span>
      </span>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 text-white/60">
        <LockIcon open={false} />
      </span>
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
  const m = METALS[section?.metal ?? "brass"];

  // Books/links are featured on top; videos (and anything coming soon) form the ledger.
  const features = items.filter((item) => item.kind === "book" && !isComingSoon(item));
  const rows = items.filter((item) => !features.includes(item));

  const riseClass = `transition-all duration-700 ease-out motion-reduce:transition-none ${
    open ? "translate-y-0 scale-100 opacity-100 blur-0" : "translate-y-12 scale-[0.97] opacity-0 blur-[2px]"
  }`;
  const riseDelay = (i: number) => ({ transitionDelay: open ? `${300 + i * 150}ms` : "0ms" });

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
              className={`pointer-events-none absolute top-0 h-72 w-[70%] -translate-x-1/2 transition-[left,opacity] duration-700 ${
                open ? "opacity-100" : "opacity-0"
              }`}
              style={{
                left: `${beamAt}%`,
                background: `radial-gradient(ellipse at top, rgba(${m.rgb},0.35), transparent 70%)`,
              }}
            />
            <div
              className="relative rounded-3xl px-4 py-8 sm:px-10 sm:py-12"
              style={{
                background: `linear-gradient(to bottom, rgba(${m.rgb},0.1), rgba(255,255,255,0.01) 70%)`,
                boxShadow: `inset 0 1px 0 rgba(${m.rgb},0.35)`,
              }}
            >
              <div className="mx-auto max-w-3xl">
                {features.map((item, i) => (
                  <div key={item.slug} className={`${riseClass} mb-10 last:mb-0`} style={riseDelay(i)}>
                    <FeatureItem item={item} m={m} />
                  </div>
                ))}

                {rows.length > 0 && (
                  <div className="divide-y divide-white/10 border-y border-white/10">
                    {rows.map((item, i) => (
                      <div key={item.slug} className={riseClass} style={riseDelay(features.length + i)}>
                        {isComingSoon(item) ? (
                          <SealedRow item={item} n={i + 1} m={m} />
                        ) : item.kind !== "video" ? (
                          <LinkRow item={item} n={i + 1} m={m} />
                        ) : (
                          <VideoRow
                            item={item}
                            n={i + 1}
                            m={m}
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
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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
        {vaultSections.map((section, i) => {
          const m = METALS[section.metal];
          const sealed = vaultItems.every((item) => item.section !== section.id);
          const isOpen = openId === section.id;
          const isSpinning = spinningId === section.id;
          const isHovered = hoveredId === section.id;

          return (
            <div key={section.id}>
              <div
                className="flex flex-col items-center text-center"
                onPointerEnter={(e) => e.pointerType === "mouse" && setHoveredId(section.id)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setHoveredId(null)}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  disabled={sealed}
                  onClick={() => toggle(section.id)}
                  className={`relative block w-44 transition-[transform,filter] duration-300 sm:w-52 ${
                    sealed ? "cursor-not-allowed opacity-40 grayscale" : "cursor-pointer"
                  } ${isHovered && !isOpen ? "scale-[1.03]" : ""}`}
                  style={
                    isHovered && !isOpen && !sealed
                      ? { filter: `drop-shadow(0 0 22px rgba(${m.rgb},0.45))` }
                      : undefined
                  }
                >
                  {isOpen && (
                    <span
                      key={openCount}
                      className="pointer-events-none absolute inset-0 animate-vault-burst rounded-full motion-reduce:hidden"
                      style={{
                        background: `radial-gradient(circle, rgba(255,245,215,0.9), rgba(${m.rgb},0.45) 40%, transparent 70%)`,
                      }}
                    />
                  )}
                  <VaultDoor
                    number={String(i + 1).padStart(2, "0")}
                    metal={section.metal}
                    spinning={isSpinning}
                    open={isOpen}
                    nudge={isHovered && !sealed}
                  />
                </button>
                <p className="mt-6 font-mono text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: m.mid }}>
                  Vault {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-1 font-serif text-2xl font-semibold text-white sm:text-3xl">{section.title}</h2>
                <button
                  type="button"
                  disabled={sealed}
                  onClick={() => toggle(section.id)}
                  aria-expanded={isOpen}
                  className={`relative mt-5 overflow-hidden rounded-full border px-7 py-2.5 text-sm font-semibold transition-all duration-100 ${
                    sealed
                      ? "cursor-not-allowed border-white/15 text-white/40"
                      : isOpen
                        ? "hover:bg-white/5"
                        : isSpinning
                          ? "translate-y-[3px] shadow-[0_1px_0_var(--edge),0_4px_14px_-6px_var(--glow)]"
                          : "shadow-[0_4px_0_var(--edge),0_10px_30px_-8px_var(--glow)] hover:brightness-110 active:translate-y-[3px] active:shadow-[0_1px_0_var(--edge),0_4px_14px_-6px_var(--glow)]"
                  }`}
                  style={
                    sealed
                      ? undefined
                      : isOpen
                        ? { borderColor: m.mid, color: m.hi }
                        : ({
                            borderColor: m.mid,
                            background: `linear-gradient(to bottom, ${m.hi}, ${m.mid})`,
                            color: "#0e1628",
                            "--edge": m.lo,
                            "--glow": `rgba(${m.rgb},0.8)`,
                          } as React.CSSProperties)
                  }
                >
                  {/* Light glinting across the metal */}
                  {!sealed && !isOpen && !isSpinning && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 animate-shimmer bg-linear-to-r from-transparent from-35% via-white/60 to-transparent to-65% motion-reduce:hidden"
                      style={{ animationDelay: `${i * 1.3}s` }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <span key={isSpinning ? "pop" : "rest"} className={`inline-flex ${isSpinning ? "animate-lock-pop" : ""}`}>
                      <LockIcon open={isOpen || isSpinning} />
                    </span>
                    {sealed ? "Coming Soon" : isSpinning ? "Unlocking…" : isOpen ? "Close" : "Unlock"}
                  </span>
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
