// Scorecard v2: find a parish's website, Facebook, and Instagram from what the
// opt-in form already gives us (parish name, city, state, email). We never ask
// for links.
//
// Order:
//   1. The email domain, when it isn't a free email provider or a diocese.
//   2. Otherwise, the top Google results for "<parish> <city> <state>".
//   3. A website only counts as "confirmed" when its homepage mentions both the
//      city and a distinctive word from the parish name ("Monica", "Rose").
//   4. Facebook and Instagram are "confirmed" when that website links to them,
//      "likely" when a search result titled with the parish name and city
//      points to them.
//
// The letter may only say "we looked up your pages" about confirmed pages.
//
// Self-contained (no "@/" imports) so scripts can run it with plain Node.

export type Confidence = "confirmed" | "likely";
export type Found = { url: string; confidence: Confidence; source: string };

export type ParishPages = {
  website?: Found;
  facebook?: Found;
  instagram?: Found;
  notes: string[];
};

export type ParishInput = { name: string; city: string; state: string; email?: string };

export type SearchResult = { url: string; title: string };
export type SearchFn = (query: string) => Promise<SearchResult[]>;

const FREE_EMAIL = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "ymail.com", "hotmail.com", "outlook.com",
  "live.com", "msn.com", "aol.com", "icloud.com", "me.com", "mac.com", "comcast.net",
  "att.net", "sbcglobal.net", "verizon.net", "cox.net", "charter.net", "protonmail.com",
  "proton.me", "bellsouth.net", "earthlink.net", "frontier.com", "q.com", "mail.com",
]);

// Sites that list parishes but aren't the parish's own site.
const NOT_PARISH_SITES = [
  "facebook.com", "instagram.com", "youtube.com", "twitter.com", "x.com", "linkedin.com",
  "tiktok.com", "discovermass.com", "masstimes.org", "yelp.com", "wikipedia.org",
  "mapquest.com", "tripadvisor.com", "flocknote.com", "catholic.org", "usccb.org",
  "legacy.com", "findagrave.com", "google.com", "apple.com", "nextdoor.com",
  "churchfinder.com", "faithstreet.com", "yellowpages.com", "bbb.org", "manta.com",
  "patch.com", "eventbrite.com", "simplyhired.com", "indeed.com", "glassdoor.com",
  "givelify.com", "pushpay.com", "osvhub.com", "wearesparkhouse.com", "parishesonline.com",
  "catholicconnect.io", "millionsofmonicas.com", "visitindy.com", "downtownindy.org",
];

const GENERIC_NAME_WORDS = new Set([
  "st", "sts", "ss", "saint", "saints", "san", "santa", "catholic", "church", "parish",
  "parishes", "of", "the", "and", "family", "community", "roman", "rc", "chapel", "shrine",
  "basilica", "cathedral", "newman", "center", "centre", "our", "lady", "holy", "blessed",
  "mother", "in", "at", "de", "la", "del", "los", "las", "s",
]);

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// "St. Patrick's Catholic Church" → ["patricks", "patrick"]. Falls back to the
// generic words when the name is all generic ("Our Lady of the Saints" → "saints").
export function distinctiveWords(name: string): string[] {
  const words = norm(name).split(" ").filter(Boolean);
  let keep = words.filter((w) => !GENERIC_NAME_WORDS.has(w) && w.length > 2);
  if (keep.length === 0) keep = words.filter((w) => !["st", "of", "the", "and", "catholic", "church", "parish"].includes(w));
  const out = new Set<string>();
  for (const w of keep) {
    out.add(w);
    if (w.endsWith("s") && w.length > 4) out.add(w.slice(0, -1)); // patricks → patrick
  }
  return [...out];
}

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
};

const isListingSite = (host: string) => NOT_PARISH_SITES.some((d) => host === d || host.endsWith("." + d));
const isDioceseHost = (host: string) => /dioc|^arch[a-z]*\./.test(host);

export type FetchHtml = (url: string) => Promise<string | "blocked" | null>;

const BOT_WALL = /<title>\s*(just a moment|attention required|access denied|please wait)/i;

// Plain fetch. Returns "blocked" for a bot check (Cloudflare's "Just a
// moment…", or a 403/503) and null for anything else that fails. Blocked
// sites are never worked around; the finder uses search results instead.
export async function plainFetch(url: string, timeoutMs = 12000): Promise<string | "blocked" | null> {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (res.status === 403 || res.status === 503) return "blocked";
    if (!res.ok) return null;
    if (!(res.headers.get("content-type") ?? "").includes("html")) return null;
    const html = (await res.text()).slice(0, 2_000_000);
    return BOT_WALL.test(html) ? "blocked" : html;
  } catch {
    return null;
  }
}

