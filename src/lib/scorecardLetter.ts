// The scorecard letter: a personal, signed letter from Joe, written fresh for
// each parish by OpenAI from (1) the problems the rules picked, (2) the quiz
// answers, and (3) what the parish lookup found on their pages.
//
// Sources Joe approved (both Claude Docs, 2026-11-08):
//   - Scorecard Letter Voice Guide: greeting, structure, tone, fixed closing.
//   - Scorecard Diagnosis Rulebook: what counts as a problem, the plain
//     "why it matters" lines, approved proof, the Ad Library rule.
//
// What stays in code (never written by the AI): which problems the letter
// covers and their order, the greeting, the fixed closing, the signature,
// and the score in the Re: line. The AI writes the middle of the letter and
// one line for the cover email.
//
// Every number the AI writes must appear in the facts we gave it; otherwise
// we ask once more, then fall back to a plain template letter built from
// the same facts. The letter is written once, at opt-in, and travels inside
// the signed PDF link (scorecardLink.ts), so the PDF never changes.

import { proof } from "@/data/scorecard";
import { getVaultItem, vaultItemHref } from "@/data/vault";
import { upcomingChurchDates } from "@/lib/churchCalendar";
import { mainFeed, profileStats, type ParishProfile, type PostType, type ProfilePost } from "@/lib/parishProfile";
import { choiceLabel, outreachStatus, type ScorecardAnswers } from "@/lib/scorecard";
import type { ReportProblem, ScorecardDoc } from "@/lib/scorecardReport";

// ---------------------------------------------------------------------------
// Types (kept short: the letter rides inside the signed link)
// ---------------------------------------------------------------------------

export type EvidencePost = {
  d: string; // "Oct 12"
  p: "fb" | "ig";
  t: PostType | null;
  r: number; // likes + comments
  v: boolean; // video
};

export type LetterEvidence = {
  posts: EvidencePost[]; // newest first, up to 9
  web: string | null; // website host
  fb: number | null | false; // followers, null unknown, false = not found
  ig: number | null | false;
  ads: "none" | null; // only "none" when the quiz agrees (Ad Library rule)
};

export type ScorecardLetter = {
  v: 1;
  src: "ai" | "template";
  body: string[]; // paragraphs between the greeting and the fixed closing
  cover: string; // the biggest problem in plain words, for the cover email
  res: LetterResource[]; // House of Studies resources recommended in the closing
  ev?: LetterEvidence;
};

// ---------------------------------------------------------------------------
// Greeting, closing, resources
// ---------------------------------------------------------------------------

const PRIEST_TITLES = /^(fr|father|rev|reverend|msgr|monsignor)\.?$/i;
const DEACON_TITLES = /^(deacon|dcn|deac)\.?$/i;

// "Hi Father," / "Hi Fr. John," / "Hi Deacon Mike," / "Hi Maria," per the voice guide.
export function letterGreeting(name: string, role: string): string {
  const words = name.split(",")[0].trim().split(/\s+/).filter((w) => /\p{L}/u.test(w));
  const tidy = (w: string) => (w === w.toLowerCase() || w === w.toUpperCase() ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w);
  const first = words[1] ? tidy(words[1].replace(/[.,]/g, "")) : "";
  if (words[0] && PRIEST_TITLES.test(words[0])) return first && words.length > 2 ? `Hi Fr. ${first},` : "Hi Father,";
  if (words[0] && DEACON_TITLES.test(words[0])) return first ? `Hi Deacon ${first},` : "Hi Deacon,";
  if (role === "Pastor" || role === "Parochial Vicar") return "Hi Father,";
  if (words[0] && /^(sr|sister|br|brother)\.?$/i.test(words[0]) && first) return `Hi ${/^s/i.test(words[0]) ? "Sister" : "Brother"} ${first},`;
  if (words[0] && /^(mr|mrs|ms|dr)\.?$/i.test(words[0])) return first ? `Hi ${first},` : "Hello,";
  return words[0] ? `Hi ${tidy(words[0])},` : "Hello,";
}

// The free House of Studies resources the letter recommends, picked for what
// the letter diagnoses. Each need lists resources in order of preference;
// only live ones count ("Coming Soon" items are skipped), so new videos are
// picked up automatically as they go live in src/data/vault.ts.
export type ResourceNeed =
  | "outreach"
  | "leak"
  | "homily" // no weekly homily clip
  | "coreFour" // posts don't follow the core four, or few people respond
  | "flyers" // feed is mostly flyers
  | "infrequent" // too few posts
  | "flyerCta" // flyers without a clear next step
  | "noActivity"
  | "noConnection"
  | "default";

const RESOURCES: Record<ResourceNeed, [slug: string, why: string][]> = {
  outreach: [
    ["meta-ads-mass", "how to set up the ad and simple form that invite families nearby to Mass"],
    ["meta-ads-fundamentals", "the basics of running Facebook and Instagram ads for a parish"],
  ],
  leak: [["meta-ads-mass", "how the Plan a Visit ad, the form, and the follow-up call fit together"]],
  coreFour: [["core-four-overview", "the core four: the four posts every parish should be making each week"]],
  homily: [["core-four-homily-clips", "how to film the Sunday homily and turn it into short clips"]],
  flyers: [
    ["core-four-overview", "the four kinds of posts and how to balance them so the feed gives more than it asks"],
    ["core-four-activity-posts", "how to show parish life, so the feed isn’t only announcements"],
  ],
  infrequent: [
    ["core-four-overview", "the four kinds of posts every parish should be making each week"],
    ["social-media-system", "how to keep a steady weekly posting rhythm without it taking over your week"],
  ],
  flyerCta: [
    ["core-four-flyers", "how to make flyers people stop and read, with one clear next step"],
    ["flyer-sop", "a step-by-step checklist to run every flyer through"],
  ],
  noActivity: [["core-four-activity-posts", "how to show what’s happening at the parish"]],
  noConnection: [["core-four-connection-posts", "how to tell short stories about Father, the staff, and the parish"]],
  default: [["social-media-system", "the full overview of running parish social media as a simple weekly system"]],
};

