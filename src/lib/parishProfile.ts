// Scorecard v2: everything we can see about a parish from outside, gathered
// while they take the quiz. Server-only (uses APIFY_TOKEN and OPENAI_API_KEY).
//
// Steps (about a minute in all):
//   1. Find the website, Facebook, and Instagram (parishFinder.ts).
//   2. Pull the Facebook page (followers, address, ad status, linked
//      Instagram), the Instagram profile (followers), and recent posts from
//      both, in parallel.
//   3. Label each post with the rulebook's post types (OpenAI, from the
//      caption and the cover image).
//
// The rules that turn this into findings live in the Scorecard Diagnosis
// Rulebook (Joe-approved, 2026-11-08). Here we only collect facts and fill
// the quiz answers we no longer need to ask.

import { apifySearch, findParishPages, type ParishPages } from "@/lib/parishFinder";
import type { FollowerCount } from "@/lib/scorecard";

export type PostType = "homily_clip" | "value_video" | "activity" | "connection" | "flyer" | "filler";

export type ProfilePost = {
  platform: "facebook" | "instagram";
  url: string;
  date: string; // ISO
  isVideo: boolean;
  caption: string;
  likes: number;
  comments: number;
  type: PostType | null; // null when labeling failed
  hasClearNextStep: boolean | null; // flyers only
};

export type ParishProfile = {
  input: { name: string; city: string; state: string; email?: string };
  pages: ParishPages;
  facebook: { url: string; followers: number | null; address: string | null; runningAds: boolean | null } | null;
  instagram: { url: string; followers: number | null } | null;
  posts: ProfilePost[];
  fetchedAt: string;
};

const APIFY = "https://api.apify.com/v2/acts";
const POSTS_PER_PLATFORM = 12;
const LABEL_MODEL = "gpt-5.4-mini";

async function apify<T>(actor: string, input: unknown, token: string, timeoutMs = 120_000): Promise<T[]> {
  const res = await fetch(`${APIFY}/${actor}/run-sync-get-dataset-items`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`Apify ${actor} failed: ${res.status}`);
  return (await res.json()) as T[];
}

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const igHandle = (url: string) => url.replace(/\/+$/, "").split("/").pop() ?? "";

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// ---------------------------------------------------------------------------
// Pulling
// ---------------------------------------------------------------------------

type FbPage = {
  followers?: number;
  address?: string;
  ad_status?: string;
  instagram?: { username?: string; url?: string }[];
};
type FbPost = { url?: string; time?: string; isVideo?: boolean; text?: string; likes?: number; comments?: number; media?: { thumbnail?: string; photo_image?: { uri?: string } }[] };
type IgProfile = { username?: string; followersCount?: number };
type IgPost = { url?: string; timestamp?: string; type?: string; caption?: string; likesCount?: number; commentsCount?: number; displayUrl?: string };

type RawPost = Omit<ProfilePost, "type" | "hasClearNextStep"> & { image?: string };

async function pullFacebook(url: string, token: string) {
  const [page, posts] = await Promise.all([
    apify<FbPage>("apify~facebook-pages-scraper", { startUrls: [{ url }] }, token).then((r) => r[0] ?? null),
    apify<FbPost>("apify~facebook-posts-scraper", { startUrls: [{ url }], resultsLimit: POSTS_PER_PLATFORM }, token),
  ]);
  const raw: RawPost[] = posts.map((p) => ({
    platform: "facebook",
    url: p.url ?? url,
    date: p.time ?? "",
    isVideo: !!p.isVideo,
    caption: (p.text ?? "").slice(0, 1500),
    likes: num(p.likes),
    comments: num(p.comments),
    image: p.media?.[0]?.thumbnail ?? p.media?.[0]?.photo_image?.uri,
  }));
  return { page, posts: raw };
}

