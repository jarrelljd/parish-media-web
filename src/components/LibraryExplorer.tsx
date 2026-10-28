"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  isComingSoon,
  vaultItemHref,
  vaultItems,
  shelves,
  videoEmbedUrl,
  type ShelfIcon,
  type VaultBook,
  type VaultItem,
  type VaultMetal,
} from "@/data/vault";

// How long the books take to come off the shelf before the shelf opens.
const PULL_MS = 700;

// Colors for each shelf and book. `rgb` drives the glow, light beam, and button.
const METALS: Record<VaultMetal, { hi: string; mid: string; lo: string; rgb: string }> = {
  brass: { hi: "#f7e6a6", mid: "#c9a227", lo: "#5c470e", rgb: "201,162,39" },
  steel: { hi: "#f1f5fa", mid: "#a3b3c7", lo: "#34425a", rgb: "163,179,199" },
  copper: { hi: "#f9cfae", mid: "#c8733f", lo: "#55250e", rgb: "200,115,63" },
  violet: { hi: "#e6d4f7", mid: "#8a5cc0", lo: "#2c1446", rgb: "138,92,192" },
  crimson: { hi: "#f9c9c6", mid: "#b8393e", lo: "#470d12", rgb: "184,57,62" },
  emerald: { hi: "#cdf2db", mid: "#2f9461", lo: "#0b3820", rgb: "47,148,97" },
  sapphire: { hi: "#d3e3fc", mid: "#3d72c9", lo: "#102657", rgb: "61,114,201" },
};

// Icons on each shelf's brass medallion, drawn on a 24×24 grid.
function ShelfIconShape({ icon, color }: { icon: ShelfIcon; color: string }) {
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
    case "bulletin":
      // Folded newsletter
      return (
        <>
          <path {...line} d="M4 5h13v14H6a2 2 0 0 1-2-2z" />
          <path {...line} d="M17 9h3v8a2 2 0 0 1-2 2h-1" />
          <rect x="7" y="8" width="7" height="3.2" rx="0.6" fill={color} />
          <path {...line} strokeWidth={1.8} d="M7 14.5h7M7 17h5" />
        </>
      );
  }
}

// Leather colors for the ordinary books on the shelves.
const SPINE_COLORS = ["#6b1f24", "#2c3e5c", "#3d5a3a", "#7a5a2a", "#4a2c5c", "#8a7350", "#5a2a1a", "#1f2a3a", "#6e6250"];

// Shelf layout, in the bookcase's 200×240 drawing.
const SHELF_X0 = 21;
const SHELF_X1 = 179;
const COMPARTMENTS = [
  { top: 42, bottom: 96 },
  { top: 102, bottom: 156 },
  { top: 162, bottom: 216 },
];
// Space kept free in the middle shelf for the shelf's own books.
const FEATURE_X0 = 76;
const FEATURE_X1 = 124;

type Spine = { x: number; w: number; h: number; color: string; bands: boolean; lean: number };

// Fills the shelves with books. Seeded, so each bookcase always looks the
// same and the server and browser draw identical books.
function makeSpines(seedText: string, fill: number) {
  let seed = 0;
  for (const ch of seedText) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const shelves: Spine[][] = [];
  COMPARTMENTS.forEach((comp, c) => {
    const spines: Spine[] = [];
    const room = comp.bottom - comp.top;
    const end = SHELF_X0 + (SHELF_X1 - SHELF_X0) * (fill < 1 ? fill * (0.6 + rand() * 0.8) : 1);
    let x = SHELF_X0 + (fill < 1 ? rand() * 20 : 0);
    while (x < end - 6) {
      if (c === 1 && fill === 1 && x + 14 > FEATURE_X0 && x < FEATURE_X1) {
        x = FEATURE_X1 + 1;
        continue;
      }
      const w = Math.round((6 + rand() * 7) * 10) / 10;
      if (x + w > SHELF_X1 - 1) break;
      const h = Math.round(room * (0.62 + rand() * 0.3));
      spines.push({ x, w, h, color: SPINE_COLORS[Math.floor(rand() * SPINE_COLORS.length)], bands: rand() > 0.45, lean: 0 });
      x += w + 0.6;
    }
    // A book leaning against the last one, if there's room.
    if (fill < 1 && spines.length && x < SHELF_X1 - 18) {
      const h = Math.round(room * 0.7);
      spines.push({ x: x + 2, w: 8, h, color: SPINE_COLORS[Math.floor(rand() * SPINE_COLORS.length)], bands: true, lean: 14 });
    }
    shelves.push(spines);
  });
  return shelves;
}

