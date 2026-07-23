import parishesData from "./parishes.json";

export type ParishBrand = {
  slug: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  // Path under public/, e.g. "/images/parishes/st-joseph/logo.svg". Optional.
  logo?: string;
};

// Parish Media Company's own colors — used for any event whose parish hasn't
// been onboarded with a brand yet, so a missing brand never breaks a page.
export const DEFAULT_BRAND: ParishBrand = {
  slug: "default",
  name: "Parish Media Company",
  colors: {
    primary: "#1b2a4a",
    secondary: "#c9a227",
    background: "#faf8f4",
    text: "#1b2a4a",
  },
};

// Sourced from parishes.json — edit that file (or use
// tools/sync_parish_brand.py in the Parish Event Page Builder repo) rather
// than this array directly.
export const parishes: ParishBrand[] = parishesData;

export function getParish(slug: string): ParishBrand {
  return parishes.find((parish) => parish.slug === slug) ?? DEFAULT_BRAND;
}
