import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pharmacies de garde | Trouvez une pharmacie ouverte près de chez vous",
    template: "%s | Pharmacies de garde",
  },
  description:
    "Trouvez les pharmacies de garde près de chez vous. Horaires, adresses et téléphones des pharmacie de garde en France.",
  openGraph: {
    title: "Pharmacies de garde | Trouvez une pharmacie ouverte",
    description: "Horaires et adresses des pharmacies de garde en France.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-lg font-bold">
              +
            </div>
            <span className="font-extrabold text-base text-gray-900 font-serif">
              pharmacies-de-garde<span className="text-primary">.net</span>
            </span>
          </Link>
          <a
            href="tel:3237"
            className="flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold no-underline"
          >
            🚨 Urgence 3237
          </a>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center text-sm">
          <div className="font-semibold text-white mb-2">pharmacies-de-garde.net</div>
          <div className="mb-3">
            Service d&apos;information privé — Distinct des services officiels de l&apos;État et de l&apos;Ordre des Pharmaciens
          </div>
          <div className="flex justify-center gap-6 flex-wrap text-gray-500">
            <span>Urgences : 15 • 17 • 18 • 112</span>
            <span>Pharmacies de garde : 3237</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
