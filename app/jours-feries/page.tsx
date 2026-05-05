import type { Metadata } from "next";
import Link from "next/link";
import { JOURS_FERIES } from "@/lib/jours-feries";
import { Breadcrumb } from "@/components/Breadcrumb";

const SITE_URL = "https://pharmacies-de-garde.net";

export const metadata: Metadata = {
  title: "Pharmacie de Garde les Jours Fériés en France | Liste 2026",
  description:
    "Trouvez une pharmacie de garde ouverte lors de chaque jour férié en France : Noël, 1er janvier, 14 juillet, 1er mai, Ascension, Pentecôte… Liste complète avec horaires.",
  openGraph: {
    title: "Pharmacie de Garde les Jours Fériés en France | Liste 2026",
    description:
      "Trouvez une pharmacie de garde ouverte lors de chaque jour férié en France. Liste complète des 11 jours fériés.",
  },
  alternates: {
    canonical: `${SITE_URL}/jours-feries`,
  },
};

const breadcrumbItems = [
  { name: "Accueil", href: "/" },
  { name: "Jours Fériés", href: undefined },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Jours Fériés", item: `${SITE_URL}/jours-feries` },
  ],
};

export default function JoursFeriesPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Hero */}
      <div
        className="py-12 px-4"
        style={{
          background: "linear-gradient(180deg, #14532d 0%, #166534 50%, #16a34a 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Pharmacies de Garde — Jours Fériés 2026
          </h1>
          <p className="text-white/90 text-lg">
            Retrouvez la pharmacie ouverte pour chacun des 11 jours fériés français
          </p>
        </div>
      </div>

      {/* Bannière urgence */}
      <div className="bg-red-600 py-2.5 px-4 flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          🚨 Urgence : appelez le <strong>3237</strong> pour être mis en relation immédiatement
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-gray-600 text-sm leading-relaxed mb-8">
          En France, les <strong>11 jours fériés officiels</strong> entraînent la fermeture de la plupart des pharmacies.
          Une <strong>pharmacie de garde</strong> assure la permanence dans chaque secteur. Sélectionnez un jour férié
          pour trouver la pharmacie ouverte dans votre ville, ou appelez le <strong>3237</strong>.
        </p>

        {/* Liste des jours fériés */}
        <div className="space-y-3">
          {JOURS_FERIES.map((jour) => (
            <Link
              key={jour.slug}
              href={`/jours-feries/${jour.slug}`}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-md border border-gray-100 transition-all hover:border-primary hover:shadow-lg hover:-translate-y-0.5 group"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl w-10 text-center flex-shrink-0">{jour.emoji}</span>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {jour.nomComplet}
                  </p>
                  <p className="text-sm text-gray-500">{jour.dateLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {jour.fixedLabel && (
                  <span className="hidden sm:inline text-xs text-gray-400 bg-gray-100 rounded-full px-2.5 py-1">
                    Fixe
                  </span>
                )}
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Info */}
        <section className="mt-10 rounded-xl bg-gray-50 border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Comment fonctionne la pharmacie de garde les jours fériés ?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Le <strong>service de garde pharmaceutique</strong> est organisé par le Conseil départemental de l&apos;Ordre
            des Pharmaciens. Un calendrier de rotation mensuel est établi afin qu&apos;au moins une pharmacie soit
            ouverte dans chaque secteur pendant les nuits, les dimanches et les jours fériés.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Pour connaître la pharmacie de garde dans votre ville :
          </p>
          <ul className="text-gray-600 text-sm leading-relaxed space-y-1.5 ml-4 list-disc mb-3">
            <li><strong>3237</strong> — service de permanence des soins, disponible 24h/24</li>
            <li>Notre site — recherchez votre ville ou département</li>
            <li>L&apos;affichage sur la porte de votre pharmacie habituelle</li>
          </ul>
          <p className="text-gray-600 text-sm leading-relaxed">
            En cas d&apos;urgence médicale grave : <strong>15</strong> (SAMU), <strong>18</strong> (Pompiers),
            <strong> 112</strong> (urgence européenne).
          </p>
        </section>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-hover transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
