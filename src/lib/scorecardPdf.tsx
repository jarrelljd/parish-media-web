// Scorecard report PDF (US Letter), rendered on the server with
// @react-pdf/renderer. Content comes from buildScorecardDoc
// (src/lib/scorecardReport.ts); this file is layout only.
//
// Designed to read like a real letter from a consultant, not a generated
// template: plain letterhead, a memo block instead of a score badge, run-in
// paragraph heads instead of tiny caps labels, rules instead of boxes, and
// a printed (not button) booking link so it still works on paper.
//
// Fonts are the site's own (Fraunces + Source Sans 3), bundled as WOFF in
// src/assets/fonts. They're Latin-only, so avoid symbols like "→" in copy.

import path from "path";
import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { Styles } from "@react-pdf/renderer";
import { proof, type BandTone } from "@/data/scorecard";

type Style = Styles[string];
import { SCORECARD_BOOKING_URL } from "@/lib/scorecard";
import { capNote, type ReportProblem, type ScorecardDoc } from "@/lib/scorecardReport";

const fontDir = path.join(process.cwd(), "src", "assets", "fonts");
const font = (file: string) => path.join(fontDir, file);

let fontsReady = false;
function registerFonts() {
  if (fontsReady) return;
  Font.register({
    family: "Fraunces",
    fonts: [
      { src: font("fraunces-latin-400-normal.woff"), fontWeight: 400 },
      { src: font("fraunces-latin-500-normal.woff"), fontWeight: 500 },
      { src: font("fraunces-latin-400-italic.woff"), fontWeight: 400, fontStyle: "italic" },
    ],
  });
  Font.register({
    family: "Source Sans",
    fonts: [
      { src: font("source-sans-3-latin-400-normal.woff"), fontWeight: 400 },
      { src: font("source-sans-3-latin-600-normal.woff"), fontWeight: 600 },
      { src: font("source-sans-3-latin-700-normal.woff"), fontWeight: 700 },
      { src: font("source-sans-3-latin-400-italic.woff"), fontWeight: 400, fontStyle: "italic" },
    ],
  });
  // No mid-word hyphen breaks.
  Font.registerHyphenationCallback((word) => [word]);
  fontsReady = true;
}

const navy = "#1b2a4a";
const ink = "#232a38";
const muted = "#6a6f7b";
const rule = "#d9d4c9";
const gold = "#b08d2a";
const missingRed = "#8c3b2b";
const tierLabel = { low: "Needs attention", mid: "Room to grow", high: "Strong" } as const;
// Band colors, chosen to stay readable printed on white.
const bandColor: Record<BandTone, string> = {
  critical: "#b3261e",
  atRisk: "#c25a14",
  stalled: "#a77a00",
  gaps: "#5b8a2e",
  thriving: "#1f7a3f",
};

// Printed form of the booking link, readable on paper.
const BOOKING_DISPLAY = SCORECARD_BOOKING_URL.replace(/^https?:\/\//, "").replace(/#.*$/, "");

const s = StyleSheet.create({
  page: {
    paddingTop: 52,
    paddingBottom: 64,
    paddingHorizontal: 72,
    fontFamily: "Source Sans",
    fontSize: 10.5,
    lineHeight: 1.55,
    color: ink,
    backgroundColor: "#ffffff",
  },
  // Letterhead
  letterhead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 8,
    borderBottomWidth: 0.75,
    borderBottomColor: navy,
  },
  wordmark: { fontFamily: "Fraunces", fontSize: 13, color: navy },
  letterheadSite: { fontSize: 8.5, color: muted },
  goldRule: { height: 1.5, backgroundColor: gold, width: 36, marginTop: 3 },
  // Title + memo block
  title: { fontFamily: "Fraunces", fontSize: 21, color: navy, marginTop: 26, marginBottom: 12, lineHeight: 1.2 },
  memoRow: { flexDirection: "row", marginBottom: 2 },
  memoLabel: { width: 82, color: muted, fontSize: 9.5, paddingTop: 0.5 },
  memoValue: { flex: 1 },
  memoRule: { borderBottomWidth: 0.5, borderBottomColor: rule, marginTop: 12, marginBottom: 20 },
  // Letter body
  p: { marginBottom: 9 },
  lead: { fontFamily: "Fraunces", fontSize: 14, color: navy, lineHeight: 1.35, marginBottom: 6 },
  h2: { fontFamily: "Fraunces", fontSize: 15, color: navy, lineHeight: 1.3 },
  problemHead: { flexDirection: "row", marginTop: 16, marginBottom: 7 },
  problemNum: { width: 20, fontFamily: "Fraunces", fontSize: 15, color: gold },
  indent: { paddingLeft: 20 },
  runIn: { fontWeight: 700, color: navy },
  proof: { fontStyle: "italic", color: "#4a5163" },
  listRow: { flexDirection: "row", marginBottom: 3 },
  listMark: { width: 14, color: muted },
  missing: { fontStyle: "italic", color: missingRed },
  sectionHead: { fontFamily: "Fraunces", fontSize: 15, color: navy, marginTop: 16, marginBottom: 6 },
  // Scores table
  scoreRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: rule,
  },
  scoreHeader: { fontSize: 8.5, color: muted, borderBottomColor: navy, borderBottomWidth: 0.75 },
  colLabel: { flex: 1 },
  colTier: { width: 120, color: muted },
  colScore: { width: 56, textAlign: "right" },
  // Closing
  quote: {
    fontFamily: "Fraunces",
    fontStyle: "italic",
    fontSize: 11.5,
    color: navy,
    lineHeight: 1.45,
  },
  quoteWrap: { marginTop: 4, marginBottom: 14, paddingLeft: 14, borderLeftWidth: 0.75, borderLeftColor: gold },
  link: { color: navy, textDecoration: "underline" },
  footer: { position: "absolute", bottom: 30, left: 72, right: 72, fontSize: 8, color: muted },
});

