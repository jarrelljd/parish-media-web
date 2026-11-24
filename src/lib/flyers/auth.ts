// Who can see the Parish Flyer Library.
//
// - Parishes: enter an access code once; a signed cookie remembers it. The
//   code is checked on every visit, so turning a code off in the admin locks
//   that parish out right away.
// - Admin (our team): one shared password (FLYER_ADMIN_PASSWORD). Admins can
//   also view the library without a code.
//
// Cookies are signed with FLYER_SESSION_SECRET (falls back to the admin
// password) so they can't be forged.

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { findCode, type AccessCode } from "./store";

const ACCESS_COOKIE = "flyer_access";
const ADMIN_COOKIE = "flyer_admin";
const YEAR = 60 * 60 * 24 * 365;
const ADMIN_DAYS = 30;

export const adminConfigured = () => Boolean(process.env.FLYER_ADMIN_PASSWORD);

function secret() {
  const s = process.env.FLYER_SESSION_SECRET || process.env.FLYER_ADMIN_PASSWORD;
  if (!s) throw new Error("FLYER_ADMIN_PASSWORD is not set.");
  return s;
}

const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("base64url");

function verify(signed: string | undefined): string | null {
  if (!signed || !adminConfigured()) return null;
  const i = signed.lastIndexOf(".");
  if (i < 1) return null;
  const value = signed.slice(0, i);
  const a = Buffer.from(signed.slice(i + 1));
  const b = Buffer.from(sign(value));
  return a.length === b.length && timingSafeEqual(a, b) ? value : null;
}

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/flyers",
  maxAge,
});

export function passwordMatches(attempt: string) {
  const real = process.env.FLYER_ADMIN_PASSWORD;
  if (!real) return false;
  const a = createHmac("sha256", "cmp").update(attempt).digest();
  const b = createHmac("sha256", "cmp").update(real).digest();
  return timingSafeEqual(a, b);
}

export async function isAdmin() {
  const value = verify((await cookies()).get(ADMIN_COOKIE)?.value);
  if (!value?.startsWith("admin:")) return false;
  return Number(value.slice(6)) > Date.now();
}

export async function startAdminSession() {
  const expires = Date.now() + ADMIN_DAYS * 86_400_000;
  const value = `admin:${expires}`;
  (await cookies()).set(ADMIN_COOKIE, `${value}.${sign(value)}`, cookieOptions(ADMIN_DAYS * 86_400));
}

export async function endAdminSession() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/flyers" });
}

export async function rememberParish(code: string) {
  (await cookies()).set(ACCESS_COOKIE, `${code}.${sign(code)}`, cookieOptions(YEAR));
}

export type LibraryAccess =
  | { kind: "admin" }
  | { kind: "parish"; code: AccessCode }
  | { kind: "none"; reason?: "turned-off" };

export async function libraryAccess(): Promise<LibraryAccess> {
  if (await isAdmin()) return { kind: "admin" };
  const code = verify((await cookies()).get(ACCESS_COOKIE)?.value);
  if (!code) return { kind: "none" };
  const entry = await findCode(code);
  if (!entry) return { kind: "none" };
  if (!entry.active) return { kind: "none", reason: "turned-off" };
  return { kind: "parish", code: entry };
}

// Slows down guessing: at most 10 code attempts per visitor every 10 minutes.
const attempts = new Map<string, number[]>();
export function tooManyAttempts(visitor: string) {
  const now = Date.now();
  const recent = (attempts.get(visitor) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  attempts.set(visitor, recent);
  if (attempts.size > 5000) attempts.clear();
  return recent.length > 10;
}
