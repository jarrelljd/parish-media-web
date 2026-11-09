// Upcoming Church calendar dates the scorecard letter may use as a timing
// hook ("if the ad starts this month, it's running before Christmas").
// Dates only, never claims about attendance.

const DAY = 86_400_000;

// Western Easter (anonymous Gregorian algorithm), as a UTC date.
function easter(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

// First Sunday of Advent: the fourth Sunday before Christmas.
function adventStart(year: number): Date {
  const christmas = new Date(Date.UTC(year, 11, 25));
  const lastSundayBefore = new Date(christmas.getTime() - (christmas.getUTCDay() || 7) * DAY);
  return new Date(lastSundayBefore.getTime() - 21 * DAY);
}

export type ChurchDate = { name: string; date: string; daysAway: number };

const fmt = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

// The next big dates within `withinDays`, soonest first.
export function upcomingChurchDates(now = new Date(), withinDays = 150): ChurchDate[] {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const out: ChurchDate[] = [];
  for (const year of [now.getUTCFullYear(), now.getUTCFullYear() + 1]) {
    const e = easter(year);
    const dates: [string, Date][] = [
      ["Ash Wednesday", new Date(e.getTime() - 46 * DAY)],
      ["Easter", e],
      ["Pentecost", new Date(e.getTime() + 49 * DAY)],
      ["the First Sunday of Advent", adventStart(year)],
      ["Christmas", new Date(Date.UTC(year, 11, 25))],
    ];
    for (const [name, d] of dates) {
      const daysAway = Math.round((d.getTime() - today) / DAY);
      if (daysAway >= 7 && daysAway <= withinDays) out.push({ name, date: fmt(d), daysAway });
    }
  }
  return out.sort((a, b) => a.daysAway - b.daysAway).slice(0, 2);
}