// Fetch a page. Returns "blocked" when the site has a bot check, so the
// caller can fall back to search results instead of the page itself.
export const defaultFetch: FetchHtml = plainFetch;

const visibleText = (html: string) =>
  norm(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;|&#160;/g, " ")
      .replace(/&amp;/g, "&"),
  );

// Facebook page URL from any facebook.com link: page, post, photo, or profile.php.
export function facebookPage(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (!/(^|\.)facebook\.com$/.test(u.hostname)) return null;
  const parts = u.pathname.split("/").filter(Boolean);
  if (parts[0] === "profile.php") {
    const id = u.searchParams.get("id");
    return id ? `https://www.facebook.com/profile.php?id=${id}` : null;
  }
  if (parts[0] === "people" && parts[2]) return `https://www.facebook.com/${parts[2]}`;
  if (parts[0] === "p" && parts[1]) return `https://www.facebook.com/p/${parts[1]}`;
  if (parts[0] === "pages" && parts.length >= 3) return `https://www.facebook.com/${parts.slice(0, 3).join("/")}`;
  const bad = ["sharer", "sharer.php", "share", "share.php", "plugins", "dialog", "tr", "groups", "events", "watch", "login", "hashtag", "story.php", "permalink.php", "photo.php", "photo", "photos", "reel", "help", "policies", "privacy", "l.php", "home.php", "business", "ads", "media", "marketplace", "gaming", "fundraisers", "public", "fb-answers", "messages", "notes", "video.php", "reels"];
  if (!parts[0] || bad.includes(parts[0].toLowerCase())) return null;
  return `https://www.facebook.com/${parts[0]}`;
}

export function instagramProfile(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (!/(^|\.)instagram\.com$/.test(u.hostname)) return null;
  const first = u.pathname.split("/").filter(Boolean)[0];
  const bad = ["p", "reel", "reels", "explore", "stories", "accounts", "tv", "about", "developer", "legal", "direct", "share"];
  if (!first || bad.includes(first.toLowerCase())) return null;
  return `https://www.instagram.com/${first.toLowerCase()}`;
}

