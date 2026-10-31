import Image, { type StaticImageData } from "next/image";
import { ArrowRight, Quote } from "lucide-react";
import BookACallButton from "@/components/BookACallButton";
import { buttonArrow, buttonClass } from "@/components/buttonStyles";
import zachWernerPhoto from "../../public/images/clients/zach-werner-headshot.png";
import frJaredPhoto from "../../public/images/clients/fr-jared-de-leo.jpg";
import stJosephBefore from "../../public/images/proof/st-joseph-ig-before.png";
import stJosephAfter from "../../public/images/proof/st-joseph-ig-after.jpg";
import parishesAdsResults from "../../public/images/proof/parishes-ads-results.png";
import johnLujanPhoto from "../../public/images/clients/john-lujan-headshot.png";
import saintsJohnJamesBulletin from "../../public/images/bulletins/saints-john-james/before-after.png";
import { clients } from "@/data/clients";

type ClientSnapshot = {
  parish: string;
  location: string;
  diocese?: string;
  priestCaption: string;
  video: {
    src: string;
    title: string;
    allow: string;
    referrerPolicy?: "strict-origin-when-cross-origin";
    orientation?: "portrait";
  };
  stat: string;
  statLabel: string;
  secondaryStat?: {
    stat: string;
    label: string;
  };
  description: string;
  thumbnail?: {
    src: StaticImageData;
    alt: string;
    caption: string;
  };
};

