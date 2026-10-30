// Everything in The Parish House of Studies (/house-of-studies). Resources sit
// in books, and books sit on shelves (see `shelves` below). To add a resource, add
// one object to `vaultItems` with `section` set to its book.
//
// - kind "book": featured at the top of its book, linking to `href` or
//   showing `buttons`.
// - kind "link": a row in the book's list that opens `href` (a document,
//   PDF, or page). External links and PDFs open in a new tab.
// - kind "video": gets its own page at /house-of-studies/<slug> with the video embedded.
//   Set `video` to a Vimeo or Loom ID (the last part of the share link).
//   It plays right inside the open book. `thumbnail` and `duration` are
//   optional (for Loom, get the thumbnail from
//   https://www.loom.com/v1/oembed?url=<share link>).
//   Leave `video` out to show the card as "Coming Soon".

export type VaultItem = {
  slug: string;
  kind: "book" | "video" | "link";
  title: string;
  // Small tag shown on list rows, e.g. "SOP" (defaults to "Video"/"Document").
  label?: string;
  // Main videos of a book (e.g. the Core Four): bigger, bolder row title.
  featured?: boolean;
  description: string;
  section: string;
  href?: string;
  video?: {
    provider: "vimeo" | "loom";
    id: string;
    thumbnail?: string;
    duration?: string;
    // Width / height of the recording, e.g. 4 / 3.
    aspect?: number;
  };
  image?: string;
  cta: string;
  // Optional buttons shown instead of making the whole card one link.
  // The first one is styled as the main button.
  buttons?: { label: string; href: string }[];
};

// Shelf and book colors (see METALS in LibraryExplorer.tsx).
export type VaultMetal =
  | "brass"
  | "steel"
  | "copper"
  | "violet"
  | "crimson"
  | "emerald"
  | "sapphire";

// A book on a shelf. Items point at a book with `section`.
export type VaultBook = { id: string; title: string; metal: VaultMetal };

// The bookshelves you cycle through at the top of /house-of-studies, in
// order. Opening one shows its books. A shelf with no books shows as
// "Coming Soon"; a book with no items shows as sealed.
// Book colors follow the liturgical colors: violet (Advent, where the year
// begins), red (Pentecost, being sent out), green (Ordinary Time, growth).
// The symbol on a shelf's brass nameplate (drawn in LibraryExplorer.tsx).
export type ShelfIcon = "social" | "website" | "bulletin";

export type Shelf = {
  id: string;
  title: string;
  icon: ShelfIcon;
  blurb: string;
  metal: VaultMetal;
  books: VaultBook[];
};

export const shelves: Shelf[] = [
  {
    id: "social-media",
    icon: "social",
    title: "Social Media",
    blurb: "Facebook and Instagram for your parish, from your first post to your first\u00a0ad.",
    metal: "brass",
    books: [
      { id: "start-here", title: "Start Here", metal: "violet" },
      { id: "organic", title: "Organic Social Media", metal: "crimson" },
      { id: "paid", title: "Paid Social Media", metal: "emerald" },
    ],
  },
  {
    id: "website",
    icon: "website",
    title: "Website",
    blurb: "How to structure your parish website so newcomers find what they\u00a0need.",
    metal: "sapphire",
    books: [],
  },
  {
    id: "bulletin",
    icon: "bulletin",
    title: "Bulletin",
    blurb: "How to make your weekly bulletin something parishioners actually\u00a0read.",
    metal: "steel",
    books: [],
  },
];

