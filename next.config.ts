import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/01984fab-10ca-1406-4ed2-048e284ef9cd',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
