import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
