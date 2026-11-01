"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { Resend } from "resend";
import { NO_QUALIFYING_ROLE, freeGuideRoles } from "@/data/freeGuideRoles";
import { lookupCityPopulation } from "@/lib/cityPopulation";
import {
  buildReport,
  choiceLabel,
  parseAnswers,
  reportToText,
  type ChoiceId,
  type FollowerCount,
} from "@/lib/scorecard";
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
};

// The full report is shown on the page right after opting in, so the lead
// notification isn't what fulfills the promise here. It goes two ways
// (Zapier → CRM, plus a Resend email to Joe as a backup), and the opt-in
// only fails if both do, so a lead is never lost to one broken channel.
export async function submitScorecardOptIn(
  _prevState: ScorecardOptInState,
  formData: FormData,
): Promise<ScorecardOptInState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const role = String(formData.get("role") ?? "");
  const organization = String(formData.get("organization") ?? "").trim();

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
  const report = buildReport(answers, population);
  const reportText = reportToText(report);
  const countLabel = (c: FollowerCount) =>
    typeof c === "number" ? String(c) : c === "none" ? "No account" : "Not sure";
  const label = (id: ChoiceId) => choiceLabel(id, answers[id]);

  const payload: Record<string, string> = {
    timestamp: new Date().toISOString(),
    name,
    email,
    phone,
    role,
    organization,
    city: answers.city,
    state: answers.state,
    cityPopulation: population ? String(population) : "",
    score: String(report.score),
    band: report.band.label,
    ...Object.fromEntries(
      report.categories.map((c) => [`score_${c.id}`, `${c.points}/${c.max}`]),
    ),
    weekendAttendance: String(answers.attendance),
    facebookFollowers: countLabel(answers.fbFollowers),
    instagramFollowers: countLabel(answers.igFollowers),
    typicalEngagement: label("engagement"),
    followerGrowth: label("growth"),
    ads: label("ads"),
    postingFrequency: label("frequency"),
    contentType: label("contentType"),
    pastorOnCamera: label("pastorOnCamera"),
    monthlyInquirers: label("inquirers"),
    newcomerNextStep: label("nextStep"),
    followUpSpeed: label("followUp"),
    socialMediaOwner: label("team"),
    reportText,
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
          "",
          "Answers:",
          ...Object.entries(payload)
            .filter(([k]) =>
              [
                "weekendAttendance", "facebookFollowers", "instagramFollowers",
                "typicalEngagement", "followerGrowth", "ads", "postingFrequency",
                "contentType", "pastorOnCamera", "monthlyInquirers",
                "newcomerNextStep", "followUpSpeed", "socialMediaOwner",
              ].includes(k),
            )
            .map(([k, v]) => `  ${k}: ${v}`),
          "",
          reportText,
        ].join("\n"),
      });
      if (error) throw new Error(JSON.stringify(error));
    })(),
  ]);
  if (zapier.status === "rejected") {
    console.error("Failed to notify Zapier webhook (scorecard):", zapier.reason);
  }
  if (mail.status === "rejected") {
    console.error("Failed to send scorecard lead email:", mail.reason);
  }
  if (zapier.status === "rejected" && mail.status === "rejected") {
    return {
      status: "error",
      message:
        "Something went wrong unlocking your report. Please try again or email joe@parishmediacompany.com.",
    };
  }

  const eventId = randomUUID();
  try {
    const headersList = await headers();
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

  return { status: "success", eventId };
}
