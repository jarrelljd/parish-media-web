import Image from "next/image";
import Link from "next/link";
import saintsJohnJamesBulletin from "../../public/images/bulletins/saints-john-james/before-after.png";
import stBrendansBulletin from "../../public/images/bulletins/st-brendans-st-marys/before-after.png";
import stJosephBulletin from "../../public/images/bulletins/st-joseph-los-banos/before-after.png";
import vocationTextExample from "../../public/images/proof/vocation-text-example.png";
import vocationDashboardExample from "../../public/images/proof/vocation-dashboard-example.png";
import VocationFlow from "./VocationFlow";

export default function VocationsContent() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
          <h1 className="mt-8 font-serif text-3xl font-semibold text-navy sm:text-4xl">
            Vocations
          </h1>
          <p className="mt-4 text-lg text-navy/70">
            Reach young men discerning a vocation, right where they&rsquo;re
            already scrolling.
          </p>
        </div>

        <div className="mt-16 rounded-xl border border-navy/10 bg-white p-6 sm:p-8">
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
                $2&ndash;3
              </span>{" "}
              per conversation with a young man discerning a vocation.
            </p>
            <p className="mt-4 text-navy/70">
              Organic post scripting is also available for the vocation
              office&rsquo;s own social accounts.
            </p>
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