function RunIn({ head, children, style }: { head: string; children: React.ReactNode; style?: Style }) {
  return (
    <Text style={style ? [s.p, s.indent, style] : [s.p, s.indent]}>
      <Text style={s.runIn}>{head} </Text>
      {children}
    </Text>
  );
}

function Problem({ p, i }: { p: ReportProblem; i: number }) {
  return (
    <View>
      <View style={s.problemHead} minPresenceAhead={110} wrap={false}>
        <Text style={s.problemNum}>{i + 1}.</Text>
        <Text style={[s.h2, { flex: 1 }]}>{p.title}</Text>
      </View>

      <RunIn head="What we saw.">{p.saw.join(" ")}</RunIn>

      <RunIn head="Why it matters." style={p.postTypes ? { marginBottom: 5 } : undefined}>
        {p.why.join(" ")}
      </RunIn>

      {p.postTypes && (
        <View style={[s.indent, { marginBottom: 9 }]}>
          {p.postTypes.map((t) => (
            <View key={t.label} style={s.listRow} wrap={false}>
              <Text style={s.listMark}>{"–"}</Text>
              <Text style={{ flex: 1 }}>
                <Text style={{ fontWeight: 600, color: navy }}>{t.label}</Text> {t.text}
                {t.missing ? <Text style={s.missing}>{" You’re missing these."}</Text> : null}
              </Text>
            </View>
          ))}
        </View>
      )}

      {p.works && (
        <View style={[s.indent, { marginBottom: 9 }]} wrap={false}>
          <Text style={{ marginBottom: 3 }}>
            <Text style={s.runIn}>What it looks like when it works. </Text>
            {p.works.intro}
          </Text>
          {p.works.steps.map((st, j) => (
            <View key={st.label} style={s.listRow}>
              <Text style={s.listMark}>{j + 1}.</Text>
              <Text style={{ flex: 1 }}>
                <Text style={{ fontWeight: 600, color: navy }}>{st.label}</Text> {st.text}
              </Text>
            </View>
          ))}
        </View>
      )}

      {p.proof && (
        <Text style={[s.p, s.indent, s.proof]} wrap={false}>
          {p.proof}
        </Text>
      )}

      <View wrap={false}>
        <RunIn head="First step." style={{ color: navy }}>
          {p.firstStep}
        </RunIn>
      </View>
    </View>
  );
}

