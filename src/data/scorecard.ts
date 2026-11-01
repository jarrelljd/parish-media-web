// Parish Social Media Scorecard (/scorecard): questions, points, score bands,
// and report copy. Scoring logic lives in src/lib/scorecard.ts.
//
// Points add up to 100: Reach 30, Engagement 15, Content 15,
// Newcomer Pipeline 20, Follow-Up 15, Team 5.
//
// Content (15) = frequency 5 + homily clips 5 + content mix 3 + pastor on
// camera 2.
//
// Copy rule: the report only quotes the parish's own numbers back to them,
// plus the client results in `proof` below (all published on /results).
// No invented benchmarks ("the average parish scores…") until there's real
// scorecard data to back them up.
//
// The written report (diagnosis + major problems) is built in
// src/lib/scorecardReport.ts.

// Client results the report may quote. Joe approved these for the report.
export const proof = {
  adsCost:
    "For parishes we work with, each person who fills out the form usually costs $2–3 in ads.",
  stPatrick:
    "At St. Patrick’s in South Hadley, MA, targeted ads plus steady posting brought in 65 young adult inquiries in 60 days and helped the parish build a young adult ministry from nothing.",
  stJoseph:
    "St. Joseph Parish in Los Banos, CA grew from 0 to 941 Instagram followers between February and June 2026, largely through consistent homily clips.",
  quote: {
    text: "Joe’s work has been great. Easter Mass was the most packed it’s ever been.",
    name: "Fr. Jared DeLeo",
    role: "Pastor, St. Monica Catholic Parish, Palatka, FL",
  },
};

export type CategoryId =
  | "reach"
  | "engagement"
  | "content"
  | "pipeline"
  | "followUp"
  | "team";

export type Choice = { value: string; label: string; points: number };

export type ChoiceQuestion = {
  kind: "choice";
  id: string;
  category: CategoryId;
  question: string;
  hint?: string;
  choices: Choice[];
};

// Follower counts: typed number, or one of the listed fallback choices.
export type CountQuestion = {
  kind: "count";
  id: "fbFollowers" | "igFollowers";
  question: string;
  hint?: string;
  fallbacks: { value: "unsure" | "none"; label: string }[];
};

// Pick-all-that-apply. Each picked choice adds its points.
export type MultiQuestion = {
  kind: "multi";
  id: "contentMix";
  category: CategoryId;
  question: string;
  hint?: string;
  choices: Choice[];
};

export type Question =
  | { kind: "location"; id: "location"; question: string; hint?: string }
  | { kind: "attendance"; id: "attendance"; question: string; hint?: string }
  | CountQuestion
  | ChoiceQuestion
  | MultiQuestion;

// The four kinds of organic posts (know, like, trust, ask). Values match the
// contentMix choices below.
export const postTypes = [
  {
    value: "value",
    label: "Value posts",
    purpose: "make people like the parish",
    examples: "homily clips, short teachings",
  },
  {
    value: "connection",
    label: "Connection posts",
    purpose: "help people know the parish",
    examples: "the pastor’s vocation story, his vision for the parish, staff introductions",
  },
  {
    value: "activity",
    label: "Activity posts",
    purpose: "help people trust the parish",
    examples: "event group photos, sacraments, milestones",
  },
  {
    value: "flyers",
    label: "Flyers",
    purpose: "are the asks",
    examples: "Mass times, events, volunteering. They work best when the other three are already in place",
  },
] as const;

