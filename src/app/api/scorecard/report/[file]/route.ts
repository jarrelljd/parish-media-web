// GET /api/scorecard/report/<name>.pdf?d=…&s=… → the same letter PDF as
// /api/scorecard/report. The ".pdf" filename in the path lets Zapier (and
// email clients) see it's a PDF from the address alone.
//
// GET /api/scorecard/report/<name>-<code>.pdf (no query) → the short link
// the Zap attaches (see createShortReportCode in scorecardLink.ts).

import { NextRequest } from "next/server";
import { readShortReportCode } from "@/lib/scorecardLink";
import { GET as renderReport } from "../route";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.has("d")) return renderReport(request);

  const file = decodeURIComponent(request.nextUrl.pathname.split("/").pop() ?? "");
  const code = file.match(/-([A-Za-z0-9_-]{16})\.pdf$/)?.[1];
  const query = code ? readShortReportCode(code) : null;
  if (!query) {
    return new Response("This report link has expired. Please use the link in your email.", { status: 404 });
  }
  const url = request.nextUrl.clone();
  url.search = `?${query}`;
  return renderReport(new NextRequest(url, { headers: request.headers }));
}
