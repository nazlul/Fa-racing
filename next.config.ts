import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/01982bca-3c94-fb3e-3a5c-b325f6fa1961',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
