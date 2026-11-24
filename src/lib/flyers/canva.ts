// Reads a Canva share link: works out the design, its title, and its preview
// image, so the admin only has to paste a link.
//
// Tested 2026-11-23: canva.link short links redirect to
// canva.com/design/<id>/<token>/<mode>. Canva's oEmbed endpoint gives the title,
// and <design>/screen gives a 1024x1280 PNG. Canva blocks requests without a
// browser User-Agent.

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";

const isCanvaHost = (host: string) => host === "canva.link" || host === "canva.com" || host.endsWith(".canva.com");

export class CanvaLinkError extends Error {}

export type CanvaDesign = { title: string; viewUrl: string; image: Buffer };

export async function readCanvaLink(link: string): Promise<CanvaDesign> {
  let url: URL;
  try {
    url = new URL(link.trim().startsWith("http") ? link.trim() : `https://${link.trim()}`);
  } catch {
    throw new CanvaLinkError("That doesn't look like a link. Copy it from Canva and paste it again.");
  }
  if (!isCanvaHost(url.hostname)) throw new CanvaLinkError("That isn't a Canva link.");

  // Follow short links to the real design address.
  let final = url;
  if (url.hostname === "canva.link") {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow", signal: AbortSignal.timeout(15000) });
    final = new URL(res.url);
    if (!isCanvaHost(final.hostname)) throw new CanvaLinkError("That link doesn't lead to a Canva design.");
  }

  const m = final.pathname.match(/^\/design\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+)(?:\/([a-z]+))?/);
  if (!m) throw new CanvaLinkError("Couldn't find a design in that link. Use the design's Template link.");
  const [, id, token, mode] = m;
  if (mode === "edit") {
    throw new CanvaLinkError(
      "That's an edit link: anyone who opens it could change your original design. In Canva, use Share > More > Template link instead.",
    );
  }

  const design = `https://www.canva.com/design/${id}/${token}`;
  const viewUrl = `${design}/view`;

  let title = "";
  try {
    const o = await fetch(`https://www.canva.com/_oembed?url=${encodeURIComponent(viewUrl)}&format=json`, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(15000),
    });
    if (o.ok) title = String((await o.json()).title ?? "");
  } catch {
    // Title is a nice-to-have.
  }

  // 1. Full-size image (1024x1280). Canva sometimes refuses this from cloud
  //    servers (seen on Railway 2026-11-24) even though it works from a PC.
  const full = await fetchImage(`${design}/screen`, "screen");
  if (full) return { title, viewUrl, image: full };

  // 2. Fallback: the design's view page loads fine from Railway and contains a
  //    signed 400x500 preview on media.canva.com. Smaller, but good enough for
  //    a card. (The size is part of the signature, so it can't be enlarged.)
  const small = await previewFromViewPage(viewUrl);
  if (small) return { title, viewUrl, image: small };

  throw new CanvaLinkError("Couldn't get the design's image from Canva. Check that the link is shared, then try again.");
}

async function fetchImage(url: string, label: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
    const type = res.headers.get("content-type") ?? "";
    if (res.ok && type.startsWith("image/")) return Buffer.from(await res.arrayBuffer());
    const body = (await res.text().catch(() => "")).slice(0, 200).replace(/\s+/g, " ");
    console.warn(`[flyers] Canva ${label} image refused: ${res.status} ${type} (final ${res.url}) ${body}`);
  } catch (e) {
    console.warn(`[flyers] Canva ${label} image failed:`, e);
  }
  return null;
}

async function previewFromViewPage(viewUrl: string): Promise<Buffer | null> {
  try {
    const res = await fetch(viewUrl, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
    const html = await res.text();
    const m = html.match(/https:(?:\\\/|\/){2}media\.canva\.com(?:\\\/|\/)v2(?:\\\/|\/)document-image[^"'\s<>]+/);
    if (!m) {
      console.warn(`[flyers] Canva view page had no preview image (status ${res.status}).`);
      return null;
    }
    const url = m[0].replace(/\\\//g, "/").replace(/\\u0026/g, "&").replace(/&amp;/g, "&");
    return await fetchImage(url, "preview");
  } catch (e) {
    console.warn("[flyers] Canva view page failed:", e);
    return null;
  }
}
