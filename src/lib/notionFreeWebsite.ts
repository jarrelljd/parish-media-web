// Writes free-website requests into the Notion tracker ("Free Website
// Redesigns", under Resources - Parish Media → Marketing). Each request is
// one row; Joe approves by changing its Status, and the build/send jobs read
// and update the same rows. Server-only: needs NOTION_TOKEN (a Notion API
// connection that the database has been shared with). Only imported from
// server actions (src/app/actions.ts), so the token never reaches the browser.

import { isoDay } from "@/data/freeWebsite";

// The tracker's data source (Notion's newer API addresses rows by data source).
const DATA_SOURCE_ID = "423caa4f-6e87-818d-b816-000b01fcc2dd";
const NOTION_VERSION = "2025-09-03";

// The form says "Let us choose"; the tracker's Style column calls it "Our pick".
const STYLE_TO_NOTION: Record<string, string> = {
  Classic: "Classic",
  Cathedral: "Cathedral",
  Family: "Family",
  "Let us choose": "Our pick",
};
const ROLES = ["Pastor", "Parochial Vicar", "Deacon", "Communications", "Business Manager"];

export type FreeWebsiteRow = {
  organization: string;
  cityState: string;
  style: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  pastorName: string;
  pastorEmail: string;
  requestedOn: Date;
  promisedBy: Date;
};

const text = (s: string) => ({ rich_text: s ? [{ type: "text", text: { content: s.slice(0, 2000) } }] : [] });
const date = (d: Date) => ({ date: { start: d.toISOString() } });

async function notion(path: string, method: "POST" | "PATCH", body: unknown) {
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error("NOTION_TOKEN is not set");
  const res = await fetch(`https://api.notion.com/v1/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Notion ${method} ${path} responded ${res.status}: ${await res.text()}`);
  return res.json();
}

// Creates the row and returns its page ID (the thank-you page sends it back
// with the optional notes).
export async function createFreeWebsiteRow(r: FreeWebsiteRow): Promise<string> {
  const isPastor = r.role === "Pastor";
  const properties: Record<string, unknown> = {
    Parish: { title: [{ type: "text", text: { content: r.organization.slice(0, 200) } }] },
    Status: { status: { name: "Requested" } },
    // The form doesn't ask for the site (people quit to look it up); the
    // build job finds it from parish + city and fills in "Old website".
    "City/State": text(r.cityState),
    Pastor: text(r.pastorName),
    "Pastor email": { email: r.pastorEmail || null },
    // Blank when the pastor asked himself (his details are in Pastor above).
    "Requested by": text(isPastor ? "" : r.name),
    "Requester email": { email: isPastor ? null : r.email || null },
    Phone: { phone_number: r.phone || null },
    "Requested on": date(r.requestedOn),
    // A calendar day, not a time: "3 business days" (see deliveryDate).
    "Promised by": { date: { start: isoDay(r.promisedBy) } },
  };
  if (ROLES.includes(r.role)) properties.Role = { select: { name: r.role } };
  if (STYLE_TO_NOTION[r.style]) properties.Style = { select: { name: STYLE_TO_NOTION[r.style] } };

  const page = await notion("pages", "POST", {
    parent: { type: "data_source_id", data_source_id: DATA_SOURCE_ID },
    properties,
  });
  return page.id as string;
}

// The thank-you page's optional answers go into the row's Notes for the
// build job to read.
export async function addFreeWebsiteNotes(pageId: string, notes: string): Promise<void> {
  if (!/^[0-9a-f-]{32,36}$/i.test(pageId)) throw new Error("Invalid Notion page id");
  await notion(`pages/${pageId}`, "PATCH", { properties: { Notes: text(notes) } });
}
