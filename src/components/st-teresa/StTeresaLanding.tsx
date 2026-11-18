import Image from "next/image";
import { Check, Heart, Mail, MapPin, Phone } from "lucide-react";
import Reveal from "@/components/Reveal";
import StTeresaStickyCta from "@/components/st-teresa/StTeresaStickyCta";
import StTeresaThermometer from "@/components/st-teresa/StTeresaThermometer";
import { stTeresa } from "@/data/stTeresaLanding";

// St. Teresa of Avila fundraising page. One job: move a visitor to the donation form at #give.
//
// Colors are page-local (like the other per-parish event pages), not site tokens:
// uniform green #17352c, deep green #10261f, gold #c9a227, cream #fbf8f1, sand #f1eadc,
// ink #1f2a26, soft ink #56635d.

const { cta } = stTeresa;

function GiveButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={cta.href}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a227] px-8 py-4 text-lg font-bold text-[#10261f] shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d8b138] hover:shadow-xl active:translate-y-0 ${className}`}
    >
      <Heart className="size-4 fill-current" aria-hidden="true" />
      {cta.label}
    </a>
  );
}

const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <p className={`text-xs font-bold tracking-[0.25em] uppercase ${light ? "text-[#e0bd4f]" : "text-[#856a12]"}`}>{children}</p>
);

