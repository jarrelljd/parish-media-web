import Image, { type StaticImageData } from "next/image";

// A plain phone frame around a real screenshot (an ad, a parish feed).
// `screen` is the app's background color, shown above the screenshot under
// the camera cutout.
export default function PhoneMockup({
  src,
  alt,
  screen = "#000",
  className = "",
}: {
  src: StaticImageData;
  alt: string;
  screen?: string;
  className?: string;
}) {
  return (
    <div className={`rounded-[2.4rem] bg-[#111] p-[7px] shadow-2xl shadow-black/40 ring-1 ring-white/10 ${className}`}>
      <div className="relative aspect-[9/18.5] overflow-hidden rounded-[2rem]" style={{ background: screen }}>
        <div className="absolute inset-x-0 bottom-0 top-8">
          <Image src={src} alt={alt} fill sizes="260px" className="object-cover object-top" />
        </div>
        <span aria-hidden="true" className="absolute left-1/2 top-2 h-[18px] w-[70px] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}
