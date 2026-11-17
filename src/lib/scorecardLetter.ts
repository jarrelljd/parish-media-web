// The scorecard letter: a personal, signed letter from Joe, written fresh for
// each parish by OpenAI from (1) the problems the rules picked, (2) the quiz
// answers, and (3) what the parish lookup found on their pages.
//
// Sources Joe approved (both Claude Docs, 2026-11-08):
//   - Scorecard Letter Voice Guide: greeting, structure, tone, fixed closing.
//   - Scorecard Diagnosis Rulebook: what counts as a problem, the plain
//     "why it matters" lines, approved proof, the Ad Library rule.
//
// Layout (Joe, 2026-11-16): intro, the top 1–3 problems as numbered key
// findings (each: the evidence, then why it matters), the booking CTA,
// what's working, the single highest-priority next step, and ONE simple
// thing they can do this week. The findings aren't repeated in a second
// detailed pass (Joe found that repetitive). No video or resource links.
//
// What stays in code (never written by the AI): which problems the letter
// covers and their order, the finding titles, the one action for this week,
// the greeting, the CTA, the fixed closing, the signature, and the score in
// the Re: line. The AI writes the intro, the findings, what's working, the
// next step, and one line for the cover email.
//
// Every number the AI writes must appear in the facts we gave it; otherwise
// we ask again, then fall back to a plain template letter built from the
// same facts. The letter is written once, at opt-in, and travels inside the
// signed PDF link (scorecardLink.ts), so the PDF never changes.

import { proof } from "@/data/scorecard";
import { upcomingChurchDates } from "@/lib/churchCalendar";
import { mainFeed, profileStats, type ParishProfile, type PostType, type ProfilePost } from "@/lib/parishProfile";
import { choiceLabel, outreachStatus, type ScorecardAnswers } from "@/lib/scorecard";
import type { ScorecardDoc } from "@/lib/scorecardReport";

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

export type LetterFinding = {
  t: string; // title, from the rules
  s: string; // two sentences: the key evidence, then why it matters
};

export type ScorecardLetter = {
  v: 2;
  src: "ai" | "template";
  intro: string;
  findings: LetterFinding[]; // 0–3, in the rules' order
  working: string; // what's working, 1–2 sentences
  next: string; // the single highest-priority next step
  now: string; // one simple action they can take this week
  cover: string; // the biggest problem in plain words, for the cover email
  ev?: LetterEvidence;
};

// Letters written before 2026-11-16 (flowing paragraphs + video links).
// Old report links still render them, minus the video list.
export type LegacyLetter = {
  v: 1;
  src: "ai" | "template";
  body: string[];
  cover: string;
  res?: unknown;
  ev?: LetterEvidence;
};

export type AnyLetter = ScorecardLetter | LegacyLetter;

// ---------------------------------------------------------------------------
// Greeting, CTA, closing, this week's action
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

// Linked words in the closing (no printed web address; Joe, 2026-11-16).
export const BOOKING_LINK_TEXT = "pick a time here";

// The CTA right after the key findings (Joe's copy, 2026-11-16).
export const FINDINGS_CTA = {
  lead: "Want help deciding what to fix first?",
  link: "Book a free Parish Growth Review",
  rest: "and we’ll walk through your scorecard, identify the highest-priority opportunity, and map the next 90 days for your parish.",
};

// The one simple thing they can do this week, from the top problem. Free,
// no new skills, done by someone already at the parish. Written in code so
// the letter never gives more than one.
export function quickAction(id: string | undefined, homilyClipsWeekly: boolean): string {
  switch (id) {
    case "outreach":
      return "Pick one person on staff who will call back every new inquiry the same day, and make sure the office knows it’s them.";
    case "leak":
      return "Starting this week, call back every new inquiry the same day, and write each one on a simple list so you can count them.";
    case "nurture":
    case "quietFeed":
      return homilyClipsWeekly
        ? "Before the next flyer goes up, post one photo from parish life with a short caption naming who’s in it."
        : "This Sunday, set a phone on a tripod or a steady stand and film the homily. Just get the recording; the clips can come later.";
    case "frequency":
      return "Pick one day this week to post a photo from parish life with a two-line caption.";
    default:
      return "This Sunday, film the homily on a phone and post your favorite 30 to 60 seconds of it.";
  }
}