async function pullInstagram(url: string, token: string) {
  const handle = igHandle(url);
  const [profile, posts] = await Promise.all([
    apify<IgProfile>("apify~instagram-profile-scraper", { usernames: [handle] }, token).then((r) => r[0] ?? null),
    apify<IgPost>("apify~instagram-post-scraper", { username: [handle], resultsLimit: POSTS_PER_PLATFORM }, token),
  ]);
  const raw: RawPost[] = posts.map((p) => ({
    platform: "instagram",
    url: p.url ?? url,
    date: p.timestamp ?? "",
    isVideo: p.type === "Video",
    caption: (p.caption ?? "").slice(0, 1500),
    likes: num(p.likesCount),
    comments: num(p.commentsCount),
    image: p.displayUrl,
  }));
  return { profile, posts: raw };
}

// ---------------------------------------------------------------------------
// Labeling
// ---------------------------------------------------------------------------

const LABEL_SYSTEM = `You label Catholic parish social media posts. Pick exactly one type:
- homily_clip: a short video of a priest or deacon preaching, clipped from a homily or Mass.
- value_video: another helpful teaching video (talking to camera, podcast clip, explainer) that is not from a homily.
- activity: photos of parish life happening: events, groups, sacraments, volunteers, renovations. Shows real people or places doing things.
- connection: tells a story so people get to know the pastor, staff, a parishioner, or the parish (vocation story, history, staff intro). The story is usually in the caption.
- flyer: a graphic or post that asks people to do something: attend an event, register, volunteer, give, Mass times, schedule changes, announcements.
- filler: livestreamed Mass, saint quotes, generic Catholic graphics or memes, reposts that neither give real help nor ask for anything.
For flyers only, has_clear_next_step is true when it tells people exactly how to act (tap/click a link, sign up, register, RSVP, scan, DM a word, call a number). "Join us" with only a date and place is not a clear next step. For other types, use null.`;

const LABEL_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    type: { type: "string", enum: ["homily_clip", "value_video", "activity", "connection", "flyer", "filler"] },
    has_clear_next_step: { type: ["boolean", "null"] },
  },
  required: ["type", "has_clear_next_step"],
};

async function imageDataUrl(url?: string): Promise<string | null> {
  if (!url) return null;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (!r.ok) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length > 4_000_000) return null;
    return `data:${r.headers.get("content-type") ?? "image/jpeg"};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

async function labelPost(p: RawPost, key: string): Promise<Pick<ProfilePost, "type" | "hasClearNextStep">> {
  try {
    const img = await imageDataUrl(p.image);
    const content: unknown[] = [
      { type: "text", text: `Platform: ${p.platform}\nFormat: ${p.isVideo ? "video" : "photo or graphic"}\nCaption:\n${p.caption}` },
    ];
    if (img) content.push({ type: "image_url", image_url: { url: img, detail: "low" } });
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: LABEL_MODEL,
        messages: [
          { role: "system", content: LABEL_SYSTEM },
          { role: "user", content },
        ],
        response_format: { type: "json_schema", json_schema: { name: "post_label", strict: true, schema: LABEL_SCHEMA } },
      }),
      signal: AbortSignal.timeout(45_000),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}`);
    const j = (await res.json()) as { choices: { message: { content: string } }[] };
    const out = JSON.parse(j.choices[0].message.content) as { type: PostType; has_clear_next_step: boolean | null };
    return { type: out.type, hasClearNextStep: out.type === "flyer" ? out.has_clear_next_step : null };
  } catch (err) {
    console.error("Post label failed:", err);
    return { type: null, hasClearNextStep: null };
  }
}

// ---------------------------------------------------------------------------
// The whole lookup
// ---------------------------------------------------------------------------

