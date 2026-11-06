// Shared button look (used on Links and on <BookACallButton>).
// Pair `primary` buttons with <ArrowRight className={buttonArrow} /> inside.

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-[3px] px-7 py-4 text-base font-semibold transition-colors duration-300 motion-reduce:transition-none";

const variants = {
  primary: "bg-lapis text-vellum hover:bg-lapis-deep",
  ghost: "text-lapis ring-1 ring-lapis/25 hover:bg-parchment hover:ring-lapis/40",
  light: "bg-vellum text-ink hover:bg-white",
  ghostLight: "text-vellum ring-1 ring-vellum/35 hover:bg-vellum/10",
};

export function buttonClass(variant: keyof typeof variants = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

export const buttonArrow =
  "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none";
