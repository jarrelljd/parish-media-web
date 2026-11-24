// Stand-in flyer art (4:5) for templates that don't have a thumbnail yet.
// Three looks so the review grid shows what a mix of real designs will feel like.

import type { FlyerCategory, PlaceholderStyle } from "@/data/flyers";

const brightColors: Record<FlyerCategory, string> = {
  "Liturgical Seasons": "#5b2a5e",
  Sacraments: "#1e5f7a",
  "Parish Community": "#b4532a",
  "Prayer & Worship": "#7a5a14",
  "Youth & Families": "#2b7a52",
  "Fundraising & Service": "#a23446",
  "Special Events": "#3d6b2e",
};

export default function FlyerPlaceholder({
  event,
  category,
  look = "cathedral",
}: {
  event: string;
  category: FlyerCategory;
  look?: PlaceholderStyle;
}) {
  const styles = {
    cathedral: { bg: "#152246", fg: "#f4eee3", accent: "#d4af5f", bar: "rgba(244,238,227,0.28)" },
    parchment: { bg: "#ebe3d3", fg: "#1d1a16", accent: "#a1281e", bar: "rgba(29,26,22,0.18)" },
    bright: { bg: brightColors[category], fg: "#ffffff", accent: "#ffe7a8", bar: "rgba(255,255,255,0.32)" },
  }[look];

  return (
    <div
      className="relative flex aspect-[4/5] w-full flex-col items-center justify-between overflow-hidden px-[9%] py-[11%] text-center"
      style={{ backgroundColor: styles.bg, color: styles.fg }}
      aria-hidden="true"
    >
      {look === "cathedral" && (
        <div className="pointer-events-none absolute inset-[5%] rounded-sm border" style={{ borderColor: styles.accent, opacity: 0.55 }} />
      )}
      {look === "bright" && (
        <div className="pointer-events-none absolute -right-[20%] -top-[15%] aspect-square w-[70%] rounded-full" style={{ backgroundColor: styles.accent, opacity: 0.18 }} />
      )}

      <p className="relative text-[clamp(9px,2.6cqw,12px)] font-semibold" style={{ color: styles.accent }}>
        Your Parish Name
      </p>

      <h3 className="relative font-serif text-[clamp(20px,9cqw,40px)] font-semibold leading-[1.05] text-balance">{event}</h3>

      <div className="relative flex w-full flex-col items-center gap-[0.6em] text-[clamp(9px,2.6cqw,12px)]">
        <span className="h-[0.55em] w-[62%] rounded-full" style={{ backgroundColor: styles.bar }} />
        <span className="h-[0.55em] w-[48%] rounded-full" style={{ backgroundColor: styles.bar }} />
        <span className="h-[0.55em] w-[55%] rounded-full" style={{ backgroundColor: styles.bar }} />
      </div>
    </div>
  );
}
