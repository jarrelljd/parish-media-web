import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import parishesAdsResults from "../../public/images/proof/parishes-ads-results.png";
import stJosephReport from "../../public/images/proof/st-joseph-monthly-report.png";
import saintsJohnJamesBulletin from "../../public/images/bulletins/saints-john-james/before-after.png";
import stBrendansBulletin from "../../public/images/bulletins/st-brendans-st-marys/before-after.png";
import stJosephBulletin from "../../public/images/bulletins/st-joseph-los-banos/before-after.png";

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

export default function ParishGrowthContent() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
          <h1 className="mt-8 font-serif text-3xl font-semibold text-navy sm:text-4xl">
            Parish &amp; Diocese Growth
          </h1>
          <p className="mt-4 text-lg text-navy/70">
            Organic content and targeted outreach, built around how your
            parish already works.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Meta Ads
            </span>
            <h3 className="mt-2 font-serif text-xl font-semibold text-navy">
              Meta Ads
            </h3>
            <p className="mt-3 text-navy/80">
              Targeted ads promote your events and volunteer opportunities to
              people nearby, capturing contact info that turns into a
              calendar add or a text follow-up.
            </p>
            <div className="mt-6 border-t border-navy/10 pt-6 text-center">
              <p className="font-serif text-4xl font-semibold text-navy">
                $2&ndash;3
              </p>
              <p className="mt-1 text-sm font-medium uppercase tracking-wide text-navy/60">
                Per Lead
              </p>
              <div className="mt-5">
                <ProofImage
                  src={parishesAdsResults}
                  alt="Meta Ads Manager results showing a cost per lead of $2.42 and $2.53"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-navy/10 bg-white p-8 shadow-sm sm:p-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                Monthly Reporting
              </span>
              <h3 className="mt-2 font-serif text-xl font-semibold text-navy">
                Monthly Reporting
              </h3>
              <p className="mt-3 text-navy/80">
                Every month you get one clear report pulling from organic
                Facebook, organic Instagram, and Meta Ads Manager: proof
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

        {/* Bulletin & design work */}
        <div className="mt-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-2xl font-semibold text-navy">
              Bulletin &amp; Design Work
            </h2>
            <p className="mt-3 text-navy/70">
              A different kind of proof: real before-and-afters from
              redesigned parish bulletins.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-navy/10 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">
                Saints John and James Parish
              </p>
              <p className="mt-2 text-navy/80">
                West Warwick, RI. Redesigned alongside the Instagram and ads
                work above.
              </p>
              <div className="mt-4 overflow-hidden rounded-lg border border-navy/10">
                <Image
                  src={saintsJohnJamesBulletin}
                  alt="Saints John and James Parish bulletin, before and after"
                  className="h-auto w-full"
                />
              </div>
            </div>

            <div className="rounded-xl border border-navy/10 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">
                St. Brendan&rsquo;s &amp; St. Mary&rsquo;s Parish
              </p>
              <p className="mt-2 text-navy/80">
                One-off bulletin redesign for Fr. Ronald Masilang.
              </p>
              <div className="mt-4 overflow-hidden rounded-lg border border-navy/10">
                <Image
                  src={stBrendansBulletin}
                  alt="St. Brendan's & St. Mary's Parish bulletin, before and after"
                  className="h-auto w-full"
                />
              </div>
            </div>

            <div className="rounded-xl border border-navy/10 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">
                St. Joseph&rsquo;s Catholic Church
              </p>
              <p className="mt-2 text-navy/80">
                Los Banos, CA. Redesigned alongside ongoing social and ads
                work.
              </p>
              <div className="mt-4 overflow-hidden rounded-lg border border-navy/10">
                <Image
                  src={stJosephBulletin}
                  alt="St. Joseph's Catholic Church bulletin, before and after"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Diocese line */}
        <p className="mt-12 text-center text-navy/70">
          Custom engagement for dioceses,{" "}
          <Link
            href="/contact"
            className="font-medium text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-navy/80"
          >
            let&rsquo;s talk
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
