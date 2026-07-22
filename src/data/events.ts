export type EventInfo = {
  parishSlug: string;
  eventSlug: string;
  parishName: string;
  eventName: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  description: string;
  // Path under public/, e.g. "/images/events/st-joseph/picnic.jpg". Optional —
  // the page renders fine without one.
  imageSrc?: string;
  imageAlt?: string;
};

export const events: EventInfo[] = [
  {
    parishSlug: "sample-parish",
    eventSlug: "picnic",
    parishName: "Sample Parish",
    eventName: "Parish Picnic",
    dateLabel: "Saturday, August 16, 2026",
    timeLabel: "11:00 AM – 2:00 PM",
    location: "Parish Grounds",
    description:
      "Join us for a day of food, fellowship, and fun for the whole family. Bring a dish to share and come meet your parish community.",
  },
];

export function getEvent(parishSlug: string, eventSlug: string) {
  return events.find(
    (event) => event.parishSlug === parishSlug && event.eventSlug === eventSlug,
  );
}
