import ScrollToBookingButton from "./ScrollToBookingButton";

// Top bar for landing pages without the main nav: the whole bar is a
// scroll-to-booking CTA, with a ringing phone to draw the eye.

// Each landing page matches the bar to its hero band: navy on Parish Growth,
// gold on Vocations.
const THEMES = {
  navy: {
    bar: "bg-navy text-offwhite hover:bg-[#22355c]",
    shimmer: "via-gold/15",
    ping: "bg-gold/60",
    phone: "bg-gold text-navy",
    arrow: "text-gold",
  },
  gold: {
    bar: "bg-gold text-navy hover:bg-[#d4ae36]",
    shimmer: "via-white/25",
    ping: "bg-navy/40",
    phone: "bg-navy text-gold",
    arrow: "text-navy",
  },
};

export default function BookingAnnouncementBar({
  label = "Book 30-Min Parish Growth Assessment",
  theme = "navy",
}: {
  label?: string;
  theme?: keyof typeof THEMES;
}) {
  const t = THEMES[theme];
  return (
    <ScrollToBookingButton className={`group sticky top-0 z-50 block overflow-hidden transition-colors ${t.bar}`}>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-transparent motion-safe:animate-shimmer ${t.shimmer}`}
      />
      <span className="relative mx-auto flex max-w-6xl items-center justify-center gap-2 px-3 py-3 sm:gap-3 sm:px-4">
        <span className="relative flex h-6 w-6 shrink-0 sm:h-8 sm:w-8 items-center justify-center">
          <span className={`absolute inset-0 rounded-full motion-safe:animate-ping ${t.ping}`} />
          <span className={`relative flex h-6 w-6 items-center sm:h-8 sm:w-8 justify-center rounded-full ${t.phone}`}>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="h-3 w-3 origin-center sm:h-4 sm:w-4 motion-safe:animate-phone-ring"
            >
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.21 2.2Z" />
            </svg>
          </span>
        </span>
        <span className="whitespace-nowrap text-[clamp(11px,3.4vw,14px)] font-semibold tracking-tight sm:text-base">
          {label}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
          className={`h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 motion-safe:animate-bounce ${t.arrow}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0-6-6m6 6 6-6" />
        </svg>
      </span>
    </ScrollToBookingButton>
  );
}
