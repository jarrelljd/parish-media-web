"use server";

import { Resend } from "resend";

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
};

export async function submitEventRSVP(
  eventName: string,
  parishName: string,
  _prevState: EventRSVPState,
  formData: FormData,
): Promise<EventRSVPState> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const phone = String(formData.get("phone") ?? "");

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Parish Media Company <onboarding@resend.dev>",
      to: NOTIFY_EMAIL,
      replyTo: email || undefined,
      subject: `New RSVP: ${eventName} (${parishName})`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nEvent: ${eventName}\nParish: ${parishName}`,
    });

    if (error) {
      console.error("Resend error (event RSVP):", error);
      return {
        status: "error",
        message: "Something went wrong submitting your RSVP. Please try again.",
      };
    }
  } catch (err) {
    console.error("Failed to send event RSVP email:", err);
    return {
      status: "error",
      message: "Something went wrong submitting your RSVP. Please try again.",
    };
  }

  return { status: "success" };
}
