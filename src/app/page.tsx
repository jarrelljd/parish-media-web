import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import BookACallButton from "@/components/BookACallButton";
import TrustedByMarquee from "@/components/TrustedByMarquee";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import HeroSlideshow, { type Slide } from "@/components/HeroSlideshow";
import navephoto from "../../public/images/events/st-mary-mountains/landing/nave.jpg";
import youngAdultsGroup from "../../public/images/clients/fr-nicholas-young-adult-group.jpg";
import roseWindowPhoto from "../../public/images/events/st-mary-mountains/landing/organ-rose-window.jpg";
import callingPainting from "../../public/images/art/calling-of-st-matthew.jpg";
import igGrid from "../../public/images/proof/st-joseph-instagram-grid.png";
import adOnPhone from "../../public/images/proof/ad-on-phone.png";
import monthlyReport from "../../public/images/proof/st-joseph-monthly-report-crop.png";
import bookHardcover from "../../public/images/free-guide/book-hardcover.png";
import founderPhoto from "../../public/images/founder/joe-founder-photo.png";
import frJaredPhoto from "../../public/images/clients/fr-jared-de-leo.jpg";
import zachWernerPhoto from "../../public/images/clients/zach-werner-headshot.png";
import johnLujanPhoto from "../../public/images/clients/john-lujan-headshot.png";



// ---- Shared styles --------------------------------------------------------

const textLink =
  "group inline-flex items-center gap-2 font-semibold text-lapis underline decoration-lapis/30 decoration-1 underline-offset-[6px] transition-colors hover:decoration-lapis";
const arrow = "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none";

// Small red label, like the rubrics printed in a missal.
const rubric = "font-display text-lg italic text-rubric";
const h2 = "font-display text-4xl font-medium leading-[1.08] text-balance sm:text-5xl";

// ---- Hero ----------------------------------------------------------------

const heroLines = ["Bring more", "young families", "into your parish."];

const heroSlides: Slide[] = [
  {
    src: navephoto,
    alt: "The nave of St. Mary in the Mountains, looking toward the high altar",
    caption: "St. Mary in the Mountains, Virginia City, NV",
    position: "50% 55%",
  },
  {
    src: youngAdultsGroup,
    alt: "Fr. Nicholas Fleming with a large group of young adults in the church at Ss. John and James Parish",
    caption: "Young adult night, Ss. John & James, West Warwick, RI",
    position: "50% 40%",
  },
  {
    src: roseWindowPhoto,
    alt: "Pipe organ and rose window in the choir loft of St. Mary in the Mountains",
    caption: "St. Mary in the Mountains, Virginia City, NV",
    position: "50% 35%",
  },
];

// ---- Content (every number and quote here is already on the live site) ----

const facts = [
  { stat: "65", label: "young adults asked about young adult events in 60 days", who: "St. Patrick’s, South Hadley, MA" },
  { stat: "200", label: "men reached out about religious life in 90 days", who: "Capuchin Franciscans, Midwest Province" },
  { stat: "0→320", label: "Instagram followers in the first 30 days", who: "Ss. John & James, West Warwick, RI" },
];

const steps: {
  n: string;
  title: string;
  lead: string;
  body: string;
  image: StaticImageData;
  alt: string;
  caption: string;
}[] = [
  {
    n: "1",
    title: "Encounter",
    lead: "Weekly content",
    body: "Homily clips and parish-life posts on Facebook and Instagram help people get to know, like, and trust your parish, with no extra work for your staff.",
    image: igGrid,
    alt: "St. Joseph Parish Instagram grid with homily clips, a festival flyer, and parish photos",
    caption: "St. Joseph Parish, Los Banos, CA. Homily clips and parish life, every week.",
  },
  {
    n: "2",
    title: "Invitation",
    lead: "Targeted local campaigns",
    body: "We invite people in your area to one clear next step, like an event, a young adult night, or a warm welcome back to Mass, so they can raise their hand.",
    image: adOnPhone,
    alt: "Facebook ad inviting St. Patrick's parishioners and friends to the annual parish picnic",
    caption: "A real invitation: the parish picnic at St. Patrick’s, South Hadley, MA.",
  },
  {
    n: "3",
    title: "Accompaniment",
    lead: "Follow-up and simple reports",
    body: "We track every response so you see real outcomes, like how many young adults asked about Mass in the last 90 days, and we use that to improve what comes next.",
    image: monthlyReport,
    alt: "Monthly community growth report for St. Joseph's Catholic Church, Los Banos",
    caption: "The monthly report a pastor receives. St. Joseph’s, Los Banos, CA.",
  },
];

