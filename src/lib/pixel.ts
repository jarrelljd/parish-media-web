// Thin wrapper around the Meta Pixel's fbq() global (see components/MetaPixel.tsx).
// Safe to call even when no pixel is configured — fbq just won't exist yet.
type Fbq = (...args: unknown[]) => void;

export function trackLead(contentName: string) {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  fbq?.("track", "Lead", { content_name: contentName });
}
