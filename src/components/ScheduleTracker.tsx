"use client";

import { useEffect } from "react";
import { submitScheduleEvent } from "@/app/actions";
import { consumeScheduleTracked, trackSchedule } from "@/lib/pixel";

const CONTENT_NAME = "Parish Growth Assessment";

// Fires Meta "Schedule" on /call-confirmed, where Calendly redirects after a
// Parish Growth Assessment booking. Sends it twice, deduped by one event ID:
// from the browser pixel and from our server (Conversions API), so bookings
// still count when the browser pixel is blocked. Calendly adds the booking
// details (invitee_uuid, invitee_email, invitee_full_name) to the URL.
// Skips if an on-site embed already fired it for this booking.
export default function ScheduleTracker() {
  useEffect(() => {
    if (consumeScheduleTracked()) return;
    let cancelled = false;

    const params = new URLSearchParams(window.location.search);
    // Using Calendly's invitee ID means a page refresh reuses the same ID,
    // so Meta still counts the booking once.
    const inviteeId = params.get("invitee_uuid");
    const eventId = inviteeId ? `schedule-${inviteeId}` : crypto.randomUUID();

    // A tracking failure must never break the page.
    submitScheduleEvent({
      eventId,
      email: params.get("invitee_email") ?? undefined,
      fullName: params.get("invitee_full_name") ?? undefined,
    }).catch((err: unknown) => console.error("Failed to send server Schedule:", err));

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
      try {
        trackSchedule(CONTENT_NAME, eventId);
      } catch (err) {
        console.error("Failed to fire Meta Pixel Schedule:", err);
      }
    };

    fireWhenReady();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
