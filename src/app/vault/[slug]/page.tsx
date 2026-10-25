import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import BookACallButton from "@/components/BookACallButton";
import { getVaultItem, vaultItems, videoEmbedUrl } from "@/data/vault";

// Only video items get their own page here; books/links point elsewhere.
export async function generateStaticParams() {
  return vaultItems
    .filter((item) => item.kind === "video")
    .map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getVaultItem(slug);
  if (!item) return {};
  return {
    title: `${item.title} | The Vault`,
    description: item.description,
  };
}

export default async function VaultVideoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getVaultItem(slug);
  if (!item || item.kind !== "video") notFound();

  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col bg-[#0e1628] text-white">
        <section className="relative bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.18),transparent_60%)] px-6 pt-12 sm:pt-16">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/vault"
              className="font-mono text-xs uppercase tracking-[0.25em] text-gold/80 transition-colors hover:text-gold"
            >
              ← Back to The Vault
            </Link>
            <h1 className="mt-6 text-balance text-center font-serif text-3xl font-semibold text-white sm:text-4xl">
              {item.title}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-center text-white/80">
              {item.description}
            </p>
          </div>
          <div
            style={{ aspectRatio: item.video?.aspect ?? 16 / 9 }}
            className="relative mx-auto mt-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-navy shadow-2xl ring-1 ring-gold/40">
            {item.video ? (
              <iframe
                src={videoEmbedUrl(item.video)}
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                title={item.title}
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-full bg-gold/15 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-gold">
                  Video Coming Soon
                </span>
              </div>
            )}
          </div>
        </section>

        <section className="px-6 py-16 text-center sm:py-20">
          <div className="mx-auto max-w-xl">
            <h2 className="text-balance font-serif text-2xl font-semibold text-white sm:text-3xl">
              Rather have us handle it?
            </h2>
            <p className="mt-3 text-balance text-white/70">
              Book a free call and we&rsquo;ll walk through what growth could
              look like for your&nbsp;parish.
            </p>
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <BookACallButton className="rounded-full bg-gold px-8 py-3 font-semibold text-navy shadow-sm transition-colors hover:bg-gold/90">
                Book a Free Call
              </BookACallButton>
              <Link
                href="/vault"
                className="text-sm font-medium text-gold underline decoration-gold/50 decoration-2 underline-offset-4"
              >
                See everything in The Vault
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
