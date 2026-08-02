"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { clients } from "@/data/clients";

const LOOP_DURATION_MS = 55000;

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
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const halfWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const pausedRef = useRef(false);

  // Respect prefers-reduced-motion: skip the ambient auto-scroll entirely,
  // but dragging still works below since that's user-initiated, not ambient.
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  // The list is rendered twice back to back for a seamless loop; "half" is
  // the width of one copy, i.e. the point where we wrap the position back.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    function measure() {
      if (track) halfWidthRef.current = track.scrollWidth / 2;
    }
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    let lastTime: number | null = null;
    let rafId: number;

    function frame(time: number) {
      if (lastTime === null) lastTime = time;
      const dt = time - lastTime;
      lastTime = time;

      const half = halfWidthRef.current;
      if (!draggingRef.current && !pausedRef.current && half > 0) {
        positionRef.current -= (half / LOOP_DURATION_MS) * dt;
      }

      if (half > 0) {
        if (positionRef.current <= -half) positionRef.current += half;
        else if (positionRef.current > 0) positionRef.current -= half;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${positionRef.current}px)`;
      }

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    lastPointerXRef.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    const delta = e.clientX - lastPointerXRef.current;
    lastPointerXRef.current = e.clientX;
    positionRef.current += delta;
  }

  function endDrag() {
    draggingRef.current = false;
  }

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div
        ref={trackRef}
        className="flex w-max cursor-grab items-start gap-x-10 select-none active:cursor-grabbing"
        style={{ touchAction: "pan-y" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onDragStart={(e) => e.preventDefault()}
      >
        {[...clients, ...clients].map((client, i) => (
          <ClientBadge key={`${client.name}-${i}`} client={client} />
        ))}
      </div>
    </div>
  );
}
