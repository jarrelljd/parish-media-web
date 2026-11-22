// Illustration for /monthly-giving: a year of parish income as stacked bars.
// The gold base (recurring gifts) is the same every month; the blue top
// (Sunday collection) rises and falls with the calendar. Shapes only, no
// real figures, so there's no value axis.
// Colors validated with the dataviz palette script (CVD ΔE 21.6, both 3:1+).

const RECURRING = "#a8832f";
const COLLECTION = "#6f86c9";

const BASE = 34;
const MONTHS: [string, string, number, string][] = [
  ["J", "January", 50, "Snowy Sundays keep people home"],
  ["F", "February", 56, ""],
  ["M", "March", 58, ""],
  ["A", "April", 84, "Easter brings a spike"],
  ["M", "May", 60, ""],
  ["J", "June", 46, "Summer travel begins"],
  ["J", "July", 38, "Summer slump"],
  ["A", "August", 41, "Summer slump"],
  ["S", "September", 58, ""],
  ["O", "October", 60, ""],
  ["N", "November", 64, ""],
  ["D", "December", 96, "Christmas brings a spike"],
];
const MAX = BASE + Math.max(...MONTHS.map((m) => m[2]));

export default function RecurringGivingChart() {
  return (
    <figure className="rounded-3xl bg-white px-5 pb-5 pt-6 shadow-xl shadow-ink/10 ring-1 ring-ink/5 sm:px-7">
      <figcaption className="text-left">
        <span className="block font-serif text-xl font-semibold text-ink">A year of parish giving</span>
        <span className="mt-1 block text-sm text-ink/55">Illustration</span>
      </figcaption>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink/75">
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: RECURRING }} />
          Recurring monthly gifts
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: COLLECTION }} />
          Sunday collection
        </li>
      </ul>

      <div
        role="img"
        aria-label="Illustration: the Sunday collection rises at Easter and Christmas and dips in winter and summer, while recurring monthly gifts stay the same every month."
        className="relative mt-5 h-56 border-b border-ink/15 sm:h-64"
      >
        <div className="absolute inset-0 flex items-end gap-1.5 sm:gap-2.5">
          {MONTHS.map(([, month, collection, note]) => (
            <div key={month} className="group relative flex h-full flex-1 flex-col justify-end">
              {/* Hover card */}
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-[11rem] -translate-x-1/2 rounded-lg bg-ink px-3 py-2 text-left text-xs leading-snug text-vellum opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                <span className="block font-semibold">{month}</span>
                <span className="block">Recurring gifts: steady</span>
                {note && <span className="block text-vellum/70">{note}</span>}
              </div>
              <div
                className="w-full rounded-t-[4px]"
                style={{ height: `${(collection / MAX) * 100}%`, backgroundColor: COLLECTION }}
              />
              {/* 2px surface gap between the stacked segments */}
              <div className="h-[2px] w-full bg-white" />
              <div className="w-full" style={{ height: `${(BASE / MAX) * 100}%`, backgroundColor: RECURRING }} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex gap-1.5 text-center text-xs text-ink/50 sm:gap-2.5" aria-hidden="true">
        {MONTHS.map(([short, month]) => (
          <span key={month} className="flex-1">{short}</span>
        ))}
      </div>
    </figure>
  );
}
