// Gold line drawing of a cathedral rose window, used as a background ornament.
// Purely decorative: inherits color from `currentColor`.

const range = (n: number) => Array.from({ length: n }, (_, i) => (360 / n) * i);

export default function RoseWindow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="-100 -100 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.4}
      aria-hidden="true"
      className={className}
    >
      {/* Outer rings */}
      <circle r={98} />
      <circle r={95} />
      <circle r={82} />

      {/* Ring of small foils around the rim */}
      {range(24).map((a) => (
        <circle key={`rim-${a}`} cx={0} cy={-88.5} r={5.2} transform={`rotate(${a})`} />
      ))}

      {/* Overlapping circles that form the interlaced tracery */}
      {range(12).map((a) => (
        <circle key={`lace-${a}`} cx={0} cy={-52} r={28} transform={`rotate(${a})`} />
      ))}

      {/* Pointed lancet petals and spokes */}
      {range(12).map((a) => (
        <g key={`petal-${a}`} transform={`rotate(${a})`}>
          <path d="M0 -30 Q 13 -56 0 -80 Q -13 -56 0 -30 Z" />
          <path d="M0 -40 Q 6 -57 0 -70 Q -6 -57 0 -40 Z" />
          <line x1={0} y1={-80} x2={0} y2={-82} />
          <circle cx={0} cy={-80} r={1.6} />
        </g>
      ))}

      {/* Inner rings and foils */}
      <circle r={30} />
      <circle r={27} />
      {range(8).map((a) => (
        <circle key={`inner-${a}`} cx={0} cy={-18} r={7} transform={`rotate(${a})`} />
      ))}
      <circle r={9} />

      {/* Center quatrefoil */}
      {range(4).map((a) => (
        <circle key={`quat-${a}`} cx={0} cy={-3.5} r={3.5} transform={`rotate(${a})`} />
      ))}
    </svg>
  );
}
