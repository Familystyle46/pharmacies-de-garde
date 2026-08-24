/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/pharmacie-de-garde", destination: "/", permanent: true },
      { source: "/pharmacies-de-garde/:ville*", destination: "/pharmacie-de-garde/:ville*", permanent: true },
      // Pharmacie Forum Santé Val d'Europe → Apothical (changement de nom
      // signalé par l'officine, ancienne dénomination depuis 6 ans).
      {
        source: "/pharmacie-de-garde/serris/pharmacie-forum-sante-val-deurope",
        destination: "/pharmacie-de-garde/serris/pharmacie-apothical-val-deurope",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
