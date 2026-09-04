import Image from "next/image";
import capuchinsPhoto from "../../public/images/clients/capuchin-midwest-province/photo.jpg";
import zachWernerPhoto from "../../public/images/clients/zach-werner-headshot.png";
import frJaredPhoto from "../../public/images/clients/fr-jared-de-leo.jpg";
import stJosephBefore from "../../public/images/proof/st-joseph-ig-before.png";
import stJosephAfter from "../../public/images/proof/st-joseph-ig-after.jpg";
import parishesAdsResults from "../../public/images/proof/parishes-ads-results.png";
import johnLujanPhoto from "../../public/images/clients/john-lujan-headshot.png";
import saintsJohnJamesBulletin from "../../public/images/bulletins/saints-john-james/before-after.png";
import { clients } from "@/data/clients";

const clientSnapshots = [
  {
    name: "Fr. Dave Aufiero",
    org: "Pastor, St. Patrick’s Catholic Church, South Hadley, MA",
    video: {
      src: "https://player.vimeo.com/video/1224059968?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
      title: "Fr. Dave Aufiero testimonial for Parish Media Company",
      allow:
        "autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share",
      referrerPolicy: "strict-origin-when-cross-origin" as const,
    },
    stat: "65",
    statLabel: "Young Adults Inquired About Young Adult Events in 60 Days",
    description:
      "Built a young adult ministry from the ground up, from targeted ads to event follow-up.",
  },
  {
    name: "Fr. Nicholas Fleming",
    org: "Pastor, Saints John and James Parish, West Warwick, RI",
    video: {
      src: "https://player.vimeo.com/video/1211528738?h=607f3159d2",
      title: "Fr. Nicholas Fleming testimonial for Parish Media Company",
      allow: "autoplay; fullscreen; picture-in-picture",
      allowFullScreen: true,
    },
    stat: "0 → 320",
    statLabel: "Instagram Followers in the First 30 Days",
    description:
      "Built from zero: homily clips, event photos, and flyers people actually stop to look at. The bulletin got a redesign too.",
    thumbnail: {
      src: saintsJohnJamesBulletin,
      alt: "Saints John and James Parish bulletin, before and after",
      caption: "Bulletin, before & after",
    },
  },
];

const writtenTestimonials = [
  {
    photo: zachWernerPhoto,
    quote:
      "Joe works with paid advertisements and social media to highlight the great works of your ministries, and inspire people to dig deeper.",
    name: "Zach Werner",
    role: "Director of Mission Advancement, Diocese of Reno",
  },
  {
    photo: johnLujanPhoto,
    photoZoom: 1.8,
    photoPosition: "50% 35%",
    quote:
      "This is fabulous. The level of expertise Joe brings is incredible. I really appreciate your time, it’s been extremely valuable for me.",
    name: "John Lujan",
    role: "Head of Communications, Diocese of Reno",
  },
  {
    photo: frJaredPhoto,
    photoPosition: "50% 15%",
    quote:
      "Joe’s work has been great. Easter Mass was the most packed it’s ever been.",
    name: "Fr. Jared DeLeo",
    role: "Pastor, St. Monica Catholic Parish, Palatka, FL",
  },
];

