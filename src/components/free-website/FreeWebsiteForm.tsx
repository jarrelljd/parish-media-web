"use client";

import { useActionState, useEffect, useState } from "react";
import { submitFreeWebsiteRequest, type FreeWebsiteState } from "@/app/actions";
import { trackLead } from "@/lib/pixel";
import { FREE_WEBSITE_LEAD_KEY } from "@/data/freeWebsite";
import { NO_QUALIFYING_ROLE, freeGuideRoles } from "@/data/freeGuideRoles";

const initialState: FreeWebsiteState = { status: "idle" };

const INPUT =
  "mt-2 w-full rounded-xl border border-navy/15 bg-offwhite px-4 py-3 transition-colors text-navy outline-none focus:border-navy/50 focus:bg-white focus:ring-2 focus:ring-gold/30";

// Same shape as the /free-guide form (FreeGuideForm.tsx): name, phone, email,
// and role first; once those are filled in (and the role qualifies), the
// parish name and website slide open. Same roles list, so "None of the Above"
// is turned away the same way.
export default function FreeWebsiteForm() {
  const [state, formAction, pending] = useActionState(submitFreeWebsiteRequest, initialState);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [website, setWebsite] = useState("");
  const ineligible = role === NO_QUALIFYING_ROLE;
  const showMore = name.trim() !== "" && email.trim() !== "" && role !== "" && !ineligible;
  const done = state.status === "success";

  useEffect(() => {
    if (state.status !== "success") return;
    // Browser half of the Lead; the server sent the same eventId to the
    // Conversions API. Tracking must never block the next step.
    try {
      trackLead("Free Website Redesign", state.eventId);
    } catch (err) {
      console.error("Failed to fire Meta Pixel Lead (free website):", err);
    }
    // The thank-you page greets them, shows the delivery date, and sends the
    // optional details along with their site and email. Kept out of the URL.
    try {
      sessionStorage.setItem(
        FREE_WEBSITE_LEAD_KEY,
        JSON.stringify({ name: name.trim(), website: website.trim(), email: email.trim(), deliverBy: state.deliverBy }),
      );
    } catch {
      // Storage blocked: the thank-you page works out the date itself.
    }
    const go = setTimeout(() => {
      window.location.href = "/free-website/thank-you";
    }, 1500);
    return () => clearTimeout(go);
  }, [state.status, state.eventId, state.deliverBy, name, website, email]);

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-3xl bg-white p-8 shadow-xl shadow-navy/5 ring-1 ring-navy/5 sm:p-10"
    >
      <div>
        <p className="text-balance font-serif text-2xl font-medium tracking-tight text-navy">
          Get Your Free Parish Website Redesign
        </p>
        <p className="mt-1 text-sm text-navy/60">
          Tell us about your role and we&rsquo;ll get started.
        </p>
      </div>

      {state.status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </div>
      )}
      {done && (
        <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          Got it. We&rsquo;re starting on your new website now&hellip;
        </div>
      )}

      <div>
        <label htmlFor="fw-name" className="block text-sm font-medium text-navy">
          Full Name (First and Last)
        </label>
        <input
          id="fw-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="John Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="fw-phone" className="block text-sm font-medium text-navy">
          Phone Number
        </label>
        <input
          id="fw-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          pattern="^(?:\D*\d){10,}\D*$"
          title="Please enter a valid phone number (at least 10 digits)"
          placeholder="(555) 123-4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="fw-email" className="block text-sm font-medium text-navy">
          Email
        </label>
        <input
          id="fw-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
          title="Please enter a valid email address (e.g. name@example.com)"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="fw-role" className="block text-sm font-medium text-navy">
          Your Role
        </label>
        <select
          id="fw-role"
          name="role"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={`${INPUT} ${role === "" ? "text-navy/50" : "text-navy"}`}
        >
          <option value="" disabled>
            Select your role
          </option>
          {freeGuideRoles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {ineligible && (
          <p className="mt-3 rounded-lg bg-gold/10 px-4 py-3 text-sm text-navy/80">
            The free redesign is only for the parish roles listed&nbsp;above.
          </p>
        )}
      </div>

      <div
        className={`grid overflow-hidden transition-all duration-500 ease-out motion-reduce:transition-none ${
          showMore ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 space-y-5">
          <div>
            <label htmlFor="fw-organization" className="block text-sm font-medium text-navy">
              Name of Parish
            </label>
            <input
              id="fw-organization"
              name="organization"
              type="text"
              required={showMore}
              placeholder="St. Mary Parish"
              className={INPUT}
            />
          </div>

          <div>
            <label htmlFor="fw-website" className="block text-sm font-medium text-navy">
              Current Parish Website
            </label>
            <input
              id="fw-website"
              name="website"
              type="text"
              inputMode="url"
              autoComplete="url"
              required={showMore}
              placeholder="stmaryparish.org"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={INPUT}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending || done || ineligible}
        className={`w-full rounded-full bg-gold px-8 py-3.5 text-base font-semibold text-navy shadow-lg shadow-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/40 disabled:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
          ineligible ? "disabled:opacity-60" : "disabled:cursor-wait"
        }`}
      >
        {pending || done ? (
          <span className="inline-flex items-center justify-center gap-2.5">
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-navy/25 border-t-navy motion-reduce:animate-none"
              aria-hidden="true"
            />
            Sending&hellip;
          </span>
        ) : (
          "Redesign My Parish Website"
        )}
      </button>
    </form>
  );
}
