"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { Resend } from "resend";
import { NO_QUALIFYING_ROLE, freeGuideRoles } from "@/data/freeGuideRoles";
import { deliveryDate } from "@/data/freeWebsite";
import { lookupCityPopulation } from "@/lib/cityPopulation";
import { greetingFor } from "@/lib/greeting";
import {
  choiceLabel,
  parseAnswers,
  type ChoiceId,
  type FollowerCount,
} from "@/lib/scorecard";
import { getLookup } from "@/lib/parishLookupStore";
import { profileToText } from "@/lib/parishProfile";
import { createReportQuery, createShortReportCode } from "@/lib/scorecardLink";
import { letterGreeting, writeScorecardLetter } from "@/lib/scorecardLetter";
import { buildScorecardDoc, coverEmailHtml, docToText } from "@/lib/scorecardReport";
import { letterPageCount } from "@/lib/scorecardPdf";
import {
  sendLeadConversionEvent,
  sendGenericLeadEvent,
  sendGenericScheduleEvent,
  sendScorecardCompleteEvent,
} from "@/lib/metaConversionsApi";

// TODO: swap to joe@parishmediacompany.com once Google Workspace is live.
const NOTIFY_EMAIL = "joejarrell@chapellaunch.com";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const helpType = String(formData.get("helpType") ?? "");

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Parish Media Company <onboarding@resend.dev>",
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nWhat they need help with: ${helpType}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        status: "error",
        message:
          "Something went wrong sending your message. Please email joe@parishmediacompany.com directly.",
      };
    }
  } catch (err) {
    console.error("Failed to send contact form email:", err);
    return {
      status: "error",
      message:
        "Something went wrong sending your message. Please email joe@parishmediacompany.com directly.",
    };
  }

  return { status: "success" };
}

export type EventRSVPState = {
  status: "idle" | "success" | "error";
  message?: string;
  // Shared with the browser pixel's Lead call so Meta dedupes the two into
  // one Lead instead of double-counting (see components/EventRSVPForm.tsx).
  eventId?: string;
};

