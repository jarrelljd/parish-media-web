// Everything in The Vault (/vault). To add a resource, add one object here.
//
// - kind "book" / "link": clicking the card goes to `href` (internal page or
//   external URL).
// - kind "video": gets its own page at /vault/<slug> with the video embedded.
//   Set `video` to a Vimeo or Loom ID (the last part of the share link).
//   It plays right inside the open vault. `thumbnail` and `duration` are
//   optional (for Loom, get the thumbnail from
//   https://www.loom.com/v1/oembed?url=<share link>).
//   Leave `video` out to show the card as "Coming Soon".

export type VaultItem = {
  slug: string;
  kind: "book" | "video" | "link";
  title: string;
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
};

// The vaults, in the order they show on the page. A vault with no items
// shows as sealed.
export const vaultSections = [
  {
    id: "start-here",
    title: "Start Here",
  },
  {
    id: "social-media",
    title: "Engage",
  },
  {
    id: "ads",
    title: "Grow",
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
    href: "/free-guide",
    image: "/images/free-guide/book-cover.jpg",
    cta: "Get the Book",
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
    title: "Upgrading Your Parish Flyers",
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
  return item.kind === "video" ? `/vault/${item.slug}` : (item.href ?? "#");
}

export function isComingSoon(item: VaultItem) {
  return item.kind === "video" ? !item.video : !item.href;
}

export function videoEmbedUrl(video: NonNullable<VaultItem["video"]>, autoplay = false) {
  return video.provider === "loom"
    ? `https://www.loom.com/embed/${video.id}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true${autoplay ? "&autoplay=1" : ""}`
    : `https://player.vimeo.com/video/${video.id}?badge=0&autopause=0&player_id=0&app_id=58479${autoplay ? "&autoplay=1" : ""}`;
}