function Hero() {
  const { hero } = stTeresa;
  return (
    <section className="grid bg-[#17352c] text-[#fbf8f1] lg:min-h-[42rem] lg:grid-cols-[1.05fr_1fr]">
      <div className="relative aspect-[4/3] lg:order-last lg:aspect-auto">
        <Image src={hero.photo.src} alt={hero.photo.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[50%_60%]" />
        <p className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-4 pt-8 pb-3 text-xs font-semibold text-white sm:text-sm">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          {hero.caption}
        </p>
      </div>
      <div className="flex flex-col justify-center px-4 py-10 sm:px-10 sm:py-14 lg:py-16 lg:pr-12 lg:pl-[max(2.5rem,calc((100vw-72rem)/2+1.5rem))]">
        <Eyebrow light>{hero.eyebrow}</Eyebrow>
        <h1 className="mt-4 font-classic text-4xl leading-[1.08] font-medium tracking-tight text-balance sm:text-5xl xl:text-6xl">{hero.headline}</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-[#fbf8f1]/85 sm:text-xl">{hero.intro}</p>
        <GiveButton className="mt-8 w-full sm:w-auto sm:self-start" />
      </div>
    </section>
  );
}

function Progress() {
  const { progress } = stTeresa;
  return (
    <section className="bg-[#f1eadc] py-14 sm:py-20">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Reveal>
          <Eyebrow>{progress.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-classic text-4xl font-medium tracking-tight text-balance sm:text-5xl">{progress.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-[#56635d]">{progress.body}</p>
          <GiveButton className="mt-7 w-full sm:w-auto" />
          <p className="mt-6 hidden text-sm text-pretty text-[#56635d] lg:block">{progress.asOf}</p>
        </Reveal>
        <div>
          <StTeresaThermometer />
          <p className="mt-6 text-sm text-pretty text-[#56635d] lg:hidden">{progress.asOf}</p>
        </div>
      </div>
    </section>
  );
}

function PrincipalVideo() {
  const { vsl } = stTeresa;
  return (
    <section className="bg-[#fbf8f1] py-16 sm:py-24">
      <Reveal className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <Eyebrow>{vsl.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-classic text-4xl font-medium tracking-tight text-balance sm:text-5xl">{vsl.title}</h2>
        </div>
        <div className="mt-8 rounded-2xl bg-white p-2 shadow-2xl shadow-[#17352c]/15 ring-1 ring-[#17352c]/10">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-[#17352c]">
            <iframe
              src={`https://player.vimeo.com/video/${vsl.vimeoId}?title=0&byline=0&portrait=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1`}
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 size-full border-0"
              title={vsl.title}
            />
          </div>
        </div>
        <p className="mt-4 text-center text-pretty text-[#56635d]">{vsl.caption}</p>
      </Reveal>
    </section>
  );
}

function Story() {
  const { story } = stTeresa;
  return (
    <section className="bg-[#f1eadc] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-3xl">
          <Eyebrow>{story.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-classic text-4xl font-medium tracking-tight text-balance sm:text-5xl">{story.title}</h2>
          <p className="mt-5 text-xl leading-relaxed text-pretty text-[#56635d]">{story.lead}</p>
        </Reveal>
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:order-last lg:aspect-[4/5]">
            <Image src={story.photo.src} alt={story.photo.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[55%_60%]" />
          </Reveal>
          <Reveal delayMs={100}>
            <ol className="space-y-9">
              {story.struggles.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[2.75rem_1fr] sm:grid-cols-[4rem_1fr]">
                  <span className="font-classic text-5xl leading-none font-medium text-[#b08d1e] italic sm:text-6xl" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-classic text-2xl font-medium tracking-tight text-balance sm:text-3xl">{s.title}</h3>
                    <p className="mt-2 text-lg leading-relaxed text-pretty text-[#56635d]">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-10 font-classic text-2xl leading-snug font-medium text-pretty text-[#17352c]">{story.close}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Region() {
  const { region } = stTeresa;
  return (
    <section className="bg-[#fbf8f1] py-12 sm:py-16">
      <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <MapPin className="mx-auto size-6 text-[#856a12]" aria-hidden="true" />
        <h2 className="mt-3 font-classic text-3xl font-medium tracking-tight text-balance sm:text-4xl">{region.title}</h2>
        <p className="mt-3 text-lg leading-relaxed text-balance text-[#56635d]">{region.body}</p>
      </Reveal>
    </section>
  );
}

function Vision() {
  const { vision } = stTeresa;
  return (
    <section className="bg-[#17352c] py-16 text-[#fbf8f1] sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <Eyebrow light>{vision.eyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-classic text-4xl font-medium tracking-tight text-balance sm:text-5xl">{vision.title}</h2>
        </Reveal>
        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-7">
          {vision.items.map((item, i) => (
            <Reveal key={item.title} delayMs={i * 90}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image src={item.photo.src} alt={item.photo.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <h3 className="mt-5 font-classic text-2xl font-medium tracking-tight text-balance">{item.title}</h3>
              <p className="mt-2 text-lg leading-relaxed text-pretty text-[#fbf8f1]/80">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Quote() {
  const { quote } = stTeresa;
  return (
    <section className="relative flex min-h-[26rem] items-center overflow-hidden bg-[#10261f] text-[#fbf8f1]">
      <Image src={quote.photo.src} alt={quote.photo.alt} fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-[#10261f]/70" aria-hidden="true" />
      <Reveal className="relative mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6">
        <figure>
          <blockquote className="font-classic text-4xl leading-tight font-medium text-balance italic sm:text-6xl">“{quote.text}”</blockquote>
          <figcaption className="mt-6 text-sm font-bold tracking-[0.2em] text-balance text-[#e0bd4f] uppercase">{quote.cite}</figcaption>
        </figure>
        <GiveButton className="mt-9 w-full sm:w-auto" />
      </Reveal>
    </section>
  );
}

function People() {
  const { people } = stTeresa;
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal>
        <Eyebrow>{people.eyebrow}</Eyebrow>
        <h2 className="mt-4 max-w-3xl font-classic text-4xl font-medium tracking-tight text-balance sm:text-5xl">{people.title}</h2>
      </Reveal>
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {people.photos.map((p, i) => (
          <li key={p.src}>
            <Reveal delayMs={i * 70} className="relative aspect-[4/5] overflow-hidden rounded-xl">
              <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </Reveal>
          </li>
        ))}
      </ul>
      <Reveal>
        <figure className="mt-12 max-w-3xl border-l-2 border-[#c9a227] pl-6">
          <blockquote className="font-classic text-2xl leading-snug font-medium text-pretty italic sm:text-3xl">“{people.voice.text}”</blockquote>
          <figcaption className="mt-4 text-sm font-bold tracking-[0.15em] text-[#56635d] uppercase">{people.voice.cite}</figcaption>
        </figure>
      </Reveal>
    </section>
  );
}

// PLACEHOLDER: replace the dashed box with the payment provider's embed code.
function DonationEmbed() {
  return (
    <div className="grid min-h-[26rem] place-items-center rounded-xl border-2 border-dashed border-[#17352c]/25 bg-[#f1eadc]/60 p-6 text-center">
      <div>
        <Heart className="mx-auto size-8 text-[#c9a227]" aria-hidden="true" />
        <p className="mt-3 font-classic text-2xl font-medium text-[#17352c]">Donation form</p>
        <p className="mt-2 text-sm text-[#56635d]">Placeholder for the embedded payment widget.</p>
      </div>
    </div>
  );
}

function Give() {
  const { give } = stTeresa;
  return (
    <section className="bg-[#10261f] py-16 text-[#fbf8f1] sm:py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal>
          <Eyebrow light>{give.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-classic text-4xl font-medium tracking-tight text-balance sm:text-6xl">{give.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-[#fbf8f1]/85">{give.body}</p>
          <ul className="mt-7 space-y-3">
            {give.trust.map((t) => (
              <li key={t} className="flex items-start gap-3 text-[#fbf8f1]/90">
                <Check className="mt-1 size-4 shrink-0 text-[#e0bd4f]" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-8 font-bold">{give.help}</p>
          <p className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
            <a href={`tel:${stTeresa.phone.replace(/\D/g, "")}`} className="inline-flex items-center gap-2 text-[#e0bd4f] underline-offset-4 hover:underline">
              <Phone className="size-4" aria-hidden="true" />
              {stTeresa.phone}
            </a>
            <a href={`mailto:${stTeresa.email}`} className="inline-flex items-center gap-2 text-[#e0bd4f] underline-offset-4 hover:underline">
              <Mail className="size-4" aria-hidden="true" />
              {stTeresa.email}
            </a>
          </p>
        </Reveal>
        <Reveal delayMs={100}>
          <div id="give" className="scroll-mt-6 rounded-2xl bg-white p-3 text-[#1f2a26] shadow-2xl shadow-black/30 sm:p-4">
            <DonationEmbed />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[#fbf8f1]/10 bg-[#10261f] pb-24 text-[#fbf8f1]/65 sm:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm sm:px-6">
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          St. Teresa of Avila Catholic Community, {stTeresa.churchAddress}
        </p>
        <p className="mt-3">© {year} St. Teresa of Avila Catholic School · Diocese of Reno</p>
      </div>
    </footer>
  );
}

export default function StTeresaLanding() {
  return (
    <div className="bg-[#fbf8f1] font-sans text-[#1f2a26] antialiased">
      {/* Every give button slides down to the form; people who prefer less motion jump there. */}
      <style>{`@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }`}</style>
      <main>
        <Hero />
        <Progress />
        <PrincipalVideo />
        <Story />
        <Region />
        <Vision />
        <Quote />
        <People />
        <Give />
      </main>
      <Footer />
      <StTeresaStickyCta />
    </div>
  );
}
