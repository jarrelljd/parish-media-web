// The written scorecard report: a personal letter ("we") that opens with a
// diagnosis, then the 1–3 major problems in order of how much they hold the
// parish back, what's working, the scores, and the next step.
//
// Problem order (Joe's priorities):
//   1. Outreach system: ads → Plan a Visit form → fast personal follow-up.
//      Missing a piece = "no outreach system"; all pieces but slow or
//      untracked follow-up = "a leak".
//   2. No homily clips / pastor not on camera (value content).
//   3. Inconsistent posting or a content mix missing know/like/trust posts.
//
// Pure: used by the PDF route, the summary page, the quiz teaser, and the
// lead notification. Proof points and post types live in data/scorecard.ts.

import { postTypes, proof } from "@/data/scorecard";
import {
  SCORECARD_BOOKING_URL,
  buildReport,
  choiceLabel,
  outreachStatus,
  type ScorecardAnswers,
  type ScorecardReport,
} from "@/lib/scorecard";

export type ReportProblem = {
  id: "outreach" | "leak" | "homily" | "posting";
  title: string;
  saw: string[];
  why: string[];
  // Optional numbered steps ("what it looks like when it works").
  works?: { intro: string; steps: { label: string; text: string }[] };
  // Optional list of the four post types. `note` flags the one that makes
  // up most of their feed; `bad` when that's flyers.
  postTypes?: { label: string; text: string; note?: string; bad?: boolean }[];
  proof?: string;
  firstStep: string;
};

export type ScorecardDoc = {
  report: ScorecardReport;
  parish: string; // "St. Michael Parish", or "Your parish"
  location: string; // "Columbus, OH"
  preparedFor: string; // full name as typed, may be ""
  greeting: string; // "Father Smith"
  date: string; // "November 1, 2026"
  diagnosis: { lead: string; body: string };
  problemsIntro: string;
  problems: ReportProblem[];
  strengths: string[];
  nextStep: string;
};

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

function roundPopulation(n: number) {
  const step = n >= 100_000 ? 1000 : n >= 10_000 ? 100 : 10;
  return fmt(Math.round(n / step) * step);
}


function adsLine(a: ScorecardAnswers) {
  if (a.ads === "none") return "No paid ads in the last 6 months.";
  if (a.ads === "boosted") return "Only a boosted post or two in the last 6 months, with no ongoing ads.";
  return `You’re running ongoing ads (${choiceLabel("ads", a.ads).replace(/^Yes, ongoing, |^Yes, /, "")}).`;
}

function nextStepLine(a: ScorecardAnswers) {
  return (
    {
      none: "There’s no clear next step for someone who finds you online.",
      massTimes: "Newcomers only find Mass times on your website.",
      contactForm: "Newcomers only have a general contact form.",
      planVisit: "You have a Plan Your Visit page or form.",
      metaForm: "You have a Plan a Visit form on Facebook or Instagram.",
    }[a.nextStep] ?? ""
  );
}

function inquirersLine(a: ScorecardAnswers) {
  if (a.inquirers === "untracked") return "New inquiries aren’t tracked.";
  if (a.inquirers === "0") return "No new people reach out in a typical month.";
  if (a.inquirers === "10+") return "More than 10 new people reach out in a typical month.";
  return `About ${choiceLabel("inquirers", a.inquirers)} new people reach out in a typical month.`;
}

function followUpLine(a: ScorecardAnswers) {
  return (
    {
      sameDay: "New inquiries hear back the same day.",
      twoDays: "New inquiries hear back within 2 days.",
      week: "Follow-up can take up to a week.",
      longer: "Follow-up often takes more than a week.",
      noProcess: "There’s no set process for following up with new inquiries.",
    }[a.followUp] ?? ""
  );
}

function frequencyLine(a: ScorecardAnswers) {
  return (
    {
      rarely: "A few posts a month or less.",
      weekly: "About one post a week.",
      few: "2–3 posts a week.",
      daily: "Daily or almost daily posts.",
    }[a.frequency] ?? ""
  );
}



