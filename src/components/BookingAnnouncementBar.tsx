import BrandMark from "./BrandMark";
import ScrollToBookingButton from "./ScrollToBookingButton";

// Slim header for landing pages that leave out the main nav: the logo on the
// left (not a link, so visitors stay on the page) and a button on the right
// that scrolls down to the booking calendar. Dark to match the page's hero.
export default function BookingAnnouncementBar({
  label = "Book a free assessment",
}: {
  label?: string;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-vellum/10 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-6">
        <span className="flex min-w-0 items-center gap-2.5 text-vellum">
          <BrandMark className="h-8 w-6 shrink-0 text-vellum" />
          <span className="truncate font-serif text-lg font-semibold leading-none sm:text-[1.35rem]">
            Parish Media Company
          </span>
        </span>
        <ScrollToBookingButton className="group inline-flex shrink-0 items-center gap-2 rounded-[3px] bg-vellum px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white sm:px-5 sm:text-[15px]">
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden">Book a call</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transition-none"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0-6-6m6 6 6-6" />
          </svg>
        </ScrollToBookingButton>
      </div>
    </header>
  );
}