export type LetterResource = { s: string; w: string }; // vault slug, why it fits

const isLive = (slug: string) => {
  const item = getVaultItem(slug);
  return !!item && !!(item.video || item.href);
};

// Up to 3 resources, in the order the letter raises the needs. Falls back to
// the Fundamentals overview so there are always at least two (or one, if
// that's all that's live).
export function pickResources(needs: ResourceNeed[]): LetterResource[] {
  const out: LetterResource[] = [];
  for (const need of [...needs, "default" as const]) {
    if (out.length >= 3) break;
    const hit = RESOURCES[need].find(([slug]) => isLive(slug) && !out.some((r) => r.s === slug));
    if (hit) out.push({ s: hit[0], w: hit[1] });
  }
  return out;
}

// What the closing needs to show for one resource.
export function resourceLink(r: LetterResource) {
  const item = getVaultItem(r.s);
  if (!item) return null;
  const path = vaultItemHref(item);
  const url = path.startsWith("http") ? path : `https://parishmediacompany.com${path}`;
  return {
    title: item.title.replace(/ /g, " "),
    why: r.w,
    url,
    display: url.replace(/^https?:\/\/(www\.)?/, ""),
    kind: item.kind === "video" ? "video" : "resource",
  };
}

// Needs from the problems the rules picked, in their order.
function problemNeeds(problems: ReportProblem[], a: ScorecardAnswers): ResourceNeed[] {
  return problems.flatMap((p): ResourceNeed[] => {
    if (p.id === "nurture")
      return [...(a.mainContent === "flyers" ? ["flyers" as const] : []), ...(a.homilyClips !== "regularly" ? ["homily" as const] : [])];
    if (p.id === "frequency") return ["infrequent"];
    return [p.id];
  });
}

// ---------------------------------------------------------------------------
// Facebook engagement rate (Joe, 2026-11-10)
// ---------------------------------------------------------------------------
// A typical post's likes + comments as a share of Facebook followers. Facebook
// only: parish Instagram accounts behave differently. Bigger pages naturally
// get a smaller share, so the cutoffs relax as the page grows. It's proof for
// the nurture or posting problem, never a problem of its own (unless nothing
// else explains it). The letter never calls a page "dead".

export type EngagementBand = "low" | "underperforming" | "fine" | "strong";

export function engagementBand(followers: number, ratePct: number): EngagementBand {
  const [low, ok] = followers < 1000 ? [1, 2] : followers < 5000 ? [0.75, 1.5] : [0.5, 1];
  if (ratePct > 5) return "strong";
  if (ratePct >= ok) return "fine";
  if (ratePct >= low) return "underperforming";
  return "low";
}

export function facebookEngagement(profile: ParishProfile) {
  const followers = profile.facebook?.followers;
  const posts = profile.posts.filter((p) => p.platform === "facebook");
  if (!followers || followers < 50 || posts.length < 4) return null;
  const sorted = posts.map((p) => p.likes + p.comments).sort((x, y) => x - y);
  const typical = sorted[Math.floor(sorted.length / 2)]; // median, so one big post doesn't hide a quiet feed
  const ratePct = (typical / followers) * 100;
  const band = engagementBand(followers, ratePct);
  const per100 =
    ratePct < 1
      ? "fewer than 1 in 100"
      : band === "low" || band === "underperforming"
        ? `fewer than ${Math.floor(ratePct) + 1} in 100`
        : `at least ${Math.floor(ratePct)} in 100`;
  return {
    facebookFollowers: followers,
    postsCounted: posts.length,
    typicalLikesAndCommentsPerPost: typical,
    plainLine: `About ${followers.toLocaleString("en-US")} people follow the Facebook page, and a typical post gets ${typical} likes and comments. That's ${per100} followers responding.`,
    band,
    meaning: {
      low: "Most of the people following the page aren't seeing the posts: when few people respond, Facebook shows a post to fewer people. Say it plainly and kindly; never call the page dead.",
      underperforming: "The page is underperforming: people follow it, but few respond, so Facebook shows the posts to fewer of them.",
      fine: "Not a cause for concern. Don't raise it as a problem; you may leave it out.",
      strong: "Followers respond well. Worth a sentence in what's working.",
    }[band],
  };
}

export const BOOKING_DISPLAY = "parishmediacompany.com/parish";

// The fixed closing from the voice guide. Only the resources and parish
// change. `resourcesIntro` leads into the list of recommended resources
// (drawn by the PDF), and `rest` follows it.
export function fixedClosing(letter: Pick<ScorecardLetter, "res">, parish: string, isPastor: boolean) {
  const one = letter.res.length === 1;
  const where = parish === "the parish" ? "your parish" : parish;
  return {
    resourcesIntro: `If you’d like to do this yourself, I picked out ${one ? "a free video" : "a few free videos"} from our Parish House of Studies for where ${where} is right now:`,
    rest: [
    "Fixing these takes a handful of skills: editing video, running targeted Facebook and Instagram ads, tracking who responds to them, and setting up the automatic follow-up that makes sure every family hears back. You can absolutely learn all of this in-house.",
    "But let’s be honest: most parish teams aren’t going to have someone learn all of that and then keep it going every week. Not because your team doesn’t care, but because they’re already busy serving the parish. Projects like this get pushed aside by more urgent responsibilities.",
    "So you have two choices: keep going as you are, or have someone build and run the system for you.",
    `If it’s the second, that’s exactly what we do. We’d take the homily clips, the ads, and the follow-up system off your team’s plate. The first step is a free 30-minute Parish Growth Assessment, where we’ll go over this letter together and map out a game plan for ${parish}. It’s yours to keep whether we work together or not.${
      isPastor ? "" : " We do ask that your pastor join the call."
    }`,
    `You can pick a time that works for you at ${BOOKING_DISPLAY}.`,
    ],
  };
}

