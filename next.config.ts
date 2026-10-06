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
        source: "/free-audit/:path*",
        destination: "/free-consult",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
