import Image from "next/image";
import { ArrowRight, Camera, Check, ChevronDown, DoorOpen, Mail, MapPin, Phone, ShieldCheck, Users } from "lucide-react";
import Reveal from "@/components/Reveal";
import HnjElcGuideForm from "@/components/hnj-elc/HnjElcGuideForm";
import HnjElcStickyCta from "@/components/hnj-elc/HnjElcStickyCta";
import { hnjElc } from "@/data/hnjElcLanding";

// Holy Name of Jesus Early Learning Center landing page. Same build as the St. Mary in
// the Mountains page (cream and sand bands, Fraunces headings, ruled lists, one button
// that always goes to the form), recolored in the school's green and gold and warmed up
// for parents of toddlers.
//
// Colors are page-local (like the other per-parish event pages), not site tokens:
// green #14603a (school logo), deep green #0f3a25, gold #e3a72f, gold text #8a6410,
// cream #fbf8f1, sand #f2ecdc, ink #1f2a22, soft ink #5b6359.

const { cta } = hnjElc;
const tel = `tel:${hnjElc.phone.replace(/\D/g, "")}`;

function Logo({ tone }: { tone: "light" | "dark" }) {
  return (
    <span className="flex items-center gap-3">
      <Image src={hnjElc.logo} alt="" width={48} height={48} className="size-12 shrink-0 rounded-full bg-white shadow-md shadow-black/10" />
      <span className="leading-tight">
        <span className={`block font-classic text-lg font-semibold ${tone === "light" ? "text-[#fbf8f1]" : "text-[#1f2a22]"}`}>
          Holy Name of Jesus
        </span>
        <span className={`block text-xs font-semibold tracking-wide uppercase ${tone === "light" ? "text-[#fbf8f1]/75" : "text-[#5b6359]"}`}>
          Early Learning Center
        </span>
      </span>
    </span>
  );
}

function Button({ variant = "primary", className = "", children }: { variant?: "primary" | "light"; className?: string; children: React.ReactNode }) {
  const look =
    variant === "primary"
      ? "bg-[#14603a] text-[#fbf8f1] shadow-lg shadow-[#14603a]/25 hover:bg-[#0f4a2d] hover:shadow-xl"
      : "bg-[#fbf8f1] text-[#0f4a2d] shadow-lg shadow-black/15 hover:bg-white hover:shadow-xl";
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
  <p className={`text-xs font-bold tracking-[0.25em] uppercase ${light ? "text-[#e3a72f]" : "text-[#8a6410]"}`}>{children}</p>
);

// ---- Sections

