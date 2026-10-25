import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The free book now lives in The Vault. Temporary (not permanent) so the
      // /free-guide landing page can be turned back on by deleting this.
      {
        source: "/free-guide",
        destination: "/vault",
        permanent: false,
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
