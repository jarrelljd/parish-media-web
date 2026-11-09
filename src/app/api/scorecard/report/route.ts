// GET /api/scorecard/report?d=…&s=… → the lead's scorecard letter (PDF).
// The link is created by submitScorecardOptIn (actions.ts), carries the
// letter written for them at opt-in, and is handed to the Zap (to attach to
// the email) and to the summary page's download button. Links made before
// the letter existed get the template letter.

import type { NextRequest } from "next/server";
import { lookupCityPopulation } from "@/lib/cityPopulation";
import { parseAnswers } from "@/lib/scorecard";
import { readReportQuery } from "@/lib/scorecardLink";
import { letterGreeting, templateLetter } from "@/lib/scorecardLetter";
import { renderScorecardPdf } from "@/lib/scorecardPdf";
import { buildScorecardDoc } from "@/lib/scorecardReport";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const payload = readReportQuery(params.get("d"), params.get("s"));
  const answers = payload ? parseAnswers(payload.a) : null;
  if (!payload || !answers) {
    return new Response("This report link isn't valid.", { status: 404 });
  }

  const doc = buildScorecardDoc(answers, lookupCityPopulation(answers.city, answers.state), {
    name: payload.n,
    organization: payload.o,
    role: payload.r,
    date: new Date(payload.t),
  });
  const letter = payload.l?.v === 1 ? payload.l : templateLetter(doc);
  const pdf = await renderScorecardPdf({
    doc,
    letter,
    greeting: letterGreeting(payload.n ?? "", payload.r ?? ""),
    isPastor: payload.r === "Pastor",
  });

  const slug =
    (payload.o || "parish")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "parish";
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Parish-Social-Media-Scorecard-${slug}.pdf"`,
      "Cache-Control": "private, max-age=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
