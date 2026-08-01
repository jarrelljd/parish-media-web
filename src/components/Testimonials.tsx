import Image from "next/image";
import saintsJohnJamesBulletin from "../../public/images/bulletins/saints-john-james/before-after.png";
import stBrendansBulletin from "../../public/images/bulletins/st-brendans-st-marys/before-after.png";
import stJosephBulletin from "../../public/images/bulletins/st-joseph-los-banos/before-after.png";
import capuchinsPhoto from "../../public/images/clients/capuchin-midwest-province/photo.jpg";
import { clients } from "@/data/clients";

export default function Testimonials() {
  return (
    <section className="px-6 py-24 sm:py-32">
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

        {/* Lead video testimonial */}
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
            Fr. Nicholas Fleming, Saints John and James Parish, West
            Warwick, RI
          </p>
        </div>

        {/* Diocese & vocation office results */}
        <div className="mt-20 rounded-2xl bg-navy/5 p-8 sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="font-serif text-2xl font-semibold text-navy">
              Diocese &amp; Vocation Office Results
            </h3>
            <p className="mt-3 text-navy/70">
              Real outcomes at an institutional scale, not just individual
              parishes.
            </p>
          </div>

          <div className="mt-10 rounded-xl border border-navy/10 bg-white p-6 sm:p-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Diocese of Reno
            </span>
            <blockquote className="mt-4 max-w-2xl">
              <p className="font-serif text-xl italic leading-relaxed text-navy">
                &ldquo;Joe works with paid advertisements and social media to
                highlight the great works of your ministries, and inspire
                people to dig deeper.&rdquo;
              </p>
            </blockquote>
            <p className="mt-4 text-sm font-medium text-navy/60">
              Zach Werner, Head of Communications, Diocese of Reno
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-navy/10 bg-white p-6 sm:p-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Midwest Province Vocation Office, Capuchin Franciscans
            </span>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 sm:items-center">
              <div>
                <p className="font-serif text-4xl font-semibold text-navy">
                  140+
                </p>
                <p className="text-sm font-medium uppercase tracking-wide text-navy/60">
                  Inquiries in 60 Days
                </p>
                <p className="mt-4 text-navy/80">
                  For $380 in ad spend, 140+ Catholic men reached out about a
                  conversation on religious life. Ten were qualified and went
                  on to meet in person or on a Zoom call with Fr. Nathan
                  Linton, Vocations Director.
                </p>
              </div>
              <div className="overflow-hidden rounded-lg border border-navy/10">
                <Image
                  src={capuchinsPhoto}
                  alt="Capuchin friars of the Midwest Province of St. Joseph"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Client roster */}
        <div className="mt-20">
          <h3 className="text-center font-serif text-xl font-semibold text-navy">
            Also Trusted By
          </h3>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clients
              .filter(
                (client) =>
                  client.name !== "Bishop Daniel Mueggenborg" &&
                  client.name !== "Fr. Nathan Linton, Vocations Director"
              )
              .map((client) => (
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

        {/* Bulletin & design work */}
        <div className="mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="font-serif text-2xl font-semibold text-navy">
              Bulletin &amp; Design Work
            </h3>
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
      </div>
    </section>
  );
}
