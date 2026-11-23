import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProposal, proposals } from "@/data/proposals";
import ProposalPage from "@/components/proposal/ProposalPage";

// Only the proposals in src/data/proposals.ts exist; anything else 404s.
export const dynamicParams = false;

export async function generateStaticParams() {
  return proposals.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProposal(slug);
  if (!p) return {};
  return {
    title: `A plan for ${p.parish} | Parish Media Company`,
    description: `Prepared for ${p.preparedFor}.`,
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProposal(slug);
  if (!p) notFound();
  return <ProposalPage p={p} />;
}
