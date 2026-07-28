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