// The Zap behind this webhook adds a row to the shared signups Sheet, sends
// the calendar invite, and schedules the reminder email — this is what
// actually fulfills the "we'll add it to your calendar" promise on the page,
// so unlike the Resend notification below, its failure blocks success.
//
// `webhookEnvVar` names which env var holds the URL for this specific
// event's own Zapier automation (see EventInfo.webhookEnvVar in
// src/data/events.ts) — falls back to the shared default when an event
// doesn't set one. The URL itself only ever lives in .env, never in
// committed data, since it's effectively a bearer secret.
async function notifyZapier(
  payload: Record<string, string>,
  webhookEnvVar?: string,
): Promise<void> {
  const envVar = webhookEnvVar || "ZAPIER_RSVP_WEBHOOK_URL";
  const webhookUrl = process.env[envVar];
  if (!webhookUrl) {
    throw new Error(`${envVar} is not set`);
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Zapier webhook responded with ${response.status}`);
  }
}

export async function submitEventRSVP(
  eventName: string,
  parishName: string,
  webhookEnvVar: string | undefined,
  parishSlug: string,
  eventSlug: string,
  _prevState: EventRSVPState,
  formData: FormData,
): Promise<EventRSVPState> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const phone = String(formData.get("phone") ?? "");

  try {
    await notifyZapier(
      {
        timestamp: new Date().toISOString(),
        parishName,
        eventName,
        name,
        email,
        phone,
      },
      webhookEnvVar,
    );
  } catch (err) {
    console.error("Failed to notify Zapier webhook (event RSVP):", err);
    return {
      status: "error",
      message: "Something went wrong submitting your info. Please try again.",
    };
  }

  // No per-signup notification email — the Zapier webhook above (sheet row +
  // calendar invite + reminder) is the part that actually matters, and with
  // many event pages a heads-up email per signup would get overwhelming.

  // Same event_id gets used for the browser pixel's Lead call (see
  // EventRSVPForm.tsx) so Meta dedupes the two into one Lead. A tracking
  // failure here should never fail the RSVP itself — the visitor already
  // has their calendar invite regardless of whether this succeeds.
  const eventId = randomUUID();
  try {
    const headersList = await headers();
    await sendLeadConversionEvent({
      parishSlug,
      eventSlug,
      eventId,
      contentName: eventName,
      email,
      phone,
      userAgent: headersList.get("user-agent"),
      ipAddress: headersList.get("x-forwarded-for")?.split(",")[0]?.trim(),
    });
  } catch (err) {
    console.error("Failed to send Meta Conversions API event:", err);
  }

  return { status: "success", eventId };
}

export type EbookRequestState = {
  status: "idle" | "success" | "error";
  message?: string;
  // Shared with the browser pixel's Lead so Meta dedupes the two.
  eventId?: string;
};

// The Zap behind this webhook sends the book (Joe's own automation handles
// delivery now, not this app) and adds the lead to his CRM — this is what
// actually fulfills the "we'll send it your way" promise on the page, so
// unlike the Meta tracking below, its failure blocks success.
export async function submitEbookRequest(
  _prevState: EbookRequestState,
  formData: FormData,
): Promise<EbookRequestState> {
  const name = String(formData.get("name") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const email = String(formData.get("email") ?? "");
  const role = String(formData.get("role") ?? "");
  const organization = String(formData.get("organization") ?? "");
  const cityState = String(formData.get("cityState") ?? "");

  // The free guide is a lead magnet for pastors and parish leaders. The role
  // dropdown in FreeGuideForm.tsx already requires a role; this is defense in
  // depth against a bypassed client.
  if (!(freeGuideRoles as readonly string[]).includes(role)) {
    return { status: "error", message: "Please select your role." };
  }
  if (role === NO_QUALIFYING_ROLE) {
    return {
      status: "error",
      message:
        "The free digital copy is only for the roles listed. You can buy the book on Amazon.",
    };
  }

  if (phone.replace(/\D/g, "").length < 10) {
    return {
      status: "error",
      message: "Please enter a valid phone number.",
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
    };
  }

  try {
    await notifyZapier(
      {
        timestamp: new Date().toISOString(),
        name,
        phone,
        email,
        role,
        organization,
        cityState,
      },
      "ZAPIER_WEBHOOK_FREE_GUIDE",
    );
  } catch (err) {
    console.error("Failed to notify Zapier webhook (free guide):", err);
    return {
      status: "error",
      message:
        "Something went wrong sending your guide. Please email joe@parishmediacompany.com directly.",
    };
  }

  const eventId = randomUUID();
  try {
    const headersList = await headers();
    await sendGenericLeadEvent({
      eventId,
      contentName: "Free Guide Request",
      sourcePath: "/free-guide",
      email,
      phone,
      userAgent: headersList.get("user-agent"),
      ipAddress: headersList.get("x-forwarded-for")?.split(",")[0]?.trim(),
    });
  } catch (err) {
    console.error("Failed to send Meta Conversions API event (ebook):", err);
  }

  return { status: "success", eventId };
}

// Server half of the Meta "Schedule" event for a booked Parish Growth
// Assessment. Called from ScheduleTracker on /call-confirmed, which reads the
// booking details Calendly adds to the redirect URL. eventId matches the
// browser pixel's Schedule so Meta counts the booking once.
export async function submitScheduleEvent({
  eventId,
  email,
  fullName,
}: {
  eventId: string;
  email?: string;
  fullName?: string;
}): Promise<void> {
  if (!eventId) return;
  const [firstName, ...rest] = (fullName ?? "").trim().split(/\s+/);
  try {
    const headersList = await headers();
    await sendGenericScheduleEvent({
      eventId,
      contentName: "Parish Growth Assessment",
      sourcePath: "/call-confirmed",
      email: email || undefined,
      firstName: firstName || undefined,
      lastName: rest.length ? rest[rest.length - 1] : undefined,
      userAgent: headersList.get("user-agent"),
      ipAddress: headersList.get("x-forwarded-for")?.split(",")[0]?.trim(),
    });
  } catch (err) {
    console.error("Failed to send Meta Conversions API event (schedule):", err);
  }
}


// ---------------------------------------------------------------------------
// Parish Social Media Scorecard (/scorecard)
// ---------------------------------------------------------------------------

// Called once the quiz is finished, so the free score view can mention the
// city's population. Returns null when the city isn't in the Census file.
export async function getScorecardPopulation(
  city: string,
  state: string,
): Promise<number | null> {
  try {
    return lookupCityPopulation(String(city).slice(0, 100), String(state).slice(0, 2));
  } catch {
    return null;
  }
}

export type ScorecardOptInState = {
  status: "idle" | "success" | "error";
  message?: string;
  // Shared with the browser pixel's Lead so Meta dedupes the two.
  // Only set for pastors (the only role that counts as a Lead).
  eventId?: string;
  // Shared with the browser's ScorecardComplete (every role) for dedupe.
  completeEventId?: string;
  // Link to the lead's PDF report, for the summary page's download button.
  pdfUrl?: string;
};

// The Zap behind ZAPIER_WEBHOOK_SCORECARD emails the lead their report:
// `emailHtml` is a short cover note ready to send, and `reportPdfUrl` is the
// PDF to attach (signed link, rebuilt on demand by
// /api/scorecard/report). It also adds the lead to Joe's CRM. That Zap is
// what fulfills "your report is on its way" on /scorecard/summary, so its
// failure blocks success. The Resend email to Joe is just a heads-up.
export async function submitScorecardOptIn(
  _prevState: ScorecardOptInState,
  formData: FormData,
): Promise<ScorecardOptInState> {
  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 40);
  const role = String(formData.get("role") ?? "");
  const organization = String(formData.get("organization") ?? "").trim().slice(0, 120);

  if (!(freeGuideRoles as readonly string[]).includes(role)) {
    return { status: "error", message: "Please select your role." };
  }
  if (role === NO_QUALIFYING_ROLE) {
    return {
      status: "error",
      message: "The full scorecard is only for the roles listed.",
    };
  }
  if (!name) {
    return { status: "error", message: "Please enter your name." };
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return { status: "error", message: "Please enter a valid phone number." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  let answers;
  try {
    answers = parseAnswers(JSON.parse(String(formData.get("answers") ?? "")));
  } catch {
    answers = null;
  }
  if (!answers) {
    return {
      status: "error",
      message: "Something went wrong with your answers. Please retake the scorecard.",
    };
  }

  // Re-score on the server so the numbers Joe sees match the answers.
  const population = lookupCityPopulation(answers.city, answers.state);
  const greeting = greetingFor(name);
  const doc = buildScorecardDoc(answers, population, {
    name,
    organization,
    role,
    greeting,
  });
  const report = doc.report;

  // What the parish lookup found on their pages (when it ran and finished).
  // Answers stay exactly as the quiz sent them, so the score here matches
  // the one they saw; the lookup feeds the letter and Joe's notification.
  // The quiz usually waits for it already; give a straggler a few seconds.
  let lookup = answers.lookupId ? getLookup(answers.lookupId) : undefined;
  for (let i = 0; i < 12 && lookup?.status === "pending"; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    lookup = getLookup(answers.lookupId!);
  }
  const profile = lookup?.status === "done" ? lookup.profile : null;
  const parishPages = profile
    ? profileToText(profile)
    : lookup?.status === "pending"
      ? "Lookup still running when they opted in."
      : "No lookup (pages not checked).";

  // The personal letter (about 5 seconds). Falls back to the template
  // letter on its own if OpenAI is down, so it never blocks the lead.
  // The letter must fit on two pages (plus "What we found"), so each draft is
  // rendered once and trimmed if it runs over.
  const letterHi = letterGreeting(name, role);
  const letter = await writeScorecardLetter(doc, answers, profile, { role }, undefined, undefined, (l) =>
    letterPageCount({ doc, letter: l, greeting: letterHi, isPastor: role === "Pastor" }),
  );

  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "parishmediacompany.com";
  const proto = headersList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  // A real ".pdf" filename in the path so Zapier treats it as a PDF file.
  const pdfName =
    (organization || "parish")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "parish";
  const reportQuery = createReportQuery({
    a: answers,
    n: name,
    o: organization,
    r: role,
    t: Date.now(),
    l: letter,
  });
  // Permanent link, for anything a person clicks.
  const pdfUrl = `${proto}://${host}/api/scorecard/report/Parish-Social-Media-Scorecard-${pdfName}.pdf?${reportQuery}`;
  // Short link for the Zap's attachment (Zapier won't download a URL this long).
  const attachUrl = `${proto}://${host}/api/scorecard/report/Parish-Social-Media-Scorecard-${pdfName}-${createShortReportCode(reportQuery)}.pdf`;

  const countLabel = (c: FollowerCount) =>
    typeof c === "number" ? String(c) : c === "none" ? "No account" : "Not sure";
  const label = (id: ChoiceId) => choiceLabel(id, answers[id]);
  const answerFields: Record<string, string> = {
    weekendAttendance: String(answers.attendance),
    facebookFollowers: countLabel(answers.fbFollowers),
    instagramFollowers: countLabel(answers.igFollowers),
    typicalEngagement: label("engagement"),
    followerGrowth: label("growth"),
    ads: label("ads"),
    postingFrequency: label("frequency"),
    homilyClips: label("homilyClips"),
    mainContent: label("mainContent"),
    monthlyInquirers: label("inquirers"),
    newcomerNextStep: label("nextStep"),
    followUpSpeed: label("followUp"),
    socialMediaOwner: label("team"),
  };
  const reportText = [
    docToText(doc),
    "",
    `Letter (${letter.src === "ai" ? "written by AI" : "template, AI unavailable"}):`,
    letterHi,
    ...[
      letter.intro,
      ...letter.findings.map((f, i) => `${i + 1}. ${f.t}. ${f.s}`),
      letter.working,
      `Where I'd start: ${letter.next}`,
      ...(letter.feed ? [letter.feed] : []),
    ].map((p) => p.replace(/\*/g, "")),
  ].join("\n\n");

  const payload: Record<string, string> = {
    timestamp: new Date().toISOString(),
    name,
    // "Fr. John Smith" -> "Father Smith" (older Zap steps use this).
    greeting,
    // The letter's own greeting ("Hi Fr. John,"), per the voice guide.
    letterGreeting: letterHi,
    email,
    phone,
    role,
    organization,
    city: answers.city,
    state: answers.state,
    cityPopulation: population ? String(population) : "",
    score: String(report.score),
    band: report.band.label,
    topProblem: doc.problems[0]?.title ?? "",
    ...Object.fromEntries(
      report.categories.map((c) => [`score_${c.id}`, `${c.points}/${c.max}`]),
    ),
    ...answerFields,
    // The Zap attaches this one (short, so Zapier downloads it as a file).
    reportPdfUrl: attachUrl,
    // Permanent link, same PDF (also in the cover email's "open it here").
    reportPdfLink: pdfUrl,
    reportPdfFilename: `Parish Social Media Scorecard - ${doc.parish}.pdf`,
    emailSubject: `Your Parish Social Media Scorecard: ${doc.parish}`,
    emailHtml: coverEmailHtml(doc, pdfUrl, letterHi, letter.cover),
    letterSource: letter.src,
    reportText,
    parishPages,
  };

  const [zapier, mail] = await Promise.allSettled([
    notifyZapier(payload, "ZAPIER_WEBHOOK_SCORECARD"),
    (async () => {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: "Parish Media Company <onboarding@resend.dev>",
        to: NOTIFY_EMAIL,
        replyTo: email,
        subject: `Scorecard lead: ${name} (${organization}) scored ${report.score}/100`,
        text: [
          `Name: ${name}`,
          `Role: ${role}`,
          `Parish: ${organization}`,
          `Email: ${email}`,
          `Phone: ${phone}`,
          `Location: ${answers.city}, ${answers.state}${population ? ` (pop. ${population.toLocaleString("en-US")})` : ""}`,
          `PDF report: ${pdfUrl}`,
          "",
          "Answers:",
          ...Object.entries(answerFields).map(([k, v]) => `  ${k}: ${v}`),
          "",
          "What we found on their pages:",
          parishPages,
          "",
          reportText,
        ].join("\n"),
      });
      if (error) throw new Error(JSON.stringify(error));
    })(),
  ]);
  if (mail.status === "rejected") {
    console.error("Failed to send scorecard lead email:", mail.reason);
  }
  if (zapier.status === "rejected") {
    console.error("Failed to notify Zapier webhook (scorecard):", zapier.reason);
    return {
      status: "error",
      message:
        "Something went wrong sending your report. Please try again or email joe@parishmediacompany.com.",
    };
  }

  const metaUser = {
    email,
    phone,
    userAgent: headersList.get("user-agent"),
    ipAddress: headersList.get("x-forwarded-for")?.split(",")[0]?.trim(),
  };

  // Every completion (any role) is counted as a custom ScorecardComplete.
  const completeEventId = randomUUID();
  try {
    await sendScorecardCompleteEvent({
      eventId: completeEventId,
      contentName: "Social Media Scorecard",
      sourcePath: "/scorecard",
      extra: { role },
      ...metaUser,
    });
  } catch (err) {
    console.error("Failed to send Meta ScorecardComplete event:", err);
  }

  // Only pastors count as a Meta Lead: they're the decision-makers who can
  // buy. Other roles still get the full scorecard, just no Lead event. No
  // eventId back to the client means the browser pixel skips it too.
  if (role !== "Pastor") {
    return { status: "success", completeEventId, pdfUrl };
  }

  const eventId = randomUUID();
  try {
    await sendGenericLeadEvent({
      eventId,
      contentName: "Social Media Scorecard",
      sourcePath: "/scorecard",
      email,
      phone,
      userAgent: headersList.get("user-agent"),
      ipAddress: headersList.get("x-forwarded-for")?.split(",")[0]?.trim(),
    });
  } catch (err) {
    console.error("Failed to send Meta Conversions API event (scorecard):", err);
  }

  return { status: "success", eventId, completeEventId, pdfUrl };
}

