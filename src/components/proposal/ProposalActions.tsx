"use client";

import { useState } from "react";
import { FileDown, Link2, PenLine } from "lucide-react";

export default function ProposalActions({
  signUrl,
  parish,
}: {
  signUrl?: string;
  parish: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    const title = `Parish Media Company proposal for ${parish}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Share sheet dismissed or clipboard blocked: nothing to do.
    }
  }

  const secondary =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-vellum ring-1 ring-vellum/30 transition hover:bg-vellum/10";

  return (
    <div className="flex flex-col items-center gap-4 print:hidden">
      {signUrl ? (
        <a
          href={signUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-gilt-light px-9 py-4 text-lg font-semibold text-ink shadow-lg shadow-black/20 transition hover:brightness-105"
        >
          <PenLine aria-hidden="true" className="h-5 w-5" />
          Review and sign
        </a>
      ) : (
        <span className="inline-flex items-center gap-2 rounded-full bg-gilt-light/40 px-9 py-4 text-lg font-semibold text-ink/70">
          <PenLine aria-hidden="true" className="h-5 w-5" />
          Review and sign (link coming)
        </span>
      )}
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={share} className={secondary}>
          <Link2 aria-hidden="true" className="h-4 w-4" />
          {copied ? "Link copied" : "Share with your finance council"}
        </button>
        <button type="button" onClick={() => window.print()} className={secondary}>
          <FileDown aria-hidden="true" className="h-4 w-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
}
