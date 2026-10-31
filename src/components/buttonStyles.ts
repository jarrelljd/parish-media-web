// Shared button look (used on Links and on <BookACallButton>).
// Pair `primary` buttons with <ArrowRight className={buttonArrow} /> inside.

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const variants = {
  primary: "bg-navy text-offwhite shadow-lg shadow-navy/20 hover:shadow-xl hover:shadow-navy/25",
  ghost: "text-navy ring-1 ring-navy/20 hover:bg-parchment hover:ring-navy/30",
  light: "bg-offwhite text-navy shadow-lg shadow-black/20 hover:bg-white",
  ghostLight: "text-offwhite ring-1 ring-offwhite/35 hover:bg-offwhite/10",
};

export function buttonClass(variant: keyof typeof variants = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

export const buttonArrow =
  "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none";
