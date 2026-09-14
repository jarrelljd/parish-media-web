import Image from "next/image";
import BookACallButton from "./BookACallButton";
import parishesAdsResults from "../../public/images/proof/parishes-ads-results.png";
import stJosephReport from "../../public/images/proof/st-joseph-monthly-report.png";

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-navy/80">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold"
        aria-hidden="true"
      >
        &#10003;
      </span>
      <span className="text-pretty">{children}</span>
    </li>
  );
}

export default function ParishGrowthContent() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-6 pb-16 sm:pt-14 sm:pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-gold">
            For Parish Priests and Staff Who Want More Young Adults and
            Families Involved in Parish Life
          </p>
          <h1 className="mt-4 text-balance font-serif text-3xl font-semibold leading-tight text-navy sm:text-5xl">
            Help Your Parish Generate 30&ndash;50 Young-Adult Inquiries in 90
            Days
          </h1>
          <p className="mt-6 text-pretty text-lg text-navy/70">
            We help Catholic parishes use Facebook and Instagram to reach
            nearby young adults, promote meaningful parish opportunities, and
            turn interest into real conversations, without adding more work
            to your&nbsp;staff.
          </p>
          <p className="mt-6 text-pretty text-navy/80">
            <span className="font-semibold text-navy">
              Fr. Dave&rsquo;s parish generated 65 young-adult inquiries in 60
              days.
            </span>{" "}
            The campaign gave interested young adults a simple way to raise
            their hand and take the next step with the parish.
          </p>
          <div className="mt-8">
            <BookACallButton className="inline-flex items-center justify-center rounded-full bg-gold px-10 py-4 text-base font-semibold text-navy shadow-md transition-colors hover:bg-gold/90">
              Book 30-Min Parish Growth Strategy&nbsp;Call
            </BookACallButton>
          </div>
          <div className="mx-auto mt-8 flex max-w-md items-center gap-4 rounded-2xl border border-gold/30 bg-white px-6 py-4 text-left shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-10 w-10 shrink-0 text-gold"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M12 3c-2.755 0-5.455.386-8.032 1.113a1.125 1.125 0 0 0-.734 1.352 1.125 1.125 0 0 0 .01.104C3.2 12.4 6.4 18.9 12 21c5.6-2.1 8.8-8.6 8.756-15.43a1.125 1.125 0 0 0-.734-1.352A48.424 48.424 0 0 0 12 3Z"
              />
            </svg>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                The Guarantee
              </p>
              <p className="mt-1 text-pretty text-sm text-navy/70">
                If we don&rsquo;t generate the agreed number of qualified
                young-adult inquiries within 90&nbsp;days, you don&rsquo;t pay
                our management&nbsp;fee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why you're here */}
      <section className="bg-navy/5 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-2xl font-semibold text-navy sm:text-3xl">
            Why You&rsquo;re Here
          </h2>
          <p className="mt-4 text-pretty text-navy/80">
            If you&rsquo;re responsible for parish life, you already know the
            challenge: bulletin announcements and pulpit mentions only reach
            the people already in the pews.
          </p>
          <p className="mt-4 text-pretty text-navy/80">
            Our work is simple: we use Facebook and Instagram to help the
            right people actually find your parish and reach out about an
            event, ministry, or volunteer opportunity &mdash; a real, tracked
            inquiry your staff can follow up on.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-serif text-2xl font-semibold text-navy sm:text-3xl">
            How It Works
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-navy/10 bg-white p-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                Reach
              </span>
              <p className="mt-2 text-navy/80">
                Paid campaigns introduce your parish to nearby young adults.
              </p>
            </div>
            <div className="rounded-xl border border-navy/10 bg-white p-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                Nurture
              </span>
              <p className="mt-2 text-navy/80">
                Consistent organic content helps them understand your parish
                and stay connected.
              </p>
            </div>
            <div className="rounded-xl border border-navy/10 bg-white p-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                Respond
              </span>
              <p className="mt-2 text-navy/80">
                Clear next steps allow interested people to inquire about
                events, ministries, volunteering, or parish involvement.
              </p>
            </div>
            <div className="rounded-xl border border-navy/10 bg-white p-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                Follow Up
              </span>
              <p className="mt-2 text-navy/80">
                Your parish responds and helps those people take the next
                step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Client snapshot */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-semibold text-navy sm:text-3xl">
              Client Snapshot: St. Patrick&rsquo;s Catholic Church
            </h2>
            <p className="mt-4 text-navy/80">
              In a recent campaign in South Hadley, MA, we generated:
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-navy/10 bg-white p-8 shadow-sm sm:p-10">
            <div className="grid gap-8 sm:grid-cols-[240px_1fr] sm:items-center sm:gap-10">
              <div>
                <div className="relative mx-auto aspect-[9/16] w-full max-w-[240px] overflow-hidden rounded-xl sm:mx-0 sm:max-w-none">
                  <iframe
                    src="https://player.vimeo.com/video/1224059968?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                    className="absolute inset-0 h-full w-full"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Fr. Dave Aufiero testimonial for Parish Media Company"
                  />
                </div>
                <p className="mt-3 text-center text-sm font-medium text-navy/60 sm:text-left">
                  Fr. Dave Aufiero, Pastor of St. Patrick&rsquo;s
                </p>
              </div>

              <div className="text-center sm:text-left">
                <div className="rounded-xl border border-gold/20 bg-gold/5 px-6 py-6">
                  <p className="font-serif text-4xl font-semibold text-navy">
                    65
                  </p>
                  <p className="mt-1 text-sm font-medium uppercase tracking-wide text-navy/60">
                    Young Adults Inquired About Events in 60 Days
                  </p>
                </div>
                <p className="mt-4 text-pretty text-navy/80">
                  St. Patrick&rsquo;s had a failing Facebook page and no young
                  adult ministry. Targeted Meta ads reached Catholics
                  21&ndash;35 nearby and generated a steady stream of
                  inquiries. The parish followed up personally with everyone
                  who reached out, and those conversations grew into a full
                  young adult ministry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we do for you */}
      <section className="bg-navy/5 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center font-serif text-2xl font-semibold text-navy sm:text-3xl">
            What We Do for You
          </h2>
          <p className="mt-4 text-center text-navy/80">
            If we work together, we:
          </p>
          <ul className="mt-6 space-y-3">
            <CheckItem>
              Build and manage parish-specific Facebook and Instagram
              campaigns that put your events, ministries, and volunteer
              opportunities in front of nearby young adults
            </CheckItem>
            <CheckItem>
              Direct interested people to a clear next step so they can
              inquire about attending, joining, or volunteering
            </CheckItem>
            <CheckItem>
              Strengthen your organic presence by repurposing existing
              content &mdash; homilies, announcements, and event information
              &mdash; so paid attention doesn&rsquo;t disappear after someone
              sees one ad, without adding more work for your staff
            </CheckItem>
            <CheckItem>
              Send one clear monthly report pulling from organic Facebook,
              organic Instagram, and Meta Ads Manager
            </CheckItem>
          </ul>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-navy/10 bg-white p-6 text-center">
              <p className="font-serif text-3xl font-semibold text-navy">
                $2&ndash;3
              </p>
              <p className="mt-1 text-sm font-medium uppercase tracking-wide text-navy/60">
                Per Lead
              </p>
              <div className="mt-4 overflow-hidden rounded-lg border border-navy/10">
                <Image
                  src={parishesAdsResults}
                  alt="Meta Ads Manager results showing a cost per lead of $2.42 and $2.53"
                  className="h-auto w-full"
                />
              </div>
            </div>
            <div className="rounded-xl border border-navy/10 bg-white p-6 text-center">
              <p className="font-serif text-3xl font-semibold text-navy">
                3-in-1
              </p>
              <p className="mt-1 text-sm font-medium uppercase tracking-wide text-navy/60">
                Report, Every Month
              </p>
              <div className="mt-4 overflow-hidden rounded-lg border border-navy/10">
                <Image
                  src={stJosephReport}
                  alt="Monthly community growth report for St. Joseph's Catholic Church, June 2026"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The guarantee */}
      <section className="bg-navy/5 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gold/40 bg-white p-8 shadow-sm sm:p-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            The Guarantee
          </span>
          <p className="mt-4 text-pretty text-navy/80">
            If we agree that your parish is a fit, your parish approves the
            campaign, provides the required information and access, responds
            promptly to inquiries, and we do not generate the agreed number
            of qualified young-adult inquiries within 90 days, you do not pay
            our management fee.
          </p>

          <div className="mt-6 rounded-xl border border-navy/10 bg-navy/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy/60">
              What Counts as an Inquiry
            </p>
            <p className="mt-2 text-pretty text-navy/80">
              For this offer, an inquiry means a young adult who submits
              their contact information and expresses interest in attending
              an event, joining a ministry, volunteering, or learning more
              about your parish.
            </p>
          </div>

          <p className="mt-6 text-pretty font-semibold text-navy">
            Our commitment is a steady flow of real, qualified inquiries.
            What happens after that &mdash; attendance, involvement, and
            long-term relationships &mdash; depends on your parish&rsquo;s
            own follow-up and hospitality.
          </p>
        </div>
      </section>

      {/* Who this is for */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center font-serif text-2xl font-semibold text-navy sm:text-3xl">
            Who This Is For
          </h2>
          <p className="mt-4 text-center text-navy/80">This is a fit if:</p>
          <ul className="mt-6 space-y-3">
            <CheckItem>
              You are a Catholic parish or diocese wanting to reach more
              young adults and families
            </CheckItem>
            <CheckItem>
              You have capacity to welcome and follow up with new people who
              show interest
            </CheckItem>
            <CheckItem>
              You want to use social media to build real parish community,
              not just broadcast announcements
            </CheckItem>
          </ul>
        </div>
      </section>

      {/* Next step */}
      <section className="border-t border-navy/10 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance font-serif text-2xl font-semibold text-navy sm:text-3xl">
            Let&rsquo;s Talk
          </h2>
          <p className="mt-3 text-pretty text-navy/70">
            If this sounds like it could serve your parish, the next step is
            a short conversation.
          </p>
          <div className="mt-8">
            <BookACallButton className="inline-block rounded-full bg-navy px-8 py-3.5 text-base font-medium text-offwhite transition-colors hover:bg-navy/90">
              Book 30-Min Parish Growth Strategy&nbsp;Call
            </BookACallButton>
          </div>
        </div>
      </section>
    </>
  );
}