export const questions: Question[] = [
  {
    kind: "location",
    id: "location",
    question: "Where is your parish?",
    hint: "We use this to see how many people live around you.",
  },
  {
    kind: "attendance",
    id: "attendance",
    question:
      "About how many people attend Mass across all your weekend Masses combined?",
    hint: "Include the Saturday vigil. Your most recent October count works.",
  },
  {
    kind: "count",
    id: "fbFollowers",
    question: "How many followers does your parish Facebook page have?",
    hint: "A rough number is fine.",
    fallbacks: [
      { value: "unsure", label: "I'm not sure" },
      { value: "none", label: "We don't have a Facebook page" },
    ],
  },
  {
    kind: "count",
    id: "igFollowers",
    question: "How many followers does your parish Instagram have?",
    hint: "A rough number is fine.",
    fallbacks: [
      { value: "unsure", label: "I'm not sure" },
      { value: "none", label: "We don't have Instagram" },
    ],
  },
  {
    kind: "choice",
    id: "engagement",
    category: "engagement",
    question:
      "On a typical post, about how many likes and comments do you get combined?",
    hint: "Think of an ordinary week, not your best post ever.",
    // Points here are placeholders. Engagement is scored as a % of followers
    // in src/lib/scorecard.ts, using the middle of each range.
    choices: [
      { value: "0-5", label: "0–5", points: 0 },
      { value: "6-20", label: "6–20", points: 0 },
      { value: "21-50", label: "21–50", points: 0 },
      { value: "51-100", label: "51–100", points: 0 },
      { value: "100+", label: "More than 100", points: 0 },
      { value: "unsure", label: "I'm not sure", points: 0 },
    ],
  },
  {
    kind: "choice",
    id: "growth",
    category: "reach",
    question: "Compared to a year ago, your follower count is…",
    choices: [
      { value: "shrinking", label: "Shrinking", points: 0 },
      { value: "flat", label: "About the same", points: 0 },
      { value: "little", label: "Growing a little", points: 5 },
      { value: "fast", label: "Growing fast", points: 8 },
      { value: "unsure", label: "I'm not sure", points: 1 },
    ],
  },
  {
    kind: "choice",
    id: "ads",
    category: "reach",
    question:
      "Has your parish run paid Facebook or Instagram ads in the last 6 months?",
    choices: [
      { value: "none", label: "No", points: 0 },
      { value: "boosted", label: "We boosted a post or two", points: 1 },
      { value: "under250", label: "Yes, ongoing, under $250/month", points: 5 },
      { value: "250-1000", label: "Yes, $250–$1,000/month", points: 8 },
      { value: "1000+", label: "Yes, more than $1,000/month", points: 10 },
    ],
  },
  {
    kind: "choice",
    id: "frequency",
    category: "content",
    question: "How often does your parish post?",
    choices: [
      { value: "rarely", label: "A few times a month or less", points: 0 },
      { value: "weekly", label: "About once a week", points: 1 },
      { value: "few", label: "2–3 times a week", points: 4 },
      { value: "daily", label: "Daily or almost daily", points: 5 },
    ],
  },
  {
    kind: "choice",
    id: "homilyClips",
    category: "content",
    question: "Do you post short clips of your pastor’s homilies?",
    choices: [
      { value: "no", label: "No", points: 0 },
      { value: "occasionally", label: "Occasionally", points: 1 },
      { value: "regularly", label: "Yes, every week", points: 5 },
    ],
  },
  {
    kind: "multi",
    id: "contentMix",
    category: "content",
    question: "Which of these do you post at least once a month?",
    hint: "Pick all that apply.",
    // Values match postTypes above. Flyers are asks, so they score 0 here.
    choices: [
      { value: "value", label: "Homily clips or short teachings", points: 1 },
      { value: "connection", label: "The pastor’s story, vision, or staff introductions", points: 1 },
      { value: "activity", label: "Event photos, sacraments, or milestones", points: 1 },
      { value: "flyers", label: "Flyers and event announcements", points: 0 },
    ],
  },
  {
    kind: "choice",
    id: "pastorOnCamera",
    category: "content",
    question: "Does your pastor appear on camera in your posts?",
    choices: [
      { value: "never", label: "Never or almost never", points: 0 },
      { value: "sometimes", label: "Occasionally", points: 1 },
      { value: "regularly", label: "Regularly", points: 2 },
    ],
  },
  {
    kind: "choice",
    id: "inquirers",
    category: "pipeline",
    question:
      "About how many new people reach out each month about coming to Mass or visiting for the first time?",
    hint: "Calls, emails, messages, or forms from people new to the parish.",
    choices: [
      { value: "untracked", label: "We don't track this", points: 0 },
      { value: "0", label: "None", points: 0 },
      { value: "1-2", label: "1–2", points: 2 },
      { value: "3-5", label: "3–5", points: 8 },
      { value: "6-10", label: "6–10", points: 10 },
      { value: "10+", label: "More than 10", points: 12 },
    ],
  },
  {
    kind: "choice",
    id: "nextStep",
    category: "pipeline",
    question:
      "If someone new finds your parish online, what's their clearest next step?",
    choices: [
      { value: "none", label: "There isn't really one", points: 0 },
      { value: "massTimes", label: "Mass times on our website", points: 0 },
      { value: "contactForm", label: "A general contact form", points: 3 },
      { value: "planVisit", label: "A dedicated “Plan Your Visit” page or form", points: 8 },
      { value: "metaForm", label: "A Facebook/Instagram form (name and phone)", points: 8 },
    ],
  },
  {
    kind: "choice",
    id: "followUp",
    category: "followUp",
    question:
      "When someone new reaches out, how quickly does someone from the parish follow up personally?",
    choices: [
      { value: "sameDay", label: "The same day", points: 15 },
      { value: "twoDays", label: "Within 2 days", points: 10 },
      { value: "week", label: "Within a week", points: 3 },
      { value: "longer", label: "Longer than a week", points: 0 },
      { value: "noProcess", label: "We don't have a set process", points: 0 },
    ],
  },
  {
    kind: "choice",
    id: "team",
    category: "team",
    question: "Who runs your parish social media?",
    choices: [
      { value: "nobody", label: "Nobody, really", points: 0 },
      { value: "volunteer", label: "A volunteer", points: 1 },
      { value: "staff", label: "Paid parish staff", points: 3 },
      { value: "agency", label: "An outside agency or professional", points: 5 },
    ],
  },
];

