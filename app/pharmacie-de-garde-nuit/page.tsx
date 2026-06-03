import type { Metadata } from "next";
import Link from "next/link";
import { TOP_VILLES } from "@/lib/jours-feries";

export const dynamic = "force-dynamic";

const SITE_URL = "https://pharmacies-de-garde.net";

const title = "Pharmacie de Garde de Nuit — Ouverte 24h/24 | Trouvez la Pharmacie de Nuit";
const description =
  "Trouvez une pharmacie de garde ouverte la nuit près de chez vous. Pharmacie de nuit disponible 24h/24 dans chaque secteur. Recherchez par ville ou appelez le 3237.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  alternates: { canonical: `${SITE_URL}/pharmacie-de-garde-nuit` },
};

export default function PharmaciNuitPage() {
  const now = new Date();
  const heure = now.getHours();
  const isNuit = heure >= 20 || heure < 8;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Y a-t-il une pharmacie ouverte la nuit ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui. Une pharmacie de garde de nuit est disponible dans chaque secteur, 24h/24, 7j/7. Elle peut délivrer les médicaments urgents, sur ordonnance ou sans ordonnance. Appelez le 3237 pour connaître la pharmacie de nuit la plus proche.",
        },
      },
      {
        "@type": "Question",
        name: "Comment trouver une pharmacie de nuit ouverte ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La méthode la plus rapide : appelez le 3237 (disponible 24h/24, 7j/7, 0,35 €/min). Ce numéro vous redirige vers la pharmacie de garde de nuit la plus proche. Vous pouvez aussi consulter notre liste par ville.",
        },
      },
      {
        "@type": "Question",
        name: "Quelle est la différence entre pharmacie de garde et pharmacie de nuit ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La pharmacie de garde est celle désignée par roulement par l'Ordre des Pharmaciens pour assurer la permanence pendant les horaires de fermeture habituels (nuits, dimanches, jours fériés). La pharmacie de nuit est simplement la pharmacie de garde pendant la nuit. Les deux termes désignent le même service.",
        },
      },
      {
        "@type": "Question",
        name: "La pharmacie de nuit peut-elle délivrer une ordonnance ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui. La pharmacie de garde de nuit peut délivrer les médicaments prescrits sur ordonnance, pour les traitements urgents. En cas d'urgence sans ordonnance, certains médicaments peuvent être dispensés à titre exceptionnel. Pour les urgences médicales graves, appelez le 15 (SAMU) ou le 18 (Pompiers).",
        },
      },
      {
        "@type": "Question",
        name: "Le 3237 fonctionne-t-il la nuit ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui, le 3237 est disponible 24h/24, 7j/7, y compris la nuit, les dimanches et jours fériés. C'est le moyen le plus rapide de trouver la pharmacie de garde de nuit dans votre secteur.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Pharmacie de garde de nuit", item: `${SITE_URL}/pharmacie-de-garde-nuit` },
    ],
  };

  // Quelques villes avec leurs quartiers/contexte nocturne
  const villesNuit = [
    { nom: "Paris", slug: "paris", note: "Pharmacie de nuit Paris" },
    { nom: "Marseille", slug: "marseille", note: "Pharmacie de nuit Marseille" },
    { nom: "Lyon", slug: "lyon", note: "Pharmacie de nuit Lyon" },
    { nom: "Toulouse", slug: "toulouse", note: "Pharmacie de nuit Toulouse" },
    { nom: "Nice", slug: "nice", note: "Pharmacie de nuit Nice" },
    { nom: "Bordeaux", slug: "bordeaux", note: "Pharmacie de nuit Bordeaux" },
    { nom: "Lille", slug: "lille", note: "Pharmacie de nuit Lille" },
    { nom: "Nantes", slug: "nantes", note: "Pharmacie de nuit Nantes" },
    { nom: "Strasbourg", slug: "strasbourg", note: "Pharmacie de nuit Strasbourg" },
    { nom: "Montpellier", slug: "montpellier", note: "Pharmacie de nuit Montpellier" },
    { nom: "Rennes", slug: "rennes", note: "Pharmacie de nuit Rennes" },
    { nom: "Grenoble", slug: "grenoble", note: "Pharmacie de nuit Grenoble" },
  ];

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Header */}
      <div
        className="py-12 px-4"
        style={{ background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)" }}
      >
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Pharmacie de garde de nuit</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            🌙 Pharmacie de Garde de Nuit
          </h1>
          <p className="text-white/90 text-lg">
            {isNuit
              ? "⚡ Disponible maintenant — trouvez la pharmacie de nuit ouverte près de chez vous"
              : "Pharmacie ouverte 24h/24 — disponible cette nuit dans votre secteur"}
          </p>
        </div>
      </div>

      {/* Bannière */}
      <div className="bg-red-600 py-2.5 px-4 flex items-center justify-center">
        <a href="tel:3237" className="text-white text-sm font-medium hover:underline">
          🚨 Urgence nuit : appelez le <strong>3237</strong> — disponible 24h/24
        </a>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

        {/* Alerte si c'est la nuit */}
        {isNuit && (
          <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-5 flex gap-3 items-start">
            <span className="text-2xl flex-shrink-0">🌙</span>
            <div>
              <p className="font-bold text-indigo-900 mb-1">Il est {heure}h — une pharmacie de nuit est disponible</p>
              <p className="text-indigo-700 text-sm">
                Sélectionnez votre ville ci-dessous ou appelez le <strong>3237</strong> pour connaître la pharmacie de nuit la plus proche.
              </p>
            </div>
          </div>
        )}

        {/* CTA 3237 */}
        <section className="rounded-2xl bg-red-50 border border-red-200 p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <p className="font-bold text-red-900 text-lg mb-1">Solution la plus rapide</p>
            <p className="text-red-700 text-sm">Appelez le 3237 → on vous donne l&apos;adresse de la pharmacie de nuit</p>
          </div>
          <a
            href="tel:3237"
            className="flex-shrink-0 bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors text-sm"
          >
            📞 Appeler le 3237
          </a>
        </section>

        {/* Villes principales de nuit */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pharmacie de nuit par ville
          </h2>
          <p className="text-gray-600 mb-6">
            Sélectionnez votre ville pour voir la pharmacie de garde de nuit disponible.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {villesNuit.map((ville) => (
              <Link
                key={ville.slug}
                href={`/pharmacie-de-garde/${ville.slug}`}
                className="group flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm border border-gray-100 transition-all hover:border-indigo-500 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors text-xs">
                  🌙
                </div>
                <span className="font-medium text-gray-900 group-hover:text-indigo-700 transition-colors text-sm truncate">
                  {ville.nom}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Autres villes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {TOP_VILLES.filter((v) => !villesNuit.find((n) => n.slug === v.slug)).map((ville) => (
                <Link
                  key={ville.slug}
                  href={`/pharmacie-de-garde/${ville.slug}`}
                  className="text-sm text-gray-600 hover:text-indigo-700 font-medium py-1 px-2 rounded hover:bg-indigo-50 transition-colors"
                >
                  {ville.nom}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Contenu éditorial */}
        <section className="rounded-xl bg-gray-50 border border-gray-200 p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Pharmacie de garde de nuit : comment ça fonctionne ?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              La <strong>pharmacie de garde de nuit</strong> (aussi appelée pharmacie de nuit) est une officine désignée par roulement par le Conseil départemental de l&apos;Ordre des Pharmaciens. Elle assure la permanence pharmaceutique pendant les nuits, généralement de 20h à 8h, ainsi que les dimanches et jours fériés.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Pour trouver la pharmacie de nuit dans votre secteur, la méthode la plus rapide est d&apos;appeler le <strong>3237</strong>. Ce numéro court vous met en relation immédiate avec le service de régulation pharmaceutique de votre département, disponible 24h/24, 7j/7.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Garde de nuit en semaine vs. le week-end
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              En semaine, la <strong>pharmacie de garde de nuit</strong> assure la permanence de 20h jusqu&apos;à l&apos;ouverture des pharmacies le lendemain matin (généralement 8h30 ou 9h). Le week-end et les jours fériés, la permanence couvre également la journée. Une même pharmacie peut être de garde toute la nuit, ou la permanence peut être assurée par une pharmacie différente selon les secteurs.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Pharmacie de garde de nuit vs SAMU
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              La pharmacie de garde de nuit est le bon recours pour obtenir des médicaments urgents (traitement chronique oublié, fièvre de l&apos;enfant, douleur aiguë). En revanche, pour les urgences médicales graves (douleur thoracique, difficultés respiratoires, perte de connaissance), appelez directement le <strong>15</strong> (SAMU), le <strong>18</strong> (Pompiers) ou le <strong>112</strong>.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Questions fréquentes — pharmacie de garde de nuit
          </h2>
          <div className="space-y-3">
            {faqSchema.mainEntity.map(({ name, acceptedAnswer }) => (
              <details key={name} className="rounded-lg border border-gray-200 bg-white p-4 group">
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {name}
                  <span className="ml-2 text-gray-400 flex-shrink-0">▾</span>
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">{acceptedAnswer.text}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Liens utiles */}
        <section className="border-t border-gray-200 pt-8 flex flex-wrap gap-4">
          <Link href="/pharmacie-ouverte-dimanche" className="text-sm text-green-700 font-medium hover:underline">
            → Pharmacie ouverte dimanche
          </Link>
          <Link href="/pharmacie-de-garde-aujourd-hui" className="text-sm text-green-700 font-medium hover:underline">
            → Pharmacie ouverte aujourd&apos;hui
          </Link>
          <Link href="/3237-pharmacie-de-garde" className="text-sm text-green-700 font-medium hover:underline">
            → Tout savoir sur le 3237
          </Link>
          <Link href="/" className="text-sm text-green-700 font-medium hover:underline">
            → Recherche par ville
          </Link>
        </section>

      </div>
    </div>
  );
}
