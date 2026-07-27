import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import founderPhoto from "../../public/images/founder/joe-founder-photo.png";

export default function Home() {
  return (
    <>
      <Nav />

      <main className="flex flex-1 flex-col">
        <section
          id="home"
          className="mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center sm:py-32"
        >
          <span className="h-1 w-16 rounded-full bg-gold" />
          <h1 className="mt-8 font-serif text-4xl font-semibold leading-tight text-navy sm:text-5xl md:text-6xl">
            Grow Your Parish&rsquo;s Reach Through Social Media and Targeted
            Ads
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-navy/70 sm:text-xl">
            We turn your homilies and events into content that reaches new
            families online — without filling up the pastor&rsquo;s calendar.
          </p>
          <Link
            href="/contact"
            className="mt-10 rounded-full bg-navy px-8 py-3.5 text-base font-medium text-offwhite transition-colors hover:bg-navy/90"
          >
            Get Started
          </Link>
          <Link
            href="/services#for-vocation-offices"
            className="mt-6 text-sm font-medium text-navy/60 underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-navy"
          >
            We also help vocation offices reach young men discerning a call →
          </Link>
        </section>

        {/* Teasers: Services / Testimonials / About */}
        <section className="px-6 pb-24 sm:pb-32">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
            {/* Services teaser */}
            <div className="flex flex-col rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                How It Works
              </span>
              <h2 className="mt-3 font-serif text-xl font-semibold text-navy">
                Two Ways We Grow Your Reach
              </h2>
              <p className="mt-3 flex-1 text-navy/80">
                We turn your homilies and events into content people share,
                and run targeted Meta ads that bring in new families and
                volunteers — with one clear report each month tracking it
                all.
              </p>
              <div className="mt-6 flex gap-4 border-t border-navy/10 pt-6">
                <div>
                  <p className="font-serif text-2xl font-semibold text-navy">
                    0 → 941
                  </p>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-navy/50">
                    Followers in 4 Months
                  </p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-semibold text-navy">
                    $2&ndash;3
                  </p>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-navy/50">
                    Per Lead
                  </p>
                </div>
              </div>
              <Link
                href="/services"
                className="mt-6 text-sm font-medium text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-navy/80"
              >
                Explore Services →
              </Link>
            </div>

            {/* Testimonials teaser */}
            <div className="flex flex-col rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                Testimonials
              </span>
              <h2 className="mt-3 font-serif text-xl font-semibold text-navy">
                Real Parishes, Real Growth
              </h2>
              <p className="mt-3 flex-1 font-serif text-base italic leading-relaxed text-navy/80">
                &ldquo;Joe helped us build an Instagram page from zero to 300
                followers, redesigned our bulletin, and trained our staff to
                use Canva and Meta ads so we can do this on our own.&rdquo;
              </p>
              <p className="mt-3 text-sm font-medium text-navy/60">
                Fr. Nicholas Fleming, Saints John and James Parish
              </p>
              <p className="mt-6 border-t border-navy/10 pt-6 text-sm text-navy/70">
                Trusted by 9+ parishes, dioceses, and vocation offices.
              </p>
              <Link
                href="/testimonials"
                className="mt-6 text-sm font-medium text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-navy/80"
              >
                Read Testimonials →
              </Link>
            </div>

            {/* About teaser */}
            <div className="flex flex-col rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                About
              </span>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={founderPhoto}
                    alt="Joe Jarrell, founder of Parish Media Company"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h2 className="font-serif text-xl font-semibold text-navy">
                  Joe Jarrell
                </h2>
              </div>
              <p className="mt-4 flex-1 text-navy/80">
                Joe spent three years building an online following and
                running a fitness program for Catholic men — working with
                over 200 men, including 20 priests — before founding Parish
                Media Company in early 2026.
              </p>
              <Link
                href="/about"
                className="mt-6 text-sm font-medium text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-navy/80"
              >
                Meet Joe →
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-navy px-6 py-20 text-center sm:py-24">
          <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
          <h2 className="mx-auto mt-8 max-w-2xl font-serif text-3xl font-semibold text-offwhite sm:text-4xl">
            Ready to Grow Your Parish&rsquo;s Reach?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-offwhite/70">
            Tell us a bit about your parish or office, and we&rsquo;ll follow
            up.
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-block rounded-full bg-offwhite px-8 py-3.5 text-base font-medium text-navy transition-colors hover:bg-offwhite/90"
          >
            Get Started
          </Link>
        </section>
      </main>
    </>
  );
}