export function buildScorecardDoc(
  a: ScorecardAnswers,
  population: number | null,
  lead: { name?: string; organization?: string; role?: string; greeting?: string; date?: Date } = {},
): ScorecardDoc {
  const report = buildReport(a, population);
  const org = (lead.organization ?? "").trim();
  const parish = org || "Your parish";
  const parishMid = org || "your parish";
  const isPastor = lead.role === "Pastor";

  const {
    hasAds,
    hasPlanStep,
    fastFollow,
    tracked,
    missing: outreachMissing,
    leak: outreachLeak,
  } = outreachStatus(a);

  // A feed that's mostly flyers is a page of ads: always a major problem.
  const mostlyFlyers = a.mainContent === "flyers";
  const infrequent = a.frequency === "rarely" || a.frequency === "weekly";
  const homilyGap = a.homilyClips !== "regularly";
  const postingGap = infrequent || mostlyFlyers;

  const problems: ReportProblem[] = [];

  // 1. Outreach system
  if (outreachMissing) {
    problems.push({
      id: "outreach",
      title:
        !hasAds && !hasPlanStep
          ? "There’s no outreach system bringing new people in"
          : hasAds
            ? "Your ads have nowhere to send people"
            : "Nothing is inviting new people to plan a visit",
      saw: [adsLine(a), nextStepLine(a), inquirersLine(a), followUpLine(a)],
      why: [
        "Regular posts mostly reach people who already follow you, and most of them are already your parishioners. To reach families nearby who aren’t coming yet, someone has to invite them directly, on the apps they already scroll. That’s what ads are built for: a targeted invitation to the right people.",
      ],
      works: {
        intro: "An outreach system has three parts:",
        steps: [
          { label: "Ads", text: "aimed at families near the parish, inviting them to plan a first visit." },
          {
            label: "A Plan Your Visit form.",
            text: "It’s usually a simple form inside Facebook or Instagram asking for name and phone number, so saying yes takes ten seconds.",
          },
          { label: "A personal call or text", text: "from the parish, the same day." },
        ],
      },
      proof: `${proof.adsCost} The same system works for event registrations and volunteer drives. ${proof.stPatrick}`,
      firstStep: fastFollow
        ? "You already follow up quickly, so the missing pieces are the ads and the form. Building and running them is the part we set up for parishes."
        : "Decide who on staff will personally call every new inquiry the same day. The ads and form get built around that person. Building and running the ads is the part we set up for parishes.",
    });
  } else if (outreachLeak) {
    problems.push({
      id: "leak",
      title: "Your outreach system has a leak",
      saw: [adsLine(a), nextStepLine(a), inquirersLine(a), followUpLine(a)],
      why: [
        "Ads and a Plan a Visit form do their job when someone raises their hand. What happens next decides whether they actually come. A call the same day feels like a welcome. A call a week later feels like an afterthought.",
        ...(tracked
          ? []
          : ["And when inquiries aren’t counted, there’s no way to know which ads are working or what each new family costs."]),
      ],
      proof: proof.adsCost,
      firstStep:
        "Name one person responsible for newcomers and commit to a personal call or text the same day. Count every inquiry each month so you can see what’s working.",
    });
  }

  // 2. Homily clips (no clips also means the pastor isn't on camera)
  if (homilyGap) {
    const noClips = a.homilyClips === "no";
    const saw = [
      noClips
        ? "The parish doesn’t post homily clips."
        : "Homily clips are posted only occasionally.",
    ];
    problems.push({
      id: "homily",
      title: noClips
        ? `${isPastor ? "You’re not" : "Your pastor isn’t"} on camera, and there are no homily clips`
        : "Homily clips aren’t a weekly habit yet",
      saw,
      why: [
        "Homily clips are what people expect to see from their parish, and they’re the strongest content a parish has. Each clip gives something of value for free. That builds goodwill, and goodwill is what makes people say yes later, when you invite them to Mass or ask them to volunteer or give." +
          (mostlyFlyers ? " Right now most of your feed is flyers, and flyers only ask. They never give." : ""),
      ],
      proof: proof.stJoseph,
      firstStep:
        noClips
            ? "Start filming the homily every Sunday, even on a phone and tripod. If no one on staff can edit video, hire a clipper. Turning homilies into short clips every week is one of the things we handle for parishes."
            : "Make it weekly: film every Sunday homily and post at least one clip a week. If editing is the bottleneck, hire a clipper. Turning homilies into short clips every week is one of the things we handle for parishes.",
    });
  }

  // 3. Posting: a feed of flyers, or too few posts
  if (postingGap) {
    const saw = [frequencyLine(a)];
    if (mostlyFlyers) saw.push("Most of what you post is graphics announcing events, Mass times, and parish updates.");
    if (a.growth === "flat") saw.push("Your follower count has been flat for a year.");
    if (a.growth === "shrinking") saw.push("Your follower count is shrinking.");
    problems.push({
      id: "posting",
      title: mostlyFlyers ? "Your feed reads like a page of ads" : "Posting isn\u2019t consistent enough",
      saw,
      why: mostlyFlyers
        ? [
            "Every flyer is an ask: come to this, sign up for that, here are the Mass times. A feed made mostly of asks is a page of ads, and people learn to scroll right past it. It builds no goodwill, so when you do need people to respond, they don\u2019t. A healthy parish feed has four kinds of posts, and the asks should be the smallest share:",
          ]
        : [
            "Regular posting has one job: keep the parish on people\u2019s minds and build goodwill, so that when you do ask, people respond. People respond to those they know, like, and trust. A healthy parish feed has four kinds of posts:",
          ],
      postTypes: postTypes.map((t) => ({
        label: t.label,
        text: `${t.purpose}: ${t.examples}.`,
        note: t.value === a.mainContent ? "This is most of your feed." : undefined,
        bad: t.value === a.mainContent && mostlyFlyers,
      })),
      // St. Joseph's story belongs with homily clips; only repeat it here
      // when the homily problem isn't in the report.
      proof: homilyGap ? undefined : proof.stJoseph,
      firstStep: mostlyFlyers
        ? "Flip the ratio. Make most of your posts helpful videos, like homily clips or short advice from the pastor, and keep flyers to one or two a week. Aim for 3\u20134 posts a week in all."
        : "Aim for 3\u20134 posts a week, with at least one homily clip.",
    });
  }

  // Diagnosis
  const sizeLine =
    `a parish of ${fmt(a.attendance)} weekend Massgoers` +
    (population ? `, in a city of about ${roundPopulation(population)} people,` : "");
  let diagnosis: { lead: string; body: string };
  if (outreachMissing) {
    const opener =
      !hasAds && !hasPlanStep
        ? "Right now, nothing is regularly inviting new people to the parish. When someone does find you, there’s no simple way for them to raise their hand."
        : hasAds
          ? "You’re running ads, but there’s no simple way for the people they reach to raise their hand."
          : "You have a way for newcomers to raise their hand, but nothing is regularly inviting them to.";
    diagnosis = {
      lead: `${parish} doesn’t have an outreach system yet.`,
      body: `${opener} That isn’t a failing of your staff. Most parishes we talk to are in the same place. But it’s the main reason ${sizeLine} isn’t seeing new faces each month.`,
    };
  } else if (outreachLeak) {
    diagnosis = {
      lead: `${parish} has the start of an outreach system, but it’s leaking.`,
      body: `You’re inviting new people in and giving them an easy way to respond. ${
        fastFollow
          ? "But no one is counting the people who respond, so there’s no way to know what’s working."
          : "But when someone raises their hand, it can take too long for the parish to reach back, and that’s where new families slip away."
      }`,
    };
  } else if (homilyGap || postingGap) {
    diagnosis = {
      lead: `${parish} has an outreach system in place. The biggest gap now is your content.`,
      body: "Ads can invite people, but your posts are what make them want to come. Right now your feed isn’t building the goodwill that makes people say yes when you ask.",
    };
  } else {
    diagnosis = {
      lead: `${parish} is doing what most parishes aren’t.`,
      body: "You’re inviting new people in, giving them an easy way to respond, following up fast, and posting content that builds goodwill. The work now is protecting what’s working and sharpening it.",
    };
  }

  const count = ["", "one", "two", "three"][problems.length];
  const problemsIntro =
    problems.length === 0
      ? ""
      : problems.length === 1
        ? `Here’s the biggest problem holding ${parishMid} back.`
        : `Here are the ${count} biggest problems, in order of how much they’re holding ${parishMid} back.`;

  // What's working (up to 3)
  const strengths: string[] = [];
  const engagement = report.categories.find((c) => c.id === "engagement");
  if (hasAds) strengths.push("You’re already investing in ads, which most parishes aren’t.");
  if (hasPlanStep) strengths.push("Newcomers have a clear way to raise their hand.");
  if (fastFollow) strengths.push("New people hear back from the parish quickly.");
  if (a.homilyClips === "regularly") strengths.push("You post homily clips every week, the strongest content a parish has.");
  else if (a.mainContent === "value") strengths.push("Most of what you post is helpful video, the kind of content people value most.");
  if (a.frequency === "few" || a.frequency === "daily")
    strengths.push(`You post ${a.frequency === "daily" ? "almost every day" : "2–3 times a week"}, which keeps the parish on people’s minds.`);
  if (engagement && engagement.tier !== "low" && engagement.facts[0]?.startsWith("A typical post"))
    strengths.push(`Your followers respond when you post. ${engagement.facts[0]}`);
  if (a.growth === "little" || a.growth === "fast") strengths.push("Your following is growing.");
  if (a.team === "staff" || a.team === "agency") strengths.push("Someone is paid to own your social media.");
  if (strengths.length === 0)
    strengths.push(
      `${fmt(a.attendance)} people come to Mass at ${parishMid} every weekend. That community is the foundation everything else builds on.`,
    );

  const date = (lead.date ?? new Date()).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  });

  return {
    report,
    parish,
    location: `${a.city}, ${a.state}`,
    preparedFor: (lead.name ?? "").trim(),
    greeting: lead.greeting ?? "Parish Leader",
    date,
    diagnosis,
    problemsIntro,
    problems: problems.slice(0, 3),
    strengths: strengths.slice(0, 3),
    nextStep: `Book a free Parish Growth Assessment. We’ll go over this scorecard with you and ${
      outreachMissing
        ? `show you what an outreach system would look like for ${parishMid}, including what it would cost`
        : problems.length
          ? `map out how to close these gaps at ${parishMid}, including what it would cost`
          : `look at where ${parishMid} can grow from here`
    }. We ask that the pastor join the call.`,
  };
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Short cover email for the Zap to send with the PDF attached. Inline styles
// only. Includes a "view your report" link in case the attachment is lost.
export function coverEmailHtml(d: ScorecardDoc, pdfUrl: string): string {
  const navy = "#1b2a4a";
  const sans = "font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;";
  const p = `${sans}font-size:16px;line-height:1.6;color:${navy};margin:0 0 16px 0;`;
  const top = d.problems[0];
  const btn = (href: string, text: string, filled: boolean) =>
    `<a href="${esc(href)}" style="${sans}display:inline-block;${
      filled ? `background:${navy};color:#faf8f4;` : `color:${navy};border:1px solid ${navy};`
    }text-decoration:none;font-weight:700;font-size:15px;padding:12px 24px;border-radius:999px;margin:0 8px 8px 0;">${text}</a>`;
  return `<!doctype html><html><body style="margin:0;padding:24px 16px;background:#ffffff;">
<div style="max-width:560px;">
<p style="${p}">Dear ${esc(d.greeting)},</p>
<p style="${p}">Thank you for taking the Parish Social Media Scorecard. Your full report for ${esc(d.parish === "Your parish" ? "your parish" : d.parish)} is attached.</p>
<p style="${p}"><strong>Your score: ${d.report.score} out of 100 (${esc(d.report.band.label)}).</strong>${
    top ? ` The biggest thing holding the parish back: ${esc(top.title.charAt(0).toLowerCase() + top.title.slice(1))}.` : ""
  } The report walks through what we saw, why it matters, and the first step for each problem.</p>
<p style="${p}">If you&rsquo;d like help putting it into practice, book a free Parish Growth Assessment. We&rsquo;ll go over your scorecard with you.</p>
<p style="margin:0 0 16px 0;">${btn(SCORECARD_BOOKING_URL, "Book a Free Assessment", true)}${btn(pdfUrl, "View Your Report", false)}</p>
<p style="${p}">God bless,<br>Joe Jarrell<br><span style="color:#6b7280;">Parish Media Company</span></p>
</div></body></html>`;
}

