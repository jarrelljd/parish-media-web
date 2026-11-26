import Image from "next/image";
import friarsPhoto from "../../../public/images/clients/capuchin-midwest-province/photo.jpg";
import firstTextExample from "../../../public/images/proof/vocation-text-example-blurred.png";
import CountUp from "./CountUp";
import CompareBars from "./CompareBars";
import TextBubble from "./TextBubble";
import StoryRail, { type StoryStep } from "./StoryRail";
import { ScorecardCard } from "./ScorecardCta";

// Capuchin Franciscans, Midwest Province of St. Joseph. Numbers from Joe's
// 120-day report to the province (Fr. Nathan Linton, Vocations Director).
// Comparison period: the same four months of 2025.

const steps: StoryStep[] = [
  {
    marker: "0",
    label: "Step 0",
    title: "Where they started",
    body: (
      <p>
        Few men were contacting the vocation office, and social media
        wasn&rsquo;t bringing in new ones. In the same four months of 2025, the
        province&rsquo;s pages drew about 140,000 views and 600 new followers,
        and that was with boosted&nbsp;posts.
      </p>
    ),
  },
  {
    marker: "1",
    label: "Step 1",
    title: "We posted content that built trust in the province",
    body: (
      <p>
        Stories about Fr.&nbsp;Nathan and the brothers, discernment tips,
        Come &amp; See photos, and saint videos made to be shared. Every post
        helped men get to know and trust the friars, and the numbers climbed
        without boosting a single&nbsp;post.
      </p>
    ),
    visual: (
      <div className="space-y-7 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-ink/10">
        <CompareBars
          label="Organic views"
          before={140000}
          after={1000000}
          beforeLabel="140K"
          afterLabel="Nearly 1M"
        />
        <CompareBars
          label="New followers"
          before={600}
          after={3100}
          beforeLabel="600 (boosted)"
          afterLabel="3,100 (no boosting)"
        />
      </div>
    ),
  },
  {
    marker: "2",
    label: "Step 2",
    title: "We ran ads inviting men to talk with Fr. Nathan",
    body: (
      <p>
        Nobody signs up for postulancy from a Facebook ad, so we asked for
        something smaller: a conversation with a friar. One tap opened a short
        form with their name and number already filled&nbsp;in.
      </p>
    ),
    visual: (
      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-ink/10">
        <p className="font-serif text-6xl font-medium leading-none text-lapis sm:text-7xl">
          <CountUp to={3.11} decimals={2} prefix="$" />
        </p>
        <p className="mt-3 text-lg text-ink/70">per vocation inquiry</p>
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-ink/10 pt-6">
          <div>
            <p className="font-serif text-3xl font-medium text-ink">
              <CountUp to={436} />
            </p>
            <p className="text-sm text-ink/60">men reached out</p>
          </div>
          <div>
            <p className="font-serif text-3xl font-medium text-ink">
              <CountUp to={1354} prefix="$" />
            </p>
            <p className="text-sm text-ink/60">total ad spend</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    marker: "3",
    label: "Step 3",
    title: "Fr. Nathan texted each man within minutes",
    body: (
      <p>
        About four minutes after each form, an automatic text from
        Fr.&nbsp;Nathan went out. When a man wrote back, Father took over the
        conversation himself. No list of names to chase, and no interest
        cooling while a man waits to hear&nbsp;back.
      </p>
    ),
    visual: (
      <figure className="mx-auto max-w-xs">
        <Image
          src={firstTextExample}
          alt="The automatic first text from Fr. Nathan Linton, inviting a man to share where he is in discerning his vocation"
          sizes="320px"
          className="h-auto w-full drop-shadow-xl"
        />
        <figcaption className="mt-2 text-center text-sm text-ink/55">
          The automatic first&nbsp;text
        </figcaption>
      </figure>
    ),
  },
  {
    marker: "4",
    label: "Step 4",
    title: "21 men signed up for a Come & See",
    body: (
      <p>
        Views and followers are nice. What Fr.&nbsp;Nathan cares about is men
        in the room. A few weeks later, he sent us this&nbsp;text.
      </p>
    ),
    visual: (
      <TextBubble
        text="Dude. I've got 21 guys registered for our October come-and-see"
        caption="Fr. Nathan Linton, texting our team"
      />
    ),
  },
];

export default function CapuchinCaseStudy() {
  return (
    <section id="capuchins" className="scroll-mt-20 px-6 py-20 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <p className="text-base font-semibold text-gold-deep">
              Capuchin Franciscans &middot;{" "}
              <span className="whitespace-nowrap">Midwest Province of St.&nbsp;Joseph</span>
            </p>
            <h2 className="mt-3 text-balance font-serif text-4xl font-medium leading-[1.06] text-ink sm:text-6xl">
              436 men asked about a vocation in 120&nbsp;days
            </h2>
            <p className="mt-5 text-pretty text-xl leading-relaxed text-ink/70">
              Each one asked to talk with the vocations director, at $3.11 per
              inquiry. Here&rsquo;s how it&nbsp;worked.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-2xl shadow-ink/20">
            <Image
              src={friarsPhoto}
              alt="Capuchin friars of the Midwest Province praying together at Mass"
              sizes="(min-width: 1024px) 540px, 100vw"
              className="h-auto w-full"
              placeholder="blur"
            />
          </div>
        </div>

        {/* The story */}
        <div className="mt-16 sm:mt-24">
          <StoryRail steps={steps} />
        </div>

        {/* In his words */}
        <div className="mt-24 grid items-center gap-10 sm:grid-cols-[260px_1fr] sm:gap-14 lg:grid-cols-[300px_1fr]">
          <figure>
            <div className="mx-auto w-full max-w-[260px] rounded-[2rem] bg-ink p-2 shadow-2xl shadow-ink/20 sm:max-w-none">
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[1.6rem] bg-ink">
                <iframe
                  src="https://player.vimeo.com/video/1225765800?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Fr. Nathan Linton testimonial for Parish Media Company"
                  loading="lazy"
                />
              </div>
            </div>
          </figure>
          <div>
            <p className="text-base font-semibold text-gold-deep">In his words</p>
            <h3 className="mt-3 text-balance font-serif text-3xl font-medium leading-tight text-ink sm:text-4xl">
              Fr. Nathan Linton, Vocations&nbsp;Director
            </h3>
            <p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-ink/70">
              Hear what changed for the province&rsquo;s vocation outreach. After
              these results, the province asked us to take on YouTube&nbsp;next.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <ScorecardCard
            heading="Where does your parish’s social media stand?"
            body="The same principles work for parishes. Take the free 3-minute scorecard and get your parish's score out of 100, plus where to start."
          />
        </div>
      </div>
    </section>
  );
}