export type NpsState = {
  status: "idle" | "success" | "error";
  message?: string;
};

// Quick "how likely are you to recommend us" survey at /nps. Every response
// emails Joe; if ZAPIER_WEBHOOK_NPS is set, it's also sent to that Zap
// (e.g. to add a row to a Google Sheet). Not a lead, so no Meta tracking.
export async function submitNps(
  _prevState: NpsState,
  formData: FormData,
): Promise<NpsState> {
  const score = Number(formData.get("score"));
  const reason = String(formData.get("reason") ?? "").trim().slice(0, 2000);
  const parish = String(formData.get("parish") ?? "").trim().slice(0, 200);

  if (!Number.isInteger(score) || score < 0 || score > 10) {
    return { status: "error", message: "Please pick a number from 0 to 10." };
  }

  const category = score >= 9 ? "Promoter" : score >= 7 ? "Passive" : "Detractor";
  const submittedAt = new Date().toISOString();

  const [mail, zapier] = await Promise.allSettled([
    (async () => {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: "Parish Media Company <onboarding@resend.dev>",
        to: NOTIFY_EMAIL,
        subject: `NPS: ${score}/10 (${category})${parish ? ` from ${parish}` : ""}`,
        text: [
          `Score: ${score}/10 (${category})`,
          `Parish: ${parish || "(not given)"}`,
          `Why: ${reason || "(no comment)"}`,
          `Submitted: ${submittedAt}`,
        ].join("\n"),
      });
      if (error) throw new Error(JSON.stringify(error));
    })(),
    process.env.ZAPIER_WEBHOOK_NPS
      ? notifyZapier(
          { score: String(score), category, reason, parish, submittedAt },
          "ZAPIER_WEBHOOK_NPS",
        )
      : Promise.resolve(),
  ]);

  if (zapier.status === "rejected") {
    console.error("Failed to notify Zapier webhook (nps):", zapier.reason);
  }
  if (mail.status === "rejected") {
    console.error("Failed to send NPS email:", mail.reason);
    if (zapier.status === "rejected" || !process.env.ZAPIER_WEBHOOK_NPS) {
      return {
        status: "error",
        message:
          "Something went wrong sending your answer. Please try again or email joe@parishmediacompany.com.",
      };
    }
  }

  return { status: "success" };
}

