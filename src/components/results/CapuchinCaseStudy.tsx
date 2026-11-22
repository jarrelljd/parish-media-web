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
        In the same four months of 2025, the province&rsquo;s Facebook and
        Instagram pages drew about 140,000 views and 600 new followers. That
        was with boosted&nbsp;posts.
      </p>
    ),
  },
  {
    marker: "1",
    label: "Step 1",
    title: "We posted content that built trust in the\u00a0province",
    body: (
      <>
        <p>
          Every post had a job: helping men get to know, like, and trust the
          friars. Stories about Fr.&nbsp;Nathan and the brothers. Practical
          tips for discerning. Group photos from Come &amp; See weekends. And
          saint videos made to be shared&nbsp;widely.
        </p>
        <p>The numbers climbed without boosting a single&nbsp;post.</p>
      </>
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
    title: "We ran ads inviting men to talk with Fr.\u00a0Nathan about their\u00a0vocation",
    body: (
      <>
        <p>
          Nobody signs up for postulancy from a Facebook ad. So we asked for
          something much smaller: a conversation with a
          Capuchin&nbsp;friar.
        </p>
        <p>
          Targeted Facebook and Instagram ads offered men the chance to talk
          with Fr.&nbsp;Nathan. One tap opened a short form with their name
          and number already filled in, so saying yes took&nbsp;seconds.
        </p>
      </>
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
    title: "Fr.\u00a0Nathan texted each man within\u00a0minutes",
    body: (
      <>
        <p>
          About four minutes after a man filled out the form, a text from
          Fr.&nbsp;Nathan went out automatically. When the man wrote back,
          Father picked up the conversation himself, like any
          other&nbsp;text.
        </p>
        <p>
          No spreadsheet of names to chase, and no one waiting days to hear
          back while his interest&nbsp;cools.
        </p>
      </>
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
    title: "21 men signed up for a Come &\u00a0See",
    body: (
      <p>
        More views and followers are nice. What Fr.&nbsp;Nathan cares about is
        men in the room. A few weeks after the campaign, he sent us
        this&nbsp;text.
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
        <div className="max-w-3xl">
          <p className="text-base font-semibold text-gold-deep">
            Capuchin Franciscans &middot;{" "}
            <span className="whitespace-nowrap">Midwest Province of St.&nbsp;Joseph</span>
          </p>
          <h2 className="mt-3 text-balance font-serif text-4xl font-medium leading-[1.06] text-ink sm:text-6xl">
            436 men asked to talk with the vocations director in only 120&nbsp;days
          </h2>
          <p className="mt-5 text-pretty text-xl leading-relaxed text-ink/70">
            Here&rsquo;s exactly how it&nbsp;worked.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl shadow-2xl shadow-ink/20">
          <Image
            src={friarsPhoto}
            alt="Capuchin friars of the Midwest Province praying together at Mass"
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="h-auto w-full"
            placeholder="blur"
          />
        </div>

        {/* Headline numbers */}
        <dl className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
          <div>
            <dt className="sr-only">Organic views</dt>
            <dd className="font-serif text-6xl font-medium leading-none text-lapis">
              <CountUp to={614} suffix="%" />
            </dd>
            <dd className="mt-3 max-w-xs text-pretty text-[15px] leading-snug text-ink/60">
              more organic views: nearly 1 million, up from 140,000 the year&nbsp;before
            </dd>
          </div>
          <div>
            <dt className="sr-only">New followers</dt>
            <dd className="font-serif text-6xl font-medium leading-none text-lapis">
              <CountUp to={3100} />
            </dd>
            <dd className="mt-3 max-w-xs text-pretty text-[15px] leading-snug text-ink/60">
              new followers without boosting a post, up from 600 the year&nbsp;before
            </dd>
          </div>
          <div>
            <dt className="sr-only">Vocation inquiries</dt>
            <dd className="font-serif text-6xl font-medium leading-none text-lapis">
              <CountUp to={436} />
            </dd>
            <dd className="mt-3 max-w-xs text-pretty text-[15px] leading-snug text-ink/60">
              men asked to talk with Fr.&nbsp;Nathan, at $3.11 per&nbsp;inquiry
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-sm text-ink/50">
          120 days on Facebook and Instagram, compared with the same four months
          of&nbsp;2025.
        </p>

        {/* The story */}
        <div className="mt-20 sm:mt-28">
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
              Hear from Fr.&nbsp;Nathan about working together, and what changed for
              the province&rsquo;s vocation&nbsp;outreach.
            </p>
            <p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-ink/70">
              After seeing these results on Facebook and Instagram, the province
              asked us to take on YouTube&nbsp;next.
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