// Every Facebook page / Instagram profile linked on a page, with how often.
function socialLinks(html: string) {
  const hrefs = [...html.matchAll(/https?:\/\/(?:[a-z0-9-]+\.)?(?:facebook|instagram)\.com\/[^"'\s<>)]+/gi)].map((m) =>
    m[0].replace(/&amp;/g, "&"),
  );
  const tally = (urls: (string | null)[]) => {
    const c = new Map<string, number>();
    for (const u of urls) if (u) c.set(u, (c.get(u) ?? 0) + 1);
    return c;
  };
  return { facebook: tally(hrefs.map(facebookPage)), instagram: tally(hrefs.map(instagramProfile)) };
}

// Accounts that belong to a school, ministry, or diocese, not the parish itself.
const SIDE_ACCOUNT =
  /school|academy|preschool|youth|teen|youngadult|young_adult|_ya$|^ya_|music|choir|knights|kofc|ministr|religiouse|faithformation|dioc|^arch|answers|foundation|cemetery|thrift|festival|bingo/;

const handleOf = (url: string) =>
  norm(url.replace(/^https?:\/\/(www\.)?(facebook|instagram)\.com\/(p\/|people\/)?/i, "").split(/[/?]/)[0]).replace(/ /g, "");

// Pick the parish's main account from the site's links plus search results.
function pickAccount(
  fromSite: Map<string, number>,
  fromSearch: string[],
  fromWeakSearch: string[],
  words: string[],
  siteHost: string,
): { url: string; viaSite: boolean } | undefined {
  const stem = siteHost.split(".")[0].replace(/[^a-z0-9]/g, "");
  const all = new Set([...fromSite.keys(), ...fromSearch, ...fromWeakSearch]);
  let best: { url: string; score: number; viaSite: boolean } | undefined;
  for (const url of all) {
    const h = handleOf(url);
    if (SIDE_ACCOUNT.test(h)) continue;
    let score = fromSite.get(url) ?? 0;
    if (fromSearch.includes(url)) score += 3;
    else if (fromWeakSearch.includes(url)) score += 1;
    if (stem && (h.includes(stem) || stem.includes(h))) score += 2;
    if (words.some((w) => h.includes(w))) score += 1;
    if (!best || score > best.score) best = { url, score, viaSite: fromSite.has(url) };
  }
  return best && best.score > 0 ? { url: best.url, viaSite: best.viaSite } : undefined;
}

type SiteCheck = { url: string; html: string };

const pageTitle = (html: string) => norm((html.match(/<title[^>]*>([^<]*)/i)?.[1] ?? "").replace(/&amp;/g, "&"));

const STATE_NAMES: Record<string, string> = {
  AL: "alabama", AK: "alaska", AZ: "arizona", AR: "arkansas", CA: "california", CO: "colorado",
  CT: "connecticut", DE: "delaware", DC: "district of columbia", FL: "florida", GA: "georgia",
  HI: "hawaii", ID: "idaho", IL: "illinois", IN: "indiana", IA: "iowa", KS: "kansas",
  KY: "kentucky", LA: "louisiana", ME: "maine", MD: "maryland", MA: "massachusetts",
  MI: "michigan", MN: "minnesota", MS: "mississippi", MO: "missouri", MT: "montana",
  NE: "nebraska", NV: "nevada", NH: "new hampshire", NJ: "new jersey", NM: "new mexico",
  NY: "new york", NC: "north carolina", ND: "north dakota", OH: "ohio", OK: "oklahoma",
  OR: "oregon", PA: "pennsylvania", RI: "rhode island", SC: "south carolina", SD: "south dakota",
  TN: "tennessee", TX: "texas", UT: "utah", VT: "vermont", VA: "virginia", WA: "washington",
  WV: "west virginia", WI: "wisconsin", WY: "wyoming",
};

// Name and city tests for one parish. Text passed in is already norm()'d.
type Matcher = {
  words: string[];
  hasName: (text: string) => boolean;
  hasCity: (text: string) => boolean;
  nameInHost: (host: string) => boolean;
};

function makeMatcher(input: ParishInput): Matcher {
  const words = distinctiveWords(input.name);
  const city = norm(input.city);
  const state = input.state.toUpperCase();
  // "Our Lady of Mount Carmel" in Carmel, IN: "carmel" alone proves nothing,
  // so require "carmel in" / "carmel indiana".
  const cityInName = ` ${norm(input.name)} `.includes(` ${city} `);
  const cityForms = cityInName
    ? [`${city} ${state.toLowerCase()}`, `${city} ${STATE_NAMES[state] ?? "~"}`]
    : [city];
  const pad = (t: string) => ` ${t} `;
  return {
    words,
    hasName: (t) => words.some((w) => pad(t).includes(` ${w} `) || pad(t).includes(` ${w}s `)),
    hasCity: (t) => cityForms.some((c) => pad(t).includes(` ${c} `)),
    nameInHost: (host) => words.some((w) => w.length >= 4 && host.replace(/[^a-z0-9]/g, "").includes(w)),
  };
}

// What the search result itself says about a site.
type ResultHint = { titleOk: boolean; isHomepage: boolean };

const isHomepageUrl = (url: string) => {
  try {
    const u = new URL(url);
    return u.pathname === "/" || u.pathname === "" || /^\/(index|home)(\.[a-z]+)?\/?$/i.test(u.pathname);
  } catch {
    return false;
  }
};

// A site is the parish's when:
// - its address or page title carries the parish name (directory and tourism
//   pages mention parishes in the body, not their own title), or Google lists
//   the site's homepage under a title naming the parish and city; and
// - the city shows up on the page or in that search title.
// A site with a bot check is never worked around: it only counts when the
// search result alone is convincing.
async function checkSite(
  url: string,
  m: Matcher,
  fetchHtml: FetchHtml,
  hint?: ResultHint,
): Promise<{ check: SiteCheck; confidence: Confidence } | null> {
  const html = await fetchHtml(url);
  const host = hostOf(url);
  const strongResult = !!hint?.titleOk && (hint.isHomepage || m.nameInHost(host));
  if (html === "blocked") {
    return strongResult ? { check: { url, html: "" }, confidence: "confirmed" } : null;
  }
  if (!html) return null;
  const title = pageTitle(html);
  const body = visibleText(html);
  const named = m.hasName(title) || m.nameInHost(host) || (strongResult && m.hasName(body));
  if (!named) return null;
  const inCity = m.hasCity(body) || m.hasCity(title) || !!hint?.titleOk;
  return { check: { url, html }, confidence: inCity ? "confirmed" : "likely" };
}

const origin = (url: string) => {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
};

export async function findParishPages(
  input: ParishInput,
  search: SearchFn,
  fetchHtml: FetchHtml = defaultFetch,
): Promise<ParishPages> {
  const notes: string[] = [];
  const m = makeMatcher(input);
  const words = m.words;
  const pages: ParishPages = { notes };
  const titleHas = (title: string) => {
    const t = norm(title);
    return { name: m.hasName(t), city: m.hasCity(t) };
  };

  // 1. Email domain
  const domain = (input.email ?? "").split("@")[1]?.toLowerCase().trim();
  let site: SiteCheck | null = null;
  if (domain && !FREE_EMAIL.has(domain)) {
    if (isDioceseHost(domain)) {
      notes.push(`Email domain ${domain} looks like a diocese, so it was skipped.`);
    } else {
      const hit = await checkSite(`https://${domain}`, m, fetchHtml);
      if (hit) {
        site = hit.check;
        pages.website = { url: origin(hit.check.url), confidence: hit.confidence, source: "email domain" };
      } else {
        notes.push(`Email domain ${domain} didn't look like the parish's site.`);
      }
    }
  }

  // 2. Google search. Only a confirmed site counts here: a site that names
  //    the parish but never the city is often a same-named parish elsewhere.
  const results = await search(`${input.name} ${input.city} ${input.state}`);

  if (!site) {
    const tried = new Set<string>();
    for (const r of results) {
      const host = hostOf(r.url);
      if (!host || tried.has(host) || isListingSite(host) || isDioceseHost(host)) continue;
      tried.add(host);
      const t = titleHas(r.title);
      const hit = await checkSite(`https://${host}`, m, fetchHtml, {
        titleOk: t.name && t.city,
        isHomepage: isHomepageUrl(r.url),
      });
      if (hit?.confidence === "confirmed") {
        site = hit.check;
        pages.website = { url: origin(hit.check.url), confidence: "confirmed", source: "search" };
        break;
      }
      if (tried.size >= 4) break; // only the top few sites are worth checking
    }
    if (!site) notes.push("No website found that clearly belongs to this parish in this city.");
  }

  // 3. Facebook and Instagram: the site's links plus search results. Results
  //    titled with the parish name and city count fully; results titled with
  //    just the name count only when the handle carries the name too.
  const strong = results.filter((r) => {
    const t = titleHas(r.title);
    return t.name && t.city;
  });
  const weak = results.filter((r) => titleHas(r.title).name && !strong.includes(r));
  const fromResults = (list: SearchResult[], pick: (u: string) => string | null, handleNeedsName: boolean) =>
    list
      .map((r) => pick(r.url))
      .filter((u): u is string => !!u && (!handleNeedsName || m.nameInHost(handleOf(u))));
  const searchFb = fromResults(strong, facebookPage, false);
  const searchIg = fromResults(strong, instagramProfile, false);
  const weakFb = fromResults(weak, facebookPage, true);
  const weakIg = fromResults(weak, instagramProfile, true);
  const links = site ? socialLinks(site.html) : { facebook: new Map<string, number>(), instagram: new Map<string, number>() };
  const siteHost = site ? hostOf(site.url) : "";
  const siteSure = pages.website?.confidence === "confirmed";
  const stem = siteHost.split(".")[0].replace(/[^a-z0-9]/g, "");
  // A search-only account counts as confirmed when the parish's confirmed site
  // and the account share a name (stjohnsindy.org ↔ facebook.com/stjohnsindy).
  const matchesSite = (url: string) => {
    const h = handleOf(url);
    return siteSure && !!stem && (h === stem || h.includes(stem) || stem.includes(h));
  };

  // An account found only through a weak (name-only) search result is too
  // often a same-named parish elsewhere; keep it only when it matches the site.
  const tooWeak = (a: { url: string; viaSite: boolean }, strongList: string[]) =>
    !a.viaSite && !strongList.includes(a.url) && !matchesSite(a.url);

  const fb = pickAccount(links.facebook, searchFb, weakFb, words, siteHost);
  if (fb && !tooWeak(fb, searchFb)) {
    pages.facebook = {
      url: fb.url,
      confidence: (fb.viaSite && siteSure) || (fb.viaSite && searchFb.includes(fb.url)) || matchesSite(fb.url) ? "confirmed" : "likely",
      source: fb.viaSite ? "parish website" : "search",
    };
  }
  const ig = pickAccount(links.instagram, searchIg, weakIg, words, siteHost);
  if (ig && !tooWeak(ig, searchIg)) {
    pages.instagram = {
      url: ig.url,
      confidence: (ig.viaSite && siteSure) || (ig.viaSite && searchIg.includes(ig.url)) || matchesSite(ig.url) ? "confirmed" : "likely",
      source: ig.viaSite ? "parish website" : "search",
    };
  }

  return pages;
}

// Google search through Apify. One query per call; ~30s.
export function apifySearch(token: string): SearchFn {
  return async (query) => {
    const res = await fetch(
      "https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ queries: query, maxPagesPerQuery: 1, resultsPerPage: 10, countryCode: "us" }),
        signal: AbortSignal.timeout(120_000),
      },
    );
    if (!res.ok) throw new Error(`Apify search failed: ${res.status}`);
    const items = (await res.json()) as { organicResults?: SearchResult[] }[];
    return (items[0]?.organicResults ?? []).map((r) => ({ url: r.url, title: r.title }));
  };
}
