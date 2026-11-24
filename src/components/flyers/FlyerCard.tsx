import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { FlyerTemplate } from "@/data/flyers";
import FlyerPlaceholder from "./FlyerPlaceholder";

export default function FlyerCard({ t }: { t: FlyerTemplate }) {
  return (
    <article className="group flex flex-col">
      <a
        href={t.canvaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-xl bg-parchment shadow-md shadow-ink/10 ring-1 ring-ink/5 transition-all duration-300 [container-type:inline-size] group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-ink/20 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
        aria-label={`Open the ${t.designName} ${t.event} flyer in Canva (opens in a new tab)`}
      >
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
      </a>

      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="text-lg font-semibold leading-snug text-ink">{t.event}</h3>
        <p className="mt-0.5 text-[15px] text-ink/60">{t.designName} design</p>
        <a
          href={t.canvaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-lapis px-6 py-3 text-[15px] font-semibold text-vellum shadow-md shadow-lapis/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-lapis-deep hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          Customize in Canva
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
