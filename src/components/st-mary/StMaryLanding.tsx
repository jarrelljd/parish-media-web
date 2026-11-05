import Image from "next/image";
import Script from "next/script";
import { ArrowRight, ChevronDown, MapPin, Phone, Play } from "lucide-react";
import Reveal from "@/components/Reveal";
import StMaryVisitForm from "@/components/st-mary/StMaryVisitForm";
import { stMary } from "@/data/stMaryLanding";

// St. Mary in the Mountains landing page, in the design of the Capuchin Franciscans site:
// cream and sand bands, Fraunces headings, full-bleed photos, a timeline, ruled lists,
// and one button ("Get the Free Visit Guide") that always goes to the form.
//
// Colors are page-local (like the other per-parish event pages), not site tokens:
// brick #7b2d26 (the church's brick), gold #c9a662, slate panel #1d2833,
// cream #fbf7f1, sand #f3e9dc, ink #2e211c, soft ink #6b5a50.

const { cta } = stMary;

function Mark({ className = "size-9" }: { className?: string }) {
  // The parish logo's mountain-and-cross mark (public/images/parishes/st-mary-mountains/logo.svg).
  return (
    <svg viewBox="0 0 86 64" className={className} aria-hidden="true">
      <polygon points="8,58 30,24 44,42 60,18 78,58" fill="#7b2d26" />
      <line x1="60" y1="18" x2="60" y2="2" stroke="#c9a662" strokeWidth="3" strokeLinecap="round" />
      <line x1="53" y1="7" x2="67" y2="7" stroke="#c9a662" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Logo({ tone }: { tone: "light" | "dark" }) {
  return (
    <span className="flex items-center gap-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#fbf7f1] shadow-md shadow-black/10">
        <Mark className="size-8" />
      </span>
      <span className="leading-tight">
        <span className={`block font-serif text-lg font-semibold ${tone === "light" ? "text-[#fbf7f1]" : "text-[#2e211c]"}`}>
          St. Mary in the Mountains
        </span>
        <span className={`block text-xs font-semibold tracking-wide uppercase ${tone === "light" ? "text-[#fbf7f1]/75" : "text-[#6b5a50]"}`}>
          Virginia City, Nevada
        </span>
      </span>
    </span>
  );
}

function Button({ variant = "primary", className = "", children }: { variant?: "primary" | "light"; className?: string; children: React.ReactNode }) {
  const look =
    variant === "primary"
      ? "bg-[#7b2d26] text-[#fbf7f1] shadow-lg shadow-[#7b2d26]/25 hover:bg-[#5e211b] hover:shadow-xl"
      : "bg-[#fbf7f1] text-[#5e211b] shadow-lg shadow-black/15 hover:bg-white hover:shadow-xl";
  return (
    <a
      href={cta.href}
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-bold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${look} ${className}`}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
    </a>
  );
}

const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <p className={`text-xs font-bold tracking-[0.25em] uppercase ${light ? "text-[#c9a662]" : "text-[#8a6a2c]"}`}>{children}</p>
);

// ---- Sections

function Hero() {
  const { hero } = stMary;
  return (
    <section className="relative flex min-h-[40rem] items-end overflow-hidden bg-[#1d2833] sm:min-h-[44rem] lg:h-[92vh] lg:max-h-[56rem]">
      {/* Drone loop; people who prefer less motion get the still frame. */}
      <Image src={hero.poster} alt="" fill priority sizes="100vw" className="object-cover" />
      <video
        src={hero.video}
        poster={hero.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover motion-reduce:hidden"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1d2833] via-[#1d2833]/55 to-[#1d2833]/25" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1d2833]/70 to-transparent" aria-hidden="true" />

      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <Logo tone="light" />
          <a
            href={cta.href}
            className="hidden rounded-full bg-[#fbf7f1]/95 px-5 py-2.5 text-sm font-bold text-[#5e211b] shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white sm:inline-flex"
          >
            Free Visit Guide
          </a>
        </div>
      </header>

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-32 pb-14 text-[#fbf7f1] sm:px-6 sm:pb-20">
        <Reveal>
          <p className="flex items-center gap-4 text-xs font-bold tracking-[0.3em] text-[#c9a662] uppercase">
            <span className="h-px w-10 bg-[#c9a662]" aria-hidden="true" />
            {hero.eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[1.02] font-medium tracking-tight text-balance sm:text-7xl">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-[#fbf7f1]/85 sm:text-xl">{hero.intro}</p>
          <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
            <Button variant="light" className="w-full sm:w-auto">
              {cta.label}
            </Button>
            <a href="#video" className="inline-flex items-center gap-3 font-bold text-[#fbf7f1] hover:text-[#c9a662]">
              <span className="grid size-11 place-items-center rounded-full ring-1 ring-[#fbf7f1]/40">
                <Play className="size-4 fill-current" aria-hidden="true" />
              </span>
              Watch the video
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// The VSL beside the form: watch, then sign up without scrolling on desktop.
function VideoAndForm() {
  const { vsl } = stMary;
  return (
    <section id="video" className="relative scroll-mt-4 overflow-hidden bg-[#f3e9dc]/60 py-20 sm:py-28">
      <div className="pointer-events-none absolute -top-40 -right-40 size-[36rem] rounded-full bg-[#f3e9dc] blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
        <Reveal>
          <Eyebrow>{vsl.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-balance sm:text-5xl">{vsl.title}</h2>
          <div className="mt-8 rounded-[1.75rem] bg-white p-2.5 shadow-2xl shadow-[#2e211c]/10 ring-1 ring-[#2e211c]/5">
            <div className="relative overflow-hidden rounded-[1.25rem] bg-[#1d2833]" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={`https://player.vimeo.com/video/${vsl.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full border-0"
                title="Visit St. Mary in the Mountains"
              />
            </div>
          </div>
          <p className="mt-4 text-sm text-[#6b5a50]">{vsl.caption}</p>
        </Reveal>

        <Reveal
          delayMs={120}
          className="lg:mt-[7.5rem]"
        >
          <div id="visit-guide" className="scroll-mt-6 rounded-[2rem] bg-white/90 p-6 shadow-xl shadow-[#2e211c]/5 ring-1 ring-[#2e211c]/5 sm:p-8">
            <StMaryVisitForm />
          </div>
        </Reveal>
      </div>
      <Script src="https://player.vimeo.com/api/player.js" strategy="afterInteractive" />
    </section>
  );
}

function Lede() {
  const { lede } = stMary;
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
      <Reveal>
        <h2 className="font-serif text-4xl font-medium tracking-tight text-balance sm:text-5xl">{lede.title}</h2>
        {lede.body.map((p, i) => (
          <p
            key={p}
            className={`mt-6 leading-relaxed text-pretty text-[#6b5a50] ${
              i === 0
                ? "text-xl first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-[#7b2d26] sm:text-2xl"
                : "text-lg"
            }`}
          >
            {p}
          </p>
        ))}
      </Reveal>
      <Reveal delayMs={120} className="self-end">
        <ul className="border-t-2 border-[#7b2d26]">
          {lede.facts.map((f) => (
            <li key={f} className="border-b border-[#2e211c]/10 py-4 font-serif text-xl text-[#2e211c]">
              {f}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function QuoteBand({ text, cite }: { text: string; cite: string }) {
  return (
    <section className="bg-[#7b2d26] py-20 text-[#fbf7f1] sm:py-28">
      <Reveal className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <figure>
          <blockquote className="font-serif text-3xl leading-snug font-medium text-balance italic sm:text-5xl">“{text}”</blockquote>
          <figcaption className="mt-6 text-sm font-bold tracking-[0.2em] text-[#fbf7f1]/75 uppercase">{cite}</figcaption>
        </figure>
      </Reveal>
    </section>
  );
}

// What you'll see inside: text beside edge-to-edge photos, alternating sides.
function Inside() {
  return (
    <section aria-labelledby="inside-title">
      <div className="mx-auto max-w-6xl px-4 pt-20 pb-12 sm:px-6 sm:pt-28">
        <Reveal>
          <Eyebrow>Inside the church</Eyebrow>
          <h2 id="inside-title" className="mt-4 max-w-2xl font-serif text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            Three things to see when you step inside
          </h2>
        </Reveal>
      </div>
      {stMary.inside.map((b, i) => (
        <div key={b.title} className="grid items-stretch lg:grid-cols-2">
          <Reveal className={`relative min-h-[22rem] sm:min-h-[28rem] ${i % 2 ? "lg:order-last" : ""}`}>
            <Image src={b.photo.src} alt={b.photo.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </Reveal>
          <Reveal delayMs={100} className="flex flex-col justify-center px-4 py-14 sm:px-12 lg:px-16 lg:py-24">
            <p className="font-serif text-6xl leading-none font-medium text-[#2e211c]/15">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-4 font-serif text-4xl font-medium tracking-tight text-balance">{b.title}</h3>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-[#6b5a50]">{b.body}</p>
          </Reveal>
        </div>
      ))}
    </section>
  );
}

function Timeline() {
  const { history } = stMary;
  return (
    <section className="bg-[#f3e9dc]/50 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <Eyebrow>Since 1862</Eyebrow>
          <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-balance sm:text-5xl">Burned, rebuilt, and saved again</h2>
        </Reveal>
        <ol className="mt-14">
          {history.map((h, i) => (
            <li key={h.year} className="border-t border-[#2e211c]/15 py-10 first:border-t-0 first:pt-0 last:pb-0">
              <Reveal className="grid gap-4 sm:grid-cols-[11rem_1fr] sm:gap-10">
                <p
                  className={`font-serif text-6xl leading-none font-medium tracking-tight sm:text-7xl ${
                    i === history.length - 1 ? "text-[#7b2d26]" : "text-[#2e211c]/25"
                  }`}
                >
                  {h.year}
                </p>
                <div>
                  <h3 className="font-serif text-3xl font-medium tracking-tight text-balance">{h.title}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-pretty text-[#6b5a50]">{h.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Voices() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <Reveal>
        <Eyebrow>From the video</Eyebrow>
      </Reveal>
      <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
        {stMary.voices.map((v, i) => (
          <Reveal key={v.cite} delayMs={i * 100}>
            <figure className="border-l-2 border-[#7b2d26] pl-6 sm:pl-8">
              <blockquote className="font-serif text-2xl leading-snug font-medium text-pretty text-[#2e211c] italic sm:text-3xl">
                “{v.text}”
              </blockquote>
              <figcaption className="mt-5 text-sm font-bold tracking-[0.15em] text-[#6b5a50] uppercase">{v.cite}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// A loose collage: varied sizes, slight offsets, no frames.
const collage = [
  "col-span-6 row-span-2 sm:col-span-7",
  "col-span-6 sm:col-span-5 sm:mt-12",
  "col-span-6 sm:col-span-5",
  "col-span-6 sm:col-span-4",
  "col-span-6 sm:col-span-4",
  "col-span-12 sm:col-span-4 sm:mt-8",
];

function Gallery() {
  const { gallery } = stMary;
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28">
      <Reveal>
        <h2 className="mb-8 font-serif text-3xl font-medium tracking-tight">{gallery.title}</h2>
      </Reveal>
      <ul className="grid grid-cols-12 gap-3 sm:gap-5">
        {gallery.photos.map((g, i) => (
          <li key={g.src} className={collage[i % collage.length]}>
            <Reveal delayMs={(i % 3) * 80} className="h-full">
              <div className={`relative size-full overflow-hidden rounded-xl ${i === 0 ? "aspect-[4/5] sm:aspect-auto sm:min-h-full" : "aspect-[4/3]"}`}>
                <Image src={g.src} alt={g.alt} fill sizes="(min-width: 640px) 40vw, 50vw" className="object-cover" />
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Visit details on the dark band, beside the aerial photo; then the gift shop.
function Plan() {
  const { plan } = stMary;
  return (
    <section className="bg-[#1d2833] text-[#fbf7f1]">
      <div className="grid lg:grid-cols-2">
        <Reveal className="flex flex-col justify-center px-4 py-16 sm:px-12 lg:py-24 lg:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
          <Eyebrow light>Before you go</Eyebrow>
          <h2 className="mt-4 font-serif text-5xl font-medium tracking-tight text-balance sm:text-6xl">{plan.title}</h2>
          <dl className="mt-10 border-t border-[#fbf7f1]/15">
            {plan.rows.map((r) => (
              <div key={r.label} className="grid gap-1 border-b border-[#fbf7f1]/15 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
                <dt className="text-xs font-bold tracking-[0.2em] text-[#c9a662] uppercase sm:pt-1">{r.label}</dt>
                <dd className="text-lg leading-relaxed text-pretty text-[#fbf7f1]/90">{r.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stMary.address)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-bold text-[#c9a662] underline-offset-4 hover:underline"
            >
              <MapPin className="size-4" aria-hidden="true" />
              Get directions
            </a>
            <a href={`tel:${stMary.phone.replace(/\D/g, "")}`} className="inline-flex items-center gap-2 font-bold text-[#c9a662] underline-offset-4 hover:underline">
              <Phone className="size-4" aria-hidden="true" />
              {stMary.phone}
            </a>
          </p>
        </Reveal>
        <Reveal delayMs={100} className="relative min-h-[26rem]">
          <Image src={plan.photo.src} alt={plan.photo.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover lg:rounded-bl-[6rem]" />
        </Reveal>
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image src={plan.giftShop.photo.src} alt={plan.giftShop.photo.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </Reveal>
        <Reveal delayMs={100}>
          <h3 className="font-serif text-4xl font-medium tracking-tight text-balance">{plan.giftShop.title}</h3>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-[#fbf7f1]/80">{plan.giftShop.body}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
        <Reveal className="lg:sticky lg:top-12 lg:self-start">
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-4 font-serif text-5xl font-medium tracking-tight text-balance sm:text-6xl">Good to know</h2>
          <p className="mt-5 text-lg leading-relaxed text-[#6b5a50]">
            Anything else? Call the parish office at{" "}
            <a href={`tel:${stMary.phone.replace(/\D/g, "")}`} className="font-bold whitespace-nowrap text-[#7b2d26] hover:underline">
              {stMary.phone}
            </a>
            .
          </p>
        </Reveal>
        <div className="border-t border-[#2e211c]/15">
          {stMary.faq.map((item, i) => (
            <Reveal key={item.q} delayMs={i * 60}>
              <details className="group border-b border-[#2e211c]/15" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 text-left font-serif text-xl font-medium transition-colors hover:text-[#7b2d26] sm:text-2xl [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f3e9dc] text-[#7b2d26] transition-all duration-300 group-open:rotate-180 group-open:bg-[#7b2d26] group-open:text-[#fbf7f1]">
                    <ChevronDown className="size-5" aria-hidden="true" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-7 text-lg leading-relaxed text-pretty text-[#6b5a50]">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Closing() {
  const { closing } = stMary;
  return (
    <section className="relative flex min-h-[32rem] items-center overflow-hidden bg-[#1d2833]">
      <Image src={closing.photo.src} alt={closing.photo.alt} fill sizes="100vw" className="object-cover object-[70%_center]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1d2833] via-[#1d2833]/80 to-[#1d2833]/10" aria-hidden="true" />
      <Reveal className="relative mx-auto w-full max-w-6xl px-4 py-20 text-[#fbf7f1] sm:px-6">
        <div className="max-w-xl">
          <h2 className="font-serif text-5xl font-medium tracking-tight text-balance sm:text-6xl">{closing.headline}</h2>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-[#fbf7f1]/85">{closing.text}</p>
          <Button variant="light" className="mt-8 w-full sm:w-auto">
            {cta.label}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#1d2833] text-[#fbf7f1]">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-8 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Logo tone="light" />
            <p className="mt-5 flex items-center gap-2 text-sm text-[#fbf7f1]/65">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {stMary.address}
            </p>
            <a
              href={`tel:${stMary.phone.replace(/\D/g, "")}`}
              className="mt-2 flex items-center gap-2 text-sm text-[#fbf7f1]/65 transition-colors hover:text-[#fbf7f1]"
            >
              <Phone className="size-4" aria-hidden="true" />
              {stMary.phone}
            </a>
          </div>
          <p className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href="https://stmarysvc.org" target="_blank" rel="noreferrer" className="text-[#fbf7f1]/75 hover:text-[#fbf7f1]">
              Parish website
            </a>
            <a href={stMary.facebook} target="_blank" rel="noreferrer" className="text-[#fbf7f1]/75 hover:text-[#fbf7f1]">
              Facebook
            </a>
          </p>
        </div>
        <p className="mt-12 border-t border-[#fbf7f1]/10 pt-8 text-center text-sm text-[#fbf7f1]/50 sm:text-left">
          © {year} St. Mary in the Mountains Catholic Church · Diocese of Reno
        </p>
      </div>
    </footer>
  );
}

export default function StMaryLanding() {
  return (
    <div className="bg-[#fbf7f1] font-sans text-[#2e211c] antialiased">
      <main>
        <Hero />
        <VideoAndForm />
        <Lede />
        <QuoteBand {...stMary.quote} />
        <Inside />
        <Timeline />
        <Voices />
        <Gallery />
        <Plan />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}
