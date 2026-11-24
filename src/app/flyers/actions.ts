"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { flyerCategories, type FlyerCategory } from "@/data/flyers";
import {
  endAdminSession,
  isAdmin,
  passwordMatches,
  rememberParish,
  startAdminSession,
  tooManyAttempts,
} from "@/lib/flyers/auth";
import { CanvaLinkError, readCanvaLink } from "@/lib/flyers/canva";
import {
  addCode,
  deleteTemplate,
  findCode,
  listTemplates,
  newTemplateId,
  saveThumbnail,
  updateCode,
  upsertTemplate,
} from "@/lib/flyers/store";

export type FormState = { error?: string; message?: string };

async function visitor() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || "local";
}

function refresh() {
  revalidatePath("/flyers");
  revalidatePath("/flyers/admin");
}

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Please sign in again.");
}

const linkError = (e: unknown) =>
  e instanceof CanvaLinkError ? e.message : "Couldn't reach Canva just now. Try again in a minute.";

// ---- parish access --------------------------------------------------------

export async function enterAccessCode(_: FormState, form: FormData): Promise<FormState> {
  if (tooManyAttempts(await visitor())) return { error: "Too many tries. Wait a few minutes and try again." };
  const entry = await findCode(String(form.get("code") ?? ""));
  if (!entry) return { error: "That code didn't work. Check it and try again." };
  if (!entry.active) return { error: "That code has been turned off. Contact Parish Media Company." };
  await rememberParish(entry.code);
  redirect("/flyers");
}

// ---- admin session --------------------------------------------------------

export async function adminSignIn(_: FormState, form: FormData): Promise<FormState> {
  if (tooManyAttempts(`admin:${await visitor()}`)) return { error: "Too many tries. Wait a few minutes." };
  if (!passwordMatches(String(form.get("password") ?? ""))) return { error: "That password isn't right." };
  await startAdminSession();
  redirect("/flyers/admin");
}

export async function adminSignOut() {
  await endAdminSession();
  redirect("/flyers/admin");
}

// ---- templates ------------------------------------------------------------

// Shows the design before saving: its title and a small preview image.
export async function previewCanvaLink(link: string): Promise<{ error?: string; title?: string; preview?: string }> {
  await requireAdmin();
  try {
    const d = await readCanvaLink(link);
    const small = await sharp(d.image).resize(400, 500, { fit: "cover", position: "top" }).webp({ quality: 70 }).toBuffer();
    return { title: d.title, preview: `data:image/webp;base64,${small.toString("base64")}` };
  } catch (e) {
    return { error: linkError(e) };
  }
}

const list = (s: FormDataEntryValue | null) =>
  String(s ?? "")
    .split(/[,\n]/)
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);

export async function saveTemplate(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(form.get("id") ?? "");
  const canvaUrl = String(form.get("canvaUrl") ?? "").trim();
  const event = String(form.get("event") ?? "").trim();
  const designName = String(form.get("designName") ?? "").trim();
  const category = String(form.get("category") ?? "") as FlyerCategory;
  const description = String(form.get("description") ?? "").trim();
  const refreshImage = form.get("refreshImage") === "on";

  if (!canvaUrl) return { error: "Paste the Canva template link." };
  if (!event) return { error: "Add the event name, like \"Fish Fry\"." };
  if (!designName) return { error: "Give this design a short name, like \"Classic\"." };
  if (!flyerCategories.includes(category)) return { error: "Pick a category." };

  const existing = id ? (await listTemplates()).find((t) => t.id === id) : undefined;
  if (id && !existing) return { error: "That flyer no longer exists. Refresh the page." };

  const linkChanged = !existing || existing.canvaUrl !== canvaUrl;
  let thumbnail = existing?.thumbnail;
  const templateId = existing?.id ?? newTemplateId(event, designName);
  if (linkChanged || refreshImage || !thumbnail) {
    try {
      const d = await readCanvaLink(canvaUrl);
      thumbnail = await saveThumbnail(templateId, d.image);
    } catch (e) {
      return { error: linkError(e) };
    }
  }

  const now = new Date().toISOString();
  await upsertTemplate({
    id: templateId,
    event,
    designName,
    category,
    description,
    keywords: list(form.get("keywords")),
    canvaUrl: canvaUrl.startsWith("http") ? canvaUrl : `https://${canvaUrl}`,
    thumbnail,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  });
  refresh();
  return { message: existing ? `Saved changes to ${event} (${designName}).` : `Added ${event} (${designName}) to the library.` };
}

export async function removeTemplate(id: string) {
  await requireAdmin();
  await deleteTemplate(id);
  refresh();
}

// ---- access codes ---------------------------------------------------------

export async function createAccessCode(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const parish = String(form.get("parish") ?? "").trim();
  const wanted = String(form.get("code") ?? "").trim();
  if (!parish) return { error: "Add the parish name." };
  try {
    const entry = await addCode(parish, wanted || undefined);
    refresh();
    return { message: `${entry.parish} can now sign in with ${entry.code}.` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Couldn't add that code." };
  }
}

export async function setAccessCodeActive(code: string, active: boolean) {
  await requireAdmin();
  await updateCode(code, (c) => ({ ...c, active }));
  refresh();
}

export async function removeAccessCode(code: string) {
  await requireAdmin();
  await updateCode(code, () => null);
  refresh();
}
