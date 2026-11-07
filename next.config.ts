import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Scorecard PDFs (src/lib/scorecardPdf.tsx) render on the server; keep
  // react-pdf out of the bundle so it loads like a normal Node package.
  serverExternalPackages: ["@react-pdf/renderer"],
  async redirects() {
    return [
      // The House of Studies was called The Vault, then The Hub; keep old
      // links (DMs, emails, posts) working.
      {
        source: "/:old(vault|hub)",
        destination: "/house-of-studies",
        permanent: true,
      },
      {
        source: "/:old(vault|hub)/:slug",
        destination: "/house-of-studies/:slug",
        permanent: true,
      },
      // St. Mary in the Mountains: the first-draft visit page now goes to the
      // redesigned landing page. Temporary (307) so it's easy to undo.
      {
        source: "/events/st-mary-mountains/visit",
        destination: "/events/st-mary-mountains/plan-your-visit",
        permanent: false,
      },
      {
        source: "/services/parish-growth",
        destination: "/parish",
        permanent: true,
      },
      {
        source: "/services/vocations",
        destination: "/",
        permanent: false,
      },
      // The Vocations page was retired; old links (ads, emails) go home.
      // Temporary (307) so it's easy to bring back.
      {
        source: "/vocations",
        destination: "/",
        permanent: false,
      },
      {
        source: "/testimonials",
        destination: "/results",
        permanent: true,
      },
      {
        source: "/book-a-call",
        destination: "/free-consult",
        permanent: true,
      },
      {
        source: "/free-triage",
        destination: "/free-consult",
        permanent: true,
      },
      {
        source: "/free-audit/:path*",
        destination: "/free-consult",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
