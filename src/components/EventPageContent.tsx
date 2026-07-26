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
  // Reuses the CTA's own button label so the jump-link text always matches
  // where it lands, instead of a separate generic phrase to translate.
  const jumpToCtaLabel = ctaButtonLabel ?? t.defaultRsvpButton;

  return (
    <main style={brandStyle} className="min-h-screen px-6 py-16 sm:py-24">
      {event.translations?.es && (
        <div className="mx-auto mb-8 flex w-fit items-center gap-1 rounded-full border border-[var(--brand-primary-20)] bg-white p-1 text-xs font-semibold shadow-sm">
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

      <div className="mx-auto max-w-xl text-center">
        {parish.logo && (
          <div className="relative mx-auto h-16 w-48">
            <Image
              src={parish.logo}
              alt={`${parishName} logo`}
              fill
              className="object-contain"
            />
          </div>
        )}
        <span className="mx-auto block h-1 w-16 rounded-full bg-[var(--brand-secondary)] mt-8" />
        <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-[var(--brand-secondary)]">
          {parishName}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-[var(--brand-primary)] sm:text-5xl">
          {eventName}
        </h1>
        <p className="mt-6 leading-relaxed text-[var(--brand-text)]">{valueText}</p>
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
        <a
          href="#cta"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("cta")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-primary-20)] px-5 py-2 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:bg-[var(--brand-primary-10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary-20)] focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          {jumpToCtaLabel}
          <span aria-hidden="true">&darr;</span>
        </a>
      </div>

      {event.photos && event.photos.length > 0 && (
        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
          {event.photos.map((photo) => (
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
        {event.address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
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
