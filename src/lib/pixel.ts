// Thin wrapper around the Meta Pixel's fbq() global (see components/MetaPixel.tsx).
// Safe to call even when no pixel is configured — fbq just won't exist yet.
type Fbq = (...args: unknown[]) => void;

// eventId, when provided, matches the event_id the server already sent via
// the Meta Conversions API for this same submission (see actions.ts /
// metaConversionsApi.ts) — Meta uses it to dedupe the two into one Lead
// instead of double-counting.
export function trackLead(contentName: string, eventId?: string) {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  fbq?.("track", "Lead", { content_name: contentName }, eventId ? { eventID: eventId } : undefined);
}

// Standard Meta "Schedule" event — for an actual booked appointment (e.g. a
// completed Calendly booking), distinct from "Lead" above.
export function trackSchedule() {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  fbq?.("track", "Schedule");
}

// Calendly redirects to /call-confirmed after a booking, which also fires
// Schedule. When an on-site embed already fired it (see CalendlyEmbed), this
// flag tells /call-confirmed to skip so the booking isn't counted twice.
const SCHEDULE_FLAG = "pmc_schedule_tracked";

export function markScheduleTracked() {
  try {
    sessionStorage.setItem(SCHEDULE_FLAG, "1");
  } catch {}
}

export function consumeScheduleTracked(): boolean {
  try {
    const tracked = sessionStorage.getItem(SCHEDULE_FLAG) === "1";
    sessionStorage.removeItem(SCHEDULE_FLAG);
    return tracked;
  } catch {
    return false;
  }
}
