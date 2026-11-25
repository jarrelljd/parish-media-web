"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { submitFreeWebsiteDetails, type FreeWebsiteDetailsState } from "@/app/actions";
import {
  FREE_WEBSITE_LEAD_KEY,
  deliveryDate,
  formatDeliveryDate,
} from "@/data/freeWebsite";

type Lead = { name?: string; cityState?: string; email?: string; pastorName?: string; deliverBy?: string; notionPageId?: string };

const initialState: FreeWebsiteDetailsState = { status: "idle" };
const h2 = "font-serif text-3xl font-medium leading-[1.1] text-balance sm:text-4xl";
const input =
  "mt-2 w-full rounded-xl border border-ink/15 bg-vellum/60 px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-lapis/50 focus:bg-white focus:ring-2 focus:ring-gilt-light/40";


// When a staff member asked, the site goes to the pastor with them copied.
function nextSteps(pastor: string) {
  return [
    { title: "We build your new website", body: "We find your current site and build from it, plus anything you tell us below." },
    pastor
      ? { title: `We send it to ${pastor}`, body: "When it’s ready, we’ll call him and email him the link with a walkthrough, with you copied." }
      : { title: "We call you", body: "When it’s ready, we’ll give you a call and email you the link with a walkthrough of your new site." },
    { title: "Love it? Just reply", body: "We’ll explain what it takes to make it live. No pressure either way." },
  ];
}

// Parish leaders' titles read better in the greeting than a first name
// alone ("Thank you, Fr. John").
function greetingName(full: string): string {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "";
  const title = /^(fr|father|dcn|deacon|msgr|rev|sr|br)\.?$/i.test(parts[0]);
  return title && parts[1] ? `${parts[0]} ${parts[1]}` : parts[0];
}

export default function ThankYouContent() {
  const [lead, setLead] = useState<Lead>({});
  const [state, formAction, pending] = useActionState(submitFreeWebsiteDetails, initialState);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(FREE_WEBSITE_LEAD_KEY);
      // Reading browser storage has to wait until after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLead(JSON.parse(raw));
    } catch {
      // Storage blocked: generic greeting and a freshly worked-out date.
    }
  }, []);

  const when = formatDeliveryDate(lead.deliverBy ? new Date(lead.deliverBy) : deliveryDate());
  const name = lead.name ? greetingName(lead.name) : "";
  const sent = state.status === "success";

  return (
    <>
      <section className="bg-ink px-6 pb-20 pt-14 text-center text-vellum sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-3xl">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gilt-light text-ink shadow-lg shadow-black/40">
            <Check className="h-7 w-7" strokeWidth={3} aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-balance font-serif text-[2.2rem] font-medium leading-[1.08] sm:text-6xl">
            {name ? <>Thank you, {name}. We&rsquo;re building your new&nbsp;website.</> : <>Thank you. We&rsquo;re building your new&nbsp;website.</>}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-vellum/80 sm:text-xl">
            {lead.pastorName ? <>We&rsquo;ll send it to {lead.pastorName}, with you copied, by</> : <>Look for it in your inbox by</>}
          </p>
          <p className="mt-2 font-serif text-3xl font-medium text-gilt-light sm:text-4xl">{when}</p>
        </div>
      </section>

      {/* Optional details */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className={h2}>Want it made just for&nbsp;you?</h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-ink/70">
              Everything here is optional. Skip it and we&rsquo;ll work from
              your current&nbsp;website.
            </p>
          </div>

          {sent ? (
            <div role="status" className="mx-auto mt-10 max-w-xl rounded-3xl bg-white px-8 py-10 text-center shadow-xl shadow-ink/10 ring-1 ring-ink/5">
              <p className="font-serif text-2xl font-medium">Got it, thank you.</p>
              <p className="mt-2 text-ink/70">We&rsquo;ll build your new site with this in&nbsp;mind.</p>
            </div>
          ) : (
            <form action={formAction} className="mt-10 space-y-8 rounded-3xl bg-white p-7 shadow-xl shadow-ink/10 ring-1 ring-ink/5 sm:p-10">
              <input type="hidden" name="cityState" value={lead.cityState ?? ""} />
              <input type="hidden" name="email" value={lead.email ?? ""} />
              <input type="hidden" name="notionPageId" value={lead.notionPageId ?? ""} />

              <div>
                <label htmlFor="ty-important" className="block text-lg font-semibold text-ink">
                  What do you most want people to find on your&nbsp;site?
                </label>
                <textarea id="ty-important" name="mostImportant" rows={3} placeholder="Mass times, our school, how to join the parish…" className={input} />
              </div>

              <div>
                <label htmlFor="ty-fix" className="block text-lg font-semibold text-ink">
                  Anything you&rsquo;d like us to fix or&nbsp;change?
                </label>
                <textarea id="ty-fix" name="fix" rows={3} placeholder="Our Mass times are out of date, the photos are old…" className={input} />
              </div>

              <div>
                <label htmlFor="ty-photos" className="block text-lg font-semibold text-ink">
                  Have better photos?
                </label>
                <p className="mt-1 text-sm text-ink/55">Paste a link to a Google Drive, Dropbox, or Flickr folder.</p>
                <input id="ty-photos" name="photos" type="url" placeholder="https://drive.google.com/…" className={input} />
              </div>

              {state.status === "error" && (
                <div className="rounded-xl bg-rubric/10 px-4 py-3 text-sm text-rubric">{state.message}</div>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-full bg-lapis px-8 py-4 text-base font-semibold text-vellum shadow-lg shadow-lapis/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-lapis-deep hover:shadow-xl disabled:translate-y-0 disabled:cursor-wait motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {pending ? "Sending…" : "Send These Details"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* What happens next */}
      <section className="bg-vellum-deep px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className={h2}>What happens&nbsp;next</h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {nextSteps(lead.pastorName ?? "").map((s, i) => (
              <li key={s.title}>
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lapis font-serif text-xl font-medium text-vellum shadow-lg shadow-lapis/30">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-balance font-serif text-2xl font-semibold">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-pretty text-lg leading-relaxed text-ink/70">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Bonus while they wait */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto grid max-w-4xl items-center gap-10 sm:grid-cols-[auto_1fr]">
          <Image
            src="/images/free-guide/book-hardcover.png"
            alt="Social Media for Catholic Churches, by Joe Jarrell"
            width={220}
            height={300}
            className="mx-auto h-auto w-40 sm:w-52"
          />
          <div className="text-center sm:text-left">
            <h2 className={h2}>While you wait, a free&nbsp;book</h2>
            <p className="mt-4 text-pretty text-lg text-ink/70">
              <span className="font-semibold text-ink">Social Media for Catholic Churches</span>{" "}
              is our practical guide to reaching more young families through
              Facebook and Instagram.
            </p>
            <a
              href="/downloads/social-media-for-catholic-churches.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-lapis px-8 py-3.5 font-semibold text-vellum shadow-lg shadow-lapis/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-lapis-deep hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Download the Free Book
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