const comparison = [
  ["Posts to stay active, without a specific goal", "Clear goals for every campaign: event sign-ups, first-time visitors, volunteers"],
  ["Announces events and hopes the right people see them", "Targeted, trackable campaigns that get people nearby to show up to parish events"],
  ["Rarely reaches people who aren\u2019t already in the pews", "Plan Your Visit campaigns that invite newcomers to Mass, with personal follow-up"],
  ["No way to tell what worked, or who came because of it", "Every response tracked, plus proven best practices from parishes in 12+ dioceses"],
];

const testimonials = [
  {
    photo: zachWernerPhoto,
    quote: "Joe works with paid advertisements and social media to highlight the great works of your ministries, and inspire people to dig deeper.",
    name: "Zach Werner",
    role: "Director of Mission Advancement, Diocese of Reno",
    photoStyle: {},
  },
  {
    photo: johnLujanPhoto,
    quote: "The level of expertise Joe brings is incredible. I really appreciate your time, it’s been extremely valuable for me.",
    name: "John Lujan",
    role: "Head of Communications, Diocese of Reno",
    photoStyle: { objectPosition: "50% 35%", transform: "scale(1.8)" },
  },
];

const resources = [
  { title: "The Book", sub: "Social Media for Catholic Churches", body: "Our playbook for reaching new families online, free for parish leaders.", href: "/free-guide" },
  { title: "The Scorecard", sub: "Parish Social Media Scorecard", body: "Answer 14 quick questions and get a free score out of 100 for how well your parish reaches new people.", href: "/scorecard" },
  { title: "House of Studies", sub: "Free training for parish staff", body: "Books, video tutorials, and step-by-step guides for growing your parish, diocese, or religious order.", href: "/house-of-studies" },
];

