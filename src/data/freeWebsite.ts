// Content for the free website redesign lead magnet (/free-website and its
// thank-you page). One source so the landing page, the thank-you page, and
// the server action agree on styles, roles, and the delivery promise.

// Before/after pairs. Screenshots live in public/images/free-website/ and
// were captured at 1440x900 from the old live site and our new build.
export type Redesign = {
  key: string;
  parish: string;
  place: string;
  before: string;
  after: string;
  // Optional looping clip of the new homepage (its drone hero playing), built
  // by laying the page's text over the site's own hero video. `poster` is its
  // first frame, shown while it loads and to visitors who turn off motion.
  afterVideo?: { src: string; poster: string };
};

export const REDESIGNS: Redesign[] = [
  {
    key: "st-patrick",
    parish: "St. Patrick’s",
    place: "South Hadley, MA",
    before: "/images/free-website/st-patrick-before.jpg",
    after: "/images/free-website/st-patrick-after.jpg",
    afterVideo: {
      src: "/videos/free-website-st-patrick-after.mp4",
      poster: "/images/free-website/st-patrick-after-poster.jpg",
    },
  },
  { key: "olots", parish: "Our Lady of the Saints", place: "South Omaha, NE", before: "/images/free-website/olots-before.jpg", after: "/images/free-website/olots-after.jpg" },
];

// The three homepage styles a parish can pick, each a real build from the
// Parish Website Template. The Family shot is St. Joseph's real content and
// photos rendered with hero.mosaic (a demo build, not their live site).
export type SiteStyle = {
  id: "classic" | "cathedral" | "family";
  name: string;
  tagline: string;
  bestFor: string;
  example: { image: string; parish: string };
};

export const SITE_STYLES: SiteStyle[] = [
  {
    id: "classic",
    name: "Classic",
    tagline: "Warm welcome on the left, your church on the right, Mass times right below.",
    bestFor: "Most parishes",
    example: { image: "/images/free-website/st-monica-after.jpg", parish: "St. Monica, Palatka, FL" },
  },
  {
    id: "cathedral",
    name: "Cathedral",
    tagline: "Your church fills the whole screen, in a photo or drone video.",
    bestFor: "Beautiful or historic churches",
    example: { image: "/images/free-website/st-patrick-after.jpg", parish: "St. Patrick’s, South Hadley, MA" },
  },
  {
    id: "family",
    name: "Family",
    tagline: "Real parish life up front: families, kids, and young adults.",
    bestFor: "Parishes reaching young families",
    example: { image: "/images/free-website/family-after.jpg", parish: "St. Joseph, Los Banos, CA" },
  },
];

// The form's fourth choice, for parishes who'd rather we decide. Matches the
// "Our pick" option in the Notion tracker's Style column.
export const STYLE_OUR_PICK = "Let us choose";
export const STYLE_VALUES = [...SITE_STYLES.map((s) => s.name), STYLE_OUR_PICK];

// The promise is "3 business days": a request on any day is due 3 weekdays
// later (Tue → Fri; Sat or Sun → Wed). Worked out on Central time (where
// we're based) and returned as a plain calendar date, noon UTC, so it shows
// the same day in every US time zone and never lands on a weekend. Counting
// hours in UTC used to push evening requests onto a Sunday. Holidays are
// not skipped.
const BUSINESS_TZ = "America/Chicago";

export function deliveryDate(from: Date = new Date()): Date {
  const [y, m, d] = from
    .toLocaleDateString("en-CA", { timeZone: BUSINESS_TZ }) // YYYY-MM-DD
    .split("-")
    .map(Number);
  const day = new Date(Date.UTC(y, m - 1, d, 12));
  let left = 3;
  while (left > 0) {
    day.setUTCDate(day.getUTCDate() + 1);
    const wd = day.getUTCDay();
    if (wd !== 0 && wd !== 6) left -= 1;
  }
  return day;
}

export function formatDeliveryDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
}

// YYYY-MM-DD, for date-only fields (the Notion tracker's "Promised by").
export function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// Thank-you page reads these, written by the form on success. Kept out of
// the URL so nothing personal reaches analytics or the pixel.
export const FREE_WEBSITE_LEAD_KEY = "pmc-free-website-lead";
