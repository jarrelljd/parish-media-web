// Parish Flyer Library (/flyers): categories, the template type, search
// synonyms, and PLACEHOLDER templates for reviewing the interface. Real
// templates are added at /flyers/admin and stored by src/lib/flyers/store.ts.
//
// Each template is one Canva design. Templates that share an `event` show
// together as one group of design options ("Blessing of the Pets": 3 designs).
//
// - `canvaUrl`: the Canva "template link" (Share > Template link), which gives
//   each parish its own editable copy without touching the original.
// - `thumbnail`: a 4:5 image path. Leave it out to show a placeholder card.
// - `keywords`: extra words staff might type ("fish fry" > "lent", "friday").

export const flyerCategories = [
  "Liturgical Seasons",
  "Sacraments",
  "Parish Community",
  "Prayer & Worship",
  "Youth & Families",
  "Fundraising & Service",
  "Special Events",
] as const;

export type FlyerCategory = (typeof flyerCategories)[number];

// Placeholder looks, so the review grid shows variety. Real templates will
// have a thumbnail and won't use these.
export type PlaceholderStyle = "cathedral" | "parchment" | "bright";

export type FlyerTemplate = {
  id: string;
  event: string;
  designName: string;
  description: string;
  category: FlyerCategory;
  keywords: string[];
  canvaUrl: string;
  thumbnail?: string;
  placeholderStyle?: PlaceholderStyle;
};

type EventSeed = {
  event: string;
  category: FlyerCategory;
  keywords: string[];
  description: string;
};

const events: EventSeed[] = [
  {
    event: "Christmas Mass Schedule",
    category: "Liturgical Seasons",
    keywords: ["christmas", "christmas eve", "nativity", "midnight mass", "mass times", "december"],
    description: "Every Christmas Eve and Christmas Day Mass on one page.",
  },
  {
    event: "Advent Lessons & Carols",
    category: "Liturgical Seasons",
    keywords: ["advent", "carols", "choir", "lessons and carols", "december", "concert"],
    description: "An evening of Scripture and carols to begin Advent.",
  },
  {
    event: "Our Lady of Guadalupe",
    category: "Liturgical Seasons",
    keywords: ["guadalupe", "december 12", "juan diego", "mananitas", "hispanic ministry", "marian"],
    description: "Feast day Mass, mañanitas, and celebration details.",
  },
  {
    event: "Epiphany Home Blessing",
    category: "Liturgical Seasons",
    keywords: ["epiphany", "chalk", "house blessing", "home blessing", "three kings", "january"],
    description: "Invite families to pick up chalk and bless their homes.",
  },
  {
    event: "Stations of the Cross",
    category: "Liturgical Seasons",
    keywords: ["lent", "lenten", "friday", "way of the cross", "good friday"],
    description: "Weekly Lenten Stations, with room for times and leaders.",
  },
  {
    event: "First Communion",
    category: "Sacraments",
    keywords: ["first holy communion", "first eucharist", "fhc", "eucharist", "second grade"],
    description: "Celebrate your First Communion class and share the Mass details.",
  },
  {
    event: "Confession Night",
    category: "Sacraments",
    keywords: ["confession", "reconciliation", "penance", "penance service", "light is on", "advent", "lent"],
    description: "Extra confession times for Advent, Lent, or any season.",
  },
  {
    event: "Thanksgiving Potluck",
    category: "Parish Community",
    keywords: ["thanksgiving", "potluck", "dinner", "november", "meal", "pot luck"],
    description: "Invite the whole parish to share a meal and give thanks.",
  },
  {
    event: "Fish Fry",
    category: "Parish Community",
    keywords: ["fish fry", "lent", "lenten", "friday", "dinner", "knights of columbus"],
    description: "Lenten Friday dinners, with menu and price sections.",
  },
  {
    event: "Eucharistic Adoration",
    category: "Prayer & Worship",
    keywords: ["adoration", "holy hour", "blessed sacrament", "benediction", "exposition", "eucharist"],
    description: "Adoration hours, holy hours, and sign-up reminders.",
  },
  {
    event: "Vacation Bible School",
    category: "Youth & Families",
    keywords: ["vbs", "summer", "kids", "children", "bible camp"],
    description: "A bright summer flyer for kids and their parents.",
  },
  {
    event: "Food Drive",
    category: "Fundraising & Service",
    keywords: ["food pantry", "canned food", "donations", "service", "charity", "st vincent de paul"],
    description: "Collect food for local families, with a list of what's needed.",
  },
  {
    event: "Blessing of the Pets",
    category: "Special Events",
    keywords: ["pets", "animals", "dogs", "cats", "st francis", "feast of st francis", "october"],
    description: "The October feast of St. Francis, with a blessing time and place.",
  },
];

const designs: { name: string; style: PlaceholderStyle }[] = [
  { name: "Cathedral", style: "cathedral" },
  { name: "Parchment", style: "parchment" },
  { name: "Bright", style: "bright" },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const placeholderTemplates: FlyerTemplate[] = events.flatMap((e) =>
  designs.map((d) => ({
    id: `${slug(e.event)}-${slug(d.name)}`,
    event: e.event,
    designName: d.name,
    description: e.description,
    category: e.category,
    keywords: e.keywords,
    canvaUrl: "https://www.canva.com/",
    placeholderStyle: d.style,
  })),
);

// While the library is being built, the placeholders show after the real
// designs (which live in the flyer data folder, managed at /flyers/admin).
// Set to false once there are enough real designs.
export const SHOW_PLACEHOLDERS = true;

// Words staff use for the same thing. A search for any word in a group also
// matches the others.
export const flyerSynonyms: string[][] = [
  ["communion", "eucharist", "fhc"],
  ["confession", "reconciliation", "penance"],
  ["pet", "animal", "dog", "cat"],
  ["kids", "children", "youth", "family"],
  ["dinner", "meal", "potluck", "supper"],
  ["adoration", "benediction", "exposition"],
  ["fundraiser", "fundraising", "donation", "giving"],
];
