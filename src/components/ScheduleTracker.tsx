"use client";

import { useEffect } from "react";
import { consumeScheduleTracked, trackSchedule } from "@/lib/pixel";

// Fires Meta "Schedule" on /call-confirmed, where Calendly redirects after a
// booking. Skips if an on-site embed already fired it for this booking.
export default function ScheduleTracker() {
  useEffect(() => {
    if (consumeScheduleTracked()) return;
    let cancelled = false;

    // Same readiness check as MetaPixel.tsx: wait for the real fbevents.js
    // (fbq.callMethod) so the event isn't stuck in the placeholder queue.
    const fireWhenReady = () => {
      if (cancelled) return;
      const fbq = (window as unknown as { fbq?: { callMethod?: unknown } })
        .fbq;
      if (!fbq || !fbq.callMethod) {
        setTimeout(fireWhenReady, 100);
        return;
      }
      trackSchedule();
    };

    fireWhenReady();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
