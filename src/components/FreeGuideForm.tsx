"use client";

import { useActionState, useEffect, useState } from "react";
import { submitEbookRequest, type EbookRequestState } from "@/app/actions";

const initialState: EbookRequestState = { status: "idle" };

export default function FreeGuideForm() {
  const [state, formAction, pending] = useActionState(
    submitEbookRequest,
    initialState,
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eligible, setEligible] = useState(false);
  const showMore = name.trim() !== "" && email.trim() !== "" && eligible;

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
        <p className="font-serif text-xl font-semibold text-navy">
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
        <p className="font-serif text-xl font-semibold text-navy">
          Get Your Free Copy
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
        <input
          id="phone"
          name="phone"
          type="tel"
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

      <div className="flex items-start gap-3">
        <input
          id="eligible"
          name="eligible"
          type="checkbox"
          required
          value="yes"
          checked={eligible}
          onChange={(e) => setEligible(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-navy/30 text-navy focus:ring-navy"
        />
        <label htmlFor="eligible" className="text-sm text-navy/80">
          I am a priest or deacon at a parish, diocese, or religious order.
        </label>
      </div>

      <p className="text-sm text-navy/50">
        Not eligible?{" "}
        <a
          href="https://www.amazon.com/Social-Media-Catholic-Churches-Practical/dp/B0H3QTWDFL/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-gold decoration-2 underline-offset-4 hover:text-navy"
        >
          Buy the paperback on Amazon
        </a>
        .
      </p>

      <div
        className={`grid overflow-hidden transition-all duration-500 ease-out motion-reduce:transition-none ${
          showMore ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 space-y-5">
          <div>
            <label
              htmlFor="assignment"
              className="block text-sm font-medium text-navy"
            >
              Your Assignment
            </label>
            <input
              id="assignment"
              name="assignment"
              type="text"
              required={showMore}
              placeholder="Pastor, Parochial Vicar, Deacon, Vocations Director, etc."
              className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
            />
          </div>

          <div>
            <label
              htmlFor="organization"
              className="block text-sm font-medium text-navy"
            >
              Name of Parish, Diocese, or Religious Order
            </label>
            <input
              id="organization"
              name="organization"
              type="text"
              required={showMore}
              placeholder="St. Mary Parish, Diocese of Reno, etc."
              className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
            />
          </div>

          <div>
            <label
              htmlFor="cityState"
              className="block text-sm font-medium text-navy"
            >
              City/State of Assignment
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
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-gold px-8 py-3 text-sm font-semibold text-navy shadow-md transition-colors hover:bg-gold/90 disabled:opacity-60"
      >
        {pending ? "Sending..." : "Get the Free Book"}
      </button>
    </form>
  );
}
