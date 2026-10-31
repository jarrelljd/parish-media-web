import type { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import FreeGuideForm from "@/components/FreeGuideForm";
import FreeGuideCtaButton from "@/components/FreeGuideCtaButton";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import bookHardcover from "../../../public/images/free-guide/book-hardcover.png";
import authorSigningPhoto from "../../../public/images/free-guide/author-book-signing.png";
import frIgorPhoto from "../../../public/images/free-guide/fr-igor-cutout.png";
import frIanPhoto from "../../../public/images/free-guide/fr-ian-cutout.png";

const testimonials = [
  {
    quote:
      "As a former pastor for several years, I’ve read countless parish resources, but this is the first book that gave me a clear, step-by-step plan for modern communications. It gave me a clear understanding of how to reach more young adults in parish life.",
    name: "Fr. Igor de Bliquy, OFM Cap.",
    role: "Director, Capuchin Retreat Center",
    photo: frIgorPhoto,
  },
  {
    quote:
      "As a parish priest, both myself and our communications director found this book helpful, especially in knowing the basics of parish social media and concrete steps to build up a following for the parish.",
    name: "Fr. Ian Kelly",
    role: "Parochial Vicar, St. John Vianney Parish, Cleveland",
    photo: frIanPhoto,
  },
];

export const metadata: Metadata = {
  title: "Free Guide | Parish Media Company",
  description:
    "Get a free copy of Social Media for Catholic Churches, Joe Jarrell's published, practical guide to Parish Facebook & Instagram.",
};

const concepts = [
  {
    title: "Give First, Then Ask",
    description:
      "People repay good deeds. It’s human nature. Give real value first, then ask, and your parish earns a “yes” instead of a shrug.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M4 18a8 8 0 1 1 16 0" strokeLinecap="round" />
        <path d="M12 18l4-6" strokeLinecap="round" />
        <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Social Media Is a Funnel",
    description:
      "Every post moves people through three stages: reach new faces, nurture them with value, then convert the ones who are ready to respond.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path
          d="M4 5h16l-6 8v6l-4 2v-8L4 5z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Ads Ask Without Wasting Goodwill",
    description:
      "A Story asks everyone, whether it applies to them or not. A well-aimed ad asks only the right people, so goodwill stays intact.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function FreeGuidePage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-6 pb-16 sm:pt-14 sm:pb-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[30rem] w-[48rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-parchment blur-3xl"
          />

          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-balance font-serif text-4xl font-medium leading-[1.08] tracking-tight text-navy sm:text-6xl">
              Do You Want More Young Families at Your Parish?
            </h1>

            <div className="mx-auto mt-4 w-40 sm:mt-6 sm:w-60">
              <Image
                src={bookHardcover}
                alt="Social Media for Catholic Churches, by Joe Jarrell, hardcover book"
                className="h-auto w-full"
                priority
              />
            </div>

            <p className="mt-4 text-pretty text-sm leading-relaxed text-navy/70 sm:mt-8 sm:text-xl">
              Pastors &amp; parish leaders: Get a free digital copy of my book,
              &ldquo;Social Media for Catholic Churches,&rdquo; and see
              how we&rsquo;re helping parishes get 30&ndash;50 new people
              involved in parish life in just 90 days.
            </p>

            <div className="mt-6 sm:mt-10">
              <FreeGuideCtaButton />
              <p className="mt-3 text-sm text-navy/50">
                Instant download. No credit card.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-6 pb-16 sm:pb-20">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="grid overflow-hidden rounded-3xl bg-white shadow-xl shadow-navy/5 ring-1 ring-navy/5 sm:grid-cols-[260px_1fr]"
                >
                  <div className="flex items-end justify-center bg-parchment pt-6 sm:pt-0">
                    <Image
                      src={t.photo}
                      alt={t.name}
                      className="h-auto w-[85%] sm:w-full"
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-5 p-7 sm:p-10">
                    <div className="flex gap-4">
                      <span
                        className="w-0.5 shrink-0 rounded-full bg-gold"
                        aria-hidden="true"
                      />
                      <p className="text-pretty font-serif text-lg italic leading-relaxed text-navy sm:text-xl">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.15em] text-navy">
                        {t.name}
                      </p>
                      <p className="mt-0.5 text-sm text-navy/60">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VSL */}
        <section className="px-6 pb-16 sm:pb-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance font-serif text-3xl font-medium tracking-tight text-navy sm:text-4xl">
              Watch This 60-Second Overview of the Book
            </h2>
            <div className="mt-8 rounded-[1.75rem] bg-white p-2.5 shadow-2xl shadow-navy/10 ring-1 ring-navy/5">
            <div
              className="relative overflow-hidden rounded-[1.25rem] bg-navy"
              style={{ paddingTop: "56.25%" }}
            >
              <iframe
                src="https://player.vimeo.com/video/1220634051?badge=0&autopause=0&player_id=0&app_id=58479"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full border-0"
                title="Free-Book VSL"
              />
            </div>
            </div>
          </div>
        </section>
        <Script src="https://player.vimeo.com/api/player.js" strategy="afterInteractive" />

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
        <section className="bg-parchment px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">
                What&rsquo;s Inside
              </span>
              <h2 className="mt-4 text-balance font-serif text-3xl font-medium tracking-tight text-navy sm:text-5xl">
                Three Ideas That Change How You Post
              </h2>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-3">
              {concepts.map((concept, i) => (
                <FadeInOnScroll key={concept.title} delay={i * 120}>
                  <div className="h-full rounded-3xl bg-offwhite p-7 text-center ring-1 ring-navy/5">
                    <div
                      className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-parchment text-gold-deep"
                      aria-hidden="true"
                    >
                      <div className="h-7 w-7">{concept.icon}</div>
                    </div>
                    <h3 className="mt-5 font-serif text-xl font-medium tracking-tight text-navy">
                      {concept.title}
                    </h3>
                    <p className="mt-3 text-pretty leading-relaxed text-navy/70">
                      {concept.description}
                    </p>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>

            <p className="mx-auto mt-14 max-w-xl text-pretty text-center text-lg leading-relaxed text-navy/70">
              Whether your parish wants more event attendance, more
              volunteers, more young adult engagement, or simply a
              clearer social media strategy, this book gives you a
              system you can actually understand and implement.
            </p>
          </div>
        </section>

        {/* About the Author */}
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">
              About the Author
            </span>
            <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-navy sm:text-5xl">
              Joe Jarrell
            </h2>
          </div>

          <div className="mx-auto mt-10 max-w-4xl rounded-[1.75rem] bg-white p-2.5 shadow-2xl shadow-navy/10 ring-1 ring-navy/5">
            <Image
              src={authorSigningPhoto}
              alt="Joe Jarrell signing copies of Social Media for Catholic Churches"
              className="h-auto w-full rounded-[1.25rem]"
            />
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-pretty text-center text-lg leading-relaxed text-navy/70">
            Joe spent three years building an online following and running
            a fitness program for Catholic men, working with over 200 men,
            including 20 priests, before founding Parish Media Company in
            early 2026. He wrote <em>Social Media for Catholic Churches</em>{" "}
            from that same work: running done-for-you Facebook and
            Instagram growth for Catholic parishes and dioceses.
          </p>
        </section>

        {/* Final CTA */}
        <section className="bg-parchment px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-balance font-serif text-3xl font-medium tracking-tight text-navy sm:text-5xl">
              Get Your Free Copy of the Book
            </h2>
            <p className="mt-4 text-lg text-navy/70">
              Join the parishes already putting this playbook to work.
            </p>
            <div className="mt-8">
              <FreeGuideCtaButton />
              <p className="mt-3 text-sm text-navy/50">
                Instant download. No credit card.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
