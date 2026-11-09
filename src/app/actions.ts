"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { Resend } from "resend";
import { NO_QUALIFYING_ROLE, freeGuideRoles } from "@/data/freeGuideRoles";
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
import { createReportQuery } from "@/lib/scorecardLink";
import { letterGreeting, writeScorecardLetter } from "@/lib/scorecardLetter";
import { buildScorecardDoc, coverEmailHtml, docToText } from "@/lib/scorecardReport";
import {
  sendLeadConversionEvent,
  sendGenericLeadEvent,
  sendGenericScheduleEvent,
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
  // Optional. Stored without the "@" so it can be pasted into Instagram search.
  const instagram = String(formData.get("instagram") ?? "").trim().replace(/^@+/, "");

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
        instagram,
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
  eventId?: string;
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
      message: "The full report is only for the roles listed.",
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
  const letter = await writeScorecardLetter(doc, answers, profile, { role });
  const letterHi = letterGreeting(name, role);

  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "parishmediacompany.com";
  const proto = headersList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const pdfUrl = `${proto}://${host}/api/scorecard/report?${createReportQuery({
    a: answers,
    n: name,
    o: organization,
    r: role,
    t: Date.now(),
    l: letter,
  })}`;

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
    ...letter.body.map((p) => p.replace(/\*/g, "")),
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
    reportPdfUrl: pdfUrl,
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

  return { status: "success", eventId, pdfUrl };
}
