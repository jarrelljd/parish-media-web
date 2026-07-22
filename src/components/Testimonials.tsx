import Image from "next/image";
import saintsJohnJamesBulletin from "../../public/images/bulletins/saints-john-james/before-after.png";
import stBrendansBulletin from "../../public/images/bulletins/st-brendans-st-marys/before-after.png";
import stJosephBulletin from "../../public/images/bulletins/st-joseph-los-banos/before-after.png";

const clients = [
  {
    name: "Fr. Nicholas Fleming",
    org: "Saints John and James Parish, West Warwick, RI",
  },
  {
    name: "Fr. Jared DeLeo",
    org: "St. Monica's Catholic Church, Palatka, FL",
  },
  {
    name: "Fr. Dalton Rodgers",
    org: "St. Joseph's Catholic Church, Los Banos, CA",
  },
  {
    name: "Fr. Robert Hale",
    org: "St. Rose Family of Parishes, Springfield, OH",
  },
  {
    name: "Fr. Dave Aufiero",
    org: "St. Patrick's Catholic Church, South Hadley, MA",
  },
  {
    name: "Fr. William Bond",
    org: "Our Lady of the Saints Family of Parishes, Omaha, NE",
  },
  {
    name: "Midwest Province Vocation Office",
    org: "Capuchin Franciscans",
  },
  {
    name: "Diocese of Reno",
    org: "",
  },
  {
    name: "UW Oshkosh Newman Center",
    org: "",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
          <h2 className="mt-8 font-serif text-3xl font-semibold text-navy sm:text-4xl">
            Testimonials
          </h2>
          <p className="mt-4 text-lg text-navy/70">
            Real parishes, real growth — hear it directly.
          </p>
        </div>

        {/* Lead testimonial */}
        <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-navy/10 bg-white p-6 shadow-sm sm:p-10">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-navy/5">
            <iframe
              src="https://player.vimeo.com/video/1211528738?h=607f3159d2"
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Fr. Nicholas Fleming testimonial for Parish Media Company"
            />
          </div>

          <blockquote className="mt-8">
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
          <p className="mt-4 text-sm font-medium text-navy/60">
            Fr. Nicholas Fleming — Saints John and James Parish, West
            Warwick, RI
          </p>

          <div className="mt-8 overflow-hidden rounded-lg border border-navy/10">
            <Image
              src={saintsJohnJamesBulletin}
              alt="Saints John and James Parish bulletin, before and after"
              className="h-auto w-full"
            />
          </div>
          <p className="mt-3 text-center text-xs text-navy/50">
            Saints John and James Parish bulletin — before and after
          </p>
        </div>

        {/* Client roster */}
        <div className="mt-20">
          <h3 className="text-center font-serif text-xl font-semibold text-navy">
            Trusted by Parishes, Dioceses, and Vocation Offices
          </h3>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <div
                key={client.name}
                className="rounded-xl border border-navy/10 bg-white p-5"
              >
                <p className="font-medium text-navy">{client.name}</p>
                {client.org && (
                  <p className="mt-1 text-sm text-navy/60">{client.org}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* One-off project + additional bulletin proof */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-navy/10 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">
              One-Off Project
            </p>
            <p className="mt-2 text-navy/80">
              Bulletin redesign for St. Brendan&rsquo;s &amp; St. Mary&rsquo;s
              Parish, for Fr. Ronald Masilang.
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
              More Bulletin Work
            </p>
            <p className="mt-2 text-navy/80">
              St. Joseph&rsquo;s Catholic Church, Los Banos, CA.
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
    </section>
  );
}
