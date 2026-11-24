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
};

export const REDESIGNS: Redesign[] = [
  { key: "st-patrick", parish: "St. Patrick’s", place: "South Hadley, MA", before: "/images/free-website/st-patrick-before.jpg", after: "/images/free-website/st-patrick-after.jpg" },
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

// The promise is 72 hours, not counting weekends. Returns the delivery date
// for a request made at `from`: every weekday hour counts, weekend hours
// don't. Holidays are not skipped.
export function deliveryDate(from: Date = new Date()): Date {
  const d = new Date(from);
  let hours = 72;
  while (hours > 0) {
    d.setHours(d.getHours() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) hours -= 1;
  }
  return d;
}

export function formatDeliveryDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

// Thank-you page reads these, written by the form on success. Kept out of
// the URL so nothing personal reaches analytics or the pixel.
export const FREE_WEBSITE_LEAD_KEY = "pmc-free-website-lead";
