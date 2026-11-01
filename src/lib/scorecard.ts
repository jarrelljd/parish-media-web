// Scoring + report builder for the Parish Social Media Scorecard.
// Pure functions, shared by the browser (instant score) and the server
// (re-scores the submitted answers so the lead email can't be spoofed).
// All points, bands, and copy live in src/data/scorecard.ts.

import {
  ENGAGEMENT_UNSURE_POINTS,
  FAST_FOLLOW_UP_VALUES,
  FOLLOWER_RATIO_UNSURE_POINTS,
  LEAK_CAP,
  NO_SYSTEM_CAP,
  ONGOING_AD_VALUES,
  PLAN_STEP_VALUES,
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
  type MultiQuestion,
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
  homilyClips: string;
  // Post types they publish monthly (values from postTypes in data/scorecard).
  contentMix: string[];
  pastorOnCamera: string;
  inquirers: string;
  nextStep: string;
  followUp: string;
  team: string;
};

export type ChoiceId = Exclude<
  keyof ScorecardAnswers,
  "city" | "state" | "attendance" | "fbFollowers" | "igFollowers" | "contentMix"
>;

const choiceQuestions = questions.filter(
  (q): q is ChoiceQuestion => q.kind === "choice",
);
const contentMixQuestion = questions.find(
  (q): q is MultiQuestion => q.kind === "multi",
)!;

export function contentMixPoints(mix: string[]): number {
  return contentMixQuestion.choices
    .filter((c) => mix.includes(c.value))
    .reduce((sum, c) => sum + c.points, 0);
}

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
      choicePoints("homilyClips", a.homilyClips) +
      contentMixPoints(a.contentMix) +
      choicePoints("pastorOnCamera", a.pastorOnCamera),
    pipeline: choicePoints("inquirers", a.inquirers) + choicePoints("nextStep", a.nextStep),
    followUp: choicePoints("followUp", a.followUp),
    team: choicePoints("team", a.team),
  };

  const rawTotal = Math.round(categoryOrder.reduce((sum, id) => sum + byCategory[id], 0));
  const cap = scoreCap(a);
  const total = cap ? Math.min(rawTotal, cap.at) : rawTotal;
  return {
    total,
    rawTotal,
    // Only reported when it actually lowered the score.
    cap: cap && rawTotal > cap.at ? cap : null,
    byCategory,
  };
}

export type ScoreCap = { at: number; reason: "noSystem" | "leak" };

// See NO_SYSTEM_CAP / LEAK_CAP in data/scorecard.ts.
export function outreachStatus(a: Pick<ScorecardAnswers, "ads" | "nextStep" | "followUp" | "inquirers">) {
  const hasAds = ONGOING_AD_VALUES.includes(a.ads);
  const hasPlanStep = PLAN_STEP_VALUES.includes(a.nextStep);
  const fastFollow = FAST_FOLLOW_UP_VALUES.includes(a.followUp);
  const tracked = a.inquirers !== "untracked";
  const missing = !hasAds || !hasPlanStep;
  const leak = !missing && (!fastFollow || !tracked);
  return { hasAds, hasPlanStep, fastFollow, tracked, missing, leak };
}

function scoreCap(a: ScorecardAnswers): ScoreCap | null {
  const o = outreachStatus(a);
  if (o.missing) return { at: NO_SYSTEM_CAP, reason: "noSystem" };
  if (o.leak) return { at: LEAK_CAP, reason: "leak" };
  return null;
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
          no: "The parish doesn’t post homily clips.",
          occasionally: "Homily clips are posted only occasionally.",
          regularly: "You post homily clips every week.",
        }[a.homilyClips] ?? "",
      );
      if (a.contentMix.length === 0) {
        lines.push("None of the four main post types go out at least monthly.");
      } else if (a.contentMix.length === 1 && a.contentMix[0] === "flyers") {
        lines.push("Most of what you post is flyers and announcements.");
      }
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
  // Sum of the category points, before any cap.
  rawScore: number;
  cap: ScoreCap | null;
  band: (typeof bands)[number];
  population: number | null;
  categories: CategoryResult[];
  priorities: CategoryResult[];
};

export function buildReport(a: ScorecardAnswers, population: number | null): ScorecardReport {
  const { total, rawTotal, cap, byCategory } = scoreAnswers(a);
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
  return { score: total, rawScore: rawTotal, cap, band: bandFor(total), population, categories: results, priorities };
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
  const mixRaw = Array.isArray(r.contentMix) ? r.contentMix : null;
  if (!mixRaw) return null;
  const contentMix = contentMixQuestion.choices
    .map((c) => c.value)
    .filter((v) => mixRaw.includes(v));

  const choices = {} as Record<ChoiceId, string>;
  for (const q of choiceQuestions) {
    const v = str(r[q.id]);
    if (!q.choices.some((c) => c.value === v)) return null;
    choices[q.id as ChoiceId] = v;
  }
  return { city, state, attendance, fbFollowers, igFollowers, contentMix, ...choices };
}
