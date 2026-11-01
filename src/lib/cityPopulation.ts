// City population lookup for the scorecard. Server-only (the data file is
// ~470KB, so it never ships to the browser).
//
// src/data/cityPopulations.json comes from the Census Bureau's 2024
// population estimates for incorporated places and towns/townships
// (sub-est2024.csv, www2.census.gov/programs-surveys/popest/datasets/2020-2024/cities/totals/).
// Shape: { "NV": { "reno": 281714, ... } }. Names are normalized the same way
// as normalizeCity() below. Unincorporated areas (e.g. Metairie, LA) aren't
// in the file, so a miss just means the report skips the population line.

import populations from "@/data/cityPopulations.json";

const data = populations as Record<string, Record<string, number>>;

export function normalizeCity(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(
      /\b(city and borough|city|town|village|borough|township|charter township|municipality)\b/g,
      "",
    )
    .replace(/\bsaint\b/g, "st")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function lookupCityPopulation(city: string, state: string): number | null {
  const places = data[state];
  if (!places) return null;
  const key = normalizeCity(city);
  if (!key) return null;
  return places[key] ?? places[key.replace(/\bmount\b/g, "mt")] ?? places[key.replace(/\bmt\b/g, "mount")] ?? null;
}
