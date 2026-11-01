// Scoring + report builder for the Parish Social Media Scorecard.
// Pure functions, shared by the browser (instant score) and the server
// (re-scores the submitted answers so the lead email can't be spoofed).
// All points, bands, and copy live in src/data/scorecard.ts.

import {
  ENGAGEMENT_UNSURE_POINTS,
  FOLLOWER_RATIO_UNSURE_POINTS,
  US_STATES,
  bands,
  categories,
  categoryCopy,
  categoryOrder,
  engagementMidpoints,
  engagementRateTiers,
  followerRatioTiers,
  questions,
  type CategoryId,
  type ChoiceQuestion,
  type Tier,
} from "@/data/scorecard";

export type FollowerCount = number | "unsure" | "none";

export type ScorecardAnswers = {
  city: string;
  state: string;
  attendance: number;
  fbFollowers: FollowerCount;
  igFollowers: FollowerCount;
  engagement: string;
  growth: string;
  ads: string;
  frequency: string;
  contentType: string;
  pastorOnCamera: string;
  inquirers: string;
  nextStep: string;
  followUp: string;
  team: string;
};

export type ChoiceId = Exclude<
  keyof ScorecardAnswers,
  "city" | "state" | "attendance" | "fbFollowers" | "igFollowers"
>;

const choiceQuestions = questions.filter(
  (q): q is ChoiceQuestion => q.kind === "choice",
);

function choiceFor(id: ChoiceId, value: string) {
  return choiceQuestions
    .find((q) => q.id === id)
    ?.choices.find((c) => c.value === value);
}

function choicePoints(id: ChoiceId, value: string): number {
  return choiceFor(id, value)?.points ?? 0;
}

export function choiceLabel(id: ChoiceId, value: string): string {
  return choiceFor(id, value)?.label ?? value;
}

function tierPoints(value: number, tiers: { min: number; points: number }[]) {
  return tiers.find((t) => value >= t.min)?.points ?? 0;
}

const known = (c: FollowerCount) => (typeof c === "number" ? c : c === "none" ? 0 : null);

function followerStats(a: ScorecardAnswers) {
  const fb = known(a.fbFollowers);
  const ig = known(a.igFollowers);
  const anyKnown = fb !== null || ig !== null;
  const total = (fb ?? 0) + (ig ?? 0);
  const ratio = anyKnown ? total / Math.max(1, a.attendance) : null;
  // Engagement is measured against the bigger account.
  const base = Math.max(fb ?? 0, ig ?? 0);
  const noAccounts = a.fbFollowers === "none" && a.igFollowers === "none";
  return { fb, ig, total, ratio, base, noAccounts };
}

function engagementRate(a: ScorecardAnswers): number | null {
  const { base } = followerStats(a);
  const mid = engagementMidpoints[a.engagement];
  if (!mid || base <= 0) return null;
  return mid / base;
}

export function scoreAnswers(a: ScorecardAnswers) {
  const { ratio, noAccounts } = followerStats(a);
  const rate = engagementRate(a);

  const followerPoints =
    ratio === null ? FOLLOWER_RATIO_UNSURE_POINTS : tierPoints(ratio, followerRatioTiers);
  const engagementPoints = noAccounts
    ? 0
    : rate === null
      ? ENGAGEMENT_UNSURE_POINTS
      : tierPoints(rate, engagementRateTiers);

  const byCategory: Record<CategoryId, number> = {
    reach: followerPoints + choicePoints("growth", a.growth) + choicePoints("ads", a.ads),
    engagement: engagementPoints,
    content:
      choicePoints("frequency", a.frequency) +
      choicePoints("contentType", a.contentType) +
      choicePoints("pastorOnCamera", a.pastorOnCamera),
    pipeline: choicePoints("inquirers", a.inquirers) + choicePoints("nextStep", a.nextStep),
    followUp: choicePoints("followUp", a.followUp),
    team: choicePoints("team", a.team),
  };

  const total = categoryOrder.reduce((sum, id) => sum + byCategory[id], 0);
  return { total: Math.round(total), byCategory };
}

export function bandFor(score: number) {
  return bands.find((b) => score >= b.min) ?? bands[bands.length - 1];
}

function tierFor(points: number, max: number): Tier {
  const pct = points / max;
  return pct < 0.4 ? "low" : pct < 0.75 ? "mid" : "high";
}

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

function pct(rate: number) {
  const p = rate * 100;
  return p < 0.1 ? "less than 0.1%" : `${p < 10 ? p.toFixed(1) : Math.round(p)}%`;
}

