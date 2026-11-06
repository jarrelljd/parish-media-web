// Draft logo mark: a church window (round arch) with a small rose and a
// cross-shaped mullion. Inherits color from `currentColor`.
export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 36" fill="none" stroke="currentColor" aria-hidden="true" className={className}>
      {/* Outer and inner arch */}
      <path d="M1.5 35V14a12.5 12.5 0 0 1 25 0v21z" strokeWidth={1.5} />
      <path d="M5 35V14.5a9 9 0 0 1 18 0V35" strokeWidth={0.9} />
      {/* Rose in the head of the arch */}
      <circle cx={14} cy={12} r={3.2} strokeWidth={0.9} />
      <circle cx={14} cy={12} r={0.9} fill="currentColor" stroke="none" />
      {/* Cross mullion */}
      <path d="M14 15.2V35M8.5 22h11" strokeWidth={0.9} />
      {/* Sill */}
      <path d="M0 35h28" strokeWidth={1.5} />
    </svg>
  );
}