// Split hero: the photo sits beside the words so no faces end up under text.
function Hero() {
  const { hero } = hnjElc;
  return (
    <section className="relative overflow-hidden bg-[#f2ecdc]/70">
      <div className="pointer-events-none absolute -top-48 -left-40 size-[36rem] rounded-full bg-[#e3a72f]/15 blur-3xl" aria-hidden="true" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Logo tone="dark" />
        <a
          href={cta.href}
          className="hidden rounded-full bg-[#14603a] px-5 py-2.5 text-sm font-bold text-[#fbf8f1] shadow-lg shadow-[#14603a]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0f4a2d] sm:inline-flex"
        >
          Free ELC Guide
        </a>
      </header>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-8 pb-16 sm:px-6 sm:pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-12">
        <Reveal>
          <p className="flex items-center gap-4 text-xs font-bold tracking-[0.2em] text-[#8a6410] uppercase sm:tracking-[0.3em]">
            <span className="hidden h-px w-10 bg-[#e3a72f] sm:block" aria-hidden="true" />
            {hero.eyebrow}
          </p>
          <h1 className="mt-5 font-classic text-[2.6rem] leading-[1.04] min-[400px]:text-5xl font-medium tracking-tight text-balance sm:text-6xl lg:text-[4.25rem]">
            {/* Keep hyphenated words like "faith-filled" from splitting on small phones. */}
            {hero.headline.split(" ").map((w, i) => (
              <span key={i}>
                {i > 0 && " "}
                {w.includes("-") ? <span className="whitespace-nowrap">{w}</span> : w}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-[#5b6359] sm:text-xl">{hero.intro}</p>
          <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
            <Button className="w-full sm:w-auto">{cta.label}</Button>
            <a href={tel} className="inline-flex items-center gap-2 font-bold text-[#14603a] underline-offset-4 hover:underline">
              <Phone className="size-4" aria-hidden="true" />
              {hnjElc.phone}
            </a>
          </div>
        </Reveal>

        <Reveal delayMs={120} className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl shadow-[#1f2a22]/15 ring-1 ring-[#1f2a22]/5 lg:aspect-[5/6] lg:rounded-tl-[6rem]">
            <Image src={hero.photo.src} alt={hero.photo.alt} fill priority sizes="(min-width: 1024px) 44vw, 100vw" className="object-cover object-[60%_center]" />
          </div>
          <div className="absolute -bottom-6 left-4 rounded-2xl bg-white px-5 py-4 shadow-xl shadow-[#1f2a22]/10 ring-1 ring-[#1f2a22]/5 sm:left-6">
            <p className="font-classic text-3xl font-medium text-[#14603a]">{hero.badge.value}</p>
            <p className="mt-0.5 text-xs font-bold tracking-[0.15em] text-[#5b6359] uppercase">{hero.badge.label}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// What's in the guide beside the form: read the list, then sign up without scrolling.
function GuideAndForm() {
  const { guide } = hnjElc;
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="relative mx-auto grid max-w-6xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        <Reveal>
          <Eyebrow>{guide.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-classic text-4xl font-medium tracking-tight text-balance sm:text-5xl">{guide.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-[#5b6359]">{guide.intro}</p>
          <ul className="mt-6 space-y-3.5">
            {guide.contents.map((c) => (
              <li key={c} className="flex gap-3 text-lg leading-snug text-[#1f2a22]">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#14603a] text-[#fbf8f1]">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                {c}
              </li>
            ))}
          </ul>
          <div className="relative mt-10 hidden aspect-[3/2] overflow-hidden rounded-[1.75rem] shadow-xl shadow-[#1f2a22]/10 lg:block">
            <Image src={guide.photo.src} alt={guide.photo.alt} fill sizes="(min-width: 1024px) 36rem, 100vw" className="object-cover" />
          </div>
        </Reveal>

        <Reveal delayMs={120} className="lg:sticky lg:top-8">
          <div id="elc-guide" className="scroll-mt-6 rounded-[2rem] bg-white p-6 shadow-xl shadow-[#1f2a22]/8 ring-1 ring-[#1f2a22]/5 sm:p-8">
            <HnjElcGuideForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Lede() {
  const { lede } = hnjElc;
  return (
    <section className="bg-[#f2ecdc]/50">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
        <Reveal>
          <h2 className="font-classic text-4xl font-medium tracking-tight text-balance sm:text-5xl">{lede.title}</h2>
          {lede.body.map((p, i) => (
            <p
              key={p}
              className={`mt-6 leading-relaxed text-pretty text-[#5b6359] ${
                i === 0
                  ? "text-xl first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-classic first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-[#14603a] sm:text-2xl"
                  : "text-lg"
              }`}
            >
              {p}
            </p>
          ))}
        </Reveal>
        <Reveal delayMs={120} className="self-end">
          <ul className="border-t-2 border-[#14603a]">
            {lede.facts.map((f) => (
              <li key={f} className="border-b border-[#1f2a22]/10 py-4 font-classic text-xl text-[#1f2a22]">
                {f}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function QuoteBand() {
  const { text, cite, photo } = hnjElc.quote;
  return (
    <section className="bg-[#14603a] py-20 text-[#fbf8f1] sm:py-28">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <figure className="grid items-center gap-10 text-center md:grid-cols-[16rem_1fr] md:gap-14 md:text-left lg:grid-cols-[19rem_1fr]">
          <div className="relative mx-auto aspect-[4/5] w-56 overflow-hidden rounded-[2rem] shadow-2xl shadow-black/25 ring-1 ring-[#fbf8f1]/15 sm:w-64 md:w-full">
            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 19rem, 16rem" className="object-cover object-[50%_35%]" />
          </div>
          <div>
            <blockquote className="font-classic text-3xl leading-snug font-medium text-balance italic sm:text-4xl lg:text-5xl">“{text}”</blockquote>
            <figcaption className="mt-6 text-sm font-bold tracking-[0.2em] text-[#fbf8f1]/75 uppercase">{cite}</figcaption>
          </div>
        </figure>
      </Reveal>
    </section>
  );
}

// A day at the ELC: text beside edge-to-edge photos, alternating sides.
function Day() {
  return (
    <section aria-labelledby="day-title">
      <div className="mx-auto max-w-6xl px-4 pt-20 pb-12 sm:px-6 sm:pt-28">
        <Reveal>
          <Eyebrow>A day at the ELC</Eyebrow>
          <h2 id="day-title" className="mt-4 max-w-2xl font-classic text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            What your child’s day looks like
          </h2>
        </Reveal>
      </div>
      {hnjElc.day.map((b, i) => (
        <div key={b.title} className="grid items-stretch lg:grid-cols-2">
          <Reveal className={`relative min-h-[22rem] sm:min-h-[28rem] ${i % 2 ? "lg:order-last" : ""}`}>
            <Image
              src={b.photo.src}
              alt={b.photo.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              style={"position" in b.photo ? { objectPosition: b.photo.position } : undefined}
            />
          </Reveal>
          <Reveal delayMs={100} className="flex flex-col justify-center px-4 py-14 sm:px-12 lg:px-16 lg:py-24">
            <p className="font-classic text-6xl leading-none font-medium text-[#14603a]/20">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-4 font-classic text-4xl font-medium tracking-tight text-balance">{b.title}</h3>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-[#5b6359]">{b.body}</p>
          </Reveal>
        </div>
      ))}
    </section>
  );
}

const trustIcons = [Camera, DoorOpen, ShieldCheck, Users];

function Trust() {
  const { trust } = hnjElc;
  return (
    <section className="bg-[#f2ecdc]/50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <Eyebrow>For parents</Eyebrow>
          <h2 className="mt-4 font-classic text-4xl font-medium tracking-tight text-balance sm:text-5xl">{trust.title}</h2>
        </Reveal>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trust.items.map((t, i) => {
            const Icon = trustIcons[i % trustIcons.length];
            return (
              <li key={t.title}>
                <Reveal delayMs={i * 80} className="h-full">
                  <div className="h-full rounded-[1.5rem] bg-white p-6 shadow-lg shadow-[#1f2a22]/5 ring-1 ring-[#1f2a22]/5">
                    <span className="grid size-12 place-items-center rounded-2xl bg-[#14603a]/10 text-[#14603a]">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-classic text-2xl font-medium tracking-tight">{t.title}</h3>
                    <p className="mt-3 leading-relaxed text-pretty text-[#5b6359]">{t.body}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// PK1 -> PK2 -> HNJ School, in the St. Mary timeline style, beside a parish photo.
function Path() {
  const { path } = hnjElc;
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
      <div>
        <Reveal>
          <Eyebrow>Growing up at HNJ</Eyebrow>
          <h2 className="mt-4 font-classic text-4xl font-medium tracking-tight text-balance sm:text-5xl">{path.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-[#5b6359]">{path.intro}</p>
        </Reveal>
        <ol className="mt-12">
          {path.steps.map((s, i) => (
            <li key={s.title} className="border-t border-[#1f2a22]/15 py-8 first:border-t-0 first:pt-0 last:pb-0">
              <Reveal className="grid gap-3 sm:grid-cols-[9rem_1fr] sm:gap-8">
                <p
                  className={`font-classic text-5xl leading-none font-medium tracking-tight whitespace-nowrap ${
                    i === path.steps.length - 1 ? "text-[#14603a]" : "text-[#1f2a22]/25"
                  }`}
                >
                  {s.age}
                </p>
                <div>
                  <h3 className="font-classic text-3xl font-medium tracking-tight text-balance">{s.title}</h3>
                  <p className="mt-3 text-lg leading-relaxed text-pretty text-[#5b6359]">{s.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
      <Reveal delayMs={120} className="relative min-h-[24rem] overflow-hidden rounded-[2rem] lg:min-h-0">
        <Image src={path.photo.src} alt={path.photo.alt} fill sizes="(min-width: 1024px) 26rem, 100vw" className="object-cover" />
      </Reveal>
    </section>
  );
}

// A small bento: one tall photo beside a 2x2 grid.
function Gallery() {
  const { gallery } = hnjElc;
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28">
      <Reveal>
        <h2 className="mb-8 font-classic text-3xl font-medium tracking-tight">{gallery.title}</h2>
      </Reveal>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
        {gallery.photos.map((g, i) => (
          <li key={g.src} className={i === 0 ? "row-span-2" : ""}>
            <Reveal delayMs={(i % 3) * 80} className="h-full">
              <div className={`relative overflow-hidden rounded-xl ${i === 0 ? "h-full min-h-[16rem]" : "aspect-[4/3]"}`}>
                <Image src={g.src} alt={g.alt} fill sizes="(min-width: 640px) 33vw, 50vw" className="object-cover" />
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Programs on the dark band, beside a "come see us" card.
function Programs() {
  const { programs } = hnjElc;
  return (
    <section className="bg-[#0f3a25] text-[#fbf8f1]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <Reveal>
          <Eyebrow light>Programs</Eyebrow>
          <h2 className="mt-4 font-classic text-5xl font-medium tracking-tight text-balance sm:text-6xl">{programs.title}</h2>
          <dl className="mt-10 border-t border-[#fbf8f1]/15">
            {programs.rows.map((r) => (
              <div key={r.label} className="grid gap-1 border-b border-[#fbf8f1]/15 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
                <dt className="text-xs font-bold tracking-[0.2em] text-[#e3a72f] uppercase sm:pt-1">{r.label}</dt>
                <dd className="text-lg leading-relaxed text-pretty text-[#fbf8f1]/90">{r.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delayMs={100}>
          <div className="rounded-[2rem] bg-[#fbf8f1]/[0.06] p-7 ring-1 ring-[#fbf8f1]/15 sm:p-9">
            <h3 className="font-classic text-3xl font-medium tracking-tight text-balance">Come see the center</h3>
            <p className="mt-4 text-lg leading-relaxed text-pretty text-[#fbf8f1]/80">
              Tours are the best way to get a feel for the classrooms. Call or email the ELC office to set one up.
            </p>
            <ul className="mt-7 space-y-4 text-[#fbf8f1]/90">
              <li>
                <a href={tel} className="inline-flex items-center gap-3 font-bold text-[#e3a72f] underline-offset-4 hover:underline">
                  <Phone className="size-5" aria-hidden="true" />
                  {hnjElc.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${hnjElc.email}`} className="inline-flex items-center gap-3 font-bold text-[#e3a72f] underline-offset-4 hover:underline">
                  <Mail className="size-5" aria-hidden="true" />
                  {hnjElc.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hnjElc.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 font-bold text-[#e3a72f] underline-offset-4 hover:underline"
                >
                  <MapPin className="size-5" aria-hidden="true" />
                  Get directions
                </a>
              </li>
            </ul>
            <Button variant="light" className="mt-8 w-full">
              {cta.label}
            </Button>
          </div>
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
          <h2 className="mt-4 font-classic text-5xl font-medium tracking-tight text-balance sm:text-6xl">Good to know</h2>
          <p className="mt-5 text-lg leading-relaxed text-[#5b6359]">
            Anything else? Call the ELC office at{" "}
            <a href={tel} className="font-bold whitespace-nowrap text-[#14603a] hover:underline">
              {hnjElc.phone}
            </a>
            .
          </p>
        </Reveal>
        <div className="border-t border-[#1f2a22]/15">
          {hnjElc.faq.map((item, i) => (
            <Reveal key={item.q} delayMs={i * 60}>
              <details className="group border-b border-[#1f2a22]/15" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 text-left font-classic text-xl font-medium transition-colors hover:text-[#14603a] sm:text-2xl [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f2ecdc] text-[#14603a] transition-all duration-300 group-open:rotate-180 group-open:bg-[#14603a] group-open:text-[#fbf8f1]">
                    <ChevronDown className="size-5" aria-hidden="true" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-7 text-lg leading-relaxed text-pretty text-[#5b6359]">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Closing() {
  const { closing } = hnjElc;
  return (
    <section className="relative flex min-h-[32rem] items-center overflow-hidden bg-[#0f3a25]">
      <Image src={closing.photo.src} alt={closing.photo.alt} fill sizes="100vw" className="object-cover object-[center_70%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f3a25] via-[#0f3a25]/85 to-[#0f3a25]/10" aria-hidden="true" />
      <Reveal className="relative mx-auto w-full max-w-6xl px-4 py-20 text-[#fbf8f1] sm:px-6">
        <div className="max-w-xl">
          <h2 className="font-classic text-5xl font-medium tracking-tight text-balance sm:text-6xl">{closing.headline}</h2>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-[#fbf8f1]/85">{closing.text}</p>
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
    <footer className="bg-[#0f3a25] text-[#fbf8f1]">
      <div className="mx-auto max-w-6xl border-t border-[#fbf8f1]/10 px-4 pt-14 pb-24 sm:px-6 sm:pb-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Logo tone="light" />
            <p className="mt-5 flex items-center gap-2 text-sm text-[#fbf8f1]/65">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {hnjElc.address}
            </p>
            <a href={tel} className="mt-2 flex items-center gap-2 text-sm text-[#fbf8f1]/65 transition-colors hover:text-[#fbf8f1]">
              <Phone className="size-4" aria-hidden="true" />
              {hnjElc.phone}
            </a>
          </div>
          <p className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href={hnjElc.schoolSite} target="_blank" rel="noreferrer" className="text-[#fbf8f1]/75 hover:text-[#fbf8f1]">
              School website
            </a>
            <a href={hnjElc.facebook} target="_blank" rel="noreferrer" className="text-[#fbf8f1]/75 hover:text-[#fbf8f1]">
              Facebook
            </a>
          </p>
        </div>
        <p className="mt-12 border-t border-[#fbf8f1]/10 pt-8 text-center text-sm text-[#fbf8f1]/50 sm:text-left">
          © {year} Holy Name of Jesus Catholic School · Diocese&nbsp;of&nbsp;Orlando
        </p>
      </div>
    </footer>
  );
}

export default function HnjElcLanding() {
  return (
    <div className="bg-[#fbf8f1] font-sans text-[#1f2a22] antialiased">
      <main>
        <Hero />
        <GuideAndForm />
        <Lede />
        <QuoteBand />
        <Day />
        <Trust />
        <Path />
        <Gallery />
        <Programs />
        <Faq />
        <Closing />
      </main>
      <Footer />
      <HnjElcStickyCta />
    </div>
  );
}
