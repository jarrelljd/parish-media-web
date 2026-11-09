// Scorecard letter PDF (US Letter), rendered on the server with
// @react-pdf/renderer. Content comes from the letter written at opt-in
// (src/lib/scorecardLetter.ts) plus the scores (buildScorecardDoc); this
// file is layout only.
//
// Reads like a signed letter on letterhead, per the Scorecard Letter Voice
// Guide: no headings, bullets, or score badge in the letter itself; the
// score lives in the P.S. A separate "What we found" page shows the
// evidence (their recent posts, pages, and category scores), with no prose.
//
// Fonts are bundled as WOFF in src/assets/fonts (Fraunces, Source Sans 3,
// and Mrs Saint Delafield for the signature, the same hand as the free-guide
// letter). They're Latin-only, so avoid symbols like "→" in copy.

import path from "path";
import { Circle, Document, Font, Link, Page, Path, StyleSheet, Svg, Text, View, renderToBuffer } from "@react-pdf/renderer";
import type { BandTone } from "@/data/scorecard";
import type { PostType } from "@/lib/parishProfile";
import { SCORECARD_BOOKING_URL } from "@/lib/scorecard";
import {
  BOOKING_DISPLAY,
  fixedClosing,
  resourceLink,
  type LetterEvidence,
  type LetterResource,
  type ScorecardLetter,
} from "@/lib/scorecardLetter";
import { capNote, type ScorecardDoc } from "@/lib/scorecardReport";

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
  Font.register({ family: "Signature", src: font("mrs-saint-delafield-latin-400-normal.woff") });
  // No mid-word hyphen breaks.
  Font.registerHyphenationCallback((word) => [word]);
  fontsReady = true;
}

const navy = "#1b2a4a";
const ink = "#232a38";
const muted = "#6a6f7b";
const rule = "#d9d4c9";
const gold = "#b08d2a";
const paper = "#faf8f4";
const missingRed = "#8c3b2b";
const lapis = "#1f3263";
const tierLabel = { low: "Needs attention", mid: "Room to grow", high: "Strong" } as const;
// Band colors, chosen to stay readable printed on white.
const bandColor: Record<BandTone, string> = {
  critical: "#b3261e",
  atRisk: "#c25a14",
  stalled: "#a77a00",
  gaps: "#5b8a2e",
  thriving: "#1f7a3f",
};

const POST_LABEL: Record<PostType, { label: string; color: string }> = {
  homily_clip: { label: "Homily clip", color: navy },
  value_video: { label: "Teaching video", color: navy },
  activity: { label: "Parish life", color: gold },
  connection: { label: "Story", color: gold },
  flyer: { label: "Flyer", color: missingRed },
  filler: { label: "Filler", color: muted },
};

const s = StyleSheet.create({
  page: {
    paddingTop: 52,
    paddingBottom: 64,
    paddingHorizontal: 72,
    fontFamily: "Source Sans",
    fontSize: 10.5,
    lineHeight: 1.55,
    color: ink,
    backgroundColor: "#fffdf8",
  },
  // Letterhead (page 1): centered mark, spaced wordmark, ornament rule, address.
  letterhead: { alignItems: "center" },
  wordmark: { fontFamily: "Fraunces", fontSize: 15.5, color: navy, letterSpacing: 3.2, marginTop: 7 },
  ornament: { flexDirection: "row", alignItems: "center", width: "100%", marginTop: 8 },
  ornamentLine: { flex: 1, height: 0.6, backgroundColor: gold },
  diamond: { width: 4.5, height: 4.5, backgroundColor: gold, transform: "rotate(45deg)", marginHorizontal: 7 },
  address: { fontSize: 7.5, color: muted, letterSpacing: 1.4, marginTop: 6 },
  // Compact letterhead (evidence page)
  miniHead: { flexDirection: "row", alignItems: "center", paddingBottom: 8, borderBottomWidth: 0.6, borderBottomColor: gold },
  miniWordmark: { fontFamily: "Fraunces", fontSize: 11.5, color: navy, letterSpacing: 2.2, marginLeft: 8, flex: 1 },
  date: { marginTop: 26, marginBottom: 14 },
  recipient: { marginBottom: 16, color: ink },
  reLine: { flexDirection: "row", alignItems: "baseline", marginBottom: 18 },
  p: { marginBottom: 8 },
  link: { color: navy, textDecoration: "underline" },
  signature: { fontFamily: "Signature", fontSize: 34, color: lapis, marginTop: 2, marginBottom: 6, lineHeight: 1.35 },
  ps: { marginTop: 18 },
  footer: { position: "absolute", bottom: 38, left: 72, right: 72, fontSize: 7.5, color: muted, letterSpacing: 1, textAlign: "center" },
  // Evidence page
  h1: { fontFamily: "Fraunces", fontSize: 19, color: navy, marginTop: 18, marginBottom: 2 },
  sub: { color: muted, fontSize: 9.5, marginTop: 2, marginBottom: 2 },
  h2: { fontFamily: "Fraunces", fontSize: 13, color: navy, marginTop: 14, marginBottom: 5 },
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4 },
  tile: { width: "33.333%", padding: 4 },
  tileInner: { backgroundColor: paper, borderRadius: 4, paddingVertical: 6, paddingHorizontal: 9, borderLeftWidth: 3 },
  tileTop: { flexDirection: "row", justifyContent: "space-between", fontSize: 8.5, color: muted },
  tileType: { fontFamily: "Fraunces", fontSize: 11.5, marginTop: 1, lineHeight: 1.3 },
  tileMeta: { fontSize: 8.5, color: muted, marginTop: 1 },
  stats: { flexDirection: "row", borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: rule, paddingVertical: 6 },
  stat: { flex: 1, paddingRight: 8 },
  statLabel: { fontSize: 8.5, color: muted },
  statValue: { fontSize: 10, color: navy },
  scoreRow: { flexDirection: "row", paddingVertical: 3, borderBottomWidth: 0.5, borderBottomColor: rule, fontSize: 10 },
  scoreHeader: { fontSize: 8.5, color: muted, borderBottomColor: navy, borderBottomWidth: 0.75 },
  colLabel: { flex: 1 },
  colTier: { width: 120, color: muted },
  colScore: { width: 56, textAlign: "right" },
});

