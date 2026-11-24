// Storage for the Parish Flyer Library: flyer templates, parish access codes,
// and thumbnail images, kept as files in one data folder.
//
// - Production (Railway): the folder lives on the service's volume, so it
//   survives redeploys. Railway sets RAILWAY_VOLUME_MOUNT_PATH once a volume
//   is attached. Without a volume, changes are lost on the next deploy.
// - Local dev: ./.data/flyers (gitignored).
//
// Railway runs one long-lived server, so a simple in-process write queue is
// enough to keep writes from overlapping. To move to a real database later,
// only this file needs to change.

import { randomBytes } from "crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import type { FlyerTemplate } from "@/data/flyers";

export const dataDir =
  process.env.FLYER_DATA_DIR ??
  (process.env.RAILWAY_VOLUME_MOUNT_PATH
    ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, "flyers")
    : path.join(process.cwd(), ".data", "flyers"));

// True when running in production without a volume (data would not persist).
export const storageIsTemporary =
  process.env.NODE_ENV === "production" && !process.env.FLYER_DATA_DIR && !process.env.RAILWAY_VOLUME_MOUNT_PATH;

const thumbsDir = path.join(dataDir, "thumbs");
const templatesFile = path.join(dataDir, "templates.json");
const codesFile = path.join(dataDir, "codes.json");

export type StoredTemplate = FlyerTemplate & { createdAt: string; updatedAt: string };

export type AccessCode = {
  code: string;
  parish: string;
  active: boolean;
  createdAt: string;
  lastVisitAt?: string;
  visits: number;
};

// ---- write queue ----------------------------------------------------------

let queue: Promise<unknown> = Promise.resolve();
function serialized<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}

async function writeJson(file: string, data: unknown) {
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${randomBytes(4).toString("hex")}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2));
  await rename(tmp, file);
}

// ---- thumbnails -----------------------------------------------------------

// Resizes any image to a 4:5 WebP and saves it. Returns its public URL.
// File names carry a random suffix so browsers can cache them forever.
export async function saveThumbnail(id: string, image: Buffer): Promise<string> {
  const webp = await sharp(image).resize(800, 1000, { fit: "cover", position: "top" }).webp({ quality: 82 }).toBuffer();
  await mkdir(thumbsDir, { recursive: true });
  const name = `${id}-${randomBytes(3).toString("hex")}.webp`;
  await writeFile(path.join(thumbsDir, name), webp);
  return `/flyers/thumbs/${name}`;
}

export async function readThumbnail(name: string): Promise<Buffer | null> {
  if (!/^[a-z0-9-]+\.webp$/.test(name)) return null;
  try {
    return await readFile(path.join(thumbsDir, name));
  } catch {
    return null;
  }
}

async function deleteThumbnail(url?: string) {
  const name = url?.startsWith("/flyers/thumbs/") ? url.slice("/flyers/thumbs/".length) : null;
  if (name && /^[a-z0-9-]+\.webp$/.test(name)) await unlink(path.join(thumbsDir, name)).catch(() => {});
}

// ---- templates ------------------------------------------------------------

// First run: start the library with the first real design (Young Adult Bus Trip).
async function seedTemplates(): Promise<StoredTemplate[]> {
  const now = new Date().toISOString();
  const seed: StoredTemplate[] = [];
  try {
    const png = await readFile(path.join(process.cwd(), "public", "flyers", "young-adult-bus-trip.png"));
    const id = "young-adult-trip-bus-trip";
    seed.push({
      id,
      event: "Young Adult Trip",
      designName: "Bus Trip",
      description: "A day trip for young adults, with schedule, price, and sign-up.",
      category: "Youth & Families",
      keywords: ["young adults", "young adult ministry", "bus trip", "trip", "pilgrimage", "outing", "day trip", "excursion"],
      // TODO: swap for the design's Canva template link (this one is view-only).
      canvaUrl: "https://www.canva.com/design/DAHaElFLrbs/45LZRwN6oAZSRL1J6HxDNg/view",
      thumbnail: await saveThumbnail(id, png),
      createdAt: now,
      updatedAt: now,
    });
  } catch {
    // No seed image available; start empty.
  }
  await writeJson(templatesFile, seed);
  return seed;
}

