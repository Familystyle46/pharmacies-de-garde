import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pharmacies de Garde en France | Trouvez une pharmacie ouverte",
    template: "%s",
  },
  description:
    "Trouvez la pharmacie de garde la plus proche, partout en France. Horaires, adresses et téléphones mis à jour.",
  openGraph: {
    title: "Pharmacies de Garde en France | Trouvez une pharmacie ouverte",
    description: "Trouvez la pharmacie de garde la plus proche, partout en France. Horaires, adresses et téléphones mis à jour.",
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
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
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
        <footer className="bg-gray-900 text-gray-400 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-white mb-4">Numéros d&apos;urgence</h3>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li><strong>15</strong> — SAMU</li>
                  <li><strong>17</strong> — Police</li>
                  <li><strong>18</strong> — Pompiers</li>
                  <li><strong>112</strong> — Urgence européenne</li>
                  <li><strong className="text-primary">3237</strong> — Pharmacies de garde</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-4">Liens utiles</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Accueil</Link></li>
                  <li><a href="https://www.ordre.pharmacien.fr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Ordre des Pharmaciens</a></li>
                  <li><a href="tel:3237" className="text-gray-400 hover:text-white transition-colors">3237 — Pharmacie de garde</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-4">Informations</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Service d&apos;information privé. Distinct des services officiels de l&apos;État et de l&apos;Ordre des Pharmaciens.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-4">Mentions légales</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Données à titre indicatif. Vérifiez les horaires auprès de la pharmacie ou du 3237.
                </p>
              </div>
            </div>
            <div className="pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} pharmacies-de-garde.net — Informations non contractuelles
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
