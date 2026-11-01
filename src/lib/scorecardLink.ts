// Signed, stateless links to a lead's scorecard PDF
// (/api/scorecard/report?d=…&s=…). The link carries the answers + name and
// is signed so nobody can mint a branded PDF with made-up content. No
// database needed: the PDF is rebuilt from the link every time.
//
// Secret: SCORECARD_LINK_SECRET if set, otherwise derived from
// RESEND_API_KEY (already set in Railway), so it works without a new env
// var. Changing either invalidates old links.

import { createHash, createHmac, timingSafeEqual } from "crypto";
import type { ScorecardAnswers } from "@/lib/scorecard";

export type ReportLinkPayload = {
  a: ScorecardAnswers;
  n: string; // name as typed
  o: string; // parish name
  r: string; // role
  t: number; // created at (ms)
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
  const d = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `d=${d}&s=${sign(d)}`;
}

export function readReportQuery(d: string | null, s: string | null): ReportLinkPayload | null {
  if (!d || !s || d.length > 8000) return null;
  const expected = Buffer.from(sign(d));
  const given = Buffer.from(s);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    return JSON.parse(Buffer.from(d, "base64url").toString("utf8")) as ReportLinkPayload;
  } catch {
    return null;
  }
}
