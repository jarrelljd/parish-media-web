// A red wax seal pressed with a cross, for the bottom of the free-guide
// letter. The outline is slightly uneven so it reads as hand-pressed.
export default function WaxSeal({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={`drop-shadow-[0_3px_4px_rgba(60,10,6,0.35)] ${className}`}
    >
      <defs>
        <radialGradient id="pmc-wax" cx="38%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#c8473c" />
          <stop offset="55%" stopColor="#a1281e" />
          <stop offset="100%" stopColor="#6c140e" />
        </radialGradient>
        <radialGradient id="pmc-wax-well" cx="60%" cy="62%" r="60%">
          <stop offset="0%" stopColor="#a1281e" />
          <stop offset="100%" stopColor="#7e1b13" />
        </radialGradient>
      </defs>

      {/* Wax blob */}
      <path
        fill="url(#pmc-wax)"
        d="M92.2 41.7Q94.1 50.0 92.0 58.3Q90.0 66.6 86.2 74.5Q82.4 82.4 74.4 86.0Q66.4 89.6 58.2 92.4Q50.0 95.2 41.5 93.1Q33.0 91.0 26.4 85.6Q19.7 80.3 14.1 73.7Q8.4 67.2 7.9 58.6Q7.3 50.0 8.0 41.5Q8.7 32.9 14.2 26.3Q19.7 19.7 26.6 15.0Q33.6 10.3 41.8 7.8Q50.0 5.4 58.9 6.1Q67.8 6.9 74.2 13.2Q80.5 19.5 85.4 26.4Q90.3 33.3 92.2 41.7Z"
      />

      {/* Pressed well: darker inside, a highlight on the lower-right lip */}
      <circle cx="50" cy="50" r="31" fill="url(#pmc-wax-well)" />
      <circle cx="50" cy="50" r="31" fill="none" stroke="#5e110c" strokeOpacity="0.55" strokeWidth="2" />
      <circle cx="50.8" cy="50.8" r="32.2" fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="1.2" />

      {/* Beaded ring inside the well */}
      <circle cx="50" cy="50" r="25.5" fill="none" stroke="#5e110c" strokeOpacity="0.45" strokeWidth="1.4" strokeDasharray="0.1 4" strokeLinecap="round" />

      {/* Embossed cross: highlight offset, then the recessed stroke */}
      <path d="M50.8 33.8v34M41.8 44.8h18" stroke="#fff" strokeOpacity="0.2" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M50 33v34M41 44h18" stroke="#5e110c" strokeOpacity="0.8" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Shine on the upper-left of the wax */}
      <ellipse cx="30" cy="24" rx="11" ry="5" transform="rotate(-35 30 24)" fill="#fff" fillOpacity="0.14" />
    </svg>
  );
}
