export default function EventRedirectCTA({
  buttonLabel,
  url,
}: {
  buttonLabel: string;
  url: string;
}) {
  return (
    <a
      href={url}
      className="block w-full rounded-full bg-[var(--brand-primary)] px-8 py-3 text-center text-sm font-medium text-[var(--brand-background)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-8px_var(--brand-shadow)] transition-[transform,box-shadow,opacity] hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
    >
      {buttonLabel}
    </a>
  );
}
