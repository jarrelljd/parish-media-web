// In-memory store for parish lookups that run while someone takes the
// scorecard quiz. Railway runs one long-lived server, so a module-level Map
// is enough: a lookup only needs to live for the few minutes between the
// first question and the opt-in. A restart just means the quiz asks the
// page questions itself.
//
// Also guards the Apify/OpenAI bill: a per-visitor and a daily limit, and a
// cache so a retake (or two staff members at one parish) reuses one lookup.

import { randomUUID } from "crypto";
import type { ParishProfile } from "@/lib/parishProfile";

export type LookupEntry =
  | { status: "pending"; startedAt: number; key: string }
  | { status: "done"; startedAt: number; key: string; profile: ParishProfile }
  | { status: "failed"; startedAt: number; key: string };

const TTL_MS = 6 * 60 * 60 * 1000; // lookups and cache entries live 6 hours
const PER_VISITOR_PER_HOUR = 6;
const PER_DAY = 300;

const lookups = new Map<string, LookupEntry>();
const byKey = new Map<string, string>(); // parish key → lookup id
const visitorHits = new Map<string, number[]>();
let day = { date: "", count: 0 };

export const parishKey = (name: string, city: string, state: string) =>
  [name, city, state].map((s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()).join("|");

function sweep(now: number) {
  for (const [id, e] of lookups) {
    if (now - e.startedAt > TTL_MS) {
      lookups.delete(id);
      if (byKey.get(e.key) === id) byKey.delete(e.key);
    }
  }
}

// Returns an existing lookup for this parish, a new id to run, or null when
// a limit is hit.
export function reserveLookup(key: string, visitor: string): { id: string; isNew: boolean } | null {
  const now = Date.now();
  sweep(now);

  const existing = byKey.get(key);
  if (existing) {
    const e = lookups.get(existing);
    if (e && e.status !== "failed") return { id: existing, isNew: false };
  }

  const hits = (visitorHits.get(visitor) ?? []).filter((t) => now - t < 3_600_000);
  if (hits.length >= PER_VISITOR_PER_HOUR) return null;
  const today = new Date(now).toISOString().slice(0, 10);
  if (day.date !== today) day = { date: today, count: 0 };
  if (day.count >= PER_DAY) return null;

  hits.push(now);
  visitorHits.set(visitor, hits);
  day.count++;

  const id = randomUUID();
  lookups.set(id, { status: "pending", startedAt: now, key });
  byKey.set(key, id);
  return { id, isNew: true };
}

export function finishLookup(id: string, profile: ParishProfile | null) {
  const e = lookups.get(id);
  if (!e) return;
  lookups.set(id, profile ? { status: "done", startedAt: e.startedAt, key: e.key, profile } : { status: "failed", startedAt: e.startedAt, key: e.key });
}

export function getLookup(id: string): LookupEntry | undefined {
  return lookups.get(id);
}
