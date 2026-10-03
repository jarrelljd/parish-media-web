"use client";

// Slides down to the on-page booking section (id="book") instead of opening
// the Book a Call modal — used on landing pages that embed Calendly directly.
export default function ScrollToBookingButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById("book");
    if (!target) return;
    e.preventDefault();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    history.replaceState(null, "", "#book");
  }

  return (
    <a href="#book" onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
