"use client";

import { useEffect } from "react";
import Script from "next/script";
import { trackSchedule } from "@/lib/pixel";

export default function CalendlyEmbed({
  url,
  trackScheduleEvent = false,
}: {
  url: string;
  // Fires the Meta "Schedule" event the moment Calendly's own inline widget
  // reports a completed booking (via its postMessage API — no Calendly-side
  // webhook or redirect config needed). Opt-in per page since not every
  // consult variant needs it tracked yet.
  trackScheduleEvent?: boolean;
}) {
  useEffect(() => {
    if (!trackScheduleEvent) return;

    function handleMessage(event: MessageEvent) {
      if (event.data?.event === "calendly.event_scheduled") {
        trackSchedule();
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [trackScheduleEvent]);

  return (
    <>
      <div
        className="calendly-inline-widget"
        data-url={url}
        style={{ minWidth: "320px", height: "700px" }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
    </>
  );
}