function SpineShape({ s, bottom, uid }: { s: Spine; bottom: number; uid: string }) {
  const y = bottom - s.h;
  return (
    <g transform={s.lean ? `rotate(${s.lean} ${s.x} ${bottom})` : undefined}>
      <rect x={s.x} y={y} width={s.w} height={s.h} rx="0.8" fill={s.color} />
      <rect x={s.x} y={y} width={s.w} height={s.h} rx="0.8" fill={`url(#${uid}-spine)`} />
      {s.bands && (
        <>
          <rect x={s.x + 0.8} y={y + 4} width={s.w - 1.6} height="1.1" fill="#d9b54a" opacity="0.7" />
          <rect x={s.x + 0.8} y={bottom - 6} width={s.w - 1.6} height="1.1" fill="#d9b54a" opacity="0.7" />
        </>
      )}
    </g>
  );
}

// A carved wooden bookcase with a brass medallion on top. When a shelf has
// books, its own books (one per color) stand in the middle; opening the shelf
// lifts them off and the shelf glows. Shelves with nothing yet look sparse,
// with a "Coming Soon" card.
function Bookcase({
  uid,
  seed,
  icon,
  metal,
  books,
  pulling,
  open,
  nudge = false,
}: {
  // Unique per bookcase, so each one's SVG gradients don't collide.
  uid: string;
  // Decides how the ordinary books are arranged (use the shelf's id).
  seed: string;
  icon: ShelfIcon;
  metal: VaultMetal;
  books: VaultBook[];
  pulling: boolean;
  open: boolean;
  // Hovering the shelf tips its books forward slightly.
  nudge?: boolean;
}) {
  const m = METALS[metal];
  const id = `case-${uid}`;
  const empty = books.length === 0;
  const spines = makeSpines(seed, empty ? 0.35 : 1);
  const lifted = pulling || open;
  const featureW = 13;
  const featureGap = 2.5;
  const featureStart = 100 - (books.length * featureW + (books.length - 1) * featureGap) / 2;
  const mid = COMPARTMENTS[1];

  return (
    <svg viewBox="0 0 200 240" className="block h-auto w-full overflow-visible drop-shadow-[0_16px_26px_rgba(0,0,0,0.6)]" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2e1b0e" />
          <stop offset="18%" stopColor="#6b4526" />
          <stop offset="55%" stopColor="#5a381e" />
          <stop offset="100%" stopColor="#2a180c" />
        </linearGradient>
        <linearGradient id={`${id}-board`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a5a32" />
          <stop offset="100%" stopColor="#3a2414" />
        </linearGradient>
        <linearGradient id={`${id}-back`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0704" />
          <stop offset="100%" stopColor="#1e120a" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fff3d2" stopOpacity="0.95" />
          <stop offset="40%" stopColor={`rgb(${m.rgb})`} stopOpacity="0.55" />
          <stop offset="100%" stopColor={`rgb(${m.rgb})`} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-spine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id={`${id}-brass`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f7e6a6" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#5c470e" />
        </radialGradient>
      </defs>

      {/* Arched top, case, and base */}
      <path d="M4 36 V30 Q100 2 196 30 V36 Z" fill={`url(#${id}-wood)`} stroke="#1c1008" strokeWidth="1" />
      <path d="M12 30 Q100 8 188 30" fill="none" stroke="#a87a48" strokeOpacity="0.45" strokeWidth="1" />
      <rect x="10" y="34" width="180" height="190" fill={`url(#${id}-wood)`} stroke="#1c1008" strokeWidth="1" />
      <rect x="4" y="222" width="192" height="14" rx="2" fill={`url(#${id}-board)`} stroke="#1c1008" strokeWidth="1" />

      {/* Back of the shelves, lit when the shelf is open */}
      <rect x="20" y="42" width="160" height="176" fill={`url(#${id}-back)`} />
      <rect
        x="20"
        y="42"
        width="160"
        height="176"
        fill={`url(#${id}-glow)`}
        className="transition-opacity duration-700 motion-reduce:transition-none"
        style={{ opacity: open ? 1 : nudge && !empty ? 0.25 : 0 }}
      />

      {/* Books */}
      {spines.map((row, c) => (
        <g key={c}>
          {row.map((s, i) => (
            <SpineShape key={i} s={s} bottom={COMPARTMENTS[c].bottom} uid={id} />
          ))}
        </g>
      ))}

      {/* The shelf's own books, lifted off when it opens */}
      {books.map((book, i) => {
        const bm = METALS[book.metal];
        const x = featureStart + i * (featureW + featureGap);
        const h = mid.bottom - mid.top - 6;
        const y = mid.bottom - h;
        return (
          <g
            key={book.id}
            className="transition-[transform,opacity] ease-out motion-reduce:transition-none"
            style={{
              transformBox: "fill-box",
              transformOrigin: "50% 100%",
              transform: lifted ? "translateY(-38px) scale(1.15)" : nudge ? "translateY(-3px)" : "none",
              opacity: lifted ? 0 : 1,
              transitionDuration: `${PULL_MS}ms`,
              transitionDelay: lifted ? `${i * 90}ms` : "0ms",
            }}
          >
            <rect x={x} y={y} width={featureW} height={h} rx="1" fill={bm.mid} stroke={bm.lo} strokeWidth="0.6" />
            <rect x={x} y={y} width={featureW} height={h} rx="1" fill={`url(#${id}-spine)`} />
            <rect x={x + 1} y={y + 4} width={featureW - 2} height="1.3" fill="#d9b54a" />
            <rect x={x + 1} y={y + h - 6} width={featureW - 2} height="1.3" fill="#d9b54a" />
            <path
              d={`M${x + featureW / 2 - 0.7} ${y + 14}h1.4v4h3v1.4h-3v8h-1.4v-8h-3v-1.4h3z`}
              fill="#d9b54a"
            />
          </g>
        );
      })}

      {/* Coming Soon card and a cobweb on shelves with nothing yet */}
      {empty && (
        <>
          <g transform={`rotate(-6 100 ${mid.bottom})`}>
            <rect x="72" y={mid.bottom - 26} width="56" height="24" rx="1.5" fill="#efe6cf" stroke="#8a7350" strokeWidth="0.6" />
            <text
              x="100"
              y={mid.bottom - 13.5}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="6.4"
              fontWeight="700"
              letterSpacing="0.6"
              fill="#3a3326"
            >
              COMING SOON
            </text>
          </g>
          <g fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="0.5">
            <path d="M20 42 L44 42 M20 42 L20 66 M20 42 L38 60 M20 42 L30 64 M20 42 L42 52" />
            <path d="M28 42 Q27 48 20 50 M36 42 Q34 54 20 58 M43 44 Q38 58 22 64" />
          </g>
        </>
      )}

      {/* Shelf boards */}
      {[96, 156, 216].map((y) => (
        <g key={y}>
          <rect x="18" y={y} width="164" height="6" fill={`url(#${id}-board)`} />
          <rect x="18" y={y} width="164" height="1" fill="#b08050" opacity="0.5" />
        </g>
      ))}

      {/* Brass medallion with the shelf's icon */}
      <circle cx="100" cy="22" r="15" fill={`url(#${id}-brass)`} stroke="#3a2a08" strokeWidth="1.2" />
      <circle cx="100" cy="22" r="12" fill="none" stroke="#f7e6a6" strokeOpacity="0.5" strokeWidth="0.7" />
      <g transform="translate(91 13.4) scale(0.75)" opacity="0.6">
        <ShelfIconShape icon={icon} color="#f7e6a6" />
      </g>
      <g transform="translate(91 13) scale(0.75)">
        <ShelfIconShape icon={icon} color="#4a3608" />
      </g>
    </svg>
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

// An open book, for the Browse button.
function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5zM12 6.5v13" />
    </svg>
  );
}

type Metal = (typeof METALS)[VaultMetal];

const pad2 = (n: number) => String(n).padStart(2, "0");

// The book (or any link resource): a borderless feature at the top of a book.
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

// A video in the book's list: one clean row that expands to play.
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

// A document or link in the book's list: opens in a new tab.
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

// The 3D push-button style shared by the Browse and Open buttons.
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

// The books off an open shelf.
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

// The bookshelves at the top. The chosen one sits large in the middle; the
// others shrink and fade off to the sides. Opening a shelf shows its books.
export default function LibraryExplorer() {
  const n = shelves.length;
  // Where the carousel has turned to. Keeps counting past the ends (and below
  // zero) so the shelves loop around smoothly in either direction.
  const [pos, setPos] = useState(0);
  const active = ((pos % n) + n) % n;
  const [openId, setOpenId] = useState<string | null>(null);
  // Keep the last-opened shelf's books rendered while the room closes.
  const [shownId, setShownId] = useState<string | null>(null);
  const [pulling, setPulling] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  // How far a finger has dragged the carousel (px) during a swipe.
  const [dragPx, setDragPx] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipe = useRef<{ x: number; y: number; dragging: boolean } | null>(null);
  // Set after a swipe so lifting the finger doesn't also "click" a shelf.
  const swiped = useRef(false);
  const roomRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const shelf = shelves[active];
  const m = METALS[shelf.metal];
  const sealed = shelf.books.length === 0;
  const isOpen = openId === shelf.id;
  const shown = shelves.find((v) => v.id === shownId);
  const button = metalButton(m, sealed ? "sealed" : isOpen ? "open" : pulling ? "pressed" : "ready");

  // How many shelves show on each side of the middle one (the rest wait off-stage).
  const reach = Math.max(1, Math.min(2, Math.floor((n - 1) / 2)));

  function turn(delta: number) {
    if (delta === 0) return;
    if (timer.current) clearTimeout(timer.current);
    setPulling(false);
    setOpenId(null);
    setHovered(false);
    setPos((p) => p + delta);
  }

  // Turn to shelf `i` the short way around.
  function goTo(i: number) {
    let d = (((i - active) % n) + n) % n;
    if (d > n / 2) d -= n;
    turn(d);
  }

  function toggle() {
    if (sealed || pulling) return;
    if (isOpen) {
      setOpenId(null);
      return;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPulling(true);
    timer.current = setTimeout(
      () => {
        setPulling(false);
        setOpenId(shelf.id);
        setShownId(shelf.id);
        setOpenCount((c) => c + 1);
        timer.current = setTimeout(() => scrollIntoViewIfLow(roomRef.current), 700);
      },
      reduceMotion ? 0 : PULL_MS,
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
      {/* Carousel: swipe, arrow keys, or click a side shelf to bring it to the middle */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Bookshelves"
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
        <div className="relative mx-auto h-[250px] sm:h-[346px]">
          {Array.from({ length: reach * 2 + 3 }, (_, j) => j - reach - 1).map((offset) => {
            // Each spot on the carousel is keyed by its absolute position, so
            // shelves slide from spot to spot and loop around without jumping.
            const p = pos + offset;
            const i = ((p % n) + n) % n;
            const v = shelves[i];
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
                  <Bookcase
                    uid={`${v.id}-${p}`}
                    seed={v.id}
                    icon={v.icon}
                    metal={v.metal}
                    books={v.books}
                    pulling={isActive && pulling}
                    open={isActive && isOpen}
                    nudge={lit}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Desktop: big arrows on either side */}
        <button type="button" onClick={() => turn(-1)} aria-label="Previous shelf" className={`${arrowClass} left-6`}>
          <Chevron dir="left" />
        </button>
        <button type="button" onClick={() => turn(1)} aria-label="Next shelf" className={`${arrowClass} right-6`}>
          <Chevron dir="right" />
        </button>
      </div>

      {/* Dots (tap one to jump to that shelf) */}
      <div className="mt-4 flex items-center justify-center gap-2.5">
        {shelves.map((v, i) => (
          <button
            key={v.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`${v.title} shelf`}
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
        <span aria-hidden="true">&larr;</span> Swipe for more shelves <span aria-hidden="true">&rarr;</span>
      </p>

      {/* Name of the shelf in the middle, and its Browse button */}
      <div key={shelf.id} className="mt-6 flex flex-col items-center text-center motion-safe:animate-shelf-fade" aria-live="polite">
        <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">{shelf.title}</h2>
        <p className="mt-3 max-w-md text-pretty text-white/65">{shelf.blurb}</p>
        <button
          type="button"
          disabled={sealed}
          onClick={toggle}
          aria-expanded={sealed ? undefined : isOpen}
          className={`relative mt-6 overflow-hidden rounded-full border px-7 py-2.5 text-sm font-semibold transition-all duration-100 ${button.className}`}
          style={button.style}
        >
          {/* Light glinting across the button */}
          {!sealed && !isOpen && !pulling && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 animate-shimmer bg-linear-to-r from-transparent from-35% via-white/60 to-transparent to-65% motion-reduce:hidden"
            />
          )}
          <span className="relative flex items-center gap-2">
            <BookIcon />
            {sealed ? "Coming Soon" : pulling ? "Opening…" : isOpen ? "Close" : "Browse the Shelf"}
          </span>
        </button>
      </div>

      {/* Off the open shelf: its books */}
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
                {`From the ${shown.title} Shelf · Choose a book`}
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

