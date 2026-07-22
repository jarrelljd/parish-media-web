function FlowIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy text-offwhite">
      {children}
    </div>
  );
}

function FlowArrow() {
  return (
    <svg
      className="mx-auto shrink-0 rotate-90 text-gold sm:mx-0 sm:rotate-0"
      width="28"
      height="14"
      viewBox="0 0 28 14"
      fill="none"
    >
      <path
        d="M1 7H26M26 7L20 1.5M26 7L20 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const steps = [
  {
    label: "Targeted ad reaches a young man considering religious life",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "He responds with his name and number",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 5.5C4 4.67 4.67 4 5.5 4h13c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5H9l-4 3.5v-3.5H5.5C4.67 15 4 14.33 4 13.5v-8Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M8 8.5h8M8 11.5h5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "An iMessage sends automatically to start the conversation",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="11" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M7 16v3.2c0 .5.6.8 1 .5l3.5-3.7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="10.5" r="1" fill="currentColor" />
        <circle cx="12" cy="10.5" r="1" fill="currentColor" />
        <circle cx="15" cy="10.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Director is notified once he replies, and manages every conversation from one dashboard on a dedicated line",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13" y="4" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="12" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13" y="16" width="8" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="19.5" cy="6.5" r="2" fill="#C9A227" />
      </svg>
    ),
  },
];

export default function VocationFlow() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:items-start sm:gap-3">
      {steps.map((step, i) => (
        <div key={i} className="contents">
          <div className="flex w-full max-w-40 flex-col items-center gap-3 text-center sm:w-auto">
            <FlowIcon>{step.icon}</FlowIcon>
            <p className="text-xs text-navy/70">{step.label}</p>
          </div>
          {i < steps.length - 1 && <FlowArrow />}
        </div>
      ))}
    </div>
  );
}