export const vaultItems: VaultItem[] = [
  {
    slug: "social-media-for-catholic-churches",
    kind: "book",
    section: "start-here",
    title: "Social Media for Catholic Churches",
    description:
      "A practical, Catholic-specific guide to parish Facebook and Instagram. Free for pastors and parish leaders; anyone else can get a copy on Amazon.",
    href: "/free-guide",
    image: "/images/free-guide/book-hardcover.png",
    cta: "Get the Book",
    buttons: [
      {
        label: "Get the Free Digital Copy",
        href: "/free-guide",
      },
      {
        label: "Get it on Amazon",
        href: "https://www.amazon.com/Social-Media-Catholic-Churches-Practical/dp/B0H3QTWDFL/",
      },
    ],
  },
  {
    slug: "social-media-system",
    kind: "video",
    section: "start-here",
    title: "Parish Social Media Fundamentals",
    description:
      "A full training on running your parish’s social media as a simple, repeatable system.",
    video: {
      provider: "loom",
      id: "d203f0ea9b3b46e7ad800b31323d64ba",
      thumbnail: "https://cdn.loom.com/sessions/thumbnails/d203f0ea9b3b46e7ad800b31323d64ba-f1cbc3a94e1f4135.gif",
      duration: "26:17",
      aspect: 4 / 3,
    },
    cta: "Watch the Video",
  },
  {
    slug: "meta-ads-fundamentals",
    kind: "video",
    section: "start-here",
    title: "Parish Meta Ads Fundamentals",
    description:
      "The basics of running Facebook and Instagram ads for your parish.",
    // TODO: add the Loom video (shows as "Coming soon" until then)
    cta: "Watch the Video",
  },
  // Core Four videos below without `video` show as "Coming Soon".
  {
    slug: "core-four-overview",
    kind: "video",
    section: "organic",
    featured: true,
    label: "Core Four",
    title: "Overview of the Core Four Posts",
    description:
      "The four kinds of posts every parish should be making each week, and why they work.",
    cta: "Watch the Video",
  },
  {
    slug: "core-four-homily-clips",
    kind: "video",
    section: "organic",
    featured: true,
    label: "Core Four",
    title: "Core Four (#1): Homily Clips",
    description:
      "How to turn Sunday’s homily into short clips that reach people who weren’t at Mass.",
    cta: "Watch the Video",
  },
  {
    slug: "core-four-activity-posts",
    kind: "video",
    section: "organic",
    featured: true,
    label: "Core Four",
    title: "Core Four (#2): Activity Posts",
    description:
      "How to show what’s happening at your parish so people see a living, active community.",
    cta: "Watch the Video",
  },
  {
    slug: "core-four-connection-posts",
    kind: "video",
    section: "organic",
    featured: true,
    label: "Core Four",
    title: "Core Four (#3): Connection Posts",
    description:
      "How to introduce the people of your parish so newcomers feel they already know someone.",
    cta: "Watch the Video",
  },
  {
    slug: "core-four-flyers",
    kind: "video",
    section: "organic",
    featured: true,
    label: "Core Four",
    title: "Core Four (#4): Flyers",
    description:
      "How to create parish flyers people actually stop and read, from layout to final design.",
    video: {
      provider: "loom",
      id: "21eac7a294bf4a7aa26dc40b9e86c592",
      duration: "18:55",
      aspect: 4 / 3,
    },
    cta: "Watch the Video",
  },
  {
    slug: "ai-flyers",
    kind: "video",
    section: "organic",
    title: "Flyer Creation Example",
    description:
      "Made a flyer with ChatGPT? Watch me bring it into Canva and make it fully editable, so you can fix the text and polish the design.",
    video: {
      provider: "loom",
      id: "60eab96a22a544c99be048f1fd4f7113",
      thumbnail: "https://cdn.loom.com/sessions/thumbnails/60eab96a22a544c99be048f1fd4f7113-908cef7655eede72.gif",
      duration: "2:24",
      aspect: 4 / 3,
    },
    cta: "Watch the Video",
  },
  {
    slug: "flyer-sop",
    kind: "link",
    label: "SOP",
    section: "organic",
    title: "Flyer Creation SOP",
    description: "A step-by-step checklist for making parish flyers.",
    href: "/downloads/parish-flyer-sop.pdf",
    cta: "Open the SOP",
  },
  {
    slug: "meta-ads-mass",
    kind: "video",
    section: "paid",
    featured: true,
    label: "Big Three",
    title: "The Big Three (#1): Plan Your Visit\u00a0Campaigns",
    description:
      "Watch how to set up Facebook and Instagram ads that invite people in your area to come to Mass.",
    video: {
      provider: "loom",
      id: "a833d3e1e37d4b9ea73381f0417504ee",
      thumbnail: "https://cdn.loom.com/sessions/thumbnails/a833d3e1e37d4b9ea73381f0417504ee-da3ef1dfbdb63d26.gif",
      duration: "9:54",
      aspect: 4 / 3,
    },
    cta: "Watch the Video",
  },
  {
    slug: "big-three-event-campaigns",
    kind: "video",
    section: "paid",
    featured: true,
    label: "Big Three",
    title: "The Big Three (#2): Event\u00a0Campaigns",
    description:
      "How to fill parish events with ads that reach the right people in your area.",
    cta: "Watch the Video",
  },
  {
    slug: "big-three-volunteer-campaigns",
    kind: "video",
    section: "paid",
    featured: true,
    label: "Big Three",
    title: "The Big Three (#3): Volunteer\u00a0Campaigns",
    description:
      "How to use ads to find new volunteers for your parish ministries.",
    cta: "Watch the Video",
  },
];

export function getVaultItem(slug: string) {
  return vaultItems.find((item) => item.slug === slug);
}

export function vaultItemHref(item: VaultItem) {
  return item.kind === "video" ? `/house-of-studies/${item.slug}` : (item.href ?? "#");
}

export function isComingSoon(item: VaultItem) {
  return item.kind === "video" ? !item.video : !item.href;
}

export function videoEmbedUrl(video: NonNullable<VaultItem["video"]>, autoplay = false) {
  return video.provider === "loom"
    ? `https://www.loom.com/embed/${video.id}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true${autoplay ? "&autoplay=1" : ""}`
    : `https://player.vimeo.com/video/${video.id}?badge=0&autopause=0&player_id=0&app_id=58479${autoplay ? "&autoplay=1" : ""}`;
}
