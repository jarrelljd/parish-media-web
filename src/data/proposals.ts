/*
  Web proposals, served at /proposals/<slug>. Unlisted and noindexed:
  never link these from Nav, the footer, or any other page.

  Each proposal is built from Joe's call notes plus public research.
  Every number in `snapshot` carries its source so Joe can verify it
  before sending. Don't put anything here that came up privately on the
  call (staff names, criticism of staff) unless Joe approves it.
*/

export type Proposal = {
  slug: string;
  parish: string;
  /** Short name used in running copy, e.g. "St. Joseph's" */
  shortName: string;
  city: string;
  preparedFor: string;
  date: string;
  /** Vimeo id for a personal video from Joe. Leave undefined to hide. */
  videoId?: string;
  intro: string;
  /** What we heard on the call, in the pastor's terms */
  heard: string[];
  snapshot: { value: string; label: string; source: string }[];
  goal: string;
  plan: { when: string; title: string; body: string }[];
  weHandle: string[];
  youProvide: string[];
  proof: { value: string; label: string }[];
  investment: {
    plan: string;
    standard: { total: string; billing: string };
    options: { name: string; condition: string; total: string; detail: string; highlight?: boolean }[];
    /** Shown under the options, e.g. the fast-decision deadline. */
    terms: string[];
  };
  guarantee: string;
  bonuses: string[];
  /** Dropbox Sign link for the contract. Undefined shows a placeholder. */
  signUrl?: string;
  contact: { name: string; phone: string };
};

export const proposals: Proposal[] = [
  {
    slug: "st-josephs-basilica",
    parish: "St. Joseph Basilica",
    shortName: "St. Joseph's",
    city: "Alameda, CA",
    preparedFor: "Fr. Mario Rizzo",
    date: "November 2026",
    intro:
      "A 12-month plan to help more young adults and young families in Alameda find St. Joseph's, and take a first step in.",
    heard: [
      "The goal is evangelization: people in Alameda seeing the Church as alive, and wanting to come see it for themselves.",
      "Social media doesn't have a dedicated owner right now, and you're already stretched thin.",
      "There's no system yet for knowing what it takes to bring a new young family or young adult through the door.",
    ],
    snapshot: [
      {
        value: "76,876",
        label: "people live in Alameda",
        source: "U.S. Census Bureau, July 2025 estimate",
      },
      {
        value: "322,607",
        label: "Catholics in Alameda County",
        source: "2020 U.S. Religion Census",
      },
      {
        value: "About 700",
        label: "Instagram followers today",
        source: "From our call",
      },
      {
        value: "15 to 20",
        label: "young adults at YAG on a typical Wednesday",
        source: "From our call",
      },
    ],
    goal: "30+ qualified inquiries from local young families in the first 90 days.",
    plan: [
      {
        when: "Month 1",
        title: "Launch and a young-adult gathering",
        body: "We set up the outreach system, record your baseline numbers, and promote a young-adult night like Pints with the Priests to 21 to 39 year olds near the Basilica.",
      },
      {
        when: "Month 2",
        title: "A young-family event",
        body: "We take an event you already run, like the Holy Half Hour with dinner, and put it in front of young families across Alameda.",
      },
      {
        when: "Month 3",
        title: "Plan Your Visit",
        body: "A campaign inviting local adults and families to Mass. Then we review 90 days of data and tune every campaign by cost per inquiry and turnout.",
      },
      {
        when: "Ongoing",
        title: "Whatever matters most that month",
        body: "Events, volunteer needs, young-adult activities, liturgies, and Alpha, chosen together in a monthly planning call.",
      },
    ],
    weHandle: [
      "5 posts a week: 2 homily clips, a connection post, an activity post, and a flyer",
      "Meta ad campaigns and the sign-up pages behind them",
      "Weekly campaign optimization",
      "A monthly report showing what's working and what it costs",
    ],
    youProvide: [
      "Account access before launch",
      "One point person to follow up with new inquiries",
      "Event details and approved photos",
      "$200 to $250 a month in ad spend, paid directly to Meta",
    ],
    proof: [
      { value: "$2.96 and $2.99", label: "per qualified inquiry in comparable parish campaigns" },
      { value: "0 to 941", label: "Instagram followers at St. Joseph, Los Banos, February to June 2026" },
    ],
    investment: {
      plan: "12-Month Parish Growth Partnership",
      standard: { total: "$30,000", billing: "billed at $2,500 a month for 12 months" },
      options: [
        {
          name: "Fast decision",
          condition: "Approve within 72 hours",
          total: "$27,000",
          detail: "$2,250 a month for 12 months",
        },
        {
          name: "Pay in full",
          condition: "Pay the year upfront",
          total: "$27,000",
          detail: "10% off",
        },
        {
          name: "Both",
          condition: "Approve within 72 hours and pay upfront",
          total: "$24,000",
          detail: "You save $6,000",
          highlight: true,
        },
      ],
      terms: [
        "The 72-hour rate expires Friday, November 13, 2026, at 1:00 p.m. Pacific.",
        "Discounted rates require a full 12-month commitment. Ad spend is separate and paid directly to Meta.",
      ],
    },
    guarantee:
      "If you're not happy in the first 30 days, we'll work to fix it. If you're still not happy, we refund the management fees, as long as the parish has done its part.",
    bonuses: [
      "An in-person visit from Joe",
      "A professional photo and video shoot at the Basilica",
      "A free parish website rebuild",
    ],
    contact: { name: "Joe Jarrell", phone: "(414) 539-7834" },
  },
];

export function getProposal(slug: string) {
  return proposals.find((p) => p.slug === slug);
}