// One sentence explaining why the total is lower than the categories add up
// to. Null when no cap applied.
export function capNote(r: ScorecardReport): string | null {
  if (!r.cap) return null;
  const why = {
    noSystem: "without an outreach system (ongoing ads and a Plan a Visit step)",
    leak: "until new inquiries get a personal reply within two days and are tracked",
    flyers: "while most of your feed is flyers",
  }[r.cap.reason];
  return `Your categories add up to ${r.rawScore}, but ${why} the total is capped at ${r.cap.at}.`;
}

// Plain-text version for the CRM / lead notification.
export function docToText(d: ScorecardDoc): string {
  const out = [
    `${d.parish} (${d.location}) scored ${d.report.score}/100: ${d.report.band.label}`,
    "",
    `${d.diagnosis.lead} ${d.diagnosis.body}`,
    "",
  ];
  d.problems.forEach((p, i) => {
    out.push(`${i + 1}. ${p.title}`, `   Saw: ${p.saw.join(" ")}`, `   First step: ${p.firstStep}`, "");
  });
  out.push("What's working:", ...d.strengths.map((s) => `- ${s}`), "", "Scores:");
  for (const c of d.report.categories) out.push(`- ${c.label}: ${c.points}/${c.max}`);
  const note = capNote(d.report);
  if (note) out.push(note);
  return out.join("\n");
}
