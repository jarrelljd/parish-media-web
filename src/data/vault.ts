// Everything in The Parish Communications Hub (/hub), grouped into three
// vaults. To add a resource, add one object here.
//
// - kind "book": featured at the top of its vault, linking to `href` or
//   showing `buttons`.
// - kind "link": a row in the vault's list that opens `href` (a document,
//   PDF, or page) in a new tab if external.
// - kind "video": gets its own page at /hub/<slug> with the video embedded.
//   Set `video` to a Vimeo or Loom ID (the last part of the share link).
//   It plays right inside the open vault. `thumbnail` and `duration` are
//   optional (for Loom, get the thumbnail from
//   https://www.loom.com/v1/oembed?url=<share link>).
//   Leave `video` out to show the card as "Coming Soon".

export type VaultItem = {
  slug: string;
  kind: "book" | "video" | "link";
  title: string;
  // Small tag shown on list rows, e.g. "SOP" (defaults to "Video"/"Document").
  label?: string;
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

// The vaults, in the order they show on the page. A vault with no items
// shows as sealed.
// `metal` sets each vault door's color (see METALS in VaultExplorer.tsx).
// They follow the liturgical colors: violet (Advent, where the year begins),
// red (Pentecost, being sent out), green (Ordinary Time, growth).
export type VaultMetal =
  | "brass"
  | "steel"
  | "copper"
  | "violet"
  | "crimson"
  | "emerald"
  | "sapphire";

export const vaultSections: { id: string; title: string; metal: VaultMetal }[] = [
  {
    id: "start-here",
    title: "Start Here",
    metal: "violet",
  },
  {
    id: "social-media",
    title: "Engage",
    metal: "crimson",
  },
  {
    id: "ads",
    title: "Grow",
    metal: "emerald",
  },
];

export const vaultItems: VaultItem[] = [
  {
    slug: "social-media-for-catholic-churches",
    kind: "book",
    section: "start-here",
    title: "Social Media for Catholic Churches",
    description:
      "A practical, Catholic-specific guide to parish Facebook and Instagram. Free for parish, diocese, and religious order staff.",
    href: "https://drive.google.com/file/d/1F2sylV7C6tL11UB41Ew3miEgz2nq7f0x/view?usp=drive_link",
    image: "/images/free-guide/book-hardcover.png",
    cta: "Read the Book",
    buttons: [
      {
        label: "Download the PDF",
        href: "https://drive.google.com/uc?export=download&id=1F2sylV7C6tL11UB41Ew3miEgz2nq7f0x",
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
  {
    slug: "ai-flyers",
    kind: "video",
    section: "social-media",
    title: "Making Flyers That Actually Get Engagement",
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
    section: "social-media",
    title: "Flyer Creation SOP",
    description: "A step-by-step checklist for making parish flyers.",
    // TODO: add the document link (shows as "Coming soon" until then)
    cta: "Open the SOP",
  },
  {
    slug: "meta-ads-mass",
    kind: "video",
    section: "ads",
    title: "Running Plan Your Visit Campaigns - Pt. 1",
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
];

export function getVaultItem(slug: string) {
  return vaultItems.find((item) => item.slug === slug);
}

export function vaultItemHref(item: VaultItem) {
  return item.kind === "video" ? `/hub/${item.slug}` : (item.href ?? "#");
}

export function isComingSoon(item: VaultItem) {
  return item.kind === "video" ? !item.video : !item.href;
}

export function videoEmbedUrl(video: NonNullable<VaultItem["video"]>, autoplay = false) {
  return video.provider === "loom"
    ? `https://www.loom.com/embed/${video.id}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true${autoplay ? "&autoplay=1" : ""}`
    : `https://player.vimeo.com/video/${video.id}?badge=0&autopause=0&player_id=0&app_id=58479${autoplay ? "&autoplay=1" : ""}`;
}
