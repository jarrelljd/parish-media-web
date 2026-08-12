import { createHash } from "crypto";

// Server-side Meta Conversions API — sends events directly from our server
// instead of relying on the browser's Meta Pixel to report them accurately.
// Set up 2026-07-27 after the browser pixel proved unreliable for both the
// page URL (dl) and custom event data (cd) it was supposed to send — see
// git history on components/MetaPixel.tsx for the full investigation. Run
// alongside (not instead of) the browser pixel, deduplicated via event_id,
// per Meta's own recommended "Pixel + CAPI together" setup.

const GRAPH_API_VERSION = "v21.0";
const SITE_URL = "https://parishmediacompany.com";

function hashForMeta(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function sendLeadConversionEvent({
  parishSlug,
  eventSlug,
  eventId,
  contentName,
  email,
  phone,
  userAgent,
  ipAddress,
}: {
  parishSlug: string;
  eventSlug: string;
  eventId: string;
  contentName: string;
  email?: string;
  phone?: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;
  if (!pixelId || !accessToken) {
    // Not configured — skip silently, same as the browser pixel's own
    // "no pixel ID, don't render" behavior. Never block the RSVP over this.
    return;
  }

  const userData: Record<string, unknown> = {};
  if (email) userData.em = [hashForMeta(email)];
  if (phone) {
    const digitsOnly = phone.replace(/[^0-9]/g, "");
    if (digitsOnly) userData.ph = [hashForMeta(digitsOnly)];
  }
  if (userAgent) userData.client_user_agent = userAgent;
  if (ipAddress) userData.client_ip_address = ipAddress;

  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        // Built from the event's own known slugs, not anything detected at
        // runtime — the whole point of this file is not repeating the
        // browser pixel's "guess the URL" problem.
        event_source_url: `${SITE_URL}/events/${parishSlug}/${eventSlug}`,
        user_data: userData,
        custom_data: { content_name: contentName },
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    if (!response.ok) {
      console.error(
        "Meta Conversions API error:",
        response.status,
        await response.text(),
      );
    }
  } catch (err) {
    console.error("Failed to reach Meta Conversions API:", err);
  }
}

// Generic (non-event-page) Lead event — for lead-gen forms outside the
// parish/event RSVP flow (e.g. the /free-guide ebook form), where there's no
// parishSlug/eventSlug to build a source URL from.
export async function sendGenericLeadEvent({
  eventId,
  contentName,
  sourcePath,
  email,
  phone,
  userAgent,
  ipAddress,
}: {
  eventId: string;
  contentName: string;
  sourcePath: string;
  email?: string;
  phone?: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;
  if (!pixelId || !accessToken) {
    return;
  }

  const userData: Record<string, unknown> = {};
  if (email) userData.em = [hashForMeta(email)];
  if (phone) {
    const digitsOnly = phone.replace(/[^0-9]/g, "");
    if (digitsOnly) userData.ph = [hashForMeta(digitsOnly)];
  }
  if (userAgent) userData.client_user_agent = userAgent;
  if (ipAddress) userData.client_ip_address = ipAddress;

  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: `${SITE_URL}${sourcePath}`,
        user_data: userData,
        custom_data: { content_name: contentName },
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    if (!response.ok) {
      console.error(
        "Meta Conversions API error:",
        response.status,
        await response.text(),
      );
    }
  } catch (err) {
    console.error("Failed to reach Meta Conversions API:", err);
  }
}
