"use client";

export default function AuditCtaButton() {
  return (
    <button
      type="button"
      onClick={() =>
        document
          .getElementById("audit-form")
          ?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      className="inline-flex items-center justify-center rounded-full bg-gold px-10 py-4 text-base font-semibold text-navy shadow-md transition-colors hover:bg-gold/90"
    >
      Get My Free Audit
    </button>
  );
}
