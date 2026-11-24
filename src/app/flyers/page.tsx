import type { Metadata } from "next";
import { after } from "next/server";
import { placeholderTemplates, SHOW_PLACEHOLDERS } from "@/data/flyers";
import { indexTemplates, searchFlyers } from "@/lib/flyerSearch";
import { commonSearches, seasonalSearches } from "@/lib/flyerSeasons";
import { libraryAccess } from "@/lib/flyers/auth";
import { listTemplates, recordVisit } from "@/lib/flyers/store";
import FlyerLibrary from "@/components/flyers/FlyerLibrary";
import AccessGate from "@/components/flyers/AccessGate";

export const metadata: Metadata = {
  title: "Parish Flyer Library | Parish Media Company",
  description: "Ready-made, editable Canva flyers for every parish event.",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const access = await libraryAccess();
  if (access.kind === "none") return <AccessGate turnedOff={access.reason === "turned-off"} />;
  if (access.kind === "parish") after(() => recordVisit(access.code.code));

  const stored = await listTemplates();
  const templates = [...stored, ...(SHOW_PLACEHOLDERS ? placeholderTemplates : [])];

  // Only suggest searches that have templates behind them.
  const index = indexTemplates(templates);
  const hasResults = (s: string) => searchFlyers(index, s, null).length > 0;
  const seasonal = seasonalSearches().filter(hasResults);
  const common = commonSearches.filter((s) => hasResults(s) && !seasonal.includes(s)).slice(0, 6);

  return (
    <FlyerLibrary
      templates={templates}
      seasonal={seasonal}
      common={common}
      parishName={access.kind === "parish" ? access.code.parish : undefined}
      isAdmin={access.kind === "admin"}
    />
  );
}
