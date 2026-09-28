/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Posters and images are served from Checkin.no's CDN.
    remotePatterns: [
      { protocol: "https", hostname: "app.checkin.no" },
      { protocol: "https", hostname: "checkin.no" },
      { protocol: "https", hostname: "**.checkin.no" },
    ],
  },
};

export default nextConfig;
