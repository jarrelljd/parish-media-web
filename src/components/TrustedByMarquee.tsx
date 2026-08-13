"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { clients } from "@/data/clients";

const LOOP_DURATION_MS = 55000;
const RESUME_DELAY_MS = 400;
// Some mobile browsers (notably WebKit/iOS Safari) don't reliably fire
// pointerup/pointercancel when a touch that starts on the marquee hands off
// to native page scrolling, which would otherwise leave it paused forever.
// This guarantees a resume no matter which release event does or doesn't fire.
const SAFETY_RESUME_MS = 3000;

function subscribeToReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function getInitials(name: string) {
  const words = name.replace(/^Fr\.\s*/, "").split(" ").filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function ClientBadge({ client }: { client: (typeof clients)[number] }) {
  return (
    <div className="flex w-40 shrink-0 flex-col items-center text-center">
      <div className="h-14 w-14 overflow-hidden rounded-full border border-navy/10 bg-navy/5">
        {client.photo ? (
          <Image
            src={client.photo}
            alt={client.name}
            width={56}
            height={56}
            draggable={false}
            className="h-full w-full object-cover"
            style={{
              objectPosition: client.photoPosition ?? "50% 50%",
              transform: client.photoZoom
                ? `scale(${client.photoZoom})`
                : undefined,
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-serif text-sm font-semibold text-navy/40">
            {getInitials(client.name)}
          </div>
        )}
      </div>
      <p className="mt-2 text-xs font-semibold text-navy">{client.name}</p>
      {client.org && (
        <p className="mt-0.5 text-xs text-navy/60">{client.org}</p>
      )}
      {client.diocese && (
        <p className="mt-0.5 text-[11px] uppercase tracking-wide text-navy/40">
          {client.diocese}
        </p>
      )}
    </div>
  );
}

export default function TrustedByMarquee() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const halfWidthRef = useRef(0);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  // The list renders twice back to back for a seamless loop; "half" is the
  // width of one copy.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function measure() {
      if (el) halfWidthRef.current = el.scrollWidth / 2;
    }
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  // Start at the seam between the two copies so there's a full copy-width
  // of native scroll room in both directions before a wrap is ever needed.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      if (el && halfWidthRef.current > 0) {
        el.scrollLeft = halfWidthRef.current;
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Silently reset scrollLeft by one copy-width whenever it strays close to
  // either edge of the doubled content — invisible since both copies are
  // identical, and it doesn't care whether the scroll came from auto-scroll
  // or the user dragging, so both directions stay infinite.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function handleScroll() {
      const half = halfWidthRef.current;
      if (!el || half <= 0) return;
      const margin = half * 0.1;
      if (el.scrollLeft < margin) {
        el.scrollLeft += half;
      } else if (el.scrollLeft > half * 2 - margin) {
        el.scrollLeft -= half;
      }
    }
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Idle auto-scroll, paused while the user is touching, dragging, or
  // hovering (desktop). Native scrolling handles all actual interaction.
  useEffect(() => {
    if (reducedMotion) return;
    let lastTime: number | null = null;
    let rafId: number;

    function frame(time: number) {
      const el = scrollRef.current;
      const half = halfWidthRef.current;
      if (el && !pausedRef.current && half > 0 && lastTime !== null) {
        const dt = time - lastTime;
        el.scrollLeft += (half / LOOP_DURATION_MS) * dt;
      }
      lastTime = time;
      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  function pause() {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, SAFETY_RESUME_MS);
  }

  function scheduleResume() {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY_MS);
  }

  return (
    <>
      <style>{`
        .trusted-by-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div
        ref={scrollRef}
        className="trusted-by-scroll flex gap-x-10 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none]"
        onPointerDown={pause}
        onPointerUp={scheduleResume}
        onPointerCancel={scheduleResume}
        onTouchEnd={scheduleResume}
        onTouchCancel={scheduleResume}
        onMouseEnter={pause}
        onMouseLeave={scheduleResume}
      >
        {[...clients, ...clients].map((client, i) => (
          <ClientBadge key={`${client.name}-${i}`} client={client} />
        ))}
      </div>
    </>
  );
}
