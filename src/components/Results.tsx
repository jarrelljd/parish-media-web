import Image from "next/image";
import capuchinsPhoto from "../../public/images/clients/capuchin-midwest-province/photo.jpg";
import zachWernerPhoto from "../../public/images/clients/zach-werner-headshot.png";
import frDavePhoto from "../../public/images/clients/fr-dave-aufiero-headshot.png";
import frJaredPhoto from "../../public/images/clients/fr-jared-de-leo.jpg";
import stJosephBefore from "../../public/images/proof/st-joseph-ig-before.png";
import stJosephAfter from "../../public/images/proof/st-joseph-ig-after.jpg";
import parishesAdsResults from "../../public/images/proof/parishes-ads-results.png";
import { clients } from "@/data/clients";

const writtenTestimonials = [
  {
    photo: zachWernerPhoto,
    quote:
      "Joe works with paid advertisements and social media to highlight the great works of your ministries, and inspire people to dig deeper.",
    name: "Zach Werner",
    role: "Head of Communications, Diocese of Reno",
  },
  {
    photo: frDavePhoto,
    quote:
      "He helped build our young adult ministry, it’s been a pleasure working with him. I recommended Joe to our Diocese.",
    name: "Fr. Dave Aufiero",
    role: "Pastor, St. Patrick’s Catholic Church, South Hadley, MA",
  },
  {
    photo: frJaredPhoto,
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
            Testimonies
          </h2>
          <p className="mt-4 text-lg text-navy/70">
            Real parishes, real growth. Hear it directly, then see the
            numbers.
          </p>
        </div>

        {/* Lead video testimonial */}
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-navy/10 bg-navy/5">
            <iframe
              src="https://player.vimeo.com/video/1211528738?h=607f3159d2"
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Fr. Nicholas Fleming testimonial for Parish Media Company"
            />
          </div>

          <blockquote className="mt-8 text-center">
            <span className="font-serif text-5xl leading-none text-gold">
              &ldquo;
            </span>
            <p className="-mt-6 font-serif text-xl italic leading-relaxed text-navy">
              Before working with Joe, we didn&rsquo;t have an online
              presence, especially on Instagram, and our bulletin was pretty
              basic and had never really seen any change. Over the last five
              months, Joe helped us build an Instagram page from zero to 300
              followers, redesigned our bulletin, and trained our staff to
              use Canva and Meta ads so we can do this on our own. We&rsquo;ve
              already seen new families register, increased engagement with
              our homilies online, and seen how this platform helps us grow
              as a parish. I highly recommend Joe for what he&rsquo;s done
              for our parish, for yours.
            </p>
          </blockquote>
          <p className="mt-4 text-center text-sm font-medium text-navy/60">
            Fr. Nicholas Fleming, Saints John and James Parish, West
            Warwick, RI
          </p>
        </div>

        {/* More written testimonials */}
        <div className="mx-auto mt-20 grid max-w-5xl gap-12 sm:grid-cols-3 sm:divide-x sm:divide-navy/10">
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

        {/* Capuchin vocation office, secondary mention */}
        <div className="mx-auto mt-16 flex max-w-3xl flex-col items-center gap-5 border-t border-navy/10 pt-10 text-center sm:flex-row sm:text-left">
          <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-navy/10">
            <Image
              src={capuchinsPhoto}
              alt="Capuchin friars of the Midwest Province of St. Joseph"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="text-navy/80">
            We also run this for vocation offices:{" "}
            <span className="font-serif text-xl font-semibold text-navy">
              140+
            </span>{" "}
            inquiries in 60 days for the Midwest Province Vocation Office,
            Capuchin Franciscans, for $380 in ad spend. Ten were qualified
            and went on to meet with Fr. Nathan Linton, Vocations Director.
          </p>
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
                  client.name !== "Fr. Nathan Linton, Vocations Director"
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