export async function buildParishProfile(
  input: ParishProfile["input"],
  keys: { apify: string; openai: string },
): Promise<ParishProfile> {
  const pages = await findParishPages(input, apifySearch(keys.apify));

  // Only pull pages we're sure belong to this parish. A "likely" Facebook page
  // gets a chance to prove itself with its address below.
  const fbUrl = pages.facebook?.url;
  let igUrl = pages.instagram?.confidence === "confirmed" ? pages.instagram.url : undefined;

  const fb = fbUrl ? await pullFacebook(fbUrl, keys.apify).catch((err) => (console.error(err), null)) : null;

  let facebook: ParishProfile["facebook"] = null;
  if (fb && fbUrl) {
    const address = fb.page?.address ?? null;
    const inCity = !!address && ` ${norm(address)} `.includes(` ${norm(input.city)} `);
    const sure = pages.facebook?.confidence === "confirmed" || inCity;
    if (sure) {
      facebook = {
        url: fbUrl,
        followers: typeof fb.page?.followers === "number" ? fb.page.followers : null,
        address,
        runningAds: fb.page?.ad_status ? !/isn.t|not/i.test(fb.page.ad_status) : null,
      };
      pages.facebook = { url: fbUrl, confidence: "confirmed", source: pages.facebook?.source ?? "search" };
      // The confirmed Facebook page's own Instagram link settles Instagram.
      const linked = fb.page?.instagram?.[0]?.url;
      if (linked) {
        igUrl = linked;
        pages.instagram = { url: linked, confidence: "confirmed", source: "facebook page" };
      }
    } else {
      pages.notes.push("Facebook page found by search, but its address isn't in this city, so it was left out.");
    }
  }

  const ig = igUrl ? await pullInstagram(igUrl, keys.apify).catch((err) => (console.error(err), null)) : null;
  const instagram: ParishProfile["instagram"] =
    ig && igUrl ? { url: igUrl, followers: typeof ig.profile?.followersCount === "number" ? ig.profile.followersCount : null } : null;

  const raw = [...(facebook && fb ? fb.posts : []), ...(ig ? ig.posts : [])];
  const labels = await Promise.all(raw.map((p) => labelPost(p, keys.openai)));
  const posts: ProfilePost[] = raw.map((p, i) => {
    const post: ProfilePost & { image?: string } = { ...p, ...labels[i] };
    delete post.image;
    return post;
  });

  return { input, pages, facebook, instagram, posts, fetchedAt: new Date().toISOString() };
}

// ---------------------------------------------------------------------------
// Turning the profile into quiz answers
// ---------------------------------------------------------------------------

const DAY = 86_400_000;

// The platform with more recent posts speaks for the feed (most parishes post
// the same thing to both, so we don't add them together).
export function mainFeed(profile: ParishProfile, now = Date.now()) {
  const recent = (platform: ProfilePost["platform"]) =>
    profile.posts
      .filter((p) => p.platform === platform && Date.parse(p.date) > now - 28 * DAY)
      .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  const fb = recent("facebook");
  const ig = recent("instagram");
  const all = (platform: ProfilePost["platform"]) => profile.posts.filter((p) => p.platform === platform);
  const platform = fb.length >= ig.length ? "facebook" : "instagram";
  return { platform, recent: platform === "facebook" ? fb : ig, all: all(platform) } as const;
}

export type ProfileStats = {
  postsLast28Days: number;
  postsPerWeek: number;
  typicalEngagement: number | null; // median likes + comments
  counts: Record<PostType, number>; // across the main feed's pulled posts
  lastGivingVideo: string | null; // latest homily clip or teaching video, ISO
  flyersWithoutNextStep: number;
  labeled: number;
};

