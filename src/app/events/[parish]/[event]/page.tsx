import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { events, getEvent } from "@/data/events";
import { getParish } from "@/data/parishes";
import EventPageContent from "@/components/EventPageContent";

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export async function generateStaticParams() {
  return events.map((event) => ({
    parish: event.parishSlug,
    event: event.eventSlug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ parish: string; event: string }>;
}): Promise<Metadata> {
  const { parish, event: eventSlug } = await params;
  const event = getEvent(parish, eventSlug);
  if (!event) return {};

  // English only — this is a client-side toggle, not separate localized
  // routes, so crawlers/link previews only ever see the English version.
  return {
    title: `${event.eventName} | ${event.parishName}`,
    description: event.valueText,
    openGraph: event.photos?.[0]
      ? {
          title: `${event.eventName} | ${event.parishName}`,
          description: event.valueText,
          images: [{ url: event.photos[0].src }],
        }
      : undefined,
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ parish: string; event: string }>;
}) {
  const { parish: parishSlug, event: eventSlug } = await params;
  const event = getEvent(parishSlug, eventSlug);
  if (!event) notFound();

  const parish = getParish(parishSlug);
  const brandStyle = {
    "--brand-primary": parish.colors.primary,
    "--brand-primary-70": hexToRgba(parish.colors.primary, 0.7),
    "--brand-primary-80": hexToRgba(parish.colors.primary, 0.8),
    "--brand-primary-40": hexToRgba(parish.colors.primary, 0.4),
    "--brand-primary-20": hexToRgba(parish.colors.primary, 0.2),
    "--brand-primary-10": hexToRgba(parish.colors.primary, 0.1),
    "--brand-shadow": hexToRgba(parish.colors.primary, 0.18),
    "--brand-secondary": parish.colors.secondary,
    "--brand-background": parish.colors.background,
    // Dedicated body-copy color, separate from --brand-primary. Headings,
    // labels, and buttons keep the brand's primary color for identity;
    // paragraph-length text uses this instead so a bold primary (e.g. a
    // saturated red) doesn't make long copy hard to read.
    "--brand-text": parish.colors.text,
    "--brand-text-70": hexToRgba(parish.colors.text, 0.7),
    // A faint brand-tinted glow behind the hero content, instead of a flat
    // fill — subtle on purpose, this is a trust-driven parish page, not a
    // marketing landing page.
    background: `radial-gradient(ellipse 80% 50% at 50% -10%, var(--brand-primary-10), transparent), var(--brand-background)`,
  } as CSSProperties;

  return <EventPageContent event={event} parish={parish} brandStyle={brandStyle} />;
}
