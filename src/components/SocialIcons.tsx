import { useId } from "react";

// Small Facebook and Instagram marks for showing which platforms we run
// campaigns on. Single color (they take `currentColor`), so they sit quietly
// in the page's palette. Drawn from simple shapes.

export function FacebookIcon({ className = "h-6 w-6" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <mask id={id}>
        <rect width="24" height="24" fill="#fff" />
        <path
          fill="#000"
          d="M15.6 7.9h-1.9c-.7 0-1 .4-1 1.1v1.9h2.9l-.4 2.9h-2.5V24h-3.1v-10.2H7.4v-2.9h2.2V8.6c0-2.3 1.4-3.6 3.5-3.6.9 0 1.9.1 2.5.2v2.7Z"
        />
      </mask>
      <circle cx="12" cy="12" r="12" fill="currentColor" mask={`url(#${id})`} />
    </svg>
  );
}

export function InstagramIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor">
      <rect x="2" y="2" width="20" height="20" rx="5.8" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.4" strokeWidth="2" />
      <circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Full-color versions, for when the logo itself is the visual.

export function FacebookLogo({ className = "h-6 w-6" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <clipPath id={id}>
        <circle cx="12" cy="12" r="12" />
      </clipPath>
      <circle cx="12" cy="12" r="12" fill="#0866ff" />
      <path
        fill="#fff"
        clipPath={`url(#${id})`}
        d="M15.6 7.9h-1.9c-.7 0-1 .4-1 1.1v1.9h2.9l-.4 2.9h-2.5V24h-3.1v-10.2H7.4v-2.9h2.2V8.6c0-2.3 1.4-3.6 3.5-3.6.9 0 1.9.1 2.5.2v2.7Z"
      />
    </svg>
  );
}

export function InstagramLogo({ className = "h-6 w-6" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <radialGradient id={id} cx="0.3" cy="1.07" r="1.25">
        <stop offset="0" stopColor="#fdf497" />
        <stop offset="0.05" stopColor="#fdf497" />
        <stop offset="0.45" stopColor="#fd5949" />
        <stop offset="0.6" stopColor="#d6249f" />
        <stop offset="0.9" stopColor="#285aeb" />
      </radialGradient>
      <rect width="24" height="24" rx="6" fill={`url(#${id})`} />
      <rect x="5" y="5" width="14" height="14" rx="4" stroke="#fff" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.3" stroke="#fff" strokeWidth="1.6" />
      <circle cx="16" cy="8" r="0.95" fill="#fff" />
    </svg>
  );
}
