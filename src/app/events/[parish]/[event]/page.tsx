import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { events, getEvent } from "@/data/events";
import EventRSVPForm from "@/components/EventRSVPForm";

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
    description: event.description,
    openGraph: event.imageSrc
      ? {
          title: `${event.eventName} | ${event.parishName}`,
          description: event.description,
          images: [{ url: event.imageSrc }],
        }
      : undefined,
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ parish: string; event: string }>;
}) {
  const { parish, event: eventSlug } = await params;
  const event = getEvent(parish, eventSlug);
  if (!event) notFound();

  return (
    <main className="min-h-screen bg-offwhite px-6 py-16 sm:py-24">
      {event.imageSrc && (
        <div className="relative mx-auto aspect-[16/9] w-full max-w-2xl overflow-hidden rounded-2xl border border-navy/10">
          <Image
            src={event.imageSrc}
            alt={event.imageAlt ?? `${event.eventName} at ${event.parishName}`}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mx-auto max-w-xl text-center">
        <span
          className={`mx-auto block h-1 w-16 rounded-full bg-gold ${event.imageSrc ? "mt-10" : ""}`}
        />
        <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-gold">
          {event.parishName}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-navy sm:text-5xl">
          {event.eventName}
        </h1>
        <p className="mt-4 text-lg text-navy/70">
          {event.dateLabel} &middot; {event.timeLabel}
        </p>
        <p className="mt-1 text-navy/70">{event.location}</p>
        <p className="mt-6 text-navy/80">{event.description}</p>
      </div>

      <div className="mx-auto mt-12 max-w-md">
        <EventRSVPForm eventName={event.eventName} parishName={event.parishName} />
      </div>

      <p className="mt-16 text-center text-xs text-navy/40">
        Powered by Parish Media Company
      </p>
    </main>
  );
}