// The fixed closing from the voice guide, after the advice. Only the parish
// changes.
export function fixedClosing(parish: string, isPastor: boolean): string[] {
  // Short, since the booking CTA already sits right after the key findings.
  return [
    "You can absolutely fix all of this in-house. But let’s be honest: it takes a handful of skills (editing video, running targeted ads, tracking who responds, and fast follow-up), and most parish teams are already busy serving the parish. So you have two choices: keep going as you are, or have someone build and run it for you.",
    `If it’s the second, that’s exactly what we do. A free Parish Growth Review is the first step: we’ll go over this letter together, pick the highest-priority opportunity, and map out the next 90 days for ${parish}. It’s yours to keep whether we work together or not.${
      isPastor ? "" : " We do ask that your pastor join the call."
    } You can ${BOOKING_LINK_TEXT}.`,
  ];
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

export type LetterProblem = { id: string; title: string; whatWeSaw: string[]; firstStep: string };
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

  // The problems the rules picked, in the order the letter must use (up to 3).
  const problems: LetterProblem[] = doc.problems.map((p) => ({
    id: p.id,
    title: p.title,
    whatWeSaw: p.saw,
    firstStep: p.firstStep,
  }));

  let pages: Record<string, unknown> | null = null;
  const observations: string[] = [];
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

    // Rulebook checks we can see on their pages (evidence for the problems).
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
      if (in30("activity") === 0) observations.push("No photos from parish life in the last 30 days.");
      if (in30("connection") === 0) observations.push("No story posts about the pastor, staff, or parish in the last 30 days.");
    }
    const top = Object.entries(stats.counts).sort((x, y) => y[1] - x[1])[0];
    if (top && top[0] === "filler" && top[1] > 0)
      observations.push("Filler (livestreams, quotes, generic graphics) is the most common kind of post.");
    // Counted over the same last 9 posts as the core four, so the letter
    // can't say "0 flyers" and "2 flyers without a next step" side by side.
    const noCta = last9.filter((p) => p.type === "flyer" && p.hasClearNextStep === false).length;
    if (noCta > 0)
      observations.push(
        `${noCta} of the last ${last9.length} posts ${noCta === 1 ? "is a flyer that doesn't" : "are flyers that don't"} tell people exactly how to respond (no link, sign-up, or number).`,
      );

    // Facebook engagement rate: proof for the nurture or posting problem.
    // When neither is in the letter and few people respond, it becomes a
    // problem itself (right after outreach).
    const eng = facebookEngagement(profile);
    if (eng) {
      const weak = eng.band === "low" || eng.band === "underperforming";
      const host = problems.find((p) => p.id === "nurture" || p.id === "frequency");
      engagement = { ...eng, provesProblem: weak && host ? host.id : null };
      if (weak && !host) {
        const at = problems[0]?.id === "outreach" || problems[0]?.id === "leak" ? 1 : 0;
        problems.splice(at, 0, {
          id: "quietFeed",
          title: "Few of the people following the Facebook page respond to what’s posted",
          whatWeSaw: [eng.plainLine],
          firstStep: "Post the core four every week, and make the homily clip the strongest post of the week.",
        });
        engagement.provesProblem = "quietFeed";
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

  const top3 = problems.slice(0, 3);
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
      problemsInOrder: top3,
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
    problems: top3,
    evidence,
  };
}

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------

