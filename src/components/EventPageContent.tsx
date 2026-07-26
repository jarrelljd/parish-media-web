"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Image from "next/image";
import type { EventInfo } from "@/data/events";
import type { ParishBrand } from "@/data/parishes";
import { uiStrings, type Language } from "@/lib/i18n";
import EventRSVPForm from "@/components/EventRSVPForm";
import EventRedirectCTA from "@/components/EventRedirectCTA";

export default function EventPageContent({
  event,
  parish,
  brandStyle,
}: {
  event: EventInfo;
  parish: ParishBrand;
  brandStyle: CSSProperties;
}) {
  const [language, setLanguage] = useState<Language>("en");
  const t = uiStrings[language];
  const es = language === "es" ? event.translations?.es : undefined;
  const cta = event.cta;
  const ctaFormFields = cta?.type === "form" ? cta : undefined;

  const parishName = es ? (parish.nameEs ?? event.parishName) : event.parishName;
  const eventName = es?.eventName ?? event.eventName;
  const dateLabel = es?.dateLabel ?? event.dateLabel;
  const timeLabel = es?.timeLabel ?? event.timeLabel;
  const location = es?.location ?? event.location;
  const valueText = es?.valueText ?? event.valueText;
  const detailsNote = es?.detailsNote ?? event.detailsNote;
  const highlights = event.highlights?.map((h, i) => ({
    icon: h.icon,
    label: es?.highlights?.[i]?.label ?? h.label,
  }));
  const sections = event.sections?.map((s, i) => ({
    heading: es?.sections?.[i]?.heading ?? s.heading,
    body: es?.sections?.[i]?.body ?? s.body,
    icon: s.icon,
    photo: s.photo,
  }));
  const ctaTitle = es?.cta?.title ?? ctaFormFields?.title;
  const ctaButtonLabel = es?.cta?.buttonLabel ?? cta?.buttonLabel;
  const ctaIntroText = es?.cta?.introText ?? ctaFormFields?.introText;
  const ctaSuccessMessage = es?.cta?.successMessage ?? ctaFormFields?.successMessage;
  const ctaReassuranceText = es?.cta?.reassuranceText ?? ctaFormFields?.reassuranceText;
  // Reuses the CTA's own button label so the jump-link text always matches
  // where it lands, instead of a separate generic phrase to translate.
  const jumpToCtaLabel = ctaButtonLabel ?? t.defaultRsvpButton;
  const mapsUrl = event.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`
    : undefined;

  return (
    <main style={brandStyle} className="min-h-screen px-6 pt-6 pb-16 sm:pt-24 sm:pb-24">
      {/* Slim identity bar: logo + parish name + language toggle, kept to one
          line so it doesn't eat into the above-the-fold budget on mobile. */}
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {parish.logo && (
            // Not `fill` here — parish logos are wide banner shapes (up to
            // ~5:1), and a fixed square box crushes them illegibly. A fixed
            // height with `w-auto` lets the browser size to each logo's own
            // aspect ratio instead.
            <Image
              src={parish.logo}
              alt={`${parishName} logo`}
              width={200}
              height={32}
              className="h-8 w-auto shrink-0 object-contain"
            />
          )}
          {!parish.hideNameInHeader && (
            <span className="line-clamp-2 text-sm leading-tight font-semibold text-[var(--brand-secondary)]">
              {parishName}
            </span>
          )}
        </div>
        {event.translations?.es && (
          <div className="flex shrink-0 items-center gap-1 rounded-full border border-[var(--brand-primary-20)] bg-white p-1 text-xs font-semibold shadow-sm">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={`rounded-full px-3 py-1 transition-colors ${
                language === "en"
                  ? "bg-[var(--brand-primary)] text-[var(--brand-background)]"
                  : "text-[var(--brand-primary)]"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("es")}
              aria-pressed={language === "es"}
              className={`rounded-full px-3 py-1 transition-colors ${
                language === "es"
                  ? "bg-[var(--brand-primary)] text-[var(--brand-background)]"
                  : "text-[var(--brand-primary)]"
              }`}
            >
              ES
            </button>
          </div>
        )}
      </div>

      {/* Hero photo: capped to ~42% of viewport height on mobile so it can't
          push the headline/CTA below the fold; reverts to a normal 16:9 crop
          from sm and up, where the fold isn't a concern. */}
      {event.photos && event.photos.length > 0 && (
        <div className="relative mx-auto mt-4 h-[42vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--brand-primary-10)] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_24px_-8px_var(--brand-shadow)] sm:h-auto sm:aspect-[16/9]">
          <Image
            src={event.photos[0].src}
            alt={event.photos[0].alt}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mx-auto mt-5 max-w-xl text-center">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-[var(--brand-primary)] sm:text-5xl">
          {eventName}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--brand-text)] line-clamp-4 sm:mt-6 sm:text-base sm:leading-relaxed sm:line-clamp-none">
          {valueText}
        </p>

        {/* Compact logistics row — date/time/location at a glance. The full
            details card further down still has the complete picture
            (admission, notes, etc.), this is just the above-the-fold gist. */}
        <div className="mx-auto mt-4 flex max-w-md flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-sm font-medium text-[var(--brand-text)]">
          <span className="inline-flex items-center gap-1">
            <span aria-hidden="true">📅</span>
            {dateLabel}
          </span>
          <span className="inline-flex items-center gap-1">
            <span aria-hidden="true">🕐</span>
            {timeLabel}
          </span>
          {mapsUrl ? (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline decoration-[var(--brand-secondary)]/40 underline-offset-2 hover:decoration-[var(--brand-secondary)]"
            >
              <span aria-hidden="true">📍</span>
              {location} &middot; {t.getDirections}
            </a>
          ) : (
            <span className="inline-flex items-center gap-1">
              <span aria-hidden="true">📍</span>
              {location}
            </span>
          )}
        </div>

        <a
          href="#cta"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("cta")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="mt-5 inline-flex w-full max-w-xs items-center justify-center gap-1.5 rounded-full bg-[var(--brand-primary)] px-8 py-3 text-sm font-medium text-[var(--brand-background)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
        >
          {jumpToCtaLabel}
        </a>
        {ctaReassuranceText && (
          <p className="mt-2 text-xs text-[var(--brand-text-70)]">{ctaReassuranceText}</p>
        )}

        {highlights && highlights.length > 0 && (
          <div className="mx-auto mt-6 flex max-w-md flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {highlights.map((h, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 text-sm font-medium text-[var(--brand-primary)]"
              >
                <span aria-hidden="true">{h.icon}</span>
                {h.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {event.photos && event.photos.length > 1 && (
        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
          {event.photos.slice(1).map((photo) => (
            <div
              key={photo.src}
              className="relative aspect-square w-[calc(50%-0.375rem)] overflow-hidden rounded-2xl border border-[var(--brand-primary-10)] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_24px_-8px_var(--brand-shadow)] sm:w-[calc(33.333%-0.5rem)]"
            >
              <Image src={photo.src} alt={photo.alt} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

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
          {dateLabel} &middot; {timeLabel}
        </p>
        <p className="mt-1 text-[var(--brand-text)]">{location}</p>
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm font-medium text-[var(--brand-secondary)] underline decoration-[var(--brand-secondary)]/40 underline-offset-2 transition-colors hover:decoration-[var(--brand-secondary)]"
          >
            {t.getDirections}
          </a>
        )}
        {detailsNote && (
          <p className="mt-3 text-sm leading-relaxed text-[var(--brand-text-70)]">
            {detailsNote}
          </p>
        )}
      </div>

      {sections && sections.length > 0 && (
        <div className="mx-auto mt-6 max-w-3xl divide-y divide-[var(--brand-primary-10)]">
          {sections.map((s, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-6 py-10 first:pt-6 last:pb-6 sm:gap-10 ${
                s.photo && i % 2 === 1 ? "sm:flex-row-reverse" : "sm:flex-row"
              }`}
            >
              {s.photo && (
                <div className="relative aspect-[4/3] w-full flex-shrink-0 overflow-hidden rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_24px_-8px_var(--brand-shadow)] sm:w-2/5">
                  <Image src={s.photo.src} alt={s.photo.alt} fill className="object-cover" />
                </div>
              )}
              <div className={`text-center ${s.photo ? "sm:w-3/5 sm:text-left" : "w-full"}`}>
                <h2
                  className={`flex items-center justify-center gap-2 font-serif text-xl font-semibold text-[var(--brand-primary)] ${
                    s.photo ? "sm:justify-start" : ""
                  }`}
                >
                  {s.icon && <span aria-hidden="true">{s.icon}</span>}
                  {s.heading}
                </h2>
                <p className="mt-3 leading-relaxed text-[var(--brand-text)]">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div id="cta" className="mx-auto mt-12 max-w-md scroll-mt-10">
        {cta?.type === "redirect" ? (
          <EventRedirectCTA buttonLabel={ctaButtonLabel ?? cta.buttonLabel} url={cta.url} />
        ) : (
          <EventRSVPForm
            eventName={eventName}
            parishName={parishName}
            webhookEnvVar={event.webhookEnvVar}
            language={language}
            title={ctaTitle}
            buttonLabel={ctaButtonLabel}
            introText={ctaIntroText}
            successMessage={ctaSuccessMessage}
            collectPhone={ctaFormFields?.collectPhone}
          />
        )}
      </div>

      <p className="mt-16 text-center text-xs text-[var(--brand-primary-40)]">
        {t.poweredBy}
      </p>
    </main>
  );
}