export default function Results() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
          <h2 className="mt-8 font-serif text-3xl font-semibold text-navy sm:text-4xl">
            Client Snapshots
          </h2>
          <p className="mt-4 text-lg text-navy/70">
            See results from parishes like yours.
          </p>
        </div>

        {/* Client Snapshots */}
        <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-12">
          {clientSnapshots.map((snap) => (
            <div
              key={snap.name}
              className="rounded-3xl border border-navy/10 bg-white p-8 shadow-sm shadow-navy/5 sm:p-10"
            >
              <div className="text-center">
                <h3 className="font-serif text-2xl font-semibold text-navy">
                  {snap.name}
                </h3>
                <span className="mx-auto mt-3 block h-0.5 w-10 rounded-full bg-gold" />
                <p className="mt-3 text-sm font-medium uppercase tracking-wide text-navy/60">
                  {snap.org}
                </p>
              </div>

              <div className="relative mt-6 aspect-video overflow-hidden rounded-xl border border-navy/10 bg-navy/5">
                <iframe
                  src={snap.video.src}
                  className="absolute inset-0 h-full w-full"
                  allow={snap.video.allow}
                  allowFullScreen={snap.video.allowFullScreen}
                  referrerPolicy={snap.video.referrerPolicy}
                  title={snap.video.title}
                />
              </div>

              <div className="mt-8 border-t border-navy/10 pt-8 text-center">
                <div className="mx-auto max-w-sm rounded-xl border border-gold/20 bg-gold/5 px-6 py-6">
                  <p className="font-serif text-5xl font-semibold text-navy">
                    {snap.stat}
                  </p>
                  <p className="mt-1 text-sm font-medium uppercase tracking-wide text-navy/60">
                    {snap.statLabel}
                  </p>
                </div>
                <p className="mt-4 text-navy/80">{snap.description}</p>
                {snap.thumbnail && (
                  <div className="mx-auto mt-5 w-full max-w-sm">
                    <div className="overflow-hidden rounded-lg border border-navy/10">
                      <Image
                        src={snap.thumbnail.src}
                        alt={snap.thumbnail.alt}
                        className="h-auto w-full"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-navy/50">
                      {snap.thumbnail.caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* More written testimonials */}
        <div className="mx-auto mt-20 grid max-w-5xl gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-navy/10">
          {writtenTestimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col items-center px-2 text-center sm:px-8"
            >
              <div className="h-16 w-16 overflow-hidden rounded-full bg-navy/5">
                <Image
                  src={t.photo}
                  alt={`${t.name}, ${t.role}`}
                  className="h-full w-full object-cover"
                  style={{
                    objectPosition: t.photoPosition ?? "50% 50%",
                    transform: t.photoZoom
                      ? `scale(${t.photoZoom})`
                      : undefined,
                  }}
                />
              </div>
              <blockquote className="mt-5">
                <p className="font-serif text-lg italic leading-relaxed text-navy">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>
              <p className="mt-4 text-sm font-medium text-navy/60">
                {t.name}, {t.role}
              </p>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="mx-auto mt-24 max-w-2xl text-center">
          <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
          <h3 className="mt-8 font-serif text-3xl font-semibold text-navy sm:text-4xl">
            Results
          </h3>
          <p className="mt-4 text-lg text-navy/70">
            What we actually do for a parish, in two numbers.
          </p>
        </div>

        {/* Idea one: organic growth */}
        <div className="mt-16 grid items-center gap-10 sm:grid-cols-2 sm:gap-14">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Organic Growth
            </span>
            <h4 className="mt-2 text-balance font-serif text-2xl font-semibold text-navy sm:text-3xl">
              We Grow Parish Social Media Accounts
            </h4>
            <p className="mt-6 font-serif text-5xl font-semibold text-navy">
              0 &rarr; 941
            </p>
            <p className="mt-1 text-sm font-medium uppercase tracking-wide text-navy/60">
              Followers in 4 Months, St. Joseph Catholic Parish
            </p>
            <p className="mt-4 text-navy/80">
              Pure organic growth: homily clips, event photos, and flyers
              people actually stop to look at. No ad spend behind this
              number.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 overflow-hidden rounded-xl border border-navy/10">
              <Image
                src={stJosephBefore}
                alt="St. Joseph Catholic Parish Instagram at 0 followers, February 2026"
                className="h-auto w-full"
              />
            </div>
            <span className="shrink-0 text-xl text-gold">&rarr;</span>
            <div className="flex-1 overflow-hidden rounded-xl border border-navy/10">
              <Image
                src={stJosephAfter}
                alt="St. Joseph Catholic Parish Instagram at 941 followers, June 2026"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>

        {/* Idea two: ads */}
        <div className="mt-20 grid items-center gap-10 sm:grid-cols-2 sm:gap-14">
          <div className="sm:order-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Meta Ads
            </span>
            <h4 className="mt-2 text-balance font-serif text-2xl font-semibold text-navy sm:text-3xl">
              We Get Consistent Attendance &amp; Volunteers
            </h4>
            <p className="mt-6 font-serif text-5xl font-semibold text-navy">
              $2&ndash;3
            </p>
            <p className="mt-1 text-sm font-medium uppercase tracking-wide text-navy/60">
              Per Lead
            </p>
            <p className="mt-4 text-navy/80">
              Targeted ads promote your events and volunteer opportunities to
              people nearby, capturing contact info that turns into a
              calendar add or a text follow-up.
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-navy/10 sm:order-1">
            <Image
              src={parishesAdsResults}
              alt="Meta Ads Manager results showing a cost per lead of $2.42 and $2.53"
              className="h-auto w-full"
            />
          </div>
        </div>

        {/* Vocation offices */}
        <div className="mx-auto mt-24 max-w-3xl border-t border-navy/10 pt-16 text-center">
          <h3 className="text-balance font-serif text-2xl font-semibold text-navy sm:text-3xl">
            Does This Work for Vocation Offices as Well?
          </h3>
          <p className="mt-3 text-navy/70">
            Yes &mdash; the same playbook, aimed at young men discerning a
            vocation.
          </p>

          <div className="mt-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="w-full max-w-xs overflow-hidden rounded-xl border border-navy/10 sm:w-48 sm:shrink-0">
              <Image
                src={capuchinsPhoto}
                alt="Capuchin friars of the Midwest Province of St. Joseph"
                className="h-auto w-full"
              />
            </div>
            <div>
              <p className="font-serif text-4xl font-semibold text-navy">
                190
              </p>
              <p className="text-sm font-medium uppercase tracking-wide text-navy/60">
                Inquiries in 90 Days
              </p>
              <p className="mt-3 text-navy/80">
                For $500 in ad spend, 190 Catholic men reached out about a
                conversation on religious life with the Midwest Province
                Vocation Office, Capuchin Franciscans, connecting with Fr.
                Nathan Linton, Vocations Director.
              </p>
            </div>
          </div>
        </div>

        {/* Client roster */}
        <div className="mt-24 border-t border-navy/10 pt-14 text-center">
          <h3 className="font-serif text-xl font-semibold text-navy">
            Also Trusted By
          </h3>
          <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-x-10 gap-y-6">
            {clients
              .filter(
                (client) =>
                  client.name !== "Bishop Daniel Mueggenborg" &&
                  client.name !== "Fr. Nathan Linton, Vocations Director" &&
                  client.name !== "Fr. Nicholas Fleming, Pastor" &&
                  client.name !== "Fr. Dave Aufiero, Pastor"
              )
              .map((client) => (
                <div key={client.name}>
                  <p className="font-medium text-navy">{client.name}</p>
                  {client.org && (
                    <p className="mt-0.5 text-sm text-navy/60">
                      {client.org}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
