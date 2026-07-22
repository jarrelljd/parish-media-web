import Image, { type StaticImageData } from "next/image";
import parishesAdsResults from "../../public/images/proof/parishes-ads-results.png";
import stJosephBefore from "../../public/images/proof/st-joseph-ig-before.png";
import stJosephAfter from "../../public/images/proof/st-joseph-ig-after.jpg";
import stJosephReport from "../../public/images/proof/st-joseph-monthly-report.png";
import vocationTextExample from "../../public/images/proof/vocation-text-example.png";
import vocationDashboardExample from "../../public/images/proof/vocation-dashboard-example.png";
import VocationFlow from "./VocationFlow";

function PillarCard({
  eyebrow,
  title,
  description,
  stat,
  statCaption,
  media,
  mediaCaption,
}: {
  eyebrow: string;
  title: string;
  description: string;
  stat: string;
  statCaption: string;
  media: React.ReactNode;
  mediaCaption?: string;
}) {
  return (
    <div className="rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
      <span className="text-xs font-semibold uppercase tracking-widest text-gold">
        {eyebrow}
      </span>
      <h4 className="mt-2 font-serif text-xl font-semibold text-navy">
        {title}
      </h4>
      <p className="mt-3 text-navy/80">{description}</p>
      <div className="mt-6 border-t border-navy/10 pt-6 text-center">
        <p className="font-serif text-4xl font-semibold text-navy">{stat}</p>
        <p className="mt-1 text-sm font-medium uppercase tracking-wide text-navy/60">
          {statCaption}
        </p>
        <div className="mt-5">{media}</div>
        {mediaCaption && (
          <p className="mt-3 text-xs text-navy/50">{mediaCaption}</p>
        )}
      </div>
    </div>
  );
}

function ProofImage({
  src,
  alt,
}: {
  src: StaticImageData;
  alt: string;
}) {
  return (
    <div className="flex-1 overflow-hidden rounded-lg border border-navy/10">
      <Image src={src} alt={alt} className="h-auto w-full" />
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
          <h2 className="mt-8 font-serif text-3xl font-semibold text-navy sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-navy/70">
            Two ways we help ministries grow — organic content and targeted
            outreach, built around how your team already works.
          </p>
        </div>

        {/* For Parishes */}
        <div className="mt-20">
          <div className="text-center">
            <h3 className="font-serif text-2xl font-semibold text-navy sm:text-3xl">
              For Parishes
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-navy/70">
              Three pillars, working together — that&rsquo;s the core of what
              we do for a parish.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <PillarCard
              eyebrow="Pillar One"
              title="Organic Growth"
              description="We clip your homilies, post the content your community actually shares — think event photos — and design flyers people stop to look at. It's what nurtures your following and steadily grows your account."
              stat="0 → 941"
              statCaption="Followers in 4 Months"
              media={
                <div className="flex items-center gap-3">
                  <ProofImage
                    src={stJosephBefore}
                    alt="St. Joseph Catholic Parish Instagram at 0 followers, February 2026"
                  />
                  <span className="shrink-0 text-lg text-gold">→</span>
                  <ProofImage
                    src={stJosephAfter}
                    alt="St. Joseph Catholic Parish Instagram at 941 followers, June 2026"
                  />
                </div>
              }
            />

            <PillarCard
              eyebrow="Pillar Two"
              title="Meta Ads"
              description="Targeted ads promote your events and volunteer opportunities to people nearby, capturing contact info that turns into a calendar add or a text follow-up."
              stat="$2–3"
              statCaption="Per Lead"
              media={
                <ProofImage
                  src={parishesAdsResults}
                  alt="Meta Ads Manager results showing a cost per lead of $2.42 and $2.53"
                />
              }
            />
          </div>

          <div className="mt-8 rounded-2xl border border-navy/10 bg-white p-8 shadow-sm sm:p-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                  Pillar Three
                </span>
                <h4 className="mt-2 font-serif text-xl font-semibold text-navy">
                  Monthly Reporting
                </h4>
                <p className="mt-3 text-navy/80">
                  Every month you get one clear report pulling from organic
                  Facebook, organic Instagram, and Meta Ads Manager — proof
                  things are working, and the real numbers to set next
                  month&rsquo;s ad budget with confidence.
                </p>
                <div className="mt-6 border-t border-navy/10 pt-6">
                  <p className="font-serif text-4xl font-semibold text-navy">
                    3-in-1
                  </p>
                  <p className="mt-1 text-sm font-medium uppercase tracking-wide text-navy/60">
                    Report, Every Month
                  </p>
                </div>
              </div>
              <ProofImage
                src={stJosephReport}
                alt="Monthly community growth report for St. Joseph's Catholic Church, June 2026"
              />
            </div>
          </div>
        </div>

        {/* For Vocation Offices */}
        <div className="mt-24 rounded-2xl bg-navy/5 p-8 sm:p-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-navy/50">
            Also Available
          </span>
          <h3 className="mt-2 font-serif text-xl font-semibold text-navy">
            For Vocation Offices
          </h3>

          <div className="mt-8 rounded-xl border border-navy/10 bg-white p-6 sm:p-8">
            <VocationFlow />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="flex justify-center gap-4 sm:gap-6">
              <div className="w-full max-w-52">
                <div className="overflow-hidden rounded-xl border border-navy/10">
                  <Image
                    src={vocationTextExample}
                    alt="A real automated iMessage opening a conversation with someone discerning a vocation"
                    className="h-auto w-full"
                  />
                </div>
                <p className="mt-2 text-center text-xs text-navy/50">
                  A real opening message
                </p>
              </div>
              <div className="w-full max-w-52">
                <div className="overflow-hidden rounded-xl border border-navy/10">
                  <Image
                    src={vocationDashboardExample}
                    alt="The vocation director's team inbox dashboard, showing every conversation assigned to him"
                    className="h-auto w-full"
                  />
                </div>
                <p className="mt-2 text-center text-xs text-navy/50">
                  The director&rsquo;s dashboard
                </p>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <p className="inline-block rounded-xl border border-navy/10 bg-white px-6 py-5 text-navy">
                Averaging{" "}
                <span className="font-serif text-2xl font-semibold">
                  $2–3
                </span>{" "}
                per conversation with a young man discerning a vocation.
              </p>
              <p className="mt-4 text-navy/70">
                Organic post scripting is also available for the vocation
                office&rsquo;s own social accounts.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Services */}
        <div className="mt-12 rounded-2xl bg-navy/5 p-8 sm:p-10">
          <h3 className="font-serif text-xl font-semibold text-navy">
            Additional Services
          </h3>
          <ul className="mt-4 grid gap-3 text-navy/80 sm:grid-cols-3">
            <li>Canva flyer design</li>
            <li>Bulletin design consulting</li>
            <li>One-off bulletin redesigns (Canva)</li>
          </ul>
        </div>

        {/* Diocese line */}
        <p className="mt-12 text-center text-navy/70">
          Custom engagement for dioceses —{" "}
          <a
            href="#contact"
            className="font-medium text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-navy/80"
          >
            let&rsquo;s talk
          </a>
          .
        </p>
      </div>
    </section>
  );
}