// ---------------------------------------------------------------------------
// Free website redesign (/free-website)
// ---------------------------------------------------------------------------

export type FreeWebsiteState = {
  status: "idle" | "success" | "error";
  message?: string;
  // Shared with the browser pixel's Lead so Meta dedupes the two.
  eventId?: string;
  // ISO date the new site is promised by (72 weekday hours from now).
  deliverBy?: string;
};

// Tells Joe about a request. The Zap behind ZAPIER_WEBHOOK_FREE_WEBSITE
// (when set) adds the lead to the CRM and starts the build; the Resend email
// is a backup heads-up. Succeeds if either one gets through, so the visitor
// is never told "error" while one channel still delivered their request.
async function notifyFreeWebsite(subject: string, payload: Record<string, string>): Promise<boolean> {
  let delivered = false;
  if (process.env.ZAPIER_WEBHOOK_FREE_WEBSITE) {
    try {
      await notifyZapier(payload, "ZAPIER_WEBHOOK_FREE_WEBSITE");
      delivered = true;
    } catch (err) {
      console.error("Failed to notify Zapier webhook (free website):", err);
    }
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Parish Media Company <onboarding@resend.dev>",
      to: NOTIFY_EMAIL,
      replyTo: payload.email || undefined,
      subject,
      text: Object.entries(payload)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n"),
    });
    if (error) console.error("Resend error (free website):", error);
    else delivered = true;
  } catch (err) {
    console.error("Failed to send free website email:", err);
  }
  return delivered;
}

