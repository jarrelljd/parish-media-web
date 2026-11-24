import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { FlyerTemplate } from "@/data/flyers";
import FlyerPlaceholder from "./FlyerPlaceholder";

// The whole card is one link to the Canva template. The "Customize in Canva"
// label shows on hover/focus; the results header tells phone users to tap a
// design, so the cards don't each need their own button.
export default function FlyerCard({ t }: { t: FlyerTemplate }) {
  // The event is already the group heading; only show the design name if it adds something.
  const caption = t.designName && t.designName.trim().toLowerCase() !== t.event.trim().toLowerCase() ? t.designName : null;

  return (
    <a
      href={t.canvaUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Customize the ${caption ? `${caption} ` : ""}${t.event} flyer in Canva (opens in a new tab)`}
      className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-4 focus-visible:ring-offset-vellum"
    >
      <div className="relative overflow-hidden rounded-xl bg-parchment shadow-md shadow-ink/10 ring-1 ring-ink/5 transition-all duration-300 [container-type:inline-size] group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-ink/20 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        {t.thumbnail ? (
          <Image
            src={t.thumbnail}
            alt=""
            width={800}
            height={1000}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            // Library thumbnails are already resized WebP files.
            unoptimized={t.thumbnail.startsWith("/flyers/thumbs/")}
            className="aspect-[4/5] w-full object-cover"
          />
        ) : (
          <FlyerPlaceholder event={t.event} category={t.category} look={t.placeholderStyle} />
        )}

        <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-ink/60 via-ink/0 to-transparent p-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
          <span className="inline-flex items-center gap-2 rounded-full bg-vellum px-5 py-2.5 text-[15px] font-semibold text-lapis shadow-lg">
            Customize in Canva
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>

      {caption && <p className="mt-3 text-[16px] font-semibold text-ink/80 group-hover:text-ink">{caption}</p>}
    </a>
  );
}
