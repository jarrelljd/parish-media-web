// Shared button look (used on Links and on <BookACallButton>).
// Pill shape, soft shadow, slight lift on hover, so buttons read as buttons.
// Use `primary` on light sections and `gold` on dark ones.
// Pair `primary` buttons with <ArrowRight className={buttonArrow} /> inside.

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const variants = {
  primary: "bg-lapis text-vellum shadow-lg shadow-lapis/30 hover:bg-lapis-deep hover:shadow-xl",
  gold: "bg-gilt-light text-ink shadow-lg shadow-black/40 hover:bg-[#e0bf75] hover:shadow-xl",
  ghost: "text-lapis ring-1 ring-lapis/25 hover:bg-parchment hover:ring-lapis/40",
  light: "bg-vellum text-ink shadow-lg shadow-black/20 hover:bg-white hover:shadow-xl",
  ghostLight: "text-vellum ring-1 ring-vellum/35 hover:bg-vellum/10",
};

export function buttonClass(variant: keyof typeof variants = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

export const buttonArrow =
  "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none";
