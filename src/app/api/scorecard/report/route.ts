// GET /api/scorecard/report?d=…&s=… → the lead's scorecard PDF.
// The link is created by submitScorecardOptIn (actions.ts) and handed to the
// Zap (to attach to the email) and to the summary page's download button.

import type { NextRequest } from "next/server";
import { lookupCityPopulation } from "@/lib/cityPopulation";
import { greetingFor } from "@/lib/greeting";
import { parseAnswers } from "@/lib/scorecard";
import { readReportQuery } from "@/lib/scorecardLink";
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
    greeting: greetingFor(payload.n ?? ""),
    date: new Date(payload.t),
  });
  const pdf = await renderScorecardPdf(doc);

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
