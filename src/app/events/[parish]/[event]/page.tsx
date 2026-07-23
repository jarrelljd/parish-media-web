import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { events, getEvent } from "@/data/events";
import { getParish } from "@/data/parishes";
import EventRSVPForm from "@/components/EventRSVPForm";
import EventRedirectCTA from "@/components/EventRedirectCTA";

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
    // A faint brand-tinted glow behind the hero content, instead of a flat
    // fill — subtle on purpose, this is a trust-driven parish page, not a
    // marketing landing page.
    background: `radial-gradient(ellipse 80% 50% at 50% -10%, var(--brand-primary-10), transparent), var(--brand-background)`,
  } as CSSProperties;

  return (
    <main style={brandStyle} className="min-h-screen px-6 py-16 sm:py-24">
      {event.photos && event.photos.length > 0 && (
        <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-3">
          {event.photos.map((photo) => (
            <div
              key={photo.src}
              className="relative aspect-square w-[calc(50%-0.375rem)] overflow-hidden rounded-2xl border border-[var(--brand-primary-10)] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_24px_-8px_var(--brand-shadow)] sm:w-[calc(33.333%-0.5rem)]"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                priority
              />
            </div>
          ))}
        </div>
      )}

      <div className="mx-auto max-w-xl text-center">
        {parish.logo && (
          <div
            className={`relative mx-auto h-16 w-48 ${event.photos?.length ? "mt-10" : ""}`}
          >
            <Image
              src={parish.logo}
              alt={`${event.parishName} logo`}
              fill
              className="object-contain"
            />
          </div>
        )}
        <span
          className={`mx-auto block h-1 w-16 rounded-full bg-[var(--brand-secondary)] ${
            event.photos?.length && !parish.logo ? "mt-10" : "mt-8"
          }`}
        />
        <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-[var(--brand-secondary)]">
          {event.parishName}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-[var(--brand-primary)] sm:text-5xl">
          {event.eventName}
        </h1>
        <p className="mt-6 leading-relaxed text-[var(--brand-primary-80)]">{event.valueText}</p>
      </div>

      {event.accent?.style === "gingham" && (
        <div
          className="mx-auto mt-10 h-3 w-24 rounded-full"
          style={{
            backgroundImage: `repeating-conic-gradient(${event.accent.color}55 0% 25%, transparent 0% 50%)`,
            backgroundSize: "10px 10px",
          }}
        />
      )}

      <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-[var(--brand-primary-10)] bg-[var(--brand-background)] px-6 py-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_24px_-8px_var(--brand-shadow)]">
        <p className="text-lg font-medium text-[var(--brand-primary)]">
          {event.dateLabel} &middot; {event.timeLabel}
        </p>
        <p className="mt-1 text-[var(--brand-primary-70)]">{event.location}</p>
        {event.address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm font-medium text-[var(--brand-secondary)] underline decoration-[var(--brand-secondary)]/40 underline-offset-2 transition-colors hover:decoration-[var(--brand-secondary)]"
          >
            Get Directions
          </a>
        )}
        {event.detailsNote && (
          <p className="mt-3 text-sm leading-relaxed text-[var(--brand-primary-70)]">
            {event.detailsNote}
          </p>
        )}
      </div>

      <div className="mx-auto mt-12 max-w-md">
        {event.cta?.type === "redirect" ? (
          <EventRedirectCTA buttonLabel={event.cta.buttonLabel} url={event.cta.url} />
        ) : (
          <EventRSVPForm
            eventName={event.eventName}
            parishName={event.parishName}
            buttonLabel={event.cta?.buttonLabel}
            introText={event.cta?.type === "form" ? event.cta.introText : undefined}
            successMessage={event.cta?.successMessage}
            collectPhone={event.cta?.type === "form" ? event.cta.collectPhone : undefined}
          />
        )}
      </div>

      <p className="mt-16 text-center text-xs text-[var(--brand-primary-40)]">
        Powered by Parish Media Company
      </p>
    </main>
  );
}
