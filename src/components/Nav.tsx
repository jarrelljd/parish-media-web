"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBookACallModal } from "@/components/BookACallModalProvider";
import BrandMark from "@/components/BrandMark";

// An item with no `href` shows greyed out with a "coming soon" note.
type MenuItem = { href?: string; label: string; note?: string };
type Menu = { id: string; label: string; items: MenuItem[] };

// Dropdown tabs, shown in this order before the plain links.
const menus: Menu[] = [
  {
    id: "services",
    label: "Services",
    items: [
      { href: "/parish", label: "Parish Growth", note: "Weekly content, invitations, follow-up" },
      { href: "/vocations", label: "Vocations Outreach", note: "For vocation offices and religious orders" },
      { label: "Parish Websites" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    items: [
      { href: "/free-guide", label: "The Book", note: "Social Media for Catholic Churches" },
      { href: "/house-of-studies", label: "House of Studies", note: "Free training for parish staff" },
      { href: "/scorecard", label: "Social Media Scorecard", note: "Score your parish in 14 questions" },
    ],
  },
];

const links = [
  { href: "/results", label: "Results" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Extra paths that should highlight a dropdown tab.
const menuExtraPaths: Record<string, string[]> = {
  services: ["/services", "/parish-pricing"],
  resources: ["/free-stuff"],
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"
      className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

// `overlay`: sits transparent on top of a dark hero photo until the page
// scrolls (used on the homepage). Otherwise it's a solid sticky bar.
export default function Nav({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const menusRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const openBookACall = useBookACallModal();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const menuActive = (menu: Menu) =>
    menu.items.some((item) => item.href && isActive(item.href)) ||
    (menuExtraPaths[menu.id] ?? []).some(isActive);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  useEffect(() => {
    if (!openMenu) return;
    function handleClick(e: MouseEvent) {
      if (!menusRef.current?.contains(e.target as Node)) setOpenMenu(null);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openMenu]);

  const solid = !overlay || scrolled || open;
  const fade = "transition-colors duration-500";
  const linkClass = (active: boolean) =>
    `text-[15px] font-medium ${fade} ${
      solid
        ? active ? "text-ink" : "text-ink/70 hover:text-ink"
        : active ? "text-vellum" : "text-vellum/80 hover:text-vellum"
    } ${active ? "underline decoration-rubric decoration-1 underline-offset-[10px]" : ""}`;

  return (
    <header
      className={`${overlay ? "fixed" : "sticky"} inset-x-0 top-0 z-50 border-b ${fade} ${
        solid ? "border-ink/10 bg-vellum/95 backdrop-blur" : "border-vellum/15 bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className={`flex items-center gap-3 ${fade} ${solid ? "text-ink" : "text-vellum"}`}>
          <BrandMark className={`h-9 w-7 ${fade} ${solid ? "text-lapis" : "text-vellum"}`} />
          <span className="leading-none">
            <span className="block font-serif text-[1.4rem] font-semibold">Parish Media Company</span>
            <span className={`mt-0.5 block font-serif text-[0.95rem] italic ${solid ? "text-ink/55" : "text-vellum/65"}`}>
              Media for the Catholic parish
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <div ref={menusRef} className="flex items-center gap-8">
            {menus.map((menu) => (
              <div
                key={menu.id}
                className="relative"
                onPointerEnter={(e) => e.pointerType === "mouse" && setOpenMenu(menu.id)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setOpenMenu(null)}
              >
                <button
                  type="button"
                  aria-expanded={openMenu === menu.id}
                  onClick={() => setOpenMenu((v) => (v === menu.id ? null : menu.id))}
                  className={`flex items-center gap-1.5 ${linkClass(menuActive(menu))}`}
                >
                  {menu.label}
                  <Chevron open={openMenu === menu.id} />
                </button>
                {openMenu === menu.id && (
                  <div className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-4">
                    <div className="border border-ink/10 bg-[#fbf8f2] p-2 shadow-xl shadow-ink/10">
                      {menu.items.map((item) =>
                        item.href ? (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setOpenMenu(null)}
                            className="block px-4 py-3 transition-colors hover:bg-vellum"
                          >
                            <span className={`block font-serif text-lg font-semibold ${isActive(item.href) ? "text-lapis" : "text-ink"}`}>
                              {item.label}
                            </span>
                            {item.note && <span className="mt-0.5 block text-sm text-ink/55">{item.note}</span>}
                          </Link>
                        ) : (
                          <span key={item.label} aria-disabled="true" className="flex items-center gap-2 px-4 py-3 text-ink/35">
                            <span className="font-serif text-lg font-semibold">{item.label}</span>
                            <span className="font-serif text-sm italic text-rubric/70">coming soon</span>
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(isActive(link.href))}>
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={openBookACall}
            className={`rounded-[3px] px-5 py-2.5 text-[15px] font-semibold ${fade} ${
              solid ? "bg-lapis text-vellum hover:bg-lapis-deep" : "bg-vellum text-ink hover:bg-white"
            }`}
          >
            Book a call
          </button>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className={`flex h-10 w-10 items-center justify-center lg:hidden ${solid ? "text-ink" : "text-vellum"}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6" aria-hidden="true">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5M3.75 12h16.5M3.75 16.5h16.5" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-ink/10 px-6 pb-6 pt-2 lg:hidden">
          {menus.map((menu) => (
            <div key={menu.id} className="border-b border-ink/10 py-3">
              <p className="font-serif text-base italic text-rubric">{menu.label}</p>
              {menu.items.map((item) =>
                item.href ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`mt-2 block font-serif text-xl font-semibold ${isActive(item.href) ? "text-lapis" : "text-ink"}`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span key={item.label} className="mt-2 flex items-center gap-2 font-serif text-xl font-semibold text-ink/35">
                    {item.label}
                    <span className="text-sm font-normal italic text-rubric/70">coming soon</span>
                  </span>
                ),
              )}
            </div>
          ))}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block border-b border-ink/10 py-3 font-serif text-xl font-semibold ${isActive(link.href) ? "text-lapis" : "text-ink"}`}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openBookACall();
            }}
            className="mt-5 w-full rounded-[3px] bg-lapis py-3.5 text-base font-semibold text-vellum"
          >
            Book a call
          </button>
        </nav>
      )}
    </header>
  );
}
