// GET /api/scorecard/report/<parish>.pdf?d=…&s=… → the same letter PDF as
// /api/scorecard/report. The ".pdf" filename in the path lets Zapier (and
// email clients) see it's a PDF from the address alone. The filename is
// cosmetic; the signed d/s query decides what's rendered.

export const runtime = "nodejs";
export { GET } from "../route";
