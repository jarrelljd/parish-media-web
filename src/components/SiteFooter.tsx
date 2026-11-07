import Link from "next/link";
import BrandMark from "@/components/BrandMark";

const columns = [
  {
    title: "Services",
    links: [
      { href: "/parish", label: "Social Media" },
      { href: "/results", label: "Results" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/free-guide", label: "The Book" },
      { href: "/house-of-studies", label: "House of Studies" },
      { href: "/scorecard", label: "Social Media Scorecard" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

// Shared footer for the marketing pages (not the event pages).
export default function SiteFooter() {
  return (
    <footer className="bg-ink px-6 pb-10 pt-16 text-vellum/60 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link href="/" className="flex items-center gap-3 text-vellum">
            <BrandMark className="h-9 w-7 text-gilt" />
            <span className="font-serif text-xl font-semibold">Parish Media Company</span>
          </Link>
          <p className="mt-4 max-w-xs font-serif text-lg italic leading-snug text-vellum/55">
            New methods for an ancient&nbsp;mission.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-serif text-base italic text-[#d9867c]">{col.title}</p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-vellum">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-14 max-w-7xl border-t border-vellum/10 pt-6 text-sm text-vellum/40">
        &copy; {new Date().getFullYear()} Parish Media Company
      </p>
    </footer>
  );
}
