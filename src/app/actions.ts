"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { Resend } from "resend";
import {
  sendLeadConversionEvent,
  sendGenericLeadEvent,
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
  const roleOther = String(formData.get("roleOther") ?? "");
  const organization = String(formData.get("organization") ?? "");
  const roleDisplay = role === "Other" && roleOther ? `Other (${roleOther})` : role;

  if (phone.replace(/\D/g, "").length < 10) {
    return {
      status: "error",
      message: "Please enter a valid phone number.",
    };
  }

  try {
    await notifyZapier(
      {
        timestamp: new Date().toISOString(),
        name,
        phone,
        email,
        role: roleDisplay,
        organization,
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

  try {
    const headersList = await headers();
    await sendGenericLeadEvent({
      eventId: randomUUID(),
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

  return { status: "success" };
}

export type BookACallState = {
  status: "idle" | "success" | "error";
  message?: string;
};

// Separate webhook from the free guide's — this Zap only adds the lead to
// Joe's CRM, it does NOT send the book, since someone booking a call
// directly hasn't asked for it. See src/components/BookACallModal.tsx.
export async function submitBookACallRequest(
  _prevState: BookACallState,
  formData: FormData,
): Promise<BookACallState> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const role = String(formData.get("role") ?? "");
  const roleOther = String(formData.get("roleOther") ?? "");
  const organization = String(formData.get("organization") ?? "");
  const roleDisplay = role === "Other" && roleOther ? `Other (${roleOther})` : role;

  try {
    await notifyZapier(
      {
        timestamp: new Date().toISOString(),
        name,
        email,
        role: roleDisplay,
        organization,
      },
      "ZAPIER_WEBHOOK_BOOK_A_CALL",
    );
  } catch (err) {
    console.error("Failed to notify Zapier webhook (book a call):", err);
    return {
      status: "error",
      message:
        "Something went wrong. Please email joe@parishmediacompany.com directly.",
    };
  }

  try {
    const headersList = await headers();
    await sendGenericLeadEvent({
      eventId: randomUUID(),
      contentName: "Book a Call Request",
      sourcePath: "/book-a-call",
      email,
      userAgent: headersList.get("user-agent"),
      ipAddress: headersList.get("x-forwarded-for")?.split(",")[0]?.trim(),
    });
  } catch (err) {
    console.error("Failed to send Meta Conversions API event (book a call):", err);
  }

  return { status: "success" };
}