export function profileStats(profile: ParishProfile, now = Date.now()): ProfileStats {
  const feed = mainFeed(profile, now);
  const counts: Record<PostType, number> = { homily_clip: 0, value_video: 0, activity: 0, connection: 0, flyer: 0, filler: 0 };
  for (const p of feed.all) if (p.type) counts[p.type]++;
  const engagement = feed.all.map((p) => p.likes + p.comments).sort((a, b) => a - b);
  const giving = profile.posts
    .filter((p) => p.type === "homily_clip" || p.type === "value_video")
    .map((p) => p.date)
    .sort()
    .pop();
  // When every pulled post is from the last 28 days, the parish posts more
  // than we pulled, so measure the pace over the span those posts cover.
  const oldest = Math.min(...feed.recent.map((p) => Date.parse(p.date)));
  const spanWeeks =
    feed.recent.length && feed.recent.length === feed.all.length ? Math.max(1, (now - oldest) / (7 * DAY)) : 4;
  return {
    postsLast28Days: feed.recent.length,
    postsPerWeek: feed.recent.length / spanWeeks,
    typicalEngagement: engagement.length ? engagement[Math.floor(engagement.length / 2)] : null,
    counts,
    lastGivingVideo: giving ?? null,
    flyersWithoutNextStep: feed.all.filter((p) => p.type === "flyer" && p.hasClearNextStep === false).length,
    labeled: feed.all.filter((p) => p.type).length,
  };
}

// Quiz answers we can fill from the profile. Anything we can't stand behind
// is left out, so the quiz asks it as usual.
export type DerivedAnswers = Partial<{
  fbFollowers: FollowerCount;
  igFollowers: FollowerCount;
  engagement: string;
  frequency: string;
  mainContent: string;
}>;

export function deriveAnswers(profile: ParishProfile, now = Date.now()): DerivedAnswers {
  const out: DerivedAnswers = {};
  if (profile.facebook?.followers != null) out.fbFollowers = profile.facebook.followers;
  if (profile.instagram?.followers != null) out.igFollowers = profile.instagram.followers;
  // A confirmed Facebook page that links no Instagram, on a site that links
  // none either, almost always means there isn't one.
  if (out.igFollowers === undefined && profile.facebook && !profile.pages.instagram) out.igFollowers = "none";

  const s = profileStats(profile, now);
  if (s.labeled >= 4) {
    const e = s.typicalEngagement;
    if (e !== null) out.engagement = e <= 5 ? "0-5" : e <= 20 ? "6-20" : e <= 50 ? "21-50" : e <= 100 ? "51-100" : "100+";
    const w = s.postsPerWeek;
    out.frequency = w < 0.75 ? "rarely" : w < 1.75 ? "weekly" : w < 4.5 ? "few" : "daily";
    const groups = {
      value: s.counts.homily_clip + s.counts.value_video,
      connection: s.counts.connection,
      activity: s.counts.activity,
      flyers: s.counts.flyer,
    };
    // Flyers only win outright; on a tie the feed isn't "mostly flyers".
    const order = ["value", "connection", "activity", "flyers"] as const;
    out.mainContent = order.reduce((best, k) => (groups[k] > groups[best] ? k : best), order[0]);
  }
  return out;
}

// Short summary for Joe's lead notification.
export function profileToText(profile: ParishProfile, now = Date.now()): string {
  const s = profileStats(profile, now);
  const lines = [
    `Website: ${profile.pages.website?.url ?? "not found"}`,
    `Facebook: ${profile.facebook ? `${profile.facebook.url} (${profile.facebook.followers ?? "?"} followers${profile.facebook.runningAds === null ? "" : profile.facebook.runningAds ? ", running ads now" : ", no ads running now"})` : "not found"}`,
    `Instagram: ${profile.instagram ? `${profile.instagram.url} (${profile.instagram.followers ?? "?"} followers)` : "not found"}`,
  ];
  if (s.labeled) {
    lines.push(
      `Posts in the last 28 days: ${s.postsLast28Days}`,
      `Recent posts: ${Object.entries(s.counts)
        .filter(([, n]) => n)
        .map(([k, n]) => `${n} ${k.replace("_", " ")}`)
        .join(", ")}`,
      `Last homily clip or teaching video: ${s.lastGivingVideo ? s.lastGivingVideo.slice(0, 10) : "none found"}`,
      `Flyers without a clear next step: ${s.flyersWithoutNextStep}`,
    );
  }
  if (profile.pages.notes.length) lines.push(...profile.pages.notes.map((n) => `Note: ${n}`));
  return lines.join("\n");
}
