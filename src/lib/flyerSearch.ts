// Search for the Parish Flyer Library. Built for how parish staff type:
// plurals ("pets"), small typos ("blesing"), and other names for the same
// thing ("reconciliation" for confession). Every word typed must match
// something on the template; matches on the event name rank first.

import { flyerSynonyms, type FlyerTemplate } from "@/data/flyers";

const STOPWORDS = new Set(["the", "of", "a", "an", "and", "for", "in", "on", "to", "flyer", "flyers", "template", "templates"]);

function singular(w: string) {
  if (w.length > 3 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((w) => w && !STOPWORDS.has(w))
    .map(singular);
}

// Edit distance, stopping early once it passes `max`.
function within(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return false;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return false;
    prev = cur;
  }
  return prev[b.length] <= max;
}

function wordMatches(q: string, word: string) {
  if (word.startsWith(q)) return true;
  const max = q.length >= 7 ? 2 : q.length >= 4 ? 1 : 0;
  return max > 0 && within(q, word, max);
}

const synonymMap = new Map<string, string[]>();
for (const group of flyerSynonyms) {
  const words = group.flatMap(tokenize);
  for (const w of words) synonymMap.set(w, [...new Set([...(synonymMap.get(w) ?? []), ...words])]);
}

type Indexed = { t: FlyerTemplate; eventWords: string[]; otherWords: string[] };

export function indexTemplates(templates: FlyerTemplate[]): Indexed[] {
  return templates.map((t) => ({
    t,
    eventWords: tokenize(t.event),
    otherWords: tokenize([t.category, ...t.keywords].join(" ")),
  }));
}

// Returns a score (higher is better), or 0 when the template doesn't match.
function score(item: Indexed, queryWords: string[]) {
  let total = 0;
  for (const q of queryWords) {
    // The typed word gets typo tolerance; its synonyms must match exactly.
    const synonyms = synonymMap.get(q) ?? [];
    const hit = (words: string[]) => words.some((w) => wordMatches(q, w) || synonyms.includes(w));
    if (hit(item.eventWords)) total += 3;
    else if (hit(item.otherWords)) total += 1;
    else return 0;
  }
  return total;
}

export type FlyerGroup = { event: string; category: FlyerTemplate["category"]; templates: FlyerTemplate[] };

// Groups the matching templates by event, best match first. With no query,
// keeps the original order.
export function searchFlyers(index: Indexed[], query: string, category: string | null): FlyerGroup[] {
  const queryWords = tokenize(query);
  const groups = new Map<string, FlyerGroup & { score: number; order: number }>();
  index.forEach((item, order) => {
    if (category && item.t.category !== category) return;
    const s = queryWords.length ? score(item, queryWords) : 1;
    if (!s) return;
    const g = groups.get(item.t.event);
    if (g) {
      g.templates.push(item.t);
      g.score = Math.max(g.score, s);
    } else {
      groups.set(item.t.event, { event: item.t.event, category: item.t.category, templates: [item.t], score: s, order });
    }
  });
  return [...groups.values()]
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map(({ event, category, templates }) => ({ event, category, templates }));
}
