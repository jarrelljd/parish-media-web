"use server";

// Server actions for the scorecard's parish lookup: the quiz starts one as
// soon as it knows the parish name and city, then checks on it before the
// questions the lookup can answer.

import { after } from "next/server";
import { headers } from "next/headers";
import { US_STATES } from "@/data/scorecard";
import { buildParishProfile, deriveAnswers, type DerivedAnswers } from "@/lib/parishProfile";
import { finishLookup, getLookup, parishKey, reserveLookup } from "@/lib/parishLookupStore";

export async function startParishLookup(name: string, city: string, state: string): Promise<{ id: string | null }> {
  const apifyKey = process.env.APIFY_TOKEN;
  const openaiKey = process.env.OPENAI_API_KEY;
  const n = String(name ?? "").trim().slice(0, 120);
  const c = String(city ?? "").trim().slice(0, 100);
  const s = String(state ?? "").trim().toUpperCase();
  if (!apifyKey || !openaiKey || n.length < 3 || !c || !US_STATES.some(([abbr]) => abbr === s)) return { id: null };

  const h = await headers();
  const visitor = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const slot = reserveLookup(parishKey(n, c, s), visitor);
  if (!slot) return { id: null };

  if (slot.isNew) {
    after(async () => {
      try {
        const profile = await buildParishProfile({ name: n, city: c, state: s }, { apify: apifyKey, openai: openaiKey });
        finishLookup(slot.id, profile);
      } catch (err) {
        console.error("Parish lookup failed:", err);
        finishLookup(slot.id, null);
      }
    });
  }
  return { id: slot.id };
}

export type ParishLookupStatus =
  | { status: "pending" }
  | { status: "failed" }
  | {
      status: "done";
      derived: DerivedAnswers;
      found: { facebook: boolean; instagram: boolean; posts: number };
    };

export async function checkParishLookup(id: string): Promise<ParishLookupStatus> {
  const e = getLookup(String(id ?? ""));
  if (!e || e.status === "failed") return { status: "failed" };
  if (e.status === "pending") return { status: "pending" };
  return {
    status: "done",
    derived: deriveAnswers(e.profile),
    found: { facebook: !!e.profile.facebook, instagram: !!e.profile.instagram, posts: e.profile.posts.length },
  };
}
