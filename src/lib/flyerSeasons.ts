// "Coming up" searches for the Parish Flyer Library: what parishes are
// making flyers for right now, based on the liturgical year. Each entry shows
// from a few weeks before its date (when parishes start promoting) until the
// day itself. Searches with no templates yet are dropped by the page.

import { adventStart, easter } from "@/lib/churchCalendar";

const DAY = 86_400_000;
const utc = (y: number, m: number, d: number) => new Date(Date.UTC(y, m - 1, d));
const add = (d: Date, days: number) => new Date(d.getTime() + days * DAY);

// Fourth Thursday of November (US Thanksgiving).
function thanksgiving(year: number) {
  const nov1 = utc(year, 11, 1);
  return add(nov1, ((4 - nov1.getUTCDay() + 7) % 7) + 21);
}

// `on` is the date itself, used for ordering (defaults to `until`).
type Window = { search: string; from: Date; until: Date; on?: Date };

function windows(y: number): Window[] {
  const e = easter(y);
  const ash = add(e, -46);
  const advent = adventStart(y);
  return [
    { search: "Thanksgiving", from: add(thanksgiving(y), -30), until: thanksgiving(y) },
    { search: "Advent", from: add(advent, -35), until: add(advent, 21), on: advent },
    { search: "Confession", from: add(advent, -14), until: utc(y, 12, 23) },
    { search: "Our Lady of Guadalupe", from: utc(y, 11, 12), until: utc(y, 12, 12) },
    { search: "Christmas", from: utc(y, 11, 10), until: utc(y, 12, 25) },
    // Epiphany (Jan 6) is promoted from mid-December, across the new year.
    { search: "Epiphany", from: utc(y, 12, 16), until: utc(y, 12, 31) },
    { search: "Epiphany", from: utc(y, 1, 1), until: utc(y, 1, 6) },
    { search: "Lent", from: add(ash, -30), until: add(e, -7) },
    { search: "Confession", from: add(ash, -14), until: add(e, -3) },
    { search: "Fish Fry", from: add(ash, -21), until: add(e, -2) },
    { search: "Stations of the Cross", from: add(ash, -14), until: add(e, -2) },
    { search: "Easter", from: add(e, -40), until: e },
    { search: "First Communion", from: utc(y, 3, 1), until: utc(y, 5, 31) },
    { search: "Vacation Bible School", from: utc(y, 3, 15), until: utc(y, 7, 15) },
    { search: "Pentecost", from: add(e, 19), until: add(e, 49) },
    { search: "Blessing of the Pets", from: utc(y, 9, 1), until: utc(y, 10, 4) },
  ];
}

// Searches that are in season today, soonest date first.
export function seasonalSearches(now = new Date(), limit = 6): string[] {
  const today = utc(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate()).getTime();
  const live = windows(now.getUTCFullYear())
    .filter((w) => w.from.getTime() <= today && today <= w.until.getTime())
    .sort((a, b) => (a.on ?? a.until).getTime() - (b.on ?? b.until).getTime());
  return [...new Set(live.map((w) => w.search))].slice(0, limit);
}

// Year-round events and ministries.
export const commonSearches = [
  "Eucharistic Adoration",
  "Confession",
  "Food Drive",
  "Young Adults",
  "Fish Fry",
  "Youth Group",
  "Bible Study",
  "Coffee & Donuts",
  "Parish Picnic",
  "Vacation Bible School",
];