const clientSnapshots: ClientSnapshot[] = [
  {
    parish: "Capuchin Franciscans",
    location: "Midwest Province of St. Joseph",
    priestCaption: "Fr. Nathan Linton, Vocations Director",
    video: {
      src: "https://player.vimeo.com/video/1225765800?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
      title: "Fr. Nathan Linton testimonial for Parish Media Company",
      allow:
        "autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share",
      referrerPolicy: "strict-origin-when-cross-origin" as const,
      orientation: "portrait" as const,
    },
    stat: "200",
    statLabel: "Men Reached Out to Discuss Their Vocation in 90 Days",
    secondaryStat: {
      stat: "12+",
      label: "Were Serious, Qualified Discerners That Moved on to the Next Step",
    },
    description:
      "Using targeted Meta ads across the province, we reached Catholic men who were actively open to learning more about religious life. Over 90 days, a $500 ad investment generated 200 inquiries, including 12+ serious discerners who were ready for personal follow-up with the Vocation Office. The campaign gave interested men an easy, low-friction way to take the first step, while helping the province identify which inquiries represented genuine vocational interest rather than casual curiosity.",
  },
  {
    parish: "St. Patrick’s Catholic Church",
    location: "South Hadley, MA",
    diocese: "Diocese of Springfield",
    priestCaption: "Fr. Dave Aufiero, Pastor of St. Patrick’s",
    video: {
      src: "https://player.vimeo.com/video/1224059968?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
      title: "Fr. Dave Aufiero testimonial for Parish Media Company",
      allow:
        "autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share",
      referrerPolicy: "strict-origin-when-cross-origin" as const,
      orientation: "portrait" as const,
    },
    stat: "65",
    statLabel: "Young Adults Inquired About Young Adult Events in 60 Days",
    description:
      "St. Patrick’s Catholic Church had a failing Facebook page, and no young adult ministry. To remedy this, we first ran a Meta ad campaign to hire a young adult ministry leader in the area. Then, we ran targeted ads to Catholics ages 21–35 in the area for monthly young adult events, all while posting content on the parish socials. The young adult leader texted the inquirers and added them to a group chat. After a few events, the parish had a full young adult ministry.",
  },
  {
    parish: "Saints John and James Parish",
    location: "West Warwick, RI",
    diocese: "Diocese of Providence",
    priestCaption: "Fr. Nicholas Fleming, Pastor of Saints John and James",
    video: {
      src: "https://player.vimeo.com/video/1224307339?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
      title: "Fr. Nicholas Fleming testimonial for Parish Media Company",
      allow:
        "autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share",
      referrerPolicy: "strict-origin-when-cross-origin" as const,
      orientation: "portrait" as const,
    },
    stat: "0 → 320",
    statLabel: "Instagram Followers in the First 30 Days",
    description:
      "Created and grew an Instagram account for the parish to 320 followers in 30 days, so the parish could reach more young adults. Also redesigned the parish bulletin.",
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

const eyebrow = "text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep";
const statLabel = "mt-2 max-w-xs text-sm font-semibold uppercase leading-snug tracking-[0.08em] text-navy/55";

function ClientSnapshotRow({ snap }: { snap: ClientSnapshot }) {
  return (
    <article className="grid gap-10 py-14 first:pt-0 last:pb-0 sm:grid-cols-[260px_1fr] sm:items-center sm:gap-14 lg:grid-cols-[300px_1fr]">
      <figure>
        <div className="mx-auto w-full max-w-[260px] rounded-[2rem] bg-white p-2.5 shadow-2xl shadow-navy/10 ring-1 ring-navy/5 sm:max-w-none">
          <div
            className={
              snap.video.orientation === "portrait"
                ? "relative aspect-[9/16] w-full overflow-hidden rounded-[1.5rem] bg-navy"
                : "relative aspect-video w-full overflow-hidden rounded-[1.5rem] bg-navy/5"
            }
          >
            <iframe
              src={snap.video.src}
              className="absolute inset-0 h-full w-full"
              allow={snap.video.allow}
              allowFullScreen
              referrerPolicy={snap.video.referrerPolicy}
              title={snap.video.title}
            />
          </div>
        </div>
        <figcaption className="mt-4 text-center text-sm text-navy/60">
          {snap.priestCaption}
        </figcaption>
      </figure>

      <div className="text-left">
        <p className={eyebrow}>
          {[snap.location, snap.diocese].filter(Boolean).join(" · ")}
        </p>
        <h3 className="mt-3 text-balance font-serif text-3xl font-medium tracking-tight text-navy sm:text-4xl">
          {snap.parish}
        </h3>

        <div className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
          <div className="border-l-2 border-gold pl-5 text-left">
            <p className="font-serif text-6xl font-medium leading-none tracking-tight text-navy">
              {snap.stat}
            </p>
            <p className={statLabel}>{snap.statLabel}</p>
          </div>
          {snap.secondaryStat && (
            <div className="border-l-2 border-navy/15 pl-5 text-left">
              <p className="font-serif text-6xl font-medium leading-none tracking-tight text-navy/80">
                {snap.secondaryStat.stat}
              </p>
              <p className={statLabel}>{snap.secondaryStat.label}</p>
            </div>
          )}
        </div>

        <p className="mt-8 text-pretty text-lg leading-relaxed text-navy/70">
          {snap.description}
        </p>

        {snap.thumbnail && (
          <figure className="mt-8">
            <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-lg shadow-navy/5 ring-1 ring-navy/5">
              <Image
                src={snap.thumbnail.src}
                alt={snap.thumbnail.alt}
                className="h-auto w-full rounded-xl"
              />
            </div>
            <figcaption className="mt-2 text-xs uppercase tracking-[0.12em] text-navy/50">
              {snap.thumbnail.caption}
            </figcaption>
          </figure>
        )}
      </div>
    </article>
  );
}

function Shot({ src, alt }: { src: StaticImageData; alt: string }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-xl shadow-navy/10 ring-1 ring-navy/5">
      <Image src={src} alt={alt} className="h-auto w-full rounded-xl" />
    </div>
  );
}

export default function Results() {
  return (
    <>
      {/* Client Snapshots */}
      <section className="px-6 pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className={eyebrow}>Results</p>
            <h1 className="mt-4 font-serif text-5xl font-medium leading-[1.05] tracking-tight text-navy sm:text-6xl">
              Client Snapshots
            </h1>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-navy/70 sm:text-xl">
              See results from parishes, dioceses, and religious orders
              like&nbsp;yours.
            </p>
          </div>

          <div className="mt-16 divide-y divide-navy/10">
            {clientSnapshots.map((snap) => (
              <ClientSnapshotRow key={snap.parish} snap={snap} />
            ))}
          </div>
        </div>
      </section>

      {/* Written testimonials + Book a Call */}
      <section className="bg-parchment px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <ul className="grid gap-5 md:grid-cols-3">
            {writtenTestimonials.map((t) => (
              <li
                key={t.name}
                className="flex flex-col rounded-3xl bg-offwhite p-7 ring-1 ring-navy/5 sm:p-8"
              >
                <Quote className="h-7 w-7 text-gold" strokeWidth={1.5} aria-hidden="true" />
                <blockquote className="mt-4 flex-1">
                  <p className="font-serif text-xl italic leading-relaxed text-navy">
                    {t.quote}
                  </p>
                </blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-navy/10 pt-5">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-navy/5">
                    <Image
                      src={t.photo}
                      alt={`${t.name}, ${t.role}`}
                      className="h-full w-full object-cover"
                      style={{
                        objectPosition: t.photoPosition ?? "50% 50%",
                        transform: t.photoZoom ? `scale(${t.photoZoom})` : undefined,
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-navy">{t.name}</p>
                    <p className="text-sm leading-snug text-navy/60">{t.role}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-14 flex justify-center">
            <BookACallButton className={buttonClass("primary")}>
              Book a Call
              <ArrowRight className={buttonArrow} aria-hidden="true" />
            </BookACallButton>
          </div>
        </div>
      </section>

      {/* More Results */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className={eyebrow}>By the Numbers</p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-navy sm:text-5xl">
              More Results
            </h2>
            <p className="mt-5 text-lg text-navy/70">
              What we actually do for a parish, in two&nbsp;numbers.
            </p>
          </div>

          {/* Idea one: organic growth */}
          <div className="mt-16 grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div className="text-center md:text-left">
              <p className={eyebrow}>Organic Growth</p>
              <h3 className="mt-3 text-balance font-serif text-3xl font-medium tracking-tight text-navy sm:text-4xl">
                We Grow Parish Social Media Accounts
              </h3>
              <div className="mt-8 inline-block border-l-2 border-gold pl-5 text-left">
                <p className="font-serif text-6xl font-medium leading-none tracking-tight text-navy">
                  0 &rarr; 941
                </p>
                <p className={statLabel}>Followers in 4 Months, St. Joseph Catholic Parish</p>
              </div>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-navy/70">
                Pure organic growth: homily clips, event photos, and flyers
                people actually stop to look at. No ad spend behind
                this&nbsp;number.
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-1">
                <Shot
                  src={stJosephBefore}
                  alt="St. Joseph Catholic Parish Instagram at 0 followers, February 2026"
                />
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold/15 text-gold-deep">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <Shot
                  src={stJosephAfter}
                  alt="St. Joseph Catholic Parish Instagram at 941 followers, June 2026"
                />
              </div>
            </div>
          </div>

          {/* Idea two: ads */}
          <div className="mt-24 grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div className="text-center md:order-2 md:text-left">
              <p className={eyebrow}>Meta Ads</p>
              <h3 className="mt-3 text-balance font-serif text-3xl font-medium tracking-tight text-navy sm:text-4xl">
                We Get Consistent Attendance &amp;&nbsp;Volunteers
              </h3>
              <div className="mt-8 inline-block border-l-2 border-gold pl-5 text-left">
                <p className="font-serif text-6xl font-medium leading-none tracking-tight text-navy">
                  $2&ndash;3
                </p>
                <p className={statLabel}>Per Lead</p>
              </div>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-navy/70">
                Targeted ads promote your events and volunteer opportunities to
                people nearby, capturing contact info that turns into a
                calendar add or a text&nbsp;follow-up.
              </p>
            </div>
            <div className="md:order-1">
              <Shot
                src={parishesAdsResults}
                alt="Meta Ads Manager results showing a cost per lead of $2.42 and $2.53"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Client roster */}
      <section className="bg-parchment px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy/50">
            Also Trusted By
          </p>
          <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {clients
              .filter(
                (client) =>
                  client.name !== "Bishop Daniel Mueggenborg" &&
                  client.name !== "Fr. Nathan Linton, Vocations Director" &&
                  client.name !== "Fr. Nicholas Fleming, Pastor" &&
                  client.name !== "Fr. Dave Aufiero, Pastor"
              )
              .map((client) => (
                <li key={client.name} className="flex items-center gap-4 text-left">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-navy/5 ring-1 ring-navy/10">
                    {client.photo && (
                      <Image
                        src={client.photo}
                        alt={client.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                        style={{
                          objectPosition: client.photoPosition ?? "50% 50%",
                          transform: client.photoZoom ? `scale(${client.photoZoom})` : undefined,
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-navy">{client.name}</p>
                    {client.org && (
                      <p className="text-sm leading-snug text-navy/60">{client.org}</p>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </>
  );
}
