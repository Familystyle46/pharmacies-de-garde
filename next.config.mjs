/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/pharmacie-de-garde", destination: "/", permanent: true },
      { source: "/pharmacies-de-garde/:ville*", destination: "/pharmacie-de-garde/:ville*", permanent: true },
    ];
  },
};

export default nextConfig;