// Followers (FB + IG combined) per weekend Mass attendee → points (max 12).
export const followerRatioTiers = [
  { min: 4, points: 12 },
  { min: 2, points: 11 },
  { min: 1, points: 8 },
  { min: 0.5, points: 4 },
  { min: 0, points: 0 },
];
export const FOLLOWER_RATIO_UNSURE_POINTS = 3;

// Typical likes + comments as a share of followers → points (max 15).
export const engagementRateTiers = [
  { min: 0.03, points: 15 },
  { min: 0.01, points: 11 },
  { min: 0.005, points: 5 },
  { min: 0, points: 0 },
];
export const ENGAGEMENT_UNSURE_POINTS = 3;
// Middle of each likes/comments range, used to estimate the rate.
export const engagementMidpoints: Record<string, number> = {
  "0-5": 2.5,
  "6-20": 13,
  "21-50": 35,
  "51-100": 75,
  "100+": 150,
};

export const categories: Record<
  CategoryId,
  { label: string; max: number; blurb: string }
> = {
  reach: {
    label: "Reach",
    max: 30,
    blurb: "How many people in your area actually see your parish.",
  },
  engagement: {
    label: "Engagement",
    max: 15,
    blurb: "Whether people respond when they see your posts.",
  },
  content: {
    label: "Content",
    max: 15,
    blurb: "What you post, how often, and whether it feels personal.",
  },
  pipeline: {
    label: "Newcomer Pipeline",
    max: 20,
    blurb: "Whether new people have a clear way to take a first step.",
  },
  followUp: {
    label: "Follow-Up",
    max: 15,
    blurb: "What happens after someone new reaches out.",
  },
  team: {
    label: "Team",
    max: 5,
    blurb: "Who owns your social media, and whether it gets real time.",
  },
};

export const categoryOrder: CategoryId[] = [
  "reach",
  "engagement",
  "content",
  "pipeline",
  "followUp",
  "team",
];

// Score caps (Joe, 2026-11-01): a parish can't score as "doing fine" without
// an outreach system. Ads + Plan a Visit step + fast, tracked follow-up.
// - No ongoing ads, or no Plan a Visit step: total capped at NO_SYSTEM_CAP.
// - Both in place, but follow-up is slower than 2 days or inquiries aren't
//   tracked (a "leak"): total capped at LEAK_CAP.
export const NO_SYSTEM_CAP = 45;
export const LEAK_CAP = 69;
export const ONGOING_AD_VALUES = ["under250", "250-1000", "1000+"];
export const PLAN_STEP_VALUES = ["planVisit", "metaForm"];
export const FAST_FOLLOW_UP_VALUES = ["sameDay", "twoDays"];

// Overall score bands (score is 0–100). `tone` drives the band's color in
// the PDF and on the results pages (red for critical through green).
export type BandTone = "critical" | "atRisk" | "stalled" | "gaps" | "thriving";

