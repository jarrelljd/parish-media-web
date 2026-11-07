import Image from "next/image";
import type { ReactNode } from "react";
import { FacebookIcon, InstagramIcon } from "./SocialIcons";
import adOnPhone from "../../public/images/proof/ad-on-phone.png";
import reportOnLaptop from "../../public/images/proof/report-on-laptop.png";
import organicReport from "../../public/images/proof/st-rose-impact-report-organic.jpg";
import homilyClip from "../../public/images/proof/core-four/homily-clip.jpg";
import activityPost from "../../public/images/proof/core-four/activity-post.jpg";
import connectionPost from "../../public/images/proof/core-four/connection-post.jpg";
import flyerPost from "../../public/images/proof/core-four/flyer.jpg";

// "What we do" on the Social Media page: weekly posts (the Core Four) build
// trust, paid ads (the Big Three) fill the parish's biggest needs, and
// monthly tracking keeps both improving.

// Each example is a real post we made for a client parish.
const CORE_FOUR = [
  { name: "Homily clips", note: "Short videos from your Sunday homilies", image: homilyClip, alt: "Homily clip Reel from St. Joseph Parish, Los Banos" },
  { name: "Activity posts", note: "Photos and video of parish life", image: activityPost, alt: "Confirmation class group photo posted by St. Joseph Parish, Los Banos" },
  { name: "Connection posts", note: "Faces and stories people relate to", image: connectionPost, alt: "Thank-you post for St. Joseph Parish's longtime office manager" },
  { name: "Engaging flyers", note: "A little advertising for smaller events", image: flyerPost, alt: "Parish Fall Bake Sale flyer for Ss. Peter & Paul Parish, Omaha" },
];

const BIG_THREE = [
  { name: "Event registration", goal: "Fill your biggest events", icon: "calendar" },
  { name: "Volunteer", goal: "Find the helpers you need", icon: "hands" },
  { name: "Plan Your Visit", goal: "Bring newcomers to Mass", icon: "door" },
] as const;

const TRACKED = [
  "What each sign-up cost",
  "Which posts grow your following",
  "Where next month’s ad budget should go",
];

type IconName = (typeof BIG_THREE)[number]["icon"] | "check" | "arrow";

// Simple line icons, drawn in currentColor.
function Icon({ name, className = "h-6 w-6" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4" />
      </>
    ),
    hands: (
      <>
        <circle cx="8" cy="7" r="2.5" />
        <circle cx="16" cy="7" r="2.5" />
        <path d="M3 20v-3a4 4 0 0 1 4-4h2a4 4 0 0 1 3 1.4A4 4 0 0 1 15 13h2a4 4 0 0 1 4 4v3" />
      </>
    ),
    door: (
      <>
        <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M3 21h18" />
        <circle cx="14.5" cy="12.5" r="0.9" fill="currentColor" />
      </>
    ),
    check: <path d="M5 12.5l4.5 4.5L19 7" />,
    arrow: <path d="M12 4v15M6 13l6 6 6-6" />,
  };
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

// The arrow between cards, with the reason one step leads to the next.
function Connector({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center py-6 text-center sm:py-8">
      <span className="h-8 w-px bg-gradient-to-b from-transparent to-gilt/70" />
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gilt/50 text-gilt">
        <Icon name="arrow" className="h-5 w-5" />
      </span>
      <p className="mt-3 max-w-md text-balance font-serif text-xl italic text-vellum/70">{children}</p>
    </div>
  );
}

// Step number plus a big colored pill saying what kind of work it is.
function StepLabel({ n, children, pill }: { n: number; children: ReactNode; pill: string }) {
  return (
    <p className="flex flex-wrap items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rubric font-serif text-2xl text-vellum">
        {n}
      </span>
      <span className={`rounded-full px-5 py-2 text-base font-bold uppercase tracking-[0.12em] sm:text-lg ${pill}`}>
        {children}
      </span>
    </p>
  );
}

