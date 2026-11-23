import Image from "next/image";
import { Clapperboard, Lock, Play } from "lucide-react";
import BrandMark from "./BrandMark";
import pastorFilming from "../../public/images/events/st-patrick/fr-dave.jpg";
import parishFamilies from "../../public/images/events/st-rose/group-photo.jpg";

// Illustrations for the /monthly-giving steps. They're pictures of what we
// build, not working forms, so they're hidden from screen readers and every
// control is inert.

const AMOUNTS = ["$25", "$50", "$100", "$250"];

// The monthly-giving form, modeled on Live Action's donate widget: give
// once / monthly toggle, a few amount chips, name and email, one button.
export function GivingFormMockup({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none w-64 select-none rounded-2xl bg-white p-5 text-left shadow-2xl shadow-ink/25 ring-1 ring-ink/5 ${className}`}
    >
      <p className="text-center font-serif text-lg font-semibold leading-tight text-ink">Support our parish</p>
      <div className="mt-3 grid grid-cols-2 rounded-full bg-vellum p-1 text-xs font-semibold">
        <span className="rounded-full py-1.5 text-center text-ink/50">Give once</span>
        <span className="rounded-full bg-lapis py-1.5 text-center text-vellum shadow">Give monthly</span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5 text-sm font-semibold">
        {AMOUNTS.map((a) => (
          <span
            key={a}
            className={`rounded-lg py-2 text-center ${
              a === "$50" ? "bg-lapis text-vellum" : "text-ink ring-1 ring-ink/15"
            }`}
          >
            {a}
          </span>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] leading-snug text-ink/60">
        A monthly gift keeps your parish strong all year&nbsp;long.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] text-ink/40">
        <span className="rounded-md px-2 py-2 ring-1 ring-ink/15">First name</span>
        <span className="rounded-md px-2 py-2 ring-1 ring-ink/15">Last name</span>
        <span className="col-span-2 rounded-md px-2 py-2 ring-1 ring-ink/15">Email</span>
      </div>
      <span className="mt-3 block rounded-full bg-gilt-light py-2.5 text-center text-sm font-semibold text-ink">
        Give $50 monthly
      </span>
      <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-ink/45">
        <Lock className="h-3 w-3" /> Secure giving
      </p>
    </div>
  );
}

// T (Tell the story): behind-the-scenes b-roll, with the giving form in
// front of it. Pass `videoSrc` (a short muted clip in /public) once the
// footage is ready; until then a placeholder frame shows.
export function FilmAndBuildVisual({ videoSrc }: { videoSrc?: string }) {
  return (
    <div className="relative mx-auto h-[26rem] w-full max-w-md">
      <div className="absolute right-0 top-0 aspect-video w-[85%] overflow-hidden rounded-xl bg-ink shadow-xl shadow-ink/25 ring-1 ring-ink/10">
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          // TODO: swap for Joe's b-roll of filming with the Diocese of Reno.
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed pl-[30%] border-gilt-light/50 bg-lapis-deep text-center text-vellum/70">
            <Clapperboard className="h-8 w-8 text-gilt-light" aria-hidden="true" />
            <span className="px-4 text-sm font-semibold">B-roll placeholder</span>
            <span className="px-6 text-xs text-vellum/50">Filming with the Diocese of&nbsp;Reno</span>
          </div>
        )}
      </div>
      <GivingFormMockup className="absolute bottom-0 left-0 origin-bottom-left scale-[0.8]" />
    </div>
  );
}

// H (Hit the goal): the goal thermometer parishioners see on the giving
// page. Sample figures only.
export function GoalThermometerVisual() {
  const pct = 74;
  const ticks = ["$10K", "$7.5K", "$5K", "$2.5K", "$0"];
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none mx-auto flex w-72 select-none items-stretch gap-5 rounded-3xl bg-white px-6 py-7 text-left shadow-2xl shadow-ink/20 ring-1 ring-ink/5"
    >
      {/* A tube filling with gold, a bulb at the bottom */}
      <div className="flex flex-col items-center">
        <div className="relative h-48 w-6 overflow-hidden rounded-t-full bg-vellum ring-1 ring-ink/10">
          <div className="absolute inset-x-0 bottom-0 bg-gilt-light" style={{ height: `${pct}%` }} />
        </div>
        <div className="-mt-1 h-11 w-11 rounded-full bg-gilt-light ring-4 ring-white" />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex h-48 flex-col justify-between text-xs text-ink/45">
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="mt-3">
          <span className="block font-serif text-3xl font-semibold leading-none text-ink">$7,400</span>
          <span className="mt-1 block text-xs leading-snug text-ink/60">a month toward our $10,000&nbsp;goal</span>
        </div>
      </div>
    </div>
  );
}

// E (Express thanks): the pastor's video thank-you each new donor receives.
export function ThankYouVideoVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none mx-auto w-64 select-none overflow-hidden rounded-[1.6rem] border-[6px] border-ink bg-white text-left shadow-2xl shadow-ink/30 sm:w-72"
    >
      <div className="px-4 pb-3 pt-4">
        <span className="block text-[11px] font-semibold text-gilt">A message from your pastor</span>
        <span className="mt-1 block font-serif text-lg font-semibold leading-tight text-ink">
          Thank you for joining our monthly giving&nbsp;family
        </span>
      </div>
      <div className="relative aspect-[4/3] w-full bg-ink">
        <Image src={pastorFilming} alt="" fill sizes="288px" className="object-cover object-[60%_30%]" />
        <span className="absolute inset-0 bg-ink/20" />
        <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg">
          <Play className="ml-0.5 h-5 w-5 fill-ink text-ink" />
        </span>
      </div>
      <p className="px-4 py-3 text-xs leading-snug text-ink/70">
        Your gift keeps our parish strong, month after month. God bless&nbsp;you.
      </p>
    </div>
  );
}

// Step 2: a Meta ad asking local families to give monthly.
export function GivingAdVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none mx-auto w-64 select-none overflow-hidden rounded-[1.6rem] border-[6px] border-ink bg-white text-left shadow-2xl shadow-ink/30 sm:w-72"
    >
      <div className="flex items-center gap-2 px-3 pt-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lapis">
          <BrandMark className="h-5 w-4 text-vellum" />
        </span>
        <span className="leading-tight">
          <span className="block text-xs font-semibold text-ink">Your Parish</span>
          <span className="block text-[10px] text-ink/50">Sponsored</span>
        </span>
      </div>
      <p className="px-3 py-2.5 text-xs leading-snug text-ink/85">
        Our parish has been here for generations. Will you help keep it strong
        for the next one? Join our monthly giving&nbsp;family.
      </p>
      <div className="relative aspect-[4/3] w-full bg-ink">
        <Image src={parishFamilies} alt="" fill sizes="288px" className="object-cover" />
      </div>
      <div className="flex items-center justify-between gap-2 bg-vellum px-3 py-2.5">
        <span className="text-[11px] font-semibold leading-tight text-ink">Become a monthly supporter</span>
        <span className="shrink-0 rounded-md bg-ink/10 px-2.5 py-1.5 text-[11px] font-semibold text-ink">Donate now</span>
      </div>
    </div>
  );
}