// ---------------------------------------------------------------------------
// Facts: everything the letter may say, in one object
// ---------------------------------------------------------------------------

const TYPE_LABEL: Record<PostType, string> = {
  homily_clip: "homily clip",
  value_video: "teaching video",
  activity: "photos from parish life",
  connection: "story post (people or parish history)",
  flyer: "flyer or announcement",
  filler: "filler (livestream, quote, or generic graphic)",
};

const CORE_FOUR_STANDARD =
  "Every week: one homily clip (gives people something for free, so they like the parish), one connection post (a story about the pastor, the staff, or the parish, so people know you), one social proof post (photos or video of parish life, so people see others like them already go, so they trust you), and one flyer (the ask, which works because the other three came first).";

const DAY = 86_400_000;
const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "America/Los_Angeles" });
const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Los_Angeles" });

const PROOF_FOR: Record<string, { fits: string; text: string }> = {
  adsCost: { fits: "no ads, no Plan a Visit step, slow follow-up", text: proof.adsCost },
  stPatrick: { fits: "no ads (outreach)", text: proof.stPatrick },
  stPatrickLeader: {
    fits: "no ads",
    text: "St. Patrick’s found a young adult ministry leader within about a week from one ad, even with a Facebook page that had gone quiet.",
  },
  stJoseph: { fits: "no homily clips, slow growth", text: proof.stJoseph },
  stJosephForm: {
    fits: "no Plan a Visit step, a form that's hard to fill out",
    text: "When St. Joseph in Los Banos simplified its Meta form for the Corpus Christi procession, the share of people who finished it went from about 3% to 30% overnight.",
  },
  ssJohnJames: {
    fits: "few followers, no Instagram, a quiet page",
    text: "Ss. John and James went from no Instagram and a Facebook page quiet for a year to over 100 local Instagram followers overnight from one follower ad.",
  },
  storyAsk: {
    fits: "flyers without a clear next step",
    text: "One parish's Story asking for ushers with a 'learn more' link got 700 views and no sign-ups. The same ask with a simple poll got hands raised.",
  },
};

export type LetterFacts = ReturnType<typeof buildLetterFacts>;