function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return url.hostname.includes(".") ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function submitFreeWebsiteRequest(
  _prevState: FreeWebsiteState,
  formData: FormData,
): Promise<FreeWebsiteState> {
  const website = normalizeUrl(String(formData.get("website") ?? ""));
  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const role = String(formData.get("role") ?? "");
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 40);
  const organization = String(formData.get("organization") ?? "").trim().slice(0, 200);

  // Same roles as the free guide (FreeWebsiteForm.tsx mirrors FreeGuideForm);
  // "None of the Above" is turned away there too. Defense in depth here.
  if (!(freeGuideRoles as readonly string[]).includes(role) || role === NO_QUALIFYING_ROLE) {
    return { status: "error", message: "Please select your role." };
  }
  if (!name) return { status: "error", message: "Please enter your name." };
  if (phone.replace(/\D/g, "").length < 10) {
    return { status: "error", message: "Please enter a valid phone number." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }
  if (!organization) return { status: "error", message: "Please enter the name of your parish." };
  if (!website) {
    return { status: "error", message: "Please enter your parish’s current website address." };
  }

  // Anyone but the pastor must vouch that he's on board and say how to reach
  // him: the site goes to him, with the requester copied (FreeWebsiteForm.tsx).
  const isPastor = role === "Pastor";
  const pastorName = isPastor ? name : String(formData.get("pastorName") ?? "").trim().slice(0, 120);
  const pastorEmail = isPastor ? email : String(formData.get("pastorEmail") ?? "").trim().slice(0, 200);
  if (!isPastor) {
    if (formData.get("pastorConfirmed") !== "yes") {
      return { status: "error", message: "Please confirm your pastor would like to see a new website." };
    }
    if (!pastorName) return { status: "error", message: "Please enter your pastor’s name." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(pastorEmail)) {
      return { status: "error", message: "Please enter a valid email address for your pastor." };
    }
    if (pastorEmail.toLowerCase() === email.toLowerCase()) {
      return { status: "error", message: "Please enter your pastor’s own email address, not yours." };
    }
  }

  const deliverBy = deliveryDate();
  const delivered = await notifyFreeWebsite(`Free website request: ${organization} (${website})`, {
    timestamp: new Date().toISOString(),
    organization,
    website,
    name,
    role,
    email,
    phone,
    pastorName,
    pastorEmail,
    requestedBy: isPastor ? "Pastor" : `${name} (${role}), copy on delivery`,
    deliverBy: deliverBy.toISOString(),
  });
  if (!delivered) {
    return {
      status: "error",
      message:
        "Something went wrong sending your request. Please email joe@parishmediacompany.com directly.",
    };
  }

  const eventId = randomUUID();
  try {
    const headersList = await headers();
    await sendGenericLeadEvent({
      eventId,
      contentName: "Free Website Redesign",
      sourcePath: "/free-website",
      email,
      phone: phone || undefined,
      userAgent: headersList.get("user-agent"),
      ipAddress: headersList.get("x-forwarded-for")?.split(",")[0]?.trim(),
    });
  } catch (err) {
    console.error("Failed to send Meta Conversions API event (free website):", err);
  }

  return { status: "success", eventId, deliverBy: deliverBy.toISOString() };
}

export type FreeWebsiteDetailsState = {
  status: "idle" | "success" | "error";
  message?: string;
};

// Optional extras from the thank-you page: the style they picked, what they
// want visitors to find, what to fix, and a link to better photos.
export async function submitFreeWebsiteDetails(
  _prevState: FreeWebsiteDetailsState,
  formData: FormData,
): Promise<FreeWebsiteDetailsState> {
  const field = (k: string, max = 1000) => String(formData.get(k) ?? "").trim().slice(0, max);
  const payload = {
    timestamp: new Date().toISOString(),
    type: "details",
    website: field("website", 300),
    email: field("email", 200),
    style: field("style", 40) || "No preference",
    mostImportant: field("mostImportant"),
    fix: field("fix"),
    photos: field("photos", 500),
  };
  const delivered = await notifyFreeWebsite(
    `Free website details: ${payload.website || payload.email || "unknown"}`,
    payload,
  );
  if (!delivered) {
    return {
      status: "error",
      message: "That didn’t go through. Please try again, or reply to our email with these details.",
    };
  }
  return { status: "success" };
}
