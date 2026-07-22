"use client";

import { useActionState, useEffect } from "react";
import { submitContactForm, type ContactFormState } from "@/app/actions";

const CALENDLY_URL = "https://calendly.com/parishmedia/consult";

const initialState: ContactFormState = { status: "idle" };

export default function Contact() {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") {
      const timer = setTimeout(() => {
        window.location.href = CALENDLY_URL;
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.status]);

  return (
    <section id="contact" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
          <h2 className="mt-8 font-serif text-3xl font-semibold text-navy sm:text-4xl">
            Contact
          </h2>
          <p className="mt-4 text-lg text-navy/70">
            Tell us a bit about your parish or office, and we&rsquo;ll follow
            up.
          </p>
        </div>

        {state.status === "success" ? (
          <div className="mt-10 rounded-2xl border border-navy/10 bg-white p-8 text-center shadow-sm">
            <p className="font-serif text-xl font-semibold text-navy">
              Thank you!
            </p>
            <p className="mt-3 text-navy/70">
              We&rsquo;ve received your message. Taking you to our booking
              page now...
            </p>
            <a
              href={CALENDLY_URL}
              className="mt-6 inline-block rounded-full bg-navy px-8 py-3 text-sm font-medium text-offwhite transition-colors hover:bg-navy/90"
            >
              Book a Time Now
            </a>
          </div>
        ) : (
          <form
            action={formAction}
            className="mt-10 space-y-5 rounded-2xl border border-navy/10 bg-white p-8 shadow-sm"
          >
            {state.status === "error" && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {state.message}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-navy"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
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
                className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
              />
            </div>

            <div>
              <label
                htmlFor="helpType"
                className="block text-sm font-medium text-navy"
              >
                What do you need help with?
              </label>
              <select
                id="helpType"
                name="helpType"
                required
                defaultValue=""
                className="mt-2 w-full rounded-lg border border-navy/20 bg-offwhite px-4 py-2.5 text-navy outline-none focus:border-navy"
              >
                <option value="" disabled>
                  Select one...
                </option>
                <option value="Parish social media & ads">
                  Parish social media &amp; ads
                </option>
                <option value="Vocation office outreach">
                  Vocation office outreach
                </option>
                <option value="Bulletin or flyer design">
                  Bulletin or flyer design
                </option>
                <option value="Diocese engagement">Diocese engagement</option>
                <option value="Something else">Something else</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-navy px-8 py-3 text-sm font-medium text-offwhite transition-colors hover:bg-navy/90 disabled:opacity-60"
            >
              {pending ? "Sending..." : "Get Started"}
            </button>

            <p className="text-center text-xs text-navy/50">
              Having trouble? Email{" "}
              <a
                href="mailto:joe@parishmediacompany.com"
                className="underline decoration-gold decoration-2 underline-offset-4"
              >
                joe@parishmediacompany.com
              </a>{" "}
              directly.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
