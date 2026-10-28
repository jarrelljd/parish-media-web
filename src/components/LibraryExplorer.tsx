"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  isComingSoon,
  vaultItemHref,
  vaultItems,
  vaults,
  videoEmbedUrl,
  type VaultBook,
  type VaultIcon,
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

// Icons stamped on each vault door's center, drawn on a 24×24 grid.
function VaultIconShape({ icon, color }: { icon: VaultIcon; color: string }) {
  const line = { fill: "none", stroke: color, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (icon) {
    case "social":
      // Speech bubble with a heart
      return (
        <>
          <path {...line} d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          <path fill={color} d="M12 14.2l-3.1-3a1.9 1.9 0 0 1 2.7-2.7l.4.4.4-.4a1.9 1.9 0 0 1 2.7 2.7z" />
        </>
      );
    case "email":
      // Envelope
      return (
        <>
          <rect {...line} x="3" y="5.5" width="18" height="13" rx="2" />
          <path {...line} d="M3.8 7l8.2 6 8.2-6" />
        </>
      );
    case "website":
      // Browser window
      return (
        <>
          <rect {...line} x="3" y="4.5" width="18" height="15" rx="2" />
          <path {...line} d="M3 9h18" />
          <circle cx="6" cy="6.8" r="0.9" fill={color} />
          <circle cx="8.8" cy="6.8" r="0.9" fill={color} />
          <path {...line} strokeWidth={1.8} d="M7 13h10M7 16h6" />
        </>
      );
  }
}

function VaultDoor({
  uid,
  icon,
  metal,
  spinning,
  open,
  nudge = false,
}: {
  // Unique per door, so each door's SVG gradients don't collide.
  uid: string;
  icon: VaultIcon;
  metal: VaultMetal;
  spinning: boolean;
  open: boolean;
  // Hovering the vault turns the wheel slightly, as if it's ready to open.
  nudge?: boolean;
}) {
  const m = METALS[metal];
  const id = `vault-${uid}`;
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

            {/* Hub with the vault's icon, stamped into the metal */}
            <circle cx={C} cy={C} r="25" fill={`url(#${id}-face)`} stroke={m.lo} strokeWidth="2.5" />
            <circle cx={C} cy={C} r="21" fill="none" stroke={m.hi} strokeOpacity="0.5" strokeWidth="1" />
            <g transform={`translate(${C - 12} ${C - 11.2}) scale(1)`} opacity="0.6">
              <VaultIconShape icon={icon} color={m.hi} />
            </g>
            <g transform={`translate(${C - 12} ${C - 12}) scale(1)`}>
              <VaultIconShape icon={icon} color={m.lo} />
            </g>
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

// A leather-bound book, like a missal, with gold tooling and a ribbon
// bookmark. Opening it swings the cover back to show the lit pages inside.
function MissalBook({ metal, open, nudge }: { metal: VaultMetal; open: boolean; nudge: boolean }) {
  const m = METALS[metal];
  const gold = "#d9b54a";
  const leather = `linear-gradient(100deg, ${m.lo} 0%, ${m.mid} 14%, ${m.mid} 40%, ${m.lo} 100%)`;

  return (
    <div
      className="relative aspect-[3/4] w-full transition-transform duration-500 ease-out [perspective:900px] motion-reduce:transition-none"
      // Slide right as it opens so the open book stays centered.
      style={{ transform: open ? "translateX(24%) scale(1.04)" : "none" }}
    >
      {/* Ribbon bookmark hanging out the bottom */}
      <span
        className="absolute -bottom-[9%] left-[62%] h-[16%] w-[9%]"
        style={{
          background: `linear-gradient(to right, #a07c1a, ${gold}, #a07c1a)`,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)",
        }}
      />

      {/* Pages */}
      <div
        className="absolute bottom-[1.5%] left-[3%] right-0 top-[1.5%] overflow-hidden rounded-r-[5px] shadow-[0_16px_28px_-8px_rgba(0,0,0,0.75)]"
        style={{
          background: `repeating-linear-gradient(to right, #efe6cf 0px, #efe6cf 2px, #d9cdae 2px, #d9cdae 3px)`,
        }}
      >
        <div
          className="absolute inset-y-0 left-0 right-[5%] transition-[box-shadow] duration-500"
          style={{
            background: "linear-gradient(to right, #e9dfc4, #f7f1e1 30%, #f4ecd6)",
            boxShadow: open ? `inset 0 0 40px rgba(${m.rgb},0.35)` : "none",
          }}
        >
          {/* Lines of text, with a red rubric like a missal */}
          <div className="absolute inset-x-[16%] top-[14%] flex flex-col gap-[7px]">
            <span className="h-[3px] w-1/2 rounded-full" style={{ background: m.mid, opacity: 0.7 }} />
            {[100, 92, 100, 85, 96, 70, 100, 88].map((w, i) => (
              <span key={i} className="h-[2px] rounded-full bg-[#3a3326]/30" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Cover, hinged on the spine */}
      <div
        className="absolute inset-y-0 left-0 right-[3%] transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{
          transformOrigin: "0% 50%",
          transformStyle: "preserve-3d",
          transform: open ? "rotateY(-118deg)" : nudge ? "rotateY(-14deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-l-[3px] rounded-r-[6px] border"
          style={{ background: leather, borderColor: m.lo, backfaceVisibility: "hidden", boxShadow: `inset -1px 1px 0 ${m.hi}55` }}
        >
          {/* Spine crease */}
          <span className="absolute inset-y-0 left-[9%] w-px" style={{ background: m.lo, boxShadow: `1px 0 0 ${m.hi}40` }} />
          {/* Gold border tooling */}
          <span className="absolute inset-x-[18%] inset-y-[8%] rounded-[2px] border" style={{ borderColor: `${gold}b0` }} />
          <span className="absolute inset-x-[22%] inset-y-[11%] rounded-[1px] border" style={{ borderColor: `${gold}60` }} />
          {/* Gold cross */}
          <svg viewBox="0 0 24 24" className="absolute left-[55%] top-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
            <path d="M10.6 2h2.8v6.2H19V11h-5.6v11h-2.8V11H5V8.2h5.6z" fill="#7a5c12" transform="translate(0.4 0.5)" />
            <path d="M10.6 2h2.8v6.2H19V11h-5.6v11h-2.8V11H5V8.2h5.6z" fill={gold} />
          </svg>
        </div>
        {/* Inside of the cover */}
        <div
          className="absolute inset-0 rounded-l-[6px] rounded-r-[3px] border"
          style={{
            background: `linear-gradient(to left, ${m.lo}, ${m.mid})`,
            borderColor: m.lo,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        />
      </div>
    </div>
  );
}

// What's inside one book: a featured book on top, then a numbered list.
function BookContents({
  book,
  open,
  beamAt,
  openCount,
  className = "",
}: {
  book: VaultBook | undefined;
  open: boolean;
  openCount: number;
  // Horizontal position (in %) the light beam shines down from.
  beamAt: number;
  className?: string;
}) {
  // One video open at a time per book.
  const [expanded, setExpanded] = useState<{ slug: string; openCount: number } | null>(null);
  const items = book ? vaultItems.filter((item) => item.section === book.id) : [];
  const m = METALS[book?.metal ?? "brass"];

  // Books are featured on top; videos, documents (and anything coming soon) form the list.
  const features = items.filter((item) => item.kind === "book" && !isComingSoon(item));
  const rows = items.filter((item) => !features.includes(item));

  const riseClass = `transition-all duration-700 ease-out motion-reduce:transition-none ${
    open ? "translate-y-0 scale-100 opacity-100 blur-0" : "translate-y-12 scale-[0.97] opacity-0 blur-[2px]"
  }`;
  const riseDelay = (i: number) => ({ transitionDelay: open ? `${250 + i * 150}ms` : "0ms" });

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
        {book && (
          <div className="relative pt-2">
            {/* Light spilling out of the open book */}
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
                            // Collapse videos again each time the book reopens.
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

// Scrolls newly opened content up into view, but only if it opened low on the screen.
function scrollIntoViewIfLow(el: Element | null | undefined) {
  if (!el) return;
  const top = el.getBoundingClientRect().top;
  if (top > window.innerHeight * 0.55) {
    window.scrollBy({ top: top - 110, behavior: "smooth" });
  }
}

// The 3D push-button style shared by the Unlock and Open buttons.
function metalButton(m: Metal, state: "sealed" | "open" | "pressed" | "ready") {
  const className =
    state === "sealed"
      ? "cursor-not-allowed border-white/15 text-white/40"
      : state === "open"
        ? "hover:bg-white/5"
        : state === "pressed"
          ? "translate-y-[3px] shadow-[0_1px_0_var(--edge),0_4px_14px_-6px_var(--glow)]"
          : "shadow-[0_4px_0_var(--edge),0_10px_30px_-8px_var(--glow)] hover:brightness-110 active:translate-y-[3px] active:shadow-[0_1px_0_var(--edge),0_4px_14px_-6px_var(--glow)]";
  const style: React.CSSProperties | undefined =
    state === "sealed"
      ? undefined
      : state === "open"
        ? { borderColor: m.mid, color: m.hi }
        : ({
            borderColor: m.mid,
            background: `linear-gradient(to bottom, ${m.hi}, ${m.mid})`,
            color: "#0e1628",
            "--edge": m.lo,
            "--glow": `rgba(${m.rgb},0.8)`,
          } as React.CSSProperties);
  return { className, style };
}

// The books inside an open vault.
function BookRow({ books }: { books: VaultBook[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // Keep the last-opened book's contents rendered while the desktop panel closes.
  const [shownId, setShownId] = useState<string | null>(null);
  // Bumped on every open so video players reset.
  const [openCount, setOpenCount] = useState(0);

  function toggle(id: string) {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    setShownId(id);
    setOpenCount((c) => c + 1);
    setTimeout(() => {
      const panel = Array.from(document.querySelectorAll<HTMLElement>("[data-vault-panel]")).find(
        (el) => el.offsetParent !== null && el.getAttribute("aria-hidden") === "false",
      );
      scrollIntoViewIfLow(panel);
    }, 550);
  }

  const shownIndex = Math.max(0, books.findIndex((c) => c.id === shownId));

  return (
    <div>
      <div
        className="grid gap-12 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))] lg:gap-6"
        style={{ "--cols": books.length } as React.CSSProperties}
      >
        {books.map((book) => {
          const m = METALS[book.metal];
          const sealed = vaultItems.every((item) => item.section !== book.id);
          const isOpen = openId === book.id;
          const isHovered = hoveredId === book.id;
          const button = metalButton(m, sealed ? "sealed" : isOpen ? "open" : "ready");

          return (
            <div key={book.id}>
              <div
                className="flex flex-col items-center text-center"
                onPointerEnter={(e) => e.pointerType === "mouse" && setHoveredId(book.id)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setHoveredId(null)}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  disabled={sealed}
                  onClick={() => toggle(book.id)}
                  className={`relative block w-28 transition-[transform,filter] duration-300 sm:w-32 ${
                    sealed ? "cursor-not-allowed opacity-40 grayscale" : "cursor-pointer"
                  } ${isHovered && !isOpen ? "scale-[1.03]" : ""}`}
                  style={
                    !sealed && (isOpen || isHovered)
                      ? { filter: `drop-shadow(0 0 24px rgba(${m.rgb},${isOpen ? 0.55 : 0.4}))` }
                      : undefined
                  }
                >
                  <MissalBook metal={book.metal} open={isOpen} nudge={isHovered && !sealed} />
                </button>
                <h3 className="mt-7 text-balance font-serif text-2xl font-semibold text-white">{book.title}</h3>
                <button
                  type="button"
                  disabled={sealed}
                  onClick={() => toggle(book.id)}
                  aria-expanded={isOpen}
                  className={`mt-5 rounded-full border px-7 py-2.5 text-sm font-semibold transition-all duration-100 ${button.className}`}
                  style={button.style}
                >
                  {sealed ? "Coming Soon" : isOpen ? "Close" : "Open"}
                </button>
              </div>

              {/* Mobile/tablet: contents open right under this book */}
              <BookContents
                book={book}
                open={isOpen}
                beamAt={50}
                openCount={openCount}
                className="mt-6 lg:hidden"
              />
            </div>
          );
        })}
      </div>

      {/* Desktop: contents open under the row of books, lit from the open one */}
      <BookContents
        book={books.find((c) => c.id === shownId)}
        open={openId !== null}
        beamAt={((shownIndex * 2 + 1) / (books.length * 2)) * 100}
        openCount={openCount}
        className="mt-8 hidden lg:grid"
      />
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-7 w-7" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

// The big vaults at the top. The chosen one sits large in the middle; the
// others shrink and fade off to the sides. Opening a vault shows its books.
export default function VaultExplorer() {
  const n = vaults.length;
  // Where the carousel has turned to. Keeps counting past the ends (and below
  // zero) so the vaults loop around smoothly in either direction.
  const [pos, setPos] = useState(0);
  const active = ((pos % n) + n) % n;
  const [openId, setOpenId] = useState<string | null>(null);
  // Keep the last-opened vault's books rendered while the room closes.
  const [shownId, setShownId] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  // How far a finger has dragged the carousel (px) during a swipe.
  const [dragPx, setDragPx] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipe = useRef<{ x: number; y: number; dragging: boolean } | null>(null);
  // Set after a swipe so lifting the finger doesn't also "click" a vault.
  const swiped = useRef(false);
  const roomRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const vault = vaults[active];
  const m = METALS[vault.metal];
  const sealed = vault.books.length === 0;
  const isOpen = openId === vault.id;
  const shown = vaults.find((v) => v.id === shownId);
  const button = metalButton(m, sealed ? "sealed" : isOpen ? "open" : spinning ? "pressed" : "ready");

  // How many vaults show on each side of the middle one (the rest wait off-stage).
  const reach = Math.max(1, Math.min(2, Math.floor((n - 1) / 2)));

  function turn(delta: number) {
    if (delta === 0) return;
    if (timer.current) clearTimeout(timer.current);
    setSpinning(false);
    setOpenId(null);
    setHovered(false);
    setPos((p) => p + delta);
  }

  // Turn to vault `i` the short way around.
  function goTo(i: number) {
    let d = (((i - active) % n) + n) % n;
    if (d > n / 2) d -= n;
    turn(d);
  }

  function toggle() {
    if (sealed || spinning) return;
    if (isOpen) {
      setOpenId(null);
      return;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSpinning(true);
    timer.current = setTimeout(
      () => {
        setSpinning(false);
        setOpenId(vault.id);
        setShownId(vault.id);
        setOpenCount((c) => c + 1);
        timer.current = setTimeout(() => scrollIntoViewIfLow(roomRef.current), 700);
      },
      reduceMotion ? 0 : SPIN_MS,
    );
  }

  function endSwipe() {
    swipe.current = null;
    setDragPx(0);
  }

  const arrowClass =
    "absolute top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#0e1628]/70 text-white/80 backdrop-blur transition-all hover:scale-105 hover:border-gold hover:text-gold lg:flex";

  return (
    <div className="mx-auto max-w-5xl">
      {/* Carousel: swipe, arrow keys, or click a side vault to bring it to the middle */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Vaults"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") turn(-1);
          if (e.key === "ArrowRight") turn(1);
        }}
        onPointerDown={(e) => {
          swiped.current = false;
          if (e.pointerType !== "mouse") swipe.current = { x: e.clientX, y: e.clientY, dragging: false };
        }}
        onPointerMove={(e) => {
          const s = swipe.current;
          if (!s) return;
          const dx = e.clientX - s.x;
          const dy = e.clientY - s.y;
          if (!s.dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) s.dragging = true;
          if (s.dragging) setDragPx(dx);
        }}
        onPointerUp={(e) => {
          const s = swipe.current;
          if (s?.dragging) {
            swiped.current = true;
            const dx = e.clientX - s.x;
            if (Math.abs(dx) > 50) turn(dx < 0 ? 1 : -1);
          }
          endSwipe();
        }}
        onPointerCancel={endSwipe}
        className="relative -mx-6 touch-pan-y select-none overflow-hidden px-6 py-4 [--step:150px] sm:[--step:250px] lg:[--step:330px]"
      >
        <div className="relative mx-auto h-52 sm:h-72">
          {Array.from({ length: reach * 2 + 3 }, (_, j) => j - reach - 1).map((offset) => {
            // Each spot on the carousel is keyed by its absolute position, so
            // vaults slide from spot to spot and loop around without jumping.
            const p = pos + offset;
            const i = ((p % n) + n) % n;
            const v = vaults[i];
            const dist = Math.abs(offset);
            const isActive = offset === 0;
            const offStage = dist > reach;
            const scale = isActive ? 1 : dist === 1 ? 0.55 : dist === 2 ? 0.34 : 0.22;
            const opacity = offStage ? 0 : isActive ? 1 : dist === 1 ? 0.55 : 0.2;
            const x = Math.sign(offset) * (dist === 0 ? 0 : 1 + (dist - 1) * 0.5);
            const vm = METALS[v.metal];
            const lit = isActive && hovered && !isOpen && v.books.length > 0;

            return (
              <div
                key={p}
                className={`absolute left-1/2 top-0 w-52 sm:w-72 ${
                  dragPx
                    ? ""
                    : "transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                }`}
                style={{
                  transform: `translateX(calc(-50% + var(--step) * ${x} + ${dragPx}px)) scale(${scale})`,
                  opacity,
                  zIndex: 10 - dist,
                  filter: isActive ? "none" : "saturate(0.6) brightness(0.8)",
                  pointerEvents: offStage ? "none" : undefined,
                }}
                onPointerEnter={(e) => isActive && e.pointerType === "mouse" && setHovered(true)}
                onPointerLeave={() => isActive && setHovered(false)}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  onClick={() => {
                    if (swiped.current) return;
                    if (isActive) toggle();
                    else turn(offset);
                  }}
                  className={`relative block w-full transition-[transform,filter] duration-300 ${
                    isActive && v.books.length === 0 ? "cursor-default" : "cursor-pointer"
                  } ${lit ? "scale-[1.03]" : ""}`}
                  style={lit ? { filter: `drop-shadow(0 0 26px rgba(${vm.rgb},0.45))` } : undefined}
                >
                  {isActive && isOpen && (
                    <span
                      key={openCount}
                      className="pointer-events-none absolute inset-0 animate-vault-burst rounded-full motion-reduce:hidden"
                      style={{
                        background: `radial-gradient(circle, rgba(255,245,215,0.9), rgba(${vm.rgb},0.45) 40%, transparent 70%)`,
                      }}
                    />
                  )}
                  <VaultDoor
                    uid={`${v.id}-${p}`}
                    icon={v.icon}
                    metal={v.metal}
                    spinning={isActive && spinning}
                    open={isActive && isOpen}
                    nudge={lit}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Desktop: big arrows on either side */}
        <button type="button" onClick={() => turn(-1)} aria-label="Previous vault" className={`${arrowClass} left-6`}>
          <Chevron dir="left" />
        </button>
        <button type="button" onClick={() => turn(1)} aria-label="Next vault" className={`${arrowClass} right-6`}>
          <Chevron dir="right" />
        </button>
      </div>

      {/* Dots (tap one to jump to that vault) */}
      <div className="mt-4 flex items-center justify-center gap-2.5">
        {vaults.map((v, i) => (
          <button
            key={v.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Vault ${pad2(i + 1)}: ${v.title}`}
            aria-current={i === active}
            className="h-2.5 rounded-full transition-all duration-300"
            style={{
              width: i === active ? 28 : 10,
              background: i === active ? METALS[v.metal].mid : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
      <p className="mt-3 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 lg:hidden">
        <span aria-hidden="true">&larr;</span> Swipe for more vaults <span aria-hidden="true">&rarr;</span>
      </p>

      {/* Name of the vault in the middle, and its Unlock button */}
      <div key={vault.id} className="mt-6 flex flex-col items-center text-center motion-safe:animate-vault-fade" aria-live="polite">
        <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">{vault.title}</h2>
        <p className="mt-3 max-w-md text-pretty text-white/65">{vault.blurb}</p>
        <button
          type="button"
          disabled={sealed}
          onClick={toggle}
          aria-expanded={sealed ? undefined : isOpen}
          className={`relative mt-6 overflow-hidden rounded-full border px-7 py-2.5 text-sm font-semibold transition-all duration-100 ${button.className}`}
          style={button.style}
        >
          {/* Light glinting across the metal */}
          {!sealed && !isOpen && !spinning && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 animate-shimmer bg-linear-to-r from-transparent from-35% via-white/60 to-transparent to-65% motion-reduce:hidden"
            />
          )}
          <span className="relative flex items-center gap-2">
            <span key={spinning ? "pop" : "rest"} className={`inline-flex ${spinning ? "animate-lock-pop" : ""}`}>
              <LockIcon open={isOpen || spinning} />
            </span>
            {sealed ? "Coming Soon" : spinning ? "Unlocking…" : isOpen ? "Close Vault" : "Unlock Vault"}
          </span>
        </button>
      </div>

      {/* Inside the open vault: its books */}
      <div
        ref={roomRef}
        inert={!isOpen}
        aria-hidden={!isOpen}
        className={`grid transition-[grid-template-rows] duration-700 ease-out motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {shown && (
            <div
              className={`relative -mx-2 mt-12 rounded-[2rem] px-0 pb-12 pt-10 transition-all duration-700 ease-out motion-reduce:transition-none sm:mx-0 sm:border sm:px-8 ${
                isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{
                borderColor: `rgba(${METALS[shown.metal].rgb},0.25)`,
                background: `radial-gradient(ellipse at top, rgba(${METALS[shown.metal].rgb},0.14), transparent 65%)`,
                transitionDelay: isOpen ? "200ms" : "0ms",
              }}
            >
              <p className="mb-10 text-balance text-center font-mono text-xs uppercase tracking-[0.25em] text-white/45">
                {`Inside the ${shown.title} Vault · Choose a book`}
              </p>
              {/* Remounts on every open so the books start closed */}
              <BookRow key={`${shown.id}-${openCount}`} books={shown.books} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