export function buildLetterFacts(
  doc: ScorecardDoc,
  a: ScorecardAnswers,
  profile: ParishProfile | null,
  lead: { role: string },
  now = new Date(),
) {
  const o = outreachStatus(a);
  const isPastor = lead.role === "Pastor";
  const confirmed = !!profile && (!!profile.facebook || !!profile.instagram);
  const nowMs = now.getTime();

  const quiz = {
    weekendMassAttendance: a.attendance,
    facebookFollowers: a.fbFollowers,
    instagramFollowers: a.igFollowers,
    typicalLikesAndCommentsPerPost: choiceLabel("engagement", a.engagement),
    followerGrowthOverLastYear: choiceLabel("growth", a.growth),
    paidAdsInLast6Months: choiceLabel("ads", a.ads),
    howOftenTheyPost: choiceLabel("frequency", a.frequency),
    homilyClips: choiceLabel("homilyClips", a.homilyClips),
    whatTheyMostlyPost: choiceLabel("mainContent", a.mainContent),
    newPeopleReachingOutPerMonth: choiceLabel("inquirers", a.inquirers),
    nextStepForNewcomers: choiceLabel("nextStep", a.nextStep),
    followUpSpeed: choiceLabel("followUp", a.followUp),
    whoRunsSocialMedia: choiceLabel("team", a.team),
  };

  // The problems the rules picked, in the order the letter must use. The
  // letter covers the first two; anything past that is a one-line mention.
  const problems: { id: string; title: string; whatWeSaw: string[]; firstStep: string }[] = doc.problems.map((p) => ({
    id: p.id,
    title: p.title,
    whatWeSaw: p.saw,
    firstStep: p.firstStep,
  }));
  const smallerThings: string[] = [];

  let pages: Record<string, unknown> | null = null;
  const observations: string[] = [];
  // Which House of Studies resources to recommend: the rules' problems first,
  // then what we saw on their pages (a flyer fix ranks right after them).
  const needs: ResourceNeed[] = problemNeeds(doc.problems, a);
  const problemCount = needs.length;
  let evidence: LetterEvidence | undefined;
  let engagement: (NonNullable<ReturnType<typeof facebookEngagement>> & { provesProblem: string | null }) | null = null;
  let coreFour: Record<string, unknown> = {
    standard: CORE_FOUR_STANDARD,
    theirPosts: "from their answers only (see quizAnswers.whatTheyMostlyPost, homilyClips, howOftenTheyPost)",
  };

  if (profile && confirmed) {
    const feed = mainFeed(profile, nowMs);
    const stats = profileStats(profile, nowMs);
    const sorted = [...feed.all].sort((x, y) => Date.parse(y.date) - Date.parse(x.date));
    const last9 = sorted.slice(0, 9);
    const since = (p: ProfilePost) => Math.round((nowMs - Date.parse(p.date)) / DAY);
    const in30 = (t: PostType) => sorted.filter((p) => p.type === t && since(p) <= 30).length;

    pages = {
      website: profile.pages.website?.url ?? null,
      facebook: profile.facebook ? { followers: profile.facebook.followers } : "not found",
      instagram: profile.instagram ? { followers: profile.instagram.followers } : "not found",
      feedWeLookedAt: feed.platform,
      postsInLast28Days: stats.postsLast28Days,
      recentPosts: last9.map((p) => ({
        date: longDate(p.date),
        daysAgo: since(p),
        type: p.type ? TYPE_LABEL[p.type] : "unknown",
        topic: p.caption.replace(/\s+/g, " ").slice(0, 160),
        likesAndComments: p.likes + p.comments,
        ...(p.type === "flyer" && p.hasClearNextStep !== null ? { flyerHasClearNextStep: p.hasClearNextStep } : {}),
      })),
    };

    // The core four against their last 9 posts.
    if (last9.length >= 4) {
      const n = (...t: PostType[]) => last9.filter((p) => p.type && t.includes(p.type)).length;
      const oldest = last9[last9.length - 1];
      coreFour = {
        standard: CORE_FOUR_STANDARD,
        theirPosts: {
          lastPostsCounted: last9.length,
          backTo: longDate(oldest.date),
          weeksCovered: Math.max(1, Math.round(since(oldest) / 7)),
          homilyClipsOrTeachingVideos: n("homily_clip", "value_video"),
          connectionPosts: n("connection"),
          socialProofPosts: n("activity"),
          flyers: n("flyer"),
          other: last9.length - n("homily_clip", "value_video", "connection", "activity", "flyer"),
        },
      };
    }

    // Rulebook checks we can see on their pages.
    const flyers9 = last9.filter((p) => p.type === "flyer").length;
    if (last9.length >= 4) observations.push(`Of the last ${last9.length} posts, ${flyers9} were flyers or announcements.`);
    const giving = stats.lastGivingVideo;
    const givingDays = giving ? Math.round((nowMs - Date.parse(giving)) / DAY) : null;
    if (giving && givingDays !== null && givingDays > 21) {
      observations.push(`The most recent homily clip or teaching video we found was on ${longDate(giving)}.`);
      if (a.homilyClips === "regularly")
        observations.push("They told us homily clips go up every week, but none have been posted in the last 3 weeks. Mention this gently, if at all.");
    } else if (!giving && sorted.length >= 6) {
      observations.push(`None of the last ${sorted.length} posts (back to ${longDate(sorted[sorted.length - 1].date)}) were homily clips or teaching videos.`);
    } else if (giving && givingDays !== null && givingDays <= 21) {
      observations.push(`They posted a homily clip or teaching video on ${longDate(giving)}. That's good.`);
    }
    if (sorted.length >= 6 && since(sorted[sorted.length - 1]) >= 30) {
      if (in30("activity") === 0) {
        observations.push("No photos from parish life in the last 30 days.");
        needs.push("noActivity");
      }
      if (in30("connection") === 0) {
        observations.push("No story posts about the pastor, staff, or parish in the last 30 days.");
        needs.push("noConnection");
      }
    }
    const top = Object.entries(stats.counts).sort((x, y) => y[1] - x[1])[0];
    if (top && top[0] === "filler" && top[1] > 0)
      observations.push("Filler (livestreams, quotes, generic graphics) is the most common kind of post.");
    // Counted over the same last 9 posts as the core four, so the letter
    // can't say "0 flyers" and "2 flyers without a next step" side by side.
    const noCta = last9.filter((p) => p.type === "flyer" && p.hasClearNextStep === false).length;
    if (noCta > 0) needs.splice(problemCount, 0, "flyerCta");
    if (noCta > 0)
      smallerThings.push(
        `${noCta} of the last ${last9.length} posts ${noCta === 1 ? "is a flyer that doesn't" : "are flyers that don't"} tell people exactly how to respond (no link, sign-up, or number).`,
      );
    if (profile.facebook && !profile.instagram) smallerThings.push("We couldn't find an Instagram account for the parish.");

    // Facebook engagement rate: proof for the nurture or posting problem.
    // When neither is in the letter and few people respond, it becomes the
    // next problem itself (right after outreach).
    const eng = facebookEngagement(profile);
    if (eng) {
      const weak = eng.band === "low" || eng.band === "underperforming";
      const host = problems.find((p) => p.id === "nurture" || p.id === "frequency");
      engagement = { ...eng, provesProblem: weak && host ? host.id : null };
      if (weak && !host) {
        const at = problems[0]?.id === "outreach" || problems[0]?.id === "leak" ? 1 : 0;
        problems.splice(at, 0, {
          id: "quietFeed",
          title: "Few of the people following the Facebook page respond to what's posted",
          whatWeSaw: [eng.plainLine],
          firstStep: "Post the core four every week, and make the homily clip the strongest post of the week.",
        });
        engagement.provesProblem = "quietFeed";
        needs.splice(at, 0, "coreFour");
      }
    }
    const best = [...sorted].sort((x, y) => y.likes + y.comments - (x.likes + x.comments))[0];
    if (best && best.likes + best.comments > 0)
      observations.push(
        `Best-received recent post: ${best.type ? TYPE_LABEL[best.type] : "a post"} on ${longDate(best.date)} with ${best.likes + best.comments} likes and comments ("${best.caption.replace(/\s+/g, " ").slice(0, 80)}").`,
      );

    // Ad Library rule: only mention it when it agrees with the quiz.
    const quizNoAds = a.ads === "none" || a.ads === "boosted";
    const adsAgree = quizNoAds && profile.facebook?.runningAds === false;
    if (adsAgree) observations.push("We checked Meta's Ad Library and didn't find any ads running for the parish.");

    evidence = {
      posts: last9.map((p) => ({
        d: shortDate(p.date),
        p: p.platform === "facebook" ? "fb" : "ig",
        t: p.type,
        r: p.likes + p.comments,
        v: p.isVideo,
      })),
      web: profile.pages.website?.url ? profile.pages.website.url.replace(/^https?:\/\//, "").replace(/\/$/, "") : null,
      fb: profile.facebook ? profile.facebook.followers : false,
      ig: profile.instagram ? profile.instagram.followers : false,
      ads: adsAgree ? "none" : null,
    };
  }

  const churchDates = upcomingChurchDates(now);

  return {
    facts: {
      reader: {
        role: lead.role,
        isPastor,
        refersToPastorAs: isPastor ? "you" : "your pastor (the reader is parish staff, not the pastor)",
      },
      parish: doc.parish === "Your parish" ? null : doc.parish,
      city: `${a.city}, ${a.state}`,
      cityPopulation: doc.report.population,
      outreach: {
        runningOngoingAds: o.hasAds,
        hasPlanAVisitStep: o.hasPlanStep,
        followsUpWithin2Days: o.fastFollow,
        tracksInquiries: o.tracked,
      },
      diagnosis: `${doc.diagnosis.lead} ${doc.diagnosis.body}`,
      problemsInOrder: problems.slice(0, 2),
      smallerThings: [...problems.slice(2).map((p) => p.title), ...smallerThings].slice(0, 2),
      facebookEngagement: engagement,
      coreFour,
      strengths: doc.strengths,
      quizAnswers: quiz,
      weLookedUpTheirPages: confirmed,
      pagesWeLookedAt: confirmed && profile
        ? [
            ...(profile.pages.website?.url ? ["website"] : []),
            ...(profile.facebook ? ["Facebook page"] : []),
            ...(profile.instagram ? ["Instagram"] : []),
          ]
        : [],
      pages,
      observationsFromTheirPages: observations,
      upcomingChurchDates: churchDates.map((c) => `${c.name}: ${c.date} (${c.daysAway} days away)`),
      approvedProof: PROOF_FOR,
    },
    evidence,
    needs,
  };
}

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------

const SYSTEM = `You write the middle of a short personal letter from Joe Jarrell, founder of Parish Media Company, to a Catholic parish that just took the Parish Social Media Scorecard. Joe helps parishes reach new families with homily clips, good posts, and Facebook/Instagram ads that invite people to Mass.

The reader is usually the pastor: busy, not technical, careful with parish money, and moved by honesty and trust, not marketing. The letter must read like Joe sat down and wrote it to THIS parish, not like a generated report. Every parish should get a noticeably different letter: use their own posts, dates, numbers, city, and answers.

WHAT YOU WRITE
- "body": 5 to 8 short paragraphs, 300 to 450 words in all. Stay under 450: keep each paragraph to 2 to 4 sentences, give the biggest problem the most room, and keep the core four and smaller-things paragraphs to 2 or 3 sentences each. Don't repeat a point you already made. They go after the greeting ("Hi Father,") and before a fixed closing that Joe already wrote (it offers free tutorials, says most teams can't keep this going, offers two choices, and invites them to book a free call). Do not write a greeting, a sign-off, a closing, a call to book, or a P.S.
- "cover_line": the single biggest thing holding the parish back, in under 15 plain words, lowercase start, no period. Example: "nothing is regularly inviting new families to Mass"

BODY STRUCTURE (in this order). The letter is mostly a diagnosis: where the parish stands and why. Advice waits for the last paragraph.
1. The introduction (one paragraph, 3 to 4 sentences). Thank them for taking the Parish Social Media Scorecard. Then tell them plainly what this letter is and how we put it together:
   - If weLookedUpTheirPages is true: we read through their answers, and we also went ahead and looked up the parish's own pages (name exactly the ones in pagesWeLookedAt, e.g. "your website, Facebook page, and Instagram") and went through their recent posts. Say this in plain words like "looked up" or "went through"; never "scraped", "analyzed", "audited", or "data".
   - If it is false: we read through their answers. Don't mention looking up their pages at all (not even that we didn't), and never imply we saw their pages, website, posts, or the Ad Library; work only from their answers ("you mentioned", "from your answers"). Never say you went only by their answers or didn't look anywhere else ("only from what you told us", "not from anything outside your answers"); just say you read through their answers.
   - End the intro simply, the way Joe would in an email, e.g. "Here's what I found." or "Here's where I think things stand." Don't describe the letter's structure.
   Don't guess at how the reader feels or how hard they're working, and don't add a line about how or why you're writing the letter ("I'm writing this as plainly as I can", "from one Catholic to another", "with your pastor in mind").
2. What's working (one short paragraph): one or two specific good things (from strengths, or their best-received post, with its date and numbers, or facebookEngagement when its band is "strong").
3. The biggest problem (one or two paragraphs): problemsInOrder[0], exactly as the diagnosis states it. Our rules already decided it; don't swap in a different problem, even if another one looks bigger to you. Say it in your own words (don't paste the title). Show what we saw, with their own specifics (their posts, dates, counts, or answers). Then explain why it matters in plain words, tied to the parish's goals (new families, Mass attendance, young people, vocations). Add one approved proof point that fits.
4. The next problem (one paragraph): problemsInOrder[1] if there is one. Same approach: what we saw, then why it matters.
5. The core four (one short paragraph), unless a "nurture" problem is in problemsInOrder: then explain the core four inside that problem's paragraph instead and skip this one. Name the weekly standard from coreFour.standard (one homily clip, one connection post, one social proof post, one flyer), why it works (the first three give, so people like, know, and trust the parish; then they say yes to the flyer, and that's what moves them from the screen into the pews), and how their posts compare, using coreFour.theirPosts (counts and the date they go back to) or, if that's text, their answers. Diagnose only; don't tell them what to do yet. If their posts already match the standard, say so in a sentence or two and move on.
6. A couple of smaller things (optional, one or two sentences in all): the items in smallerThings, mentioned briefly so they know we saw them. It can be its own short paragraph or the end of paragraph 4. Don't explain them at length.
7. What I'd do (the LAST paragraph, and the only place for advice): start with "Here's what I'd do" or similar, then give the specific steps in the order you'd take them, as flowing sentences (no list). Concrete and small: who does what, how often. Posting advice is always the core four each week. You may tie timing to an upcomingChurchDates entry (e.g. having it running before Christmas), but never claim anything about attendance at those times.
Paragraphs 1 to 6 diagnose only: no "I'd recommend", "you should", or "start by" before the last paragraph.
If problemsInOrder is empty, the parish is doing well: diagnose what's working and why, still include the core four paragraph, and in the last paragraph suggest one way to go further (talking-head reels from the pastor, or adding YouTube Shorts), never as a problem.

HOW MANY PEOPLE RESPOND ON FACEBOOK (facebookEngagement, when present)
- It compares a typical post's likes and comments with how many people follow the Facebook page. Use the numbers in plainLine (you may reword it, keep the numbers exact). Never say "engagement", "engagement rate", or a percentage; say it in people, like "fewer than 1 in 100 people who follow the page like or comment on a typical post."
- Follow its "meaning". When provesProblem names a problem, use it as the hard proof inside that problem's paragraph: it's the result of the posts not nurturing people, too few posts, or both. Never call the page dead. The one idea to get across (in one or two plain sentences): when few people respond to a post, Facebook shows it to fewer people, so most of the people who follow the page, parishioners included, never even see it. Don't add vague lines like "likes don't tell the whole story".
- When band is "fine", leave it out or mention it lightly. Only Facebook: never apply it to Instagram.

THE PLAIN "WHY" FOR EACH PROBLEM (Joe's ideas; use the idea, in your own words, never the label)
- No ads / no Plan a Visit step: posts mostly reach people already in the pews. Ads put a clear invitation in front of families nearby who aren't coming yet. An outreach system is three parts: an ad inviting families nearby, a simple form inside Facebook or Instagram (name and phone number, so saying yes takes seconds), and a personal call the same day.
- Slow follow-up (a "leak"): people are most ready right after they raise their hand. A call the same day feels like a welcome; a call a week later feels like an afterthought.
- Posts that don't nurture people (the "nurture" problem: no weekly homily clip, a feed of mostly flyers, or random posts): posts have one job, to build enough goodwill that people say yes when the parish asks. Each homily clip gives people something for free; that's the biggest part of it. Ask too often without giving and people tune you out, like a second collection basket. Fix: the core four every week. Film every Sunday homily, even on a phone, and post one 30 to 60 second clip a week.
- Too few posts (the "frequency" problem): a post or two a week isn't enough to stay on people's minds. Fix: at least four a week, one of each of the core four.
- Few followers responding (the "quietFeed" problem): when few people respond to a post, Facebook shows it to fewer people, so most followers, parishioners included, never see it. Posts that give people something (homily clips, stories, photos of parish life) are the ones people respond to. Fix: the core four every week.
- No photos from parish life (social proof): when people see others at parish events, they think "people like me go to this."
- No story posts: people do things for people they know. Stories about Father and the staff turn the parish from an institution into people.
- Flyers without a clear next step: if people have to figure out what to do next, most won't do anything. One clear action per flyer.
- Filler: livestreams and saint quotes rarely get seen. Each post should give something or ask for something.

VOICE (Joe's own emails)
- Short, warm, plain, practical. Sentences of 10 to 20 words, written the way he'd talk on a call. Contractions everywhere.
- Speak as "I" for recommendations ("I'd recommend", "My guess is", "I think") and "we" for what Parish Media Company saw or does.
- Honest and direct about the problem, but kind. Praise first, then the fix. Never criticize their staff, volunteers, or current vendor.
- Low pressure. No urgency or scarcity. No selling; the fixed closing handles the offer.
- Faith language light and natural; no preaching.
- If the reader isn't the pastor, refer to the pastor as "your pastor" or "Father", not "you".
- Explain any platform term in one clause the first time.

SOUND LIKE JOE, NOT AI (this matters a lot)
- Write like Joe typing a thoughtful email to a priest he respects: casual, warm, a little informal, like talking across a table after Mass. When in doubt, more casual and human, not more polished.
- Mix sentence lengths. Short ones are good. Fine to start a sentence with "And" or "But", or use plain asides like "Honestly," "To be fair," "My guess is," "I'll be straight with you."
- Use ordinary words a parish priest would use. Say "people" not "audience", "posts" not "content", "the page" not "the platform".
- Avoid the usual AI tells: "not just X, but Y", "it's not X, it's Y", "that tells me", "what follows", "honest picture", "real life", "strong base", "the good news is", "here's the thing", "in today's world", "at the end of the day"; groups of three adjectives; a colon in every paragraph; every paragraph starting the same way; summing up what you just said.
- Never use: navigate, foster, resonate, meaningful, intentional, seamless, impactful, tapestry, truly, deeply, vibrant, thrive.

EMPHASIS (the letter should be easy to skim, like a real letter someone marked up)
- Bold (**like this**) up to 3 short phrases in the whole letter, each under 12 words: the core of the biggest problem, the core of the next problem, and the single most important step in the advice paragraph. Bold a phrase inside a sentence, never a whole paragraph.
- Italics (*like this*) up to 2 times, for a post's topic or a short quote of their own words.
- Nothing else: no headings, underlines, or lists.

HARD RULES
- Facts: use only what is in the JSON. Every number you write must appear in it exactly. Write numbers above ten as digits, with commas from 1,000 up; "one" through "ten" may be words. Never invent, round, combine, or estimate numbers.
- Never compare the parish to other parishes ("better than most", "most parishes", "the average parish"). The only outside results allowed are the approvedProof entries.
- Proof: only from approvedProof, at most two in the whole letter, quoted accurately.
- Never mention the score, points, categories, the quiz itself, "the report", or AI.
- Ad Library: mention it only if an observation says we checked it.
- Refer to posts by date and what they were about; never quote more than 6 words of a caption.
- No headings, bullet points, lists, emoji, or em dashes. Bold and italics only as described above, and never in cover_line. At most one exclamation point in the whole letter.
- Never use these words: leverage, optimize, engagement, funnel, algorithm, content strategy, brand, synergy, game-changer, unlock, elevate, journey, landscape, robust, crucial, delve.`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    body: { type: "array", items: { type: "string" } },
    cover_line: { type: "string" },
  },
  required: ["body", "cover_line"],
};

