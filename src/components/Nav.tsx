"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBookACallModal } from "@/components/BookACallModalProvider";

// An item with no `href` shows greyed out with a "Coming Soon" tag.
type MenuItem = { href?: string; label: string };
type Menu = { id: string; label: string; items: MenuItem[] };

// Dropdown tabs, shown in this order before the plain links.
const menus: Menu[] = [
  {
    id: "services",
    label: "Services",
    items: [
      { href: "/parish", label: "Parish Growth" },
      { href: "/vocations", label: "Vocations Outreach" },
      { label: "Parish Websites" },
    ],
  },
  {
    id: "free",
    label: "Free Stuff",
    items: [
      { href: "/free-guide", label: "Free Book" },
      { href: "/house-of-studies", label: "House of Studies" },
      { label: "Social Media Scorecard" },
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
  services: ["/services"],
  free: ["/free-stuff"],
};

function ComingSoonBadge() {
  return (
    <span className="shrink-0 whitespace-nowrap rounded-full bg-gold/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none tracking-wider text-gold">
      Coming Soon
    </span>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpenMenu, setMobileOpenMenu] = useState<string | null>(null);
  const menusRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const openBookACall = useBookACallModal();
  // Also highlight a tab on its sub-pages (e.g. /house-of-studies/ai-flyers).
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const menuActive = (menu: Menu) =>
    menu.items.some((item) => item.href && isActive(item.href)) ||
    (menuExtraPaths[menu.id] ?? []).some(isActive);

  useEffect(() => {
    if (!openMenu) return;
    function handleClick(e: MouseEvent) {
      if (!menusRef.current?.contains(e.target as Node)) {
        setOpenMenu(null);
      }
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

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-offwhite/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight text-navy">
          Parish Media Company
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
                  onClick={() => setOpenMenu((v) => (v === menu.id ? null : menu.id))}
                  aria-expanded={openMenu === menu.id}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-navy ${
                    menuActive(menu) ? "font-semibold text-navy" : "text-navy/80"
                  }`}
                >
                  {menu.label}
                  <Chevron open={openMenu === menu.id} />
                </button>

                {openMenu === menu.id && (
                  <div className="absolute left-0 top-full mt-2 w-72 rounded-xl before:absolute before:inset-x-0 before:-top-2 before:h-2 before:content-[''] border border-navy/10 bg-white p-2 shadow-lg">
                    {menu.items.map((item) =>
                      item.href ? (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setOpenMenu(null)}
                          className={`block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-navy/5 hover:text-navy ${
                            isActive(item.href) ? "font-semibold text-navy" : "text-navy/80"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span
                          key={item.label}
                          aria-disabled="true"
                          className="flex cursor-default items-center gap-2 whitespace-nowrap px-3 py-2 text-sm text-navy/40"
                        >
                          {item.label}
                          <ComingSoonBadge />
                        </span>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-navy ${
                isActive(link.href) ? "font-semibold text-navy" : "text-navy/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={openBookACall}
            className="rounded-full bg-navy px-5 py-2 text-sm font-medium text-offwhite transition-colors hover:bg-navy/90"
          >
            Book a Call
          </button>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center text-navy lg:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            className="h-6 w-6"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-navy/10 px-6 pb-4 lg:hidden">
          {menus.map((menu) => (
            <div key={menu.id}>
              <button
                type="button"
                onClick={() => setMobileOpenMenu((v) => (v === menu.id ? null : menu.id))}
                aria-expanded={mobileOpenMenu === menu.id}
                className={`flex w-full items-center justify-between py-2 text-left text-sm font-medium ${
                  menuActive(menu) ? "font-semibold text-navy" : "text-navy/80"
                }`}
              >
                {menu.label}
                <Chevron open={mobileOpenMenu === menu.id} />
              </button>
              {mobileOpenMenu === menu.id && (
                <div className="flex flex-col gap-1 pb-1 pl-4">
                  {menu.items.map((item) =>
                    item.href ? (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => {
                          setOpen(false);
                          setMobileOpenMenu(null);
                        }}
                        className={`py-1.5 text-sm ${
                          isActive(item.href) ? "font-semibold text-navy" : "text-navy/70"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span
                        key={item.label}
                        aria-disabled="true"
                        className="flex items-center gap-2 whitespace-nowrap py-1.5 text-sm text-navy/40"
                      >
                        {item.label}
                        <ComingSoonBadge />
                      </span>
                    ),
                  )}
                </div>
              )}
            </div>
          ))}

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`py-2 text-sm font-medium ${
                isActive(link.href) ? "font-semibold text-navy" : "text-navy/80"
              }`}
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
            className="mt-2 rounded-full bg-navy px-5 py-2 text-center text-sm font-medium text-offwhite"
          >
            Book a Call
          </button>
        </nav>
      )}
    </header>
  );
}
