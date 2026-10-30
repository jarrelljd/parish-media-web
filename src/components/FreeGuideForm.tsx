"use client";

import { useActionState, useEffect, useState } from "react";
import { submitEbookRequest, type EbookRequestState } from "@/app/actions";
import {
  AMAZON_BOOK_URL,
  NO_QUALIFYING_ROLE,
  freeGuideRoles,
} from "@/data/freeGuideRoles";

const initialState: EbookRequestState = { status: "idle" };

export default function FreeGuideForm() {
  const [state, formAction, pending] = useActionState(
    submitEbookRequest,
    initialState,
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const ineligible = role === NO_QUALIFYING_ROLE;
  const showMore =
    name.trim() !== "" && email.trim() !== "" && role !== "" && !ineligible;

  useEffect(() => {
    if (state.status === "success") {
      const timer = setTimeout(() => {
        window.location.href = "/free-guide/free-consult";
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-navy/10 bg-white p-8 text-center shadow-sm">
        <p className="text-balance font-serif text-xl font-semibold text-navy">
          Thank you!
        </p>
        <p className="mt-3 text-navy/70">
          Your copy is on its way to your inbox. Taking you to book a quick
          call&hellip;
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-navy/10 bg-white p-8 shadow-sm"
    >
      <div>
        <p className="text-balance font-serif text-xl font-semibold text-navy">
          Get the Free Social Media Guide for Catholic Churches
        </p>
        <p className="mt-1 text-sm text-navy/60">
          Tell us about your role and we&rsquo;ll send it your way.
        </p>
      </div>

      {state.status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-navy">
          Full Name (First and Last)
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="John Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-navy">
          Phone Number
        </label>
        <p id="phone-help" className="mt-1 text-xs text-navy/50">
          Phone number for your free copy and, if appropriate, a quick
          follow-up from our&nbsp;team.
        </p>
        <input
          id="phone"
          name="phone"
          type="tel"
          aria-describedby="phone-help"
          required
          pattern="^(?:\D*\d){10,}\D*$"
          title="Please enter a valid phone number (at least 10 digits)"
          placeholder="(555) 123-4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-navy"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
          title="Please enter a valid email address (e.g. name@example.com)"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-navy">
          Your Role
        </label>
        <select
          id="role"
          name="role"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={`mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 outline-none focus:border-navy ${
            role === "" ? "text-navy/50" : "text-navy"
          }`}
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
            The free digital copy is only for the roles listed above. You
            can{" "}
            <a
              href={AMAZON_BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-gold decoration-2 underline-offset-4 hover:text-navy"
            >
              buy the book on&nbsp;Amazon
            </a>
            .
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
            <label
              htmlFor="organization"
              className="block text-sm font-medium text-navy"
            >
              Name of Parish
            </label>
            <input
              id="organization"
              name="organization"
              type="text"
              required={showMore}
              placeholder="St. Mary Parish"
              className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
            />
          </div>

          <div>
            <label
              htmlFor="cityState"
              className="block text-sm font-medium text-navy"
            >
              City/State
            </label>
            <input
              id="cityState"
              name="cityState"
              type="text"
              required={showMore}
              placeholder="Reno, NV"
              className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
            />
          </div>

          <div>
            <label
              htmlFor="instagram"
              className="block text-sm font-medium text-navy"
            >
              Instagram Handle{" "}
              <span className="font-normal text-navy/50">(optional)</span>
            </label>
            <input
              id="instagram"
              name="instagram"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="@yourhandle"
              className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending || ineligible}
        className="w-full rounded-full bg-gold px-8 py-3 text-sm font-semibold text-navy shadow-md transition-colors hover:bg-gold/90 disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send Me the Free Digital Copy"}
      </button>
    </form>
  );
}