export const PMC_ADDRESS = "808 W. Main St., Suite C  ·  Visalia, CA";

// The site's church-window mark (src/components/BrandMark.tsx), redrawn for the PDF.
function Mark({ size = 26 }: { size?: number }) {
  return (
    <Svg viewBox="0 0 28 36" width={(size * 28) / 36} height={size}>
      <Path d="M1.5 35V14a12.5 12.5 0 0 1 25 0v21z" stroke={gold} strokeWidth={1.5} fill="none" />
      <Path d="M5 35V14.5a9 9 0 0 1 18 0V35" stroke={gold} strokeWidth={0.9} fill="none" />
      <Circle cx={14} cy={12} r={3.2} stroke={gold} strokeWidth={0.9} fill="none" />
      <Circle cx={14} cy={12} r={0.9} fill={gold} />
      <Path d="M14 15.2V35M8.5 22h11" stroke={gold} strokeWidth={0.9} fill="none" />
      <Path d="M0 35h28" stroke={gold} strokeWidth={1.5} fill="none" />
    </Svg>
  );
}

function Letterhead() {
  return (
    <View style={s.letterhead}>
      <Mark />
      <Text style={s.wordmark}>PARISH MEDIA COMPANY</Text>
      <View style={s.ornament}>
        <View style={s.ornamentLine} />
        <View style={s.diamond} />
        <View style={s.ornamentLine} />
      </View>
      <Text style={s.address}>{`${PMC_ADDRESS.toUpperCase()}  ·  PARISHMEDIACOMPANY.COM`}</Text>
    </View>
  );
}

function MiniLetterhead() {
  return (
    <View style={s.miniHead}>
      <Mark size={18} />
      <Text style={s.miniWordmark}>PARISH MEDIA COMPANY</Text>
      <Text style={{ fontSize: 7.5, color: muted, letterSpacing: 1 }}>PARISHMEDIACOMPANY.COM</Text>
    </View>
  );
}

// Footer address, on every page.
function PageChrome() {
  return (
    <>
      {/* Plain text: react-pdf's render-prop footers (page numbers) don't print here. */}
      <Text style={s.footer} fixed>{`Parish Media Company  ·  ${PMC_ADDRESS}`}</Text>
    </>
  );
}

// The recommended House of Studies resources, typed the way a person would
// in a letter: a simple numbered list in body text, the title in italics,
// why it fits, and the address on its own line so it still works on paper.
function Resources({ res }: { res: LetterResource[] }) {
  const links = res.map(resourceLink).filter((r): r is NonNullable<ReturnType<typeof resourceLink>> => r !== null);
  return (
    <View style={{ marginBottom: 10 }}>
      {links.map((r, i) => (
        <View key={r.url} style={{ flexDirection: "row", marginBottom: 6 }} wrap={false}>
          <Text style={{ width: 22, paddingLeft: 6 }}>{i + 1}.</Text>
          <View style={{ flex: 1 }}>
            <Text>
              <Text style={{ fontStyle: "italic" }}>{r.title}</Text>, {r.why}.
            </Text>
            <Link src={r.url} style={s.link}>
              {r.display}
            </Link>
          </View>
        </View>
      ))}
    </View>
  );
}

// Prints the booking address as a real link.
function Linked({ text }: { text: string }) {
  const parts = text.split(new RegExp(`(${BOOKING_DISPLAY.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`));
  return (
    <Text style={s.p} orphans={2} widows={2}>
      {parts.map((part, i) =>
        part === BOOKING_DISPLAY ? (
          <Link key={i} src={SCORECARD_BOOKING_URL} style={s.link}>
            {part}
          </Link>
        ) : (
          part
        ),
      )}
    </Text>
  );
}

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const followers = (v: number | null | false) => (v === false ? "Not found" : v === null ? "Found" : `${fmt(v)} followers`);