function ReportPdf({ doc }: { doc: ScorecardDoc }) {
  const r = doc.report;
  const strong = r.score >= 85;
  const toneColor = bandColor[r.band.tone];
  const note = capNote(r);
  const preparedFor = [doc.preparedFor, doc.parish === "Your parish" ? "" : doc.parish, doc.location]
    .filter(Boolean)
    .join(", ");
  return (
    <Document
      title={`Parish Social Media Scorecard: ${doc.parish}`}
      author="Parish Media Company"
      subject="Parish Social Media Scorecard"
    >
      <Page size="LETTER" style={s.page}>
        <Text style={s.footer} fixed>
          {`Parish Social Media Scorecard  ·  ${doc.parish}`}
        </Text>

        <View style={s.letterhead}>
          <View>
            <Text style={s.wordmark}>Parish Media Company</Text>
            <View style={s.goldRule} />
          </View>
          <Text style={s.letterheadSite}>parishmediacompany.com</Text>
        </View>

        <Text style={s.title}>Parish Social Media Scorecard</Text>
        <View style={s.memoRow}>
          <Text style={s.memoLabel}>Prepared for</Text>
          <Text style={s.memoValue}>{preparedFor}</Text>
        </View>
        <View style={s.memoRow}>
          <Text style={s.memoLabel}>Date</Text>
          <Text style={s.memoValue}>{doc.date}</Text>
        </View>
        <View style={s.memoRow}>
          <Text style={s.memoLabel}>Score</Text>
          <View style={[s.memoValue, { flexDirection: "row", alignItems: "center" }]}>
            <Text style={{ fontWeight: 700, color: navy }}>{r.score} out of 100</Text>
            <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: toneColor, marginLeft: 10, marginRight: 5 }} />
            <Text style={{ fontWeight: 700, color: toneColor }}>{r.band.label}</Text>
          </View>
        </View>
        <View style={s.memoRule} />

        <Text style={s.p}>Dear {doc.greeting},</Text>
        <Text style={s.p}>
          Thank you for taking the Parish Social Media Scorecard. We read through your answers,{" "}
          {strong
            ? "and there’s a lot here to be encouraged by."
            : "and we’re going to be direct, because we think you’d want us to be."}
        </Text>

        <Text style={s.lead}>{doc.diagnosis.lead}</Text>
        <Text style={s.p}>{doc.diagnosis.body}</Text>
        {doc.problemsIntro ? <Text style={s.p}>{doc.problemsIntro}</Text> : null}

        {doc.problems.map((p, i) => (
          <Problem key={p.id} p={p} i={i} />
        ))}

        <View wrap={false}>
          <Text style={s.sectionHead}>{"What’s working"}</Text>
          {doc.strengths.map((st) => (
            <View key={st} style={s.listRow}>
              <Text style={s.listMark}>{"–"}</Text>
              <Text style={{ flex: 1 }}>{st}</Text>
            </View>
          ))}
        </View>

        <View wrap={false}>
          <Text style={s.sectionHead}>Your scores</Text>
          <View style={[s.scoreRow, s.scoreHeader]}>
            <Text style={s.colLabel}>Category</Text>
            <Text style={[s.colTier, { color: muted }]}>Assessment</Text>
            <Text style={s.colScore}>Score</Text>
          </View>
          {r.categories.map((c) => (
            <View key={c.id} style={s.scoreRow}>
              <Text style={[s.colLabel, { color: navy }]}>{c.label}</Text>
              <Text style={[s.colTier, c.tier === "low" ? { color: missingRed } : {}]}>{tierLabel[c.tier]}</Text>
              <Text style={s.colScore}>
                {c.points} / {c.max}
              </Text>
            </View>
          ))}
          <View style={[s.scoreRow, { borderBottomWidth: 0 }]}>
            <Text style={[s.colLabel, { fontWeight: 700, color: navy }]}>Total</Text>
            <Text style={[s.colTier, { fontWeight: 700, color: toneColor }]}>{r.band.label}</Text>
            <Text style={[s.colScore, { fontWeight: 700, color: toneColor }]}>{r.score} / 100</Text>
          </View>
          {note ? (
            <Text style={{ fontSize: 9.5, fontStyle: "italic", color: muted, marginTop: 4 }}>{note}</Text>
          ) : null}
        </View>

        {/* Next step + quote + sign-off move together, so the sign-off
            never ends up alone on the last page. */}
        <View wrap={false}>
          <Text style={s.sectionHead}>Your next step</Text>
          <Text style={s.p}>{doc.nextStep}</Text>
          <Text style={s.p}>
            Book a time at{" "}
            <Link src={SCORECARD_BOOKING_URL} style={s.link}>
              {BOOKING_DISPLAY}
            </Link>
            .
          </Text>
          <View style={s.quoteWrap}>
            <Text style={s.quote}>&ldquo;{proof.quote.text}&rdquo;</Text>
            <Text style={{ fontSize: 9, color: muted, marginTop: 2 }}>
              {proof.quote.name}, {proof.quote.role}
            </Text>
          </View>
          <Text>God bless,</Text>
          <Text style={{ fontFamily: "Fraunces", fontSize: 12.5, color: navy, marginTop: 10 }}>Joe Jarrell</Text>
          <Text style={{ color: muted }}>Founder, Parish Media Company</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderScorecardPdf(doc: ScorecardDoc): Promise<Buffer> {
  registerFonts();
  return renderToBuffer(<ReportPdf doc={doc} />);
}