export async function listTemplates(): Promise<StoredTemplate[]> {
  const stored = await readJson<StoredTemplate[]>(templatesFile);
  return stored ?? serialized(async () => (await readJson<StoredTemplate[]>(templatesFile)) ?? seedTemplates());
}

export function newTemplateId(event: string, designName: string) {
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${slug(event)}-${slug(designName)}`.slice(0, 60).replace(/-$/, "") + "-" + randomBytes(2).toString("hex");
}

// Adds or replaces a template (matched by id). Deletes a replaced thumbnail.
export function upsertTemplate(t: StoredTemplate) {
  return serialized(async () => {
    const all = (await readJson<StoredTemplate[]>(templatesFile)) ?? [];
    const i = all.findIndex((x) => x.id === t.id);
    if (i >= 0) {
      if (all[i].thumbnail !== t.thumbnail) await deleteThumbnail(all[i].thumbnail);
      all[i] = t;
    } else {
      all.unshift(t);
    }
    await writeJson(templatesFile, all);
  });
}

export function deleteTemplate(id: string) {
  return serialized(async () => {
    const all = (await readJson<StoredTemplate[]>(templatesFile)) ?? [];
    const t = all.find((x) => x.id === id);
    if (!t) return;
    await deleteThumbnail(t.thumbnail);
    await writeJson(templatesFile, all.filter((x) => x.id !== id));
  });
}

// ---- access codes ---------------------------------------------------------

export const normalizeCode = (c: string) => c.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");

export async function listCodes(): Promise<AccessCode[]> {
  return (await readJson<AccessCode[]>(codesFile)) ?? [];
}

export async function findCode(code: string): Promise<AccessCode | null> {
  const c = normalizeCode(code);
  return (await listCodes()).find((x) => x.code === c) ?? null;
}

// e.g. "St. Mary in the Mountains" -> "STMARY-4821"
function generateCode(parish: string, taken: Set<string>) {
  const words = parish.toUpperCase().replace(/[^A-Z ]/g, "").split(/\s+/).filter(Boolean);
  const base = (words.slice(0, 2).join("") || "PARISH").slice(0, 10);
  for (;;) {
    const code = `${base}-${1000 + (randomBytes(2).readUInt16BE() % 9000)}`;
    if (!taken.has(code)) return code;
  }
}

export function addCode(parish: string, wanted?: string) {
  return serialized(async () => {
    const all = await listCodes();
    const taken = new Set(all.map((c) => c.code));
    const code = wanted ? normalizeCode(wanted) : generateCode(parish, taken);
    if (!code) throw new Error("That code is empty.");
    if (taken.has(code)) throw new Error(`The code ${code} is already in use.`);
    const entry: AccessCode = { code, parish: parish.trim(), active: true, createdAt: new Date().toISOString(), visits: 0 };
    await writeJson(codesFile, [entry, ...all]);
    return entry;
  });
}

export function updateCode(code: string, change: (c: AccessCode) => AccessCode | null) {
  return serialized(async () => {
    const all = await listCodes();
    const next = all.flatMap((c) => (c.code === code ? (change(c) ?? []) : [c]));
    await writeJson(codesFile, next);
  });
}

// Counts a visit, at most once every 30 minutes per code.
export async function recordVisit(code: string) {
  const c = await findCode(code);
  if (!c) return;
  const last = c.lastVisitAt ? Date.parse(c.lastVisitAt) : 0;
  if (Date.now() - last < 30 * 60 * 1000) return;
  await updateCode(c.code, (x) => ({ ...x, visits: x.visits + 1, lastVisitAt: new Date().toISOString() }));
}