export default function WhatWeDo() {
  return (
    <section className="relative overflow-hidden bg-ink px-6 py-20 text-vellum sm:py-28 lg:px-10">
      {/* Soft glow behind the cards */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-40 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-lapis/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-xl italic text-[#e3a196]">What we do</p>
          <h2 className="mt-3 text-balance font-serif text-4xl font-medium leading-[1.08] sm:text-6xl">
            The Core Four and the Big&nbsp;Three.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-xl leading-relaxed text-vellum/80 sm:text-2xl">
            Free posts build trust. Paid ads fill your biggest needs. We track
            all of it, so you know what&rsquo;s&nbsp;working.
          </p>
        </div>

        {/* 1. The Core Four */}
        <article className="mt-14 rounded-2xl bg-vellum p-6 text-ink shadow-2xl shadow-black/40 sm:p-10 lg:p-12">
          <div className="max-w-3xl">
            <StepLabel n={1} pill="bg-[#2f6b3f] text-white">Organic &middot; Free</StepLabel>
            <h3 className="mt-4 font-serif text-4xl font-medium sm:text-5xl">The Core Four</h3>
            <p className="mt-3 flex items-center gap-1.5 text-base text-ink/55">
              <FacebookIcon className="h-4 w-4" />
              <InstagramIcon className="h-4 w-4" />
              Facebook &amp; Instagram, every&nbsp;week
            </p>
            <p className="mt-5 max-w-xl text-balance text-xl leading-relaxed text-ink/80">
              Four kinds of free posts that help people know, like, and trust
              your&nbsp;parish.
            </p>
          </div>
          {/* Real posts from client parishes, one of each kind */}
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {CORE_FOUR.map((c, i) => (
              <li key={c.name} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ink shadow-lg shadow-ink/20 ring-1 ring-ink/10 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                  <Image src={c.image} alt={c.alt} fill sizes="(min-width: 1024px) 260px, 45vw" className="object-cover" />
                </div>
                <p className="mt-4 flex items-baseline gap-1.5 font-serif text-xl font-semibold leading-tight sm:gap-2 sm:text-2xl">
                  <span className="text-rubric">{i + 1}.</span>
                  {c.name}
                </p>
                <p className="mt-1 text-pretty text-base leading-snug text-ink/65">{c.note}</p>
              </li>
            ))}
          </ul>
        </article>

        <Connector>Free posts warm people up, so they&rsquo;re ready when you&nbsp;ask.</Connector>

        {/* 2. The Big Three */}
        <article className="grid items-center gap-10 rounded-2xl bg-lapis p-6 shadow-2xl shadow-black/40 ring-1 ring-vellum/10 sm:p-10 lg:grid-cols-[1fr_1.25fr] lg:gap-14 lg:p-12">
          <figure className="order-2 mx-auto w-full max-w-xs lg:order-1">
            <Image src={adOnPhone} alt="Facebook ad inviting St. Patrick's parishioners and friends to the annual parish picnic" sizes="(min-width: 1024px) 320px, 80vw" className="h-auto w-full drop-shadow-2xl transition-transform duration-500 lg:-rotate-2 lg:hover:rotate-0" />
            <figcaption className="mt-2 text-center font-serif text-base italic text-vellum/60">
              St. Patrick&rsquo;s, South Hadley, MA
            </figcaption>
          </figure>
          <div className="order-1 lg:order-2">
            <StepLabel n={2} pill="bg-gilt text-ink">Paid ads</StepLabel>
            <h3 className="mt-4 font-serif text-4xl font-medium sm:text-5xl">The Big Three</h3>
            <p className="mt-3 flex items-center gap-1.5 text-base text-vellum/60">
              <FacebookIcon className="h-4 w-4" />
              <InstagramIcon className="h-4 w-4" />
              Facebook &amp; Instagram ad campaigns
            </p>
            <p className="mt-5 max-w-lg text-balance text-xl leading-relaxed text-vellum/85">
              For your parish&rsquo;s biggest needs, we run paid ads that get
              people to sign up and show&nbsp;up.
            </p>
            <ul className="mt-7 space-y-3">
              {BIG_THREE.map((b) => (
                <li
                  key={b.name}
                  className="group flex items-center gap-4 rounded-xl border border-vellum/15 bg-vellum/[0.06] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-gilt/60 hover:bg-vellum/[0.12]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gilt/20 text-[#e2c477] transition-colors group-hover:bg-gilt group-hover:text-ink">
                    <Icon name={b.icon} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-balance font-serif text-2xl font-semibold leading-tight">{b.name} campaigns</span>
                    <span className="mt-1 block text-base text-vellum/70">{b.goal}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <Connector>Every response is tracked, so every dollar is spent where it&nbsp;works.</Connector>

        {/* 3. Tracking & Reporting */}
        <article className="grid items-center gap-10 rounded-2xl border border-gilt/40 bg-vellum-deep p-6 text-ink shadow-2xl shadow-black/40 sm:p-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14 lg:p-12">
          <div>
            <StepLabel n={3} pill="bg-lapis text-vellum">Every month</StepLabel>
            <h3 className="mt-4 font-serif text-4xl font-medium sm:text-5xl">Tracking &amp; Reporting</h3>
            <p className="mt-5 max-w-xl text-balance text-xl leading-relaxed text-ink/80">
              We track every post and every ad, so your ad dollars go where they
              work best. Each month you get a simple report&nbsp;showing:
            </p>
            <ul className="mt-6 space-y-3">
              {TRACKED.map((t) => (
                <li key={t} className="flex items-center gap-3 text-xl">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lapis text-vellum">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <span className="text-balance">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Both sides of the report: free posts and paid ads */}
          <figure className="mx-auto w-full max-w-md space-y-5">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.12em] text-[#2f6b3f]">Free posts</p>
              <div className="overflow-hidden rounded-xl shadow-xl shadow-ink/15 ring-1 ring-ink/10">
                <Image src={organicReport} alt="Monthly report for St. Rose Catholic Church: organic views, new followers, and posts published" sizes="(min-width: 1024px) 448px, 90vw" className="h-auto w-full" />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.12em] text-gold-deep">Paid ads</p>
              <div className="relative aspect-[1080/780] overflow-hidden rounded-xl bg-white shadow-xl shadow-ink/15 ring-1 ring-ink/10">
                <Image src={reportOnLaptop} alt="Ad results dashboard on a laptop: 126 leads at $1.40 per lead" fill sizes="(min-width: 1024px) 448px, 90vw" className="object-cover object-center" />
              </div>
            </div>
            <figcaption className="text-center font-serif text-base italic text-ink/60">
              Real reports from client parishes.
            </figcaption>
          </figure>
        </article>
      </div>
    </section>
  );
}
