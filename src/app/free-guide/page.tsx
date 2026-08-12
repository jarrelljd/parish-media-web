import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import FreeGuideForm from "@/components/FreeGuideForm";
import FreeGuideCtaButton from "@/components/FreeGuideCtaButton";
import bookHardcover from "../../../public/images/free-guide/book-hardcover.png";
import founderPhoto from "../../../public/images/founder/joe-founder-photo.png";

export const metadata: Metadata = {
  title: "Free Guide | Parish Media Company",
  description:
    "Get a free copy of Social Media for Catholic Churches, Joe Jarrell's published, practical guide to Parish Facebook & Instagram.",
};

const chapters = [
  "The relationship between giving value and making clear asks",
  "Closing the “attention gap” by communicating where people are already listening",
  "Using social media as a simple reach, nurture, and convert system",
  "The H.A.C.S. Framework for weekly organic posting",
  "Homily clips, activity posts, connection posts, and Stories that actually serve a purpose",
  "Stronger creative, clearer calls to action, and honest scarcity for parish asks",
  "Using paid ads to promote events, recruit volunteers, and reach people outside the parish bubble",
  "A simple 1-3-10 ad system for parish growth",
];

export default function FreeGuidePage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-10 pb-16 sm:pt-14 sm:pb-20">
          {/*
            Background: a faint feed-grid dot pattern (nod to a social
            feed) plus a crisp radial wash behind the headline — no blur
            filters, just gradient falloff, so it reads as a clean glow
            rather than a smudgy blob.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(27,42,74,0.10) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 640px 420px at 50% 0%, rgba(201,162,39,0.16), transparent 70%)",
            }}
          />

          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-balance font-serif text-4xl font-semibold leading-tight text-navy sm:text-5xl">
              Do You Want More Young Families at Your Parish?
            </h1>

            <div className="mx-auto mt-6 w-52 sm:w-60">
              <Image
                src={bookHardcover}
                alt="Social Media for Catholic Churches, by Joe Jarrell, hardcover book"
                className="h-auto w-full"
                priority
              />
            </div>

            <p className="mt-8 text-pretty text-lg text-navy/70">
              Get the free digital copy of my book, &ldquo;Social Media
              for Catholic Churches,&rdquo; and see how we&rsquo;re
              helping get 30&ndash;50 new people involved in parish
              life in just 90 days.
            </p>

            {/*
              VSL slot: once a 60-second video exists, it goes here between
              the subheading and CTA. No player wired up yet.
            */}

            <div className="mt-10">
              <FreeGuideCtaButton />
              <p className="mt-3 text-sm text-navy/50">
                Instant download. No credit card.
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="px-6 pb-20 sm:pb-28">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
              <div className="relative mx-auto w-full max-w-xs sm:max-w-sm">
                <Image
                  src={bookHardcover}
                  alt="Social Media for Catholic Churches, by Joe Jarrell, hardcover book"
                  className="h-auto w-full"
                />
                <div
                  className="absolute right-4 top-4 flex h-16 w-16 rotate-12 flex-col items-center justify-center bg-gold text-navy shadow-md sm:h-20 sm:w-20"
                  style={{
                    clipPath:
                      "polygon(50.0% 0.0%, 61.1% 15.8%, 79.4% 9.5%, 79.1% 28.8%, 97.6% 34.5%, 86.0% 50.0%, 97.6% 65.5%, 79.1% 71.2%, 79.4% 90.5%, 61.1% 84.2%, 50.0% 100.0%, 38.9% 84.2%, 20.6% 90.5%, 20.9% 71.2%, 2.4% 65.5%, 14.0% 50.0%, 2.4% 34.5%, 20.9% 28.8%, 20.6% 9.5%, 38.9% 15.8%)",
                  }}
                >
                  <span className="text-[9px] font-semibold uppercase tracking-wide line-through opacity-70 sm:text-[10px]">
                    $17.99
                  </span>
                  <span className="text-xs font-bold sm:text-sm">
                    FREE
                  </span>
                </div>
              </div>

              <div id="free-guide-form" className="scroll-mt-24">
                <FreeGuideForm />
              </div>
            </div>
          </div>
        </section>

        {/* What's Inside */}
        <section className="bg-navy/5 px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                What&rsquo;s Inside
              </span>
              <h2 className="mt-4 text-balance font-serif text-2xl font-semibold text-navy sm:text-3xl">
                Inside, You&rsquo;ll Learn How To
              </h2>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {chapters.map((chapter) => (
                <li
                  key={chapter}
                  className="flex items-start gap-3 rounded-xl border border-navy/10 bg-white p-4"
                >
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-gold"
                    aria-hidden="true"
                  >
                    &#10003;
                  </span>
                  <span className="text-pretty text-sm text-navy/80">
                    {chapter}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mx-auto mt-10 max-w-xl text-pretty text-center text-navy/70">
              Whether your parish wants more event attendance, more
              volunteers, more young adult engagement, or simply a
              clearer social media strategy, this book gives you a
              system you can actually understand and implement.
            </p>
          </div>
        </section>

        {/* About the Author */}
        <section className="px-6 py-20 sm:py-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <div className="h-20 w-20 overflow-hidden rounded-full border border-navy/10">
              <Image
                src={founderPhoto}
                alt="Joe Jarrell, founder of Parish Media Company"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                About the Author
              </span>
              <h2 className="mt-3 font-serif text-2xl font-semibold text-navy">
                Joe Jarrell
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-pretty text-navy/70">
                Joe spent three years building an online following and
                running a fitness program for Catholic men, working with
                over 200 men, including 20 priests, before founding
                Parish Media Company in early 2026. He wrote{" "}
                <em>Social Media for Catholic Churches</em> from that same
                work: running done-for-you Facebook and Instagram growth
                for Catholic parishes and dioceses.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
