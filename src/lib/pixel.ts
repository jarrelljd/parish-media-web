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

// Custom event for every completed scorecard (any role). Pastors also fire a
// Lead via trackLead; this one only counts completions. eventId matches the
// server's ScorecardComplete so Meta dedupes the pair.
export function trackScorecardComplete(role: string, eventId?: string) {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  fbq?.(
    "trackCustom",
    "ScorecardComplete",
    { content_name: "Social Media Scorecard", role },
    eventId ? { eventID: eventId } : undefined,
  );
}

// Custom event for every free guide / free website request (any role).
// Pastors also fire a Lead via trackLead. eventId matches the server's event
// of the same name so Meta dedupes the pair.
export function trackSignup(
  eventName: "GuideRequest" | "WebsiteRequest",
  contentName: string,
  role: string,
  eventId?: string,
) {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  fbq?.(
    "trackCustom",
    eventName,
    { content_name: contentName, role },
    eventId ? { eventID: eventId } : undefined,
  );
}

// Standard Meta "Schedule" event — for an actual booked appointment (e.g. a
// completed Calendly booking), distinct from "Lead" above. Pass eventId when
// the server also sends this booking (see ScheduleTracker) so Meta dedupes.
export function trackSchedule(contentName?: string, eventId?: string) {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  fbq?.(
    "track",
    "Schedule",
    contentName ? { content_name: contentName } : {},
    eventId ? { eventID: eventId } : undefined,
  );
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