// Lines that quote the parish's own answers back to them.
function factsFor(id: CategoryId, a: ScorecardAnswers, population: number | null): string[] {
  const s = followerStats(a);
  const lines: string[] = [];
  switch (id) {
    case "reach": {
      if (s.ratio === null) {
        lines.push(
          "You weren’t sure of your follower counts. Knowing them is the first step to growing them.",
        );
      } else if (s.noAccounts) {
        lines.push(
          "Without a Facebook page or Instagram, people searching online have nowhere to find your parish.",
        );
      } else {
        const where =
          s.fb === null ? "on Instagram" : s.ig === null ? "on Facebook" : "across Facebook and Instagram";
        lines.push(
          `You have about ${fmt(s.total)} followers ${where} for ${fmt(a.attendance)} people at weekend Mass, roughly ${s.ratio.toFixed(1)} per attendee.`,
        );
      }
      if (population) {
        lines.push(`About ${fmt(population)} people live in ${a.city}.`);
      }
      lines.push(
        {
          shrinking: "Your follower count is shrinking compared to a year ago.",
          flat: "Your follower count has stayed about the same over the past year.",
          little: "Your follower count is growing a little.",
          fast: "Your follower count is growing fast.",
          unsure: "You’re not sure whether your following is growing.",
        }[a.growth] ?? "",
      );
      lines.push(
        {
          none: "You’re not running paid ads, so your posts mostly reach people who already follow you.",
          boosted: "Boosting the occasional post helps for a day or two, but it doesn’t build steady reach.",
        }[a.ads] ?? `You’re investing in ads (${choiceLabel("ads", a.ads).replace(/^Yes, /, "")}).`,
      );
      break;
    }
    case "engagement": {
      const rate = engagementRate(a);
      if (s.noAccounts) {
        lines.push("Without a Facebook page or Instagram, there’s nothing for people to respond to yet.");
      } else if (rate === null) {
        lines.push("You weren’t sure how many people respond to a typical post.");
      } else {
        lines.push(
          `A typical post gets ${choiceLabel("engagement", a.engagement).toLowerCase()} likes and comments, about ${pct(rate)} of your ${fmt(s.base)} followers.`,
        );
      }
      break;
    }
    case "content": {
      lines.push(
        {
          rarely: "Posting a few times a month or less makes it easy for people to forget about you.",
          weekly: "Posting about once a week keeps you present, but it’s easy to miss.",
          few: "Posting 2–3 times a week is a solid rhythm.",
          daily: "You post daily or close to it.",
        }[a.frequency] ?? "",
      );
      lines.push(
        {
          flyers: "Your posts are mostly flyers and announcements, which people tend to scroll past.",
          photos: "Photos of real people and parish life are a strong foundation.",
          video: "Regular short video is a strong foundation.",
        }[a.contentType] ?? "",
      );
      lines.push(
        {
          never: "Your pastor rarely appears on camera. For most newcomers, the pastor is the parish.",
          sometimes: "Your pastor appears occasionally. More of him would help newcomers feel they know him before they arrive.",
          regularly: "Your pastor appears regularly, which helps newcomers feel they know him before they visit.",
        }[a.pastorOnCamera] ?? "",
      );
      break;
    }
    case "pipeline": {
      lines.push(
        a.inquirers === "untracked"
          ? "You’re not tracking newcomer inquiries, so there’s no way to know what’s working."
          : a.inquirers === "0"
            ? "No new people are reaching out in a typical month."
            : a.inquirers === "10+"
            ? "More than 10 new people reach out in a typical month."
            : `About ${choiceLabel("inquirers", a.inquirers)} new people reach out in a typical month.`,
      );
      lines.push(
        {
          none: "There’s no clear next step for someone who finds you online.",
          massTimes: "Mass times alone ask a stranger to show up cold, which is a big ask.",
          contactForm: "A general contact form is a start, but it isn’t built for first-time visitors.",
          planVisit: "You have a dedicated Plan Your Visit step.",
        }[a.nextStep] ?? "",
      );
      break;
    }
    case "followUp": {
      lines.push(
        {
          sameDay: "Newcomers hear back the same day.",
          twoDays: "Newcomers hear back within 2 days.",
          week: "It can take up to a week for a newcomer to hear back.",
          longer: "It often takes more than a week for a newcomer to hear back.",
          noProcess: "There’s no set process for following up with newcomers.",
        }[a.followUp] ?? "",
      );
      break;
    }
    case "team": {
      lines.push(
        {
          nobody: "Nobody really owns your social media.",
          volunteer: "A volunteer runs your social media.",
          staff: "Paid parish staff run your social media.",
          agency: "A professional runs your social media.",
        }[a.team] ?? "",
      );
      break;
    }
  }
  return lines.filter(Boolean);
}

