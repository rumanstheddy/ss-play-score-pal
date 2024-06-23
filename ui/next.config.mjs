/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/igdb/:path*",
        destination: "https://api.igdb.com/v4/:path*",
      },
    ];
  },
};

export default nextConfig;