export const LETTER_MODEL = "gpt-5.5";

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

const NUMBER_WORDS: Record<string, string> = {
  two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9", ten: "10", eleven: "11", twelve: "12",
};
// Digits, plus "two" through "twelve" ("one" is too common to check).
const numbersIn = (s: string) => [
  ...(s.match(/\d[\d,]*(?:\.\d+)?/g) ?? []).map((n) => n.replace(/,/g, "").replace(/\.0+$/, "")),
  ...(s.toLowerCase().match(/\b(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/g) ?? []).map((w) => NUMBER_WORDS[w]),
];
// Small numbers the fixed advice itself uses ("two choices", "3 to 4 posts a week", "30 to 60 seconds").
const ALWAYS_ALLOWED = ["1", "2", "3", "4", "30", "60"];

const BANNED_WORDS =
  /\b(leverage|optimi[sz]e|engagement|funnel|algorithm|content strategy|brand|synergy|game.?changer|unlock|elevate|journey|landscape|robust|crucial|delve|dear)\b/i;
const LOOKUP_CLAIMS = /\b(look(ed)? (up|at|through)|we (checked|saw|found|noticed|pulled)|ad library|your (feed|page|posts|website|instagram|facebook) (shows|has))\b/i;

export function checkLetter(
  out: { body: string[]; cover_line: string },
  facts: LetterFacts["facts"],
): string[] {
  const problems: string[] = [];
  const text = [...out.body, out.cover_line].join("\n");
  const words = out.body.join(" ").split(/\s+/).filter(Boolean).length;
  if (out.body.length < 4 || out.body.length > 9) problems.push(`Use 5 to 8 paragraphs (you wrote ${out.body.length}).`);
  if (words < 260 || words > 560) problems.push(`The body should be 300 to 450 words (you wrote ${words}).`);
  // Percentages only where an approved proof point uses them (e.g. "3% to 30%").
  const proofPct = new Set(JSON.stringify(facts.approvedProof).match(/\d+(?:\.\d+)?%/g) ?? []);
  const pct = (out.body.join(" ").match(/\d+(?:\.\d+)?\s?%/g) ?? []).map((x) => x.replace(/\s/g, ""));
  if (pct.some((x) => !proofPct.has(x)) || /\bper ?cent\b/i.test(out.body.join(" ")))
    problems.push("Don't use percentages; say it in people (e.g. fewer than 1 in 100 followers).");
  if (/whole story|likes (alone|by themselves)/i.test(text)) problems.push("Skip vague lines like 'likes don't tell the whole story'. Say plainly that Facebook shows low-response posts to fewer people, so most followers never see them.");
  if (/\bdead\b/i.test(text)) problems.push('Never call the page "dead".');
  const early = out.body.slice(0, -1).join(" ");
  const advice = early.match(/\b(I['’]d recommend|you should|I['’]d start|start by|my advice)\b/i);
  if (advice) problems.push(`Keep advice to the last paragraph only ("${advice[0]}" appears earlier). The earlier paragraphs diagnose.`);
  if (/\b(scrap(e|ed|ing)|analy[sz]\w*|audit\w*|data)\b/i.test(text)) problems.push('Say "looked up" or "went through", never scraped, analyzed, audited, or data.');
  if (!out.cover_line.trim()) problems.push("cover_line is required.");

  const allowed = new Set([...ALWAYS_ALLOWED, ...numbersIn(JSON.stringify(facts))]);
  const bad = [...new Set(numbersIn(text))].filter((n) => !allowed.has(n));
  if (bad.length) problems.push(`These numbers aren't in the facts: ${bad.join(", ")}. Use only numbers from the JSON.`);

  const banned = text.match(BANNED_WORDS);
  if (banned) problems.push(`Don't use the word "${banned[0]}".`);
  if (/—|–\s/.test(text)) problems.push("No em dashes.");
  if ((text.match(/!/g) ?? []).length > 1) problems.push("At most one exclamation point.");
  if (/\p{Extended_Pictographic}/u.test(text)) problems.push("No emoji.");
  const bodyText = out.body.join("\n");
  if (/^\s*([-*•#]|\d+[.)])\s/m.test(bodyText)) problems.push("No bullets or headings.");
  if (/\*/.test(out.cover_line)) problems.push("No bold or italics in cover_line.");
  const bolds = bodyText.match(/\*\*[^*]+\*\*/g) ?? [];
  const italics = bodyText.replace(/\*\*[^*]+\*\*/g, "").match(/\*[^*]+\*/g) ?? [];
  if (bolds.length > 3 || bolds.some((b) => b.split(/\s+/).length > 12)) problems.push("Bold at most 3 short phrases (under 12 words each).");
  if (italics.length > 2) problems.push("Italics at most 2 times.");
  if ((bodyText.replace(/\*\*[^*]+\*\*/g, "").replace(/\*[^*]+\*/g, "").match(/\*/g) ?? []).length) problems.push("Unmatched * marks.");
  const tell = text.match(
    /\b(not just|isn['’]t just|that tells me|what follows|honest picture|real life|strong base|the good news is|here['’]s the thing|in today['’]s world|at the end of the day|navigate|foster|resonate|meaningful|intentional|seamless|impactful|tapestry|truly|deeply|vibrant|thrive)\b/i,
  );
  if (tell) problems.push(`"${tell[0]}" sounds like AI. Say it the way Joe would.`);
  if (/\b(better than most|(many|most|other) (parishes|pastors)|the average parish|typical parish)\b/i.test(text))
    problems.push("Don't compare the parish to other parishes.");
  if (/\b(score|scored|out of 100|scorecard results|the report)\b/i.test(out.body.join(" ")))
    problems.push("Don't mention the score or the report in the body.");
  if (/\b(hi|hello) (father|fr\.)|god bless|book a (free )?(call|time|assessment)/i.test(out.body.join(" ")))
    problems.push("Don't write a greeting, sign-off, or booking invitation; those are added for you.");
  if (/\b(only|just) (from|on|by) (what you|your answers)|\b(anything|nothing) outside|\bbased on what you (told|shared)[^.]*, not\b/i.test(text))
    problems.push("Don't say you went only by their answers or didn't look elsewhere. Just say you read through their answers.");
  if (!facts.weLookedUpTheirPages && LOOKUP_CLAIMS.test(text))
    problems.push("We did not look up their pages. Don't say or imply that we looked at their pages, posts, website, or the Ad Library.");
  return problems;
}

// ---------------------------------------------------------------------------
// Writing
// ---------------------------------------------------------------------------

async function callOpenAI(messages: { role: string; content: string }[], key: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: LETTER_MODEL,
      reasoning_effort: "low",
      messages,
      response_format: { type: "json_schema", json_schema: { name: "scorecard_letter", strict: true, schema: SCHEMA } },
    }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const j = (await res.json()) as { choices: { message: { content: string } }[] };
  return JSON.parse(j.choices[0].message.content) as { body: string[]; cover_line: string };
}

const tidyText = (s: string) => s.replace(/\s+/g, " ").replace(/'/g, "’").trim();

export async function writeScorecardLetter(
  doc: ScorecardDoc,
  a: ScorecardAnswers,
  profile: ParishProfile | null,
  lead: { role: string },
  key = process.env.OPENAI_API_KEY,
  now = new Date(),
  // Renders the letter and returns how many pages it takes (not counting the
  // "What we found" page). The letter must fit on 2.
  letterPages?: (l: ScorecardLetter) => Promise<number>,
): Promise<ScorecardLetter> {
  const { facts, evidence, needs } = buildLetterFacts(doc, a, profile, lead, now);
  const res = pickResources(needs);
  if (key) {
    const messages = [
      { role: "system", content: SYSTEM },
      { role: "user", content: `Facts for this parish (JSON):\n${JSON.stringify(facts, null, 1)}` },
    ];
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const out = await callOpenAI(messages, key);
        let issues = checkLetter(out, facts);
        if (!issues.length) {
          const letter: ScorecardLetter = {
            v: 1,
            src: "ai",
            body: out.body.map(tidyText).filter(Boolean),
            cover: tidyText(out.cover_line).replace(/\.$/, ""),
            res,
            ev: evidence,
          };
          const pages = letterPages ? await letterPages(letter).catch(() => 2) : 2;
          if (pages <= 2) return letter;
          const words = letter.body.join(" ").split(/\s+/).length;
          issues = [
            `The letter runs onto a third page. Cut at least 100 words, to about ${Math.max(300, words - 110)} (you wrote ${words}): shorten the smaller paragraphs and drop anything repeated, but keep every section.`,
          ];
        }
        console.warn("Scorecard letter failed checks:", issues);
        messages.push(
          { role: "assistant", content: JSON.stringify(out) },
          { role: "user", content: `Please fix these and send the whole letter again:\n- ${issues.join("\n- ")}` },
        );
      } catch (err) {
        console.error("Scorecard letter writing failed:", err);
        break;
      }
    }
  }
  const eng = facts.facebookEngagement;
  const weak = eng && (eng.band === "low" || eng.band === "underperforming");
  return templateLetter(doc, facts.weLookedUpTheirPages, res, evidence, weak ? eng.plainLine : undefined);
}

// ---------------------------------------------------------------------------
// Template letter (no API key, the AI failed, or an old report link)
// ---------------------------------------------------------------------------

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export function templateLetter(
  doc: ScorecardDoc,
  lookedUp = false,
  res = pickResources(doc.problems.map((p) => (p.id === "nurture" ? "homily" : p.id === "frequency" ? "infrequent" : p.id))),
  evidence?: LetterEvidence,
  engagementLine?: string, // Facebook followers vs. responses, when few respond
): ScorecardLetter {
  const [first, second] = doc.problems;
  // The rules' "why" text ends by introducing a list ("The core four, every week:"); the template states it in a sentence instead.
  const why = (p: ReportProblem) => (p.why[0] ?? "").replace(/\s*[^.]*:\s*$/, "");
  const body = [
    lookedUp
      ? "Thanks for taking the Parish Social Media Scorecard. I went through your answers, and we also went ahead and looked up the parish’s pages and recent posts. Here’s what I found."
      : "Thanks for taking the Parish Social Media Scorecard. I went through your answers, and here’s where I think things stand.",
  ];
  if (doc.strengths[0]) body.push(`The good news first: ${lowerFirst(doc.strengths[0])}`);
  if (first) {
    body.push(`${doc.diagnosis.lead} ${first.saw.join(" ")} ${why(first)}`.trim());
    if (first.proof) body.push(first.proof);
  } else {
    body.push(doc.diagnosis.body);
  }
  body.push(
    `${engagementLine ? `${engagementLine} When few people respond to a post, Facebook shows it to fewer people, so most of the people following the page, parishioners included, never see it. ` : ""}The standard I give every parish is the core four, every week: one homily clip, one connection post (a story about the pastor, the staff, or the parish), one social proof post (photos of parish life), and one flyer. The first three give people a reason to like, know, and trust the parish, so when the flyer asks, they say yes. That’s what moves people from the screen into the pews.`,
  );
  if (first) {
    body.push(`I’d recommend starting here. ${first.firstStep}`);
    if (second) body.push(`After that, I’d look at one more thing: ${lowerFirst(second.title)}. ${second.firstStep}`);
  }
  return {
    v: 1,
    src: "template",
    body,
    cover: first ? lowerFirst(first.title) : "keeping what’s working and building on it",
    res,
    ev: evidence,
  };
}
