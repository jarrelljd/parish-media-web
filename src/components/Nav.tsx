"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBookACallModal } from "@/components/BookACallModalProvider";

const links = [
  { href: "/services", label: "Services" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/free-stuff", label: "Free Stuff" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const openBookACall = useBookACallModal();

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-offwhite/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight text-navy">
          Parish Media Company
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-navy ${
                pathname === link.href ? "font-semibold text-navy" : "text-navy/80"
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
          className="flex h-9 w-9 items-center justify-center text-navy md:hidden"
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
        <nav className="flex flex-col gap-1 border-t border-navy/10 px-6 pb-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`py-2 text-sm font-medium ${
                pathname === link.href ? "font-semibold text-navy" : "text-navy/80"
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