const SYSTEM = `You write parts of a short personal letter from Joe Jarrell, founder of Parish Media Company, to a Catholic parish that just took the Parish Social Media Scorecard. Joe helps parishes reach new families with homily clips, good posts, and Facebook/Instagram ads that invite people to Mass.

The reader is usually the pastor: busy, not technical, careful with parish money, and moved by honesty and trust, not marketing. The letter must read like Joe sat down and wrote it to THIS parish, not like a generated report. Every parish should get a noticeably different letter: use their own posts, dates, numbers, city, and answers.

HOW THE LETTER IS LAID OUT (code assembles it; you write only the pieces marked YOU)
1. Greeting ("Hi Father,"). Code.
2. YOU "intro": exactly 3 sentences.
3. Key findings, a numbered list. Code prints each problem's title in bold; YOU write "findings[i].summary" right after it. This is the only place the problems are covered, so it must carry both the evidence and why it matters.
4. A booking invitation. Code.
5. "What's working": YOU write "working".
6. "The first thing I'd fix": YOU write "next_step".
7. "One thing you can do this week": code (one simple action, already written; don't repeat it or add another).
8. A fixed closing and sign-off. Code. It talks about doing it yourself vs. having help and invites them to a free call.
Don't write a greeting, a sign-off, a closing, a call to book, or a P.S.

WHAT YOU WRITE
- "intro" (exactly 3 sentences, nothing else). Thank them for taking the Parish Social Media Scorecard. Then say plainly what we did:
   - If weLookedUpTheirPages is true: we read through their answers, and we also went ahead and looked up the parish's own pages (name exactly the ones in pagesWeLookedAt, e.g. "your website, Facebook page, and Instagram") and went through their recent posts. Say this in plain words like "looked up" or "went through"; never "scraped", "analyzed", "audited", or "data".
   - If it is false: we read through their answers. Don't mention looking up their pages at all (not even that we didn't), and never imply we saw their pages, website, posts, or the Ad Library. Never say you went only by their answers or didn't look anywhere else.
   - End with a short line that leads into the numbered findings, e.g. "Here's what I found, starting with what matters most." or "Here are the ${"{n}"} things I'd focus on." (use the real count in words). If problemsInOrder is empty: "Here's what I found."
   Don't guess at how the reader feels or how hard they're working.
- "findings": exactly one entry per item in problemsInOrder, same order. Our rules already decided the problems and their order; don't swap, merge, add, or drop any.
   - "summary": exactly 2 sentences, 25 to 50 words in all. Sentence 1, the evidence: what we saw, with their own specifics (a count, date, or answer from their posts, observationsFromTheirPages, facebookEngagement when it proves this problem, or quizAnswers). Sentence 2, why it matters, in plain words using the ideas below, tied to reaching families nearby, Mass attendance, young people, or vocations. Don't restate the title word for word. No advice.
   - For a "nurture" finding, the evidence should compare their posts to the core four where you can (e.g. "Of your last 9 posts, 6 were flyers and only 1 was a homily clip").
- "working": 1 or 2 sentences about one or two specific good things (from strengths, their best-received post with its date and numbers, or facebookEngagement when its band is "strong"). If problemsInOrder is empty, 2 or 3 sentences.
- "next_step": the single highest-priority next step, which fixes problemsInOrder[0] (use its firstStep as the basis). 2 to 4 sentences, under 75 words: what it is, who does it, and what it looks like when it's working. One step, not a plan or a list of steps. If the step is posting the core four, name the four in one sentence (one homily clip, one connection post, one social proof post, one flyer). You may add one approved proof point that shows it working. No selling and no mention of Parish Media Company doing it (the closing handles that). You may tie timing to an upcomingChurchDates entry, but never claim anything about attendance at those times. If problemsInOrder is empty, suggest one way to go further (talking-head reels from the pastor, or adding YouTube Shorts), never as a problem.
- "cover_line": the single biggest thing holding the parish back, in under 15 plain words, lowercase start, no period. Example: "nothing is regularly inviting new families to Mass"

Advice ("I'd recommend", "you should", "start by") belongs only in next_step. The intro, findings, and working diagnose.
Total for everything you write: 150 to 300 words. Be brief; don't repeat a point you already made.

HOW MANY PEOPLE RESPOND ON FACEBOOK (facebookEngagement, when present)
- It compares a typical post's likes and comments with how many people follow the Facebook page. Use the numbers in plainLine (you may reword it, keep the numbers exact). Never say "engagement", "engagement rate", or a percentage; say it in people, like "fewer than 1 in 100 people who follow the page like or comment on a typical post."
- Follow its "meaning". When provesProblem names a problem, use it as the evidence in that finding. Never call the page dead. The one idea to get across (as that finding's "why"): when few people respond to a post, Facebook shows it to fewer people, so most of the people who follow the page, parishioners included, never even see it. Don't add vague lines like "likes don't tell the whole story".
- When band is "fine", leave it out or mention it lightly. Only Facebook: never apply it to Instagram.

THE PLAIN "WHY" FOR EACH PROBLEM (Joe's ideas; use the idea, in your own words, never the label)
- No ads / no Plan a Visit step ("outreach"): posts mostly reach people already in the pews. Ads put a clear invitation in front of families nearby who aren't coming yet. An outreach system is three parts: an ad inviting families nearby, a simple form inside Facebook or Instagram (name and phone number, so saying yes takes seconds), and a personal call the same day.
- Slow follow-up ("leak"): people are most ready right after they raise their hand. A call the same day feels like a welcome; a call a week later feels like an afterthought.
- Posts that don't nurture people ("nurture": no weekly homily clip, a feed of mostly flyers, or random posts): posts have one job, to build enough goodwill that people say yes when the parish asks. Each homily clip gives people something for free; that's the biggest part of it. Ask too often without giving and people tune you out, like a second collection basket.
- Too few posts ("frequency"): a post or two a week isn't enough to stay on people's minds.
- Few followers responding ("quietFeed"): when few people respond to a post, Facebook shows it to fewer people, so most followers, parishioners included, never see it. Posts that give people something (homily clips, stories, photos of parish life) are the ones people respond to.
- No photos from parish life (social proof): when people see others at parish events, they think "people like me go to this."
- No story posts: people do things for people they know. Stories about Father and the staff turn the parish from an institution into people.
- Flyers without a clear next step: if people have to figure out what to do next, most won't do anything.
- Filler: livestreams and saint quotes rarely get seen. Each post should give something or ask for something.

VOICE (Joe's own emails)
- Short, warm, plain, practical. Sentences of 10 to 20 words, written the way he'd talk on a call. Contractions everywhere.
- Speak as "I" for recommendations ("I'd recommend", "My guess is", "I think") and "we" for what Parish Media Company saw or does.
- Honest and direct about the problem, but kind. Never criticize their staff, volunteers, or current vendor.
- Low pressure. No urgency or scarcity. No selling.
- Faith language light and natural; no preaching.
- If the reader isn't the pastor, refer to the pastor as "your pastor" or "Father", not "you".
- Explain any platform term in one clause the first time.

SOUND LIKE JOE, NOT AI (this matters a lot)
- Write like Joe typing a thoughtful email to a priest he respects: casual, warm, a little informal. When in doubt, more casual and human, not more polished.
- Mix sentence lengths. Short ones are good. Fine to start a sentence with "And" or "But", or use plain asides like "Honestly," "To be fair," "My guess is."
- Use ordinary words a parish priest would use. Say "people" not "audience", "posts" not "content", "the page" not "the platform".
- Avoid the usual AI tells: "not just X, but Y", "it's not X, it's Y", "that tells me", "what follows", "honest picture", "real life", "strong base", "the good news is", "here's the thing", "in today's world", "at the end of the day"; groups of three adjectives; summing up what you just said.
- Never use: navigate, foster, resonate, meaningful, intentional, seamless, impactful, tapestry, truly, deeply, vibrant, thrive.

EMPHASIS
- Bold (**like this**) at most once, in next_step only: the core of the step, under 12 words. The finding titles are already bold, so no bold anywhere else.
- Italics (*like this*) up to 2 times, for a post's topic or a short quote of their own words.
- Nothing else: no headings, underlines, or lists.

HARD RULES
- Never state or guess the parish's goals, hopes, plans, or worries ("your goal of reaching families", "you're hoping to grow"). They didn't tell us. Talk about goals in general terms instead ("reaching families nearby", "filling the pews").
- Facts: use only what is in the JSON. Every number you write must appear in it exactly. Write numbers above ten as digits, with commas from 1,000 up; "one" through "ten" may be words. Never invent, round, combine, or estimate numbers.
- Never compare the parish to other parishes ("better than most", "most parishes", "the average parish"). The only outside results allowed are the approvedProof entries.
- Proof: only from approvedProof, at most two in the whole letter, quoted accurately.
- Never mention the score, points, categories, the quiz itself, "the report", or AI.
- Ad Library: mention it only if an observation says we checked it.
- Refer to posts by date and what they were about; never quote more than 6 words of a caption.
- Never mention videos, tutorials, or resources for them to watch.
- No headings, bullet points, lists, emoji, or em dashes. At most one exclamation point in the whole letter.
- Never use these words: leverage, optimize, engagement, funnel, algorithm, content strategy, brand, synergy, game-changer, unlock, elevate, journey, landscape, robust, crucial, delve.`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    intro: { type: "string" },
    findings: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: { summary: { type: "string" } },
        required: ["summary"],
      },
    },
    working: { type: "string" },
    next_step: { type: "string" },
    cover_line: { type: "string" },
  },
  required: ["intro", "findings", "working", "next_step", "cover_line"],
};

