"use client";

import Image from "next/image";
import { useActionState, useRef, useState, useTransition } from "react";
import { Check, Copy, Pencil, Trash2 } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import { flyerCategories } from "@/data/flyers";
import type { AccessCode, StoredTemplate } from "@/lib/flyers/store";
import {
  adminSignOut,
  createAccessCode,
  previewCanvaLink,
  removeAccessCode,
  removeTemplate,
  saveTemplate,
  setAccessCodeActive,
  type FormState,
} from "@/app/flyers/actions";

const field =
  "w-full rounded-lg bg-white px-4 py-2.5 text-[16px] text-ink ring-1 ring-ink/15 placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-lapis";
const label = "mb-1.5 block font-semibold text-ink";
const hint = "mt-1 text-sm text-ink/55";
const primaryBtn =
  "rounded-full bg-lapis px-6 py-3 font-semibold text-vellum shadow-md shadow-lapis/25 hover:bg-lapis-deep disabled:opacity-60";
const quietBtn = "rounded-full px-4 py-2 text-[15px] font-semibold text-lapis ring-1 ring-lapis/25 hover:bg-parchment";

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Never";

// ---- add / edit a flyer -----------------------------------------------------

function TemplateEditor({
  editing,
  events,
  onSaved,
  onCancel,
}: {
  editing?: StoredTemplate;
  events: string[];
  onSaved: (message: string) => void;
  onCancel: () => void;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(async (prev, form) => {
    const result = await saveTemplate(prev, form);
    if (!result.error) onSaved(result.message ?? "Saved.");
    return result;
  }, {});
  const [link, setLink] = useState(editing?.canvaUrl ?? "");
  const [designName, setDesignName] = useState(editing?.designName ?? "");
  const [preview, setPreview] = useState<string | undefined>(editing?.thumbnail);
  const [linkError, setLinkError] = useState<string>();
  const [checking, startChecking] = useTransition();

  const check = (value = link) => {
    if (!value.trim()) return;
    setLinkError(undefined);
    startChecking(async () => {
      const r = await previewCanvaLink(value);
      if (r.error) {
        setLinkError(r.error);
        setPreview(editing?.thumbnail);
        return;
      }
      setPreview(r.preview);
      if (!designName && r.title) setDesignName(r.title);
    });
  };

  return (
    <form action={action} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/10 sm:p-8">
      <h2 className="font-serif text-2xl font-semibold text-ink">{editing ? "Edit flyer" : "Add a flyer"}</h2>
      {editing && <input type="hidden" name="id" value={editing.id} />}

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_220px]">
        <div className="space-y-5">
          <div>
            <label htmlFor="canvaUrl" className={label}>
              Canva template link
            </label>
            <div className="flex gap-2">
              <input
                id="canvaUrl"
                name="canvaUrl"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                onPaste={(e) => {
                  const v = e.clipboardData.getData("text");
                  setTimeout(() => check(v), 0);
                }}
                placeholder="https://canva.link/..."
                className={field}
                required
              />
              <button type="button" onClick={() => check()} disabled={checking || !link.trim()} className={`${quietBtn} shrink-0`}>
                {checking ? "Checking..." : "Get design"}
              </button>
            </div>
            {linkError ? (
              <p className="mt-1.5 text-sm font-semibold text-rubric">{linkError}</p>
            ) : (
              <p className={hint}>In Canva: Share &gt; More &gt; Template link. Never use an edit link.</p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="event" className={label}>
                Event
              </label>
              <input
                id="event"
                name="event"
                list="flyer-events"
                defaultValue={editing?.event}
                placeholder="Fish Fry"
                className={field}
                required
              />
              <datalist id="flyer-events">
                {events.map((e) => (
                  <option key={e} value={e} />
                ))}
              </datalist>
              <p className={hint}>Use the same name for every design of one event.</p>
            </div>
            <div>
              <label htmlFor="designName" className={label}>
                Design name
              </label>
              <input
                id="designName"
                name="designName"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="Classic"
                className={field}
                required
              />
              <p className={hint}>Tells the designs of one event apart.</p>
            </div>
          </div>

          <div>
            <label htmlFor="category" className={label}>
              Category
            </label>
            <select id="category" name="category" defaultValue={editing?.category ?? ""} className={field} required>
              <option value="" disabled>
                Pick a category
              </option>
              {flyerCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="keywords" className={label}>
              Search words <span className="font-normal text-ink/50">(optional)</span>
            </label>
            <input
              id="keywords"
              name="keywords"
              defaultValue={editing?.keywords.join(", ")}
              placeholder="lent, friday, dinner, knights of columbus"
              className={field}
            />
            <p className={hint}>Other words staff might type, separated by commas.</p>
          </div>

          <div>
            <label htmlFor="description" className={label}>
              Short description <span className="font-normal text-ink/50">(optional)</span>
            </label>
            <input id="description" name="description" defaultValue={editing?.description} className={field} />
          </div>

          {editing && (
            <label className="flex items-center gap-2.5 text-[15px] text-ink/80">
              <input type="checkbox" name="refreshImage" className="h-4 w-4 accent-lapis" />
              Get a fresh image from Canva (if the design was changed)
            </label>
          )}
        </div>

        <div>
          <p className={label}>Preview</p>
          <div className="overflow-hidden rounded-xl bg-parchment ring-1 ring-ink/10">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="aspect-[4/5] w-full object-cover" />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center p-6 text-center text-sm text-ink/50">
                {checking ? "Getting the design..." : "Paste a link to see the flyer here."}
              </div>
            )}
          </div>
        </div>
      </div>

      {state.error && (
        <p role="alert" className="mt-6 font-semibold text-rubric">
          {state.error}
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={primaryBtn}>
          {pending ? "Saving..." : editing ? "Save changes" : "Add to library"}
        </button>
        {editing && (
          <button type="button" onClick={onCancel} className={quietBtn}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// ---- flyer list -------------------------------------------------------------

function TemplateList({ templates, onEdit }: { templates: StoredTemplate[]; onEdit: (t: StoredTemplate) => void }) {
  const [pending, start] = useTransition();
  if (!templates.length) return <p className="text-ink/60">No flyers yet. Add the first one above.</p>;

  const sorted = [...templates].sort((a, b) => a.event.localeCompare(b.event) || a.designName.localeCompare(b.designName));
  return (
    <ul className="divide-y divide-ink/10 rounded-2xl bg-white ring-1 ring-ink/10">
      {sorted.map((t) => (
        <li key={t.id} className="flex items-center gap-4 p-4">
          <div className="w-14 shrink-0 overflow-hidden rounded-md bg-parchment ring-1 ring-ink/10">
            {t.thumbnail && (
              <Image src={t.thumbnail} alt="" width={112} height={140} unoptimized className="aspect-[4/5] w-full object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink">
              {t.event} <span className="font-normal text-ink/55">· {t.designName}</span>
            </p>
            <p className="text-sm text-ink/55">{t.category}</p>
          </div>
          <button type="button" onClick={() => onEdit(t)} className="rounded-full p-2 text-ink/60 hover:bg-parchment hover:text-ink" aria-label={`Edit ${t.event} ${t.designName}`}>
            <Pencil className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (confirm(`Delete "${t.event} (${t.designName})" from the library?`)) start(() => removeTemplate(t.id));
            }}
            className="rounded-full p-2 text-ink/60 hover:bg-rubric/10 hover:text-rubric"
            aria-label={`Delete ${t.event} ${t.designName}`}
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </li>
      ))}
    </ul>
  );
}

// ---- parish access codes ------------------------------------------------------

function CopyInvite({ code }: { code: AccessCode }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const text = `Here's your parish's access to the Parish Flyer Library:\n${window.location.origin}/flyers\nAccess code: ${code.code}`;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-lapis ring-1 ring-lapis/25 hover:bg-parchment"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy invite"}
    </button>
  );
}

function CodesPanel({ codes }: { codes: AccessCode[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(createAccessCode, {});
  const [busy, start] = useTransition();
  return (
    <div className="space-y-8">
      <form action={action} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/10 sm:p-8">
        <h2 className="font-serif text-2xl font-semibold text-ink">Give a parish access</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_200px_auto] sm:items-end">
          <div>
            <label htmlFor="parish" className={label}>
              Parish name
            </label>
            <input id="parish" name="parish" placeholder="St. Mary in the Mountains" className={field} required />
          </div>
          <div>
            <label htmlFor="code" className={label}>
              Code <span className="font-normal text-ink/50">(optional)</span>
            </label>
            <input id="code" name="code" placeholder="Made for you" className={`${field} uppercase placeholder:normal-case`} />
          </div>
          <button type="submit" disabled={pending} className={primaryBtn}>
            {pending ? "Adding..." : "Add parish"}
          </button>
        </div>
        {state.error && <p className="mt-4 font-semibold text-rubric">{state.error}</p>}
        {state.message && <p className="mt-4 font-semibold text-[#2b7a52]">{state.message}</p>}
      </form>

      {codes.length === 0 ? (
        <p className="text-ink/60">No parishes have access yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-ink/10">
          <table className="w-full min-w-[640px] text-left text-[15px]">
            <thead className="text-ink/55">
              <tr>
                <th className="px-4 py-3 font-semibold">Parish</th>
                <th className="px-4 py-3 font-semibold">Code</th>
                <th className="px-4 py-3 font-semibold">Visits</th>
                <th className="px-4 py-3 font-semibold">Last visit</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {codes.map((c) => (
                <tr key={c.code} className={c.active ? "" : "text-ink/45"}>
                  <td className="px-4 py-3 font-semibold">
                    {c.parish}
                    {!c.active && <span className="ml-2 text-sm font-semibold text-rubric">Turned off</span>}
                  </td>
                  <td className="px-4 py-3 font-mono">{c.code}</td>
                  <td className="px-4 py-3">{c.visits}</td>
                  <td className="px-4 py-3">{fmtDate(c.lastVisitAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {c.active && <CopyInvite code={c} />}
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => start(() => setAccessCodeActive(c.code, !c.active))}
                        className="rounded-full px-3 py-1.5 text-sm font-semibold text-ink/70 ring-1 ring-ink/15 hover:bg-parchment"
                      >
                        {c.active ? "Turn off" : "Turn on"}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          if (confirm(`Delete ${c.parish}'s code (${c.code})? They'll lose access.`)) start(() => removeAccessCode(c.code));
                        }}
                        className="rounded-full p-2 text-ink/50 hover:bg-rubric/10 hover:text-rubric"
                        aria-label={`Delete ${c.parish}'s code`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---- page -------------------------------------------------------------------

export default function AdminPanel({
  templates,
  codes,
  storageIsTemporary,
}: {
  templates: StoredTemplate[];
  codes: AccessCode[];
  storageIsTemporary: boolean;
}) {
  const [tab, setTab] = useState<"flyers" | "access">("flyers");
  const [editing, setEditing] = useState<StoredTemplate>();
  const [editorKey, setEditorKey] = useState(0);
  const [notice, setNotice] = useState<string>();
  const top = useRef<HTMLDivElement>(null);
  const events = [...new Set(templates.map((t) => t.event))].sort();

  const resetEditor = (message?: string) => {
    setEditing(undefined);
    setEditorKey((k) => k + 1);
    setNotice(message);
  };

  return (
    <div className="min-h-screen bg-vellum">
      <header className="bg-ink text-vellum">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <BrandMark className="h-8 w-auto text-gilt-light" />
            <span className="leading-tight">
              <span className="block font-serif text-lg font-semibold">Manage the Flyer Library</span>
              <span className="block text-sm text-vellum/60">Parish Media Company team</span>
            </span>
          </div>
          <div className="flex items-center gap-5 text-[15px]">
            <a href="/flyers" className="font-semibold text-gilt-light hover:text-vellum">
              View library
            </a>
            <form action={adminSignOut}>
              <button type="submit" className="text-vellum/70 hover:text-vellum">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div ref={top} className="mx-auto max-w-5xl scroll-mt-4 px-5 py-8 sm:px-8 sm:py-10">
        {storageIsTemporary && (
          <p className="mb-6 rounded-xl bg-rubric/10 px-5 py-4 font-semibold text-rubric">
            Storage isn&apos;t permanent yet: attach a Railway volume to this service, or changes will be lost on the next
            deploy.
          </p>
        )}

        <div className="mb-8 flex gap-2">
          {(
            [
              ["flyers", `Flyers (${templates.length})`],
              ["access", `Parish access (${codes.length})`],
            ] as const
          ).map(([id, text]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-pressed={tab === id}
              className={`rounded-full px-5 py-2.5 font-semibold transition-colors ${
                tab === id ? "bg-lapis text-vellum" : "text-ink/70 ring-1 ring-ink/15 hover:bg-parchment"
              }`}
            >
              {text}
            </button>
          ))}
        </div>

        {tab === "flyers" ? (
          <div className="space-y-10">
            {notice && <p className="rounded-xl bg-[#2b7a52]/10 px-5 py-3 font-semibold text-[#2b7a52]">{notice}</p>}
            <TemplateEditor
              key={editing ? `edit-${editing.id}` : `new-${editorKey}`}
              editing={editing}
              events={events}
              onSaved={resetEditor}
              onCancel={() => resetEditor()}
            />
            <div>
              <h2 className="mb-4 font-serif text-2xl font-semibold text-ink">In the library</h2>
              <TemplateList
                templates={templates}
                onEdit={(t) => {
                  setNotice(undefined);
                  setEditing(t);
                  top.current?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            </div>
          </div>
        ) : (
          <CodesPanel codes={codes} />
        )}
      </div>
    </div>
  );
}