function Evidence({ ev }: { ev: LetterEvidence }) {
  return (
    <View>
      {ev.posts.length > 0 && (
        <>
          <Text style={s.h2}>Your last {ev.posts.length} posts</Text>
          <View style={s.grid}>
            {ev.posts.map((p, i) => {
              const t = p.t ? POST_LABEL[p.t] : { label: "Post", color: muted };
              return (
                <View key={i} style={s.tile} wrap={false}>
                  <View style={[s.tileInner, { borderLeftColor: t.color }]}>
                    <View style={s.tileTop}>
                      <Text>{p.p === "fb" ? "Facebook" : "Instagram"}</Text>
                      <Text>{p.d}</Text>
                    </View>
                    <Text style={[s.tileType, { color: t.color }]}>{t.label}</Text>
                    <Text style={s.tileMeta}>
                      {p.v ? "Video  ·  " : ""}
                      {fmt(p.r)} {p.r === 1 ? "like or comment" : "likes and comments"}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </>
      )}
      <Text style={s.h2}>Your pages</Text>
      <View style={s.stats}>
        {[
          ["Website", ev.web ?? "Not found"],
          ["Facebook", followers(ev.fb)],
          ["Instagram", followers(ev.ig)],
          ...(ev.ads === "none" ? [["Meta’s Ad Library", "No active ads"]] : []),
        ].map(([label, value]) => (
          <View key={label} style={s.stat}>
            <Text style={s.statLabel}>{label}</Text>
            <Text style={s.statValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Scores({ doc, title = true }: { doc: ScorecardDoc; title?: boolean }) {
  const r = doc.report;
  const toneColor = bandColor[r.band.tone];
  const note = capNote(r);
  return (
    <View wrap={false}>
      {title ? <Text style={s.h2}>Your scores</Text> : null}
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
      {note ? <Text style={{ fontSize: 9, fontStyle: "italic", color: muted, marginTop: 4 }}>{note}</Text> : null}
    </View>
  );
}

export type LetterPdfInput = {
  doc: ScorecardDoc;
  letter: ScorecardLetter;
  greeting: string; // "Hi Father,"
  isPastor: boolean;
};

function LetterPdf({ doc, letter, greeting, isPastor }: LetterPdfInput) {
  const parishName = doc.parish === "Your parish" ? "the parish" : doc.parish;
  const recipient = [doc.preparedFor, doc.parish === "Your parish" ? "" : doc.parish, doc.location].filter(Boolean);
  const closing = fixedClosing(letter, parishName, isPastor);
  const psParish = doc.parish === "Your parish" ? "Your parish" : doc.parish;
  return (
    <Document title={`A letter for ${parishName}`} author="Joe Jarrell, Parish Media Company" subject="Parish Social Media Scorecard">
      <Page size="LETTER" style={s.page}>
        <PageChrome />
        <Letterhead />
        <Text style={s.date}>{doc.date}</Text>
        <View style={s.recipient}>
          {recipient.map((line) => (
            <Text key={line}>{line}</Text>
          ))}
        </View>

        <View style={s.reLine}>
          <Text style={{ fontWeight: 700, width: 30 }}>Re:</Text>
          <Text>
            Your Parish Social Media Scorecard (score: {doc.report.score} out of 100)
          </Text>
        </View>

        <Text style={s.p}>{greeting}</Text>
        {letter.body.map((para, i) => (
          <Text key={i} style={s.p} orphans={2} widows={2}>
            {para}
          </Text>
        ))}
        {/* Paragraphs flow across pages like a normal letter. Only small
            pieces are kept together, so a page never ends with a big gap. */}
        <Text style={s.p} minPresenceAhead={60}>
          {closing.resourcesIntro}
        </Text>
        <Resources res={letter.res} />
        {closing.rest.map((para, i) => (
          <Linked key={`c${i}`} text={para} />
        ))}

        {/* The sign-off stays in one piece; the P.S. can follow on the next page. */}
        <View wrap={false}>
          <Text style={{ marginTop: 4 }}>God bless,</Text>
          <Text style={s.signature}>Joe Jarrell</Text>
          <Text style={{ fontWeight: 600, color: navy }}>Joe Jarrell</Text>
          <Text style={{ color: muted }}>Founder, Parish Media Company</Text>
        </View>
        <Text style={s.ps} wrap={false}>
          <Text style={{ fontWeight: 700 }}>P.S. </Text>
          {psParish} scored {doc.report.score} out of 100. {letter.ps}
        </Text>
      </Page>

      <Page size="LETTER" style={s.page}>
        <PageChrome />
        <MiniLetterhead />
        <Text style={s.h1}>{letter.ev ? "What we found" : "Your scores"}</Text>
        <Text style={[s.sub, letter.ev ? {} : { marginBottom: 12 }]}>
          {letter.ev
            ? `What we saw on ${parishName}’s public pages, and how your answers scored.`
            : "How your answers scored, by category."}
        </Text>
        {letter.ev ? <Evidence ev={letter.ev} /> : null}
        <Scores doc={doc} title={!!letter.ev} />
      </Page>
    </Document>
  );
}

export async function renderScorecardPdf(input: LetterPdfInput): Promise<Buffer> {
  registerFonts();
  return renderToBuffer(<LetterPdf {...input} />);
}