type AiOut = {
  intro: string;
  findings: { summary: string }[];
  working: string;
  next_step: string;
  cover_line: string;
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
// Small numbers the fixed advice itself uses ("two choices", "3 to 4 posts a week", "30 to 60 seconds", "90 days").
const ALWAYS_ALLOWED = ["1", "2", "3", "4", "30", "60", "90"];

const BANNED_WORDS =
  /\b(leverage|optimi[sz]e|engagement|funnel|algorithm|content strategy|brand|synergy|game.?changer|unlock|elevate|journey|landscape|robust|crucial|delve|dear)\b/i;
const LOOKUP_CLAIMS = /\b(look(ed)? (up|at|through)|we (checked|saw|found|noticed|pulled)|ad library|your (feed|page|posts|website|instagram|facebook) (shows|has))\b/i;
const ADVICE = /\b(I['’]d recommend|you should|I['’]d start|start by|my advice)\b/i;

// Sentences, not splitting after "St." / "Fr." and the like.
const sentences = (s: string) =>
  s
    .split(/(?<=[.!?])(?<!\b(?:St|Sts|Ss|Fr|Mt|Msgr|Dr|Mr|Mrs|Ms|Rev|Sr|Br|Jr)\.)\s+(?=[A-Z“"])/)
    .filter((x) => x.trim()).length;
const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;

export function checkLetter(out: AiOut, facts: LetterFacts["facts"]): string[] {
  const problems: string[] = [];
  const prose = [out.intro, ...out.findings.map((f) => f.summary), out.working, out.next_step];
  const text = [...prose, out.cover_line].join("\n");
  const words = wordCount(prose.join(" "));
  const want = facts.problemsInOrder.length;

  if (out.findings.length !== want)
    problems.push(`Write exactly ${want} findings, one per item in problemsInOrder, in the same order (you wrote ${out.findings.length}).`);
  out.findings.forEach((f, i) => {
    if (sentences(f.summary) !== 2 || wordCount(f.summary) > 55)
      problems.push(`findings[${i}].summary must be exactly 2 sentences (the evidence, then why it matters), 25 to 50 words.`);
  });
  if (words < 110 || words > 340) problems.push(`Everything you write together should be 150 to 300 words (you wrote ${words}).`);
  if (sentences(out.intro) > 3)
    problems.push(`The intro must be exactly 3 sentences (you wrote ${sentences(out.intro)}): the thank-you, what we did, and a short line leading into the findings.`);
  if (sentences(out.next_step) > 4 || wordCount(out.next_step) > 85)
    problems.push("next_step must be one step in 2 to 4 sentences, under 75 words.");
  if (/\b(video|tutorial|house of studies)s?\b.*\b(watch|link|free)\b|\b(watch|free) (video|tutorial)s?\b/i.test(text))
    problems.push("Don't point them to videos, tutorials, or resources.");

  // Percentages only where an approved proof point uses them (e.g. "3% to 30%").
  const proofPct = new Set(JSON.stringify(facts.approvedProof).match(/\d+(?:\.\d+)?%/g) ?? []);
  const pct = (prose.join(" ").match(/\d+(?:\.\d+)?\s?%/g) ?? []).map((x) => x.replace(/\s/g, ""));
  if (pct.some((x) => !proofPct.has(x)) || /\bper ?cent\b/i.test(prose.join(" ")))
    problems.push("Don't use percentages; say it in people (e.g. fewer than 1 in 100 followers).");
  if (/whole story|likes (alone|by themselves)/i.test(text)) problems.push("Skip vague lines like 'likes don't tell the whole story'. Say plainly that Facebook shows low-response posts to fewer people, so most followers never see them.");
  if (/\bdead\b/i.test(text)) problems.push('Never call the page "dead".');
  const goal = text.match(/\byour (goals?|hopes?|aims?|priorit(?:y|ies)|dreams?)\b|\b(?:you['’]re|you are) (?:hoping|trying|wanting|looking) to\b/i);
  if (goal) problems.push(`"${goal[0]}": don't state the parish's goals or hopes; they didn't tell us. Speak about goals in general terms.`);
  const early = [out.intro, ...out.findings.map((f) => f.summary), out.working].join(" ");
  const advice = early.match(ADVICE);
  if (advice) problems.push(`Keep advice to next_step only ("${advice[0]}" appears earlier). Everything else diagnoses.`);
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
  if (/^\s*([-*•#]|\d+[.)])\s/m.test(prose.join("\n"))) problems.push("No bullets or headings.");
  if (/\*\*/.test([out.intro, out.working, out.cover_line, ...out.findings.map((f) => f.summary)].join(" ")))
    problems.push("Bold only in next_step.");
  if (/\*/.test(out.cover_line)) problems.push("No bold or italics in cover_line.");
  const marked = prose.join("\n");
  const bolds = marked.match(/\*\*[^*]+\*\*/g) ?? [];
  const italics = marked.replace(/\*\*[^*]+\*\*/g, "").match(/\*[^*]+\*/g) ?? [];
  if (bolds.length > 1 || bolds.some((b) => b.split(/\s+/).length > 12)) problems.push("Bold at most one short phrase (under 12 words), in next_step.");
  if (italics.length > 2) problems.push("Italics at most 2 times.");
  if ((marked.replace(/\*\*[^*]+\*\*/g, "").replace(/\*[^*]+\*/g, "").match(/\*/g) ?? []).length) problems.push("Unmatched * marks.");
  const tell = text.match(
    /\b(not just|isn['’]t just|that tells me|what follows|honest picture|real life|strong base|the good news is|here['’]s the thing|in today['’]s world|at the end of the day|navigate|foster|resonate|meaningful|intentional|seamless|impactful|tapestry|truly|deeply|vibrant|thrive)\b/i,
  );
  if (tell) problems.push(`"${tell[0]}" sounds like AI. Say it the way Joe would.`);
  if (/\b(better than most|(many|most|other) (parishes|pastors)|the average parish|typical parish)\b/i.test(text))
    problems.push("Don't compare the parish to other parishes.");
  if (/\b(score|scored|out of 100|scorecard results|the report)\b/i.test(prose.join(" ")))
    problems.push("Don't mention the score or the report.");
  if (/\b(hi|hello) (father|fr\.)|god bless|book a (free )?(call|time|assessment|review)/i.test(prose.join(" ")))
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
  return JSON.parse(j.choices[0].message.content) as AiOut;
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
  const { facts, problems, evidence } = buildLetterFacts(doc, a, profile, lead, now);
  const action = quickAction(problems[0]?.id, a.homilyClips === "regularly");
  if (key) {
    const messages = [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `Facts for this parish (JSON):\n${JSON.stringify(facts, null, 1)}\n\nThe "one thing you can do this week" line (already written, for context only): ${action}`,
      },
    ];
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const out = await callOpenAI(messages, key);
        let issues = checkLetter(out, facts);
        if (!issues.length) {
          const letter: ScorecardLetter = {
            v: 2,
            src: "ai",
            intro: tidyText(out.intro),
            findings: out.findings.map((f, i) => ({ t: problems[i].title, s: tidyText(f.summary) })),
            working: tidyText(out.working),
            next: tidyText(out.next_step),
            now: action,
            cover: tidyText(out.cover_line).replace(/\.$/, ""),
            ev: evidence,
          };
          const pages = letterPages ? await letterPages(letter).catch(() => 2) : 2;
          if (pages <= 2) return letter;
          const words = wordCount([letter.intro, letter.working, letter.next, ...letter.findings.map((f) => f.s)].join(" "));
          issues = [
            `The letter runs onto a third page. Cut about 60 words, to about ${Math.max(150, words - 60)} (you wrote ${words}): shorten and drop anything repeated, but keep every finding.`,
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
  return templateLetter(doc, a, {
    lookedUp: facts.weLookedUpTheirPages,
    problems,
    evidence,
    engagementLine: weak ? eng.plainLine : undefined,
  });
}

// ---------------------------------------------------------------------------
// Template letter (no API key, the AI failed, or an old report link)
// ---------------------------------------------------------------------------

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const COUNT_WORD = ["", "one", "two", "three"];
const QUIET_FEED_WHY =
  "When few people respond to a post, Facebook shows it to fewer people, so most of the people following the page, parishioners included, never see it.";
const TEMPLATE_WHY: Record<string, string> = {
  outreach: "Posts mostly reach people already in the pews, so families nearby who aren’t coming yet never get a clear invitation.",
  leak: "People are most ready right after they raise their hand, and a call a week later feels like an afterthought.",
  nurture: "Posts have one job, to build enough goodwill that people say yes when the parish asks, and a feed of mostly asks gets scrolled past.",
  frequency: "A post or two a week isn’t enough to keep the parish on people’s minds.",
  quietFeed: QUIET_FEED_WHY,
};

export function templateLetter(
  doc: ScorecardDoc,
  a: Pick<ScorecardAnswers, "homilyClips">,
  opts: {
    lookedUp?: boolean;
    problems?: LetterProblem[];
    evidence?: LetterEvidence;
    engagementLine?: string; // Facebook followers vs. responses, when few respond
  } = {},
): ScorecardLetter {
  const problems: LetterProblem[] =
    opts.problems ?? doc.problems.map((p) => ({ id: p.id, title: p.title, whatWeSaw: p.saw, firstStep: p.firstStep }));
  // Each finding: the evidence, then why it matters. When few Facebook
  // followers respond, that's the evidence for the first posting problem.
  let engagementUsed = false;
  const findings: LetterFinding[] = problems.map((p) => {
    const posting = p.id === "nurture" || p.id === "frequency";
    let evidence = p.whatWeSaw.filter(Boolean)[0] ?? "";
    let why = TEMPLATE_WHY[p.id] ?? "";
    if (posting && opts.engagementLine && !engagementUsed) {
      evidence = opts.engagementLine;
      why = QUIET_FEED_WHY;
      engagementUsed = true;
    }
    return { t: p.title, s: `${evidence} ${why}`.trim() };
  });
  const n = findings.length;
  const lead = n === 0 ? "Here’s what I found." : n === 1 ? "Here’s the one thing I’d focus on." : `Here are the ${COUNT_WORD[n]} things I’d focus on, starting with what matters most.`;
  return {
    v: 2,
    src: "template",
    intro: opts.lookedUp
      ? `Thanks for taking the Parish Social Media Scorecard. I went through your answers, and we also went ahead and looked up the parish’s pages and recent posts. ${lead}`
      : `Thanks for taking the Parish Social Media Scorecard. I went through your answers. ${lead}`,
    findings,
    working: doc.strengths[0] ?? doc.diagnosis.body,
    next: problems[0]?.firstStep.replace(/\s*(Building and running|Turning homilies)[^.]*\.\s*$/, "").trim() ?? "Keep doing what’s working, and look at adding short talking-head reels from the pastor.",
    now: quickAction(problems[0]?.id, a.homilyClips === "regularly"),
    cover: problems[0] ? lowerFirst(problems[0].title) : "keeping what’s working and building on it",
    ev: opts.evidence,
  };
}
