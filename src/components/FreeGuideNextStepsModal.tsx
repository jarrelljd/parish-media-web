"use client";

const AMAZON_URL =
  "https://www.amazon.com/Social-Media-Catholic-Churches-Practical/dp/B0H3QTWDFL/";

export default function FreeGuideNextStepsModal({
  open,
  role,
  onClose,
}: {
  open: boolean;
  role: string;
  onClose: () => void;
}) {
  if (!open) return null;

  function goToBooking() {
    window.location.href = `/free-guide/book-a-call?role=${encodeURIComponent(
      role,
    )}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 bg-navy/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="next-steps-title"
        className="relative w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-navy/50 transition-colors hover:bg-navy/5 hover:text-navy"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <p
          id="next-steps-title"
          className="font-serif text-xl font-semibold text-navy"
        >
          One More Thing
        </p>
        <p className="mt-2 text-navy/70">
          Would you like to explore anything else?
        </p>

        <div className="mt-6 space-y-3">
          <a
            href={AMAZON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-full border border-navy px-6 py-3 text-sm font-medium text-navy transition-colors hover:bg-navy/5"
          >
            Buy the Paperback on Amazon
          </a>
          <button
            type="button"
            onClick={goToBooking}
            className="block w-full rounded-full bg-navy px-6 py-3 text-sm font-medium text-offwhite transition-colors hover:bg-navy/90"
          >
            Book a Free Consultation
          </button>
          <button
            type="button"
            onClick={onClose}
            className="block w-full text-sm text-navy/50 underline decoration-gold decoration-2 underline-offset-4 hover:text-navy"
          >
            Not Right Now
          </button>
        </div>
      </div>
    </div>
  );
}
