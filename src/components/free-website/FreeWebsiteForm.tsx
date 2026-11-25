"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { submitFreeWebsiteRequest, type FreeWebsiteState } from "@/app/actions";
import { trackLead } from "@/lib/pixel";
import { FREE_WEBSITE_LEAD_KEY, SITE_STYLES, STYLE_OUR_PICK } from "@/data/freeWebsite";
import { NO_QUALIFYING_ROLE, freeGuideRoles } from "@/data/freeGuideRoles";

const initialState: FreeWebsiteState = { status: "idle" };

const INPUT =
  "mt-2 w-full rounded-xl border border-navy/15 bg-offwhite px-4 py-3 transition-colors text-navy outline-none focus:border-navy/50 focus:bg-white focus:ring-2 focus:ring-gold/30";

// Same shape as the /free-guide form (FreeGuideForm.tsx): name, phone, email,
// and role first; once those are filled in (and the role qualifies), the
// parish name and website slide open. Same roles list, so "None of the Above"
// is turned away the same way.
//
// Pastor buy-in, on purpose as friction: the pastor decides, so anyone who
// isn't the pastor must confirm he wants to see a new site, then give his
// name and email. The site goes to him with them copied, so a staff member
// scrolling past won't submit on a whim.
const PASTOR_ROLE = "Pastor";

export default function FreeWebsiteForm() {
  const [state, formAction, pending] = useActionState(submitFreeWebsiteRequest, initialState);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [website, setWebsite] = useState("");
  const [style, setStyle] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [pastorName, setPastorName] = useState("");
  const [pastorEmail, setPastorEmail] = useState("");
  const ineligible = role === NO_QUALIFYING_ROLE;
  const needsPastor = role !== "" && role !== PASTOR_ROLE && !ineligible;
  const pastorReady =
    role === PASTOR_ROLE || (confirmed && pastorName.trim() !== "" && pastorEmail.trim() !== "");
  const showMore = name.trim() !== "" && email.trim() !== "" && role !== "" && !ineligible && pastorReady;
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
        JSON.stringify({
          name: name.trim(),
          website: website.trim(),
          email: email.trim(),
          pastorName: needsPastor ? pastorName.trim() : "",
          deliverBy: state.deliverBy,
        }),
      );
    } catch {
      // Storage blocked: the thank-you page works out the date itself.
    }
    const go = setTimeout(() => {
      window.location.href = "/free-website/thank-you";
    }, 1500);
    return () => clearTimeout(go);
  }, [state.status, state.eventId, state.deliverBy, name, website, email, needsPastor, pastorName]);

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

      {/* Not the pastor: confirm he's on board, then tell us how to reach him. */}
      <div
        className={`grid overflow-hidden transition-all duration-500 ease-out motion-reduce:transition-none ${
          needsPastor ? "grid-rows-[1fr] opacity-100" : "!mt-0 grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-gold/10 px-4 py-4 text-sm leading-relaxed text-navy">
            <input
              type="checkbox"
              name="pastorConfirmed"
              value="yes"
              required={needsPastor}
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              tabIndex={needsPastor ? 0 : -1}
              className="mt-0.5 h-5 w-5 shrink-0 accent-navy"
            />
            <span>
              I confirm our pastor knows about this and would like to see a new
              website for our&nbsp;parish.
            </span>
          </label>
        </div>
      </div>

      <div
        className={`grid overflow-hidden transition-all duration-500 ease-out motion-reduce:transition-none ${
          needsPastor && confirmed ? "grid-rows-[1fr] opacity-100" : "!mt-0 grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 space-y-5">
          <p className="text-sm leading-relaxed text-navy/70">
            We&rsquo;ll send the new website to your pastor and copy you, noting
            that you asked for the free redesign. How can we reach&nbsp;him?
          </p>
          <div>
            <label htmlFor="fw-pastor-name" className="block text-sm font-medium text-navy">
              Pastor&rsquo;s Name
            </label>
            <input
              id="fw-pastor-name"
              name="pastorName"
              type="text"
              required={needsPastor && confirmed}
              tabIndex={needsPastor && confirmed ? 0 : -1}
              placeholder="Fr. Michael Smith"
              value={pastorName}
              onChange={(e) => setPastorName(e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="fw-pastor-email" className="block text-sm font-medium text-navy">
              Pastor&rsquo;s Email
            </label>
            <input
              id="fw-pastor-email"
              name="pastorEmail"
              type="email"
              required={needsPastor && confirmed}
              tabIndex={needsPastor && confirmed ? 0 : -1}
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
              title="Please enter your pastor's email address"
              placeholder="pastor@yourparish.org"
              value={pastorEmail}
              onChange={(e) => setPastorEmail(e.target.value)}
              className={INPUT}
            />
          </div>
        </div>
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

          {/* Style: required, so the build agent always knows what to make.
              "Let us choose" keeps anyone from getting stuck. */}
          <fieldset>
            <legend className="block text-sm font-medium text-navy">Choose a Style</legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {[...SITE_STYLES.map((s) => ({ value: s.name, label: s.name, image: s.example.image })), { value: STYLE_OUR_PICK, label: STYLE_OUR_PICK, image: "" }].map((s) => {
                const on = style === s.value;
                return (
                  <label
                    key={s.value}
                    className={`cursor-pointer overflow-hidden rounded-xl bg-offwhite ring-2 transition-all has-[:focus-visible]:ring-navy ${
                      on ? "ring-navy shadow-md shadow-navy/15" : "ring-navy/10 hover:ring-navy/25"
                    }`}
                  >
                    <input
                      type="radio"
                      name="style"
                      value={s.value}
                      required={showMore}
                      tabIndex={showMore ? 0 : -1}
                      checked={on}
                      onChange={() => setStyle(s.value)}
                      className="sr-only"
                    />
                    <span className="relative block aspect-[16/10] bg-parchment">
                      {s.image ? (
                        <Image src={s.image} alt="" fill sizes="12rem" className="object-cover object-top" />
                      ) : (
                        <span className="flex h-full items-center justify-center px-3 text-center text-xs text-navy/60">
                          We&rsquo;ll pick what fits your parish&nbsp;best
                        </span>
                      )}
                    </span>
                    <span className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-navy">
                      {s.label}
                      {on && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-4 w-4" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                        </svg>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
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
