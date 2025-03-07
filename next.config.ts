/** @type {import('next').NextConfig} */
const nextConfig = {
  redirect: async () => [
    {
      source: "/logout",
      destination: "/api/auth/logout",
      permanent: true,
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com", // Added this line
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
      },
      {
        protocol: "https",
        hostname: "wsnzrneyyqeitcjmgwxz.supabase.co",
      },
      {
        protocol: "https",
        hostname: "www.panoramaaudiovisual.com",
      },
    ],
  },
};

export default nextConfig;
