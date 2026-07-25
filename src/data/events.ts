import eventsData from "./events.json";

export type EventCTA =
  | {
      type: "form";
      // Short heading above the form, e.g. "Don't Miss the Picnic" — gives
      // the CTA card a focal point instead of jumping straight to fields.
      title?: string;
      buttonLabel?: string;
      introText?: string;
      successMessage?: string;
      // Defaults to true. Set false when a phone number doesn't make sense
      // for the CTA (e.g. an email-only calendar invite).
      collectPhone?: boolean;
    }
  | { type: "redirect"; buttonLabel: string; url: string };

export type EventPhoto = {
  // Path under public/, e.g. "/images/events/st-rose/group.jpg".
  src: string;
  alt: string;
};

export type EventAccent = {
  // Only "gingham" for now — an optional, restrained decorative touch for
  // events that want it (e.g. a picnic). Not every event should have one.
  style: "gingham";
  color: string;
};

// A short scannable tag, e.g. { icon: "🎶", label: "Live Music All Day" }.
// For a quick-hit row of draws, not a replacement for detailsNote.
export type EventHighlight = { icon: string; label: string };

// A named block of extra content (heading + short paragraph), for events
// with enough going on that one detailsNote paragraph reads as a wall of
// text. Optional and repeatable — most events won't need any.
export type EventSection = { heading: string; body: string };

// Every field optional — an untranslated field silently falls back to the
// English version rather than showing blank. If an event has no `es` object
// at all, the language toggle doesn't render (nothing to switch to).
export type EventTranslation = {
  eventName?: string;
  dateLabel?: string;
  timeLabel?: string;
  location?: string;
  valueText?: string;
  detailsNote?: string;
  // Same order/length as event.highlights — icon isn't translated, only the
  // label. A missing entry (or missing label) falls back to English.
  highlights?: { label?: string }[];
  // Same order/length as event.sections.
  sections?: { heading?: string; body?: string }[];
  cta?: {
    title?: string;
    buttonLabel?: string;
    introText?: string;
    successMessage?: string;
  };
};

export type EventInfo = {
  parishSlug: string;
  eventSlug: string;
  parishName: string;
  eventName: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  // Standard going forward (see workflows/publish_event_landing_page.md) —
  // optional here only so older data without one doesn't break the build.
  address?: string;
  // The "why come" pitch — also used as the SEO/OG description.
  valueText: string;
  // Extra logistics beyond date/time/location, e.g. "Bring a side to share".
  detailsNote?: string;
  // Optional row of short icon+label tags (e.g. "🎶 Live Music"). Use
  // sparingly — a quick-scan complement to valueText, not a repeat of it.
  highlights?: EventHighlight[];
  // Optional named content blocks for events with more to say than one
  // detailsNote paragraph can hold without becoming a wall of text.
  sections?: EventSection[];
  // 0–4 real photos, rendered as a small grid. The page renders fine with
  // none — never fall back to stock imagery.
  photos?: EventPhoto[];
  // Defaults to an RSVP form if omitted (see EventCTA above).
  cta?: EventCTA;
  accent?: EventAccent;
  // Human-drafted, human-reviewed only — never machine-translated at
  // runtime. See workflows/publish_event_landing_page.md.
  translations?: { es?: EventTranslation };
};

// Sourced from events.json — edit that file (or use tools/add_event.py in the
// Parish Event Page Builder repo) rather than this array directly. Cast
// (rather than annotated) because the JSON import loses the `cta.type`
// string-literal typing that EventInfo's discriminated union requires —
// the actual shape is enforced by add_event.py, not by TS here.
export const events = eventsData as EventInfo[];

export function getEvent(parishSlug: string, eventSlug: string) {
  return events.find(
    (event) => event.parishSlug === parishSlug && event.eventSlug === eventSlug,
  );
}