export type CategoryResult = {
  id: CategoryId;
  label: string;
  points: number;
  max: number;
  tier: Tier;
  status: string;
  facts: string[];
  fix: string;
};

export type ScorecardReport = {
  score: number;
  band: (typeof bands)[number];
  population: number | null;
  categories: CategoryResult[];
  priorities: CategoryResult[];
};

export function buildReport(a: ScorecardAnswers, population: number | null): ScorecardReport {
  const { total, byCategory } = scoreAnswers(a);
  const results: CategoryResult[] = categoryOrder.map((id) => {
    const max = categories[id].max;
    const points = byCategory[id];
    const tier = tierFor(points, max);
    return {
      id,
      label: categories[id].label,
      points,
      max,
      tier,
      status: categoryCopy[id].status[tier],
      facts: factsFor(id, a, population),
      fix: categoryCopy[id].fix,
    };
  });
  // Weakest first by share of points; bigger categories win ties. Categories
  // already scoring "high" don't need fixing, so a strong parish may get
  // fewer than 3 (or none).
  const priorities = [...results]
    .filter((c) => c.tier !== "high")
    .sort((x, y) => x.points / x.max - y.points / y.max || y.max - x.max)
    .slice(0, 3);
  return { score: total, band: bandFor(total), population, categories: results, priorities };
}

// Plain-text version for the lead notification (email + Zapier).
export function reportToText(r: ScorecardReport): string {
  const out = [
    `Score: ${r.score}/100 (${r.band.label})`,
    "",
    "Top priorities:",
    ...(r.priorities.length
      ? r.priorities.map((p, i) => `${i + 1}. ${p.label}: ${p.fix}`)
      : ["None. Every category scored strong."]),
    "",
  ];
  for (const c of r.categories) {
    out.push(`${c.label}: ${c.points}/${c.max}`, `  ${c.status}`, ...c.facts.map((f) => `  - ${f}`), "");
  }
  return out.join("\n");
}

// Where the report email's booking button points: the Parish Growth page's
// "Before You Book" section, which explains the pastor must join the call.
export const SCORECARD_BOOKING_URL = "https://parishmediacompany.com/parish#book";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const emailTier: Record<Tier, { label: string; color: string }> = {
  low: { label: "Needs attention", color: "#9c4532" },
  mid: { label: "Room to grow", color: "#8a6d2f" },
  high: { label: "Strong", color: "#1b2a4a" },
};