// ---- Page -----------------------------------------------------------------

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-vellum text-ink">
      <Nav overlay />

      <main className="flex flex-1 flex-col">
        {/* Hero: full-screen photos of the Church and her people */}
        <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#0e0c0a] text-vellum">
          <HeroSlideshow slides={heroSlides} />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-32 pt-36 lg:px-10">
            <p className="font-display text-xl italic text-[#e3a196] motion-safe:animate-fade-up" style={{ animationDelay: "300ms" }}>
              For Catholic parishes
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-[3.2rem] font-normal leading-[1.08] tracking-[-0.015em] sm:text-7xl lg:text-[6rem]">
              {heroLines.map((line, i) => (
                <span key={line} className="-mx-[0.08em] -mb-[0.14em] block overflow-hidden px-[0.08em] pb-[0.14em]">
                  <span className="block motion-safe:animate-rise" style={{ animationDelay: `${450 + i * 140}ms` }}>
                    {i === 1 ? <em>{line}</em> : line}
                  </span>
                </span>
              ))}
            </h1>
            <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-vellum/80 motion-safe:animate-fade-up sm:text-xl" style={{ animationDelay: "1000ms" }}>
              We&rsquo;re helping Catholic churches get 30&ndash;50 new people
              involved in parish life in just 90&nbsp;days, through weekly
              content, personal invitations, and careful follow&#8209;up.
            </p>
            <div className="mt-10 flex flex-col items-start gap-6 motion-safe:animate-fade-up sm:flex-row sm:items-center sm:gap-8" style={{ animationDelay: "1200ms" }}>
              <BookACallButton className="group inline-flex w-full items-center justify-center gap-2.5 rounded-[3px] bg-vellum px-8 py-4 text-base font-semibold text-ink transition-colors hover:bg-white sm:w-auto">
                Book a call
                <ArrowRight className={arrow} aria-hidden="true" />
              </BookACallButton>
              <Link href="/free-guide" className="group inline-flex items-center gap-2 font-semibold text-vellum underline decoration-vellum/40 underline-offset-[6px] hover:decoration-vellum">
                Get the free book
                <ArrowRight className={arrow} aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-8 text-[15px] text-vellum/60 motion-safe:animate-fade-up" style={{ animationDelay: "1350ms" }}>
              Vocation office?{" "}
              <Link href="/vocations" className="underline decoration-vellum/30 underline-offset-4 hover:text-vellum">
                See how we help reach young men discerning a&nbsp;call.
              </Link>
            </p>
          </div>
        </section>

        <section className="px-6 py-6 lg:px-10 lg:py-10">
          {/* Real results, from the Results page */}
          <div className="mx-auto max-w-7xl">
            <dl className="grid divide-y divide-ink/10 md:grid-cols-3 md:divide-x md:divide-y-0">
              {facts.map((f) => (
                <div key={f.who} className="py-7 md:px-8 md:first:pl-0 md:last:pr-0">
                  <dt className="sr-only">{f.who}</dt>
                  <dd>
                    <span className="block font-display text-5xl font-medium text-lapis">{f.stat}</span>
                    <span className="mt-2 block text-pretty text-ink/75">{f.label}</span>
                    <span className="mt-2 block font-display text-base italic text-ink/50">{f.who}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Trusted by */}
        <section className="border-y border-ink/10 bg-[#fbf8f2] px-6 py-12 lg:px-10 [&_.font-serif]:font-display">
          <div className="mx-auto max-w-6xl">
            <p className="text-center font-display text-lg italic text-ink/55">
              Trusted by pastors, bishops, and religious&nbsp;communities
            </p>
            <div className="mt-8">
              <TrustedByMarquee />
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-ink text-vellum">
          <div className="mx-auto grid max-w-[1600px] lg:grid-cols-2">
            <figure className="relative min-h-[22rem] sm:min-h-[30rem]">
              <Image
                src={callingPainting}
                alt="Caravaggio's The Calling of St. Matthew: Christ points across a dim room at Matthew, seated at a table counting coins."
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-[60%_65%]"
              />
              <figcaption className="absolute bottom-3 left-4 font-display text-sm italic text-vellum/70">
                Caravaggio, <span className="not-italic">The Calling of St. Matthew</span>, 1599&ndash;1600
              </figcaption>
            </figure>
            <div className="flex items-center px-6 py-20 sm:px-12 lg:px-16 lg:py-28">
              <Reveal className="max-w-xl">
                <p className="font-display text-lg italic text-[#d9867c]">Why we do this</p>
                <h2 className={`mt-4 ${h2}`}>New methods for an ancient&nbsp;mission.</h2>
                <p className="mt-7 text-pretty text-lg leading-relaxed text-vellum/75">
                  Christ still calls people by name. Today, many of them are
                  scrolling past your parish on their phones. We help pastors
                  meet them there and invite them&nbsp;home.
                </p>
                <figure className="mt-10 border-l-2 border-rubric pl-6">
                  <blockquote className="font-display text-2xl italic leading-snug">
                    &ldquo;A new evangelization: new in its ardor, methods, and&nbsp;expression.&rdquo;
                  </blockquote>
                  <figcaption className="mt-3 text-sm text-vellum/60">St. John Paul II, 1983</figcaption>
                </figure>
              </Reveal>
            </div>
          </div>
        </section>

        {/* How it works, shown with real work */}
        <section className="px-6 py-24 sm:py-28 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
              <div>
                <p className={rubric}>How it works</p>
                <h2 className={`mt-3 ${h2}`}>Encounter, invitation, accompaniment.</h2>
              </div>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-ink/70 lg:justify-self-end">
                A measurable communication system built around Facebook and
                Instagram, renewed every month. Here&rsquo;s what each part looks
                like in a real&nbsp;parish.
              </p>
            </div>

            <div className="mt-16 space-y-20 lg:space-y-28">
              {steps.map((s, i) => (
                <Reveal key={s.title}>
                  <article className="grid items-center gap-10 border-t border-ink/15 pt-10 lg:grid-cols-2 lg:gap-20">
                    <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                      <p className="font-display text-6xl font-medium leading-none text-rubric">{s.n}</p>
                      <h3 className="mt-5 font-display text-4xl font-medium">{s.title}</h3>
                      <p className="mt-1 font-display text-xl italic text-ink/60">{s.lead}</p>
                      <p className="mt-5 max-w-lg text-pretty text-lg leading-relaxed text-ink/75">{s.body}</p>
                    </div>
                    <figure className={i % 2 === 1 ? "lg:order-1" : ""}>
                      <div className="flex h-[24rem] items-center justify-center overflow-hidden bg-black sm:h-[28rem]">
                        <Image
                          src={s.image}
                          alt={s.alt}
                          sizes="(min-width: 1024px) 600px, 100vw"
                          className="h-full w-auto object-contain"
                        />
                      </div>
                      <figcaption className="mt-3 font-display text-base italic text-ink/60">{s.caption}</figcaption>
                    </figure>
                  </article>
                </Reveal>
              ))}
            </div>

            <p className="mt-16">
              <Link href="/parish" className={textLink}>
                See the full system in detail
                <ArrowRight className={arrow} aria-hidden="true" />
              </Link>
            </p>
          </div>
        </section>

        {/* The difference */}
        <section className="bg-vellum-deep px-6 py-24 sm:py-28 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <p className={rubric}>The difference</p>
            <h2 className={`mt-3 ${h2}`}>&ldquo;We already have someone for social&nbsp;media.&rdquo;</h2>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink/70">
              Most parishes do, and they&rsquo;re a blessing. But their job is
              to post. Ours is to get people to show up: targeted, trackable
              campaigns for your parish events, and Plan Your Visit campaigns
              that bring newcomers to Mass. Most parish staff were never
              trained to track that, and they shouldn&rsquo;t have to&nbsp;be.
            </p>

            <table className="mt-12 w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th scope="col" className="w-1/2 pb-3 pr-6 font-display text-xl font-medium text-ink/60">A volunteer or staff member</th>
                  <th scope="col" className="w-1/2 pb-3 font-display text-xl font-semibold text-lapis">Parish Media Company</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map(([a, b]) => (
                  <tr key={a} className="border-b border-ink/15 align-top">
                    <td className="py-5 pr-6 text-pretty text-ink/55">{a}</td>
                    <td className="py-5 text-pretty font-medium text-ink">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <figure className="mt-14 max-w-3xl">
              <p className="text-ink/60">It&rsquo;s a system that lets you say something like:</p>
              <blockquote className="mt-3 font-display text-3xl italic leading-snug text-ink">
                &ldquo;We had 20 brand new young adults express interest in
                coming to Mass in the last 90 days, and here is where they
                came&nbsp;from.&rdquo;
              </blockquote>
            </figure>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-6 py-24 sm:py-28 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <p className={rubric}>In their words</p>
            <div className="mt-8 grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
              <Reveal>
                <figure>
                  <blockquote className="font-display text-4xl font-medium leading-[1.15] text-balance sm:text-[3.4rem]">
                    &ldquo;Joe&rsquo;s work has been great. Easter Mass was the
                    most packed it&rsquo;s ever&nbsp;been.&rdquo;
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4">
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-vellum-deep">
                      <Image src={frJaredPhoto} alt="" fill sizes="64px" className="object-cover object-[50%_15%]" />
                    </span>
                    <span>
                      <span className="block font-semibold">Fr. Jared DeLeo</span>
                      <span className="block text-ink/60">Pastor, St. Monica Catholic Parish, Palatka, FL</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
              <div className="space-y-10 lg:border-l lg:border-ink/15 lg:pl-16">
                {testimonials.map((t) => (
                  <Reveal key={t.name}>
                    <figure>
                      <blockquote className="font-display text-2xl leading-snug">&ldquo;{t.quote}&rdquo;</blockquote>
                      <figcaption className="mt-5 flex items-center gap-3">
                        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-vellum-deep">
                          <Image src={t.photo} alt="" fill sizes="44px" className="object-cover" style={t.photoStyle} />
                        </span>
                        <span className="text-[15px]">
                          <span className="block font-semibold">{t.name}</span>
                          <span className="block text-ink/60">{t.role}</span>
                        </span>
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            </div>
            <p className="mt-16">
              <Link href="/results" className={textLink}>
                See more results and pastor videos
                <ArrowRight className={arrow} aria-hidden="true" />
              </Link>
            </p>
          </div>
        </section>

        {/* Resources */}
        <section className="border-t border-ink/10 bg-[#fbf8f2] px-6 py-24 sm:py-28 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className={rubric}>Free resources</p>
              <h2 className={`mt-3 ${h2}`}>Start here, even if we never work&nbsp;together.</h2>
              <Link href="/free-guide" className="mt-8 block w-56 transition-transform duration-500 hover:-translate-y-1 motion-reduce:transition-none sm:w-64 lg:mt-10 lg:w-72">
                <Image
                  src={bookHardcover}
                  alt="Social Media for Catholic Churches, by Joe Jarrell, hardcover"
                  sizes="(min-width: 1024px) 288px, 256px"
                  className="h-auto w-full drop-shadow-[0_24px_30px_rgba(29,26,22,0.25)]"
                />
              </Link>
            </div>
            <ul className="border-t-2 border-ink">
              {resources.map((r) => (
                <li key={r.href} className="border-b border-ink/15">
                  <Link href={r.href} className="group grid gap-2 py-8 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-10">
                    <span>
                      <span className="block font-display text-3xl font-medium group-hover:text-lapis">{r.title}</span>
                      <span className="mt-1 block font-display text-lg italic text-ink/55">{r.sub}</span>
                      <span className="mt-3 block max-w-xl text-pretty text-ink/70">{r.body}</span>
                    </span>
                    <ArrowRight className="hidden h-6 w-6 text-lapis transition-transform duration-300 group-hover:translate-x-1 sm:block" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Founder */}
        <section className="border-t border-ink/10 px-6 py-20 sm:py-24 lg:px-10">
          <div className="mx-auto grid max-w-5xl items-center gap-10 sm:grid-cols-[auto_1fr] sm:gap-14">
            <div className="relative h-56 w-44 overflow-hidden bg-vellum-deep">
              <Image src={founderPhoto} alt="Joe Jarrell, founder of Parish Media Company" fill sizes="176px" className="object-cover object-top grayscale" />
            </div>
            <div>
              <p className={rubric}>Who we are</p>
              <h2 className="mt-2 font-display text-4xl font-medium">Joe Jarrell, founder</h2>
              <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink/70">
                Joe spent three years building an online following and running
                a fitness program for Catholic men, working with over 200 men,
                including 20 priests. Along the way, he felt called to something
                bigger: helping parishes reach the people who need them&nbsp;most.
              </p>
              <p className="mt-6">
                <Link href="/about" className={textLink}>
                  Read our story
                  <ArrowRight className={arrow} aria-hidden="true" />
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-lapis px-6 py-20 text-vellum sm:py-24 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className={h2}>Ready to welcome more young adults to your&nbsp;parish?</h2>
              <p className="mt-5 text-pretty text-lg text-vellum/75">
                Book a free 30-minute Parish Growth Assessment, or start with
                the free&nbsp;book.
              </p>
            </div>
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
              <BookACallButton className="group inline-flex w-full items-center justify-center gap-2.5 rounded-[3px] bg-vellum px-7 py-4 text-base font-semibold text-lapis transition-colors hover:bg-white sm:w-auto">
                Book a call
                <ArrowRight className={arrow} aria-hidden="true" />
              </BookACallButton>
              <Link href="/free-guide" className="font-semibold text-vellum underline decoration-vellum/40 underline-offset-[6px] hover:decoration-vellum">
                Get the free book
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