export const bands: { min: number; label: string; tone: BandTone; summary: string }[] = [
  {
    min: 85,
    label: "Thriving",
    tone: "thriving",
    summary:
      "Newcomers are finding your parish, responding, and hearing back fast. The work now is protecting what’s working and building on it.",
  },
  {
    min: 70,
    label: "Strong, With Gaps",
    tone: "gaps",
    summary:
      "Your outreach system works, but specific gaps are costing you families. Closing them is where your next growth comes from.",
  },
  {
    min: 50,
    label: "Stalled",
    tone: "stalled",
    summary:
      "Your parish is active online, but it isn’t bringing new people to Mass. Effort is going in without a system to turn it into first visits.",
  },
  {
    min: 30,
    label: "At Risk",
    tone: "atRisk",
    summary:
      "Most people near your parish don’t know you’re there or how to take a first step. Without an outreach system, new families aren’t coming.",
  },
  {
    min: 0,
    label: "Critical",
    tone: "critical",
    summary:
      "To newcomers in your area, your parish is effectively invisible. Nothing is inviting them in, and there’s no clear way for them to respond.",
  },
];

// Per-category report copy. Status is picked by % of the category's points:
// low < 40%, mid < 75%, high ≥ 75%.
export type Tier = "low" | "mid" | "high";

export const categoryCopy: Record<
  CategoryId,
  { status: Record<Tier, string>; fix: string }
> = {
  reach: {
    status: {
      low: "Very few people outside your current parishioners are seeing your parish.",
      mid: "You’re reaching some people, but most of your neighborhood still doesn’t see you.",
      high: "Your parish is reaching well beyond the people already in the pews.",
    },
    fix: "Put a small, steady ad budget behind your best posts, aimed at families within a few miles of the parish. Ads are the only reliable way to reach people who don’t already follow you.",
  },
  engagement: {
    status: {
      low: "Most people who see your posts scroll past without responding.",
      mid: "Some posts get a response, but most of your followers stay quiet.",
      high: "Your followers respond to what you post, which helps it reach more people.",
    },
    fix: "Ask questions people can answer in the comments, and reply to every comment within a day. Comments and shares tell Facebook and Instagram to show your posts to more people.",
  },
  content: {
    status: {
      low: "Your posts read more like a bulletin board than a window into parish life.",
      mid: "Your content has good moments, but it isn’t consistent or personal enough yet.",
      high: "You post often, and your content shows real people and real parish life.",
    },
    fix: "Post 3–4 times a week, with at least one homily clip, and mix in posts that help people know, like, and trust the parish.",
  },
  pipeline: {
    status: {
      low: "A newcomer who finds you online has no clear first step, so most never take one.",
      mid: "Some new people find their way to you, but the path isn’t clear or measured yet.",
      high: "New people have a clear first step, and they’re taking it.",
    },
    fix: "Give newcomers a simple Plan Your Visit form, usually a Facebook/Instagram form asking for name and phone number, and send ads to it. Then count every response each month.",
  },
  followUp: {
    status: {
      low: "When someone new reaches out, there’s a real chance they never hear back.",
      mid: "Newcomers hear back, but often not fast enough to keep their interest.",
      high: "New people get a fast, personal response.",
    },
    fix: "Name one person responsible for newcomers and commit to a personal reply the same day. A quick, warm reply is often the difference between a first visit and a stranger who never comes.",
  },
  team: {
    status: {
      low: "Nobody clearly owns your social media, so it happens when someone has time.",
      mid: "Someone owns your social media, but it likely competes with many other duties.",
      high: "Your social media has a clear owner with real time and skill behind it.",
    },
    fix: "Give social media a clear owner with paid time for it, even a few hours a week. Volunteer-run pages tend to go quiet when life gets busy.",
  },
};

export const US_STATES: [string, string][] = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"],
  ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"],
  ["DE", "Delaware"], ["DC", "District of Columbia"], ["FL", "Florida"],
  ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"],
  ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"],
  ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"],
  ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"],
  ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"],
  ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"],
  ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"],
  ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"],
  ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"], ["SC", "South Carolina"], ["SD", "South Dakota"],
  ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"],
  ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"],
  ["WI", "Wisconsin"], ["WY", "Wyoming"],
];