// Full report as a self-contained HTML email (inline styles only), sent to
// Zapier so the Zap can email it to the lead.
export function reportToHtml(r: ScorecardReport, greeting: string): string {
  const navy = "#1b2a4a";
  const font = "font-family:Georgia,'Times New Roman',serif;";
  const sans = "font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;";
  const priorities = r.priorities.length
    ? r.priorities
        .map(
          (p, i) => `<tr><td style="padding:0 0 14px 0;">
  <div style="background:#f3ede2;border-radius:12px;padding:16px 18px;">
    <div style="${sans}font-size:15px;font-weight:700;color:${navy};">${i + 1}. ${esc(p.label)}</div>
    <div style="${sans}font-size:15px;line-height:1.55;color:#3d4863;margin-top:4px;">${esc(p.fix)}</div>
  </div></td></tr>`,
        )
        .join("")
    : `<tr><td style="${sans}font-size:15px;line-height:1.6;color:#3d4863;padding-bottom:14px;">Every category scored strong. Keep protecting what&rsquo;s working.</td></tr>`;
  const cats = r.categories
    .map((c) => {
      const t = emailTier[c.tier];
      const facts = c.facts
        .map((f) => `<li style="margin:0 0 6px 0;">${esc(f)}</li>`)
        .join("");
      const fix =
        c.tier === "high"
          ? ""
          : `<div style="border-left:3px solid #c9a227;padding-left:12px;margin-top:12px;">
    <div style="${sans}font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;color:#8a6d2f;">What to do</div>
    <div style="${sans}font-size:15px;line-height:1.55;color:#3d4863;margin-top:2px;">${esc(c.fix)}</div></div>`;
      return `<tr><td style="padding:0 0 16px 0;">
  <div style="border:1px solid #e4e0d8;border-radius:12px;padding:18px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
      <td style="${font}font-size:20px;color:${navy};">${esc(c.label)}</td>
      <td align="right" style="${sans}font-size:14px;color:#6b7280;">${c.points}/${c.max}</td>
    </tr></table>
    <div style="${sans}font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;color:${t.color};margin-top:2px;">${t.label}</div>
    <div style="${sans}font-size:15px;font-weight:600;line-height:1.55;color:${navy};margin-top:10px;">${esc(c.status)}</div>
    <ul style="${sans}font-size:15px;line-height:1.55;color:#3d4863;margin:8px 0 0 0;padding-left:20px;">${facts}</ul>
    ${fix}
  </div></td></tr>`;
    })
    .join("");

  return `<!doctype html><html><body style="margin:0;padding:0;background:#faf8f4;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#faf8f4;"><tr><td align="center" style="padding:24px 12px;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;">
<tr><td style="${sans}font-size:16px;line-height:1.6;color:${navy};padding-bottom:16px;">
  Dear ${esc(greeting)},<br><br>
  Here is your full Parish Social Media Scorecard report: what to fix first, and a breakdown of every category with specific next steps.
</td></tr>
<tr><td style="background:${navy};border-radius:16px;padding:28px 24px;text-align:center;">
  <div style="${sans}font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:#c9a227;">Your Parish Social Media Score</div>
  <div style="${font}font-size:56px;line-height:1.1;color:#faf8f4;margin-top:10px;">${r.score}<span style="font-size:20px;color:#b8bfcc;"> / 100</span></div>
  <div style="${font}font-size:24px;color:#faf8f4;margin-top:6px;">${esc(r.band.label)}</div>
  <div style="${sans}font-size:15px;line-height:1.55;color:#d5d9e1;margin-top:8px;">${esc(r.band.summary)}</div>
</td></tr>
<tr><td style="${font}font-size:24px;color:${navy};padding:28px 0 14px 0;">${r.priorities.length ? "What to Fix First" : "Your Priorities"}</td></tr>
${priorities}
<tr><td style="${font}font-size:24px;color:${navy};padding:14px 0 14px 0;">Your Breakdown by Category</td></tr>
${cats}
<tr><td style="background:#f3ede2;border-radius:16px;padding:26px 24px;text-align:center;">
  <div style="${font}font-size:22px;color:${navy};">Want Help Closing These Gaps?</div>
  <div style="${sans}font-size:15px;line-height:1.55;color:#3d4863;margin:8px 0 18px 0;">Book a free Parish Growth Assessment. We&rsquo;ll go over your scorecard together and map out what to fix first.</div>
  <a href="${SCORECARD_BOOKING_URL}" style="${sans}display:inline-block;background:${navy};color:#faf8f4;text-decoration:none;font-weight:700;font-size:15px;padding:13px 26px;border-radius:999px;">Book a Free Assessment</a>
</td></tr>
<tr><td style="${sans}font-size:15px;line-height:1.6;color:${navy};padding-top:22px;">God bless,<br>Joe Jarrell<br><span style="color:#6b7280;">Parish Media Company</span></td></tr>
</table></td></tr></table></body></html>`;
}

// "saint paul" → "Saint Paul", so the report reads cleanly.
export function titleCase(s: string): string {
  return s.replace(/\s+/g, " ").replace(/(^|[\s-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());
}

// Validates untrusted answers (from the client) before scoring on the server.
export function parseAnswers(raw: unknown): ScorecardAnswers | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 100) : "");
  const count = (v: unknown): FollowerCount | null =>
    v === "unsure" || v === "none"
      ? v
      : typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 10_000_000
        ? Math.round(v)
        : null;

  const city = titleCase(str(r.city));
  const state = str(r.state);
  const attendance = typeof r.attendance === "number" ? Math.round(r.attendance) : NaN;
  const fbFollowers = count(r.fbFollowers);
  const igFollowers = count(r.igFollowers);
  if (!city || !US_STATES.some(([abbr]) => abbr === state)) return null;
  if (!(attendance >= 1 && attendance <= 100_000)) return null;
  if (fbFollowers === null || igFollowers === null) return null;

  const choices = {} as Record<ChoiceId, string>;
  for (const q of choiceQuestions) {
    const v = str(r[q.id]);
    if (!q.choices.some((c) => c.value === v)) return null;
    choices[q.id as ChoiceId] = v;
  }
  return { city, state, attendance, fbFollowers, igFollowers, ...choices };
}
