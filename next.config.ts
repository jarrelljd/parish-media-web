import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      {
        source: "/services/parish-growth",
        destination: "/parish",
        permanent: true,
      },
      {
        source: "/services/vocations",
        destination: "/vocations",
        permanent: true,
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
