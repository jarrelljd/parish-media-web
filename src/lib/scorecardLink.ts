// Signed, stateless links to a lead's scorecard PDF
// (/api/scorecard/report?d=…&s=…). The link carries the answers, name, and
// the letter written for them at opt-in, and is signed so nobody can mint a
// branded PDF with made-up content. No database needed: the PDF is rebuilt
// from the link every time, and the letter never changes.
//
// New links are deflated ("z" prefix) so the letter fits in a normal URL.
// Older links (plain base64 JSON, no letter) still work: the PDF route
// falls back to the template letter for them.
//
// Secret: SCORECARD_LINK_SECRET if set, otherwise derived from
// RESEND_API_KEY (already set in Railway), so it works without a new env
// var. Changing either invalidates old links.

import { createHash, createHmac, timingSafeEqual } from "crypto";
import { deflateRawSync, inflateRawSync } from "zlib";
import type { ScorecardAnswers } from "@/lib/scorecard";
import type { ScorecardLetter } from "@/lib/scorecardLetter";

export type ReportLinkPayload = {
  a: ScorecardAnswers;
  n: string; // name as typed
  o: string; // parish name
  r: string; // role
  t: number; // created at (ms)
  l?: ScorecardLetter; // the letter written at opt-in
};

function secret(): string {
  if (process.env.SCORECARD_LINK_SECRET) return process.env.SCORECARD_LINK_SECRET;
  if (process.env.RESEND_API_KEY) {
    return createHash("sha256").update(`pmc-scorecard:${process.env.RESEND_API_KEY}`).digest("hex");
  }
  if (process.env.NODE_ENV !== "production") return "pmc-scorecard-dev-only";
  throw new Error("Set SCORECARD_LINK_SECRET (or RESEND_API_KEY) to sign scorecard links");
}

const sign = (data: string) => createHmac("sha256", secret()).update(data).digest("base64url");

export function createReportQuery(payload: ReportLinkPayload): string {
  const d = "z" + deflateRawSync(Buffer.from(JSON.stringify(payload)), { level: 9 }).toString("base64url");
  return `d=${d}&s=${sign(d)}`;
}

export function readReportQuery(d: string | null, s: string | null): ReportLinkPayload | null {
  if (!d || !s || d.length > 12000) return null;
  const expected = Buffer.from(sign(d));
  const given = Buffer.from(s);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const json = d.startsWith("z")
      ? inflateRawSync(Buffer.from(d.slice(1), "base64url"), { maxOutputLength: 200_000 }).toString("utf8")
      : Buffer.from(d, "base64url").toString("utf8");
    return JSON.parse(json) as ReportLinkPayload;
  } catch {
    return null;
  }
}
